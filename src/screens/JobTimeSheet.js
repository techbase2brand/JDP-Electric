// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   StatusBar,
//   StyleSheet,
//   Modal,
//   Alert,
//   Platform,
//   KeyboardAvoidingView,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {useNavigation} from '@react-navigation/native';
// import {heightPercentageToDP} from '../utils';

// // Embedded Colors - JDP Electrics Theme
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

// const BorderRadius = {
//   sm: 6,
//   md: 8,
//   lg: 12,
//   xl: 16,
//   xxl: 20,
// };

// const Shadows = {
//   sm: {
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 1},
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   md: {
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   lg: {
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 4},
//     shadowOpacity: 0.15,
//     shadowRadius: 5,
//     elevation: 8,
//   },
// };

// const JobTimesheet = ({
//   user: propUser,
//   selectedJob: propSelectedJob,
//   onNavigate,
//   hasLeadAccess: propHasLeadAccess,
//   route,
// }) => {
//   const navigation = useNavigation();

//   // Mock user data
//   const mockUser = {
//     id: '1',
//     name: 'Sarah Johnson',
//     role: 'Lead Labor',
//   };

//   const user = propUser || mockUser;
//   const hasLeadAccess = propHasLeadAccess ?? user.role === 'Lead Labor';
//   const selectedJob = propSelectedJob || route?.params?.job;

//   // State
//   const [selectedDate, setSelectedDate] = useState(new Date());
// const [timeEntries, setTimeEntries] = useState([
//   {
//     id: '1',
//     activity: 'Electrical Panel Installation',
//     startTime: '08:00 AM',
//     endTime: '12:00 PM',
//     duration: 240,
//     description: 'Main panel installation and wiring',
//     jobId: 'job-1',
//     location: 'Downtown Office Complex',
//     worker: 'Sarah Johnson',
//     isManual: false,
//   },
//   {
//     id: '2',
//     activity: 'Circuit Testing',
//     startTime: '01:00 PM',
//     endTime: '03:30 PM',
//     duration: 150,
//     description: 'Testing all circuits and connections',
//     jobId: 'job-1',
//     location: 'Downtown Office Complex',
//     worker: 'Sarah Johnson',
//     isManual: false,
//   },
//   {
//     id: '3',
//     activity: 'Documentation',
//     startTime: '03:30 PM',
//     endTime: '04:00 PM',
//     duration: 30,
//     description: 'Updating job records and photos',
//     location: 'Office',
//     worker: 'Sarah Johnson',
//     isManual: true,
//   },
// ]);

//   const [showAddEntryModal, setShowAddEntryModal] = useState(false);
//   const [editingEntry, setEditingEntry] = useState(null);
//   const [newEntry, setNewEntry] = useState({
//     activity: '',
//     startTime: '',
//     endTime: '',
//     description: '',
//     location: '',
//     worker: user.name,
//     isManual: true,
//   });

//   // Calculate totals
//   const totalMinutes = timeEntries.reduce(
//     (sum, entry) => sum + entry.duration,
//     0,
//   );
//   const totalHours = Math.floor(totalMinutes / 60);
//   const remainingMinutes = totalMinutes % 60;

//   // Helper functions
//   const formatDate = date => {
//     return date.toLocaleDateString('en-US', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   const formatDuration = minutes => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return `${hours}h ${mins}m`;
//   };

//   const calculateDuration = (startTime, endTime) => {
//     // Simple duration calculation (would use proper time parsing in real app)
//     const start = new Date(`2024-01-01 ${startTime}`);
//     const end = new Date(`2024-01-01 ${endTime}`);
//     return Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60));
//   };

//   // Handlers
//   const handleBack = () => {
//     navigation.goBack();
//   };

//   const handleNavigate = (screen, params) => {
//     if (onNavigate) {
//       onNavigate(screen, params);
//     } else {
//       navigation.navigate(screen, params);
//     }
//   };

//   const handleAddEntry = () => {
//     if (!newEntry.activity || !newEntry.startTime || !newEntry.endTime) {
//       Alert.alert('Error', 'Please fill in all required fields');
//       return;
//     }

//     const duration = calculateDuration(newEntry.startTime, newEntry.endTime);
//     const entry = {
//       id: Date.now().toString(),
//       activity: newEntry.activity,
//       startTime: newEntry.startTime,
//       endTime: newEntry.endTime,
//       duration,
//       description: newEntry.description || '',
//       location: newEntry.location || '',
//       worker: newEntry.worker || user.name,
//       isManual: true,
//       jobId: newEntry.jobId,
//     };

//     setTimeEntries(prev => [...prev, entry]);
//     setNewEntry({
//       activity: '',
//       startTime: '',
//       endTime: '',
//       description: '',
//       location: '',
//       worker: user.name,
//       isManual: true,
//     });
//     setShowAddEntryModal(false);
//   };

//   const handleEditEntry = entry => {
//     if (!hasLeadAccess && !entry.isManual) {
//       Alert.alert(
//         'Access Denied',
//         'Only Lead Labor can edit automatic entries',
//       );
//       return;
//     }
//     setEditingEntry(entry);
//     setNewEntry({
//       activity: entry.activity,
//       startTime: entry.startTime,
//       endTime: entry.endTime,
//       description: entry.description,
//       location: entry.location,
//       worker: entry.worker,
//       jobId: entry.jobId,
//     });
//     setShowAddEntryModal(true);
//   };

//   const handleUpdateEntry = () => {
//     if (
//       !editingEntry ||
//       !newEntry.activity ||
//       !newEntry.startTime ||
//       !newEntry.endTime
//     ) {
//       Alert.alert('Error', 'Please fill in all required fields');
//       return;
//     }

//     const duration = calculateDuration(newEntry.startTime, newEntry.endTime);
//     const updatedEntry = {
//       ...editingEntry,
//       activity: newEntry.activity,
//       startTime: newEntry.startTime,
//       endTime: newEntry.endTime,
//       duration,
//       description: newEntry.description || '',
//       location: newEntry.location || '',
//       worker: newEntry.worker || user.name,
//       jobId: newEntry.jobId,
//     };

//     setTimeEntries(prev =>
//       prev.map(entry => (entry.id === editingEntry.id ? updatedEntry : entry)),
//     );
//     setEditingEntry(null);
//     setNewEntry({
//       activity: '',
//       startTime: '',
//       endTime: '',
//       description: '',
//       location: '',
//       worker: user.name,
//       isManual: true,
//     });
//     setShowAddEntryModal(false);
//   };

//   const handleDeleteEntry = entryId => {
//     Alert.alert(
//       'Delete Entry',
//       'Are you sure you want to delete this time entry?',
//       [
//         {text: 'Cancel', style: 'cancel'},
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: () => {
//             setTimeEntries(prev => prev.filter(entry => entry.id !== entryId));
//           },
//         },
//       ],
//     );
//   };

//   const handleSubmitTimesheet = () => {
//     if (!hasLeadAccess) {
//       Alert.alert('Access Denied', 'Only Lead Labor can submit timesheets');
//       return;
//     }

//     Alert.alert(
//       'Submit Timesheet',
//       `Submit timesheet for ${formatDate(
//         selectedDate,
//       )}?\n\nTotal Hours: ${totalHours}h ${remainingMinutes}m`,
//       [
//         {text: 'Cancel', style: 'cancel'},
//         {
//           text: 'Submit',
//           onPress: () => {
//             Alert.alert('Success', 'Timesheet submitted successfully');
//             handleNavigate('JDPSubmissionScreen', {
//               timesheet: {
//                 entries: timeEntries,
//                 totalHours: totalHours + remainingMinutes / 60,
//               },
//               date: selectedDate,
//             });
//           },
//         },
//       ],
//     );
//   };

//   const renderTimeEntry = entry => (
//     <View key={entry.id} style={styles.timeEntryCard}>
//       <View style={styles.timeEntryHeader}>
//         <View style={styles.timeEntryTitle}>
//           <Text style={styles.activityName}>{entry.activity}</Text>
//           <View style={styles.timeEntryMeta}>
//             {entry.isManual ? (
//               <View style={styles.manualBadge}>
//                 <Icon name="edit" size={12} color={Colors.warning} />
//                 <Text style={styles.manualBadgeText}>Manual</Text>
//               </View>
//             ) : (
//               <View style={styles.autoBadge}>
//                 <Icon name="timer" size={12} color={Colors.success} />
//                 <Text style={styles.autoBadgeText}>Auto</Text>
//               </View>
//             )}
//           </View>
//         </View>

//         <View style={styles.timeEntryActions}>
//           <TouchableOpacity
//             style={styles.editButton}
//             onPress={() => handleEditEntry(entry)}>
//             <Icon name="edit" size={16} color={Colors.primary} />
//           </TouchableOpacity>

//           {entry.isManual && (
//             <TouchableOpacity
//               style={styles.deleteButton}
//               onPress={() => handleDeleteEntry(entry.id)}>
//               <Icon name="delete" size={16} color={Colors.error} />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>

//       <View style={styles.timeEntryBody}>
//         <View style={styles.timeDetails}>
//           <View style={styles.timeRow}>
//             <Icon name="access-time" size={16} color={Colors.textSecondary} />
//             <Text style={styles.timeText}>
//               {entry.startTime} - {entry.endTime}
//             </Text>
//             <Text style={styles.durationText}>
//               ({formatDuration(entry.duration)})
//             </Text>
//           </View>

//           <View style={styles.locationRow}>
//             <Icon name="location-on" size={16} color={Colors.textSecondary} />
//             <Text style={styles.locationText}>{entry.location}</Text>
//           </View>

//           <View style={styles.workerRow}>
//             <Icon name="person" size={16} color={Colors.textSecondary} />
//             <Text style={styles.workerText}>{entry.worker}</Text>
//           </View>
//         </View>

//         {entry.description ? (
//           <View style={styles.descriptionContainer}>
//             <Text style={styles.descriptionText}>{entry.description}</Text>
//           </View>
//         ) : null}
//       </View>
//     </View>
//   );

//   const renderAddEntryModal = () => (
//     <Modal
//       visible={showAddEntryModal}
//       transparent={true}
//       animationType="slide"
//       onRequestClose={() => {
//         setShowAddEntryModal(false);
//         setEditingEntry(null);
//         setNewEntry({
//           activity: '',
//           startTime: '',
//           endTime: '',
//           description: '',
//           location: '',
//           worker: user.name,
//           isManual: true,
//         });
//       }}>
//       <View style={styles.modalOverlay}>
//         <View style={styles.addEntryModal}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>
//               {editingEntry ? 'Edit Time Entry' : 'Add Time Entry'}
//             </Text>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => {
//                 setShowAddEntryModal(false);
//                 setEditingEntry(null);
//               }}>
//               <Icon name="close" size={24} color={Colors.text} />
//             </TouchableOpacity>
//           </View>
//           {/* ✅ KeyboardAvoidingView Wrap */}
//           <KeyboardAvoidingView
//             style={{flex: 1}}
//             behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//             keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
//             <ScrollView
//               style={styles.modalContent}
//               showsVerticalScrollIndicator={false}>
//               <View style={styles.formField}>
//                 <Text style={styles.fieldLabel}>Activity *</Text>
//                 <TextInput
//                   style={styles.textInput}
//                   value={newEntry.activity}
//                   onChangeText={text =>
//                     setNewEntry(prev => ({...prev, activity: text}))
//                   }
//                   placeholder="Enter activity name"
//                   placeholderTextColor={Colors.textLight}
//                 />
//               </View>

//               <View style={styles.timeInputRow}>
//                 <View
//                   style={[
//                     styles.formField,
//                     {flex: 1, marginRight: Spacing.sm},
//                   ]}>
//                   <Text style={styles.fieldLabel}>Start Time *</Text>
//                   <TextInput
//                     style={styles.textInput}
//                     value={newEntry.startTime}
//                     onChangeText={text =>
//                       setNewEntry(prev => ({...prev, startTime: text}))
//                     }
//                     placeholder="09:00 AM"
//                     placeholderTextColor={Colors.textLight}
//                   />
//                 </View>

//                 <View
//                   style={[styles.formField, {flex: 1, marginLeft: Spacing.sm}]}>
//                   <Text style={styles.fieldLabel}>End Time *</Text>
//                   <TextInput
//                     style={styles.textInput}
//                     value={newEntry.endTime}
//                     onChangeText={text =>
//                       setNewEntry(prev => ({...prev, endTime: text}))
//                     }
//                     placeholder="05:00 PM"
//                     placeholderTextColor={Colors.textLight}
//                   />
//                 </View>
//               </View>

//               <View style={styles.formField}>
//                 <Text style={styles.fieldLabel}>Location</Text>
//                 <TextInput
//                   style={styles.textInput}
//                   value={newEntry.location}
//                   onChangeText={text =>
//                     setNewEntry(prev => ({...prev, location: text}))
//                   }
//                   placeholder="Work location"
//                   placeholderTextColor={Colors.textLight}
//                 />
//               </View>

//               <View style={styles.formField}>
//                 <Text style={styles.fieldLabel}>Worker</Text>
//                 <TextInput
//                   style={styles.textInput}
//                   value={newEntry.worker}
//                   onChangeText={text =>
//                     setNewEntry(prev => ({...prev, worker: text}))
//                   }
//                   placeholder="Worker name"
//                   placeholderTextColor={Colors.textLight}
//                 />
//               </View>

//               <View style={styles.formField}>
//                 <Text style={styles.fieldLabel}>Description</Text>
//                 <TextInput
//                   style={[styles.textInput, styles.textArea]}
//                   value={newEntry.description}
//                   onChangeText={text =>
//                     setNewEntry(prev => ({...prev, description: text}))
//                   }
//                   placeholder="Description of work performed"
//                   placeholderTextColor={Colors.textLight}
//                   multiline={true}
//                   numberOfLines={3}
//                 />
//               </View>

//               <View style={styles.modalActions}>
//                 <TouchableOpacity
//                   style={styles.cancelButton}
//                   onPress={() => {
//                     setShowAddEntryModal(false);
//                     setEditingEntry(null);
//                   }}>
//                   <Text style={styles.cancelButtonText}>Cancel</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={styles.saveButton}
//                   onPress={editingEntry ? handleUpdateEntry : handleAddEntry}>
//                   <Text style={styles.saveButtonText}>
//                     {editingEntry ? 'Update' : 'Add Entry'}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </ScrollView>
//           </KeyboardAvoidingView>
//         </View>
//       </View>
//     </Modal>
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerTop}>
//           <TouchableOpacity style={styles.backButton} onPress={handleBack}>
//             <Icon name="arrow-back" size={24} color={Colors.white} />
//           </TouchableOpacity>

//           <View style={styles.headerCenter}>
//             <Text style={styles.headerTitle}>Job Timesheet</Text>
//             <Text style={styles.headerSubtitle}>
//               {formatDate(selectedDate)}
//             </Text>
//           </View>

//           <TouchableOpacity
//             style={styles.addButton}
//             onPress={() => setShowAddEntryModal(true)}>
//             <Icon name="add" size={24} color={Colors.white} />
//           </TouchableOpacity>
//         </View>

//         {/* Summary Cards */}
//         <View style={styles.summaryContainer}>
//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryValue}>
//               {7}h {50}m
//             </Text>
//             <Text style={styles.summaryLabel}>Total Time</Text>
//           </View>

//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryValue}>{timeEntries.length}</Text>
//             <Text style={styles.summaryLabel}>Activities</Text>
//           </View>

//           <View style={styles.summaryCard}>
//             <Text style={styles.summaryValue}>
//               {timeEntries.filter(e => !e.isManual).length}
//             </Text>
//             <Text style={styles.summaryLabel}>Auto Tracked</Text>
//           </View>
//         </View>
//       </View>

//       {/* Time Entries */}
//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         <View style={styles.entriesSection}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Time Entries</Text>
//             <Text style={styles.sectionSubtitle}>
//               {timeEntries.length} activities logged
//             </Text>
//           </View>

//           {timeEntries?.length === 0 ? (
//             <View style={styles.emptyState}>
//               <Icon name="schedule" size={64} color={Colors.textLight} />
//               <Text style={styles.emptyStateTitle}>No time entries</Text>
//               <Text style={styles.emptyStateSubtitle}>
//                 Add your first time entry to get started
//               </Text>
//               <TouchableOpacity
//                 style={styles.addFirstEntryButton}
//                 onPress={() => setShowAddEntryModal(true)}>
//                 <Text style={styles.addFirstEntryText}>Add Time Entry</Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             timeEntries?.map(renderTimeEntry)
//           )}
//         </View>

//         {/* <View style={{height: 100}} /> */}
//       </ScrollView>
//       {/* Quick Actions */}
//       {timeEntries?.length > 0 && (
//         <View style={styles.actionsSection}>
//           <Text style={styles.sectionTitle}></Text>

//           {/* <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() =>
//                 handleNavigate('MaterialTrackingScreen', {job: selectedJob})
//               }>
//               <Icon name="inventory" size={20} color={Colors.primary} />
//               <Text style={styles.actionButtonText}>Material Tracking</Text>
//               <Icon name="chevron-right" size={20} color={Colors.textLight} />
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() =>
//                 handleNavigate('JobSummaryScreen', {job: selectedJob})
//               }>
//               <Icon name="assessment" size={20} color={Colors.primary} />
//               <Text style={styles.actionButtonText}>Job Summary</Text>
//               <Icon name="chevron-right" size={20} color={Colors.textLight} />
//             </TouchableOpacity> */}

//           {hasLeadAccess && (
//             <TouchableOpacity
//               style={[styles.actionButton, styles.submitActionButton]}
//               onPress={handleSubmitTimesheet}>
//               <Icon name="send" size={20} color={Colors.white} />
//               <Text style={[styles.actionButtonText, styles.submitActionText]}>
//                 Submit For Approval
//               </Text>
//               <Icon name="chevron-right" size={20} color={Colors.white} />
//             </TouchableOpacity>
//           )}
//         </View>
//       )}
//       {renderAddEntryModal()}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },

//   // Header
//   header: {
//     backgroundColor: Colors.primary,
//     paddingTop: Spacing.xl,
//     paddingHorizontal: Spacing.lg,
//     paddingBottom: Spacing.lg,
//   },
//   headerTop: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: Spacing.lg,
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
//     padding: Spacing.sm,
//   },

//   // Summary
//   summaryContainer: {
//     flexDirection: 'row',
//     gap: Spacing.md,
//   },
//   summaryCard: {
//     flex: 1,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     alignItems: 'center',
//   },
//   summaryValue: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: Colors.white,
//   },
//   summaryLabel: {
//     fontSize: 12,
//     color: Colors.primaryLight,
//     marginTop: Spacing.xs,
//   },

//   // Content
//   content: {
//     flex: 1,
//   },

//   // Sections
//   entriesSection: {
//     backgroundColor: Colors.white,
//     paddingVertical: Spacing.lg,
//   },
//   sectionHeader: {
//     paddingHorizontal: Spacing.lg,
//     marginBottom: Spacing.lg,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: Colors.text,
//     marginBottom: 40,
//   },
//   sectionSubtitle: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     marginTop: Spacing.xs,
//   },

//   // Time Entry Cards
//   timeEntryCard: {
//     backgroundColor: Colors.backgroundLight,
//     marginHorizontal: Spacing.lg,
//     marginBottom: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     ...Shadows.sm,
//   },
//   timeEntryHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: Spacing.sm,
//   },
//   timeEntryTitle: {
//     flex: 1,
//     marginRight: Spacing.md,
//   },
//   activityName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.text,
//     marginBottom: Spacing.xs,
//   },
//   timeEntryMeta: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   manualBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: Colors.warningLight,
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.sm,
//     gap: Spacing.xs,
//   },
//   manualBadgeText: {
//     fontSize: 12,
//     color: Colors.warning,
//     fontWeight: '500',
//   },
//   autoBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: Colors.successLight,
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.sm,
//     gap: Spacing.xs,
//   },
//   autoBadgeText: {
//     fontSize: 12,
//     color: Colors.success,
//     fontWeight: '500',
//   },
//   timeEntryActions: {
//     flexDirection: 'row',
//     gap: Spacing.sm,
//   },
//   editButton: {
//     padding: Spacing.sm,
//   },
//   deleteButton: {
//     padding: Spacing.sm,
//   },
//   timeEntryBody: {
//     gap: Spacing.sm,
//   },
//   timeDetails: {
//     gap: Spacing.sm,
//   },
//   timeRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: Spacing.sm,
//   },
//   timeText: {
//     fontSize: 14,
//     color: Colors.text,
//     fontWeight: '500',
//   },
//   durationText: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//   },
//   locationRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: Spacing.sm,
//   },
//   locationText: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//   },
//   workerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: Spacing.sm,
//   },
//   workerText: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//   },
//   descriptionContainer: {
//     backgroundColor: Colors.white,
//     padding: Spacing.sm,
//     borderRadius: BorderRadius.sm,
//     marginTop: Spacing.sm,
//   },
//   descriptionText: {
//     fontSize: 14,
//     color: Colors.text,
//     lineHeight: 20,
//   },

//   // Empty State
//   emptyState: {
//     alignItems: 'center',
//     paddingVertical: Spacing.xxl,
//     paddingHorizontal: Spacing.lg,
//   },
//   emptyStateTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: Colors.text,
//     marginTop: Spacing.lg,
//     marginBottom: Spacing.sm,
//   },
//   emptyStateSubtitle: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     textAlign: 'center',
//     marginBottom: Spacing.xl,
//   },
//   addFirstEntryButton: {
//     backgroundColor: Colors.primary,
//     paddingHorizontal: Spacing.xl,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.md,
//   },
//   addFirstEntryText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.white,
//   },

//   // Actions Section
//   actionsSection: {
//     backgroundColor: Colors.white,
//     // paddingVertical: Spacing.lg,
//     paddingHorizontal: Spacing.lg,
//     marginTop: Spacing.sm,
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: Spacing.lg,
//     paddingHorizontal: Spacing.md,
//     backgroundColor: Colors.backgroundLight,
//     borderRadius: BorderRadius.lg,
//     marginBottom: Spacing.md,
//     gap: Spacing.md,
//   },
//   actionButtonText: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: '500',
//     color: Colors.text,
//   },
//   submitActionButton: {
//     backgroundColor: Colors.primary,
//     position: 'absolute',
//     bottom: 10,
//     left: 20,
//   },
//   submitActionText: {
//     color: Colors.white,
//   },

//   // Modal
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   addEntryModal: {
//     backgroundColor: Colors.white,
//     borderTopLeftRadius: BorderRadius.xl,
//     borderTopRightRadius: BorderRadius.xl,
//     // maxHeight: '90%',
//     height: heightPercentageToDP(90),
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: Spacing.lg,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: Colors.text,
//   },
//   closeButton: {
//     padding: Spacing.sm,
//   },
//   modalContent: {
//     flex: 1,
//     padding: Spacing.lg,
//   },

//   // Form Fields
//   formField: {
//     marginBottom: Spacing.lg,
//   },
//   fieldLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: Colors.text,
//     marginBottom: Spacing.sm,
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: BorderRadius.md,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.md,
//     fontSize: 16,
//     color: Colors.text,
//     backgroundColor: Colors.white,
//   },
//   textArea: {
//     height: 80,
//     textAlignVertical: 'top',
//   },
//   timeInputRow: {
//     flexDirection: 'row',
//   },

//   // Modal Actions
//   modalActions: {
//     flexDirection: 'row',
//     gap: Spacing.md,
//     marginTop: Spacing.lg,
//   },
//   cancelButton: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.md,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     alignItems: 'center',
//   },
//   cancelButtonText: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//   },
//   saveButton: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     borderRadius: BorderRadius.md,
//     backgroundColor: Colors.primary,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.white,
//   },
// });

// export default JobTimesheet;

import React, {useState, useMemo} from 'react';
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
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {tabColor} from '../constants/Color';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {widthPercentageToDP} from '../utils';

const Colors = {
  primary: '#3B82F6',
  primaryLight: '#EBF4FF',
  primaryDark: '#2563EB',
  white: '#FFFFFF',
  background: '#F8FAFC',
  backgroundLight: '#F1F5F9',
  text: '#1E293B',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  border: '#E2E8F0',
  success: '#10B981',
  successLight: '#D1FAE5',
  successDark: '#059669',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  purple: '#8B5CF6',
  purpleLight: '#F3E8FF',
  indigo: '#6366F1',
  indigoLight: '#EEF2FF',
  orange: '#F97316',
  orangeLight: '#FED7AA',
  green: '#22C55E',
  greenLight: '#DCFCE7',
};

// Embedded Spacing
const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const BorderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
};

const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 8,
  },
};
const LabourModal = ({
  visible,
  setShowAddLabour,
  editingLabour,
  setEditingLabour,
  tempLabourData,
  setTempLabourData,
  handleSaveLabour,
}) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent
    onRequestClose={() => {
      setShowAddLabour(false);
      setEditingLabour(null);
      setTempLabourData({});
    }}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        {/* ✅ KeyboardAvoidingView Added */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
          <ScrollView
            contentContainerStyle={styles.modalBody}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingLabour ? 'Edit Labour Entry' : 'Add Labour Entry'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowAddLabour(false);
                  setEditingLabour(null);
                  setTempLabourData({});
                }}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Employee Name</Text>
              <TextInput
                style={styles.formInput}
                value={tempLabourData.employeeName || ''}
                onChangeText={text =>
                  setTempLabourData(prev => ({...prev, employeeName: text}))
                }
                placeholder="Enter employee name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Employee ID</Text>
              <TextInput
                style={styles.formInput}
                value={tempLabourData.employeeId || ''}
                onChangeText={text =>
                  setTempLabourData(prev => ({...prev, employeeId: text}))
                }
                placeholder="Enter employee ID"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Regular Hours</Text>
              <TextInput
                style={styles.formInput}
                value={tempLabourData.regularHours?.toString() || ''}
                onChangeText={text =>
                  setTempLabourData(prev => ({
                    ...prev,
                    regularHours: text === '' ? '' : parseFloat(text) || 0,
                  }))
                }
                placeholder="0"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Overtime Hours</Text>
              <TextInput
                style={styles.formInput}
                value={tempLabourData.overtimeHours?.toString() || ''}
                onChangeText={text =>
                  setTempLabourData(prev => ({
                    ...prev,
                    overtimeHours: text === '' ? '' : parseFloat(text) || 0,
                  }))
                }
                placeholder="0"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Notes</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={tempLabourData.notes || ''}
                onChangeText={text =>
                  setTempLabourData(prev => ({...prev, notes: text}))
                }
                placeholder="Enter notes"
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonSecondary]}
              onPress={() => {
                setShowAddLabour(false);
                setEditingLabour(null);
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

const MaterialModal = ({
  visible,
  onClose,
  tempMaterialData,
  setTempMaterialData,
  editingMaterial,
  setEditingMaterial,
  handleSaveMaterial,
  setShowAddMaterial,
}) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {editingMaterial ? 'Edit Material Entry' : 'Add Material Entry'}
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
              value={tempMaterialData.name || ''}
              onChangeText={text =>
                setTempMaterialData(prev => ({...prev, name: text}))
              }
              placeholder="Enter material name"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Unit</Text>
            <TextInput
              style={styles.formInput}
              value={tempMaterialData.unit || ''}
              onChangeText={text =>
                setTempMaterialData(prev => ({...prev, unit: text}))
              }
              placeholder="pieces, feet, etc."
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Total Ordered</Text>
            <TextInput
              style={styles.formInput}
              value={tempMaterialData.totalOrdered?.toString() || ''}
              onChangeText={text =>
                setTempMaterialData(prev => ({
                  ...prev,
                  totalOrdered: parseFloat(text) || 0,
                }))
              }
              placeholder="0"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Material Used</Text>
            <TextInput
              style={styles.formInput}
              value={tempMaterialData.amountUsed?.toString() || ''}
              onChangeText={text =>
                setTempMaterialData(prev => ({
                  ...prev,
                  amountUsed: parseFloat(text) || 0,
                }))
              }
              placeholder="0"
              keyboardType="numeric"
            />
          </View>

          {/* <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Unit Cost ($)</Text>
            <TextInput
              style={styles.formInput}
              value={tempMaterialData.unitCost?.toString() || ''}
              onChangeText={text =>
                setTempMaterialData(prev => ({
                  ...prev,
                  unitCost: parseFloat(text) || 0,
                }))
              }
              placeholder="0.00"
              keyboardType="numeric"
            />
          </View> */}

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Supplier Order ID</Text>
            <TextInput
              style={styles.formInput}
              value={tempMaterialData.supplierOrderId || ''}
              onChangeText={text =>
                setTempMaterialData(prev => ({
                  ...prev,
                  supplierOrderId: text,
                }))
              }
              placeholder="Enter order ID"
            />
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.formLabel}>Return to Warehouse</Text>
            <Switch
              value={tempMaterialData.returnToWarehouse || false}
              onValueChange={value =>
                setTempMaterialData(prev => ({
                  ...prev,
                  returnToWarehouse: value,
                }))
              }
              trackColor={{false: '#e5e7eb', true: '#3B82F6'}}
              thumbColor={
                tempMaterialData.returnToWarehouse ? '#ffffff' : '#f4f3f4'
              }
            />
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={[styles.modalButton, styles.modalButtonSecondary]}
            onPress={() => {
              setShowAddMaterial(false);
              setEditingMaterial(null);
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

const ChargeModal = ({
  visible,
  onClose,
  tempChargeData,
  setTempChargeData,
  editingCharge,
  setEditingCharge,
  handleSaveCharge,
  setShowAddCharge,
}) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {editingCharge ? 'Edit Additional Charge' : 'Add Additional Charge'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCloseButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalBody}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Title</Text>
            <TextInput
              style={styles.formInput}
              value={tempChargeData.title || ''}
              onChangeText={text =>
                setTempChargeData(prev => ({...prev, title: text}))
              }
              placeholder="Title"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={styles.formInput}
              value={tempChargeData.description || ''}
              onChangeText={text =>
                setTempChargeData(prev => ({...prev, description: text}))
              }
              placeholder="Enter charge description"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Category</Text>
            <TextInput
              style={styles.formInput}
              value={tempChargeData.category || ''}
              onChangeText={text =>
                setTempChargeData(prev => ({...prev, category: text}))
              }
              placeholder="Equipment, Travel, Permits, etc."
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Amount ($)</Text>
            <TextInput
              style={styles.formInput}
              value={tempChargeData.amount?.toString() || ''}
              onChangeText={text =>
                setTempChargeData(prev => ({
                  ...prev,
                  amount: parseFloat(text) || 0,
                }))
              }
              placeholder="0.00"
              keyboardType="numeric"
            />
          </View>

          {/* <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Receipt ID</Text>
            <TextInput
              style={styles.formInput}
              value={tempChargeData.receipt || ''}
              onChangeText={text =>
                setTempChargeData(prev => ({...prev, receipt: text}))
              }
              placeholder="Enter receipt ID"
            />
          </View> */}

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Notes</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={tempChargeData.notes || ''}
              onChangeText={text =>
                setTempChargeData(prev => ({...prev, notes: text}))
              }
              placeholder="Enter notes"
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={[styles.modalButton, styles.modalButtonSecondary]}
            onPress={() => {
              setShowAddCharge(false);
              setEditingCharge(null);
              setTempChargeData({});
            }}>
            <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.modalButtonPrimary]}
            onPress={handleSaveCharge}>
            <Text style={styles.modalButtonTextPrimary}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);
