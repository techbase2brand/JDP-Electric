// import React, {useState, useMemo, useEffect} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   StyleSheet,
//   Alert,
//   StatusBar,
//   SafeAreaView,
//   Modal,
//   Switch,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
// } from 'react-native';
// import {tabColor} from '../constants/Color';
// import Feather from 'react-native-vector-icons/Feather';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import {widthPercentageToDP} from '../utils';
// import {getAllLabor} from '../config/apiConfig';
// import {useSelector} from 'react-redux';

// const Colors = {
//   primary: '#3B82F6',
//   primaryLight: '#EBF4FF',
//   primaryDark: '#2563EB',
//   white: '#FFFFFF',
//   background: '#F8FAFC',
//   backgroundLight: '#F1F5F9',
//   text: '#1E293B',
//   textSecondary: '#64748B',
//   textLight: '#94A3B8',
//   border: '#E2E8F0',
//   success: '#10B981',
//   successLight: '#D1FAE5',
//   successDark: '#059669',
//   warning: '#F59E0B',
//   warningLight: '#FEF3C7',
//   error: '#EF4444',
//   errorLight: '#FEE2E2',
//   purple: '#8B5CF6',
//   purpleLight: '#F3E8FF',
//   indigo: '#6366F1',
//   indigoLight: '#EEF2FF',
//   orange: '#F97316',
//   orangeLight: '#FED7AA',
//   green: '#22C55E',
//   greenLight: '#DCFCE7',
// };

// // Embedded Spacing
// const Spacing = {
//   xs: 4,
//   sm: 8,
//   md: 16,
//   lg: 24,
//   xl: 32,
//   xxl: 48,
// };
// /* -------------------------
//    Small helpers
// -------------------------- */
// const debounce = (fn, delay = 400) => {
//   let t;
//   return (...args) => {
//     clearTimeout(t);
//     t = setTimeout(() => fn(...args), delay);
//   };
// };

// /* -------------------------
//    Custom Searchable Dropdown
// -------------------------- */
// const LabourSearchDropdown = ({token, selectedEmployee, onSelectEmployee}) => {
//   const [open, setOpen] = useState(false);
//   const [query, setQuery] = useState('');
//   const [items, setItems] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   // sync input with selected value when modal opens/changes
//   useEffect(() => {
//     setQuery(selectedEmployee?.label || '');
//   }, [selectedEmployee]);

//   const fetchPage = async (pageNo = 1) => {
//     if (!token) return;
//     try {
//       setLoading(true);
//       const res = await getAllLabor(pageNo, 10, token);
//       const data = res?.data?.data || []; // ← as per your API shape

//       if (pageNo === 1) setItems(data);
//       else setItems(prev => [...prev, ...data]);

//       setHasMore(Array.isArray(data) ? data.length > 0 : false);
//       setPage(pageNo);
//     } catch (e) {
//       console.error('getAllLabor error:', e);
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

//   return (
//     <View style={{position: 'relative'}}>
//       {/* SINGLE INPUT ONLY */}
//       <TextInput
//         style={styles.formInput}
//         placeholder="Search employee"
//         value={query}
//         onFocus={() => setOpen(true)}
//         onChangeText={txt => {
//           if (!open) setOpen(true);
//           debouncedSetQuery(txt);
//           // live reflect while typing
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

//           {/* small close tap area */}
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

// /* -------------------------
//    Modals (updated LabourModal)
// -------------------------- */
// const LabourModal = ({
//   visible,
//   setShowAddLabour,
//   editingLabour,
//   setEditingLabour,
//   tempLabourData,
//   setTempLabourData,
//   handleSaveLabour,

//   // extra for dropdown
//   token,
// }) => (
//   <Modal
//     visible={visible}
//     animationType="slide"
//     transparent
//     onRequestClose={() => {
//       setShowAddLabour(false);
//       setEditingLabour(null);
//       setTempLabourData({});
//     }}>
//     <View style={styles.modalOverlay}>
//       <View style={styles.modalContent}>
//         {/* ✅ KeyboardAvoidingView Added */}
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//           keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
//           <ScrollView
//             contentContainerStyle={styles.modalBody}
//             keyboardShouldPersistTaps="handled"
//             showsVerticalScrollIndicator={false}>
//             {/* Header */}
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>
//                 {editingLabour ? 'Edit Labour Entry' : 'Add Labour Entry'}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowAddLabour(false);
//                   setEditingLabour(null);
//                   setTempLabourData({});
//                 }}>
//                 <Text style={styles.modalCloseButton}>✕</Text>
//               </TouchableOpacity>
//             </View>

//             {/* Employee Searchable Dropdown (custom) */}
//             <View style={styles.formGroup}>
//               <Text style={styles.formLabel}>Employee</Text>
//               <LabourSearchDropdown
//                 token={token}
//                 selectedEmployee={
//                   tempLabourData.employeeId
//                     ? {
//                         id: tempLabourData.employeeId,
//                         label: tempLabourData.employeeName,
//                       }
//                     : null
//                 }
//                 onSelectEmployee={emp => {
//                   setTempLabourData(prev => ({
//                     ...prev,
//                     employeeName: emp.label,
//                     employeeId: emp.id,
//                     _selectedEmployee: emp.raw,
//                   }));
//                 }}
//               />
//             </View>

//             <View style={styles.formGroup}>
//               <Text style={styles.formLabel}>Regular Hours</Text>
//               <TextInput
//                 style={styles.formInput}
//                 value={
//                   tempLabourData.regularHours === '' ||
//                   tempLabourData.regularHours === undefined
//                     ? ''
//                     : String(tempLabourData.regularHours)
//                 }
//                 onChangeText={text =>
//                   setTempLabourData(prev => ({
//                     ...prev,
//                     regularHours: text === '' ? '' : parseFloat(text) || 0,
//                   }))
//                 }
//                 placeholder="0"
//                 keyboardType="numeric"
//               />
//             </View>
//           </ScrollView>

//           {/* Footer Buttons */}
//           <View style={styles.modalFooter}>
//             <TouchableOpacity
//               style={[styles.modalButton, styles.modalButtonSecondary]}
//               onPress={() => {
//                 setShowAddLabour(false);
//                 setEditingLabour(null);
//                 setTempLabourData({});
//               }}>
//               <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.modalButton, styles.modalButtonPrimary]}
//               onPress={handleSaveLabour}>
//               <Text style={styles.modalButtonTextPrimary}>Save</Text>
//             </TouchableOpacity>
//           </View>
//         </KeyboardAvoidingView>
//       </View>
//     </View>
//   </Modal>
// );

// const MaterialModal = ({
//   visible,
//   onClose,
//   tempMaterialData,
//   setTempMaterialData,
//   editingMaterial,
//   setEditingMaterial,
//   handleSaveMaterial,
//   setShowAddMaterial,
// }) => (
//   <Modal visible={visible} animationType="slide" transparent>
//     <View style={styles.modalOverlay}>
//       <View style={styles.modalContent}>
//         <View style={styles.modalHeader}>
//           <Text style={styles.modalTitle}>
//             {editingMaterial ? 'Edit Material Entry' : 'Add Material Entry'}
//           </Text>
//           <TouchableOpacity onPress={onClose}>
//             <Text style={styles.modalCloseButton}>✕</Text>
//           </TouchableOpacity>
//         </View>

//         <ScrollView style={styles.modalBody}>
//           <View style={styles.formGroup}>
//             <Text style={styles.formLabel}>Material Name</Text>
//             <TextInput
//               style={styles.formInput}
//               value={tempMaterialData.name || ''}
//               onChangeText={text =>
//                 setTempMaterialData(prev => ({...prev, name: text}))
//               }
//               placeholder="Enter material name"
//             />
//           </View>

//           <View style={styles.formGroup}>
//             <Text style={styles.formLabel}>Unit</Text>
//             <TextInput
//               style={styles.formInput}
//               value={tempMaterialData.unit || ''}
//               onChangeText={text =>
//                 setTempMaterialData(prev => ({...prev, unit: text}))
//               }
//               placeholder="pieces, feet, etc."
//             />
//           </View>

//           <View style={styles.formGroup}>
//             <Text style={styles.formLabel}>Total Ordered</Text>
//             <TextInput
//               style={styles.formInput}
//               value={
//                 tempMaterialData.totalOrdered === undefined
//                   ? ''
//                   : String(tempMaterialData.totalOrdered)
//               }
//               onChangeText={text =>
//                 setTempMaterialData(prev => ({
//                   ...prev,
//                   totalOrdered: text === '' ? '' : parseFloat(text) || 0,
//                 }))
//               }
//               placeholder="0"
//               keyboardType="numeric"
//             />
//           </View>

//           <View style={styles.formGroup}>
//             <Text style={styles.formLabel}>Material Used</Text>
//             <TextInput
//               style={styles.formInput}
//               value={
//                 tempMaterialData.amountUsed === undefined
//                   ? ''
//                   : String(tempMaterialData.amountUsed)
//               }
//               onChangeText={text =>
//                 setTempMaterialData(prev => ({
//                   ...prev,
//                   amountUsed: text === '' ? '' : parseFloat(text) || 0,
//                 }))
//               }
//               placeholder="0"
//               keyboardType="numeric"
//             />
//           </View>

//           <View style={styles.formGroup}>
//             <Text style={styles.formLabel}>Supplier Order ID</Text>
//             <TextInput
//               style={styles.formInput}
//               value={tempMaterialData.supplierOrderId || ''}
//               onChangeText={text =>
//                 setTempMaterialData(prev => ({
//                   ...prev,
//                   supplierOrderId: text,
//                 }))
//               }
//               placeholder="Enter order ID"
//             />
//           </View>

//           <View style={styles.switchGroup}>
//             <Text style={styles.formLabel}>Return to Warehouse</Text>
//             <Switch
//               value={!!tempMaterialData.returnToWarehouse}
//               onValueChange={value =>
//                 setTempMaterialData(prev => ({
//                   ...prev,
//                   returnToWarehouse: value,
//                 }))
//               }
//               trackColor={{false: '#e5e7eb', true: '#3B82F6'}}
//               thumbColor={
//                 tempMaterialData.returnToWarehouse ? '#ffffff' : '#f4f3f4'
//               }
//             />
//           </View>
//         </ScrollView>

//         <View style={styles.modalFooter}>
//           <TouchableOpacity
//             style={[styles.modalButton, styles.modalButtonSecondary]}
//             onPress={() => {
//               setShowAddMaterial(false);
//               setEditingMaterial(null);
//               setTempMaterialData({});
//             }}>
//             <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.modalButton, styles.modalButtonPrimary]}
//             onPress={handleSaveMaterial}>
//             <Text style={styles.modalButtonTextPrimary}>Save</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   </Modal>
// );
// const JobTimesheet = ({navigation, route, user}) => {
//   const {timesheet} = route?.params || {};
//   const {job} = route?.params || {};
//   // const token = user?.token || route?.params?.token || '';
//   const token = useSelector(state => state.user.token);

//   console.log('tokentokentokentoken', token);

