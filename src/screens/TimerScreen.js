// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   StyleSheet,
//   StatusBar,
//   Alert,
//   ScrollView,
// } from 'react-native';

// const TimerScreen = () => {
//   const [isRunning, setIsRunning] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const [seconds, setSeconds] = useState(0);
//   const [selectedJob, setSelectedJob] = useState('');
//   const [isOnBreak, setIsOnBreak] = useState(false);
//   const [breakSeconds, setBreakSeconds] = useState(0);
//   const [location, setLocation] = useState('Houston, TX');
//   const [gpsStatus, setGpsStatus] = useState('Connected');

//   const jobs = [
//     { id: 'JOB-001', title: 'Electrical Panel Upgrade' },
//     { id: 'JOB-002', title: 'Commercial Lighting Installation' },
//     { id: 'JOB-003', title: 'Emergency Generator Maintenance' },
//   ];

//   const timeEntries = [
//     { id: 1, job: 'JOB-001', duration: '2h 30m', date: 'Today 08:00' },
//     { id: 2, job: 'JOB-002', duration: '1h 45m', date: 'Today 11:00' },
//   ];

//   useEffect(() => {
//     let interval;
    
//     if (isRunning && !isPaused && !isOnBreak) {
//       interval = setInterval(() => {
//         setSeconds(prevSeconds => prevSeconds + 1);
//       }, 1000);
//     } else if (isOnBreak && isRunning) {
//       interval = setInterval(() => {
//         setBreakSeconds(prevSeconds => prevSeconds + 1);
//       }, 1000);
//     }

//     return () => clearInterval(interval);
//   }, [isRunning, isPaused, isOnBreak]);