const JobTimesheet = ({navigation, route, user, job}) => {
  const {timesheet} = route?.params || {};

  const [editingLabour, setEditingLabour] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editingCharge, setEditingCharge] = useState(null);
  const [showAddLabour, setShowAddLabour] = useState(false);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [showAddCharge, setShowAddCharge] = useState(false);
  const [timeEntries, setTimeEntries] = useState([
    {
      id: '1',
      activity: 'Electrical Panel Installation',
      startTime: '08:00 AM',
      endTime: '12:00 PM',
      duration: 240,
      description: 'Main panel installation and wiring',
      jobId: 'job-1',
      location: 'Downtown Office Complex',
      worker: 'Sarah Johnson',
      isManual: false,
    },
    {
      id: '2',
      activity: 'Circuit Testing',
      startTime: '01:00 PM',
      endTime: '03:30 PM',
      duration: 150,
      description: 'Testing all circuits and connections',
      jobId: 'job-1',
      location: 'Downtown Office Complex',
      worker: 'Sarah Johnson',
      isManual: false,
    },
    {
      id: '3',
      activity: 'Documentation',
      startTime: '03:30 PM',
      endTime: '04:00 PM',
      duration: 30,
      description: 'Updating job records and photos',
      location: 'Office',
      worker: 'Sarah Johnson',
      isManual: true,
    },
  ]);

  // Initialize timesheet data - either from existing timesheet or create new
  const [timesheetData, setTimesheetData] = useState(() => {
    if (timesheet) {
      return {
        id: timesheet.id,
        jobId: timesheet.jobId,
        date: timesheet.date,
        status: timesheet.status,
        jobNotes: 'Main electrical work and installation',
        submittedAt: timesheet.submittedAt,
        approvedAt: timesheet.approvedAt,
        approvedBy: timesheet.approvedBy,
        rejectionReason: timesheet.rejectionReason,
        labourEntries: [
          {
            id: '1',
            employeeName: timesheet.submittedBy,
            employeeId: timesheet.employeeId,
            role: user?.role || 'Labor',
            regularHours: timesheet.labourHours,
            overtimeHours: 0,
            regularRate: user?.role === 'Lead Labor' ? 35 : 28,
            overtimeRate: user?.role === 'Lead Labor' ? 52.5 : 42,
            totalCost: timesheet.labourCost,
            notes: 'Loaded from existing timesheet',
          },
        ],
        materialEntries: [
          {
            id: '1',
            name: 'Electrical Wire 12AWG',
            unit: 'feet',
            totalOrdered: 500,
            amountUsed: Math.round(timesheet.materialCost / 0.85),
            amountRemaining: 500 - Math.round(timesheet.materialCost / 0.85),
            unitCost: 0.85,
            totalCost: timesheet.materialCost,
            supplierOrderId: 'ORD-2024-001',
            returnToWarehouse: false,
          },
        ],
        additionalCharges: [
          {
            id: '1',
            title: 'Additional Items ABC',
            description: 'Additional Items',
            category: 'Other',
            amount:
              timesheet.totalCost -
              timesheet.labourCost -
              timesheet.materialCost,
            notes: 'Loaded from existing timesheet',
          },
        ],
      };
    }

    // Create new timesheet
    return {
      id: `timesheet-${job?.id || 'new'}-${
        new Date().toISOString().split('T')[0]
      }`,
      jobId: job?.id || 'unknown',
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
      jobNotes: 'Main electrical work and installation',
      labourEntries: [
        {
          id: '1',
          employeeName: user?.name || 'Unknown Employee',
          employeeId: user?.employee_id || 'EMP001',
          role: user?.role || 'Labor',
          regularHours: 8,
          overtimeHours: 0,
          regularRate: user?.role === 'Lead Labor' ? 35 : 28,
          overtimeRate: user?.role === 'Lead Labor' ? 52.5 : 42,
          totalCost: user?.role === 'Lead Labor' ? 280 : 224,
          notes: 'Main electrical work and installation',
        },
      ],
      materialEntries: [
        {
          id: '1',
          name: 'Electrical Wire 12AW',
          unit: 'feet',
          totalOrdered: 500,
          amountUsed: 350,
          amountRemaining: 150,
          unitCost: 0.85,
          totalCost: 297.5,
          supplierOrderId: 'ORD-2024-001',
          returnToWarehouse: false,
        },
        {
          id: '2',
          name: 'Circuit Breakers 20A',
          unit: 'pieces',
          totalOrdered: 12,
          amountUsed: 8,
          amountRemaining: 4,
          unitCost: 25.0,
          totalCost: 200.0,
          supplierOrderId: 'ORD-2024-001',
          returnToWarehouse: false,
        },
      ],
      additionalCharges: [
        {
          id: '1',
          title: 'ABC',
          description: 'Parking permit for downtown work site',
          category: 'Permits',
          amount: 15.0,
          notes: 'Required for street work access',
        },
        {
          id: '2',
          title: 'XYZ',
          description: 'Equipment rental - lift',
          category: 'Equipment',
          amount: 125.0,
          receipt: 'RCP-2024-001',
          notes: 'Half-day rental for overhead work',
        },
      ],
    };
  });
  // Temporary form state for editing
  const [tempLabourData, setTempLabourData] = useState({});
  const [tempMaterialData, setTempMaterialData] = useState({});
  const [tempChargeData, setTempChargeData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Calculate totals
  const totals = useMemo(() => {
    const labourTotal = timesheetData.labourEntries.reduce(
      (sum, entry) => sum + entry.totalCost,
      0,
    );
    const materialTotal = timesheetData.materialEntries.reduce(
      (sum, entry) => sum + entry.amountUsed * entry.unitCost,
      0,
    );
    const chargesTotal = timesheetData.additionalCharges.reduce(
      (sum, charge) => sum + charge.amount,
      0,
    );
    const grandTotal = labourTotal + materialTotal + chargesTotal;

    return {
      labour: labourTotal,
      materials: materialTotal,
      charges: chargesTotal,
      grandTotal,
    };
  }, [timesheetData]);

  // Helper functions
  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = status => {
    switch (status) {
      case 'draft':
        return {backgroundColor: '#f3f4f6', color: '#374151'};
      case 'submitted':
        return {backgroundColor: '#dbeafe', color: '#1d4ed8'};
      case 'approved':
        return {backgroundColor: '#dcfce7', color: '#166534'};
      case 'rejected':
        return {backgroundColor: '#fee2e2', color: '#dc2626'};
      default:
        return {backgroundColor: '#f3f4f6', color: '#374151'};
    }
  };

  const canEdit = () => {
    return (
      timesheetData.status === 'draft' ||
      (user?.role === 'Lead Labor' && timesheetData.status === 'submitted') ||
      timesheetData.status === 'rejected'
    );
  };

  const isReadOnly = () => {
    return timesheetData.status === 'approved';
  };

  // Labour entry handlers
  const handleAddLabour = () => {
    setTempLabourData({
      id: `labour-${Date.now()}`,
      employeeName: '',
      employeeId: '',
      role: 'Labor',
      regularHours: 0,
      overtimeHours: 0,
      regularRate: 28,
      overtimeRate: 42,
      totalCost: 0,
      notes: '',
    });
    setShowAddLabour(true);
  };

  const handleSaveLabour = () => {
    if (!tempLabourData.employeeName || !tempLabourData.employeeId) {
      Alert.alert('Error', 'Please fill in employee name and ID');
      return;
    }

    const totalCost =
      (tempLabourData.regularHours || 0) * (tempLabourData.regularRate || 0) +
      (tempLabourData.overtimeHours || 0) * (tempLabourData.overtimeRate || 0);

    const newEntry = {
      ...tempLabourData,
      totalCost,
    };

    if (editingLabour) {
      setTimesheetData(prev => ({
        ...prev,
        labourEntries: prev.labourEntries.map(entry =>
          entry.id === editingLabour ? newEntry : entry,
        ),
      }));
      setEditingLabour(null);
    } else {
      setTimesheetData(prev => ({
        ...prev,
        labourEntries: [...prev.labourEntries, newEntry],
      }));
    }

    setShowAddLabour(false);
    setTempLabourData({});
  };

  const handleDeleteLabour = id => {
    Alert.alert(
      'Delete Labour Entry',
      'Are you sure you want to delete this labour entry?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTimesheetData(prev => ({
              ...prev,
              labourEntries: prev.labourEntries.filter(
                entry => entry.id !== id,
              ),
            }));
          },
        },
      ],
    );
  };

  // Material entry handlers
  const handleAddMaterial = () => {
    setTempMaterialData({
      id: `material-${Date.now()}`,
      name: '',
      unit: 'pieces',
      totalOrdered: 0,
      amountUsed: 0,
      amountRemaining: 0,
      unitCost: 0,
      totalCost: 0,
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

    const totalCost =
      (tempMaterialData.amountUsed || 0) * (tempMaterialData.unitCost || 0);
    const amountRemaining =
      (tempMaterialData.totalOrdered || 0) - (tempMaterialData.amountUsed || 0);

    const newEntry = {
      ...tempMaterialData,
      totalCost,
      amountRemaining,
    };

    if (editingMaterial) {
      setTimesheetData(prev => ({
        ...prev,
        materialEntries: prev.materialEntries.map(entry =>
          entry.id === editingMaterial ? newEntry : entry,
        ),
      }));
      setEditingMaterial(null);
    } else {
      setTimesheetData(prev => ({
        ...prev,
        materialEntries: [...prev.materialEntries, newEntry],
      }));
    }

    setShowAddMaterial(false);
    setTempMaterialData({});
  };

  const handleDeleteMaterial = id => {
    Alert.alert(
      'Delete Material Entry',
      'Are you sure you want to delete this material entry?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTimesheetData(prev => ({
              ...prev,
              materialEntries: prev.materialEntries.filter(
                entry => entry.id !== id,
              ),
            }));
          },
        },
      ],
    );
  };

  // Additional charge handlers
  const handleAddCharge = () => {
    setTempChargeData({
      id: `charge-${Date.now()}`,
      description: '',
      category: 'Other',
      amount: 0,
      receipt: '',
      notes: '',
    });
    setShowAddCharge(true);
  };

  const handleSaveCharge = () => {
    if (!tempChargeData.description) {
      Alert.alert('Error', 'Please fill in charge description');
      return;
    }

    const newEntry = tempChargeData;

    if (editingCharge) {
      setTimesheetData(prev => ({
        ...prev,
        additionalCharges: prev.additionalCharges.map(entry =>
          entry.id === editingCharge ? newEntry : entry,
        ),
      }));
      setEditingCharge(null);
    } else {
      setTimesheetData(prev => ({
        ...prev,
        additionalCharges: [...prev.additionalCharges, newEntry],
      }));
    }

    setShowAddCharge(false);
    setTempChargeData({});
  };

  const handleDeleteCharge = id => {
    Alert.alert(
      'Delete Additional Charge',
      'Are you sure you want to delete this charge?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTimesheetData(prev => ({
              ...prev,
              additionalCharges: prev.additionalCharges.filter(
                entry => entry.id !== id,
              ),
            }));
          },
        },
      ],
    );
  };

  // Submit for approval
  const handleSubmitForApproval = () => {
    if (timesheetData.labourEntries.length === 0) {
      Alert.alert('Error', 'Please add at least one labour entry');
      return;
    }

    const newStatus =
      timesheetData.status === 'rejected' ? 'submitted' : 'submitted';
    setTimesheetData(prev => ({
      ...prev,
      status: newStatus,
      submittedAt: new Date().toISOString(),
      rejectionReason: undefined, // Clear rejection reason on resubmit
    }));

    const message =
      timesheetData.status === 'rejected'
        ? 'Bluesheet resubmitted for approval'
        : 'Bluesheet submitted for approval';
    Alert.alert('Success', message);
  };

  // Approval handlers for Lead Labor
  const handleApprove = () => {
    setTimesheetData(prev => ({
      ...prev,
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: user?.name || 'Management',
    }));
    Alert.alert('Success', 'Bluesheet approved');
  };

  const handleReject = () => {
    Alert.prompt(
      'Reject Bluesheet',
      'Please provide a reason for rejection:',
      reason => {
        if (reason) {
          setTimesheetData(prev => ({
            ...prev,
            status: 'rejected',
            rejectionReason: reason,
          }));
          Alert.alert('Success', 'Bluesheet rejected');
        }
      },
    );
  };

  // Navigation handler - go back to appropriate screen
  const handleBack = () => {
    if (timesheet) {
      // If viewing from timesheet listing, go back to listing
      navigation.goBack();
    } else {
      // If creating new timesheet, go back to job detail
      navigation.goBack();
    }
  };

  // Modal components
  const AddEllipsis = ({text}) => {
    const words = text.split(' '); // Split the text into words
    if (words.length > 10) {
      // Limit to 10 words and add ellipsis
      text = words.slice(0, 10).join(' ') + '...';
    }
    return <Text style={[styles.tableCell, {flex: 1}]}>{text}</Text>;
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#3B82F6" barStyle="light-content" />

      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {timesheet ? 'Bluesheet Details' : 'Daily Timesheet'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {timesheet ? timesheet.jobTitle : job?.title || 'Unknown Job'} •{' '}
            {formatDate(timesheetData.date)}
          </Text>
        </View>

        <View style={styles.headerSpacer} />
      </View> */}

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={24} color={'#fff'} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            {' '}
            <Text style={styles.headerTitle}>Job Bluesheet</Text>
            <Text style={styles.headerSubtitle}>
              {' '}
              {formatDate(selectedDate)}{' '}
            </Text>
          </View>

          <TouchableOpacity style={styles.addButton}>
            {/* // onPress={() => setShowAddEntryModal(true)}>
            // <Icon name="add" size={24} color={Colors.white} /> */}
          </TouchableOpacity>
        </View>
      </View>
      {/* Summary Cards */}
      {/* <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {7}h {50}m
          </Text>
          <Text style={[styles.summaryLabel, {fontSize: 12}]}>Total Time</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{timeEntries.length}</Text>
          <Text style={[styles.summaryLabel, {fontSize: 12}]}>Activities</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {timeEntries.filter(e => !e.isManual).length}
          </Text>
          <Text style={[styles.summaryLabel, {fontSize: 12}]}>
            Auto Tracked
          </Text>
        </View>
      </View> */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status and Job Info */}
        <View style={styles.statusCard}>
          {/* <View style={styles.statusHeader}> */}
          {/* <View style={styles.jobInfo}>
              <Text style={styles.jobTitle}>
                {timesheet ? timesheet.jobTitle : job?.title || 'Unknown Job'}
              </Text>
              <Text style={styles.jobCustomer}>
                {timesheet
                  ? timesheet.customer
                  : job?.customer?.name || 'Unknown Customer'}
              </Text>
              <Text style={styles.jobLocation}>
                {timesheet
                  ? timesheet.location
                  : job?.customer?.address || 'Unknown Location'}
              </Text>
            </View> */}
          {/* <View style={styles.statusBadges}>
              <View
                style={[
                  styles.statusBadge,
                  getStatusColor(timesheetData.status),
                ]}>
                <Text
                  style={[
                    styles.statusBadgeText,
                    {color: getStatusColor(timesheetData.status).color},
                  ]}>
                  {timesheetData.status.toUpperCase()}
                </Text>
              </View>
              {isReadOnly() && (
                <View style={styles.readOnlyBadge}>
                  <Text style={styles.readOnlyBadgeText}>READ-ONLY</Text>
                </View>
              )}
            </View> */}
          {/* </View> */}

          {/* Status specific messages */}
          {timesheetData.status === 'rejected' &&
            timesheetData.rejectionReason && (
              <View style={styles.rejectionInfo}>
                <Text style={styles.rejectionIcon}>⚠️</Text>
                <View style={styles.rejectionText}>
                  <Text style={styles.rejectionTitle}>Bluesheet Rejected</Text>
                  <Text style={styles.rejectionReason}>
                    {timesheetData.rejectionReason}
                  </Text>
                </View>
              </View>
            )}

          {timesheetData.status === 'approved' && timesheetData.approvedAt && (
            <View style={styles.approvalInfo}>
              <Text style={styles.approvalIcon}>✅</Text>
              <View style={styles.approvalText}>
                <Text style={styles.approvalTitle}>Bluesheet Approved</Text>
                <Text style={styles.approvalDetails}>
                  Approved by {timesheetData.approvedBy || 'Management'} on{' '}
                  {new Date(timesheetData.approvedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Labour Hours Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Feather name="clock" size={20} color={tabColor} />
            <Text style={styles.sectionTitle}>Labour Hours</Text>
            {canEdit() && !isReadOnly() && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddLabour}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* {timesheetData.labourEntries.map(entry => (
            <View key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.entryInfo}>
                  <Text style={styles.entryName}>
                    {entry?.employeeName || 'Sarah Johnson'}
                  </Text>
                  <Text style={styles.entryDetails}>
                    {entry.role} • {entry.employeeId}
                  </Text>
                </View>
                {canEdit() && !isReadOnly() && (
                  <View style={styles.entryActions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => {
                        setTempLabourData(entry);
                        setEditingLabour(entry.id);
                        setShowAddLabour(true);
                      }}>
                      <MaterialIcons name="edit" size={24} color={tabColor} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteLabour(entry.id)}>
                      <MaterialIcons
                        name="delete"
                        size={24}
                        color={'#dc2626'}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.entryDetails}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryLabel}>Regular Hours:</Text>
                  <Text style={styles.entryValue}>{entry.regularHours}h</Text>
                </View>
                <View style={styles.entryRow}>
                  <Text style={styles.entryLabel}>Overtime Hours:</Text>
                  <Text style={styles.entryValue}>{entry.overtimeHours}h</Text>
                </View>
                {entry.notes && (
                  <Text style={styles.entryNotes}>{entry.notes}</Text>
                )}
              </View>
            </View>
          ))} */}
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, {flex: 1}]}>Employee</Text>
              <Text style={[styles.tableHeaderText, {flex: 1}]}>Role</Text>
              <Text style={[styles.tableHeaderText, {flex: 1}]}>Reg.hrs</Text>
              {/* <Text style={[styles.tableHeaderText, {flex: 1}]}>OT Hrs</Text> */}
              {canEdit() && !isReadOnly() && (
                <Text style={[styles.tableHeaderText, {flex: 1}]}>Actions</Text>
              )}
            </View>

            {/* Table Rows */}
            {timesheetData?.labourEntries.map(entry => (
              <View key={entry.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, {flex: 1}]}>
                  {entry?.employeeName || 'Sarah Johnson'}
                </Text>

                <Text style={[styles.tableCell, {flex: 1}]}>{entry.role}</Text>
                <Text style={[styles.tableCell, {flex: 1}]}>
                  {entry.regularHours}h
                </Text>
                {/* <Text style={[styles.tableCell, {flex: 1}]}>
                  {entry.overtimeHours}h
                </Text> */}

                {canEdit() && !isReadOnly() && (
                  <View
                    style={[styles.tableCell, {flex: 1, flexDirection: 'row'}]}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => {
                        setTempLabourData(entry);
                        setEditingLabour(entry.id);
                        setShowAddLabour(true);
                      }}>
                      <MaterialIcons name="edit" size={20} color={tabColor} />
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

        {/* Materials Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Feather name="box" size={20} color={tabColor} />
            <Text style={styles.sectionTitle}>Materials</Text>
            {canEdit() && !isReadOnly() && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddMaterial}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* {timesheetData.materialEntries.map(material => (
            <View key={material.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.entryInfo}>
                  <Text style={styles.entryName}>{material.name}</Text>
                  <Text style={styles.entryDetails}>
                    Order ID: {material.supplierOrderId} • ${material.unitCost}/
                    {material.unit}
                  </Text>
                </View>
                {canEdit() && !isReadOnly() && (
                  <View style={styles.entryActions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => {
                        setTempMaterialData(material);
                        setEditingMaterial(material.id);
                        setShowAddMaterial(true);
                      }}>
                      <MaterialIcons name="edit" size={24} color={tabColor} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteMaterial(material.id)}>
                      <MaterialIcons
                        name="delete"
                        size={24}
                        color={'#dc2626'}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.materialGrid}>
                <View style={styles.materialGridItem}>
                  <Text style={styles.entryLabel}>Ordered:</Text>
                  <Text style={styles.entryValue}>
                    {material.totalOrdered} {material.unit}
                  </Text>
                </View>
                <View style={styles.materialGridItem}>
                  <Text style={styles.entryLabel}>Used:</Text>
                  <Text style={styles.entryValue}>
                    {material.amountUsed} {material.unit}
                  </Text>
                </View>
                <View style={styles.materialGridItem}>
                  <Text style={styles.entryLabel}>Remaining:</Text>
                  <Text style={styles.entryValue}>
                    {material.amountRemaining} {material.unit}
                  </Text>
                </View>
              </View>

              
            </View>
          ))} */}
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, {flex: 1}]}>Title</Text>
              <Text style={[styles.tableHeaderText, {flex: 1}]}>Qty</Text>
              <Text style={[styles.tableHeaderText, {flex: 1}]}>Used</Text>
              {canEdit() && !isReadOnly() && (
                <Text style={[styles.tableHeaderText, {flex: 1}]}>Actions</Text>
              )}
            </View>

            {/* Table Rows */}
            {timesheetData.materialEntries.map(material => (
              <View key={material.id} style={styles.tableRow}>
                {/* Title */}
                <Text style={[styles.tableCell, {flex: 1}]}>
                  {material.name}
                </Text>

                {/* Qty (ordered + unit) */}
                <Text style={[styles.tableCell, {flex: 1}]}>
                  {material.totalOrdered} {material.unit}
                </Text>

                {/* Used */}
                <Text style={[styles.tableCell, {flex: 1}]}>
                  {material.amountUsed} {material.unit}
                </Text>

                {/* Actions */}
                {canEdit() && !isReadOnly() && (
                  <View
                    style={[styles.tableCell, {flex: 1, flexDirection: 'row'}]}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => {
                        setTempMaterialData(material);
                        setEditingMaterial(material.id);
                        setShowAddMaterial(true);
                      }}>
                      <MaterialIcons name="edit" size={20} color={tabColor} />
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

        {/* Additional Charges Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="attach-money" size={24} color={tabColor} />
            <Text style={styles.sectionTitle}>Additional Charges</Text>
            {canEdit() && !isReadOnly() && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddCharge}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* {timesheetData.additionalCharges.map(charge => (
            <View key={charge.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.entryInfo}>
                  <Text style={styles.entryName}>{charge.description}</Text>
                  <Text style={styles.entryDetails}>{charge.category}</Text>
                  {charge.receipt && (
                    <Text style={styles.entryDetails}>
                      Receipt: {charge.receipt}
                    </Text>
                  )}
                </View>
                <View style={styles.chargeAmount}>
                  <Text style={styles.chargeAmountValue}>2</Text>
                  {canEdit() && !isReadOnly() && (
                    <View style={styles.entryActions}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => {
                          setTempChargeData(charge);
                          setEditingCharge(charge.id);
                          setShowAddCharge(true);
                        }}>
                        <MaterialIcons name="edit" size={24} color={tabColor} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteCharge(charge.id)}>
                        <MaterialIcons
                          name="delete"
                          size={24}
                          color={'#dc2626'}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
              {charge.notes && (
                <Text style={styles.entryNotes}>{charge.notes}</Text>
              )}
            </View>
          ))} */}

          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, {flex: 2}]}>Title</Text>
              <Text style={[styles.tableHeaderText, {flex: 1}]}>Qty</Text>
              <Text style={[styles.tableHeaderText, {flex: 1}]}>Amount</Text>
              {canEdit() && !isReadOnly() && (
                <Text style={[styles.tableHeaderText, {flex: 1}]}>Actions</Text>
              )}
            </View>

            {/* Table Rows */}
            {timesheetData.additionalCharges.map(charge => (
              <View key={charge.id} style={styles.tableRow}>
                {/* Title */}
                <View style={{flex: 2}}>
                  <Text style={styles.tableCell}>{charge.title}</Text>
                  <Text
                    style={[styles.tableCell, {fontSize: 12, color: '#666'}]}>
                    {charge.description}
                  </Text>
                  {/* {charge.receipt && (
          <Text style={[styles.tableCell, {fontSize: 12, color: '#666'}]}>
            Receipt: {charge.receipt}
          </Text>
        )}
        {charge.notes && (
          <Text style={[styles.tableCell, {fontSize: 12, fontStyle: 'italic'}]}>
            {charge.notes}
          </Text>
        )} */}
                </View>

                {/* Qty */}
                <Text style={[styles.tableCell, {flex: 1}]}>
                  {charge.quantity || 1}
                </Text>

                {/* Amount */}
                <Text style={[styles.tableCell, {flex: 1}]}>
                  ${charge.amount?.toFixed(2) || '0.00'}
                </Text>

                {/* Actions */}
                {canEdit() && !isReadOnly() && (
                  <View
                    style={[styles.tableCell, {flex: 1, flexDirection: 'row'}]}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => {
                        setTempChargeData(charge);
                        setEditingCharge(charge.id);
                        setShowAddCharge(true);
                      }}>
                      <MaterialIcons name="edit" size={20} color={tabColor} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteCharge(charge.id)}>
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

        {/* Notes Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="edit-note" size={26} color={tabColor} />
            <Text style={styles.sectionTitle}>Job Notes</Text>
          </View>
          <TextInput
            style={styles.notesInput}
            value={timesheetData.jobNotes}
            onChangeText={text =>
              setTimesheetData(prev => ({
                ...prev,
                jobNotes: text,
              }))
            }
            placeholder="Add any additional notes about the job..."
            multiline
            numberOfLines={4}
            editable={canEdit() && !isReadOnly()}
          />
        </View>

        {/* Summary and Submit */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="summarize" size={26} color={tabColor} />
            <Text style={styles.sectionTitle}>Summary</Text>
          </View>

          <View style={styles.summaryBreakdown}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Labour:</Text>
              <Text style={styles.summaryValue}>
                5{/* ${totals.labour.toFixed(2)} */}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Material:</Text>
              <Text style={styles.summaryValue}>
                {/* ${totals.materials.toFixed(2)} */}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Additional items:</Text>
              <Text style={styles.summaryValue}>
                3{/* ${totals.charges.toFixed(2)} */}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            {/* <View style={styles.summaryTotal}>
              <Text style={styles.summaryTotalLabel}>Total Cost:</Text>
              <Text style={styles.summaryTotalValue}>
                ${totals.grandTotal.toFixed(2)}
              </Text>
            </View> */}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {/* Submit/Resubmit Button */}
            {(timesheetData.status === 'draft' ||
              timesheetData.status === 'rejected') &&
              canEdit() &&
              !isReadOnly() && (
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    timesheetData.status === 'rejected' &&
                      styles.resubmitButton,
                  ]}
                  onPress={handleSubmitForApproval}>
                  <Text style={styles.submitButtonText}>
                    {timesheetData.status === 'rejected'
                      ? 'Resubmit for Approval'
                      : 'Submit for Approval'}
                  </Text>
                </TouchableOpacity>
              )}

            {/* Submitted Status */}
            {timesheetData.status === 'submitted' && (
              <View style={styles.submittedStatus}>
                <Text style={styles.submittedStatusTitle}>
                  Bluesheet submitted for approval
                </Text>
                <Text style={styles.submittedStatusDetails}>
                  Submitted on{' '}
                  {timesheetData.submittedAt
                    ? new Date(timesheetData.submittedAt).toLocaleDateString(
                        'en-US',
                        {
                          month: 'numeric', // "August"
                          day: 'numeric',
                          year: 'numeric',
                        },
                      )
                    : // new Date(timesheetData.submittedAt).toLocaleDateString()
                      'Unknown'}
                </Text>
                {user?.role === 'Lead Labor' && (
                  <View style={styles.leadActions}>
                    <TouchableOpacity
                      style={styles.approveButton}
                      onPress={handleApprove}>
                      <Text style={styles.approveButtonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={handleReject}>
                      <Text style={styles.rejectButtonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {/* Approved Status */}
            {timesheetData.status === 'approved' && (
              <View style={styles.approvedStatus}>
                <Text style={styles.approvedStatusTitle}>
                  Bluesheet approved
                </Text>
                <Text style={styles.approvedStatusDetails}>
                  Approved by {timesheetData.approvedBy || 'Management'} on{' '}
                  {timesheetData.approvedAt
                    ? new Date(timesheetData.approvedAt).toLocaleDateString()
                    : 'Unknown'}
                </Text>
              </View>
            )}

            {/* Back to list button */}
            {timesheet && (
              <TouchableOpacity
                style={styles.backToListButton}
                onPress={() => navigation.navigate('TimeSheetScreen')}>
                <Text style={styles.backToListButtonText}>
                  Back to All Timesheets
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modals */}
      <LabourModal
        visible={showAddLabour}
        setShowAddLabour={setShowAddLabour}
        editingLabour={editingLabour}
        setEditingLabour={setEditingLabour}
        tempLabourData={tempLabourData}
        setTempLabourData={setTempLabourData}
        handleSaveLabour={handleSaveLabour}
      />
      <MaterialModal
        visible={showAddMaterial}
        onClose={() => setShowAddMaterial(false)}
        tempMaterialData={tempMaterialData}
        setTempMaterialData={setTempMaterialData}
        editingMaterial={editingMaterial}
        setEditingMaterial={setEditingMaterial}
        handleSaveMaterial={handleSaveMaterial}
        setShowAddMaterial={setShowAddMaterial}
      />

      <ChargeModal
        visible={showAddCharge}
        onClose={() => setShowAddCharge(false)}
        tempChargeData={tempChargeData}
        setTempChargeData={setTempChargeData}
        editingCharge={editingCharge}
        setEditingCharge={setEditingCharge}
        handleSaveCharge={handleSaveCharge}
        setShowAddCharge={setShowAddCharge}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    marginBottom: 70,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: Spacing.sm,
    // paddingHorizontal: Spacing.lg,
    // paddingBottom: Spacing.sm,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.primaryLight,
    marginTop: Spacing.xs,
  },
  addButton: {
    padding: Spacing.sm,
  },

  // Summary
  summaryContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.primaryLight,
    marginTop: Spacing.xs,
  },

  content: {
    flex: 1,
  },
  statusCard: {
    // backgroundColor: 'white',
    margin: 16,
    padding: 0,
    borderRadius: 12,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  jobCustomer: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  jobLocation: {
    fontSize: 14,
    color: '#9ca3af',
  },
  statusBadges: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  readOnlyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  readOnlyBadgeText: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600',
  },
  rejectionInfo: {
    backgroundColor: '#fee2e2',
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rejectionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  rejectionText: {
    flex: 1,
  },
  rejectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 4,
  },
  rejectionReason: {
    fontSize: 14,
    color: '#dc2626',
  },
  approvalInfo: {
    backgroundColor: '#dcfce7',
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  approvalIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  approvalText: {
    flex: 1,
  },
  approvalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
    marginBottom: 4,
  },
  approvalDetails: {
    fontSize: 14,
    color: '#16a34a',
  },
  sectionCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
    color: '#3B82F6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3B82F6',
    flex: 1,
    marginLeft: 10,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  entryCard: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  entryInfo: {
    flex: 1,
  },
  entryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  entryDetails: {
    fontSize: 14,
    color: '#6b7280',
  },
  entryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    fontSize: 16,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  entryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  entryCostRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
    marginTop: 8,
  },
  entryCostLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  entryCostValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  entryNotes: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 8,
  },
  materialGrid: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  materialGridItem: {
    flex: 1,
    alignItems: 'center',
  },
  materialFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
  },
  materialCost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  returnStatus: {
    flex: 1,
    alignItems: 'flex-end',
  },
  returnStatusText: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  returnStatusWarehouse: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  returnStatusSite: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
  },
  chargeAmount: {
    alignItems: 'flex-end',
  },
  chargeAmountValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  sectionTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  sectionTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  sectionTotalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B82F6',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#f9fafb',
    textAlignVertical: 'top',
    minHeight: 96,
  },
  summaryBreakdown: {
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  summaryTotalValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3B82F6',
  },
  actionButtons: {
    gap: 12,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  resubmitButton: {
    backgroundColor: '#ea580c',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  submittedStatus: {
    backgroundColor: '#dbeafe',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submittedStatusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d4ed8',
    marginBottom: 4,
  },
  submittedStatusDetails: {
    fontSize: 14,
    color: '#1d4ed8',
    marginBottom: 12,
  },
  leadActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  approveButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  approveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  rejectButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },
  approvedStatus: {
    backgroundColor: '#dcfce7',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  approvedStatusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16a34a',
    marginBottom: 4,
  },
  approvedStatusDetails: {
    fontSize: 14,
    color: '#16a34a',
    textAlign: 'center',
  },
  backToListButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  backToListButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 28,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalCloseButton: {
    fontSize: 18,
    color: '#6b7280',
    padding: 8,
  },
  modalBody: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
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
  modalButtonPrimary: {
    backgroundColor: '#3B82F6',
  },
  modalButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  modalButtonTextPrimary: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextSecondary: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
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
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#111',
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
    // width:widthPercentageToDP(30)
  },
});

export default JobTimesheet;

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   StyleSheet,
//   Alert,
//   Modal,
//   SafeAreaView,
//   StatusBar,
//   Dimensions,
// } from 'react-native';

// // Mock icon components - in a real app, you'd use react-native-vector-icons
// const ChevronLeftIcon = () => <Text style={styles.icon}>←</Text>;
// const ClockIcon = () => <Text style={styles.icon}>🕐</Text>;
// const PackageIcon = () => <Text style={styles.icon}>📦</Text>;
// const FileTextIcon = () => <Text style={styles.icon}>📄</Text>;
// const PlusIcon = () => <Text style={styles.icon}>+</Text>;
// const EditIcon = () => <Text style={styles.icon}>✏️</Text>;
// const SaveIcon = () => <Text style={styles.icon}>💾</Text>;
// const XIcon = () => <Text style={styles.icon}>✕</Text>;
// const CheckCircleIcon = () => <Text style={styles.icon}>✅</Text>;
// const AlertCircleIcon = () => <Text style={styles.icon}>⚠️</Text>;
// const ChevronDownIcon = () => <Text style={styles.icon}>▼</Text>;

// const { width: screenWidth } = Dimensions.get('window');

// const JobTimesheet = ({ navigation, route, user, job, timesheet }) => {
//   const [timesheetData, setTimesheetData] = useState(() => {
//     if (timesheet) {
//       return {
//         id: timesheet.id,
//         jobId: timesheet.jobId,
//         date: timesheet.date,
//         status: timesheet.status,
//         jobNotes: '',
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
//             notes: 'Loaded from existing timesheet'
//           }
//         ],
//         materialEntries: [
//           {
//             id: '1',
//             name: 'Electrical Wire 12AWG',
//             unit: 'feet',
//             totalOrdered: 500,
//             amountUsed: 350,
//             amountRemaining: 150,
//             supplierOrderId: 'ORD-2024-001',
//             returnToWarehouse: false
//           }
//         ],
//         additionalCharges: [
//           {
//             id: '1',
//             description: 'Additional job expenses',
//             category: 'Other',
//             notes: 'Loaded from existing timesheet'
//           }
//         ]
//       };
//     }

//     return {
//       id: `timesheet-${job?.id || 'new'}-${new Date().toISOString().split('T')[0]}`,
//       jobId: job?.id || 'unknown',
//       date: new Date().toISOString().split('T')[0],
//       status: 'draft',
//       jobNotes: '',
//       labourEntries: [
//         {
//           id: '1',
//           employeeName: user?.name || 'Current User',
//           employeeId: user?.employee_id || 'EMP001',
//           role: user?.role || 'Labor',
//           regularHours: 8,
//           overtimeHours: 0,
//           notes: 'Main electrical work and installation'
//         }
//       ],
//       materialEntries: [
//         {
//           id: '1',
//           name: 'Electrical Wire 12AWG',
//           unit: 'feet',
//           totalOrdered: 500,
//           amountUsed: 350,
//           amountRemaining: 150,
//           supplierOrderId: 'ORD-2024-001',
//           returnToWarehouse: false
//         },
//         {
//           id: '2',
//           name: 'Circuit Breakers 20A',
//           unit: 'pieces',
//           totalOrdered: 12,
//           amountUsed: 8,
//           amountRemaining: 4,
//           supplierOrderId: 'ORD-2024-001',
//           returnToWarehouse: false
//         }
//       ],
//       additionalCharges: [
//         {
//           id: '1',
//           description: 'Parking permit for downtown work site',
//           category: 'Permits',
//           notes: 'Required for street work access'
//         }
//       ]
//     };
//   });

//   const [showAddMaterial, setShowAddMaterial] = useState(false);
//   const [showAddLabour, setShowAddLabour] = useState(false);
//   const [showAddCharge, setShowAddCharge] = useState(false);
//   const [showJobDetails, setShowJobDetails] = useState(false);
//   const [editingMaterial, setEditingMaterial] = useState(null);
//   const [editingLabour, setEditingLabour] = useState(null);
//   const [editingCharge, setEditingCharge] = useState(null);

//   const [tempMaterialData, setTempMaterialData] = useState({});
//   const [tempLabourData, setTempLabourData] = useState({});
//   const [tempChargeData, setTempChargeData] = useState({});

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'draft': return { backgroundColor: '#F3F4F6', color: '#374151' };
//       case 'submitted': return { backgroundColor: '#DBEAFE', color: '#1D4ED8' };
//       case 'approved': return { backgroundColor: '#D1FAE5', color: '#065F46' };
//       case 'rejected': return { backgroundColor: '#FEE2E2', color: '#991B1B' };
//       default: return { backgroundColor: '#F3F4F6', color: '#374151' };
//     }
//   };

//   const canEdit = () => {
//     return timesheetData.status === 'draft' ||
//            timesheetData.status === 'rejected';
//   };

//   const isReadOnly = () => {
//     return timesheetData.status === 'approved';
//   };

//   const handleAddMaterial = () => {
//     if (!tempMaterialData.name || !tempMaterialData.totalOrdered || !tempMaterialData.unit) {
//       Alert.alert('Error', 'Please fill in required fields (name, total ordered, unit)');
//       return;
//     }

//     const newMaterial = {
//       id: Date.now().toString(),
//       name: tempMaterialData.name,
//       unit: tempMaterialData.unit,
//       totalOrdered: tempMaterialData.totalOrdered,
//       amountUsed: tempMaterialData.amountUsed || 0,
//       amountRemaining: tempMaterialData.totalOrdered - (tempMaterialData.amountUsed || 0),
//       supplierOrderId: tempMaterialData.supplierOrderId || '',
//       returnToWarehouse: tempMaterialData.returnToWarehouse || false
//     };

//     setTimesheetData(prev => ({
//       ...prev,
//       materialEntries: [...prev.materialEntries, newMaterial]
//     }));

//     setShowAddMaterial(false);
//     setTempMaterialData({});
//     Alert.alert('Success', 'Material entry added');
//   };

//   const handleSubmitForApproval = () => {
//     if (timesheetData.labourEntries.length === 0) {
//       Alert.alert('Error', 'Please add at least one labour entry');
//       return;
//     }

//     setTimesheetData(prev => ({
//       ...prev,
//       status: 'submitted',
//       submittedAt: new Date().toISOString()
//     }));

//     Alert.alert('Success', 'Timesheet submitted for approval');
//   };

//   const handleBack = () => {
//     if (navigation.canGoBack()) {
//       navigation.goBack();
//     }
//   };

//   const renderAddMaterialModal = () => (
//     <Modal
//       visible={showAddMaterial}
//       animationType="slide"
//       presentationStyle="pageSheet"
//       onRequestClose={() => setShowAddMaterial(false)}
//     >
//       <SafeAreaView style={styles.modalContainer}>
//         <View style={styles.modalHeader}>
//           <TouchableOpacity onPress={() => setShowAddMaterial(false)}>
//             <XIcon />
//           </TouchableOpacity>
//           <Text style={styles.modalTitle}>Add Material Entry</Text>
//           <View style={{ width: 24 }} />
//         </View>

//         <ScrollView style={styles.modalContent}>
//           <View style={styles.formGroup}>
//             <Text style={styles.label}>Material Name *</Text>
//             <TextInput
//               style={styles.input}
//               value={tempMaterialData.name || ''}
//               onChangeText={(text) => setTempMaterialData(prev => ({ ...prev, name: text }))}
//               placeholder="e.g., Electrical Wire 12AWG"
//             />
//           </View>

//           <View style={styles.formRow}>
//             <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
//               <Text style={styles.label}>Unit *</Text>
//               <TextInput
//                 style={styles.input}
//                 value={tempMaterialData.unit || ''}
//                 onChangeText={(text) => setTempMaterialData(prev => ({ ...prev, unit: text }))}
//                 placeholder="feet, pieces, etc."
//               />
//             </View>
//             <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
//               <Text style={styles.label}>Total Ordered *</Text>
//               <TextInput
//                 style={styles.input}
//                 value={tempMaterialData.totalOrdered?.toString() || ''}
//                 onChangeText={(text) => setTempMaterialData(prev => ({
//                   ...prev,
//                   totalOrdered: parseFloat(text) || 0
//                 }))}
//                 keyboardType="numeric"
//                 placeholder="0"
//               />
//             </View>
//           </View>

//           <View style={styles.formGroup}>
//             <Text style={styles.label}>Amount Used</Text>
//             <TextInput
//               style={styles.input}
//               value={tempMaterialData.amountUsed?.toString() || ''}
//               onChangeText={(text) => setTempMaterialData(prev => ({
//                 ...prev,
//                 amountUsed: parseFloat(text) || 0
//               }))}
//               keyboardType="numeric"
//               placeholder="0"
//             />
//           </View>

//           <View style={styles.formGroup}>
//             <Text style={styles.label}>Supplier Order ID</Text>
//             <TextInput
//               style={styles.input}
//               value={tempMaterialData.supplierOrderId || ''}
//               onChangeText={(text) => setTempMaterialData(prev => ({
//                 ...prev,
//                 supplierOrderId: text
//               }))}
//               placeholder="e.g., ORD-2024-001"
//             />
//           </View>

//           <TouchableOpacity
//             style={styles.checkboxContainer}
//             onPress={() => setTempMaterialData(prev => ({
//               ...prev,
//               returnToWarehouse: !prev.returnToWarehouse
//             }))}
//           >
//             <View style={[styles.checkbox, tempMaterialData.returnToWarehouse && styles.checkboxChecked]}>
//               {tempMaterialData.returnToWarehouse && <Text style={styles.checkmark}>✓</Text>}
//             </View>
//             <Text style={styles.checkboxLabel}>Return remainder to warehouse</Text>
//           </TouchableOpacity>
//         </ScrollView>

//         <View style={styles.modalActions}>
//           <TouchableOpacity
//             style={[styles.button, styles.primaryButton]}
//             onPress={handleAddMaterial}
//           >
//             <PlusIcon />
//             <Text style={styles.buttonText}>Add Material</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.button, styles.secondaryButton]}
//             onPress={() => {
//               setShowAddMaterial(false);
//               setTempMaterialData({});
//             }}
//           >
//             <XIcon />
//             <Text style={[styles.buttonText, styles.secondaryButtonText]}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     </Modal>
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
//           <ChevronLeftIcon />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>
//           {timesheet ? 'Timesheet Details' : 'Daily Timesheet'}
//         </Text>
//         <View style={{ width: 40 }} />
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {/* Job Title and Date */}
//         <View style={styles.jobHeaderCard}>
//           <Text style={styles.jobTitle}>
//             {timesheet ? timesheet.jobTitle : job?.title || 'Unknown Job'}
//           </Text>
//           <Text style={styles.jobDate}>
//             {formatDate(timesheetData.date)}
//           </Text>
//         </View>

//         {/* Status Indicators */}
//         <View style={styles.statusContainer}>
//           <View style={[styles.statusBadge, getStatusColor(timesheetData.status)]}>
//             <Text style={[styles.statusText, { color: getStatusColor(timesheetData.status).color }]}>
//               {timesheetData.status.toUpperCase()}
//             </Text>
//           </View>
//           {isReadOnly() && (
//             <View style={styles.readOnlyBadge}>
//               <Text style={styles.readOnlyText}>READ-ONLY</Text>
//             </View>
//           )}
//         </View>

//         {/* Status Messages */}
//         {timesheetData.status === 'rejected' && timesheetData.rejectionReason && (
//           <View style={styles.rejectionCard}>
//             <View style={styles.rejectionHeader}>
//               <AlertCircleIcon />
//               <Text style={styles.rejectionTitle}>Timesheet Rejected</Text>
//             </View>
//             <Text style={styles.rejectionReason}>{timesheetData.rejectionReason}</Text>
//           </View>
//         )}

//         {timesheetData.status === 'approved' && timesheetData.approvedAt && (
//           <View style={styles.approvalCard}>
//             <View style={styles.approvalHeader}>
//               <CheckCircleIcon />
//               <Text style={styles.approvalTitle}>Timesheet Approved</Text>
//             </View>
//             <Text style={styles.approvalDetails}>
//               Approved by {timesheetData.approvedBy || 'Management'} on {new Date(timesheetData.approvedAt).toLocaleDateString()}
//             </Text>
//           </View>
//         )}

//         {/* Job Details Dropdown */}
//         <TouchableOpacity
//           style={styles.dropdownHeader}
//           onPress={() => setShowJobDetails(!showJobDetails)}
//         >
//           <Text style={styles.dropdownTitle}>Job Details</Text>
//           <ChevronDownIcon />
//         </TouchableOpacity>

//         {showJobDetails && (
//           <View style={styles.dropdownContent}>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Customer:</Text>
//               <Text style={styles.detailValue}>
//                 {timesheet ? timesheet.customer : job?.customer?.name || 'Unknown Customer'}
//               </Text>
//             </View>
//             <View style={styles.detailRow}>
//               <Text style={styles.detailLabel}>Location:</Text>
//               <Text style={styles.detailValue}>
//                 {timesheet ? timesheet.location : job?.customer?.address || 'Unknown Location'}
//               </Text>
//             </View>
//           </View>
//         )}

//         {/* Labour Hours Section */}
//         <View style={styles.sectionCard}>
//           <View style={styles.sectionHeader}>
//             <View style={styles.sectionTitleContainer}>
//               <ClockIcon />
//               <Text style={styles.sectionTitle}>Labour Hours</Text>
//             </View>
//             {canEdit() && !isReadOnly() && (
//               <TouchableOpacity
//                 style={styles.addButton}
//                 onPress={() => setShowAddLabour(true)}
//               >
//                 <PlusIcon />
//               </TouchableOpacity>
//             )}
//           </View>

//           {timesheetData.labourEntries.map((entry) => (
//             <View key={entry.id} style={styles.entryCard}>
//               <View style={styles.entryHeader}>
//                 <View>
//                   <Text style={styles.entryName}>{entry.employeeName}</Text>
//                   <Text style={styles.entrySubtitle}>{entry.role} • {entry.employeeId}</Text>
//                 </View>
//                 {canEdit() && !isReadOnly() && editingLabour !== entry.id && (
//                   <TouchableOpacity
//                     style={styles.editButton}
//                     onPress={() => {
//                       setEditingLabour(entry.id);
//                       setTempLabourData(entry);
//                     }}
//                   >
//                     <EditIcon />
//                   </TouchableOpacity>
//                 )}
//               </View>

//               <View style={styles.hoursGrid}>
//                 <View style={styles.hoursItem}>
//                   <Text style={styles.hoursLabel}>Regular Hours:</Text>
//                   <Text style={styles.hoursValue}>{entry.regularHours}h</Text>
//                 </View>
//                 <View style={styles.hoursItem}>
//                   <Text style={styles.hoursLabel}>Overtime Hours:</Text>
//                   <Text style={styles.hoursValue}>{entry.overtimeHours}h</Text>
//                 </View>
//               </View>

//               {entry.notes && (
//                 <Text style={styles.entryNotes}>{entry.notes}</Text>
//               )}
//             </View>
//           ))}
//         </View>

//         {/* Materials Section */}
//         <View style={styles.sectionCard}>
//           <View style={styles.sectionHeader}>
//             <View style={styles.sectionTitleContainer}>
//               <PackageIcon />
//               <Text style={styles.sectionTitle}>Materials Used</Text>
//             </View>
//             {canEdit() && !isReadOnly() && (
//               <TouchableOpacity
//                 style={styles.addButton}
//                 onPress={() => setShowAddMaterial(true)}
//               >
//                 <PlusIcon />
//               </TouchableOpacity>
//             )}
//           </View>

//           {timesheetData.materialEntries.map((entry) => (
//             <View key={entry.id} style={styles.entryCard}>
//               <View style={styles.entryHeader}>
//                 <View>
//                   <Text style={styles.entryName}>{entry.name}</Text>
//                   <Text style={styles.entrySubtitle}>Order: {entry.supplierOrderId}</Text>
//                 </View>
//                 {canEdit() && !isReadOnly() && editingMaterial !== entry.id && (
//                   <TouchableOpacity
//                     style={styles.editButton}
//                     onPress={() => {
//                       setEditingMaterial(entry.id);
//                       setTempMaterialData(entry);
//                     }}
//                   >
//                     <EditIcon />
//                   </TouchableOpacity>
//                 )}
//               </View>

//               <View style={styles.materialGrid}>
//                 <View style={styles.materialItem}>
//                   <Text style={styles.materialLabel}>Ordered:</Text>
//                   <Text style={styles.materialValue}>{entry.totalOrdered} {entry.unit}</Text>
//                 </View>
//                 <View style={styles.materialItem}>
//                   <Text style={styles.materialLabel}>Used:</Text>
//                   <Text style={styles.materialValue}>{entry.amountUsed} {entry.unit}</Text>
//                 </View>
//                 <View style={styles.materialItem}>
//                   <Text style={styles.materialLabel}>Remaining:</Text>
//                   <Text style={styles.materialValue}>{entry.amountRemaining} {entry.unit}</Text>
//                 </View>
//               </View>

//               <View style={styles.materialStatus}>
//                 <View style={[
//                   styles.statusChip,
//                   entry.returnToWarehouse ? styles.returnChip : styles.keepChip
//                 ]}>
//                   <Text style={[
//                     styles.statusChipText,
//                     entry.returnToWarehouse ? styles.returnChipText : styles.keepChipText
//                   ]}>
//                     {entry.returnToWarehouse ? 'Return to Warehouse' : 'Keep on Site'}
//                   </Text>
//                 </View>
//               </View>
//             </View>
//           ))}
//         </View>

//         {/* Additional Charges Section */}
//         <View style={styles.sectionCard}>
//           <View style={styles.sectionHeader}>
//             <View style={styles.sectionTitleContainer}>
//               <FileTextIcon />
//               <Text style={styles.sectionTitle}>Additional Charges</Text>
//             </View>
//             {canEdit() && !isReadOnly() && (
//               <TouchableOpacity
//                 style={styles.addButton}
//                 onPress={() => setShowAddCharge(true)}
//               >
//                 <PlusIcon />
//               </TouchableOpacity>
//             )}
//           </View>

//           {timesheetData.additionalCharges.map((charge) => (
//             <View key={charge.id} style={styles.entryCard}>
//               <View style={styles.entryHeader}>
//                 <View>
//                   <Text style={styles.entryName}>{charge.description}</Text>
//                   <Text style={styles.entrySubtitle}>{charge.category}</Text>
//                 </View>
//               </View>

//               <View style={styles.chargeDetails}>
//                 <View style={styles.categoryChip}>
//                   <Text style={styles.categoryChipText}>{charge.category}</Text>
//                 </View>
//                 {charge.receipt && (
//                   <Text style={styles.receiptText}>Receipt: {charge.receipt}</Text>
//                 )}
//               </View>

//               {charge.notes && (
//                 <Text style={styles.entryNotes}>{charge.notes}</Text>
//               )}
//             </View>
//           ))}
//         </View>

//         {/* Job Notes Section */}
//         <View style={styles.sectionCard}>
//           <View style={styles.sectionHeader}>
//             <View style={styles.sectionTitleContainer}>
//               <FileTextIcon />
//               <Text style={styles.sectionTitle}>Job Notes</Text>
//             </View>
//           </View>

//           <TextInput
//             style={styles.notesInput}
//             value={timesheetData.jobNotes}
//             onChangeText={(text) => setTimesheetData(prev => ({ ...prev, jobNotes: text }))}
//             placeholder="Add any additional notes about this job..."
//             multiline
//             numberOfLines={4}
//             editable={!isReadOnly()}
//           />
//         </View>

//         {/* Bottom spacing for action buttons */}
//         <View style={{ height: 100 }} />
//       </ScrollView>

//       {/* Action Buttons */}
//       {canEdit() && !isReadOnly() && (
//         <View style={styles.actionButtons}>
//           {timesheetData.status === 'draft' && (
//             <TouchableOpacity
//               style={[styles.button, styles.primaryButton, { flex: 1 }]}
//               onPress={handleSubmitForApproval}
//             >
//               <Text style={styles.buttonText}>Submit for Approval</Text>
//             </TouchableOpacity>
//           )}
//           {timesheetData.status === 'rejected' && (
//             <TouchableOpacity
//               style={[styles.button, styles.primaryButton, { flex: 1 }]}
//               onPress={handleSubmitForApproval}
//             >
//               <Text style={styles.buttonText}>Resubmit for Approval</Text>
//             </TouchableOpacity>
//           )}
//           <TouchableOpacity
//             style={[styles.button, styles.secondaryButton, { paddingHorizontal: 24 }]}
//             onPress={handleBack}
//           >
//             <Text style={[styles.buttonText, styles.secondaryButtonText]}>
//               {timesheet ? 'Back to List' : 'Back to Job'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Modals */}
//       {renderAddMaterialModal()}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   header: {
//     backgroundColor: '#3B82F6',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     paddingTop: 16,
//   },
//   headerButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: 'white',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 16,
//   },
//   jobHeaderCard: {
//     backgroundColor: '#EBF4FF',
//     borderLeftWidth: 4,
//     borderLeftColor: '#3B82F6',
//     borderTopRightRadius: 8,
//     borderBottomRightRadius: 8,
//     padding: 16,
//     marginTop: 16,
//   },
//   jobTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1E3A8A',
//     marginBottom: 4,
//   },
//   jobDate: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1D4ED8',
//   },
//   statusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     marginTop: 16,
//   },
//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   readOnlyBadge: {
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   readOnlyText: {
//     fontSize: 10,
//     color: '#6B7280',
//   },
//   rejectionCard: {
//     backgroundColor: '#FEF2F2',
//     borderLeftWidth: 4,
//     borderLeftColor: '#F87171',
//     borderTopRightRadius: 8,
//     borderBottomRightRadius: 8,
//     padding: 12,
//     marginTop: 16,
//   },
//   rejectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   rejectionTitle: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#B91C1C',
//     marginLeft: 8,
//   },
//   rejectionReason: {
//     fontSize: 14,
//     color: '#DC2626',
//   },
//   approvalCard: {
//     backgroundColor: '#F0FDF4',
//     borderLeftWidth: 4,
//     borderLeftColor: '#4ADE80',
//     borderTopRightRadius: 8,
//     borderBottomRightRadius: 8,
//     padding: 12,
//     marginTop: 16,
//   },
//   approvalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   approvalTitle: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#166534',
//     marginLeft: 8,
//   },
//   approvalDetails: {
//     fontSize: 14,
//     color: '#15803D',
//   },
//   dropdownHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#F9FAFB',
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 16,
//   },
//   dropdownTitle: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#374151',
//   },
//   dropdownContent: {
//     backgroundColor: 'white',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderRadius: 8,
//     padding: 12,
//     marginTop: 8,
//   },
//   detailRow: {
//     marginBottom: 8,
//   },
//   detailLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#6B7280',
//   },
//   detailValue: {
//     fontSize: 14,
//     color: '#111827',
//     marginTop: 2,
//   },
//   sectionCard: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 16,
//     marginTop: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   sectionTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#111827',
//     marginLeft: 8,
//   },
//   addButton: {
//     backgroundColor: '#F3F4F6',
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 6,
//     padding: 8,
//     minWidth: 32,
//     height: 32,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   entryCard: {
//     backgroundColor: '#F9FAFB',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 12,
//   },
//   entryHeader: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   entryName: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#111827',
//   },
//   entrySubtitle: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginTop: 2,
//   },
//   editButton: {
//     padding: 4,
//   },
//   hoursGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   hoursItem: {
//     flex: 1,
//   },
//   hoursLabel: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   hoursValue: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#111827',
//     marginTop: 2,
//   },
//   materialGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   materialItem: {
//     flex: 1,
//   },
//   materialLabel: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   materialValue: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#111827',
//     marginTop: 2,
//   },
//   materialStatus: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//   },
//   statusChip: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     borderWidth: 1,
//   },
//   returnChip: {
//     backgroundColor: '#EBF4FF',
//     borderColor: '#3B82F6',
//   },
//   keepChip: {
//     backgroundColor: '#F9FAFB',
//     borderColor: '#D1D5DB',
//   },
//   statusChipText: {
//     fontSize: 12,
//   },
//   returnChipText: {
//     color: '#1D4ED8',
//   },
//   keepChipText: {
//     color: '#6B7280',
//   },
//   chargeDetails: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   categoryChip: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//   },
//   categoryChipText: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   receiptText: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   entryNotes: {
//     fontSize: 14,
//     color: '#6B7280',
//     fontStyle: 'italic',
//     marginTop: 8,
//   },
//   notesInput: {
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     textAlignVertical: 'top',
//     minHeight: 96,
//   },
//   actionButtons: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 16,
//     flexDirection: 'row',
//     gap: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 5,
//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     gap: 8,
//   },
//   primaryButton: {
//     backgroundColor: '#3B82F6',
//   },
//   secondaryButton: {
//     backgroundColor: 'transparent',
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//   },
//   buttonText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: 'white',
//   },
//   secondaryButtonText: {
//     color: '#374151',
//   },
//   icon: {
//     fontSize: 16,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   modalContent: {
//     flex: 1,
//     padding: 16,
//   },
//   formGroup: {
//     marginBottom: 16,
//   },
//   formRow: {
//     flexDirection: 'row',
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   checkbox: {
//     width: 20,
//     height: 20,
//     borderWidth: 2,
//     borderColor: '#D1D5DB',
//     borderRadius: 4,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 8,
//   },
//   checkboxChecked: {
//     backgroundColor: '#3B82F6',
//     borderColor: '#3B82F6',
//   },
//   checkmark: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   checkboxLabel: {
//     fontSize: 16,
//     color: '#374151',
//     flex: 1,
//   },
//   modalActions: {
//     flexDirection: 'row',
//     padding: 16,
//     gap: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//   },
// });

// export default JobTimesheet;
