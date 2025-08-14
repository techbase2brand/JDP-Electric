// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StatusBar,
//   Alert,
//   ScrollView,
//   StyleSheet,
//   Dimensions,
//   AppState,
//   Platform,
//   Modal,
//   TextInput,
//   KeyboardAvoidingView,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useNavigation } from '@react-navigation/native';

// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// // Embedded Colors
// const Colors = {
//   primary: '#3B82F6',
//   primaryLight: '#EBF4FF',
//   white: '#FFFFFF',
//   backgroundLight: '#F8FAFC',
//   text: '#1E293B',
//   textSecondary: '#64748B',
//   textLight: '#94A3B8',
//   border: '#E2E8F0',
//   success: '#10B981',
//   successLight: '#D1FAE5',
//   warning: '#F59E0B',
//   warningLight: '#FEF3C7',
//   error: '#EF4444',
//   errorLight: '#FEE2E2',
//   purple: '#8B5CF6',
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
// };

// const Shadows = {
//   md: {
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
// };

// const TimerScreen = ({ route }) => {
//   const navigation = useNavigation();

//   // Timer state
//   const [isRunning, setIsRunning] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const [elapsedTime, setElapsedTime] = useState(0);
//   const [startTime, setStartTime] = useState(null);
//   const [currentLocation, setCurrentLocation] = useState('');
//   const [breakCount, setBreakCount] = useState(0);

//   // Activity tracking
//   const [activities, setActivities] = useState([]);
//   const [currentActivityId, setCurrentActivityId] = useState(null);

//   // Pause modal state
//   const [showPauseModal, setShowPauseModal] = useState(false);
//   const [pauseReason, setPauseReason] = useState('');
//   const [selectedPauseReason, setSelectedPauseReason] = useState('');

//   // App state tracking
//   const appState = useRef(AppState.currentState);
//   const timerRef = useRef(null);

//   // Get job from route params or props
//   const currentJob =  {
//     id: 'demo-job',
//     title: 'Electrical Panel Installation',
//     customer: { name: 'ABC Manufacturing Corp.' },
//     location: { address: '123 Industrial Blvd, Houston, TX' },
//     estimatedHours: 8,
//     priority: 'high'
//   };

//   // Pause reasons
//   const pauseReasons = [
//     { id: 'break', label: 'Taking a break', icon: 'coffee' },
//     { id: 'lunch', label: 'Lunch break', icon: 'restaurant' },
//     { id: 'meeting', label: 'Meeting/Call', icon: 'call' },
//     { id: 'materials', label: 'Getting materials', icon: 'build' },
//     { id: 'travel', label: 'Travel time', icon: 'directions-car' },
//     { id: 'other', label: 'Other reason', icon: 'more-horiz' }
//   ];

//   useEffect(() => {
//     StatusBar.setBarStyle('light-content');
//     StatusBar.setBackgroundColor('#1E293B');

//     // Load saved activities
//     loadActivities();

//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//     };
//   }, []);

//   // App state change handler
//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', handleAppStateChange);
//     return () => subscription?.remove();
//   }, []);

//   // Timer effect
//   useEffect(() => {
//     if (isRunning && !isPaused) {
//       timerRef.current = setInterval(() => {
//         setElapsedTime(prev => prev + 1);
//       }, 1000);
//     } else {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//     }

//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//     };
//   }, [isRunning, isPaused]);

//   const handleAppStateChange = (nextAppState) => {
//     if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
//       console.log('App has come to the foreground');
//       if (isRunning && !isPaused) {
//         console.log('Timer was running when app became active');
//       }
//     }
//     appState.current = nextAppState;
//   };

//   const loadActivities = () => {
//     // Load activities from storage or initialize with mock data
//     const mockActivities = [
//       {
//         id: 'act-1',
//         jobId: 'job-1',
//         jobTitle: 'Office Wiring Project',
//         startTime: new Date(Date.now() - 3600000 * 2), // 2 hours ago
//         endTime: new Date(Date.now() - 3600000), // 1 hour ago
//         elapsedTime: 3540, // 59 minutes
//         status: 'completed',
//         location: '456 Business Ave',
//         breaks: 1,
//         pauseReason: 'Lunch break'
//       },
//       {
//         id: 'act-2',
//         jobId: 'job-2',
//         jobTitle: 'Residential Panel Upgrade',
//         startTime: new Date(Date.now() - 7200000), // Earlier today
//         endTime: new Date(Date.now() - 5400000),
//         elapsedTime: 1620, // 27 minutes
//         status: 'completed',
//         location: '789 Home Street',
//         breaks: 0
//       }
//     ];
//     setActivities(mockActivities);
//   };

//   const getCurrentLocation = () => {
//     console.log('Getting current location...');

//     if (!navigator.geolocation) {
//       console.warn('Geolocation not supported');
//       setCurrentLocation(currentJob?.location?.address || 'Location unavailable');
//       return;
//     }