//   const formatTime = (totalSeconds) => {
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const secs = totalSeconds % 60;
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const handleStart = () => {
//     if (!selectedJob) {
//       Alert.alert('Select Job', 'Please select a job before starting the timer');
//       return;
//     }
//     setIsRunning(true);
//     setIsPaused(false);
//   };

//   const handlePause = () => {
//     setIsPaused(!isPaused);
//   };

//   const handleStop = () => {
//     Alert.alert(
//       'Stop Timer',
//       'Are you sure you want to stop the timer and save this time entry?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Stop & Save', 
//           onPress: () => {
//             setIsRunning(false);
//             setIsPaused(false);
//             setIsOnBreak(false);
//             setSeconds(0);
//             setBreakSeconds(0);
//             Alert.alert('Success', 'Time entry saved successfully!');
//           }
//         },
//       ]
//     );
//   };

//   const handleBreak = () => {
//     if (isOnBreak) {
//       setIsOnBreak(false);
//       setBreakSeconds(0);
//     } else {
//       setIsOnBreak(true);
//     }
//   };

//   const renderJobSelector = () => (
//     <View style={styles.section}>
//       <Text style={styles.sectionTitle}>Select Job</Text>
//       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//         <View style={styles.jobSelector}>
//           {jobs.map((job) => (
//             <TouchableOpacity
//               key={job.id}
//               style={[
//                 styles.jobOption,
//                 selectedJob === job.id && styles.jobOptionSelected,
//               ]}
//               onPress={() => setSelectedJob(job.id)}
//             >
//               <Text style={styles.jobId}>{job.id}</Text>
//               <Text style={[
//                 styles.jobTitle,
//                 selectedJob === job.id && styles.jobTitleSelected,
//               ]}>
//                 {job.title}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );

//   const renderLocationStatus = () => (
//     <View style={styles.locationContainer}>
//       <View style={styles.locationHeader}>
//         <Text style={styles.locationIcon}>📍</Text>
//         <View style={styles.locationInfo}>
//           <Text style={styles.locationText}>{location}</Text>
//           <Text style={styles.gpsStatusText}>GPS: {gpsStatus}</Text>
//         </View>
//         <View style={[
//           styles.gpsIndicator,
//           { backgroundColor: gpsStatus === 'Connected' ? '#10B981' : '#F59E0B' }
//         ]} />
//       </View>
//       <View style={styles.geofenceStatus}>
//         <Text style={styles.geofenceText}>🎯 Within job site geofence</Text>
//       </View>
//     </View>
//   );

//   const renderTimeEntry = (entry) => (
//     <View key={entry.id} style={styles.timeEntryCard}>
//       <View style={styles.timeEntryHeader}>
//         <Text style={styles.timeEntryJob}>{entry.job}</Text>
//         <Text style={styles.timeEntryDuration}>{entry.duration}</Text>
//       </View>
//       <Text style={styles.timeEntryDate}>{entry.date}</Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Time Tracker</Text>
//         <View style={styles.todayHours}>
//           <Text style={styles.todayHoursText}>Today: 4h 15m</Text>
//         </View>
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {/* Job Selector */}
//         {renderJobSelector()}

//         {/* Timer Display */}
//         <View style={styles.timerSection}>
//           <View style={styles.timerDisplay}>
//             <Text style={styles.timerText}>{formatTime(seconds)}</Text>
//             {isOnBreak && (
//               <View style={styles.breakDisplay}>
//                 <Text style={styles.breakLabel}>Break Time</Text>
//                 <Text style={styles.breakTime}>{formatTime(breakSeconds)}</Text>
//               </View>
//             )}
//           </View>

//           {/* Timer Controls */}
//           <View style={styles.timerControls}>
//             {!isRunning ? (
//               <TouchableOpacity style={styles.startButton} onPress={handleStart}>
//                 <Text style={styles.startButtonText}>▶️ Start</Text>
//               </TouchableOpacity>
//             ) : (
//               <View style={styles.activeControls}>
//                 <TouchableOpacity 
//                   style={[styles.controlButton, styles.pauseButton]} 
//                   onPress={handlePause}
//                 >
//                   <Text style={styles.controlButtonText}>
//                     {isPaused ? '▶️ Resume' : '⏸️ Pause'}
//                   </Text>
//                 </TouchableOpacity>
                
//                 <TouchableOpacity 
//                   style={[styles.controlButton, styles.stopButton]} 
//                   onPress={handleStop}
//                 >
//                   <Text style={styles.controlButtonText}>⏹️ Stop</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>

//           {/* Break Button */}
//           {isRunning && (
//             <TouchableOpacity 
//               style={[
//                 styles.breakButton,
//                 isOnBreak && styles.breakButtonActive
//               ]} 
//               onPress={handleBreak}
//             >
//               <Text style={[
//                 styles.breakButtonText,
//                 isOnBreak && styles.breakButtonTextActive
//               ]}>
//                 {isOnBreak ? '🔄 End Break' : '☕ Take Break'}
//               </Text>
//             </TouchableOpacity>
//           )}

//           {/* Status Indicators */}
//           {isRunning && (
//             <View style={styles.statusIndicators}>
//               <View style={[
//                 styles.statusBadge,
//                 { backgroundColor: isPaused ? '#F59E0B' : '#10B981' }
//               ]}>
//                 <Text style={styles.statusText}>
//                   {isPaused ? 'PAUSED' : isOnBreak ? 'ON BREAK' : 'ACTIVE'}
//                 </Text>
//               </View>
//             </View>
//           )}
//         </View>

//         {/* Location Status */}
//         {renderLocationStatus()}

//         {/* Manual Time Entry */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Manual Entry</Text>
//           <TouchableOpacity style={styles.manualEntryButton}>
//             <Text style={styles.manualEntryText}>➕ Add Manual Time Entry</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Today's Time Entries */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Today's Time Entries</Text>
//           {timeEntries.map(renderTimeEntry)}
//         </View>

//         {/* Quick Actions */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Quick Actions</Text>
//           <View style={styles.quickActions}>
//             <TouchableOpacity style={styles.quickActionButton}>
//               <Text style={styles.quickActionText}>📋 View Timesheet</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.quickActionButton}>
//               <Text style={styles.quickActionText}>📤 Submit Hours</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8FAFC',
//   },
//   header: {
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#111827',
//   },
//   todayHours: {
//     backgroundColor: '#EFF6FF',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   todayHoursText: {
//     fontSize: 12,
//     color: '#1E40AF',
//     fontWeight: '500',
//   },
//   content: {
//     flex: 1,
//   },
//   section: {
//     backgroundColor: '#FFFFFF',
//     margin: 16,
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: 16,
//   },
//   jobSelector: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   jobOption: {
//     backgroundColor: '#F3F4F6',
//     borderRadius: 8,
//     padding: 12,
//     minWidth: 180,
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   jobOptionSelected: {
//     backgroundColor: '#EFF6FF',
//     borderColor: '#1E40AF',
//   },
//   jobId: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#6B7280',
//     marginBottom: 4,
//   },
//   jobTitle: {
//     fontSize: 14,
//     color: '#374151',
//     fontWeight: '500',
//   },
//   jobTitleSelected: {
//     color: '#1E40AF',
//   },
//   timerSection: {
//     backgroundColor: '#FFFFFF',
//     margin: 16,
//     borderRadius: 12,
//     padding: 20,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   timerDisplay: {
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   timerText: {
//     fontSize: 48,
//     fontWeight: 'bold',
//     color: '#1E40AF',
//     fontFamily: 'monospace',
//   },
//   breakDisplay: {
//     marginTop: 12,
//     alignItems: 'center',
//   },
//   breakLabel: {
//     fontSize: 14,
//     color: '#F59E0B',
//     fontWeight: '500',
//     marginBottom: 4,
//   },
//   breakTime: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#F59E0B',
//     fontFamily: 'monospace',
//   },
//   timerControls: {
//     width: '100%',
//     marginBottom: 16,
//   },
//   startButton: {
//     backgroundColor: '#10B981',
//     borderRadius: 12,
//     paddingVertical: 16,
//     alignItems: 'center',
//     width: '100%',
//   },
//   startButtonText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   activeControls: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   controlButton: {
//     flex: 1,
//     borderRadius: 12,
//     paddingVertical: 16,
//     alignItems: 'center',
//   },
//   pauseButton: {
//     backgroundColor: '#F59E0B',
//   },
//   stopButton: {
//     backgroundColor: '#EF4444',
//   },
//   controlButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   breakButton: {
//     backgroundColor: '#F3F4F6',
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     marginBottom: 16,
//   },
//   breakButtonActive: {
//     backgroundColor: '#FEF3C7',
//   },
//   breakButtonText: {
//     color: '#6B7280',
//     fontSize: 14,
//     fontWeight: '500',
//     textAlign: 'center',
//   },
//   breakButtonTextActive: {
//     color: '#92400E',
//   },
//   statusIndicators: {
//     alignItems: 'center',
//   },
//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   statusText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   locationContainer: {
//     backgroundColor: '#FFFFFF',
//     margin: 16,
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   locationHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   locationIcon: {
//     fontSize: 16,
//     marginRight: 8,
//   },
//   locationInfo: {
//     flex: 1,
//   },
//   locationText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#111827',
//   },
//   gpsStatusText: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   gpsIndicator: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//   },
//   geofenceStatus: {
//     backgroundColor: '#F0FDF4',
//     borderRadius: 6,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//   },
//   geofenceText: {
//     fontSize: 12,
//     color: '#15803D',
//     textAlign: 'center',
//   },
//   manualEntryButton: {
//     backgroundColor: '#F3F4F6',
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderStyle: 'dashed',
//   },
//   manualEntryText: {
//     color: '#6B7280',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   timeEntryCard: {
//     backgroundColor: '#F8FAFC',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 8,
//   },
//   timeEntryHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   timeEntryJob: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   timeEntryDuration: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1E40AF',
//   },
//   timeEntryDate: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   quickActions: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   quickActionButton: {
//     flex: 1,
//     backgroundColor: '#1E40AF',
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
//   quickActionText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '500',
//   },
// });

// export default TimerScreen;


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
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useNavigation } from '@react-navigation/native';

// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');


// const TimerScreen = ({ job, route }) => {
//   const navigation = useNavigation();
  
//   // Timer state
//   const [isRunning, setIsRunning] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const [elapsedTime, setElapsedTime] = useState(0);
//   const [startTime, setStartTime] = useState(null);
//   const [pausedTime, setPausedTime] = useState(0);
//   const [totalPausedTime, setTotalPausedTime] = useState(0);
//   const [breakCount, setBreakCount] = useState(0);
//   const [currentLocation, setCurrentLocation] = useState('');
//   const [sessionNotes, setSessionNotes] = useState('');
  
//   // Session data
//   const [dailySessions, setDailySessions] = useState([]);
//   const [totalDailyHours, setTotalDailyHours] = useState(0);
//   const [currentSession, setCurrentSession] = useState(null);
  
//   // App state tracking
//   const appState = useRef(AppState.currentState);
//   const timerRef = useRef(null);
//   const pauseStartTime = useRef(null);

//   // Get job from route params or props
//   const currentJob = job || route?.params?.job;

//   useEffect(() => {
//     StatusBar.setBarStyle('light-content');
//     StatusBar.setBackgroundColor('#1E293B');
    
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

//   const formatTimeToHours = (seconds) => {
//     return (seconds / 3600).toFixed(2);
//   };

//   const handleStartTimer = () => {
//     const now = new Date();
//     setStartTime(now);
//     setIsRunning(true);
//     setIsPaused(false);
//     setElapsedTime(0);
//     setTotalPausedTime(0);
//     getCurrentLocation();
    
//     const newSession = {
//       id: Date.now().toString(),
//       jobId: currentJob?.id,
//       jobTitle: currentJob?.title,
//       startTime: now,
//       endTime: null,
//       elapsedTime: 0,
//       location: currentLocation,
//       status: 'running',
//       breaks: 0,
//       notes: ''
//     };
    
//     setCurrentSession(newSession);
//     Alert.alert('Timer Started', 'Work session has begun');
//   };

//   const handlePauseTimer = () => {
//     if (!isPaused) {
//       setIsPaused(true);
//       pauseStartTime.current = new Date();
//       Alert.alert('Timer Paused', 'Timer has been paused');
//     } else {
//       setIsPaused(false);
//       if (pauseStartTime.current) {
//         const pauseDuration = (new Date().getTime() - pauseStartTime.current.getTime()) / 1000;
//         setTotalPausedTime(prev => prev + pauseDuration);
//         pauseStartTime.current = null;
//       }
//       Alert.alert('Timer Resumed', 'Timer has been resumed');
//     }
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
    
//     const completedSession = {
//       ...currentSession,
//       endTime: now,
//       elapsedTime: sessionDuration,
//       status: 'completed',
//       breaks: breakCount,
//       notes: sessionNotes,
//       totalPausedTime
//     };
    
//     setDailySessions(prev => [...prev, completedSession]);
//     setTotalDailyHours(prev => prev + (sessionDuration / 3600));
    
//     // Reset timer state
//     setElapsedTime(0);
//     setStartTime(null);
//     setCurrentSession(null);
//     setBreakCount(0);
//     setSessionNotes('');
//     setTotalPausedTime(0);
    
//     Alert.alert(
//       'Session Complete',
//       `Work session completed: ${formatTime(sessionDuration)}\nTotal hours today: ${formatTimeToHours(sessionDuration)} hours`
//     );
//   };

//   const handleTakeBreak = () => {
//     if (isRunning && !isPaused) {
//       setBreakCount(prev => prev + 1);
//       handlePauseTimer();
//       Alert.alert('Break Started', 'Enjoy your break!');
//     }
//   };

//   const getTimerStatus = () => {
//     if (!isRunning) return 'Ready to start';
//     if (isPaused) return 'Timer paused';
//     return 'Timer running';
//   };

//   const getStatusColor = () => {
//     if (!isRunning) return '#64748B';
//     if (isPaused) return '#F59E0B';
//     return '#10B981';
//   };

//   const renderTimerDisplay = () => (
//     <View style={styles.timerContainer}>
//       <View style={styles.timerCard}>
//         <View style={styles.timerHeader}>
//           <Icon name="timer" size={24} color="#3B82F6" />
//           <Text style={styles.timerHeaderText}>Work Timer</Text>
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
//               <Icon name="place" size={16} color="#64748B" />
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
//           <Icon name="play-arrow" size={32} color="white" />
//           <Text style={styles.startButtonText}>Start Work</Text>
//         </TouchableOpacity>
//       ) : (
//         <View style={styles.activeControls}>
//           <TouchableOpacity
//             style={[styles.controlButton, styles.pauseButton]}
//             onPress={handlePauseTimer}
//           >
//             <Icon name={isPaused ? "play-arrow" : "pause"} size={24} color="white" />
//             <Text style={styles.controlButtonText}>
//               {isPaused ? 'Resume' : 'Pause'}
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.controlButton, styles.breakButton]}
//             onPress={handleTakeBreak}
//             disabled={isPaused}
//           >
//             <Icon name="coffee" size={24} color="white" />
//             <Text style={styles.controlButtonText}>Break</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.controlButton, styles.stopButton]}
//             onPress={handleStopTimer}
//           >
//             <Icon name="stop" size={24} color="white" />
//             <Text style={styles.controlButtonText}>Stop</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );

//   const renderSessionInfo = () => (
//     <View style={styles.sessionContainer}>
//       <View style={styles.sessionCard}>
//         <View style={styles.sessionHeader}>
//           <Icon name="info" size={20} color="#3B82F6" />
//           <Text style={styles.sessionHeaderText}>Session Info</Text>
//         </View>

//         <View style={styles.sessionStats}>
//           <View style={styles.statItem}>
//             <Text style={styles.statLabel}>Started At</Text>
//             <Text style={styles.statValue}>
//               {startTime ? startTime.toLocaleTimeString() : '--:--'}
//             </Text>
//           </View>

//           <View style={styles.statItem}>
//             <Text style={styles.statLabel}>Location</Text>
//             <Text style={styles.statValue} numberOfLines={2}>
//               {currentLocation || 'Getting location...'}
//             </Text>
//           </View>

//           <View style={styles.statItem}>
//             <Text style={styles.statLabel}>Breaks</Text>
//             <Text style={styles.statValue}>{breakCount}</Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );

//   const renderDailyStats = () => (
//     <View style={styles.statsContainer}>
//       <View style={styles.statsCard}>
//         <View style={styles.statsHeader}>
//           <Icon name="today" size={20} color="#3B82F6" />
//           <Text style={styles.statsHeaderText}>Today's Summary</Text>
//         </View>

//         <View style={styles.dailyStats}>
//           <View style={styles.dailyStatItem}>
//             <Text style={styles.dailyStatNumber}>{formatTimeToHours(totalDailyHours * 3600)}</Text>
//             <Text style={styles.dailyStatLabel}>Hours Worked</Text>
//           </View>

//           <View style={styles.dailyStatItem}>
//             <Text style={styles.dailyStatNumber}>{dailySessions.length}</Text>
//             <Text style={styles.dailyStatLabel}>Sessions</Text>
//           </View>

//           <View style={styles.dailyStatItem}>
//             <Text style={styles.dailyStatNumber}>
//               {dailySessions.reduce((total, session) => total + (session.breaks || 0), 0)}
//             </Text>
//             <Text style={styles.dailyStatLabel}>Total Breaks</Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );

//   const renderRecentSessions = () => (
//     <View style={styles.sessionsContainer}>
//       <View style={styles.sessionsCard}>
//         <View style={styles.sessionsHeader}>
//           <Icon name="history" size={20} color="#3B82F6" />
//           <Text style={styles.sessionsHeaderText}>Recent Sessions</Text>
//         </View>

//         {dailySessions.length > 0 ? (
//           <ScrollView style={styles.sessionsList} showsVerticalScrollIndicator={false}>
//             {dailySessions.slice(-3).reverse().map((session, index) => (
//               <View key={session.id || index} style={styles.sessionItem}>
//                 <View style={styles.sessionItemHeader}>
//                   <Text style={styles.sessionTime}>
//                     {session.startTime ? new Date(session.startTime).toLocaleTimeString() : 'N/A'} - 
//                     {session.endTime ? new Date(session.endTime).toLocaleTimeString() : 'Running'}
//                   </Text>
//                   <View style={[
//                     styles.sessionStatus,
//                     { backgroundColor: session.status === 'completed' ? '#10B981' : '#F59E0B' }
//                   ]}>
//                     <Text style={styles.sessionStatusText}>{session.status}</Text>
//                   </View>
//                 </View>
                
//                 <Text style={styles.sessionDuration}>
//                   Duration: {formatTime(session.elapsedTime || 0)}
//                 </Text>
                
//                 {session.jobTitle && (
//                   <Text style={styles.sessionJob}>Job: {session.jobTitle}</Text>
//                 )}
                
//                 {session.breaks > 0 && (
//                   <Text style={styles.sessionBreaks}>Breaks: {session.breaks}</Text>
//                 )}
//               </View>
//             ))}
//           </ScrollView>
//         ) : (
//           <View style={styles.emptyState}>
//             <Icon name="timer-off" size={48} color="#CBD5E1" />
//             <Text style={styles.emptyStateText}>No sessions today</Text>
//             <Text style={styles.emptyStateSubtext}>Start a timer to begin tracking</Text>
//           </View>
//         )}
//       </View>
//     </View>
//   );

//   const renderQuickActions = () => (
//     <View style={styles.actionsContainer}>
//       <TouchableOpacity
//         style={styles.actionButton}
//         onPress={() => navigation.navigate('Reports')}
//       >
//         <Icon name="assessment" size={24} color="#3B82F6" />
//         <Text style={styles.actionButtonText}>Reports</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.actionButton}
//         onPress={() => navigation.navigate('Timesheet')}
//       >
//         <Icon name="schedule" size={24} color="#3B82F6" />
//         <Text style={styles.actionButtonText}>Timesheet</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.actionButton}
//         onPress={() => navigation.navigate('JobListing')}
//       >
//         <Icon name="work" size={24} color="#3B82F6" />
//         <Text style={styles.actionButtonText}>Jobs</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#1E293B" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//           <Icon name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
        
//         <View style={styles.headerContent}>
//           <Text style={styles.headerTitle}>Timer</Text>
//           <Text style={styles.headerSubtitle}>
//             {new Date().toLocaleDateString('en-US', {
//               weekday: 'short',
//               month: 'short',
//               day: 'numeric'
//             })}
//           </Text>
//         </View>
        
//         <View style={styles.headerSpacer} />
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {renderTimerDisplay()}
//         {renderTimerControls()}
        
//         {(isRunning || startTime) && renderSessionInfo()}
        
//         {renderDailyStats()}
//         {renderRecentSessions()}
//         {renderQuickActions()}
        
//         <View style={{ height: 20 }} />
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8FAFC',
//   },
  
//   // Header
//   header: {
//     backgroundColor: '#1E293B',
//     paddingTop: Platform.OS === 'ios' ? 50 : 30,
//     paddingHorizontal: 16,
//     paddingBottom: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerContent: {
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.8)',
//     marginTop: 2,
//   },
//   headerSpacer: {
//     width: 40,
//   },

