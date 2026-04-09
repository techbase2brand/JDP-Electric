import React, {useState, useMemo, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  StatusBar,
  SafeAreaView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  getAllLabor,
  getJobBluesheets,
  getJobOrders,
  searchProducts,
  submitBluesheetComplete,
} from '../config/apiConfig';
// import DateTimePicker from '@react-native-community/datetimepicker';
import {heightPercentageToDP, widthPercentageToDP} from '../utils';
import {spacings} from '../constants/Fonts';

// Ensure placeholders remain visible in system dark mode
TextInput.defaultProps = {
  ...(TextInput.defaultProps || {}),
  placeholderTextColor: '#9CA3AF',
};

/* ======================
   THEME
====================== */
const Colors = {
  primary: '#3B82F6',
  primaryLight: '#EBF4FF',
  white: '#FFFFFF',
};
const Spacing = {sm: 8, xs: 4};

/* ======================
   HELPERS
====================== */
const debounce = (fn, delay = 400) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
};

// 3661 -> "01:01:01"
const secondsToHMS = (sec = 0) => {
  const s = Math.max(0, Math.floor(sec));
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${h}:${m}:${ss}`;
};
// "01:30:00" -> 5400
const HMSToSeconds = (hms = '00:00:00') => {
  const [h, m, s] = (hms || '0:0:0').split(':').map(Number);
  if ([h, m, s].some(x => isNaN(x))) return 0;
  return h * 3600 + m * 60 + (s || 0);
};
// HMS -> "2.5" hours (string, trimmed)
const hmsToDecimalStr = (hms = '00:00:00') => {
  const totalSec = HMSToSeconds(hms);
  const hours = totalSec / 3600;
  // keep up to 2 decimals, drop trailing zeros
  const s = hours.toFixed(2);
  return s.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
};
// "8" or "2.5" or ".4" -> HH:MM:SS
const normalizeToHMS = val => {
  if (val == null) return '00:00:00';
  let str = String(val).trim();
  if (!str) return '00:00:00';

  // if "8h" etc -> strip 'h'
  if (/[hH]$/.test(str)) str = str.slice(0, -1);

  // reject colon entry for input (we still support just in case)
  const hmsMatch = /^(\d{1,2}):([0-5]?\d):([0-5]?\d)$/.test(str);
  if (hmsMatch) {
    const [h, m, s] = str.split(':').map(n => String(+n).padStart(2, '0'));
    return `${h}:${m}:${s}`;
  }

  // decimal hours -> HMS
  const n = parseFloat(str);
  if (!isNaN(n)) {
    const totalSec = Math.round(n * 3600);
    return secondsToHMS(totalSec);
  }

  // fallback
  return '00:00:00';
};

/** Storage keys (per job + date) */
const tsKey = (jobId, date) => `ts:${jobId}:${date}`;
// const submitKey = (jobId, date) => `ts:${jobId}:${date}:submitted`; // per-day submit lock (commented out)

/* ======================
   SEARCH DROPDOWN
====================== */
// const LabourSearchDropdown = ({
//   token,
//   selectedEmployee,
//   onSelectEmployee,
//   disabled = false,
//   existingEmployeeIds = [],
//   currentEditingEmployeeId = null,
// }) => {
//   const [open, setOpen] = useState(false);
//   const [query, setQuery] = useState('');
//   const [items, setItems] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setQuery(selectedEmployee?.label || '');
//   }, [selectedEmployee]);

//   const fetchPage = async (pageNo = 1) => {
//     if (!token) return;
//     try {
//       setLoading(true);
//       const res = await getAllLabor(pageNo, 10, token);
//       const data = res?.data?.data || [];
//       setItems(prev => (pageNo === 1 ? data : [...prev, ...data]));
//       setHasMore(Array.isArray(data) ? data.length > 0 : false);
//       setPage(pageNo);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     if (open) fetchPage(1);
//   }, [open]);

//   const debouncedSetQuery = useMemo(
//     () => debounce(txt => setQuery(txt), 300),
//     [],
//   );
//   const filtered = useMemo(() => {
//     if (!query?.trim()) return items;
//     const q = query.toLowerCase();
//     return items.filter(
//       it =>
//         it?.users?.full_name?.toLowerCase()?.includes(q) ||
//         it?.name?.toLowerCase()?.includes(q),
//     );
//   }, [items, query]);
//   console.log('queryqueryquery', query);

//   return (
//     <View style={{position: 'relative'}}>
//       <TextInput
//         style={styles.formInput}
//         placeholder="Search employee"
//         value={query}
//         onFocus={() => setOpen(true)}
//         onChangeText={txt => {
//           if (!open) setOpen(true);
//           debouncedSetQuery(txt);
//           setQuery(txt);
//         }}
//       />
//       {open && (
//         <View style={styles.dropdownSheet}>
//           <ScrollView
//             keyboardShouldPersistTaps="handled"
//             style={{maxHeight: 240}}>
//             {filtered?.map(emp => {
//               const label =
//                 emp?.users?.full_name || emp?.name || 'Unknown Employee';
//               const id = emp?.id || emp?._id || emp?.employee_id || '';
//               return (
//                 <TouchableOpacity
//                   key={String(id)}
//                   style={styles.dropdownItem}
//                   onPress={() => {
//                     onSelectEmployee({id, label, raw: emp});
//                     setQuery(label);
//                     setOpen(false);
//                   }}>
//                   <Text style={styles.dropdownItemText}>{label}</Text>
//                 </TouchableOpacity>
//               );
//             })}
//             {loading && (
//               <View style={styles.dropdownLoader}>
//                 <ActivityIndicator />
//               </View>
//             )}
//             {!loading && hasMore && (
//               <TouchableOpacity
//                 style={styles.dropdownLoadMore}
//                 onPress={() => fetchPage(page + 1)}>
//                 <Text style={styles.dropdownLoadMoreText}>Load more…</Text>
//               </TouchableOpacity>
//             )}
//           </ScrollView>
//           <TouchableOpacity
//             style={{alignItems: 'center', paddingVertical: 8}}
//             onPress={() => setOpen(false)}>
//             <Text style={{color: '#334155'}}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };
// REPLACE the LabourSearchDropdown definition with this code
const LabourSearchDropdown = ({
  token,
  selectedEmployee,
  onSelectEmployee,
  disabled = false,
  currentUser = null,
  includeLoggedInLeadLabor = false,
  existingEmployeeIds = [], // <-- array of employeeId strings that are already added for the day
  currentEditingEmployeeId = null, // <-- id of the employee currently being edited (if any)
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(selectedEmployee?.label || '');
  }, [selectedEmployee]);

  const fetchPage = useCallback(
    async (pageNo = 1) => {
      if (!token) return;
      try {
        setLoading(true);
        const res = await getAllLabor(pageNo, 10, token);
        const data = res?.data?.data || [];
        let mergedData = Array.isArray(data) ? data : [];

        if (includeLoggedInLeadLabor) {
          const leadId = currentUser?.lead_labor?.id;
          const leadName =
            currentUser?.full_name ||
            currentUser?.users?.full_name ||
            currentUser?.lead_labor?.users?.full_name ||
            currentUser?.lead_labor?.name ||
            'Logged In Lead Labor';

          if (leadId != null && leadId !== '') {
            const leadIdStr = String(leadId);
            const alreadyInList = mergedData.some(
              item => String(item?.id ?? item?._id ?? item?.employee_id ?? '') === leadIdStr,
            );

            if (!alreadyInList) {
              const selfLeadOption = {
                id: leadId,
                users: {full_name: leadName},
                _isCurrentLeadLabor: true,
              };
              mergedData =
                pageNo === 1 ? [selfLeadOption, ...mergedData] : mergedData;
            }
          }
        }

        console.log('[JobTimeSheet] getAllLabor page:', pageNo);
        console.log('[JobTimeSheet] getAllLabor full response:', res);
        console.log('[JobTimeSheet] getAllLabor parsed list:', mergedData);
        setItems(prev => (pageNo === 1 ? mergedData : [...prev, ...mergedData]));
        setHasMore(Array.isArray(data) ? data.length > 0 : false);
        setPage(pageNo);
      } catch (error) {
        console.log('[JobTimeSheet] getAllLabor error:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token, currentUser, includeLoggedInLeadLabor],
  );
  useEffect(() => {
    if (open) fetchPage(1);
  }, [open, fetchPage]);

  const debouncedSetQuery = useMemo(
    () => debounce(txt => setQuery(txt), 300),
    [],
  );
  const filtered = useMemo(() => {
    if (!query?.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      it =>
        it?.users?.full_name?.toLowerCase()?.includes(q) ||
        it?.name?.toLowerCase()?.includes(q),
    );
  }, [items, query]);

  return (
    <View style={{position: 'relative'}}>
      <TextInput
        style={styles.formInput}
        placeholder="Search employee"
        placeholderTextColor="#9CA3AF"
        value={query}
        editable={!disabled}
        onFocus={() => {
          if (!disabled) setOpen(true);
        }}
        onChangeText={txt => {
          if (!open && !disabled) setOpen(true);
          debouncedSetQuery(txt);
          setQuery(txt);
        }}
      />
      {open && !disabled && (
        <View style={styles.dropdownSheet}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={{maxHeight: 240}}>
            {filtered?.map(emp => {
              const label =
                emp?.users?.full_name || emp?.name || 'Unknown Employee';
              const id = emp?.id ?? emp?._id ?? emp?.employee_id ?? '';
              const idStr = String(id);
              const alreadyAdded = existingEmployeeIds
                .map(String)
                .includes(idStr);

              return (
                <TouchableOpacity
                  key={String(id)}
                  style={styles.dropdownItem}
                  onPress={() => {
                    // If this id is already added and it's NOT the one currently being edited, block selection
                    if (
                      alreadyAdded &&
                      String(currentEditingEmployeeId) !== idStr
                    ) {
                      Alert.alert(
                        'Error',
                        'This employee is already added for the day',
                      );
                      return;
                    }
                    onSelectEmployee({id, label, raw: emp});
                    setQuery(label);
                    setOpen(false);
                  }}>
                  <Text style={styles.dropdownItemText}>
                    {label}
                    {alreadyAdded && String(currentEditingEmployeeId) !== idStr
                      ? ' (already added)'
                      : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
            {loading && (
              <View style={styles.dropdownLoader}>
                <ActivityIndicator />
              </View>
            )}
            {!loading && hasMore && (
              <TouchableOpacity
                style={styles.dropdownLoadMore}
                onPress={() => fetchPage(page + 1)}>
                <Text style={styles.dropdownLoadMoreText}>Load more…</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
          <TouchableOpacity
            style={{alignItems: 'center', paddingVertical: 8}}
            onPress={() => setOpen(false)}>
            <Text style={{color: '#334155'}}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

/* ======================
   LABOUR MODAL
====================== */

// const LabourModal = ({
//   visible,
//   setShowAddLabour,
//   tempLabourData,
//   setTempLabourData,
//   handleSaveLabour,
//   token,
// }) => (
//   <Modal
//     visible={visible}
//     animationType="slide"
//     transparent
//     onRequestClose={() => {
//       setShowAddLabour(false);
//       setTempLabourData({});
//     }}>
//     <KeyboardAvoidingView
//       style={{flex: 1}}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}>
//       <TouchableWithoutFeedback
//         onPress={() => {
//           setShowAddLabour(false), Keyboard.dismiss;
//         }}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <ScrollView
//               contentContainerStyle={styles.modalBody}
//               keyboardShouldPersistTaps="handled">
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>
//                   {tempLabourData?.id &&
//                   String(tempLabourData.id).startsWith('labour-')
//                     ? 'Add Labour Entry'
//                     : 'Edit Labour Entry'}
//                 </Text>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setShowAddLabour(false);
//                     setTempLabourData({});
//                   }}>
//                   <Text style={styles.modalCloseButton}>✕</Text>
//                 </TouchableOpacity>
//               </View>

//               <View style={styles.formGroup}>
//                 <Text style={styles.formLabel}>Employee</Text>
//                 <LabourSearchDropdown
//                   token={token}
//                   selectedEmployee={
//                     tempLabourData.employeeId
//                       ? {
//                           id: tempLabourData.employeeId,
//                           label: tempLabourData.employeeName,
//                         }
//                       : null
//                   }
//                   onSelectEmployee={emp =>
//                     setTempLabourData(prev => ({
//                       ...prev,
//                       employeeName: emp.label,
//                       employeeId: emp.id,
//                       _selectedEmployee: emp.raw,
//                     }))
//                   }
//                   tempLabourData={tempLabourData}
//                 />
//               </View>

//               <View style={styles.formGroup}>
//                 <Text style={styles.formLabel}>
//                   Regular Hours (e.g., 8 or 2.5)
//                 </Text>
//                 <TextInput
//                   style={styles.formInput}
//                   keyboardType="decimal-pad"
//                   value={
//                     tempLabourData.regular_hours_input === '' ||
//                     tempLabourData.regular_hours_input === undefined
//                       ? ''
//                       : String(tempLabourData.regular_hours_input)
//                   }
//                   onChangeText={text =>
//                     setTempLabourData(prev => ({
//                       ...prev,
//                       regular_hours_input: text,
//                     }))
//                   }
//                 />
//               </View>
//             </ScrollView>

//             <View style={styles.modalFooter}>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.modalButtonSecondary]}
//                 onPress={() => {
//                   setShowAddLabour(false);
//                   setTempLabourData({});
//                 }}>
//                 <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.modalButtonPrimary]}
//                 onPress={handleSaveLabour}>
//                 <Text style={styles.modalButtonTextPrimary}>Save</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   </Modal>
// );
const LabourModal = ({
  visible,
  setShowAddLabour,
  tempLabourData,
  setTempLabourData,
  handleSaveLabour,
  timesheetData,
  token,
  profileUser,
  isLeadLabor,
  showTimePicker,
  setShowTimePicker,
}) => {
  const [durParts, setDurParts] = useState({h: '00', m: '00', s: '00'});
  const hListRef = useRef(null);
  const mListRef = useRef(null);
  const sListRef = useRef(null);
  const existingIds = (timesheetData?.labourEntries || []).map(e =>
    String(e.employeeId || ''),
  );
  const currentEditId = tempLabourData?.employeeId
    ? String(tempLabourData.employeeId)
    : null;
  // determine if this is an existing (editable) entry or a new one
  const isNewEntry =
    String(tempLabourData?.id || '').startsWith('labour-') ||
    !tempLabourData?.id;

  /* OLD: DateTimePicker init sync (HH:MM only) – kept for reference
  useEffect(() => {
    // sync picker initial value from hms / input
    if (tempLabourData?.regular_hours_hms) {
      const [hh, mm] = (tempLabourData.regular_hours_hms || '00:00:00')
        .split(':')
        .map(Number);
      const d = new Date();
      d.setHours(hh || 0, mm || 0, 0, 0);
      setPickerValue(d);
    } else if (tempLabourData?.regular_hours_input) {
      const hms = normalizeToHMS(tempLabourData.regular_hours_input);
      const [hh, mm] = hms.split(':').map(Number);
      const d = new Date();
      d.setHours(hh || 0, mm || 0, 0, 0);
      setPickerValue(d);
    } else {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      setPickerValue(d);
    }
  }, [
    visible,
    tempLabourData?.regular_hours_hms,
    tempLabourData?.regular_hours_input,
  ]);
  */

  /* OLD: DateTimePicker handler (clock-time HH:MM only) – kept for reference
  const onChangePicker = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false); // auto-hide on android
    }
    if (event?.type === 'dismissed') return;
    const d = selectedDate || pickerValue;
    if (!d) return;
    const h = d.getHours();
    const m = d.getMinutes();
    const hStr = String(h).padStart(2, '0');
    const mStr = String(m).padStart(2, '0');
    const hms = `${hStr}:${mStr}:00`;
    setPickerValue(d);
    setTempLabourData(prev => ({
      ...prev,
      regular_hours_hms: hms,
      regular_hours_input: hms,
    }));
  };
  */

  // ---------- Duration picker (HH:MM:SS) ----------
  const pad2 = n => String(n).padStart(2, '0');
  const clampInt = (val, min, max) => {
    const n = parseInt(String(val || '').replace(/[^\d]/g, ''), 10);
    if (!Number.isFinite(n)) return min;
    return Math.min(max, Math.max(min, n));
  };
  const ITEM_H = 44;
  const hoursData = useMemo(() => Array.from({length: 24}, (_, i) => i), []);
  const minsData = useMemo(() => Array.from({length: 60}, (_, i) => i), []);
  const secsData = minsData;
  const currentHms = useMemo(() => {
    const base =
      tempLabourData?.regular_hours_hms ||
      normalizeToHMS(tempLabourData?.regular_hours_input) ||
      '00:00:00';
    return normalizeToHMS(base);
  }, [tempLabourData?.regular_hours_hms, tempLabourData?.regular_hours_input]);

  useEffect(() => {
    if (!showTimePicker) return;
    const [hh, mm, ss] = (currentHms || '00:00:00').split(':');
    setDurParts({h: pad2(hh || 0), m: pad2(mm || 0), s: pad2(ss || 0)});
    // scroll wheels to current values (after modal opens)
    const h = clampInt(hh, 0, 23);
    const m = clampInt(mm, 0, 59);
    const s = clampInt(ss, 0, 59);
    setTimeout(() => {
      try {
        hListRef.current?.scrollToOffset({offset: h * ITEM_H, animated: false});
        mListRef.current?.scrollToOffset({offset: m * ITEM_H, animated: false});
        sListRef.current?.scrollToOffset({offset: s * ITEM_H, animated: false});
      } catch {}
    }, 0);
  }, [showTimePicker, currentHms]);

  const applyDuration = () => {
    const hh = pad2(clampInt(durParts.h, 0, 23));
    const mm = pad2(clampInt(durParts.m, 0, 59));
    const ss = pad2(clampInt(durParts.s, 0, 59));
    const hms = `${hh}:${mm}:${ss}`;
    setTempLabourData(prev => ({
      ...prev,
      regular_hours_hms: hms,
      regular_hours_input: hms,
    }));
    setShowTimePicker(false);
  };

  const handleSaveWithValidation = () => {
    const time = tempLabourData?.regular_hours_hms;

    if (!time || time === '00:00:00') {
      Alert.alert('Validation', 'Please select labour working time.');
      return;
    }

    handleSaveLabour(); // original save function
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={() => {
        setShowAddLabour(false);
        setTempLabourData({});
      }}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}>
        <TouchableWithoutFeedback
          onPress={() => {
            setShowAddLabour(false);
            Keyboard.dismiss();
          }}>
          <View style={styles.materialModalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView
                contentContainerStyle={styles.modalBody}
                keyboardShouldPersistTaps="handled">
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {tempLabourData?.id &&
                    String(tempLabourData.id).startsWith('labour-')
                      ? 'Add Labour Entry'
                      : 'Edit Labour Entry'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowAddLabour(false);
                      setTempLabourData({});
                      setShowTimePicker(false);
                    }}>
                    <Text style={styles.modalCloseButton}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Employee</Text>

                  {isNewEntry ? (
                    // new -> allow search dropdown
                    <LabourSearchDropdown
                      token={token}
                      currentUser={profileUser}
                      includeLoggedInLeadLabor={isLeadLabor}
                      selectedEmployee={
                        tempLabourData.employeeId
                          ? {
                              id: tempLabourData.employeeId,
                              label: tempLabourData.employeeName,
                            }
                          : null
                      }
                      onSelectEmployee={emp =>
                        setTempLabourData(prev => ({
                          ...prev,
                          employeeName: emp.label,
                          employeeId: emp.id,
                          role: emp?.raw?._isCurrentLeadLabor ? 'Lead Labor' : 'Labor',
                          _selectedEmployee: emp.raw,
                        }))
                      }
                      tempLabourData={tempLabourData}
                      disabled={false}
                      existingEmployeeIds={existingIds}
                      currentEditingEmployeeId={currentEditId}
                    />
                  ) : (
                    // existing -> show read-only TextInput (react-only)
                    <TextInput
                      style={styles.formInput}
                      value={tempLabourData.employeeName || ''}
                      editable={false} // read-only for edit case
                    />
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Regular Hours (HH:MM:SS)</Text>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setShowTimePicker(true)}>
                    <View pointerEvents="none">
                      <TextInput
                        style={styles.formInput}
                        editable={false}
                        value={
                          tempLabourData.regular_hours_hms
                            ? tempLabourData.regular_hours_hms.slice(0, 9)
                            : tempLabourData.regular_hours_input
                            ? normalizeToHMS(
                                tempLabourData.regular_hours_input,
                              ).slice(0, 9)
                            : ''
                        }
                        placeholder="Select hours, minutes & seconds"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                  </TouchableOpacity>

                  {/* OLD: Clock-time picker (HH:MM only) – kept for reference
                  {showTimePicker && (
                    <DateTimePicker
                      value={pickerValue || new Date()}
                      mode="time"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      is24Hour={true}
                      locale="en_GB"
                      onChange={onChangePicker}
                    />
                  )}
                  */}

                  {/* NEW: Duration picker (HH:MM:SS) */}
                  <Modal
                    visible={showTimePicker}
                    animationType="fade"
                    transparent
                    onRequestClose={() => setShowTimePicker(false)}>
                    {/* Backdrop press closes; content stays scrollable */}
                    <View style={styles.modalOverlay}>
                      <Pressable
                        style={[
                          StyleSheet.absoluteFill,
                          {zIndex: 0, elevation: 0},
                        ]}
                        onPress={() => setShowTimePicker(false)}
                      />
                      <View
                        pointerEvents="auto"
                        style={[
                          styles.modalContent,
                          {zIndex: 1, elevation: 4, position: 'relative'},
                        ]}>
                        <View style={styles.modalHeader}>
                          <Text style={styles.modalTitle}>
                            Set duration (HH:MM:SS)
                          </Text>
                          <TouchableOpacity
                            onPress={() => setShowTimePicker(false)}>
                            <Text style={styles.modalCloseButton}>✕</Text>
                          </TouchableOpacity>
                        </View>

                        {/* OLD (typed inputs) – kept for reference
                            <View style={{paddingHorizontal: 16, paddingTop: 8}}>
                              <Text style={styles.formLabel}>Hours</Text>
                              <TextInput
                                style={styles.formInput}
                                keyboardType="number-pad"
                                value={String(durParts.h)}
                                onChangeText={t =>
                                  setDurParts(p => ({...p, h: t}))
                                }
                                placeholder="00"
                              />
                              <Text style={styles.formLabel}>Minutes</Text>
                              <TextInput
                                style={styles.formInput}
                                keyboardType="number-pad"
                                value={String(durParts.m)}
                                onChangeText={t =>
                                  setDurParts(p => ({...p, m: t}))
                                }
                                placeholder="00"
                              />
                              <Text style={styles.formLabel}>Seconds</Text>
                              <TextInput
                                style={styles.formInput}
                                keyboardType="number-pad"
                                value={String(durParts.s)}
                                onChangeText={t =>
                                  setDurParts(p => ({...p, s: t}))
                                }
                                placeholder="00"
                              />
                            </View>
                            */}

                        {/* NEW: Wheel duration picker (scroll only) */}
                        <View style={{paddingHorizontal: 16, paddingTop: 12}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}>
                            <Text style={[styles.formLabel, {flex: 1}]}>
                              Hours
                            </Text>
                            <Text style={[styles.formLabel, {flex: 1}]}>
                              Minutes
                            </Text>
                            <Text style={[styles.formLabel, {flex: 1}]}>
                              Seconds
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              gap: 12,
                              marginTop: 6,
                            }}>
                            {/** Hours wheel */}
                            <View style={{flex: 1, height: ITEM_H * 5}}>
                              <View
                                pointerEvents="none"
                                style={{
                                  position: 'absolute',
                                  top: ITEM_H * 2,
                                  left: 0,
                                  right: 0,
                                  height: ITEM_H,
                                  borderRadius: 10,
                                  backgroundColor: '#EBF4FF',
                                }}
                              />
                              <FlatList
                                ref={hListRef}
                                data={hoursData}
                                keyExtractor={i => `h-${i}`}
                                showsVerticalScrollIndicator={false}
                                nestedScrollEnabled
                                scrollEnabled
                                snapToInterval={ITEM_H}
                                decelerationRate="fast"
                                disableIntervalMomentum
                                snapToAlignment="start"
                                getItemLayout={(_, index) => ({
                                  length: ITEM_H,
                                  offset: ITEM_H * index,
                                  index,
                                })}
                                contentContainerStyle={{
                                  paddingVertical: ITEM_H * 2,
                                }}
                                // helps when inside other scrollables on Android
                                scrollEventThrottle={16}
                                keyboardShouldPersistTaps="handled"
                                onMomentumScrollEnd={e => {
                                  const idx = Math.round(
                                    e.nativeEvent.contentOffset.y / ITEM_H,
                                  );
                                  const v = hoursData[idx] ?? 0;
                                  setDurParts(p => ({...p, h: pad2(v)}));
                                }}
                                renderItem={({item}) => (
                                  <View
                                    style={{
                                      height: ITEM_H,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: 18,
                                        color: '#0F172A',
                                        fontWeight: '600',
                                      }}>
                                      {pad2(item)}
                                    </Text>
                                  </View>
                                )}
                              />
                            </View>

                            {/** Minutes wheel */}
                            <View style={{flex: 1, height: ITEM_H * 5}}>
                              <View
                                pointerEvents="none"
                                style={{
                                  position: 'absolute',
                                  top: ITEM_H * 2,
                                  left: 0,
                                  right: 0,
                                  height: ITEM_H,
                                  borderRadius: 10,
                                  backgroundColor: '#EBF4FF',
                                }}
                              />
                              <FlatList
                                ref={mListRef}
                                data={minsData}
                                keyExtractor={i => `m-${i}`}
                                showsVerticalScrollIndicator={false}
                                nestedScrollEnabled
                                scrollEnabled
                                snapToInterval={ITEM_H}
                                decelerationRate="fast"
                                disableIntervalMomentum
                                snapToAlignment="start"
                                getItemLayout={(_, index) => ({
                                  length: ITEM_H,
                                  offset: ITEM_H * index,
                                  index,
                                })}
                                contentContainerStyle={{
                                  paddingVertical: ITEM_H * 2,
                                }}
                                scrollEventThrottle={16}
                                keyboardShouldPersistTaps="handled"
                                onMomentumScrollEnd={e => {
                                  const idx = Math.round(
                                    e.nativeEvent.contentOffset.y / ITEM_H,
                                  );
                                  const v = minsData[idx] ?? 0;
                                  setDurParts(p => ({...p, m: pad2(v)}));
                                }}
                                renderItem={({item}) => (
                                  <View
                                    style={{
                                      height: ITEM_H,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: 18,
                                        color: '#0F172A',
                                        fontWeight: '600',
                                      }}>
                                      {pad2(item)}
                                    </Text>
                                  </View>
                                )}
                              />
                            </View>

                            {/** Seconds wheel */}
                            <View style={{flex: 1, height: ITEM_H * 5}}>
                              <View
                                pointerEvents="none"
                                style={{
                                  position: 'absolute',
                                  top: ITEM_H * 2,
                                  left: 0,
                                  right: 0,
                                  height: ITEM_H,
                                  borderRadius: 10,
                                  backgroundColor: '#EBF4FF',
                                }}
                              />
                              <FlatList
                                ref={sListRef}
                                data={secsData}
                                keyExtractor={i => `s-${i}`}
                                showsVerticalScrollIndicator={false}
                                nestedScrollEnabled
                                scrollEnabled
                                snapToInterval={ITEM_H}
                                decelerationRate="fast"
                                disableIntervalMomentum
                                snapToAlignment="start"
                                getItemLayout={(_, index) => ({
                                  length: ITEM_H,
                                  offset: ITEM_H * index,
                                  index,
                                })}
                                contentContainerStyle={{
                                  paddingVertical: ITEM_H * 2,
                                }}
                                scrollEventThrottle={16}
                                keyboardShouldPersistTaps="handled"
                                onMomentumScrollEnd={e => {
                                  const idx = Math.round(
                                    e.nativeEvent.contentOffset.y / ITEM_H,
                                  );
                                  const v = secsData[idx] ?? 0;
                                  setDurParts(p => ({...p, s: pad2(v)}));
                                }}
                                renderItem={({item}) => (
                                  <View
                                    style={{
                                      height: ITEM_H,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: 18,
                                        color: '#0F172A',
                                        fontWeight: '600',
                                      }}>
                                      {pad2(item)}
                                    </Text>
                                  </View>
                                )}
                              />
                            </View>
                          </View>

                          <View style={{marginTop: 10, alignItems: 'center'}}>
                            <Text style={{color: '#334155'}}>
                              Selected: {durParts.h}:{durParts.m}:{durParts.s}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.modalFooter}>
                          <TouchableOpacity
                            style={[
                              styles.modalButton,
                              styles.modalButtonSecondary,
                            ]}
                            onPress={() => setShowTimePicker(false)}>
                            <Text style={styles.modalButtonTextSecondary}>
                              Cancel
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.modalButton,
                              styles.modalButtonPrimary,
                            ]}
                            onPress={applyDuration}>
                            <Text style={styles.modalButtonTextPrimary}>
                              Set
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Modal>
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={() => {
                    setShowAddLabour(false);
                    setTempLabourData({});
                  }}>
                  <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={handleSaveWithValidation}>
                  <Text style={styles.modalButtonTextPrimary}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const _toYMD = val => {
  if (typeof val === 'string' && val.length >= 10) {
    // handle "2025-10-27" or "2025-10-27T12:09:13..."
    return val.slice(0, 10);
  }
  const d = new Date(val);
  if (isNaN(d)) return '';
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
};

const sameDay = (a, b) => _toYMD(a) === _toYMD(b);

const normalizeProductSearchList = res => {
  if (Array.isArray(res)) {
    return res;
  }
  const raw =
    res?.data?.products ??
    res?.products ??
    (Array.isArray(res?.data) ? res.data : null);
  return Array.isArray(raw) ? raw : [];
};

/* ======================
   MATERIAL MODAL
====================== */
const MaterialModal = ({
  visible,
  onClose,
  tempMaterialData,
  setTempMaterialData,
  handleSaveMaterial,
  setShowAddMaterial,
  token,
}) => {
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [materialSearchLoading, setMaterialSearchLoading] = useState(false);
  const lastIssuedQueryRef = useRef('');

  const runProductSearch = useCallback(
    async q => {
      const trimmed = (q || '').trim();
      if (!trimmed || !token) {
        setProductSuggestions([]);
        setMaterialSearchLoading(false);
        lastIssuedQueryRef.current = '';
        return;
      }
      lastIssuedQueryRef.current = trimmed;
      setMaterialSearchLoading(true);
      try {
        const res = await searchProducts(trimmed, token);
        console.log('[JobTimeSheet] searchProducts raw response:', res);
        const list = normalizeProductSearchList(res);
        console.log('[JobTimeSheet] searchProducts list:', list);
        if (lastIssuedQueryRef.current === trimmed) {
          setProductSuggestions(list);
        }
      } catch (e) {
        console.log('[JobTimeSheet] searchProducts error:', e?.message || e);
        if (lastIssuedQueryRef.current === trimmed) {
          setProductSuggestions([]);
        }
      } finally {
        if (lastIssuedQueryRef.current === trimmed) {
          setMaterialSearchLoading(false);
        }
      }
    },
    [token],
  );

  const debouncedProductSearch = useMemo(
    () => debounce(q => runProductSearch(q), 400),
    [runProductSearch],
  );

  useEffect(() => {
    if (!visible) {
      setProductSuggestions([]);
      lastIssuedQueryRef.current = '';
    }
  }, [visible]);

  const applySelectedProduct = useCallback(
    product => {
      const cost = Number(
        product?.unit_cost ??
          product?.jdp_price ??
          product?.estimated_price ??
          0,
      );
      const unitStr =
        product?.unit != null && String(product.unit).trim() !== ''
          ? String(product.unit).trim()
          : 'pieces';
      const emptyQty = v => v === '' || v === undefined || v === null;
      setTempMaterialData(prev => ({
        ...prev,
        name: product?.product_name || prev.name || '',
        unit: unitStr,
        unitCost: cost > 0 ? cost : prev.unitCost ?? '',
        productId: product?.id != null ? product.id : null,
        jdpPrice: Number(product?.jdp_price) || 0,
        estimatedUnitCost: Number(product?.estimated_price) || 0,
        totalOrdered: emptyQty(prev.totalOrdered) ? 1 : prev.totalOrdered,
        amountUsed: emptyQty(prev.amountUsed) ? 1 : prev.amountUsed,
      }));
      setProductSuggestions([]);
      Keyboard.dismiss();
    },
    [setTempMaterialData],
  );

  const handleSaveWithValidation = () => {
    const {name, unit, totalOrdered, amountUsed, unitCost} = tempMaterialData;

    const total = parseFloat(totalOrdered);
    const used = parseFloat(amountUsed);
    const cost = parseFloat(unitCost);

    if (!name || name.trim() === '') {
      Alert.alert('Validation', 'Please enter material name');
      return;
    }

    if (!unit || unit.trim() === '') {
      Alert.alert('Validation', 'Please enter unit');
      return;
    }

    if (isNaN(total) || total <= 0) {
      Alert.alert('Validation', 'Total ordered must be greater than 0');
      return;
    }

    if (isNaN(used) || used <= 0) {
      Alert.alert('Validation', 'Quantity used must be greater than 0');
      return;
    }

    if (used > total) {
      Alert.alert('Validation', 'Quantity used cannot exceed total ordered');
      return;
    }

    if (isNaN(cost) || cost <= 0) {
      Alert.alert('Validation', 'Unit cost must be greater than 0');
      return;
    }

    handleSaveMaterial();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
        <TouchableWithoutFeedback
          onPress={() => {
            setShowAddMaterial(false);
            Keyboard.dismiss();
          }}>
          <View style={styles.modalOverlay}>
            <View style={styles.materialModalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {tempMaterialData?.id &&
                  String(tempMaterialData.id).startsWith('material-')
                    ? 'Add Material Entry'
                    : 'Edit Material Entry'}
                </Text>

                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.modalCloseButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modalBody}
                contentContainerStyle={{paddingBottom: 24}}
                keyboardShouldPersistTaps="handled">
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Material Name</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Enter material name"
                    placeholderTextColor="#9CA3AF"
                    value={tempMaterialData.name || ''}
                    onChangeText={text => {
                      setTempMaterialData(prev => ({
                        ...prev,
                        name: text,
                        productId: null,
                      }));
                      debouncedProductSearch(text);
                    }}
                  />
                  {materialSearchLoading ? (
                    <View style={styles.materialSearchHint}>
                      <ActivityIndicator size="small" color={Colors.primary} />
                      <Text
                        style={[
                          styles.materialSearchHintText,
                          styles.materialSearchHintTextSpacing,
                        ]}>
                        Searching products…
                      </Text>
                    </View>
                  ) : null}
                  {productSuggestions.length > 0 ? (
                    <View style={styles.materialSuggestionList}>
                      {productSuggestions.map((p, idx) => {
                        const key = String(
                          p?.id ?? p?.product_id ?? p?.jdp_sku ?? `s-${idx}`,
                        );
                        return (
                          <TouchableOpacity
                            key={key}
                            style={styles.materialSuggestionRow}
                            activeOpacity={0.7}
                            onPress={() => applySelectedProduct(p)}>
                            <Text
                              style={styles.materialSuggestionName}
                              numberOfLines={2}>
                              {p?.product_name || '—'}
                            </Text>
                            <Text style={styles.materialSuggestionMeta}>
                              {[
                                p?.unit != null && String(p.unit).trim() !== ''
                                  ? p.unit
                                  : 'pieces',
                                p?.unit_cost != null
                                  ? ` · $${Number(p.unit_cost)}`
                                  : p?.jdp_price != null
                                  ? ` · $${Number(p.jdp_price)}`
                                  : null,
                              ]
                                .filter(Boolean)
                                .join('')}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ) : null}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Unit</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="pieces, feet, etc."
                    placeholderTextColor="#9CA3AF"
                    value={tempMaterialData.unit || ''}
                    onChangeText={text =>
                      setTempMaterialData(prev => ({...prev, unit: text}))
                    }
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Total Ordered</Text>
                  <TextInput
                    style={styles.formInput}
                    keyboardType="numeric"
                    value={
                      tempMaterialData.totalOrdered === undefined
                        ? ''
                        : String(tempMaterialData.totalOrdered)
                    }
                    onChangeText={text =>
                      setTempMaterialData(prev => ({
                        ...prev,
                        totalOrdered: text === '' ? '' : parseFloat(text) || 0,
                      }))
                    }
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Quantity Used</Text>
                  <TextInput
                    style={styles.formInput}
                    keyboardType="numeric"
                    value={
                      tempMaterialData.amountUsed === undefined
                        ? ''
                        : String(tempMaterialData.amountUsed)
                    }
                    onChangeText={text =>
                      setTempMaterialData(prev => ({
                        ...prev,
                        amountUsed: text === '' ? '' : parseFloat(text) || 0,
                      }))
                    }
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Unit Cost</Text>
                  <TextInput
                    style={styles.formInput}
                    keyboardType="numeric"
                    value={
                      tempMaterialData.unitCost === undefined
                        ? ''
                        : String(tempMaterialData.unitCost)
                    }
                    onChangeText={text =>
                      setTempMaterialData(prev => ({
                        ...prev,
                        unitCost: text === '' ? '' : parseFloat(text) || 0,
                      }))
                    }
                  />
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={() => {
                    setShowAddMaterial(false);
                    setTempMaterialData({});
                  }}>
                  <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={handleSaveWithValidation}>
                  <Text style={styles.modalButtonTextPrimary}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};
/* ======================
   MAIN SCREEN
====================== */
const JobTimesheet = ({navigation, route, user}) => {
  const token = useSelector(state => state.user.token);
  const userFromStore = useSelector(state => state.user.user);
  const profileUser = user ?? userFromStore;
  const isLeadLabor =
    profileUser?.management_type === 'lead_labor' ||
    profileUser?.role === 'Lead Labor';
  const routeParams = route?.params || {};
  const jobId = route?.params?.job?.id;
  const jobFromRoute = routeParams?.data || routeParams?.job || {};
  const timesheetFromRoute = routeParams?.timesheet || {};
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showAddLabour, setShowAddLabour] = useState(false);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [blueloading, setBlueLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const todayISO = new Date().toISOString().split('T')[0];
  const [error, setError] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // base state
  const [timesheetData, setTimesheetData] = useState(() => ({
    id: `timesheet-${jobFromRoute?.id ?? 'new'}-${
      timesheetFromRoute.date || todayISO
    }`,
    jobId: jobFromRoute?.id || timesheetFromRoute.jobId || 'unknown',
    date: timesheetFromRoute.date || todayISO,
    status: 'draft',
    jobNotes: '',
    labourEntries: [],
    materialEntries: [],
    additionalCharges: [],
    jobImages: [],
  }));
  const [showTimePicker, setShowTimePicker] = useState(false);

  // current jobId used EVERYWHERE
  const currentJobId = React.useMemo(
    () => (jobFromRoute?.id != null ? jobFromRoute.id : timesheetData.jobId),
    [jobFromRoute?.id, timesheetData.jobId],
  );
  const [bluesheetData, setBulesheetData] = useState({
    labor_timesheets: [],
    orders: [],
  });
  const existingIds = (timesheetData?.labourEntries || []).map(e =>
    String(e.employeeId || ''),
  );
  const currentEditId = tempLabourData?.employeeId
    ? String(tempLabourData.employeeId)
    : null;

  useEffect(() => {
    const fetchTimesheet = async () => {
      try {
        const [bluesheetRes, ordersRes] = await Promise.all([
          getJobBluesheets(currentJobId, token),
          getJobOrders(currentJobId, token).catch(() => ({data: {orders: []}})),
        ]);
        const bluesheet = bluesheetRes?.data ?? {};
        console.log('blueshhet:::,', bluesheet);

        const jobOrders = ordersRes?.data?.orders ?? ordersRes?.orders ?? [];
        setBulesheetData({
          ...bluesheet,
          orders: bluesheet.orders?.length ? bluesheet.orders : jobOrders,
        });
      } catch (error) {
        console.log('Error fetching timesheet:', error);
        setBulesheetData({}); // fail-safe
      }
    };

    if (currentJobId && token) {
      fetchTimesheet();
    }
  }, [currentJobId, timesheetData.date, token]);

  // storage key per job+date
  const storageKeyRef = useRef(tsKey(currentJobId, timesheetData?.date));

  const loadFromStorageOrSeed = useCallback(
    async (job, date) => {
      try {
        const jobId = job?.id ?? currentJobId;
        const key = tsKey(jobId, date);

        // --- Build fresh data from route (always compute) ---
        const bs = bluesheetData || {};
        console.log('bs::::', bs);

        const routeLabour = (
          bs?.labor_timesheets ||
          bs?.data?.labor_timesheets ||
          []
        )
          .filter(e => {
            if (e?.date) return sameDay(e.date, date);
            if (e?.created_at) return sameDay(e.created_at, date);
            return false;
          })
          .map(entry => {
            const name =
              entry?.lead_labor?.users?.full_name ??
              entry?.labor?.users?.full_name ??
              entry?.lead_labour?.user?.full_name ??
              'Unknown';

            const empId =
              entry?.lead_labor?.id ??
              entry?.labor?.id ??
              entry?.lead_labour?.id ??
              '';

            const rawWork = entry?.work_activity ?? '00:00:00';
            const hms = /^[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}$/.test(rawWork)
              ? rawWork
              : normalizeToHMS(rawWork);

            const isLead = !!(entry?.lead_labor || entry?.lead_labour);

            return {
              id: String(entry.id),
              employeeName: name,
              employeeId: empId,
              role: isLead ? 'Lead Labor' : 'Labor',
              // Keep HMS from timer/API as-is to avoid rounding seconds to 0.00h → 00:00:00
              regular_hours_input: hms,
              regular_hours_hms: hms,
              regularHours: hms,
              base_hours_hms: hms,
              overtimeHours: 0,
              regularRate: isLead ? 35 : 28,
              overtimeRate: isLead ? 52.5 : 42,
              _source: 'route',
            };
          });

        const routeMaterials = [];
        const orders = bs?.orders || bs?.data?.orders || [];
        console.log(
          '[JobTimeSheet] BlueSheet orders for materials seed:',
          Array.isArray(orders) ? orders.length : 0,
          orders,
        );
        orders.forEach(order => {
          const orderDate = order?.order_date || order?.created_at;
          if (!orderDate || !sameDay(orderDate, date)) return;

          (order?.items || []).forEach((it, idx) => {
            const jdpPrice = Number(it?.product?.jdp_price ?? 0) || 0;
            const estimatedUnitCost =
              Number(it?.product?.estimated_price ?? 0) || 0;
            const qty =
              Number(it?.quantity) || Number(it?.total_price ? 1 : 0) || 0;
            routeMaterials.push({
              id: `${order.id}_${it.id ?? idx}`,
              name: it?.product?.product_name || it?.product_name || '',
              unit: it?.product?.unit || it?.unit || 'pieces',
              totalOrdered: qty,
              amountUsed: Number(it?.quantity) || 0,
              // unitCost:
              //   Number(
              //     it?.product?.jdp_price ??
              //       it?.unit_cost ??
              //       it?.product?.estimated_price ??
              //       0,
              //   ) || 0,
              unitCost: Number(it?.product?.unit_cost) || 0,
              jdpPrice,
              estimatedUnitCost,
              estimatedCost: Number((estimatedUnitCost * qty).toFixed(2)) || 0,
              productId: it?.product?.id ?? it?.product_id ?? null,
              supplierOrderId: order?.order_number || order?.order_no || '',
              returnToWarehouse: false,
              _source: 'route',
            });
          });
        });

        // --- Try load from storage ---
        const savedRaw = await AsyncStorage.getItem(key);
        if (savedRaw) {
          const saved = JSON.parse(savedRaw) || {};
          const savedLabour = Array.isArray(saved.labourEntries)
            ? saved.labourEntries
            : [];
          const savedMaterials = Array.isArray(saved.materialEntries)
            ? saved.materialEntries
            : [];
          console.log(
            '[JobTimeSheet] Loaded materialEntries from AsyncStorage:',
            savedMaterials,
          );

          // Merge by id: saved has priority; add any new route items not in saved
          const mergeById = (a = [], b = []) => {
            const map = new Map(a.map(x => [String(x.id), x]));
            b.forEach(y => {
              const k = String(y.id);
              if (!map.has(k)) map.set(k, y);
              else {
                // optional: fill blanks from route (e.g., hours empty in saved)
                const cur = map.get(k);
                const merged = {
                  ...y,
                  ...cur,
                  // ensure hours fields are consistent
                  base_hours_hms:
                    cur?.base_hours_hms ??
                    y?.base_hours_hms ??
                    normalizeToHMS(
                      cur?.regular_hours_hms ??
                        cur?.regularHours ??
                        y?.regular_hours_hms ??
                        y?.regularHours ??
                        '00:00:00',
                    ),
                  regular_hours_input:
                    cur?.regular_hours_input ??
                    hmsToDecimalStr(
                      normalizeToHMS(
                        cur?.regular_hours_hms ??
                          cur?.regularHours ??
                          y?.regular_hours_hms ??
                          y?.regularHours ??
                          '00:00:00',
                      ),
                    ),
                  regular_hours_hms: normalizeToHMS(
                    cur?.regular_hours_input ??
                      cur?.regular_hours_hms ??
                      cur?.regularHours ??
                      y?.regular_hours_hms ??
                      y?.regularHours ??
                      '00:00:00',
                  ),
                  regularHours: undefined, // keep single source of truth
                };
                map.set(k, merged);
              }
            });
            return Array.from(map.values());
          };

          const mergedLabour = mergeById(savedLabour, routeLabour);
          const mergedMaterials = mergeById(savedMaterials, routeMaterials);

          // set state
          setTimesheetData(prev => ({
            ...prev,
            jobId,
            date,
            jobNotes: saved?.jobNotes ?? prev.jobNotes,
            labourEntries: mergedLabour,
            materialEntries: mergedMaterials,
          }));

          // also persist the merged snapshot so next open pe fresh mile
          await AsyncStorage.setItem(
            key,
            JSON.stringify({
              jobNotes: saved?.jobNotes,
              labourEntries: mergedLabour,
              materialEntries: mergedMaterials,
            }),
          );

          return; // done
        }

        // --- No storage: seed from route and persist ---
        const toStore = {
          // jobNotes: 'Main electrical work and installation',
          labourEntries: routeLabour,
          materialEntries: routeMaterials,
        };
        console.log(
          '[JobTimeSheet] Seeding materialEntries from BlueSheet only:',
          routeMaterials,
        );
        await AsyncStorage.setItem(key, JSON.stringify(toStore));

        setTimesheetData(prev => ({
          ...prev,
          jobId,
          date,
          jobNotes: toStore.jobNotes,
          labourEntries: toStore.labourEntries,
          materialEntries: toStore.materialEntries,
          jobImages: toStore.jobImages || [],
        }));
      } catch (e) {
        // soft-fail: keep current state
      }
    },
    [bluesheetData, currentJobId],
  );
  useEffect(() => {
    storageKeyRef.current = tsKey(currentJobId, timesheetData.date);
    if (bluesheetData) {
      loadFromStorageOrSeed(bluesheetData, timesheetData.date);
    }
  }, [currentJobId, timesheetData.date, bluesheetData, loadFromStorageOrSeed]);

  // per-day submit lock (commented out – re-enable to restrict one submit per job per day)
  // const [isSubmittedForDay, setIsSubmittedForDay] = useState(false);
  // const refreshSubmitLock = async (jobId, date) => {
  //   try {
  //     const v = await AsyncStorage.getItem(submitKey(jobId, date));
  //     setIsSubmittedForDay(v === 'true');
  //   } catch {
  //     setIsSubmittedForDay(false);
  //   }
  // };
  // useEffect(() => {
  //   refreshSubmitLock(currentJobId, timesheetData.date);
  // }, [currentJobId, timesheetData.date]);

  // persist local edits
  const persistLocalState = async next => {
    const toStore = {
      jobNotes: next.jobNotes,
      labourEntries: (next.labourEntries || []).map(l => ({
        ...l,
        // keep both: input decimal + computed HMS for compatibility
        regular_hours_input: l?.regular_hours_input ?? '',
        base_hours_hms: l?.base_hours_hms,
        regular_hours_hms: normalizeToHMS(
          l?.regular_hours_input ??
            l?.regular_hours_hms ??
            l?.regularHours ??
            '00:00:00',
        ),
      })),
      materialEntries: (next.materialEntries || []).map(m => ({...m})),
      jobImages: (next.jobImages || []).map(img => ({
        uri: img?.uri,
        type: img?.type,
        fileName: img?.fileName,
        base64: img?.base64,
      })),
    };
    try {
      await AsyncStorage.setItem(
        storageKeyRef.current,
        JSON.stringify(toStore),
      );
    } catch {}
  };

  // notes debounced
  const persistNotesDebounced = useMemo(
    () =>
      debounce(text => {
        const next = {...timesheetData, jobNotes: text};
        persistLocalState(next);
      }, 500),
    [timesheetData],
  );

  // -------- Job Images (Optional) --------
  const [imagePickerLoading, setImagePickerLoading] = useState(false);

  const normalizePickedImages = assets =>
    (assets || []).map(a => ({
      uri: a?.uri,
      type: a?.type,
      fileName: a?.fileName,
      base64: a?.base64,
    }));

  const addJobImages = assets => {
    const picked = normalizePickedImages(assets).filter(i => i?.uri);
    if (!picked.length) return;

    setTimesheetData(prev => {
      const next = {
        ...prev,
        jobImages: [...(prev.jobImages || []), ...picked],
      };
      persistLocalState(next);
      return next;
    });
  };

  const handlePickCamera = () => {
    if (timesheetData.status === 'approved') return; // read-only
    setImagePickerLoading(true);
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.8,
        maxWidth: 1200,
        maxHeight: 1200,
      },
      response => {
        setImagePickerLoading(false);
        if (response?.didCancel) return;
        if (response?.errorMessage) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        addJobImages(response?.assets || []);
      },
    );
  };

  const handlePickGallery = () => {
    if (timesheetData.status === 'approved') return; // read-only
    setImagePickerLoading(true);
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 0, // 0 or undefined => no explicit limit (platform may still cap)
        includeBase64: true,
        quality: 0.8,
        maxWidth: 1200,
        maxHeight: 1200,
      },
      response => {
        setImagePickerLoading(false);
        if (response?.didCancel) return;
        if (response?.errorMessage) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        addJobImages(response?.assets || []);
      },
    );
  };

  const handleRemoveJobImage = idx => {
    if (timesheetData.status === 'approved') return;
    setTimesheetData(prev => {
      const nextImages = (prev.jobImages || []).filter((_, i) => i !== idx);
      const next = {...prev, jobImages: nextImages};
      persistLocalState(next);
      return next;
    });
  };

  const handleOpenMaterialSlipPicker = () => {
    if (timesheetData.status === 'approved') return;
    if (imagePickerLoading) return;

    Alert.alert('Add Material Slip', 'Choose image source', [
      {text: 'Camera', onPress: handlePickCamera},
      {text: 'Photo', onPress: handlePickGallery},
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  // payload mappers (HH:MM:SS out)
  const localLaborToApi = l => {
    const isLead = (l.role || 'labor')
      .toString()
      .toLowerCase()
      .includes('lead');

    const hms = normalizeToHMS(
      l?.regular_hours_input ??
        l?.regular_hours_hms ??
        l?.regularHours ??
        '00:00:00',
    );
    const mainHms = normalizeToHMS(
      l?.base_hours_hms ??
        l?.regular_hours_hms ??
        l?.regularHours ??
        '00:00:00',
    );

    return {
      ...(isLead
        ? {
            lead_labor_id: isNaN(Number(l.employeeId))
              ? l.employeeId
              : Number(l.employeeId),
          }
        : {
            labor_id: isNaN(Number(l.employeeId))
              ? l.employeeId
              : Number(l.employeeId),
          }),
      employee_name: l.employeeName,
      role: isLead ? 'lead_labor' : 'labor',
      labor_hours: mainHms,
      regular_hours: hms, // <— HH:MM:SS
      overtime_hours: '00:00:00',
      // hourly_rate: Number(l.regularRate || 0),
    };
  };

  const normalizeApiProductId = productId => {
    if (productId === null || productId === undefined) {
      return undefined;
    }
    const s = String(productId).trim();
    if (!s) {
      return undefined;
    }
    const n = Number(s);
    if (!Number.isNaN(n) && Number.isFinite(n)) {
      // Only real catalog numeric ids (search selection). Custom / local rows omit product_id.
      return n > 0 ? n : undefined;
    }
    return undefined;
  };

  const localMaterialToApi = m => {
    const normalizedProductId = normalizeApiProductId(m.productId);
    console.log('m:::::::', m);

    const qty = Number(m.totalOrdered) || 0;
    const unitCost = Number(m.unitCost) || 0;
    const jdpPrice = Number(m.jdpPrice ?? m.jdp_price) || 0;
    const estimatedUnitCost =
      Number(m.estimatedUnitCost ?? m.estimatedPrice ?? m.estimated_price) || 0;
    const estimatedCost =
      Number(
        m.estimatedCost ??
          (estimatedUnitCost ? estimatedUnitCost * qty : unitCost * qty),
      ) || 0;

    const payload = {
      material_name: m.name,
      quantity: qty,
      unit: m.unit || 'pieces',
      total_ordered: qty,
      material_used: Number(m.amountUsed) || 0,
      supplier_order_id: m.supplierOrderId || null,
      return_to_warehouse: !!m.returnToWarehouse,
      unit_cost: unitCost,
      jdp_price: jdpPrice,
      estimated_price: estimatedCost,
    };

    // Only include product_id when it's a real catalog product
    if (normalizedProductId !== undefined) {
      payload.product_id = normalizedProductId;
    }

    // Log JDP price even if backend doesn't accept it
    console.log('[JobTimeSheet] material payload (log-only extras):', {
      ...payload,
      jdp_price: jdpPrice,
      estimated_unit_cost: estimatedUnitCost,
    });

    return payload;
  };

  const buildBluesheetPayload = () => {
    const additionalCharges = (timesheetData.additionalCharges || []).reduce(
      (sum, c) => sum + (Number(c.amount) || 0),
      0,
    );
    const laborTimesheetIds = (timesheetData.labourEntries || [])
      .map(entry => Number(entry?.id))
      .filter(id => !isNaN(id));

    console.log(' labor_timesheet_ids: laborTimesheetIds,', laborTimesheetIds);

    const payload = {
      job_id: isNaN(Number(currentJobId)) ? currentJobId : Number(currentJobId),
      date: timesheetData.date,
      status: 'pending',
      notes: timesheetData.jobNotes || '',
      additional_charges: Number(additionalCharges.toFixed(2)),
      images: isLeadLabor
        ? (timesheetData.jobImages || []).slice(0, 5).map(img => ({
            type: img?.type,
            fileName: img?.fileName,
            base64: img?.base64,
          }))
        : [],
      labor_timesheet_ids: laborTimesheetIds,
      labor_entries: (timesheetData.labourEntries || []).map(localLaborToApi),
      material_entries: isLeadLabor
        ? (timesheetData.materialEntries || []).map(localMaterialToApi)
        : [],
    };

    console.log('FINAL_PAYLOAD_TO_API::', JSON.stringify(payload, null, 2));
    return payload;
  };

  // temp states
  const [tempLabourData, setTempLabourData] = useState({});
  const [tempMaterialData, setTempMaterialData] = useState({});
  const [loading, setLoading] = useState(false);

  // was: const locked = isSubmittedForDay; (per-day lock commented out)
  const locked = timesheetData.status === 'approved';

  /* ========= LABOUR CRUD ========= */
  const handleAddLabour = () => {
    if (locked) return;
    setTempLabourData({
      id: `labour-${Date.now()}`,
      employeeName: '',
      employeeId: '',
      role: 'Labor',
      // input: decimal string, default empty
      regular_hours_input: '',
      // compatibility fields (not used by input)
      regular_hours_hms: '00:00:00',
      regularHours: '00:00:00',
      base_hours_hms: '00:00:00',
      overtimeHours: 0,
      regularRate: 28,
      overtimeRate: 42,
      notes: '',
    });
    setShowAddLabour(true);
  };

  const handleSaveLabour = () => {
    if (!tempLabourData.employeeName || !tempLabourData.employeeId) {
      Alert.alert('Error', 'Please select an employee');
      return;
    }
    const hms = normalizeToHMS(
      tempLabourData?.regular_hours_input ??
        tempLabourData?.regular_hours_hms ??
        tempLabourData?.regularHours,
    );
    const normalized = {
      ...tempLabourData,
      regular_hours_input:
        tempLabourData?.regular_hours_input ?? hmsToDecimalStr(hms),
      regular_hours_hms: hms,
      regularHours: hms,
      base_hours_hms:
        tempLabourData?.base_hours_hms ??
        tempLabourData?.regular_hours_hms ??
        tempLabourData?.regularHours ??
        '00:00:00',
    };
    setShowTimePicker(false);
    setTimesheetData(prev => {
      const exists = prev.labourEntries.some(
        e => String(e.id) === String(normalized.id),
      );
      const next = {
        ...prev,
        labourEntries: exists
          ? prev.labourEntries.map(e =>
              String(e.id) === String(normalized.id) ? normalized : e,
            )
          : [...prev.labourEntries, normalized],
      };
      persistLocalState(next);
      return next;
    });
    setShowAddLabour(false);
    setTempLabourData({});
  };

  const handleAddMaterial = () => {
    if (locked) {
      return;
    }
    setTempMaterialData({
      id: `material-${Date.now()}`,
      name: '',
      unit: '',
      totalOrdered: '',
      amountUsed: '',
      unitCost: '',
      productId: null,
      supplierOrderId: '',
      returnToWarehouse: false,
    });
    setShowAddMaterial(true);
  };

  const handleSaveMaterial = () => {
    if (!tempMaterialData.name) {
      Alert.alert('Error', 'Please fill in material name');
      return;
    }
    const newEntry = {...tempMaterialData};
    setTimesheetData(prev => {
      const exists = prev.materialEntries.some(
        e => String(e.id) === String(newEntry.id),
      );
      const next = {
        ...prev,
        materialEntries: exists
          ? prev.materialEntries.map(e =>
              String(e.id) === String(newEntry.id) ? newEntry : e,
            )
          : [...prev.materialEntries, newEntry],
      };
      persistLocalState(next);
      return next;
    });
    setShowAddMaterial(false);
    setTempMaterialData({});
  };

  const handleSubmitForApproval = async () => {
    try {
      if (locked) {
        Alert.alert('Already Submitted');
        return;
      }

      const payload = buildBluesheetPayload();
      if (!payload.labor_entries.length && !payload.material_entries.length) {
        Alert.alert(
          'Empty',
          'No entries found. Please add labor or material details before submitting.',
        );
        return;
      }

      setLoading(true);

      const response = await submitBluesheetComplete(payload, token);

      // await AsyncStorage.setItem(submitKey(currentJobId, timesheetData.date), 'true');
      // setIsSubmittedForDay(true);

      await AsyncStorage.removeItem(tsKey(currentJobId, timesheetData.date));

      setTimesheetData(prev => ({
        ...prev,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        rejectionReason: undefined,
      }));

      // Show success alert with API response message
      Alert.alert(
        'Success',
        response?.message || 'Bluesheet submitted successfully',
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('BlueSheet', {screen: 'TimeSheetScreen'}),
          },
        ],
      );
    } catch (err) {
      const msg = err?.message || 'Failed to submit bluesheet';

      if (
        /already.*submitted|duplicate/i.test(
          String(err?.message || err?.error || ''),
        )
      ) {
        // await AsyncStorage.setItem(submitKey(currentJobId, timesheetData.date), 'true');
        // setIsSubmittedForDay(true);
        // await AsyncStorage.removeItem(tsKey(currentJobId, timesheetData.date));
        // setTimesheetData(prev => ({ ...prev, status: 'submitted', submittedAt: prev.submittedAt || new Date().toISOString() }));
        Alert.alert('Already Submitted', msg);
        return;
      }

      Alert.alert('Error', msg);
    } finally {
      setLoading(false); // stop loading in all cases
    }
  };

  /* ========= UI HELPERS ========= */
  const handleBack = () => navigation.goBack();
  const formatDate = d =>
    new Date(d).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const canEdit = () =>
    // !isSubmittedForDay &&
    timesheetData.status === 'draft' ||
    (profileUser?.role === 'Lead Labor' && timesheetData.status === 'submitted') ||
    timesheetData.status === 'rejected';
  const isReadOnly = () =>
    /* isSubmittedForDay || */ timesheetData.status === 'approved';
  const handleEdit = entry => {
    const hms = normalizeToHMS(
      entry.regular_hours_input ??
        entry.regular_hours_hms ??
        entry.regularHours,
    );
    const safe = {
      ...entry,
      regular_hours_input: entry.regular_hours_input ?? hmsToDecimalStr(hms),
      regular_hours_hms: hms,
      regularHours: hms,
    };
    setTempLabourData(safe);
    setShowAddLabour(true);
    setShowMenu(false);
    setShowTooltip(null);
  };

  const handleDelete = entry => {
    // handleDeleteLabour(entry.id);
    setShowMenu(false);
    setShowTooltip(null);
  };

  const capitalize = text =>
    text ? text.charAt(0).toUpperCase() + text.slice(1) : 'N/A';
  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar backgroundColor="#3B82F6" barStyle="light-content" /> */}

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Job Bluesheet</Text>
            <Text style={styles.headerSubtitle}>
              {formatDate(timesheetData.date)}
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton} />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        nestedScrollEnabled={true}
        contentContainerStyle={{flexGrow: 1, paddingBottom: 28}}>
        {isReadOnly() && (
          <View
            style={{
              flex: 1,
              height: heightPercentageToDP(100),
              display: 'flex',
              justifyContent: 'center',
            }}>
            <View
              style={[
                styles.statusCard,
                {
                  display: 'flex',
                  justifyContent: 'center',
                },
              ]}>
              <View
                style={[
                  styles.approvalInfo,
                  {
                    height: '25%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                <Text style={styles.approvalIcon}>ℹ️</Text>
                <View style={styles.approvalText}>
                  <Text style={styles.approvalTitle}>
                    The blue sheet for today has been submitted.
                  </Text>
                  <Text style={styles.approvalDetails}>
                    The next submission will be enabled for tomorrow.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* LABOUR */}
        {/* {!isReadOnly && (
         */}
        {canEdit() && (
          <View>
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Feather name="clock" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Labour Hours</Text>
                {canEdit() && (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddLabour}>
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderText, {flex: 1}]}>
                    Employee
                  </Text>
                  {/* <Text style={[styles.tableHeaderText, {flex: 1}]}>Role</Text> */}
                  <Text style={[styles.tableHeaderText, {flex: 1}]}>
                    Reg.hrs
                  </Text>
                  {canEdit() && (
                    <Text style={[styles.tableHeaderText, {flex: 1}]}>
                      Actions
                    </Text>
                  )}
                </View>

                {timesheetData?.labourEntries?.length > 0 ? (
                  timesheetData?.labourEntries?.map(entry => {
                    const isTooltipVisible = showTooltip === entry.id;
                    return (
                      <View key={entry.id} style={styles.tableRow}>
                        <Text
                          style={[
                            styles.tableCell,
                            {width: '33%', paddingRight: spacings.large},
                          ]}>
                          {capitalize(entry.employeeName)}
                        </Text>
                        {/* <Text style={[styles.tableCell, {flex: 1}]}>
                  {entry.role || 'Labor'}
                </Text> */}
                        <Text style={[styles.tableCell, {flex: 1}]}>
                          {normalizeToHMS(
                            entry.regular_hours_input ??
                              entry.regular_hours_hms ??
                              entry.regularHours,
                          )}
                        </Text>
                        {canEdit() && (
                          // <View
                          //   style={[styles.tableCell, {flex: 1, flexDirection: 'row'}]}>
                          //   <TouchableOpacity
                          //     style={styles.editButton}
                          //     onPress={() => {
                          //       const hms = normalizeToHMS(
                          //         entry.regular_hours_input ??
                          //           entry.regular_hours_hms ??
                          //           entry.regularHours,
                          //       );
                          //       const safe = {
                          //         ...entry,
                          //         regular_hours_input:
                          //           entry.regular_hours_input ?? hmsToDecimalStr(hms),
                          //         regular_hours_hms: hms,
                          //         regularHours: hms,
                          //       };
                          //       setTempLabourData(safe);
                          //       setShowAddLabour(true);
                          //     }}>
                          //     <MaterialIcons
                          //       name="edit"
                          //       size={20}
                          //       color={Colors.primary}
                          //     />
                          //   </TouchableOpacity>
                          //   <TouchableOpacity
                          //     style={styles.deleteButton}
                          //     onPress={() => handleDeleteLabour(entry.id)}>
                          //     <MaterialIcons
                          //       name="delete"
                          //       size={20}
                          //       color={'#dc2626'}
                          //     />
                          //   </TouchableOpacity>
                          // </View>
                          <View
                            style={[
                              styles.tableCell,
                              {
                                flex: 1,
                                flexDirection: 'row',
                                position: 'relative',
                              },
                            ]}>
                            {/* 3 Dots */}
                            <TouchableOpacity
                              onPress={() => handleEdit(entry)}
                              style={{padding: 4}}>
                              <Feather name="edit" size={22} color="#555" />
                            </TouchableOpacity>

                            {/* Tooltip */}
                            {/* {isTooltipVisible && (
                            <View style={styles.tooltipBox}>
                              <TouchableOpacity
                                onPress={() => handleEdit(entry)}
                                style={styles.tooltipItem}>
                                <Text
                                  style={[
                                    styles.tooltipText,
                                    {color: 'green'},
                                  ]}>
                                  Edit
                                </Text>
                              </TouchableOpacity>
                            
                            </View>
                          )} */}
                          </View>
                        )}
                      </View>
                    );
                  })
                ) : (
                  <View style={{padding: 10, alignItems: 'center'}}>
                    <Text style={{color: '#777'}}>No labours data found</Text>
                  </View>
                )}
              </View>
            </View>

            {/* MATERIALS — lead labor only */}
            {isLeadLabor ? (
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <Feather name="box" size={20} color={Colors.primary} />
                  <Text style={styles.sectionTitle}>Materials</Text>
                  {canEdit() && (
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={handleAddMaterial}>
                      <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.tableContainer}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, {flex: 1}]}>Title</Text>
                    <Text style={[styles.tableHeaderText, {flex: 1}]}>Qty</Text>
                    <Text style={[styles.tableHeaderText, {flex: 1}]}>Used</Text>
                    <Text style={[styles.tableHeaderText, {flex: 1}]}>Rest</Text>
                    {canEdit() && (
                      <Text style={[styles.tableHeaderText, {flex: 1}]}>
                        Actions
                      </Text>
                    )}
                  </View>

                  {timesheetData?.materialEntries?.length > 0 ? (
                    timesheetData?.materialEntries?.map(material => {
                      return (
                        <View key={material?.id} style={styles.tableRow}>
                          <Text
                            style={[
                              styles.tableCell,
                              {width: '20%', paddingRight: spacings.normal},
                            ]}>
                            {capitalize(material?.name)}
                          </Text>
                          <Text style={[styles.tableCell, {flex: 1}]}>
                            {material?.totalOrdered} {material?.unit}
                          </Text>
                          <Text style={[styles.tableCell, {flex: 1}]}>
                            {material?.amountUsed} {material?.unit}
                          </Text>
                          <Text style={[styles.tableCell, {flex: 1}]}>
                            {material?.totalOrdered - material?.amountUsed || 0}{' '}
                            {material?.unit}
                          </Text>
                          {canEdit() && (
                            <View
                              style={[
                                styles.tableCell,
                                {
                                  flex: 1,
                                  flexDirection: 'row',
                                  position: 'relative',
                                },
                              ]}>
                              <TouchableOpacity
                                onPress={() => {
                                  setTempMaterialData(material);
                                  setShowAddMaterial(true);
                                }}
                                style={{padding: 4}}>
                                <Feather name="edit" size={22} color="#555" />
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      );
                    })
                  ) : (
                    <View style={{padding: 10, alignItems: 'center'}}>
                      <Text style={{color: '#777'}}>No material data found</Text>
                    </View>
                  )}
                </View>
              </View>
            ) : null}
            {/* NOTES + SUBMIT */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <MaterialIcons
                  name="edit-note"
                  size={24}
                  color={Colors.primary}
                />
                <Text style={styles.sectionTitle}>Job Notes</Text>
              </View>
              <TextInput
                style={styles.notesInput}
                value={timesheetData.jobNotes}
                editable={!isReadOnly()}
                onChangeText={text => {
                  setTimesheetData(prev => ({...prev, jobNotes: text}));
                  persistNotesDebounced(text);
                }}
                placeholder="Add any additional notes about the job..."
                multiline
                numberOfLines={4}
              />
            </View>

            {/* MATERIAL SLIPS (Optional) — lead labor only */}
            {isLeadLabor ? (
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons
                    name="description"
                    size={24}
                    color={Colors.primary}
                  />
                  <Text style={styles.sectionTitle}>
                    Material Slips (Optional)
                  </Text>
                </View>

                <Text style={styles.imageHint}>
                  Upload material slip images from Camera or Gallery.
                </Text>

                <View style={styles.thumbGrid}>
                  {(() => {
                    const images = timesheetData.jobImages || [];
                    const isDisabled =
                      timesheetData.status === 'approved' || imagePickerLoading;

                    if (images.length === 0) {
                      return (
                        <TouchableOpacity
                          key="material-slip-first"
                          style={styles.materialSlipFirstSlot}
                          activeOpacity={0.85}
                          disabled={isDisabled}
                          onPress={handleOpenMaterialSlipPicker}>
                          <Feather name="plus" size={28} color="#3B82F6" />
                          <Text style={styles.materialSlipFirstTitle}>
                            Add Material Slip
                          </Text>
                          <Text style={styles.materialSlipFirstHint}>
                            Tap to upload your material slip photos here.
                          </Text>
                        </TouchableOpacity>
                      );
                    }

                    return (
                      <>
                        {images.map((img, idx) => (
                          <View
                            key={`material-slip-${idx}`}
                            style={styles.thumbItem}>
                            <Image
                              source={{uri: img?.uri}}
                              style={styles.thumbImg}
                              resizeMode="cover"
                            />
                            <TouchableOpacity
                              style={styles.thumbRemoveBtn}
                              onPress={() => handleRemoveJobImage(idx)}
                              disabled={timesheetData.status === 'approved'}>
                              <Text style={styles.thumbRemoveText}>×</Text>
                            </TouchableOpacity>
                          </View>
                        ))}

                        {!isDisabled && (
                          <TouchableOpacity
                            key="material-slip-add"
                            style={styles.thumbItem}
                            activeOpacity={0.85}
                            disabled={isDisabled}
                            onPress={handleOpenMaterialSlipPicker}>
                            <View style={styles.plusSlot}>
                              <Feather name="plus" size={24} color="#3B82F6" />
                              <Text style={styles.plusSlotText}>Add</Text>
                            </View>
                          </TouchableOpacity>
                        )}
                      </>
                    );
                  })()}
                </View>
              </View>
            ) : null}

            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <MaterialIcons
                  name="summarize"
                  size={24}
                  color={Colors.primary}
                />
                <Text style={styles.sectionTitle}>Summary</Text>
              </View>
              <View style={styles.summaryBreakdown}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Labour:</Text>
                  <Text style={styles.summaryValue}>
                    {timesheetData.labourEntries.length}
                  </Text>
                </View>
                {isLeadLabor ? (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Material:</Text>
                    <Text style={styles.summaryValue}>
                      {timesheetData.materialEntries.length}
                    </Text>
                  </View>
                ) : null}
                <View style={styles.summaryDivider} />
              </View>
              {/* <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (isReadOnly() || loading) && {opacity: 0.5},
                ]}
                disabled={isReadOnly() || loading}
                onPress={handleSubmitForApproval}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {isReadOnly()
                      ? 'Submitted (come back tomorrow)'
                      : 'Submit for Approval'}
                  </Text>
                )}
              </TouchableOpacity>
            </View> */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (isReadOnly() || loading) && {opacity: 0.5},
                  ]}
                  disabled={isReadOnly() || loading}
                  onPress={() => setShowConfirmModal(true)}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      {isReadOnly()
                        ? 'Submitted (come back tomorrow)'
                        : 'Submit for Approval'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <Modal
              visible={showConfirmModal}
              transparent
              animationType="fade"
              onRequestClose={() => setShowConfirmModal(false)}>
              <TouchableWithoutFeedback
                onPress={() => setShowConfirmModal(false)}>
                <View style={styles.confirmModalOverlay}>
                  <TouchableWithoutFeedback>
                    <View style={styles.confirmModal}>
                      <Text style={styles.confirmTitle}>
                        Confirm Submission
                      </Text>
                      <Text style={styles.confirmMessage}>
                        Are you sure you want to submit this blue sheet for
                        approval?
                      </Text>
                      <View style={styles.confirmButtons}>
                        <TouchableOpacity
                          style={[styles.confirmBtn, styles.cancelBtn]}
                          onPress={() => setShowConfirmModal(false)}>
                          <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.confirmBtn, styles.okBtn]}
                          onPress={() => {
                            setShowConfirmModal(false);
                            handleSubmitForApproval();
                          }}>
                          <Text style={styles.okText}>Yes, Submit</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        )}

        {/* bottom spacer (extra, contentContainerStyle already adds padding) */}
        <View style={{height: 0}} />
      </ScrollView>

      {/* Modals */}
      <LabourModal
        visible={showAddLabour}
        setShowAddLabour={setShowAddLabour}
        tempLabourData={tempLabourData}
        setTempLabourData={setTempLabourData}
        handleSaveLabour={handleSaveLabour}
        token={token}
        timesheetData={timesheetData}
        profileUser={profileUser}
        isLeadLabor={isLeadLabor}
        showTimePicker={showTimePicker}
        setShowTimePicker={setShowTimePicker}
      />
      <MaterialModal
        visible={showAddMaterial}
        onClose={() => setShowAddMaterial(false)}
        tempMaterialData={tempMaterialData}
        setTempMaterialData={setTempMaterialData}
        handleSaveMaterial={handleSaveMaterial}
        setShowAddMaterial={setShowAddMaterial}
        token={token}
      />
    </SafeAreaView>
  );
};

/* ======================
   STYLES
====================== */
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f9fafb'},
  header: {backgroundColor: Colors.primary, paddingTop: Spacing.sm},
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  backButton: {padding: Spacing.sm},
  headerCenter: {alignItems: 'center', flex: 1},
  headerTitle: {fontSize: 20, fontWeight: 'bold', color: Colors.white},
  headerSubtitle: {
    fontSize: 14,
    color: Colors.primaryLight,
    marginTop: Spacing.xs,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {fontSize: 18, color: '#fff', fontWeight: '600'},
  content: {flex: 1},
  statusCard: {margin: 16, height: heightPercentageToDP(50)},
  approvalInfo: {
    backgroundColor: '#dcfce7',
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
  },
  approvalIcon: {fontSize: 20, marginRight: 12},
  approvalText: {flex: 1},
  approvalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
    marginBottom: 4,
  },
  approvalDetails: {fontSize: 14, color: '#16a34a'},
  sectionCard: {
    backgroundColor: '#fff',
    marginHorizontal: 0,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
  },
  sectionHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: 16},
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3B82F6',
    flex: 1,
    marginLeft: 10,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    textAlignVertical: 'top',
    minHeight: 96,
  },
  imageHint: {
    color: '#6b7280',
    fontSize: 13,
    marginBottom: 12,
    marginTop: -4,
  },
  imagePickerRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  imagePickerBtn: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  imagePickerBtnSecondary: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  imagePickerBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  imagePickerBtnTextSecondary: {
    color: '#3B82F6',
    fontWeight: '700',
    fontSize: 14,
  },
  thumbGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  materialSlipFirstSlot: {
    width: '100%',
    height: 110,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#93C5FD',
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingHorizontal: 16,
  },
  materialSlipFirstTitle: {
    marginTop: 6,
    color: '#1F2937',
    fontWeight: '700',
    fontSize: 14,
  },
  materialSlipFirstHint: {
    marginTop: 4,
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'center',
  },
  thumbItem: {
    width: 105,
    height: 100,
    borderRadius: 10,
    // overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
    backgroundColor: '#F9FAFB',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  thumbRemoveBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbRemoveText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 16,
    marginTop: -2,
  },
  plusSlot: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
  },
  plusSlotText: {
    marginTop: 6,
    color: '#3B82F6',
    fontWeight: '800',
    fontSize: 12,
  },
  actionButtons: {},
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {color: '#fff', fontSize: 16, fontWeight: '600'},
  tableContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    // overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tableHeaderText: {fontWeight: 'bold', fontSize: 14, color: '#111'},
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  tableCell: {fontSize: 14, color: '#333'},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  materialModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 20,
    minHeight: widthPercentageToDP(70),
    width: '100%',
  },
  materialModalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {fontSize: 18, fontWeight: '600', color: '#111827'},
  modalCloseButton: {fontSize: 18, color: '#6b7280', padding: 8},
  modalBody: {padding: 16},
  formGroup: {marginBottom: 16},
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  materialSearchHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  materialSearchHintText: {fontSize: 13, color: '#6b7280'},
  materialSearchHintTextSpacing: {marginLeft: 8},
  materialSuggestionList: {
    marginTop: 8,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  materialSuggestionRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  materialSuggestionName: {fontSize: 15, color: '#111827', fontWeight: '500'},
  materialSuggestionMeta: {fontSize: 12, color: '#6b7280', marginTop: 2},
  dropdownSheet: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    zIndex: 100,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  dropdownLoader: {paddingVertical: 12, alignItems: 'center'},
  dropdownLoadMore: {paddingVertical: 10, alignItems: 'center'},
  dropdownLoadMoreText: {color: '#2563EB', fontWeight: '600'},
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonPrimary: {backgroundColor: '#3B82F6'},
  modalButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  modalButtonTextPrimary: {color: 'white', fontSize: 16, fontWeight: '600'},
  modalButtonTextSecondary: {color: '#6b7280', fontSize: 16, fontWeight: '600'},
  deleteButton: {paddingHorizontal: 8},
  summaryBreakdown: {marginBottom: 24},
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {fontSize: 16, color: '#6b7280'},
  summaryValue: {fontSize: 16, fontWeight: '600', color: '#111827'},
  summaryDivider: {height: 1, backgroundColor: '#e5e7eb', marginVertical: 12},

  tooltipBox: {
    position: 'absolute',
    top: 25, // distance below 3 dots
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 6,
    minWidth: 130,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    zIndex: 99999,
  },
  tooltipItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tooltipText: {
    fontSize: 15,
    fontWeight: '500',
  },
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModal: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 10,
    textAlign: 'center',
  },
  confirmMessage: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelBtn: {
    backgroundColor: '#e5e7eb',
  },
  okBtn: {
    backgroundColor: '#3B82F6',
  },
  cancelText: {
    color: '#111',
    fontWeight: '500',
  },
  okText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default JobTimesheet;