//     const options = {
//       enableHighAccuracy: false,
//       timeout: 10000,
//       maximumAge: 300000
//     };

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         console.log('Location obtained:', { latitude, longitude });
//         setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
//       },
//       (error) => {
//         console.warn('Geolocation error:', error.message);
//         setCurrentLocation(currentJob?.location?.address || 'Manual entry required');
//       },
//       options
//     );
//   };

//   const formatTime = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;

//     if (hours > 0) {
//       return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//     }
//     return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const formatDuration = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);

//     if (hours > 0) {
//       return `${hours}h ${minutes}m`;
//     }
//     return `${minutes}m`;
//   };

//   const checkForActiveTimer = () => {
//     const hasActiveTimer = activities.some(activity =>
//       activity.status === 'running' || activity.status === 'paused'
//     );
//     return hasActiveTimer || isRunning;
//   };

//   const handleStartTimer = () => {
//     // Check if there's already an active timer
//     if (checkForActiveTimer()) {
//       Alert.alert(
//         'Active Timer Found',
//         'You already have an active timer running. Only one timer can be active at a time.',
//         [{ text: 'OK', style: 'default' }]
//       );
//       return;
//     }

//     const now = new Date();
//     const activityId = `activity-${Date.now()}`;

//     setStartTime(now);
//     setIsRunning(true);
//     setIsPaused(false);
//     setElapsedTime(0);
//     setBreakCount(0);
//     setCurrentActivityId(activityId);

//     getCurrentLocation();

//     const newActivity = {
//       id: activityId,
//       jobId: currentJob?.id,
//       jobTitle: currentJob?.title,
//       startTime: now,
//       elapsedTime: 0,
//       status: 'running',
//       location: currentLocation,
//       breaks: 0
//     };

//     setActivities(prev => [newActivity, ...prev]);
//     Alert.alert('Timer Started', 'Work session has begun');
//   };

//   const handlePauseTimer = () => {
//     if (isRunning && !isPaused) {
//       setShowPauseModal(true);
//     } else if (isPaused) {
//       // Resume timer
//       setIsPaused(false);
//       updateCurrentActivity({ status: 'running' });
//       Alert.alert('Timer Resumed', 'Work session resumed');
//     }
//   };

//   const confirmPauseTimer = () => {
//     const reason = selectedPauseReason || pauseReason || 'No reason specified';

//     setIsPaused(true);
//     setShowPauseModal(false);

//     if (reason.includes('break') || reason.includes('Break')) {
//       setBreakCount(prev => prev + 1);
//     }

//     updateCurrentActivity({
//       status: 'paused',
//       pauseReason: reason,
//       breaks: reason.includes('break') ? breakCount + 1 : breakCount
//     });

//     // Reset modal state
//     setSelectedPauseReason('');
//     setPauseReason('');

//     Alert.alert('Timer Paused', `Reason: ${reason}`);
//   };

//   const handleStopTimer = () => {
//     Alert.alert(
//       'Stop Timer',
//       'Are you sure you want to stop the current session?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Stop', style: 'destructive', onPress: confirmStopTimer }
//       ]
//     );
//   };

//   const confirmStopTimer = () => {
//     const now = new Date();
//     const sessionDuration = elapsedTime;

//     setIsRunning(false);
//     setIsPaused(false);

//     updateCurrentActivity({
//       endTime: now,
//       elapsedTime: sessionDuration,
//       status: 'completed',
//       breaks: breakCount
//     });

//     // Reset timer state
//     setElapsedTime(0);
//     setStartTime(null);
//     setCurrentActivityId(null);
//     setBreakCount(0);

//     Alert.alert(
//       'Session Complete',
//       `Work session completed: ${formatTime(sessionDuration)}`
//     );
//   };

//   const updateCurrentActivity = (updates) => {
//     if (!currentActivityId) return;

//     setActivities(prev => prev.map(activity =>
//       activity.id === currentActivityId
//         ? { ...activity, ...updates }
//         : activity
//     ));
//   };

//   const deleteActivity = (activityId) => {
//     Alert.alert(
//       'Delete Activity',
//       'Are you sure you want to delete this time tracking activity?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: () => {
//             setActivities(prev => prev.filter(activity => activity.id !== activityId));
//             if (activityId === currentActivityId) {
//               // If deleting current activity, stop timer
//               setIsRunning(false);
//               setIsPaused(false);
//               setElapsedTime(0);
//               setStartTime(null);
//               setCurrentActivityId(null);
//             }
//           }
//         }
//       ]
//     );
//   };

//   const getTimerStatus = () => {
//     if (!isRunning) return 'Ready to start';
//     if (isPaused) return 'Timer paused';
//     return 'Timer running';
//   };

//   const getStatusColor = () => {
//     if (!isRunning) return Colors.textSecondary;
//     if (isPaused) return Colors.warning;
//     return Colors.success;
//   };

//   const renderHeader = () => (
//     <View style={styles.header}>
//       <TouchableOpacity
//         style={styles.backButton}
//         onPress={() => navigation.goBack()}
//       >
//         <Icon name="arrow-back" size={24} color={"#000"} />
//       </TouchableOpacity>