//   // Content
//   content: {
//     flex: 1,
//     paddingHorizontal: 16,
//   },

//   // Timer Display
//   timerContainer: {
//     marginTop: 20,
//   },
//   timerCard: {
//     backgroundColor: 'white',
//     borderRadius: 16,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   timerHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   timerHeaderText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1E293B',
//     marginLeft: 8,
//   },
//   timerDisplay: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   timerText: {
//     fontSize: 48,
//     fontWeight: 'bold',
//     color: '#3B82F6',
//     fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
//   },
//   statusIndicator: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginTop: 12,
//   },
//   statusText: {
//     fontSize: 14,
//     color: 'white',
//     fontWeight: '500',
//   },
//   jobInfo: {
//     borderTopWidth: 1,
//     borderTopColor: '#E2E8F0',
//     paddingTop: 16,
//   },
//   jobTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1E293B',
//     marginBottom: 4,
//   },
//   jobCustomer: {
//     fontSize: 14,
//     color: '#64748B',
//     marginBottom: 8,
//   },
//   jobLocation: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   locationText: {
//     fontSize: 14,
//     color: '#64748B',
//     marginLeft: 4,
//     flex: 1,
//   },

//   // Controls
//   controlsContainer: {
//     marginTop: 20,
//   },
//   startButton: {
//     backgroundColor: '#10B981',
//     borderRadius: 16,
//     paddingVertical: 20,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     shadowColor: '#10B981',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   startButtonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'white',
//     marginLeft: 8,
//   },
//   activeControls: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 12,
//   },
//   controlButton: {
//     flex: 1,
//     borderRadius: 12,
//     paddingVertical: 16,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   pauseButton: {
//     backgroundColor: '#F59E0B',
//   },
//   breakButton: {
//     backgroundColor: '#8B5CF6',
//   },
//   stopButton: {
//     backgroundColor: '#EF4444',
//   },
//   controlButtonText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: 'white',
//     marginTop: 4,
//   },

