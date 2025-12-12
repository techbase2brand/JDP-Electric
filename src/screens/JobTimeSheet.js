import React, {useState, useMemo, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
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
import {
  getAllLabor,
  getJobBluesheets,
  submitBluesheetComplete,
} from '../config/apiConfig';
import DateTimePicker from '@react-native-community/datetimepicker';
import {heightPercentageToDP, widthPercentageToDP} from '../utils';

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
const submitKey = (jobId, date) => `ts:${jobId}:${date}:submitted`;

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

  const fetchPage = async (pageNo = 1) => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await getAllLabor(pageNo, 10, token);
      const data = res?.data?.data || [];
      setItems(prev => (pageNo === 1 ? data : [...prev, ...data]));
      setHasMore(Array.isArray(data) ? data.length > 0 : false);
      setPage(pageNo);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (open) fetchPage(1);
  }, [open]);

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
  showTimePicker,
  setShowTimePicker,
}) => {
  const [pickerValue, setPickerValue] = useState(new Date());
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
      regular_hours_input: hmsToDecimalStr(hms),
    }));
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
          <View style={styles.modalOverlay}>
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
                  <Text style={styles.formLabel}>Regular Hours (HH:MM)</Text>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setShowTimePicker(true)}>
                    <View pointerEvents="none">
                      <TextInput
                        style={styles.formInput}
                        editable={false}
                        value={
                          tempLabourData.regular_hours_hms
                            ? tempLabourData.regular_hours_hms.slice(0, 5)
                            : tempLabourData.regular_hours_input
                            ? normalizeToHMS(
                                tempLabourData.regular_hours_input,
                              ).slice(0, 5)
                            : ''
                        }
                        placeholder="Select hours & minutes"
                      />
                    </View>
                  </TouchableOpacity>

                  {showTimePicker && (
                    <DateTimePicker
                      value={pickerValue || new Date()}
                      mode="time"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      is24Hour={true}
                      onChange={onChangePicker}
                    />
                  )}
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
                  onPress={handleSaveLabour}>
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
}) => (
  <Modal visible={visible} animationType="slide" transparent>
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}>
      <TouchableWithoutFeedback
        onPress={() => {
          setShowAddMaterial(false), Keyboard.dismiss;
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
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
              keyboardShouldPersistTaps="handled">
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Material Name</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter material name"
                  value={tempMaterialData.name || ''}
                  onChangeText={text =>
                    setTempMaterialData(prev => ({...prev, name: text}))
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Unit</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="pieces, feet, etc."
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
                onPress={handleSaveMaterial}>
                <Text style={styles.modalButtonTextPrimary}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  </Modal>
);
/* ======================
   MAIN SCREEN
====================== */
const JobTimesheet = ({navigation, route, user}) => {
  const token = useSelector(state => state.user.token);
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
  const [showMatTooltip, setShowMatTooltip] = useState(false);

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
        // fetch for current date so route-seeding uses that data immediately
        const res = await getJobBluesheets(jobId, token);
        console.log('reessss', res);

        setBulesheetData(res?.data ?? {}); // keep shape similar to previous code
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

  const loadFromStorageOrSeed = async (job, date) => {
    try {
      const jobId = job?.id ?? currentJobId;
      const key = tsKey(jobId, date);

      // --- Build fresh data from route (always compute) ---
      const bs = bluesheetData || {};
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
            regular_hours_input: hmsToDecimalStr(hms),
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
      orders.forEach(order => {
        const orderDate = order?.order_date || order?.created_at;
        if (!orderDate || !sameDay(orderDate, date)) return;

        (order?.items || []).forEach((it, idx) => {
          routeMaterials.push({
            id: `${order.id}_${it.id ?? idx}`,
            name: it?.product?.product_name || it?.product_name || '',
            unit: it?.product?.unit || it?.unit || 'pieces',
            totalOrdered:
              Number(it?.quantity) || Number(it?.total_price ? 1 : 0) || 0,
            amountUsed: Number(it?.quantity) || 0,
            unitCost:
              Number(
                it?.product?.jdp_price ??
                  it?.unit_cost ??
                  it?.product?.estimated_price ??
                  0,
              ) || 0,
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
      await AsyncStorage.setItem(key, JSON.stringify(toStore));

      setTimesheetData(prev => ({
        ...prev,
        jobId,
        date,
        jobNotes: toStore.jobNotes,
        labourEntries: toStore.labourEntries,
        materialEntries: toStore.materialEntries,
      }));
    } catch (e) {
      // soft-fail: keep current state
    }
  };
  useEffect(() => {
    storageKeyRef.current = tsKey(currentJobId, timesheetData.date);
    if (bluesheetData) {
      loadFromStorageOrSeed(bluesheetData, timesheetData.date);
    }
  }, [currentJobId, timesheetData.date, bluesheetData]);
  // per-day submit lock
  const [isSubmittedForDay, setIsSubmittedForDay] = useState(false);
  const refreshSubmitLock = async (jobId, date) => {
    try {
      const v = await AsyncStorage.getItem(submitKey(jobId, date));
      setIsSubmittedForDay(v === 'true');
    } catch {
      setIsSubmittedForDay(false);
    }
  };
  useEffect(() => {
    refreshSubmitLock(currentJobId, timesheetData.date);
  }, [currentJobId, timesheetData.date]);

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

  // payload mappers (HH:MM:SS out)
  const localLaborToApi = l => {
    console.log('llllllllllll', l);

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

  const localMaterialToApi = m => ({
    product_id:
      m.productId !== undefined
        ? isNaN(Number(m.productId))
          ? m.productId
          : Number(m.productId)
        : null,
    material_name: m.name,
    quantity: Number(m.totalOrdered) || 0,
    unit: m.unit || 'pieces',
    total_ordered: Number(m.totalOrdered) || 0,
    material_used: Number(m.amountUsed) || 0,
    supplier_order_id: m.supplierOrderId || null,
    return_to_warehouse: !!m.returnToWarehouse,
    unit_cost: Number(m.unitCost) || 0,
  });

  const buildBluesheetPayload = () => {
    const additionalCharges = (timesheetData.additionalCharges || []).reduce(
      (sum, c) => sum + (Number(c.amount) || 0),
      0,
    );

    const payload = {
      job_id: isNaN(Number(currentJobId)) ? currentJobId : Number(currentJobId),
      date: timesheetData.date,
      status: 'pending',
      notes: timesheetData.jobNotes || '',
      additional_charges: Number(additionalCharges.toFixed(2)),
      labor_entries: (timesheetData.labourEntries || []).map(localLaborToApi),
      material_entries: (timesheetData.materialEntries || []).map(
        localMaterialToApi,
      ),
    };

    console.log('FINAL_PAYLOAD_TO_API::', JSON.stringify(payload, null, 2));
    return payload;
  };

  // temp states
  const [tempLabourData, setTempLabourData] = useState({});
  const [tempMaterialData, setTempMaterialData] = useState({});
  const [loading, setLoading] = useState(false);

  const locked = isSubmittedForDay;

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

      await submitBluesheetComplete(payload, token);

      await AsyncStorage.setItem(
        submitKey(currentJobId, timesheetData.date),
        'true',
      );
      setIsSubmittedForDay(true);

      await AsyncStorage.removeItem(tsKey(currentJobId, timesheetData.date));

      setTimesheetData(prev => ({
        ...prev,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        rejectionReason: undefined,
      }));
      navigation.navigate('TimeSheetStack');
      // Alert.alert('Success', 'Bluesheet submitted for approval');
    } catch (err) {
      const msg = err?.message || 'Failed to submit bluesheet';

      if (
        /already.*submitted|duplicate/i.test(
          String(err?.message || err?.error || ''),
        )
      ) {
        await AsyncStorage.setItem(
          submitKey(currentJobId, timesheetData.date),
          'true',
        );
        setIsSubmittedForDay(true);
        await AsyncStorage.removeItem(tsKey(currentJobId, timesheetData.date));
        setTimesheetData(prev => ({
          ...prev,
          status: 'submitted',
          submittedAt: prev.submittedAt || new Date().toISOString(),
        }));
        Alert.alert(
          'Already Submitted',
          // 'Aaj ki bluesheet pehle hi submit ho chuki hai.',
        );
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
    // console.log('timesheetData.status', timesheetData.status);

    !isSubmittedForDay &&
    (timesheetData.status === 'draft' ||
      (user?.role === 'Lead Labor' && timesheetData.status === 'submitted') ||
      timesheetData.status === 'rejected');
  const isReadOnly = () =>
    isSubmittedForDay || timesheetData.status === 'approved';
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
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        // Keyboard.dismiss();
        setShowTooltip(null);
        setShowMatTooltip(null);
        setShowAddLabour(false);
        setShowAddMaterial(false);
      }}>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#3B82F6" barStyle="light-content" />

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
          style={[styles.content]}
          showsVerticalScrollIndicator={false}>
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
                          <Text style={[styles.tableCell, {flex: 1}]}>
                            {entry.employeeName}
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
                      <Text style={{color: '#777', fontStyle: 'italic'}}>
                        No labours data found
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* MATERIALS */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <Feather name="box" size={20} color={Colors.primary} />
                  <Text style={styles.sectionTitle}>Materials</Text>
                  {/* {canEdit() && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddMaterial}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            )} */}
                </View>

                <View style={styles.tableContainer}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, {flex: 1}]}>
                      Title
                    </Text>
                    <Text style={[styles.tableHeaderText, {flex: 1}]}>Qty</Text>
                    <Text style={[styles.tableHeaderText, {flex: 1}]}>
                      Used
                    </Text>
                    <Text style={[styles.tableHeaderText, {flex: 1}]}>
                      Rest
                    </Text>
                    {canEdit() && (
                      <Text style={[styles.tableHeaderText, {flex: 1}]}>
                        Actions
                      </Text>
                    )}
                  </View>

                  {timesheetData?.materialEntries?.length > 0 ? (
                    timesheetData?.materialEntries?.map(material => {
                      const isTooltipVisible = showMatTooltip === material.id;
                      return (
                        <View key={material?.id} style={styles.tableRow}>
                          <Text style={[styles.tableCell, {flex: 1}]}>
                            {material?.name}
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
                            // <View
                            //   style={[styles.tableCell, {flex: 1, flexDirection: 'row'}]}>
                            //   <TouchableOpacity
                            //     style={styles.editButton}
                            //     onPress={() => {
                            //       setTempMaterialData(material);
                            //       setShowAddMaterial(true);
                            //     }}>
                            //     <MaterialIcons
                            //       name="edit"
                            //       size={20}
                            //       color={Colors.primary}
                            //     />
                            //   </TouchableOpacity>
                            //   <TouchableOpacity
                            //     style={styles.deleteButton}
                            //     onPress={() => handleDeleteMaterial(material.id)}>
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
                                onPress={() => {
                                  setTempMaterialData(material);
                                  setShowAddMaterial(true);
                                  setShowMatTooltip(null);
                                }}
                                style={{padding: 4}}>
                                <Feather name="edit" size={22} color="#555" />
                              </TouchableOpacity>

                              {/* Tooltip */}
                              {/* {isTooltipVisible && (
                            <View style={styles.tooltipBox}>
                              <TouchableOpacity
                                onPress={() => {
                                  setTempMaterialData(material);
                                  setShowAddMaterial(true);
                                  setShowMatTooltip(null);
                                }}
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
                      <Text style={{color: '#777', fontStyle: 'italic'}}>
                        No material data found
                      </Text>
                    </View>
                  )}
                </View>
              </View>

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
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Material:</Text>
                    <Text style={styles.summaryValue}>
                      {timesheetData.materialEntries.length}
                    </Text>
                  </View>
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

          <View style={{height: 28}} />
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
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
    minHeight: widthPercentageToDP(70),
    width: '100%',
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