//       <View style={styles.headerContent}>
//         <Text style={styles.headerTitle}>Work Timer</Text>
//         <Text style={styles.headerSubtitle}>
//           {new Date().toLocaleDateString('en-US', {
//             weekday: 'short',
//             month: 'short',
//             day: 'numeric'
//           })}
//         </Text>
//       </View>

//       <View style={styles.headerSpacer} />
//     </View>
//   );

//   const renderTimerDisplay = () => (
//     <View style={styles.timerContainer}>
//       <View style={styles.timerCard}>
//         <View style={styles.timerHeader}>
//           <Icon name="timer" size={24} color={Colors.primary} />
//           <Text style={styles.timerHeaderText}>Current Session</Text>
//           {checkForActiveTimer() && (
//             <View style={styles.activeIndicator}>
//               <Text style={styles.activeIndicatorText}>ACTIVE</Text>
//             </View>
//           )}
//         </View>

//         <View style={styles.timerDisplay}>
//           <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
//           <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]}>
//             <Text style={styles.statusText}>{getTimerStatus()}</Text>
//           </View>
//         </View>

//         {currentJob && (
//           <View style={styles.jobInfo}>
//             <Text style={styles.jobTitle}>{currentJob.title}</Text>
//             <Text style={styles.jobCustomer}>{currentJob.customer?.name}</Text>
//             <View style={styles.jobLocation}>
//               <Icon name="place" size={16} color={Colors.textSecondary} />
//               <Text style={styles.locationText}>{currentJob.location?.address}</Text>
//             </View>
//           </View>
//         )}
//       </View>
//     </View>
//   );

//   const renderTimerControls = () => (
//     <View style={styles.controlsContainer}>
//       {!isRunning ? (
//         <TouchableOpacity style={styles.startButton} onPress={handleStartTimer}>
//           <Icon name="play-arrow" size={32} color={Colors.white} />
//           <Text style={styles.startButtonText}>Start Work</Text>
//         </TouchableOpacity>
//       ) : (
//         <View style={styles.activeControls}>
//           <TouchableOpacity
//             style={[styles.controlButton, styles.pauseButton]}
//             onPress={handlePauseTimer}
//           >
//             <Icon name={isPaused ? "play-arrow" : "pause"} size={24} color={Colors.white} />
//             <Text style={styles.controlButtonText}>
//               {isPaused ? 'Resume' : 'Pause'}
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.controlButton, styles.stopButton]}
//             onPress={handleStopTimer}
//           >
//             <Icon name="stop" size={24} color={Colors.white} />
//             <Text style={styles.controlButtonText}>Stop</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );

//   const renderPauseModal = () => (
//     <Modal
//       visible={showPauseModal}
//       transparent={true}
//       animationType="slide"
//       onRequestClose={() => setShowPauseModal(false)}
//     >
//       <KeyboardAvoidingView
//         style={styles.modalOverlay}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       >
//         <TouchableOpacity
//           style={styles.modalBackdrop}
//           activeOpacity={1}
//           onPress={() => setShowPauseModal(false)}
//         >
//           <View style={styles.pauseModal}>
//             <TouchableOpacity style={styles.modalHandle} />

//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Pause Reason</Text>
//               <Text style={styles.modalSubtitle}>Why are you pausing the timer?</Text>
//             </View>

//             <ScrollView style={styles.reasonsList} showsVerticalScrollIndicator={false}>
//               {pauseReasons.map((reason) => (
//                 <TouchableOpacity
//                   key={reason.id}
//                   style={[
//                     styles.reasonOption,
//                     selectedPauseReason === reason.id && styles.selectedReasonOption
//                   ]}
//                   onPress={() => setSelectedPauseReason(reason.id)}
//                 >
//                   <Icon
//                     name={reason.icon}
//                     size={24}
//                     color={selectedPauseReason === reason.id ? Colors.primary : Colors.textSecondary}
//                   />
//                   <Text
//                     style={[
//                       styles.reasonText,
//                       selectedPauseReason === reason.id && styles.selectedReasonText
//                     ]}
//                   >
//                     {reason.label}
//                   </Text>
//                   {selectedPauseReason === reason.id && (
//                     <Icon name="check" size={20} color={Colors.primary} />
//                   )}
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>

//             <View style={styles.customReasonContainer}>
//               <Text style={styles.customReasonLabel}>Or specify custom reason:</Text>
//               <TextInput
//                 style={styles.customReasonInput}
//                 value={pauseReason}
//                 onChangeText={setPauseReason}
//                 placeholder="Enter custom reason..."
//                 placeholderTextColor={Colors.textLight}
//                 multiline
//               />
//             </View>

//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={() => setShowPauseModal(false)}
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   styles.confirmButton,
//                   (!selectedPauseReason && !pauseReason.trim()) && styles.disabledButton
//                 ]}
//                 onPress={confirmPauseTimer}
//                 disabled={!selectedPauseReason && !pauseReason.trim()}
//               >
//                 <Text style={styles.confirmButtonText}>Pause Timer</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </TouchableOpacity>
//       </KeyboardAvoidingView>
//     </Modal>
//   );