//   const [editingLabour, setEditingLabour] = useState(null);
//   const [editingMaterial, setEditingMaterial] = useState(null);
//   const [editingCharge, setEditingCharge] = useState(null);
//   const [showAddLabour, setShowAddLabour] = useState(false);
//   const [showAddMaterial, setShowAddMaterial] = useState(false);
//   const [showAddCharge, setShowAddCharge] = useState(false);
//   // Initialize timesheet data - either from existing timesheet or create new
//   const [timesheetData, setTimesheetData] = useState(() => {
//     if (timesheet) {
//       return {
//         id: timesheet.id,
//         jobId: timesheet.jobId,
//         date: timesheet.date,
//         status: timesheet.status,
//         jobNotes: 'Main electrical work and installation',
//         submittedAt: timesheet.submittedAt,
//         approvedAt: timesheet.approvedAt,
//         approvedBy: timesheet.approvedBy,
//         rejectionReason: timesheet.rejectionReason,
//         labourEntries: [
//           {
//             id: '1',
//             employeeName: timesheet.submittedBy,
//             employeeId: timesheet.employeeId,
//             role: user?.role || 'Labor',
//             regularHours: timesheet.labourHours,
//             overtimeHours: 0,
//             regularRate: user?.role === 'Lead Labor' ? 35 : 28,
//             overtimeRate: user?.role === 'Lead Labor' ? 52.5 : 42,
//             totalCost: timesheet.labourCost,
//             notes: 'Loaded from existing timesheet',
//           },
//         ],
//         materialEntries: [
//           {
//             id: '1',
//             name: 'Electrical Wire 12AWG',
//             unit: 'feet',
//             totalOrdered: 500,
//             amountUsed: Math.round(timesheet.materialCost / 0.85),
//             amountRemaining: 500 - Math.round(timesheet.materialCost / 0.85),
//             unitCost: 0.85,
//             totalCost: timesheet.materialCost,
//             supplierOrderId: 'ORD-2024-001',
//             returnToWarehouse: false,
//           },
//         ],
//         additionalCharges: [
//           {
//             id: '1',
//             title: 'Additional Items ABC',
//             description: 'Additional Items',
//             category: 'Other',
//             amount:
//               timesheet.totalCost -
//               timesheet.labourCost -
//               timesheet.materialCost,
//             notes: 'Loaded from existing timesheet',
//           },
//         ],
//       };
//     }

//     // Create new timesheet
//     return {
//       id: `timesheet-${job?.id || 'new'}-${
//         new Date().toISOString().split('T')[0]
//       }`,
//       jobId: job?.id || 'unknown',
//       date: new Date().toISOString().split('T')[0],
//       status: 'draft',
//       jobNotes: 'Main electrical work and installation',
//       labourEntries: [],
//       materialEntries: [],
//       additionalCharges: [],
//     };
//   });
//   console.log('timesheetData>>>', job);

//   // Temporary form state for editing
//   const [tempLabourData, setTempLabourData] = useState({});
//   const [tempMaterialData, setTempMaterialData] = useState({});
//   const [tempChargeData, setTempChargeData] = useState({});
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   // Calculate totals
//   const totals = useMemo(() => {
//     const labourTotal = timesheetData.labourEntries.reduce(
//       (sum, entry) => sum + (entry.totalCost || 0),
//       0,
//     );
//     const materialTotal = timesheetData.materialEntries.reduce(
//       (sum, entry) => sum + (entry.amountUsed || 0) * (entry.unitCost || 0),
//       0,
//     );
//     const chargesTotal = timesheetData.additionalCharges.reduce(
//       (sum, charge) => sum + (charge.amount || 0),
//       0,
//     );
//     const grandTotal = labourTotal + materialTotal + chargesTotal;

//     return {
//       labour: labourTotal,
//       materials: materialTotal,
//       charges: chargesTotal,
//       grandTotal,
//     };
//   }, [timesheetData]);

//   // Helper functions
//   const formatDate = dateString => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   const canEdit = () => {
//     return (
//       timesheetData.status === 'draft' ||
//       (user?.role === 'Lead Labor' && timesheetData.status === 'submitted') ||
//       timesheetData.status === 'rejected'
//     );
//   };

//   const isReadOnly = () => {
//     return timesheetData.status === 'approved';
//   };

//   // Labour entry handlers
//   const handleAddLabour = () => {
//     setTempLabourData({
//       id: `labour-${Date.now()}`,
//       employeeName: '',
//       employeeId: '',
//       role: 'Labor',
//       regularHours: 0,
//       overtimeHours: 0,
//       regularRate: 28,
//       overtimeRate: 42,
//       totalCost: 0,
//       notes: '',
//     });
//     setShowAddLabour(true);
//   };

//   const handleSaveLabour = () => {
//     if (!tempLabourData.employeeName || !tempLabourData.employeeId) {
//       Alert.alert('Error', 'Please select an employee');
//       return;
//     }

//     const totalCost =
//       (Number(tempLabourData.regularHours) || 0) *
//         (Number(tempLabourData.regularRate) || 0) +
//       (Number(tempLabourData.overtimeHours) || 0) *
//         (Number(tempLabourData.overtimeRate) || 0);

//     const newEntry = {
//       ...tempLabourData,
//       totalCost,
//     };

//     // ✅ console payload name + hours
//     const labourPayload = {
//       employee_id: newEntry.employeeId,
//       employee_name: newEntry.employeeName,
//       hours: Number(newEntry.regularHours) || 0,
//     };
//     console.log('LABOUR_PAYLOAD::', labourPayload);

//     if (editingLabour) {
//       setTimesheetData(prev => ({
//         ...prev,
//         labourEntries: prev.labourEntries.map(entry =>
//           entry.id === editingLabour ? newEntry : entry,
//         ),
//       }));
//       setEditingLabour(null);
//     } else {
//       setTimesheetData(prev => ({
//         ...prev,
//         labourEntries: [...prev.labourEntries, newEntry],
//       }));
//     }

//     setShowAddLabour(false);
//     setTempLabourData({});
//   };