//   // Session Info
//   sessionContainer: {
//     marginTop: 20,
//   },
//   sessionCard: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   sessionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sessionHeaderText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1E293B',
//     marginLeft: 8,
//   },
//   sessionStats: {
//     gap: 12,
//   },
//   statItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   statLabel: {
//     fontSize: 14,
//     color: '#64748B',
//   },
//   statValue: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#1E293B',
//     flex: 1,
//     textAlign: 'right',
//   },

//   // Daily Stats
//   statsContainer: {
//     marginTop: 20,
//   },
//   statsCard: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   statsHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   statsHeaderText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1E293B',
//     marginLeft: 8,
//   },
//   dailyStats: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   dailyStatItem: {
//     alignItems: 'center',
//   },
//   dailyStatNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#3B82F6',
//   },
//   dailyStatLabel: {
//     fontSize: 12,
//     color: '#64748B',
//     marginTop: 4,
//   },

//   // Recent Sessions
//   sessionsContainer: {
//     marginTop: 20,
//   },
//   sessionsCard: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   sessionsHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sessionsHeaderText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1E293B',
//     marginLeft: 8,
//   },
//   sessionsList: {
//     maxHeight: 200,
//   },
//   sessionItem: {
//     padding: 12,
//     backgroundColor: '#F8FAFC',
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   sessionItemHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   sessionTime: {
//     fontSize: 12,
//     color: '#64748B',
//     flex: 1,
//   },
//   sessionStatus: {
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 12,
//   },
//   sessionStatusText: {
//     fontSize: 10,
//     color: 'white',
//     fontWeight: '500',
//   },
//   sessionDuration: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#1E293B',
//     marginBottom: 2,
//   },
//   sessionJob: {
//     fontSize: 12,
//     color: '#64748B',
//     marginBottom: 2,
//   },
//   sessionBreaks: {
//     fontSize: 12,
//     color: '#64748B',
//   },

//   // Empty State
//   emptyState: {
//     alignItems: 'center',
//     paddingVertical: 32,
//   },
//   emptyStateText: {
//     fontSize: 16,
//     color: '#64748B',
//     marginTop: 12,
//   },
//   emptyStateSubtext: {
//     fontSize: 14,
//     color: '#94A3B8',
//     marginTop: 4,
//   },

//   // Quick Actions
//   actionsContainer: {
//     marginTop: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 12,
//   },
//   actionButton: {
//     flex: 1,
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 16,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   actionButtonText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#3B82F6',
//     marginTop: 4,
//   },
// });

// export default TimerScreen;



import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
  ScrollView,
  StyleSheet,
  Dimensions,
  AppState,
  Platform,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Embedded Colors
const Colors = {
  primary: '#3B82F6',
  primaryLight: '#EBF4FF',
  white: '#FFFFFF',
  backgroundLight: '#F8FAFC',
  text: '#1E293B',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  border: '#E2E8F0',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  purple: '#8B5CF6',
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
};

const Shadows = {
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
};





const TimerScreen = ({ route }) => {
  const navigation = useNavigation();
  
  // Timer state
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [currentLocation, setCurrentLocation] = useState('');
  const [breakCount, setBreakCount] = useState(0);
  
  // Activity tracking
  const [activities, setActivities] = useState([]);
  const [currentActivityId, setCurrentActivityId] = useState(null);
  
  // Pause modal state
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pauseReason, setPauseReason] = useState('');
  const [selectedPauseReason, setSelectedPauseReason] = useState('');
  
  // App state tracking
  const appState = useRef(AppState.currentState);
  const timerRef = useRef(null);

  // Get job from route params or props
  const currentJob =  {
    id: 'demo-job',
    title: 'Electrical Panel Installation',
    customer: { name: 'ABC Manufacturing Corp.' },
    location: { address: '123 Industrial Blvd, Houston, TX' },
    estimatedHours: 8,
    priority: 'high'
  };

  // Pause reasons
  const pauseReasons = [
    { id: 'break', label: 'Taking a break', icon: 'coffee' },
    { id: 'lunch', label: 'Lunch break', icon: 'restaurant' },
    { id: 'meeting', label: 'Meeting/Call', icon: 'call' },
    { id: 'materials', label: 'Getting materials', icon: 'build' },
    { id: 'travel', label: 'Travel time', icon: 'directions-car' },
    { id: 'other', label: 'Other reason', icon: 'more-horiz' }
  ];

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('#1E293B');
    
    // Load saved activities
    loadActivities();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // App state change handler
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  // Timer effect
  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, isPaused]);

  const handleAppStateChange = (nextAppState) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground');
      if (isRunning && !isPaused) {
        console.log('Timer was running when app became active');
      }
    }
    appState.current = nextAppState;
  };

  const loadActivities = () => {
    // Load activities from storage or initialize with mock data
    const mockActivities = [
      {
        id: 'act-1',
        jobId: 'job-1',
        jobTitle: 'Office Wiring Project',
        startTime: new Date(Date.now() - 3600000 * 2), // 2 hours ago
        endTime: new Date(Date.now() - 3600000), // 1 hour ago
        elapsedTime: 3540, // 59 minutes
        status: 'completed',
        location: '456 Business Ave',
        breaks: 1,
        pauseReason: 'Lunch break'
      },
      {
        id: 'act-2',
        jobId: 'job-2',
        jobTitle: 'Residential Panel Upgrade',
        startTime: new Date(Date.now() - 7200000), // Earlier today
        endTime: new Date(Date.now() - 5400000),
        elapsedTime: 1620, // 27 minutes
        status: 'completed',
        location: '789 Home Street',
        breaks: 0
      }
    ];
    setActivities(mockActivities);
  };

  const getCurrentLocation = () => {
    console.log('Getting current location...');
    
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      setCurrentLocation(currentJob?.location?.address || 'Location unavailable');
      return;
    }

    const options = {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Location obtained:', { latitude, longitude });
        setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        setCurrentLocation(currentJob?.location?.address || 'Manual entry required');
      },
      options
    );
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const checkForActiveTimer = () => {
    const hasActiveTimer = activities.some(activity => 
      activity.status === 'running' || activity.status === 'paused'
    );
    return hasActiveTimer || isRunning;
  };

  const handleStartTimer = () => {
    // Check if there's already an active timer
    if (checkForActiveTimer()) {
      Alert.alert(
        'Active Timer Found', 
        'You already have an active timer running. Only one timer can be active at a time.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    const now = new Date();
    const activityId = `activity-${Date.now()}`;
    
    setStartTime(now);
    setIsRunning(true);
    setIsPaused(false);
    setElapsedTime(0);
    setBreakCount(0);
    setCurrentActivityId(activityId);
    
    getCurrentLocation();
    
    const newActivity = {
      id: activityId,
      jobId: currentJob?.id,
      jobTitle: currentJob?.title,
      startTime: now,
      elapsedTime: 0,
      status: 'running',
      location: currentLocation,
      breaks: 0
    };
    
    setActivities(prev => [newActivity, ...prev]);
    Alert.alert('Timer Started', 'Work session has begun');
  };

  const handlePauseTimer = () => {
    if (isRunning && !isPaused) {
      setShowPauseModal(true);
    } else if (isPaused) {
      // Resume timer
      setIsPaused(false);
      updateCurrentActivity({ status: 'running' });
      Alert.alert('Timer Resumed', 'Work session resumed');
    }
  };

  const confirmPauseTimer = () => {
    const reason = selectedPauseReason || pauseReason || 'No reason specified';
    
    setIsPaused(true);
    setShowPauseModal(false);
    
    if (reason.includes('break') || reason.includes('Break')) {
      setBreakCount(prev => prev + 1);
    }
    
    updateCurrentActivity({ 
      status: 'paused', 
      pauseReason: reason,
      breaks: reason.includes('break') ? breakCount + 1 : breakCount
    });
    
    // Reset modal state
    setSelectedPauseReason('');
    setPauseReason('');
    
    Alert.alert('Timer Paused', `Reason: ${reason}`);
  };

  const handleStopTimer = () => {
    Alert.alert(
      'Stop Timer',
      'Are you sure you want to stop the current session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Stop', style: 'destructive', onPress: confirmStopTimer }
      ]
    );
  };

  const confirmStopTimer = () => {
    const now = new Date();
    const sessionDuration = elapsedTime;
    
    setIsRunning(false);
    setIsPaused(false);
    
    updateCurrentActivity({
      endTime: now,
      elapsedTime: sessionDuration,
      status: 'completed',
      breaks: breakCount
    });
    
    // Reset timer state
    setElapsedTime(0);
    setStartTime(null);
    setCurrentActivityId(null);
    setBreakCount(0);
    
    Alert.alert(
      'Session Complete',
      `Work session completed: ${formatTime(sessionDuration)}`
    );
  };

  const updateCurrentActivity = (updates) => {
    if (!currentActivityId) return;
    
    setActivities(prev => prev.map(activity => 
      activity.id === currentActivityId 
        ? { ...activity, ...updates }
        : activity
    ));
  };

  const deleteActivity = (activityId) => {
    Alert.alert(
      'Delete Activity',
      'Are you sure you want to delete this time tracking activity?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            setActivities(prev => prev.filter(activity => activity.id !== activityId));
            if (activityId === currentActivityId) {
              // If deleting current activity, stop timer
              setIsRunning(false);
              setIsPaused(false);
              setElapsedTime(0);
              setStartTime(null);
              setCurrentActivityId(null);
            }
          }
        }
      ]
    );
  };

  const getTimerStatus = () => {
    if (!isRunning) return 'Ready to start';
    if (isPaused) return 'Timer paused';
    return 'Timer running';
  };

  const getStatusColor = () => {
    if (!isRunning) return Colors.textSecondary;
    if (isPaused) return Colors.warning;
    return Colors.success;
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color={"#000"} />
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Work Timer</Text>
        <Text style={styles.headerSubtitle}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          })}
        </Text>
      </View>
      
      <View style={styles.headerSpacer} />
    </View>
  );

  const renderTimerDisplay = () => (
    <View style={styles.timerContainer}>
      <View style={styles.timerCard}>
        <View style={styles.timerHeader}>
          <Icon name="timer" size={24} color={Colors.primary} />
          <Text style={styles.timerHeaderText}>Current Session</Text>
          {checkForActiveTimer() && (
            <View style={styles.activeIndicator}>
              <Text style={styles.activeIndicatorText}>ACTIVE</Text>
            </View>
          )}
        </View>
        
        <View style={styles.timerDisplay}>
          <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{getTimerStatus()}</Text>
          </View>
        </View>

        {currentJob && (
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle}>{currentJob.title}</Text>
            <Text style={styles.jobCustomer}>{currentJob.customer?.name}</Text>
            <View style={styles.jobLocation}>
              <Icon name="place" size={16} color={Colors.textSecondary} />
              <Text style={styles.locationText}>{currentJob.location?.address}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  const renderTimerControls = () => (
    <View style={styles.controlsContainer}>
      {!isRunning ? (
        <TouchableOpacity style={styles.startButton} onPress={handleStartTimer}>
          <Icon name="play-arrow" size={32} color={Colors.white} />
          <Text style={styles.startButtonText}>Start Work</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.activeControls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.pauseButton]}
            onPress={handlePauseTimer}
          >
            <Icon name={isPaused ? "play-arrow" : "pause"} size={24} color={Colors.white} />
            <Text style={styles.controlButtonText}>
              {isPaused ? 'Resume' : 'Pause'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.stopButton]}
            onPress={handleStopTimer}
          >
            <Icon name="stop" size={24} color={Colors.white} />
            <Text style={styles.controlButtonText}>Stop</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderPauseModal = () => (
    <Modal
      visible={showPauseModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowPauseModal(false)}
    >
      <KeyboardAvoidingView 
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity 
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowPauseModal(false)}
        >
          <View style={styles.pauseModal}>
            <TouchableOpacity style={styles.modalHandle} />
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pause Reason</Text>
              <Text style={styles.modalSubtitle}>Why are you pausing the timer?</Text>
            </View>

            <ScrollView style={styles.reasonsList} showsVerticalScrollIndicator={false}>
              {pauseReasons.map((reason) => (
                <TouchableOpacity
                  key={reason.id}
                  style={[
                    styles.reasonOption,
                    selectedPauseReason === reason.id && styles.selectedReasonOption
                  ]}
                  onPress={() => setSelectedPauseReason(reason.id)}
                >
                  <Icon 
                    name={reason.icon} 
                    size={24} 
                    color={selectedPauseReason === reason.id ? Colors.primary : Colors.textSecondary} 
                  />
                  <Text 
                    style={[
                      styles.reasonText,
                      selectedPauseReason === reason.id && styles.selectedReasonText
                    ]}
                  >
                    {reason.label}
                  </Text>
                  {selectedPauseReason === reason.id && (
                    <Icon name="check" size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.customReasonContainer}>
              <Text style={styles.customReasonLabel}>Or specify custom reason:</Text>
              <TextInput
                style={styles.customReasonInput}
                value={pauseReason}
                onChangeText={setPauseReason}
                placeholder="Enter custom reason..."
                placeholderTextColor={Colors.textLight}
                multiline
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowPauseModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  (!selectedPauseReason && !pauseReason.trim()) && styles.disabledButton
                ]}
                onPress={confirmPauseTimer}
                disabled={!selectedPauseReason && !pauseReason.trim()}
              >
                <Text style={styles.confirmButtonText}>Pause Timer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );

  const renderActivitiesList = () => (
    <View style={styles.activitiesContainer}>
      <View style={styles.activitiesHeader}>
        <Icon name="history" size={20} color={Colors.primary} />
        <Text style={styles.activitiesHeaderText}>Time Tracking Activities</Text>
        <View style={styles.activitiesCount}>
          <Text style={styles.activitiesCountText}>{activities.length}</Text>
        </View>
      </View>

      {activities.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="timer-off" size={48} color={Colors.textLight} />
          <Text style={styles.emptyStateText}>No activities tracked yet</Text>
          <Text style={styles.emptyStateSubtext}>Start a timer to begin tracking</Text>
        </View>
      ) : (
        <ScrollView style={styles.activitiesList} showsVerticalScrollIndicator={false}>
          {activities.map((activity, index) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityHeader}>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>
                    {activity.jobTitle || 'Work Session'}
                  </Text>
                  <Text style={styles.activityTime}>
                    {activity.startTime.toLocaleTimeString()} - {
                      activity.endTime ? activity.endTime.toLocaleTimeString() : 'Running'
                    }
                  </Text>
                </View>
                
                <View style={styles.activityActions}>
                  <View style={[
                    styles.activityStatus,
                    {
                      backgroundColor: 
                        activity.status === 'completed' ? Colors.successLight :
                        activity.status === 'running' ? Colors.primary + '20' :
                        Colors.warningLight
                    }
                  ]}>
                    <Text style={[
                      styles.activityStatusText,
                      {
                        color: 
                          activity.status === 'completed' ? Colors.success :
                          activity.status === 'running' ? Colors.primary :
                          Colors.warning
                      }
                    ]}>
                      {activity.status === 'running' ? 'ACTIVE' : activity.status.toUpperCase()}
                    </Text>
                  </View>
                  
                  {activity.status === 'completed' && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteActivity(activity.id)}
                    >
                      <Icon name="delete" size={18} color={Colors.error} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={styles.activityDetails}>
                <View style={styles.activityDetailItem}>
                  <Icon name="timer" size={16} color={Colors.textSecondary} />
                  <Text style={styles.activityDetailText}>
                    Duration: {formatDuration(activity.status === 'running' ? elapsedTime : activity.elapsedTime)}
                  </Text>
                </View>
                
                {activity.location && (
                  <View style={styles.activityDetailItem}>
                    <Icon name="place" size={16} color={Colors.textSecondary} />
                    <Text style={styles.activityDetailText} numberOfLines={1}>
                      {activity.location}
                    </Text>
                  </View>
                )}
                
                {activity.breaks > 0 && (
                  <View style={styles.activityDetailItem}>
                    <Icon name="coffee" size={16} color={Colors.textSecondary} />
                    <Text style={styles.activityDetailText}>
                      {activity.breaks} break{activity.breaks > 1 ? 's' : ''}
                    </Text>
                  </View>
                )}
                
                {activity.pauseReason && (
                  <View style={styles.activityDetailItem}>
                    <Icon name="pause" size={16} color={Colors.textSecondary} />
                    <Text style={styles.activityDetailText}>
                      {activity.pauseReason}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E293B" />
      {renderHeader()}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTimerDisplay()}
        {renderTimerControls()}
        {renderActivitiesList()}
        
        <View style={{ height: 20 }} />
      </ScrollView>
      
      {renderPauseModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  
  // Header
  header: {
    // backgroundColor: '#1E293B',
    paddingTop: Platform.OS === 'ios' ? 30 : 30,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
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
    color: "#000",
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#000',
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },

  // Timer Display
  timerContainer: {
    marginTop: Spacing.lg,
  },
  timerCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  timerHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  activeIndicator: {
    backgroundColor: Colors.error,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  activeIndicatorText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: 'bold',
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statusIndicator: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    marginTop: Spacing.md,
  },
  statusText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '500',
  },
  jobInfo: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  jobCustomer: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  jobLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
    flex: 1,
  },

  // Controls
  controlsContainer: {
    marginTop: Spacing.lg,
  },
  startButton: {
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    ...Shadows.md,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
    marginLeft: Spacing.sm,
  },
  activeControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  controlButton: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    ...Shadows.md,
  },
  pauseButton: {
    backgroundColor: Colors.warning,
  },
  stopButton: {
    backgroundColor: Colors.error,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
    marginTop: Spacing.xs,
  },

  // Pause Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  pauseModal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.lg,
    maxHeight: screenHeight * 0.8,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  reasonsList: {
    maxHeight: 200,
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.backgroundLight,
    gap: Spacing.md,
  },
  selectedReasonOption: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  reasonText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  selectedReasonText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  customReasonContainer: {
    marginTop: Spacing.lg,
  },
  customReasonLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  customReasonInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.text,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.textLight,
  },
  confirmButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
  },

  // Activities List
  activitiesContainer: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.md,
  },
  activitiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  activitiesHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  activitiesCount: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  activitiesCountText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  activitiesList: {
    maxHeight: 300,
  },
  activityItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: Spacing.md,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  activityActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  activityStatus: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  activityStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  activityDetails: {
    gap: Spacing.xs,
  },
  activityDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  activityDetailText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
});

export default TimerScreen;