//   const renderActivitiesList = () => (
//     <View style={styles.activitiesContainer}>
//       <View style={styles.activitiesHeader}>
//         <Icon name="history" size={20} color={Colors.primary} />
//         <Text style={styles.activitiesHeaderText}>Time Tracking Activities</Text>
//         <View style={styles.activitiesCount}>
//           <Text style={styles.activitiesCountText}>{activities.length}</Text>
//         </View>
//       </View>

//       {activities.length === 0 ? (
//         <View style={styles.emptyState}>
//           <Icon name="timer-off" size={48} color={Colors.textLight} />
//           <Text style={styles.emptyStateText}>No activities tracked yet</Text>
//           <Text style={styles.emptyStateSubtext}>Start a timer to begin tracking</Text>
//         </View>
//       ) : (
//         <ScrollView style={styles.activitiesList} showsVerticalScrollIndicator={false}>
//           {activities.map((activity, index) => (
//             <View key={activity.id} style={styles.activityItem}>
//               <View style={styles.activityHeader}>
//                 <View style={styles.activityInfo}>
//                   <Text style={styles.activityTitle}>
//                     {activity.jobTitle || 'Work Session'}
//                   </Text>
//                   <Text style={styles.activityTime}>
//                     {activity.startTime.toLocaleTimeString()} - {
//                       activity.endTime ? activity.endTime.toLocaleTimeString() : 'Running'
//                     }
//                   </Text>
//                 </View>

//                 <View style={styles.activityActions}>
//                   <View style={[
//                     styles.activityStatus,
//                     {
//                       backgroundColor:
//                         activity.status === 'completed' ? Colors.successLight :
//                         activity.status === 'running' ? Colors.primary + '20' :
//                         Colors.warningLight
//                     }
//                   ]}>
//                     <Text style={[
//                       styles.activityStatusText,
//                       {
//                         color:
//                           activity.status === 'completed' ? Colors.success :
//                           activity.status === 'running' ? Colors.primary :
//                           Colors.warning
//                       }
//                     ]}>
//                       {activity.status === 'running' ? 'ACTIVE' : activity.status.toUpperCase()}
//                     </Text>
//                   </View>

//                   {activity.status === 'completed' && (
//                     <TouchableOpacity
//                       style={styles.deleteButton}
//                       onPress={() => deleteActivity(activity.id)}
//                     >
//                       <Icon name="delete" size={18} color={Colors.error} />
//                     </TouchableOpacity>
//                   )}
//                 </View>
//               </View>

//               <View style={styles.activityDetails}>
//                 <View style={styles.activityDetailItem}>
//                   <Icon name="timer" size={16} color={Colors.textSecondary} />
//                   <Text style={styles.activityDetailText}>
//                     Duration: {formatDuration(activity.status === 'running' ? elapsedTime : activity.elapsedTime)}
//                   </Text>
//                 </View>

//                 {activity.location && (
//                   <View style={styles.activityDetailItem}>
//                     <Icon name="place" size={16} color={Colors.textSecondary} />
//                     <Text style={styles.activityDetailText} numberOfLines={1}>
//                       {activity.location}
//                     </Text>
//                   </View>
//                 )}

//                 {activity.breaks > 0 && (
//                   <View style={styles.activityDetailItem}>
//                     <Icon name="coffee" size={16} color={Colors.textSecondary} />
//                     <Text style={styles.activityDetailText}>
//                       {activity.breaks} break{activity.breaks > 1 ? 's' : ''}
//                     </Text>
//                   </View>
//                 )}

//                 {activity.pauseReason && (
//                   <View style={styles.activityDetailItem}>
//                     <Icon name="pause" size={16} color={Colors.textSecondary} />
//                     <Text style={styles.activityDetailText}>
//                       {activity.pauseReason}
//                     </Text>
//                   </View>
//                 )}
//               </View>
//             </View>
//           ))}
//         </ScrollView>
//       )}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#1E293B" />
//       {renderHeader()}
//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {renderTimerDisplay()}
//         {renderTimerControls()}
//         {renderActivitiesList()}

//         <View style={{ height: 20 }} />
//       </ScrollView>

//       {renderPauseModal()}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.backgroundLight,
//   },

//   // Header
//   header: {
//     // backgroundColor: '#1E293B',
//     paddingTop: Platform.OS === 'ios' ? 30 : 30,
//     paddingHorizontal: Spacing.md,
//     paddingBottom: Spacing.md,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     // backgroundColor: 'rgba(255,255,255,0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerContent: {
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: "#000",
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: '#000',
//     marginTop: 2,
//   },
//   headerSpacer: {
//     width: 40,
//   },

//   // Content
//   content: {
//     flex: 1,
//     paddingHorizontal: Spacing.md,
//   },