//   const handleDeleteLabour = id => {
//     Alert.alert(
//       'Delete Labour Entry',
//       'Are you sure you want to delete this labour entry?',
//       [
//         {text: 'Cancel', style: 'cancel'},
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: () => {
//             setTimesheetData(prev => ({
//               ...prev,
//               labourEntries: prev.labourEntries.filter(
//                 entry => entry.id !== id,
//               ),
//             }));
//           },
//         },
//       ],
//     );
//   };

//   // Material entry handlers
//   const handleAddMaterial = () => {
//     setTempMaterialData({
//       id: `material-${Date.now()}`,
//       name: '',
//       unit: 'pieces',
//       totalOrdered: 0,
//       amountUsed: 0,
//       amountRemaining: 0,
//       unitCost: 0,
//       totalCost: 0,
//       supplierOrderId: '',
//       returnToWarehouse: false,
//     });
//     setShowAddMaterial(true);
//   };

//   const handleSaveMaterial = () => {
//     if (!tempMaterialData.name) {
//       Alert.alert('Error', 'Please fill in material name');
//       return;
//     }

//     const totalCost =
//       (Number(tempMaterialData.amountUsed) || 0) *
//       (Number(tempMaterialData.unitCost) || 0);
//     const amountRemaining =
//       (Number(tempMaterialData.totalOrdered) || 0) -
//       (Number(tempMaterialData.amountUsed) || 0);

//     const newEntry = {
//       ...tempMaterialData,
//       totalCost,
//       amountRemaining,
//     };

//     // console material payload
//     const materialPayload = {
//       title: newEntry.name,
//       unit: newEntry.unit,
//       qty_ordered: Number(newEntry.totalOrdered) || 0,
//       qty_used: Number(newEntry.amountUsed) || 0,
//       supplier_order_id: newEntry.supplierOrderId || null,
//       return_to_warehouse: !!newEntry.returnToWarehouse,
//     };
//     console.log('MATERIAL_PAYLOAD::', materialPayload);

//     if (editingMaterial) {
//       setTimesheetData(prev => ({
//         ...prev,
//         materialEntries: prev?.materialEntries?.map(entry =>
//           entry.id === editingMaterial ? newEntry : entry,
//         ),
//       }));
//       setEditingMaterial(null);
//     } else {
//       setTimesheetData(prev => ({
//         ...prev,
//         materialEntries: [...prev.materialEntries, newEntry],
//       }));
//     }

//     setShowAddMaterial(false);
//     setTempMaterialData({});
//   };

//   const handleDeleteMaterial = id => {
//     Alert.alert(
//       'Delete Material Entry',
//       'Are you sure you want to delete this material entry?',
//       [
//         {text: 'Cancel', style: 'cancel'},
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: () => {
//             setTimesheetData(prev => ({
//               ...prev,
//               materialEntries: prev.materialEntries.filter(
//                 entry => entry.id !== id,
//               ),
//             }));
//           },
//         },
//       ],
//     );
//   };

//   // Additional charge handlers
//   const handleAddCharge = () => {
//     setTempChargeData({
//       id: `charge-${Date.now()}`,
//       description: '',
//       category: 'Other',
//       amount: 0,
//       receipt: '',
//       notes: '',
//     });
//     setShowAddCharge(true);
//   };

//   const handleSaveCharge = () => {
//     if (!tempChargeData.description) {
//       Alert.alert('Error', 'Please fill in charge description');
//       return;
//     }

//     const newEntry = tempChargeData;

//     if (editingCharge) {
//       setTimesheetData(prev => ({
//         ...prev,
//         additionalCharges: prev.additionalCharges.map(entry =>
//           entry.id === editingCharge ? newEntry : entry,
//         ),
//       }));
//       setEditingCharge(null);
//     } else {
//       setTimesheetData(prev => ({
//         ...prev,
//         additionalCharges: [...prev.additionalCharges, newEntry],
//       }));
//     }
//     setShowAddCharge(false);
//     setTempChargeData({});
//   };

//   const handleDeleteCharge = id => {
//     Alert.alert(
//       'Delete Additional Charge',
//       'Are you sure you want to delete this charge?',
//       [
//         {text: 'Cancel', style: 'cancel'},
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: () => {
//             setTimesheetData(prev => ({
//               ...prev,
//               additionalCharges: prev.additionalCharges.filter(
//                 entry => entry.id !== id,
//               ),
//             }));
//           },
//         },
//       ],
//     );
//   };

//   // Submit for approval
//   const handleSubmitForApproval = () => {
//     if (timesheetData.labourEntries.length === 0) {
//       Alert.alert('Error', 'Please add at least one labour entry');
//       return;
//     }

//     const newStatus =
//       timesheetData.status === 'rejected' ? 'submitted' : 'submitted';
//     setTimesheetData(prev => ({
//       ...prev,
//       status: newStatus,
//       submittedAt: new Date().toISOString(),
//       rejectionReason: undefined, // Clear rejection reason on resubmit
//     }));

//     const message =
//       timesheetData.status === 'rejected'
//         ? 'Bluesheet resubmitted for approval'
//         : 'Bluesheet submitted for approval';
//     Alert.alert('Success', message);
//   };

//   // Approval handlers for Lead Labor
//   const handleApprove = () => {
//     setTimesheetData(prev => ({
//       ...prev,
//       status: 'approved',
//       approvedAt: new Date().toISOString(),
//       approvedBy: user?.name || 'Management',
//     }));
//     Alert.alert('Success', 'Bluesheet approved');
//   };

//   const handleReject = () => {
//     Alert.prompt(
//       'Reject Bluesheet',
//       'Please provide a reason for rejection:',
//       reason => {
//         if (reason) {
//           setTimesheetData(prev => ({
//             ...prev,
//             status: 'rejected',
//             rejectionReason: reason,
//           }));
//           Alert.alert('Success', 'Bluesheet rejected');
//         }
//       },
//     );
//   };

//   // Navigation handler - go back to appropriate screen
//   const handleBack = () => {
//     if (timesheet) {
//       navigation.goBack();
//     } else {
//       navigation.goBack();
//     }
//   };

//   // Modal components
//   const AddEllipsis = ({text}) => {
//     const words = text.split(' ');
//     if (words.length > 10) {
//       text = words.slice(0, 10).join(' ') + '...';
//     }
//     return <Text style={[styles.tableCell, {flex: 1}]}>{text}</Text>;
//   };

//   const formatToHMS = seconds => {
//     const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
//     const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
//     const secs = String(seconds % 60).padStart(2, '0');
//     return `${hrs}:${mins}:${secs}`;
//   };
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar backgroundColor="#3B82F6" barStyle="light-content" />

//       <View style={styles.header}>
//         <View style={styles.headerTop}>
//           <TouchableOpacity style={styles.backButton} onPress={handleBack}>
//             <MaterialIcons name="arrow-back" size={24} color={'#fff'} />
//           </TouchableOpacity>

//           <View style={styles.headerCenter}>
//             <Text style={styles.headerTitle}>Job Bluesheet</Text>
//             <Text style={styles.headerSubtitle}>
//               {formatDate(selectedDate)}{' '}
//             </Text>
//           </View>

//           <TouchableOpacity style={styles.addButton}>
//             {/* placeholder */}
//           </TouchableOpacity>
//         </View>
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {/* Status and Job Info */}
//         <View style={styles.statusCard}>
//           {timesheetData.status === 'rejected' &&
//             timesheetData.rejectionReason && (
//               <View style={styles.rejectionInfo}>
//                 <Text style={styles.rejectionIcon}>⚠️</Text>
//                 <View style={styles.rejectionText}>
//                   <Text style={styles.rejectionTitle}>Bluesheet Rejected</Text>
//                   <Text style={styles.rejectionReason}>
//                     {timesheetData.rejectionReason}
//                   </Text>
//                 </View>
//               </View>
//             )}

//           {timesheetData.status === 'approved' && timesheetData.approvedAt && (
//             <View style={styles.approvalInfo}>
//               <Text style={styles.approvalIcon}>✅</Text>
//               <View style={styles.approvalText}>
//                 <Text style={styles.approvalTitle}>Bluesheet Approved</Text>
//                 <Text style={styles.approvalDetails}>
//                   Approved by {timesheetData.approvedBy || 'Management'} on{' '}
//                   {new Date(timesheetData.approvedAt).toLocaleDateString()}
//                 </Text>
//               </View>
//             </View>
//           )}
//         </View>

//         {/* Labour Hours Section */}
//         <View style={styles.sectionCard}>
//           <View style={styles.sectionHeader}>
//             <Feather name="clock" size={20} color={tabColor} />
//             <Text style={styles.sectionTitle}>Labour Hours</Text>
//             {canEdit() && !isReadOnly() && (
//               <TouchableOpacity
//                 style={styles.addButton}
//                 onPress={handleAddLabour}>
//                 <Text style={styles.addButtonText}>+</Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           <View style={styles.tableContainer}>
//             {/* Table Header */}
//             <View style={styles.tableHeader}>
//               <Text style={[styles.tableHeaderText, {flex: 1}]}>Employee</Text>
//               <Text style={[styles.tableHeaderText, {flex: 1}]}>Role</Text>
//               <Text style={[styles.tableHeaderText, {flex: 1}]}>Reg.hrs</Text>
//               {canEdit() && !isReadOnly() && (
//                 <Text style={[styles.tableHeaderText, {flex: 1}]}>Actions</Text>
//               )}
//             </View>

//             {/* Table Rows from existing job (unchanged) */}
//             {job?.labor_timesheets?.map(entry => (
//               <View key={entry.id} style={styles.tableRow}>
//                 <Text style={[styles.tableCell, {flex: 1}]}>
//                   {entry?.lead_labor?.users?.full_name ??
//                     entry?.labor?.users?.full_name}
//                 </Text>

//                 <Text style={[styles.tableCell, {flex: 1}]}>
//                   {entry?.lead_labor ? 'Lead Labor' : 'Labor'}
//                 </Text>
//                 <Text style={[styles.tableCell, {flex: 1}]}>
//                   {entry.work_activity || 0}
//                 </Text>

//                 {canEdit() && !isReadOnly() && (
//                   <View
//                     style={[styles.tableCell, {flex: 1, flexDirection: 'row'}]}>
//                     <TouchableOpacity
//                       style={styles.editButton}
//                       onPress={() => {
//                         // Pre-fill modal with editable fields
//                         setTempLabourData({
//                           id: entry.id,
//                           employeeName:
//                             entry?.lead_labor?.users?.full_name ??
//                             entry?.labor?.users?.full_name,
//                           employeeId:
//                             entry?.lead_labor?.id ??
//                             entry?.labor?.id ??
//                             entry?.employeeId ??
//                             '',
//                           role: entry?.lead_labor ? 'Lead Labor' : 'Labor',
//                           regularHours: Math.round(
//                             (entry.work_activity || 0) / 3600,
//                           ), // h approx
//                         });
//                         setEditingLabour(entry.id);
//                         setShowAddLabour(true);
//                       }}>
//                       <MaterialIcons name="edit" size={20} color={tabColor} />
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       style={styles.deleteButton}
//                       onPress={() => handleDeleteLabour(entry.id)}>
//                       <MaterialIcons
//                         name="delete"
//                         size={20}
//                         color={'#dc2626'}
//                       />
//                     </TouchableOpacity>
//                   </View>
//                 )}
//               </View>
//             ))}

//             {/* Table Rows from local (newly added/edited) */}
//             {timesheetData.labourEntries.map(entry => (
//               <View key={entry.id} style={styles.tableRow}>
//                 <Text style={[styles.tableCell, {flex: 1}]}>
//                   {entry.employeeName}
//                 </Text>
//                 <Text style={[styles.tableCell, {flex: 1}]}>
//                   {entry.role || 'Labor'}
//                 </Text>
//                 <Text style={[styles.tableCell, {flex: 1}]}>
//                   {entry.regularHours}
//                 </Text>

//                 {canEdit() && !isReadOnly() && (
//                   <View
//                     style={[styles.tableCell, {flex: 1, flexDirection: 'row'}]}>
//                     <TouchableOpacity
//                       style={styles.editButton}
//                       onPress={() => {
//                         setTempLabourData(entry);
//                         setEditingLabour(entry.id);
//                         setShowAddLabour(true);
//                       }}>
//                       <MaterialIcons name="edit" size={20} color={tabColor} />
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       style={styles.deleteButton}
//                       onPress={() => handleDeleteLabour(entry.id)}>
//                       <MaterialIcons
//                         name="delete"
//                         size={20}
//                         color={'#dc2626'}
//                       />
//                     </TouchableOpacity>
//                   </View>
//                 )}
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Materials Section */}
//         <View style={styles.sectionCard}>
//           <View style={styles.sectionHeader}>
//             <Feather name="box" size={20} color={tabColor} />
//             <Text style={styles.sectionTitle}>Materials</Text>
//             {canEdit() && !isReadOnly() && (
//               <TouchableOpacity
//                 style={styles.addButton}
//                 onPress={handleAddMaterial}>
//                 <Text style={styles.addButtonText}>+</Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           <View style={styles.tableContainer}>
//             {/* Table Header */}
//             <View style={styles.tableHeader}>
//               <Text style={[styles.tableHeaderText, {flex: 1}]}>Title</Text>
//               <Text style={[styles.tableHeaderText, {flex: 1}]}>Qty</Text>
//               <Text style={[styles.tableHeaderText, {flex: 1}]}>Used</Text>
//               {canEdit() && !isReadOnly() && (
//                 <Text style={[styles.tableHeaderText, {flex: 1}]}>Actions</Text>
//               )}
//             </View>

//             {/* existing job materials (if any) */}
//             {job?.orders?.[0]?.items?.map(material => (
//               <View key={material.id} style={styles.tableRow}>
//                 <Text style={[styles.tableCell, {flex: 1}]}>
//                   {material?.product?.product_name}
//                 </Text>

//                 <Text style={[styles.tableCell, {flex: 1}]}>
//                   {material?.product?.stock_quantity} {material?.product?.unit}
//                 </Text>

//                 <Text style={[styles.tableCell, {flex: 1}]}>
//                   {material?.quantity} {material?.product?.unit}
//                 </Text>

//                 {canEdit() && !isReadOnly() && (
//                   <View
//                     style={[styles.tableCell, {flex: 1, flexDirection: 'row'}]}>
//                     <TouchableOpacity
//                       style={styles.editButton}
//                       onPress={() => {
//                         setTempMaterialData({
//                           id: material.id,
//                           name: material?.product?.product_name || '',
//                           unit: material?.product?.unit || 'pieces',
//                           totalOrdered:
//                             Number(material?.product?.stock_quantity) || 0,
//                           amountUsed: Number(material?.quantity) || 0,
//                           supplierOrderId:
//                             material?.product?.supplier_order_id || '',
//                           returnToWarehouse: false,
//                         });
//                         setEditingMaterial(material.id);
//                         setShowAddMaterial(true);
//                       }}>
//                       <MaterialIcons name="edit" size={20} color={tabColor} />
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       style={styles.deleteButton}
//                       onPress={() => handleDeleteMaterial(material.id)}>
//                       <MaterialIcons
//                         name="delete"
//                         size={20}
//                         color={'#dc2626'}
//                       />
//                     </TouchableOpacity>
//                   </View>
//                 )}
//               </View>
//             ))}

//             {/* local materials (added/edited) */}
//             {timesheetData?.materialEntries?.map(material => (
//               <View key={material.id} style={styles.tableRow}>
//                 <Text style={[styles.tableCell, {flex: 1}]}>
//                   {material.name}
//                 </Text>
//                 <Text style={[styles.tableCell, {flex: 1}]}>
//                   {material.totalOrdered} {material.unit}
//                 </Text>
//                 <Text style={[styles.tableCell, {flex: 1}]}>
//                   {material.amountUsed} {material.unit}
//                 </Text>

//                 {canEdit() && !isReadOnly() && (
//                   <View
//                     style={[styles.tableCell, {flex: 1, flexDirection: 'row'}]}>
//                     <TouchableOpacity
//                       style={styles.editButton}
//                       onPress={() => {
//                         setTempMaterialData(material);
//                         setEditingMaterial(material.id);
//                         setShowAddMaterial(true);
//                       }}>
//                       <MaterialIcons name="edit" size={20} color={tabColor} />
//                     </TouchableOpacity>
// <TouchableOpacity
//   style={styles.deleteButton}
//   onPress={() => handleDeleteMaterial(material.id)}>
//   <MaterialIcons
//     name="delete"
//     size={20}
//     color={'#dc2626'}
//   />
// </TouchableOpacity>
//                   </View>
//                 )}
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Notes Section */}
//         <View style={styles.sectionCard}>
//           <View style={styles.sectionHeader}>
//             <MaterialIcons name="edit-note" size={26} color={tabColor} />
//             <Text style={styles.sectionTitle}>Job Notes</Text>
//           </View>
//           <TextInput
//             style={styles.notesInput}
//             value={timesheetData.jobNotes}
//             onChangeText={text =>
//               setTimesheetData(prev => ({
//                 ...prev,
//                 jobNotes: text,
//               }))
//             }
//             placeholder="Add any additional notes about the job..."
//             multiline
//             numberOfLines={4}
//             editable={canEdit() && !isReadOnly()}
//           />
//         </View>

//         {/* Summary and Submit */}
//         <View style={styles.sectionCard}>
//           <View style={styles.sectionHeader}>
//             <MaterialIcons name="summarize" size={26} color={tabColor} />
//             <Text style={styles.sectionTitle}>Summary</Text>
//           </View>
//           <View style={styles.summaryBreakdown}>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Total Labour:</Text>
//               <Text style={styles.summaryValue}>
//                 {job?.labor_timesheets?.length +
//                   timesheetData.labourEntries.length}
//               </Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Material:</Text>
//               <Text style={styles.summaryValue}>
//                 {(job?.orders?.[0]?.items?.length || 0) +
//                   timesheetData.materialEntries.length}
//               </Text>
//             </View>
//             <View style={styles.summaryDivider} />
//           </View>
//           {/* Action Buttons */}
//           <View className="actionButtons" style={styles.actionButtons}>
//             {(timesheetData.status === 'draft' ||
//               timesheetData.status === 'rejected') &&
//               canEdit() &&
//               !isReadOnly() && (
//                 <TouchableOpacity
//                   style={[
//                     styles.submitButton,
//                     timesheetData.status === 'rejected' &&
//                       styles.resubmitButton,
//                   ]}
//                   onPress={handleSubmitForApproval}>
//                   <Text style={styles.submitButtonText}>
//                     {timesheetData.status === 'rejected'
//                       ? 'Resubmit for Approval'
//                       : 'Submit for Approval'}
//                   </Text>
//                 </TouchableOpacity>
//               )}

//             {timesheetData?.status === 'submitted' && (
//               <View style={styles.submittedStatus}>
//                 <Text style={styles.submittedStatusTitle}>
//                   Bluesheet submitted for approval
//                 </Text>
//                 <Text style={styles.submittedStatusDetails}>
//                   Submitted on{' '}
//                   {timesheetData?.submittedAt
//                     ? new Date(timesheetData?.submittedAt).toLocaleDateString(
//                         'en-US',
//                         {
//                           month: 'numeric',
//                           day: 'numeric',
//                           year: 'numeric',
//                         },
//                       )
//                     : 'Unknown'}
//                   .
//                 </Text>
//                 {user?.management_type === 'lead_labor' && (
//                   <View style={styles.leadActions}>
//                     <TouchableOpacity
//                       style={styles.approveButton}
//                       onPress={handleApprove}>
//                       <Text style={styles.approveButtonText}>Approve</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       style={styles.rejectButton}
//                       onPress={handleReject}>
//                       <Text style={styles.rejectButtonText}>Reject</Text>
//                     </TouchableOpacity>
//                   </View>
//                 )}
//               </View>
//             )}

//             {timesheetData.status === 'approved' && (
//               <View style={styles.approvedStatus}>
//                 <Text style={styles.approvedStatusTitle}>
//                   Bluesheet approved
//                 </Text>
//                 <Text style={styles.approvedStatusDetails}>
//                   Approved by {timesheetData.approvedBy || 'Management'} on{' '}
//                   {timesheetData.approvedAt
//                     ? new Date(timesheetData.approvedAt).toLocaleDateString()
//                     : 'Unknown'}
//                 </Text>
//               </View>
//             )}

//             {timesheet && (
//               <TouchableOpacity
//                 style={styles.backToListButton}
//                 onPress={() => navigation.navigate('TimeSheetScreen')}>
//                 <Text style={styles.backToListButtonText}>
//                   Back to All Timesheets
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         {/* Bottom spacing */}
//         <View style={styles.bottomSpacing} />
//       </ScrollView>

//       {/* Modals */}
//       <LabourModal
//         visible={showAddLabour}
//         setShowAddLabour={setShowAddLabour}
//         editingLabour={editingLabour}
//         setEditingLabour={setEditingLabour}
//         tempLabourData={tempLabourData}
//         setTempLabourData={setTempLabourData}
//         handleSaveLabour={handleSaveLabour}
//         token={token}
//       />
//       <MaterialModal
//         visible={showAddMaterial}
//         onClose={() => setShowAddMaterial(false)}
//         tempMaterialData={tempMaterialData}
//         setTempMaterialData={setTempMaterialData}
//         editingMaterial={editingMaterial}
//         setEditingMaterial={setEditingMaterial}
//         handleSaveMaterial={handleSaveMaterial}
//         setShowAddMaterial={setShowAddMaterial}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f9fafb',
//     marginBottom: 70,
//   },
//   header: {
//     backgroundColor: Colors.primary,
//     paddingTop: Spacing.sm,
//   },
//   headerTop: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: Spacing.sm,
//   },
//   backButton: {
//     padding: Spacing.sm,
//   },
//   headerCenter: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: Colors.white,
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: Colors.primaryLight,
//     marginTop: Spacing.xs,
//   },
//   addButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#3B82F6',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   addButtonText: {
//     fontSize: 18,
//     color: 'white',
//     fontWeight: '600',
//   },

//   content: {
//     flex: 1,
//   },
//   statusCard: {
//     margin: 16,
//     padding: 0,
//     borderRadius: 12,
//   },
//   rejectionInfo: {
//     backgroundColor: '#fee2e2',
//     borderLeftWidth: 4,
//     borderLeftColor: '#dc2626',
//     padding: 12,
//     borderRadius: 8,
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   rejectionIcon: {
//     fontSize: 20,
//     marginRight: 12,
//   },
//   rejectionText: {
//     flex: 1,
//   },
//   rejectionTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#dc2626',
//     marginBottom: 4,
//   },
//   rejectionReason: {
//     fontSize: 14,
//     color: '#dc2626',
//   },
//   approvalInfo: {
//     backgroundColor: '#dcfce7',
//     borderLeftWidth: 4,
//     borderLeftColor: '#16a34a',
//     padding: 12,
//     borderRadius: 8,
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   approvalIcon: {
//     fontSize: 20,
//     marginRight: 12,
//   },
//   approvalText: {
//     flex: 1,
//   },
//   approvalTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#16a34a',
//     marginBottom: 4,
//   },
//   approvalDetails: {
//     fontSize: 14,
//     color: '#16a34a',
//   },
//   sectionCard: {
//     backgroundColor: 'white',
//     marginHorizontal: 16,
//     marginBottom: 16,
//     padding: 16,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#3B82F6',
//     flex: 1,
//     marginLeft: 10,
//   },

//   editButton: {padding: 8},
//   deleteButton: {padding: 8},

//   notesInput: {
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     color: '#111827',
//     backgroundColor: '#f9fafb',
//     textAlignVertical: 'top',
//     minHeight: 96,
//   },
//   summaryBreakdown: {
//     marginBottom: 24,
//   },
//   summaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   summaryLabel: {
//     fontSize: 16,
//     color: '#6b7280',
//   },
//   summaryValue: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   summaryDivider: {
//     height: 1,
//     backgroundColor: '#e5e7eb',
//     marginVertical: 12,
//   },
//   actionButtons: {
//     gap: 12,
//   },
//   submitButton: {
//     backgroundColor: '#3B82F6',
//     paddingVertical: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   resubmitButton: {
//     backgroundColor: '#ea580c',
//   },
//   submitButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   submittedStatus: {
//     backgroundColor: '#dbeafe',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   submittedStatusTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1d4ed8',
//     marginBottom: 4,
//   },
//   submittedStatusDetails: {
//     fontSize: 14,
//     color: '#1d4ed8',
//     marginBottom: 12,
//   },
//   leadActions: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 8,
//   },
//   approveButton: {
//     backgroundColor: '#16a34a',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 6,
//   },
//   approveButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   rejectButton: {
//     backgroundColor: 'transparent',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: '#dc2626',
//   },
//   rejectButtonText: {
//     color: '#dc2626',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   approvedStatus: {
//     backgroundColor: '#dcfce7',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   approvedStatusTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#16a34a',
//     marginBottom: 4,
//   },
//   approvedStatusDetails: {
//     fontSize: 14,
//     color: '#16a34a',
//     textAlign: 'center',
//   },
//   backToListButton: {
//     backgroundColor: 'transparent',
//     paddingVertical: 16,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     alignItems: 'center',
//   },
//   backToListButtonText: {
//     color: '#6b7280',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   bottomSpacing: {
//     height: 28,
//   },

//   // Table
//   tableContainer: {
//     marginTop: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     overflow: 'hidden',
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     backgroundColor: '#f3f4f6',
//     paddingVertical: 8,
//     paddingHorizontal: 6,
//   },
//   tableHeaderText: {
//     fontWeight: 'bold',
//     fontSize: 14,
//     color: '#111',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     borderTopWidth: 1,
//     borderColor: '#eee',
//     paddingVertical: 8,
//     paddingHorizontal: 6,
//     alignItems: 'center',
//   },
//   tableCell: {
//     fontSize: 14,
//     color: '#333',
//   },

//   // Modal styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     margin: 20,
//     maxHeight: '80%',
//     width: '90%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   modalCloseButton: {
//     fontSize: 18,
//     color: '#6b7280',
//     padding: 8,
//   },
//   modalBody: {
//     padding: 16,
//   },
//   formGroup: {
//     marginBottom: 16,
//   },
//   formLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: 8,
//   },
//   formInput: {
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     color: '#111827',
//   },
//   textArea: {
//     minHeight: 80,
//     textAlignVertical: 'top',
//   },
//   switchGroup: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
// modalFooter: {
//   flexDirection: 'row',
//   gap: 12,
//   padding: 16,
//   borderTopWidth: 1,
//   borderTopColor: '#e5e7eb',
// },
// modalButton: {
//   flex: 1,
//   paddingVertical: 12,
//   borderRadius: 8,
//   alignItems: 'center',
// },
// modalButtonPrimary: {
//   backgroundColor: '#3B82F6',
// },
// modalButtonSecondary: {
//   backgroundColor: 'transparent',
//   borderWidth: 1,
//   borderColor: '#d1d5db',
// },
// modalButtonTextPrimary: {
//   color: 'white',
//   fontSize: 16,
//   fontWeight: '600',
// },
// modalButtonTextSecondary: {
//   color: '#6b7280',
//   fontSize: 16,
//   fontWeight: '600',
// },

//   /* ------------------------------
//      ONLY Custom Dropdown styles
//   ------------------------------ */
//   dropdownSheet: {
//     position: 'absolute',
//     top: 52,
//     left: 0,
//     right: 0,
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     borderRadius: 10,
//     zIndex: 100,
//     overflow: 'hidden',
//   },
//   dropdownHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F1F5F9',
//   },
//   dropdownSearch: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     backgroundColor: '#fff',
//   },
//   dropdownClose: {
//     marginLeft: 8,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//     backgroundColor: '#F1F5F9',
//   },
//   dropdownItem: {
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F8FAFC',
//   },
//   dropdownItemText: {
//     color: '#0f172a',
//     fontSize: 14,
//   },
//   dropdownLoader: {paddingVertical: 12, alignItems: 'center'},
//   dropdownLoadMore: {paddingVertical: 10, alignItems: 'center'},
//   dropdownLoadMoreText: {color: '#2563EB', fontWeight: '600'},
// });

// export default JobTimesheet;

// JobTimesheet.js

// import React, {useState, useMemo, useEffect} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   StyleSheet,
//   Alert,
//   StatusBar,
//   SafeAreaView,
//   Modal,
//   Switch,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
// } from 'react-native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import Feather from 'react-native-vector-icons/Feather';
// import axios from 'axios';
// import {useSelector} from 'react-redux';
// import {getAllLabor, submitBluesheetComplete} from '../config/apiConfig';

// /* ======================
//    THEME
// ====================== */
// const Colors = {
//   primary: '#3B82F6',
//   primaryLight: '#EBF4FF',
//   white: '#FFFFFF',
// };
// const Spacing = {sm: 8, xs: 4};

// /* ======================
//    HELPERS
// ====================== */
// const debounce = (fn, delay = 400) => {
//   let t;
//   return (...args) => {
//     clearTimeout(t);
//     t = setTimeout(() => fn(...args), delay);
//   };
// };
// const sameDay = (isoA, isoB) => {
//   try {
//     const a = new Date(isoA);
//     const b = new Date(isoB);
//     return (
//       a.getFullYear() === b.getFullYear() &&
//       a.getMonth() === b.getMonth() &&
//       a.getDate() === b.getDate()
//     );
//   } catch {
//     return false;
//   }
// };
// const secToHoursStr = (sec = 0) =>
//   `${Math.max(0, Math.floor(Number(sec || 0) / 3600))}h`;

// // huors format
// const toHoursDecimal = timeStr => {
//   if (!timeStr || typeof timeStr !== 'string') return 0;
//   const [h, m, s] = timeStr.split(':').map(Number);
//   return +(h + m / 60 + s / 3600).toFixed(2);
// };

// /* ======================
//    SEARCH DROPDOWN
// ====================== */
// const LabourSearchDropdown = ({token, selectedEmployee, onSelectEmployee}) => {
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

// /* ======================
//    LABOUR MODAL
// ====================== */
// const LabourModal = ({
//   visible,
//   setShowAddLabour,
//   editingLabour,
//   setEditingLabour,
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
//       setEditingLabour(null);
//       setTempLabourData({});
//     }}>
//     <View style={styles.modalOverlay}>
//       <View style={styles.modalContent}>
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//           keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
//           <ScrollView
//             contentContainerStyle={styles.modalBody}
//             keyboardShouldPersistTaps="handled">
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>
//                 {editingLabour ? 'Edit Labour Entry' : 'Add Labour Entry'}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowAddLabour(false);
//                   setEditingLabour(null);
//                   setTempLabourData({});
//                 }}>
//                 <Text style={styles.modalCloseButton}>✕</Text>
//               </TouchableOpacity>
//             </View>

//             <View style={styles.formGroup}>
//               <Text style={styles.formLabel}>Employee</Text>
//               <LabourSearchDropdown
//                 token={token}
//                 selectedEmployee={
//                   tempLabourData.employeeId
//                     ? {
//                         id: tempLabourData.employeeId,
//                         label: tempLabourData.employeeName,
//                       }
//                     : null
//                 }
//                 onSelectEmployee={emp =>
//                   setTempLabourData(prev => ({
//                     ...prev,
//                     employeeName: emp.label,
//                     employeeId: emp.id,
//                     _selectedEmployee: emp.raw,
//                   }))
//                 }
//               />
//             </View>

//             <View style={styles.formGroup}>
//               <Text style={styles.formLabel}>Regular Hours</Text>
//               <TextInput
//                 style={styles.formInput}
//                 keyboardType="numeric"
//                 value={
//                   tempLabourData.regularHours === '' ||
//                   tempLabourData.regularHours === undefined
//                     ? ''
//                     : String(tempLabourData.regularHours)
//                 }
//                 onChangeText={text =>
//                   setTempLabourData(prev => ({
//                     ...prev,
//                     regularHours: text === '' ? '' : parseFloat(text) || 0,
//                   }))
//                 }
//               />
//             </View>
//           </ScrollView>

//           <View style={styles.modalFooter}>
//             <TouchableOpacity
//               style={[styles.modalButton, styles.modalButtonSecondary]}
//               onPress={() => {
//                 setShowAddLabour(false);
//                 setEditingLabour(null);
//                 setTempLabourData({});
//               }}>
//               <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.modalButton, styles.modalButtonPrimary]}
//               onPress={handleSaveLabour}>
//               <Text style={styles.modalButtonTextPrimary}>Save</Text>
//             </TouchableOpacity>
//           </View>
//         </KeyboardAvoidingView>
//       </View>
//     </View>
//   </Modal>
// );

// /* ======================
//    MATERIAL MODAL
// ====================== */
// const MaterialModal = ({
//   visible,
//   onClose,
//   tempMaterialData,
//   setTempMaterialData,
//   editingMaterial,
//   setEditingMaterial,
//   handleSaveMaterial,
//   setShowAddMaterial,
// }) => (
//   <Modal visible={visible} animationType="slide" transparent>
//     <View style={styles.modalOverlay}>
//       <View style={styles.modalContent}>
//         <View style={styles.modalHeader}>
//           <Text style={styles.modalTitle}>
//             {editingMaterial ? 'Edit Material Entry' : 'Add Material Entry'}
//           </Text>
//           <TouchableOpacity onPress={onClose}>
//             <Text style={styles.modalCloseButton}>✕</Text>
//           </TouchableOpacity>
//         </View>

//         <ScrollView style={styles.modalBody}>
//           <View style={styles.formGroup}>
//             <Text style={styles.formLabel}>Material Name</Text>
//             <TextInput
//               style={styles.formInput}
//               placeholder="Enter material name"
//               value={tempMaterialData.name || ''}
//               onChangeText={text =>
//                 setTempMaterialData(prev => ({...prev, name: text}))
//               }
//             />
//           </View>

//           <View style={styles.formGroup}>
//             <Text style={styles.formLabel}>Unit</Text>
//             <TextInput
//               style={styles.formInput}
//               placeholder="pieces, feet, etc."
//               value={tempMaterialData.unit || ''}
//               onChangeText={text =>
//                 setTempMaterialData(prev => ({...prev, unit: text}))
//               }
//             />
//           </View>

//           <View style={styles.formGroup}>
//             <Text style={styles.formLabel}>Total Ordered</Text>
//             <TextInput
//               style={styles.formInput}
//               keyboardType="numeric"
//               value={
//                 tempMaterialData.totalOrdered === undefined
//                   ? ''
//                   : String(tempMaterialData.totalOrdered)
//               }
//               onChangeText={text =>
//                 setTempMaterialData(prev => ({
//                   ...prev,
//                   totalOrdered: text === '' ? '' : parseFloat(text) || 0,
//                 }))
//               }
//             />
//           </View>

//           <View style={styles.formGroup}>
//             <Text style={styles.formLabel}>Quantity Used</Text>
//             <TextInput
//               style={styles.formInput}
//               keyboardType="numeric"
//               value={
//                 tempMaterialData.amountUsed === undefined
//                   ? ''
//                   : String(tempMaterialData.amountUsed)
//               }
//               onChangeText={text =>
//                 setTempMaterialData(prev => ({
//                   ...prev,
//                   amountUsed: text === '' ? '' : parseFloat(text) || 0,
//                 }))
//               }
//             />
//           </View>

//           <View style={styles.formGroup}>
//             <Text style={styles.formLabel}>Unit Cost</Text>
//             <TextInput
//               style={styles.formInput}
//               keyboardType="numeric"
//               value={
//                 tempMaterialData.unitCost === undefined
//                   ? ''
//                   : String(tempMaterialData.unitCost)
//               }
//               onChangeText={text =>
//                 setTempMaterialData(prev => ({
//                   ...prev,
//                   unitCost: text === '' ? '' : parseFloat(text) || 0,
//                 }))
//               }
//             />
//           </View>
// {/*
//           <View style={styles.formGroup}>
//             <Text style={styles.formLabel}>Supplier Order ID</Text>
//             <TextInput
//               style={styles.formInput}
//               placeholder="Enter order ID"
//               value={tempMaterialData.supplierOrderId || ''}
//               onChangeText={text =>
//                 setTempMaterialData(prev => ({...prev, supplierOrderId: text}))
//               }
//             />
//           </View>

//           <View style={styles.switchGroup}>
//             <Text style={styles.formLabel}>Return to Warehouse</Text>
//             <Switch
//               value={!!tempMaterialData.returnToWarehouse}
//               onValueChange={value =>
//                 setTempMaterialData(prev => ({
//                   ...prev,
//                   returnToWarehouse: value,
//                 }))
//               }
//               trackColor={{false: '#e5e7eb', true: '#3B82F6'}}
//               thumbColor={
//                 tempMaterialData.returnToWarehouse ? '#ffffff' : '#f4f3f4'
//               }
//             />
//           </View> */}
//         </ScrollView>

//         <View style={styles.modalFooter}>
//           <TouchableOpacity
//             style={[styles.modalButton, styles.modalButtonSecondary]}
//             onPress={() => {
//               setShowAddMaterial(false);
//               setEditingMaterial(null);
//               setTempMaterialData({});
//             }}>
//             <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.modalButton, styles.modalButtonPrimary]}
//             onPress={handleSaveMaterial}>
//             <Text style={styles.modalButtonTextPrimary}>Save</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   </Modal>
// );

// /* ======================
//    MAIN SCREEN
// ====================== */
// const JobTimesheet = ({navigation, route, user}) => {
//   const {timesheet} = route?.params || {};
//   const {job} = route?.params || {};
//   const token = useSelector(state => state.user.token);

//   const [editingLabour, setEditingLabour] = useState(null);
//   const [editingMaterial, setEditingMaterial] = useState(null);
//   const [showAddLabour, setShowAddLabour] = useState(false);
//   const [showAddMaterial, setShowAddMaterial] = useState(false);
//   const [hasSubmittedToday, setHasSubmittedToday] = useState(false);

//   const [timesheetData, setTimesheetData] = useState(() => {
//     if (timesheet) {
//       return {
//         id: timesheet.id,
//         jobId: timesheet.jobId,
//         date: timesheet.date,
//         status: timesheet.status || 'draft',
//         jobNotes: timesheet.jobNotes || 'Main electrical work and installation',
//         submittedAt: timesheet.submittedAt,
//         approvedAt: timesheet.approvedAt,
//         approvedBy: timesheet.approvedBy,
//         rejectionReason: timesheet.rejectionReason,
//         labourEntries: [], // local edits/new
//         materialEntries: [], // local edits/new
//         additionalCharges: [], // optional
//       };
//     }
//     return {
//       id: `timesheet-${job?.id || 'new'}-${
//         new Date().toISOString().split('T')[0]
//       }`,
//       jobId: job?.id || 'unknown',
//       date: new Date().toISOString().split('T')[0],
//       status: 'draft',
//       jobNotes: 'Main electrical work and installation',
//       labourEntries: [],
//       materialEntries: [],
//       additionalCharges: [],
//     };
//   });

//   /* ========= MAP JOB to API (ORIGINAL, as displayed) ========= */
//   const jobLaborTodayToApi = entry => {
//     const isLead = !!entry?.lead_labor;
//     const id = entry?.lead_labor?.id ?? entry?.labor?.id ?? null;
//     const name =
//       entry?.lead_labor?.users?.full_name ??
//       entry?.labor?.users?.full_name ??
//       'Unknown';
//     return {
//       __key: String(entry.id), // for merge by id
//       ...(isLead ? {lead_labor_id: id} : {labor_id: id}),
//       employee_name: name,
//       role: isLead ? 'lead_labor' : 'labor',
//       regular_hours: entry?.work_activity || 0,
//       overtime_hours: '0h',
//       hourly_rate: Number(isLead ? 35 : 28), // adjust if needed
//     };
//   };

//   const jobMaterialTodayToApi = it => ({
//     __key: String(it.id), // for merge by id
//     product_id: it?.product?.id ?? null,
//     material_name: it?.product?.product_name,
//     quantity: Number(it?.product?.stock_quantity) || 0,
//     unit: it?.product?.unit || 'pieces',
//     total_ordered: Number(it?.product?.stock_quantity) || 0,
//     material_used: Number(it?.quantity) || 0,
//     supplier_order_id: it?.product?.supplier_order_id || null,
//     return_to_warehouse: false,
//     unit_cost: Number(it?.unit_cost) || 0,
//   });

//   /* ========= MAP LOCAL (ADDED/EDITED) to API ========= */
//   const localLaborToApi = l => {
//     const isLead = (l.role || 'labor')
//       .toString()
//       .toLowerCase()
//       .includes('lead');
//     return {
//       __key: String(l.id), // ID preserved to overwrite originals
//       ...(isLead
//         ? {
//             lead_labor_id: isNaN(Number(l.employeeId))
//               ? l.employeeId
//               : Number(l.employeeId),
//           }
//         : {
//             labor_id: isNaN(Number(l.employeeId))
//               ? l.employeeId
//               : Number(l.employeeId),
//           }),
//       employee_name: l.employeeName,
//       role: isLead ? 'lead_labor' : 'labor',
//       regular_hours: `${Number(l.regularHours || 0)}h`,
//       overtime_hours: `${Number(l.overtimeHours || 0)}h`,
//       hourly_rate: Number(l.regularRate || 0),
//     };
//   };

//   const localMaterialToApi = m => ({
//     __key: String(m.id),
//     product_id:
//       m.productId !== undefined
//         ? isNaN(Number(m.productId))
//           ? m.productId
//           : Number(m.productId)
//         : null,
//     material_name: m.name,
//     quantity: Number(m.totalOrdered) || 0,
//     unit: m.unit || 'pieces',
//     total_ordered: Number(m.totalOrdered) || 0,
//     material_used: Number(m.amountUsed) || 0,
//     supplier_order_id: m.supplierOrderId || null,
//     return_to_warehouse: !!m.returnToWarehouse,
//     unit_cost: Number(m.unitCost) || 0,
//   });

//   /* ========= BUILD PAYLOAD (MERGE BOTH SOURCES) ========= */
//   const buildBluesheetPayload = () => {
//     // Additional charges total
//     const additionalCharges = (timesheetData.additionalCharges || []).reduce(
//       (sum, c) => sum + (Number(c.amount) || 0),
//       0,
//     );

//     // JOB original (today only)
//     const jobLaborToday = (job?.labor_timesheets || [])
//       .filter(e =>
//         e?.created_at ? sameDay(e.created_at, timesheetData.date) : false,
//       )
//       .map(jobLaborTodayToApi);

//     const jobMaterialToday = (job?.orders?.[0]?.items || [])
//       .filter(it =>
//         it?.created_at ? sameDay(it.created_at, timesheetData.date) : false,
//       )
//       .map(jobMaterialTodayToApi);

//     // LOCAL (added/edited)
//     const localLabor = (timesheetData.labourEntries || []).map(localLaborToApi);
//     const localMaterial = (timesheetData.materialEntries || []).map(
//       localMaterialToApi,
//     );

//     // Merge by __key (id). Local overwrites job originals if same id.
//     const laborMap = new Map();
//     jobLaborToday.forEach(e => laborMap.set(e.__key, e));
//     localLabor.forEach(e => laborMap.set(e.__key, e));
//     const labor_entries = Array.from(laborMap.values()).map(
//       ({__key, ...rest}) => rest,
//     );

//     const materialMap = new Map();
//     jobMaterialToday.forEach(e => materialMap.set(e.__key, e));
//     localMaterial.forEach(e => materialMap.set(e.__key, e));
//     const material_entries = Array.from(materialMap.values()).map(
//       ({__key, ...rest}) => rest,
//     );

//     const payload = {
//       job_id: isNaN(Number(timesheetData.jobId || job?.id))
//         ? timesheetData.jobId || job?.id
//         : Number(timesheetData.jobId || job?.id),
//       date: timesheetData.date,
//       notes: timesheetData.jobNotes || '',
//       additional_charges: Number(additionalCharges.toFixed(2)),
//       labor_entries,
//       material_entries,
//     };

//     console.log('FINAL_PAYLOAD_TO_API::', JSON.stringify(payload, null, 2));
//     return payload;
//   };

//   /* ========= HANDLERS ========= */
//   const handleAddLabour = () => {
//     setTempLabourData({
//       id: `labour-${Date.now()}`,
//       employeeName: '',
//       employeeId: '',
//       role: 'Labor',
//       regularHours: 0,
//       overtimeHours: 0,
//       regularRate: 28,
//       overtimeRate: 42,
//       totalCost: 0,
//       notes: '',
//     });
//     setShowAddLabour(true);
//   };

//   const [tempLabourData, setTempLabourData] = useState({});
//   const [tempMaterialData, setTempMaterialData] = useState({});
//   console.log('tempLabourData>>>', tempLabourData);

//   const handleSaveLabour = () => {
//     if (!tempLabourData.employeeName || !tempLabourData.employeeId) {
//       Alert.alert('Error', 'Please select an employee');
//       return;
//     }
//     const newEntry = {...tempLabourData};
//     setTimesheetData(prev => {
//       const exists = prev.labourEntries.some(e => e.id === newEntry.id);
//       return {
//         ...prev,
//         labourEntries: exists
//           ? prev.labourEntries.map(e => (e.id === newEntry.id ? newEntry : e))
//           : [...prev.labourEntries, newEntry],
//       };
//     });
//     setShowAddLabour(false);
//     setTempLabourData({});
//   };

//   const handleAddMaterial = () => {
//     setTempMaterialData({
//       id: `material-${Date.now()}`,
//       name: '',
//       unit: 'pieces',
//       totalOrdered: 0,
//       amountUsed: 0,
//       amountRemaining: 0,
//       unitCost: 0,
//       totalCost: 0,
//       supplierOrderId: '',
//       returnToWarehouse: false,
//     });
//     setShowAddMaterial(true);
//   };

//   const handleSaveMaterial = () => {
//     if (!tempMaterialData.name) {
//       Alert.alert('Error', 'Please fill in material name');
//       return;
//     }
//     const newEntry = {...tempMaterialData};
//     setTimesheetData(prev => {
//       const exists = prev.materialEntries.some(e => e.id === newEntry.id);
//       return {
//         ...prev,
//         materialEntries: exists
//           ? prev.materialEntries.map(e => (e.id === newEntry.id ? newEntry : e))
//           : [...prev.materialEntries, newEntry],
//       };
//     });
//     setShowAddMaterial(false);
//     setTempMaterialData({});
//   };

//   const handleSubmitForApproval = async () => {
//     try {
//       const payload = buildBluesheetPayload();
//       console.log('payloadpayload', payload);

//       if (!payload.labor_entries.length && !payload.material_entries.length) {
//         Alert.alert('Empty', 'Nothing to submit for the selected date.');
//         return;
//       }

//       const res = await submitBluesheetComplete(payload, token);

//       setTimesheetData(prev => ({
//         ...prev,
//         status: 'submitted',
//         submittedAt: new Date().toISOString(),
//         rejectionReason: undefined,
//       }));
//       setHasSubmittedToday(true);
//       Alert.alert('Success', 'Bluesheet submitted for approval');
//     } catch (err) {
//       const msg = err?.message || 'Failed to submit bluesheet';
//       // Duplicate same-day handling via server error text/code (optional soft-guard)
//       if (
//         /already.*submitted|duplicate/i.test(
//           String(err?.message || err?.error || ''),
//         )
//       ) {
//         setHasSubmittedToday(true);
//         setTimesheetData(prev => ({
//           ...prev,
//           status: 'submitted',
//           submittedAt: prev.submittedAt || new Date().toISOString(),
//         }));
//         Alert.alert(
//           'Already Submitted',
//           'A bluesheet for today is already submitted.',
//         );
//         return;
//       }
//       Alert.alert('Error', msg);
//     }
//   };

//   const handleBack = () => navigation.goBack();
//   const formatDate = d =>
//     new Date(d).toLocaleDateString('en-US', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   const formatToHMS = s => {
//     const hrs = String(Math.floor((s || 0) / 3600)).padStart(2, '0');
//     const mins = String(Math.floor(((s || 0) % 3600) / 60)).padStart(2, '0');
//     const secs = String((s || 0) % 60).padStart(2, '0');
//     return `${hrs}:${mins}:${secs}`;
//   };

//   const canEdit = () =>
//     timesheetData.status === 'draft' ||
//     (user?.role === 'Lead Labor' && timesheetData.status === 'submitted') ||
//     timesheetData.status === 'rejected';
//   const isReadOnly = () => timesheetData.status === 'approved';

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar backgroundColor="#3B82F6" barStyle="light-content" />
//       <View style={styles.header}>
//         <View style={styles.headerTop}>
//           <TouchableOpacity style={styles.backButton} onPress={handleBack}>
//             <MaterialIcons name="arrow-back" size={24} color="#fff" />
//           </TouchableOpacity>
//           <View style={styles.headerCenter}>
//             <Text style={styles.headerTitle}>Job Bluesheet</Text>
//             <Text style={styles.headerSubtitle}>
//               {formatDate(timesheetData.date)}
//             </Text>
//           </View>
//           <TouchableOpacity style={styles.addButton} />
//         </View>
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         <View style={styles.statusCard}>
//           {hasSubmittedToday && (
//             <View style={[styles.approvalInfo, {marginBottom: 8}]}>
//               <Text style={styles.approvalIcon}>ℹ️</Text>
//               <View style={styles.approvalText}>
//                 <Text style={styles.approvalTitle}>
//                   Today’s bluesheet has been submitted
//                 </Text>
//                 <Text style={styles.approvalDetails}>
//                   You can’t submit more than one bluesheet for{' '}
//                   {formatDate(timesheetData.date)}.
//                 </Text>
//               </View>
//             </View>
//           )}
//         </View>

//         {/* LABOUR */}
//         <View style={styles.sectionCard}>
//           <View style={styles.sectionHeader}>
//             <Feather name="clock" size={20} color={Colors.primary} />
//             <Text style={styles.sectionTitle}>Labour Hours</Text>
//             {canEdit() && !isReadOnly() && (
//               <TouchableOpacity
//                 style={styles.addButton}
//                 onPress={handleAddLabour}>
//                 <Text style={styles.addButtonText}>+</Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           <View style={styles.tableContainer}>
//             <View style={styles.tableHeader}>
//               <Text style={[styles.tableHeaderText, {flex: 1}]}>Employee</Text>
//               <Text style={[styles.tableHeaderText, {flex: 1, marginLeft: 20}]}>
//                 Role
//               </Text>
//               <Text style={[styles.tableHeaderText, {flex: 1}]}>Reg.hrs</Text>
//               {canEdit() && !isReadOnly() && (
//                 <Text style={[styles.tableHeaderText, {flex: 1}]}>Actions</Text>
//               )}
//             </View>

//             {(job?.labor_timesheets || [])
//               .filter(e =>
//                 e?.created_at
//                   ? sameDay(e.created_at, timesheetData.date)
//                   : true,
//               )
//               .map(entry => (
//                 <View key={entry.id} style={styles.tableRow}>
//                   <Text style={[styles.tableCell, {flex: 1}]}>
//                     {entry?.lead_labor?.users?.full_name ??
//                       entry?.labor?.users?.full_name}
//                   </Text>
//                   <Text style={[styles.tableCell, {flex: 1, marginLeft: 5}]}>
//                     {entry?.lead_labor ? 'Lead Labor' : 'Labor'}
//                   </Text>
//                   <Text style={[styles.tableCell, {flex: 1}]}>
//                     {entry?.work_activity || 0}
//                   </Text>
//                   {canEdit() && !isReadOnly() && (
//                     <View
//                       style={[
//                         styles.tableCell,
//                         {flex: 1, flexDirection: 'row'},
//                       ]}>
//                       <TouchableOpacity
//                         style={styles.editButton}
//                         onPress={() => {
//                           setTempLabourData({
//                             id: entry.id,
//                             employeeName:
//                               entry?.lead_labor?.users?.full_name ??
//                               entry?.labor?.users?.full_name,
//                             employeeId:
//                               entry?.lead_labor?.id ?? entry?.labor?.id ?? '',
//                             role: entry?.lead_labor ? 'Lead Labor' : 'Labor',
//                             regularHours:
//                               toHoursDecimal(entry.work_activity) || 0,
//                             overtimeHours: 0,
//                             regularRate: entry?.lead_labor ? 35 : 28,
//                             overtimeRate: entry?.lead_labor ? 52.5 : 42,
//                           });
//                           setEditingLabour(entry.id);
//                           setShowAddLabour(true);
//                         }}>
//                         <MaterialIcons
//                           name="edit"
//                           size={20}
//                           color={Colors.primary}
//                         />
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                         style={styles.deleteButton}
//                         // onPress={() => handleDeleteMaterial(material.id)}
//                       >
//                         <MaterialIcons
//                           name="delete"
//                           size={20}
//                           color={'#dc2626'}
//                         />
//                       </TouchableOpacity>
//                     </View>
//                   )}
//                 </View>
//               ))}

//             {timesheetData.labourEntries.map(entry => (
//               <View key={entry.id} style={styles.tableRow}>
//                 <Text style={[styles.tableCell, {flex: 1}]}>
//                   {entry.employeeName}
//                 </Text>
//                 <Text style={[styles.tableCell, {flex: 1}]}>
//                   {entry.role || 'Labor'}
//                 </Text>
//                 <Text style={[styles.tableCell, {flex: 1}]}>
//                   {entry.regularHours}
//                 </Text>
//                 {canEdit() && !isReadOnly() && (
//                   <View
//                     style={[styles.tableCell, {flex: 1, flexDirection: 'row'}]}>
//                     <TouchableOpacity
//                       style={styles.editButton}
//                       onPress={() => {
//                         setTempLabourData(entry);
//                         setEditingLabour(entry.id);
//                         setShowAddLabour(true);
//                       }}>
//                       <MaterialIcons
//                         name="edit"
//                         size={20}
//                         color={Colors.primary}
//                       />
//                     </TouchableOpacity>
//                   </View>
//                 )}
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* MATERIALS */}
//         <View style={styles.sectionCard}>
//           <View style={styles.sectionHeader}>
//             <Feather name="box" size={20} color={Colors.primary} />
//             <Text style={styles.sectionTitle}>Materials</Text>
//           </View>

//           <View style={styles.tableContainer}>
//             <View style={styles.tableHeader}>
//               <Text style={[styles.tableHeaderText, {flex: 1}]}>Title</Text>
//               <Text style={[styles.tableHeaderText, {flex: 1}]}>Qty</Text>
//               <Text style={[styles.tableHeaderText, {flex: 1}]}>Used</Text>
//               {canEdit() && !isReadOnly() && (
//                 <Text style={[styles.tableHeaderText, {flex: 1}]}>Actions</Text>
//               )}
//             </View>

//             {(job?.orders || [])
//               .filter(it =>
//                 it?.created_at
//                   ? sameDay(it.created_at, timesheetData.date)
//                   : true,
//               )
//               .map(material => (
//                 <View key={material.id} style={styles.tableRow}>
//                   <Text style={[styles.tableCell, {flex: 1}]}>
//                     {material?.items?.[0]?.product?.product_name}
//                   </Text>
//                   <Text style={[styles.tableCell, {flex: 1}]}>
//                     {material?.items?.[0]?.quantity}{' '}
//                     {material?.items?.[0]?.product?.unit}
//                   </Text>
//                   <Text style={[styles.tableCell, {flex: 1}]}>
//                     {material?.items?.[0]?.quantity} {material?.items?.[0]?.product?.unit}
//                   </Text>
//                   {canEdit() && !isReadOnly() && (
//                     <View
//                       style={[
//                         styles.tableCell,
//                         {flex: 1, flexDirection: 'row'},
//                       ]}>
//                       <TouchableOpacity
//                         style={styles.editButton}
//                         onPress={() => {
//                           setTempMaterialData({
//                             id: material.id,
//                             name: material?.product?.product_name || '',
//                             unit: material?.product?.unit || 'pieces',
//                             totalOrdered:
//                               Number(material?.product?.stock_quantity) || 0,
//                             amountUsed: Number(material?.quantity) || 0,
//                             unitCost: Number(material?.unit_cost) || 0,
//                             productId: material?.product?.id ?? null,
//                             supplierOrderId:
//                               material?.product?.supplier_order_id || '',
//                             returnToWarehouse: false,
//                           });
//                           setEditingMaterial(material.id);
//                           setShowAddMaterial(true);
//                         }}>
//                         <MaterialIcons
//                           name="edit"
//                           size={20}
//                           color={Colors.primary}
//                         />
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                         style={styles.deleteButton}
//                         // onPress={() => handleDeleteMaterial(material.id)}
//                       >
//                         <MaterialIcons
//                           name="delete"
//                           size={20}
//                           color={'#dc2626'}
//                         />
//                       </TouchableOpacity>
//                     </View>
//                   )}
//                 </View>
//               ))}

//             {timesheetData.materialEntries.map(material => (
//               <View key={material.id} style={styles.tableRow}>
//                 <Text style={[styles.tableCell, {flex: 1}]}>
//                   {material.name}
//                 </Text>
//                 <Text style={[styles.tableCell, {flex: 1}]}>
//                   {material.totalOrdered} {material.unit}
//                 </Text>
//                 <Text style={[styles.tableCell, {flex: 1}]}>
//                   {material.amountUsed} {material.unit}
//                 </Text>
//                 {canEdit() && !isReadOnly() && (
//                   <View
//                     style={[styles.tableCell, {flex: 1, flexDirection: 'row'}]}>
//                     <TouchableOpacity
//                       style={styles.editButton}
//                       onPress={() => {
//                         setTempMaterialData(material);
//                         setEditingMaterial(material.id);
//                         setShowAddMaterial(true);
//                       }}>
//                       <MaterialIcons
//                         name="edit"
//                         size={20}
//                         color={Colors.primary}
//                       />
//                     </TouchableOpacity>
//                   </View>
//                 )}
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* NOTES + SUBMIT */}
//         <View style={styles.sectionCard}>
//           <View style={styles.sectionHeader}>
//             <MaterialIcons name="edit-note" size={24} color={Colors.primary} />
//             <Text style={styles.sectionTitle}>Job Notes</Text>
//           </View>
//           <TextInput
//             style={styles.notesInput}
//             value={timesheetData.jobNotes}
//             onChangeText={text =>
//               setTimesheetData(prev => ({...prev, jobNotes: text}))
//             }
//             placeholder="Add any additional notes about the job..."
//             multiline
//             numberOfLines={4}
//           />
//         </View>

//         <View style={styles.sectionCard}>
//           <View style={styles.sectionHeader}>
//             <MaterialIcons name="summarize" size={24} color={Colors.primary} />
//             <Text style={styles.sectionTitle}>Summary</Text>
//           </View>
//           <View style={styles.summaryBreakdown}>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Total Labour:</Text>
//               <Text style={styles.summaryValue}>
//                 {job?.labor_timesheets?.length +
//                   timesheetData.labourEntries.length}
//               </Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Material:</Text>
//               <Text style={styles.summaryValue}>
//                 {(job?.orders?.[0]?.items?.length || 0) +
//                   timesheetData.materialEntries.length}
//               </Text>
//             </View>
//             <View style={styles.summaryDivider} />
//           </View>
//           <View style={styles.actionButtons}>
//             <TouchableOpacity
//               style={styles.submitButton}
//               onPress={handleSubmitForApproval}>
//               <Text style={styles.submitButtonText}>Submit for Approval</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={{height: 28}} />
//       </ScrollView>

//       {/* Modals */}
//       <LabourModal
//         visible={showAddLabour}
//         setShowAddLabour={setShowAddLabour}
//         editingLabour={editingLabour}
//         setEditingLabour={setEditingLabour}
//         tempLabourData={tempLabourData}
//         setTempLabourData={setTempLabourData}
//         handleSaveLabour={handleSaveLabour}
//         token={token}
//       />
//       <MaterialModal
//         visible={showAddMaterial}
//         onClose={() => setShowAddMaterial(false)}
//         tempMaterialData={tempMaterialData}
//         setTempMaterialData={setTempMaterialData}
//         editingMaterial={editingMaterial}
//         setEditingMaterial={setEditingMaterial}
//         handleSaveMaterial={handleSaveMaterial}
//         setShowAddMaterial={setShowAddMaterial}
//       />
//     </SafeAreaView>
//   );
// };

// /* ======================
//    STYLES
// ====================== */
// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: '#f9fafb'},
//   header: {backgroundColor: Colors.primary, paddingTop: Spacing.sm},
//   headerTop: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: Spacing.sm,
//   },
//   backButton: {padding: Spacing.sm},
//   headerCenter: {alignItems: 'center', flex: 1},
//   headerTitle: {fontSize: 20, fontWeight: 'bold', color: Colors.white},
//   headerSubtitle: {
//     fontSize: 14,
//     color: Colors.primaryLight,
//     marginTop: Spacing.xs,
//   },
//   addButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#3B82F6',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   addButtonText: {fontSize: 18, color: '#fff', fontWeight: '600'},
//   content: {flex: 1},
//   statusCard: {margin: 16},
//   approvalInfo: {
//     backgroundColor: '#dcfce7',
//     borderLeftWidth: 4,
//     borderLeftColor: '#16a34a',
//     padding: 12,
//     borderRadius: 8,
//     flexDirection: 'row',
//   },
//   approvalIcon: {fontSize: 20, marginRight: 12},
//   approvalText: {flex: 1},
//   approvalTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#16a34a',
//     marginBottom: 4,
//   },
//   approvalDetails: {fontSize: 14, color: '#16a34a'},
//   sectionCard: {
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     marginBottom: 16,
//     padding: 16,
//     borderRadius: 12,
//     elevation: 3,
//   },
//   sectionHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: 16},
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#3B82F6',
//     flex: 1,
//     marginLeft: 10,
//   },
//   notesInput: {
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     backgroundColor: '#f9fafb',
//     textAlignVertical: 'top',
//     minHeight: 96,
//   },
//   actionButtons: {gap: 12},
//   submitButton: {
//     backgroundColor: '#3B82F6',
//     paddingVertical: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   submitButtonText: {color: '#fff', fontSize: 16, fontWeight: '600'},
//   tableContainer: {
//     marginTop: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     overflow: 'hidden',
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     backgroundColor: '#f3f4f6',
//     paddingVertical: 8,
//     paddingHorizontal: 6,
//   },
//   tableHeaderText: {fontWeight: 'bold', fontSize: 14, color: '#111'},
//   tableRow: {
//     flexDirection: 'row',
//     borderTopWidth: 1,
//     borderColor: '#eee',
//     paddingVertical: 8,
//     paddingHorizontal: 6,
//     alignItems: 'center',
//   },
//   tableCell: {fontSize: 14, color: '#333'},

//   // Modals
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     margin: 20,
//     maxHeight: '80%',
//     width: '90%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   modalTitle: {fontSize: 18, fontWeight: '600', color: '#111827'},
//   modalCloseButton: {fontSize: 18, color: '#6b7280', padding: 8},
//   modalBody: {padding: 16},
//   formGroup: {marginBottom: 16},
//   formLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: 8,
//   },
//   formInput: {
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     color: '#111827',
//   },
//   switchGroup: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },

//   // Dropdown
//   dropdownSheet: {
//     position: 'absolute',
//     top: 52,
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     borderRadius: 10,
//     zIndex: 100,
//     overflow: 'hidden',
//   },
//   dropdownItem: {
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F8FAFC',
//   },
//   summaryBreakdown: {
//     marginBottom: 24,
//   },
//   deleteButton: {paddingHorizontal: 8},
//   summaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   summaryLabel: {
//     fontSize: 16,
//     color: '#6b7280',
//   },
//   summaryValue: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   summaryDivider: {
//     height: 1,
//     backgroundColor: '#e5e7eb',
//     marginVertical: 12,
//   },
//   dropdownItemText: {color: '#0f172a', fontSize: 14},
//   dropdownLoader: {paddingVertical: 12, alignItems: 'center'},
//   dropdownLoadMore: {paddingVertical: 10, alignItems: 'center'},
//   dropdownLoadMoreText: {color: '#2563EB', fontWeight: '600'},
//   modalFooter: {
//     flexDirection: 'row',
//     gap: 12,
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#e5e7eb',
//   },
//   modalButton: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   modalButtonPrimary: {
//     backgroundColor: '#3B82F6',
//   },
//   modalButtonSecondary: {
//     backgroundColor: 'transparent',
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//   },
//   modalButtonTextPrimary: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   modalButtonTextSecondary: {
//     color: '#6b7280',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default JobTimesheet;
// JobTimesheet.js
// Regular Hours: input = decimal hours only (e.g., 8, 2.5), display + payload = HH:MM:SS
// Per job+date storage keys; seed from route; one-submit-per-day lock

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
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {getAllLabor, submitBluesheetComplete} from '../config/apiConfig';

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
const sameDay = (isoA, isoB) => {
  try {
    const a = new Date(isoA);
    const b = new Date(isoB);
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  } catch {
    return false;
  }
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
const LabourSearchDropdown = ({token, selectedEmployee, onSelectEmployee}) => {
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
        onFocus={() => setOpen(true)}
        onChangeText={txt => {
          if (!open) setOpen(true);
          debouncedSetQuery(txt);
          setQuery(txt);
        }}
      />
      {open && (
        <View style={styles.dropdownSheet}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={{maxHeight: 240}}>
            {filtered?.map(emp => {
              const label =
                emp?.users?.full_name || emp?.name || 'Unknown Employee';
              const id = emp?.id || emp?._id || emp?.employee_id || '';
              return (
                <TouchableOpacity
                  key={String(id)}
                  style={styles.dropdownItem}
                  onPress={() => {
                    onSelectEmployee({id, label, raw: emp});
                    setQuery(label);
                    setOpen(false);
                  }}>
                  <Text style={styles.dropdownItemText}>{label}</Text>
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
const LabourModal = ({
  visible,
  setShowAddLabour,
  tempLabourData,
  setTempLabourData,
  handleSaveLabour,
  token,
}) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent
    onRequestClose={() => {
      setShowAddLabour(false);
      setTempLabourData({});
    }}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
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
                }}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Employee</Text>
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
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                Regular Hours (e.g., 8 or 2.5)
              </Text>
              <TextInput
                style={styles.formInput}
                keyboardType="decimal-pad"
                value={
                  tempLabourData.regular_hours_input === '' ||
                  tempLabourData.regular_hours_input === undefined
                    ? ''
                    : String(tempLabourData.regular_hours_input)
                }
                onChangeText={text => {
                  // only store decimal-hours text here
                  setTempLabourData(prev => ({
                    ...prev,
                    regular_hours_input: text, // user input (decimal)
                  }));
                }}
              />
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
        </KeyboardAvoidingView>
      </View>
    </View>
  </Modal>
);

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

        <ScrollView style={styles.modalBody}>
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
  </Modal>
);

/* ======================
   MAIN SCREEN
====================== */
const JobTimesheet = ({navigation, route, user}) => {
  const token = useSelector(state => state.user.token);

  // NO global caching of route params (prevents carry-over)
  const routeParams = route?.params || {};
  const jobFromRoute = routeParams?.data || routeParams?.job || {};
  const timesheetFromRoute = routeParams?.timesheet || {};

  const [showAddLabour, setShowAddLabour] = useState(false);
  const [showAddMaterial, setShowAddMaterial] = useState(false);

  const todayISO = new Date().toISOString().split('T')[0];

  // base state
  const [timesheetData, setTimesheetData] = useState(() => ({
    id: `timesheet-${jobFromRoute?.id ?? 'new'}-${
      timesheetFromRoute.date || todayISO
    }`,
    jobId: jobFromRoute?.id || timesheetFromRoute.jobId || 'unknown',
    date: timesheetFromRoute.date || todayISO,
    status: 'draft',
    jobNotes: 'Main electrical work and installation',
    labourEntries: [],
    materialEntries: [],
    additionalCharges: [],
  }));

  // current jobId used EVERYWHERE
  const currentJobId = React.useMemo(
    () => (jobFromRoute?.id != null ? jobFromRoute.id : timesheetData.jobId),
    [jobFromRoute?.id, timesheetData.jobId],
  );

  // HARD RESET when job changes
  useEffect(() => {
    // const freshDate = timesheetFromRoute.date || todayISO;
    // setTimesheetData({
    //   id: `timesheet-${jobFromRoute?.id ?? 'new'}-${freshDate}`,
    //   jobId: jobFromRoute?.id || 'unknown',
    //   date: freshDate,
    //   status: 'draft',
    //   jobNotes: 'Main electrical work and installation',
    //   labourEntries: [],
    //   materialEntries: [],
    //   additionalCharges: [],
    // });
    // setShowAddLabour(false);
    // setShowAddMaterial(false);
    // setTempLabourData({});
    // setTempMaterialData({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobFromRoute?.id]);

  // storage key per job+date
  const storageKeyRef = useRef(tsKey(currentJobId, timesheetData.date));

const loadFromStorageOrSeed = async (job, date) => {
  try {
    const key = tsKey(job?.id ?? currentJobId, date);

    // 1) Try load from local storage (persisted user edits)
    const saved = await AsyncStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      setTimesheetData(prev => ({
        ...prev,
        jobId: job?.id ?? prev.jobId,
        date,
        jobNotes: parsed?.jobNotes ?? prev.jobNotes,
        labourEntries: parsed?.labourEntries ?? [],
        materialEntries: parsed?.materialEntries ?? [],
      }));
      return; // storage mil gaya => route se overwrite mat karo
    }

    // 2) Storage empty hai => route se seed karo (same logic as before)
    const routeLabour = (job?.labor_timesheets || [])
      .filter(e =>
        e?.created_at ? sameDay(e.created_at, date)
        : e?.date ? sameDay(e.date, date)
        : false,
      )
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
        const work = entry?.work_activity || '00:00:00';
        const hms = /^[\d]{1,2}:[\d]{1,2}:[\d]{1,2}$/.test(work) ? work : normalizeToHMS(work);

        return {
          id: String(entry.id),
          employeeName: name,
          employeeId: empId,
          role: entry?.lead_labor || entry?.lead_labour ? 'Lead Labor' : 'Labor',
          regular_hours_input: hmsToDecimalStr(hms), // input ke liye decimal
          regular_hours_hms: hms,
          regularHours: hms,
          overtimeHours: 0,
          regularRate: entry?.lead_labor || entry?.lead_labour ? 35 : 28,
          overtimeRate: entry?.lead_labor || entry?.lead_labour ? 52.5 : 42,
          _source: 'route',
        };
      });

    const routeMaterials = [];
    (job?.orders || []).forEach(order => {
      if (!order) return;
      const orderDate = order?.created_at || order?.order_date;
      if (!orderDate || !sameDay(orderDate, date)) return;
      (order?.items || []).forEach((it, idx) => {
        routeMaterials.push({
          id: `${order.id}_${it.id ?? idx}`,
          name: it?.product?.product_name || '',
          unit: it?.product?.unit || 'pieces',
          totalOrdered: Number(it?.quantity) || 0,
          amountUsed: Number(it?.quantity) || 0,
          unitCost: Number(it?.product?.jdp_price ?? it?.unit_cost ?? 0) || 0,
          productId: it?.product?.id ?? it?.product_id ?? null,
          supplierOrderId: order?.order_number || '',
          returnToWarehouse: false,
          _source: 'route',
        });
      });
    });

    const toStore = {
      jobNotes: 'Main electrical work and installation',
      labourEntries: routeLabour,
      materialEntries: routeMaterials,
    };

    await AsyncStorage.setItem(key, JSON.stringify(toStore));

    setTimesheetData(prev => ({
      ...prev,
      jobId: job?.id ?? prev.jobId,
      date,
      jobNotes: toStore.jobNotes,
      labourEntries: toStore.labourEntries,
      materialEntries: toStore.materialEntries,
    }));
  } catch {}
};

  // Seed when job/date changes
  useEffect(() => {
    storageKeyRef.current = tsKey(currentJobId, timesheetData.date);
    loadFromStorageOrSeed(jobFromRoute, timesheetData.date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentJobId, timesheetData.date]);

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
      regular_hours: hms, // <— HH:MM:SS
      overtime_hours: '00:00:00',
      hourly_rate: Number(l.regularRate || 0),
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
    };
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

  const handleDeleteLabour = id => {
    if (locked) return;
    setTimesheetData(prev => {
      const next = {
        ...prev,
        labourEntries: prev.labourEntries.filter(
          e => String(e.id) !== String(id),
        ),
      };
      persistLocalState(next);
      return next;
    });
  };

  /* ========= MATERIAL CRUD ========= */
  const handleAddMaterial = () => {
    if (locked) return;
    setTempMaterialData({
      id: `material-${Date.now()}`,
      name: '',
      unit: 'pieces',
      totalOrdered: 0,
      amountUsed: 0,
      unitCost: 0,
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

  const handleDeleteMaterial = id => {
    if (locked) return;
    setTimesheetData(prev => {
      const next = {
        ...prev,
        materialEntries: prev.materialEntries.filter(
          e => String(e.id) !== String(id),
        ),
      };
      persistLocalState(next);
      return next;
    });
  };

  /* ========= SUBMIT (one per day) ========= */
  const handleSubmitForApproval = async () => {
    try {
      if (locked) {
        Alert.alert(
          'Already Submitted',
          'Aaj ki bluesheet submit ho chuki hai.',
        );
        return;
      }
      const payload = buildBluesheetPayload();
      if (!payload.labor_entries.length && !payload.material_entries.length) {
        Alert.alert('Empty', 'Nothing to submit for the selected date.');
        return;
      }

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
      Alert.alert('Success', 'Bluesheet submitted for approval');
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
          'Aaj ki bluesheet pehle hi submit ho chuki hai.',
        );
        return;
      }
      Alert.alert('Error', msg);
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
    !isSubmittedForDay &&
    (timesheetData.status === 'draft' ||
      (user?.role === 'Lead Labor' && timesheetData.status === 'submitted') ||
      timesheetData.status === 'rejected');
  const isReadOnly = () =>
    isSubmittedForDay || timesheetData.status === 'approved';

  return (
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isReadOnly() && (
          <View style={[styles.statusCard, {marginBottom: 0}]}>
            <View style={styles.approvalInfo}>
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
        )}

        {/* LABOUR */}
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
              <Text style={[styles.tableHeaderText, {flex: 1}]}>Employee</Text>
              <Text style={[styles.tableHeaderText, {flex: 1}]}>Role</Text>
              <Text style={[styles.tableHeaderText, {flex: 1}]}>Reg.hrs</Text>
              {canEdit() && (
                <Text style={[styles.tableHeaderText, {flex: 1}]}>Actions</Text>
              )}
            </View>

            {timesheetData?.labourEntries.map(entry => (
              <View key={entry.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, {flex: 1}]}>
                  {entry.employeeName}
                </Text>
                <Text style={[styles.tableCell, {flex: 1}]}>
                  {entry.role || 'Labor'}
                </Text>
                <Text style={[styles.tableCell, {flex: 1}]}>
                  {normalizeToHMS(
                    entry.regular_hours_input ??
                      entry.regular_hours_hms ??
                      entry.regularHours,
                  )}
                </Text>
                {canEdit() && (
                  <View
                    style={[styles.tableCell, {flex: 1, flexDirection: 'row'}]}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => {
                        const hms = normalizeToHMS(
                          entry.regular_hours_input ??
                            entry.regular_hours_hms ??
                            entry.regularHours,
                        );
                        const safe = {
                          ...entry,
                          regular_hours_input:
                            entry.regular_hours_input ?? hmsToDecimalStr(hms),
                          regular_hours_hms: hms,
                          regularHours: hms,
                        };
                        setTempLabourData(safe);
                        setShowAddLabour(true);
                      }}>
                      <MaterialIcons
                        name="edit"
                        size={20}
                        color={Colors.primary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteLabour(entry.id)}>
                      <MaterialIcons
                        name="delete"
                        size={20}
                        color={'#dc2626'}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
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
              <Text style={[styles.tableHeaderText, {flex: 1}]}>Title</Text>
              <Text style={[styles.tableHeaderText, {flex: 1}]}>Qty</Text>
              <Text style={[styles.tableHeaderText, {flex: 1}]}>Used</Text>
              {canEdit() && (
                <Text style={[styles.tableHeaderText, {flex: 1}]}>Actions</Text>
              )}
            </View>

            {timesheetData.materialEntries.map(material => (
              <View key={material.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, {flex: 1}]}>
                  {material.name}
                </Text>
                <Text style={[styles.tableCell, {flex: 1}]}>
                  {material.totalOrdered} {material.unit}
                </Text>
                <Text style={[styles.tableCell, {flex: 1}]}>
                  {material.amountUsed} {material.unit}
                </Text>
                {canEdit() && (
                  <View
                    style={[styles.tableCell, {flex: 1, flexDirection: 'row'}]}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => {
                        setTempMaterialData(material);
                        setShowAddMaterial(true);
                      }}>
                      <MaterialIcons
                        name="edit"
                        size={20}
                        color={Colors.primary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteMaterial(material.id)}>
                      <MaterialIcons
                        name="delete"
                        size={20}
                        color={'#dc2626'}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* NOTES + SUBMIT */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="edit-note" size={24} color={Colors.primary} />
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
            <MaterialIcons name="summarize" size={24} color={Colors.primary} />
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
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.submitButton, isReadOnly() && {opacity: 0.5}]}
              disabled={isReadOnly()}
              onPress={handleSubmitForApproval}>
              <Text style={styles.submitButtonText}>
                {isReadOnly()
                  ? 'Submitted (come back tomorrow)'
                  : 'Submit for Approval'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

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
  statusCard: {margin: 16},
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
    marginHorizontal: 16,
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
  actionButtons: {gap: 12},
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
    overflow: 'hidden',
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
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
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
});

export default JobTimesheet;