//   // Timer Display
//   timerContainer: {
//     marginTop: Spacing.lg,
//   },
//   timerCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.xl,
//     padding: Spacing.lg,
//     ...Shadows.md,
//   },
//   timerHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: Spacing.lg,
//   },
//   timerHeaderText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: Colors.text,
//     marginLeft: Spacing.sm,
//     flex: 1,
//   },
//   activeIndicator: {
//     backgroundColor: Colors.error,
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.sm,
//   },
//   activeIndicatorText: {
//     fontSize: 10,
//     color: Colors.white,
//     fontWeight: 'bold',
//   },
//   timerDisplay: {
//     alignItems: 'center',
//     marginBottom: Spacing.lg,
//   },
//   timerText: {
//     fontSize: 48,
//     fontWeight: 'bold',
//     color: Colors.primary,
//     fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
//   },
//   statusIndicator: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: 20,
//     marginTop: Spacing.md,
//   },
//   statusText: {
//     fontSize: 14,
//     color: Colors.white,
//     fontWeight: '500',
//   },
//   jobInfo: {
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//     paddingTop: Spacing.md,
//   },
//   jobTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.text,
//     marginBottom: Spacing.xs,
//   },
//   jobCustomer: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     marginBottom: Spacing.sm,
//   },
//   jobLocation: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   locationText: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     marginLeft: Spacing.xs,
//     flex: 1,
//   },

//   // Controls
//   controlsContainer: {
//     marginTop: Spacing.lg,
//   },
//   startButton: {
//     backgroundColor: Colors.success,
//     borderRadius: BorderRadius.xl,
//     paddingVertical: Spacing.lg,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     ...Shadows.md,
//   },
//   startButtonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: Colors.white,
//     marginLeft: Spacing.sm,
//   },
//   activeControls: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: Spacing.md,
//   },
//   controlButton: {
//     flex: 1,
//     borderRadius: BorderRadius.lg,
//     paddingVertical: Spacing.md,
//     alignItems: 'center',
//     ...Shadows.md,
//   },
//   pauseButton: {
//     backgroundColor: Colors.warning,
//   },
//   stopButton: {
//     backgroundColor: Colors.error,
//   },
//   controlButtonText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: Colors.white,
//     marginTop: Spacing.xs,
//   },

//   // Pause Modal
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//   },
//   modalBackdrop: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   pauseModal: {
//     backgroundColor: Colors.white,
//     borderTopLeftRadius: BorderRadius.xl,
//     borderTopRightRadius: BorderRadius.xl,
//     paddingHorizontal: Spacing.lg,
//     paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.lg,
//     maxHeight: screenHeight * 0.8,
//   },
//   modalHandle: {
//     width: 40,
//     height: 4,
//     backgroundColor: Colors.border,
//     borderRadius: 2,
//     alignSelf: 'center',
//     marginTop: Spacing.md,
//     marginBottom: Spacing.lg,
//   },
//   modalHeader: {
//     alignItems: 'center',
//     marginBottom: Spacing.lg,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: Colors.text,
//   },
//   modalSubtitle: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     marginTop: Spacing.xs,
//   },
//   reasonsList: {
//     maxHeight: 200,
//   },
//   reasonOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: Spacing.md,
//     paddingHorizontal: Spacing.md,
//     borderRadius: BorderRadius.lg,
//     marginBottom: Spacing.sm,
//     backgroundColor: Colors.backgroundLight,
//     gap: Spacing.md,
//   },
//   selectedReasonOption: {
//     backgroundColor: Colors.primaryLight,
//     borderWidth: 1,
//     borderColor: Colors.primary,
//   },
//   reasonText: {
//     fontSize: 16,
//     color: Colors.text,
//     flex: 1,
//   },
//   selectedReasonText: {
//     color: Colors.primary,
//     fontWeight: '500',
//   },
//   customReasonContainer: {
//     marginTop: Spacing.lg,
//   },
//   customReasonLabel: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     marginBottom: Spacing.sm,
//   },
//   customReasonInput: {
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: BorderRadius.md,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.md,
//     fontSize: 16,
//     color: Colors.text,
//     minHeight: 60,
//     textAlignVertical: 'top',
//   },
//   modalActions: {
//     flexDirection: 'row',
//     gap: Spacing.md,
//     marginTop: Spacing.lg,
//   },
//   cancelButton: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: BorderRadius.md,
//     alignItems: 'center',
//   },
//   cancelButtonText: {
//     fontSize: 16,
//     color: Colors.text,
//     fontWeight: '500',
//   },
//   confirmButton: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.md,
//     alignItems: 'center',
//   },
//   disabledButton: {
//     backgroundColor: Colors.textLight,
//   },
//   confirmButtonText: {
//     fontSize: 16,
//     color: Colors.white,
//     fontWeight: '600',
//   },

//   // Activities List
//   activitiesContainer: {
//     marginTop: Spacing.lg,
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     ...Shadows.md,
//   },
//   activitiesHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: Spacing.md,
//     gap: Spacing.sm,
//   },
//   activitiesHeaderText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.text,
//     flex: 1,
//   },
//   activitiesCount: {
//     backgroundColor: Colors.primaryLight,
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.sm,
//   },
//   activitiesCountText: {
//     fontSize: 12,
//     color: Colors.primary,
//     fontWeight: '600',
//   },
//   activitiesList: {
//     maxHeight: 300,
//   },
//   activityItem: {
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//     paddingVertical: Spacing.md,
//   },
//   activityHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: Spacing.sm,
//   },
//   activityInfo: {
//     flex: 1,
//   },
//   activityTitle: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: Colors.text,
//     marginBottom: Spacing.xs,
//   },
//   activityTime: {
//     fontSize: 12,
//     color: Colors.textSecondary,
//   },
//   activityActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: Spacing.sm,
//   },
//   activityStatus: {
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.sm,
//   },
//   activityStatusText: {
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   deleteButton: {
//     padding: Spacing.xs,
//   },
//   activityDetails: {
//     gap: Spacing.xs,
//   },
//   activityDetailItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: Spacing.sm,
//   },
//   activityDetailText: {
//     fontSize: 12,
//     color: Colors.textSecondary,
//     flex: 1,
//   },

//   // Empty State
//   emptyState: {
//     alignItems: 'center',
//     paddingVertical: Spacing.xl,
//   },
//   emptyStateText: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//     marginTop: Spacing.md,
//   },
//   emptyStateSubtext: {
//     fontSize: 14,
//     color: Colors.textLight,
//     marginTop: Spacing.xs,
//   },
// });

// export default TimerScreen;

// import React, { useState } from "react";
// import { View, Text, Button, Modal, TouchableOpacity } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import {   startTimerWithBackground,
//   pauseTimerWithBackground,
//   resumeTimerWithBackground,
//   stopTimerWithBackground } from "../redux/timerSlice";

// export default function TimerScreen() {
//   const { isRunning, elapsedTime } = useSelector((state) => state.timer);
//   const dispatch = useDispatch();
//   const [pauseModal, setPauseModal] = useState(false);

//   const formatTime = (ms) => {
//     const sec = Math.floor(ms / 1000);
//     const m = Math.floor(sec / 60);
//     const s = sec % 60;
//     return `${m}:${s < 10 ? "0" : ""}${s}`;
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text style={{ fontSize: 40 }}>{formatTime(elapsedTime)}</Text>

//       {!isRunning && elapsedTime === 0 && (
//         <Button title="Start Timer" onPress={() => dispatch(startTimerWithBackground())} />
//       )}

//       {isRunning && (
//         <View>
//           <Button title="Pause" onPress={() => setPauseModal(true)} />
//           <Button title="Stop" onPress={() => dispatch(stopTimerWithBackground())} />
//         </View>
//       )}

//       {!isRunning && elapsedTime > 0 && (
//         <View>
//           <Button title="Resume" onPress={() => dispatch(resumeTimerWithBackground())} />
//           <Button title="Stop" onPress={() => dispatch(stopTimerWithBackground())} />
//         </View>
//       )}

//       {/* Pause Reason Modal */}
//       <Modal visible={pauseModal} transparent>
//         <View style={{ flex: 1, backgroundColor: "#00000088", justifyContent: "center", alignItems: "center" }}>
//           <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
//             <Text>Select Pause Reason:</Text>
//             {["Break", "Emergency", "Other"].map((reason) => (
//               <TouchableOpacity
//                 key={reason}
//                 onPress={() => {
//                   dispatch(pauseTimerWithBackground());
//                   setPauseModal(false);
//                 }}
//               >
//                 <Text style={{ padding: 10 }}>{reason}</Text>

//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// TimerScreen.js
// TimerScreen.js
// import React, { useState } from "react";
// import { View, Text, StyleSheet, Modal, TextInput, FlatList, TouchableOpacity } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   startTimerWithBackground,
//   pauseTimerWithBackground,
//   resumeTimerWithBackground,
//   stopTimerWithBackground,
// } from "../redux/timerSlice";

// export default function TimerScreen() {
//   const { isRunning, elapsedTime, activityLog } = useSelector((state) => state.timer);
//   const dispatch = useDispatch();
//   const [pauseModal, setPauseModal] = useState(false);
//   const [completeModal, setCompleteModal] = useState(false);
//   const [pauseReason, setPauseReason] = useState("");
//   const [pauseNotes, setPauseNotes] = useState("");

//   const formatTime = (ms) => {
//     const sec = Math.floor(ms / 1000);
//     const h = Math.floor(sec / 3600);
//     const m = Math.floor((sec % 3600) / 60);
//     const s = sec % 60;
//     return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   const CustomButton = ({ label, onPress, color }) => (
//     <TouchableOpacity style={[styles.btn, { backgroundColor: color }]} onPress={onPress}>
//       <Text style={styles.btnText}>{label}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Timer Display */}
//       <View style={styles.timerCard}>
//         <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
//         <Text style={styles.statusText}>{isRunning ? "Running" : "Paused"}</Text>
//         <View style={styles.modeTag}>
//           <Text style={styles.modeText}>Work</Text>
//         </View>

//         {/* Buttons */}
//         {elapsedTime === 0 && !isRunning && (
//           <CustomButton label="Start Work" color="#4CAF50" onPress={() => dispatch(startTimerWithBackground())} />
//         )}
//         {isRunning && (
//           <View style={styles.buttonRow}>
//             <CustomButton label="Pause" color="#FF9800" onPress={() => setPauseModal(true)} />
//             <CustomButton label="Complete" color="#F44336" onPress={() => setCompleteModal(true)} />
//           </View>
//         )}
//         {!isRunning && elapsedTime > 0 && (
//           <View style={styles.buttonRow}>
//             <CustomButton label="Resume" color="#4CAF50" onPress={() => dispatch(resumeTimerWithBackground())} />
//             <CustomButton label="Complete" color="#F44336" onPress={() => setCompleteModal(true)} />
//           </View>
//         )}
//       </View>

//       {/* Activity Log */}
//       <View style={styles.logCard}>
//         <Text style={styles.sectionTitle}>Activity Log</Text>
//         <FlatList
//           data={activityLog}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item }) => (
//             <View style={styles.logItem}>
//               <Text style={styles.logTitle}>{item.title}</Text>
//               <Text style={styles.logTime}>{formatTime(item.duration)}</Text>
//             </View>
//           )}
//         />
//       </View>

//       {/* Pause Modal */}
//       <Modal visible={pauseModal} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Pause Timer</Text>
//             <Text>Select a reason:</Text>
//             {["Break", "Emergency", "Other"].map((reason) => (
//               <TouchableOpacity
//                 key={reason}
//                 style={[styles.reasonBtn, pauseReason === reason && { backgroundColor: "#1565C0" }]}
//                 onPress={() => setPauseReason(reason)}
//               >
//                 <Text style={[styles.reasonText, pauseReason === reason && { color: "#fff" }]}>{reason}</Text>
//               </TouchableOpacity>
//             ))}
//             <TextInput
//               style={styles.input}
//               placeholder="Additional notes..."
//               value={pauseNotes}
//               onChangeText={setPauseNotes}
//             />
//             <View style={styles.modalBtnRow}>
//               <CustomButton label="Cancel" color="#9E9E9E" onPress={() => setPauseModal(false)} />
//               <CustomButton
//                 label="Confirm Pause"
//                 color="#1565C0"
//                 onPress={() => {
//                   dispatch(pauseTimerWithBackground({ reason: pauseReason, notes: pauseNotes }));
//                   setPauseModal(false);
//                 }}
//               />
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Complete Modal */}
//       <Modal visible={completeModal} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Complete Job</Text>
//             <Text>Total Time: {formatTime(elapsedTime)}</Text>
//             <Text>Activities: {activityLog?.length}</Text>
//             <View style={styles.modalBtnRow}>
//               <CustomButton label="Cancel" color="#9E9E9E" onPress={() => setCompleteModal(false)} />
//               <CustomButton
//                 label="Complete Job"
//                 color="#4CAF50"
//                 onPress={() => {
//                   dispatch(stopTimerWithBackground());
//                   setCompleteModal(false);
//                 }}
//               />
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F4F6FA", padding: 20 },
//   timerCard: { backgroundColor: "#fff", padding: 20, borderRadius: 12, alignItems: "center", marginBottom: 20 },
//   timerText: { fontSize: 40, fontWeight: "bold", color: "#1565C0" },
//   statusText: { fontSize: 16, color: "#777", marginBottom: 10 },
//   modeTag: { backgroundColor: "#1565C0", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginBottom: 15 },
//   modeText: { color: "#fff", fontWeight: "bold" },
//   btn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginVertical: 4, alignItems: "center" },
//   btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
//   buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, width: "100%" },
//   logCard: { backgroundColor: "#fff", padding: 15, borderRadius: 12 },
//   sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
//   logItem: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#eee" },
//   logTitle: { fontSize: 16, color: "#333" },
//   logTime: { fontSize: 16, fontWeight: "bold", color: "#1565C0" },
//   modalOverlay: { flex: 1, backgroundColor: "#00000088", justifyContent: "center", alignItems: "center" },
//   modalContent: { backgroundColor: "white", padding: 20, borderRadius: 12, width: "85%" },
//   modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
//   input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginTop: 10 },
//   reasonBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: "#ccc", marginVertical: 4 },
//   reasonText: { color: "#333" },
//   modalBtnRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 }
// });

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  startTimerWithBackground,
  pauseTimerWithBackground,
  resumeTimerWithBackground,
  stopTimerWithBackground,
} from '../redux/timerSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function TimerScreen({navigation}) {
  const {isRunning, elapsedTime} = useSelector(state => state.timer);
  const dispatch = useDispatch();

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color={'#000'} />
      </TouchableOpacity>

      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Work Timer</Text>
        <Text style={styles.headerSubtitle}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </Text>
      </View>

      <View style={styles.headerSpacer} />
    </View>
  );
  // Local activity log
  const [activityLog, setActivityLog] = useState([]);

  const [pauseModal, setPauseModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);
  const [pauseReason, setPauseReason] = useState('');
  const [pauseNotes, setPauseNotes] = useState('');

  const formatTime = ms => {
    const sec = Math.floor(ms / 1000);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const addActivity = (title, extra = {}) => {
    setActivityLog(prev => [
      ...prev,
      {
        title,
        duration: elapsedTime,
        time: new Date().toLocaleTimeString(),
        ...extra,
      },
    ]);
  };

  const CustomButton = ({label, onPress, color}) => (
    <TouchableOpacity
      style={[styles.btn, {backgroundColor: color}]}
      onPress={onPress}>
      <Text style={styles.btnText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      {/* Timer */}
      <View style={styles.timerCard}>
        <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
        <Text style={styles.statusText}>
          {isRunning ? 'Running' : 'Paused'}
        </Text>
        <View style={styles.modeTag}>
          <Text style={styles.modeText}>Work</Text>
        </View>

        {/* Start Button */}
        {elapsedTime === 0 && !isRunning && (
          <CustomButton
            label="Start Work"
            color="#4CAF50"
            onPress={() => {
              dispatch(startTimerWithBackground());
              addActivity('Work Started', {color: '#4CAF50'});
            }}
          />
        )}

        {/* Running state */}
        {isRunning && (
          <View style={styles.buttonRow}>
            <CustomButton
              label="Pause"
              color="#FF9800"
              onPress={() => setPauseModal(true)}
            />
            <CustomButton
              label="Complete"
              color="#F44336"
              onPress={() => setCompleteModal(true)}
            />
          </View>
        )}

        {/* Paused state */}
        {!isRunning && elapsedTime > 0 && (
          <View style={styles.buttonRow}>
            <CustomButton
              label="Resume"
              color="#4CAF50"
              onPress={() => {
                dispatch(resumeTimerWithBackground());
                addActivity('Work Resumed', {color: '#4CAF50'});
              }}
            />
            <CustomButton
              label="Complete"
              color="#F44336"
              onPress={() => setCompleteModal(true)}
            />
          </View>
        )}
      </View>

      {/* Activity Log */}
      <View style={styles.logCard}>
        <Text style={styles.sectionTitle}>Activity Log</Text>
        <FlatList
          data={activityLog}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.logItem}>
              <Text style={[styles.logTitle, {color: item.color || '#333'}]}>
                {item.title}
              </Text>
              <Text style={styles.logTime}>{formatTime(item.duration)}</Text>
            </View>
          )}
        />
      </View>

      {/* Pause Modal */}
      <Modal visible={pauseModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pause Timer</Text>
            <Text>Select a reason:</Text>
            {['Break', 'Emergency', 'Other'].map(reason => (
              <TouchableOpacity
                key={reason}
                style={[
                  styles.reasonBtn,
                  pauseReason === reason && {backgroundColor: '#1565C0'},
                ]}
                onPress={() => setPauseReason(reason)}>
                <Text
                  style={[
                    styles.reasonText,
                    pauseReason === reason && {color: '#fff'},
                  ]}>
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}
            <TextInput
              style={styles.input}
              placeholder="Additional notes..."
              value={pauseNotes}
              onChangeText={setPauseNotes}
            />
            <View style={styles.modalBtnRow}>
              <CustomButton
                label="Cancel"
                color="#9E9E9E"
                onPress={() => setPauseModal(false)}
              />
              <CustomButton
                label="Confirm Pause"
                color="#1565C0"
                onPress={() => {
                  dispatch(pauseTimerWithBackground());
                  addActivity(`Paused - ${pauseReason}`, {
                    notes: pauseNotes,
                    color: '#FF9800',
                  });
                  setPauseModal(false);
                  setPauseReason('');
                  setPauseNotes('');
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Complete Modal */}
      <Modal visible={completeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Complete Job</Text>
            <Text>Total Time: {formatTime(elapsedTime)}</Text>
            <Text>Activities: {activityLog.length}</Text>
            <View style={styles.modalBtnRow}>
              <CustomButton
                label="Cancel"
                color="#9E9E9E"
                onPress={() => setCompleteModal(false)}
              />
              <CustomButton
                label="Complete Job"
                color="#4CAF50"
                onPress={() => {
                  dispatch(stopTimerWithBackground());
                  addActivity('Work Completed', {color: '#2196F3'});
                  setCompleteModal(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F4F6FA', padding: 20},
  // Header
  header: {
    // backgroundColor: '#1E293B',
    paddingTop: Platform.OS === 'ios' ? 10 : 10,
    paddingHorizontal: 0,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#000',
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },

  timerCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {fontSize: 40, fontWeight: 'bold', color: '#1565C0'},
  statusText: {fontSize: 16, color: '#777', marginBottom: 10},
  modeTag: {
    backgroundColor: '#1565C0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 15,
  },
  modeText: {color: '#fff', fontWeight: 'bold'},
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 4,
    alignItems: 'center',
  },
  btnText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
  },
  logCard: {backgroundColor: '#fff', padding: 15, borderRadius: 12},
  sectionTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logTitle: {fontSize: 16, color: '#333'},
  logTime: {fontSize: 16, fontWeight: 'bold', color: '#1565C0'},
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '85%',
  },
  modalTitle: {fontSize: 20, fontWeight: 'bold', marginBottom: 15},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  reasonBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 4,
  },
  reasonText: {color: '#333'},
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
});
