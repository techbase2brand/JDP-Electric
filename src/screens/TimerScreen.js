// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Modal,
//   TextInput,
//   FlatList,
//   TouchableOpacity,
//   Platform,
//   NativeModules,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import {useDispatch, useSelector} from 'react-redux';
// import {
//   startTimerWithBackground,
//   pauseTimerWithBackground,
//   resumeTimerWithBackground,
//   stopTimerWithBackground,
// } from '../redux/timerSlice';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import Feather from 'react-native-vector-icons/Feather';
// import {widthPercentageToDP} from '../utils';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {getJobById, updateWorkData} from '../config/apiConfig';

// const pad2 = n => String(n).padStart(2, '0');
// const toHHMMSS = ms => {
//   const sec = Math.max(0, Math.floor(ms / 1000));
//   const h = pad2(Math.floor(sec / 3600));
//   const m = pad2(Math.floor((sec % 3600) / 60));
//   const s = pad2(sec % 60);
//   return `${h}:${m}:${s}`;
// };
// const fmtDate = (d = new Date()) => {
//   const y = d.getFullYear();
//   const m = pad2(d.getMonth() + 1);
//   const day = pad2(d.getDate());
//   return `${y}-${m}-${day}`;
// };
// const fmtTime = (d = new Date()) => {
//   return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(
//     d.getSeconds(),
//   )}`;
// };

// const CustomButton = ({label, onPress, color, disabled, widthbtn, loading}) => (
//   <TouchableOpacity
//     disabled={disabled || loading}
//     style={[
//       styles.btn,
//       {
//         backgroundColor: disabled || loading ? '#ccc' : color,
//         width: widthbtn && widthPercentageToDP(40),
//       },
//     ]}
//     onPress={onPress}>
//     <Text style={styles.btnText}>{loading ? 'Please wait…' : label}</Text>
//   </TouchableOpacity>
// );

// export default function TimerScreen({navigation, route}) {
//   const {isRunning, elapsedTime} = useSelector(state => state.timer);
//   const token = useSelector(state => state.user?.token);
//   const user = useSelector(state => state.user?.user);
//   const dispatch = useDispatch();
//   // const {jobId} = route.params || {};

//   useEffect(() => {
//     console.log('Received jobId:', route?.params?.jobId);
//   }, [route?.params?.jobId]);
//   const job = route?.params?.job;

//   const jobId = job?.id || route?.params?.jobId;
//   console.log('usseer', jobId, route?.params?.jobId);
//   const [startISO, setStartISO] = useState(null);
//   const [pauseList, setPauseList] = useState([]);
//   const [currentPauseStartedAt, setCurrentPauseStartedAt] = useState(null);
//   const [currentPauseTitle, setCurrentPauseTitle] = useState(null);
//   const [allSummaries, setAllSummaries] = useState([]);
//   console.log('allSummariesallSummariesallSummaries ', allSummaries);

//   const [activityLog, setActivityLog] = useState([]);
//   const [lastActivityLog, setLastActivityLog] = useState([]);

//   // Modals
//   const [pauseModal, setPauseModal] = useState(false);
//   const [completeModal, setCompleteModal] = useState(false);

//   // Pause modal inputs
//   const [pauseReason, setPauseReason] = useState('');
//   const [pauseNotes, setPauseNotes] = useState('');

//   // Loading
//   const [startLoading, setStartLoading] = useState(false);
//   const [pauseConfirmLoading, setPauseConfirmLoading] = useState(false);
//   const [resumeLoading, setResumeLoading] = useState(false);
//   const [completeLoading, setCompleteLoading] = useState(false);

//   // Job data
//   const [storedJobId, setStoredJobId] = useState(null);
//   const [jobData, setJobdata] = useState(null);
//   const [loading, setLoading] = useState(true); // screen load
//   const [error, setError] = useState(null);
//   console.log('jobDatajobDatajobData', jobData, lastActivityLog);
//   const [uiLoading, setUiLoading] = useState(true);

//   useEffect(() => {
//     let t; // declare outside so cleanup can access it

//     if (!loading) {
//       t = setTimeout(() => setUiLoading(false), 2500);
//     }

//     return () => {
//       if (t) clearTimeout(t);
//     };
//   }, [loading]);
//   const {TimerModule} = NativeModules;

//   const startLiveActivity = async elapsed => {
//     try {
//       await TimerModule?.startActivity?.(elapsed);
//     } catch (e) {}
//   };
//   const updateLiveActivity = (elapsed, running) => {
//     try {
//       TimerModule?.updateActivity?.(elapsed, running);
//     } catch (e) {
//       //
//     }
//   };
//   const endLiveActivity = () => {
//     try {
//       TimerModule?.endActivity?.();
//     } catch (e) {
//       //
//     }
//   };

//   const buildLaborTimesheetPayload = ({
//     totalMs = 0,
//     pauseList = [],
//     startISO,
//     endISO, // optional
//     markCompleted = false,
//   }) => {
//     const now = new Date();
//     const dateStr = fmtDate(now);
//     const startT = startISO ? fmtTime(new Date(startISO)) : fmtTime(now);
//     const endT = endISO ? fmtTime(new Date(endISO)) : null;
//     const toSeconds = ms => Math.max(0, Math.floor(ms / 1000));
//     let payload_id = {
//       labor_id:
//         user?.management_type !== 'lead_labor'
//           ? user?.labor?.[0]?.id
//           : undefined,
//       lead_labor_id:
//         user?.management_type === 'lead_labor'
//           ? user?.leadLabor?.[0]?.id
//           : undefined,
//     };

//     Object.keys(payload_id).forEach(
//       key => payload_id[key] === undefined && delete payload_id[key],
//     );
//     return {
//       labor_timesheet: {
//         ...payload_id,
//         date: dateStr,
//         start_time: startT,
//         ...(endT ? {end_time: endT} : {}),
//         work_activity: toSeconds(totalMs),
//         pause_timer: pauseList.map(p => ({
//           title: p.title,
//           duration: p.duration, // "HH:MM:SS"
//         })),
//         ...(markCompleted ? {job_status: 'completed'} : {}),
//       },
//     };
//   };
//   const computeSummaries = timesheets => {
//     const todayStr = fmtDate(new Date());
//     const all = timesheets.map(ts => ({
//       date: ts?.date,
//       start: ts?.start_time || '--:--:--',
//       end: ts?.job_status === 'completed' ? ts?.end_time || '--:--:--' : null,
//       totalSec: Number(ts?.work_activity || 0),
//     }));

//     const todayTs = timesheets.filter(ts => ts?.date === todayStr);
//     const lastToday = todayTs[todayTs.length - 1];
//     const todaySum = lastToday
//       ? {
//           start: lastToday?.start_time || '--:--:--',
//           end:
//             lastToday?.job_status === 'completed'
//               ? lastToday?.end_time || '--:--:--'
//               : null,
//           totalSec: Number(lastToday?.work_activity || 0),
//         }
//       : null;

//     setAllSummaries(all);
//   };
//   const addActivity = (title, extra = {}) => {
//     setActivityLog(prev => [
//       ...prev,
//       {
//         title,
//         time: new Date().toLocaleTimeString(),
//         ...extra,
//       },
//     ]);
//   };

//   useEffect(() => {
//     const checkJobId = async () => {
//       try {
//         const id = await AsyncStorage.getItem('activeJobId');
//         if (id) setStoredJobId(id);
//       } catch (err) {}
//     };
//     checkJobId();
//     fetchJobDetails();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (isRunning) {
//       const interval = setInterval(() => {
//         updateLiveActivity(elapsedTime, isRunning);
//       }, 1000);
//       return () => clearInterval(interval);
//     }
//   }, [elapsedTime, isRunning]);

//   // console.log("user?.labor?.[0]?.id",user?.labor?.[0]?.id);
//   // const fetchJobDetails = async () => {
//   //   try {
//   //     setLoading(true);
//   //     const res = await getJobById(jobId, token);
//   //     const data = res?.data || {};
//   //     setJobdata(data);

//   //     const laborTimesheets = data?.labor_timesheets || [];

//   //     const filteredTimesheets = laborTimesheets.filter(
//   //       item =>
//   //         item.labor_id === user?.labor?.[0]?.id ||
//   //         item.lead_labor_id === user?.leadLabor?.[0]?.id,
//   //     );
//   //     console.log('filteredTimesheetsfilteredTimesheets', filteredTimesheets);

//   //     if (filteredTimesheets.length > 0) {
//   //       const allPauseTimers = filteredTimesheets
//   //         .slice(0, -1) // last element exclude
//   //         .map(item => item.pause_timer || [])
//   //         .flat();

//   //       setActivityLog(allPauseTimers || []);

//   //       const lastPauseTimer =
//   //         filteredTimesheets[filteredTimesheets.length - 1]?.pause_timer || [];
//   //       console.log('lastPauseTimerlastPauseTimer', lastPauseTimer);

//   //       setLastActivityLog(lastPauseTimer);
//   //     } else {
//   //       setActivityLog([]);
//   //       setLastActivityLog([]);
//   //     }
//   //   } catch (err) {
//   //     setError(err?.message || 'Failed to fetch job details');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const fetchJobDetails = async () => {
//     try {
//       setLoading(true);
//       const res = await getJobById(jobId, token);
//       const data = res?.data || {};
//       setJobdata(data);

//       const laborTimesheets = data?.labor_timesheets || [];

//       const filteredTimesheets = laborTimesheets.filter(
//         item =>
//           item.labor_id === user?.labor?.[0]?.id ||
//           item.lead_labor_id === user?.leadLabor?.[0]?.id,
//       );

//       console.log('filteredTimesheets:', filteredTimesheets);
//       computeSummaries(filteredTimesheets);
//       if (filteredTimesheets.length > 0) {
//         //  Collect all pause timers
//         const allPauseTimers = filteredTimesheets
//           .map(item => item.pause_timer || [])
//           .flat();

//         //  Set all (including old) activity logs
//         setActivityLog(allPauseTimers || []);

//         const today = new Date().toISOString().split('T')[0]; // e.g. "2025-10-09"

//         //  Find only today's timesheets
//         const todayTimesheets = filteredTimesheets.filter(
//           item => item.date === today,
//         );

//         //  Combine today's pause timers
//         const todayPauseTimers = todayTimesheets
//           .map(item => item.pause_timer || [])
//           .flat();

//         setLastActivityLog(todayPauseTimers || []);

//         console.log(' All Logs:', allPauseTimers);
//         console.log(' Today Logs:', todayPauseTimers);
//       } else {
//         setActivityLog([]);
//         setLastActivityLog([]);
//       }
//     } catch (err) {
//       setError(err?.message || 'Failed to fetch job details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStart = async () => {
//     try {
//       setStartLoading(true);
//       await AsyncStorage.setItem('activeJobId', String(job?.id ?? job?.id));
//       setStoredJobId(job?.id ?? job?.id);

//       const nowISO = new Date().toISOString();
//       setStartISO(nowISO);

//       dispatch(startTimerWithBackground());
//       startLiveActivity(elapsedTime);
//       // addActivity('Work Started', {color: '#4CAF50'});

//       // snapshot to API
//       const jobIdForApi = job?.id ?? job?.id;
//       const payload = buildLaborTimesheetPayload({
//         totalMs: elapsedTime,
//         pauseList,
//         startISO: nowISO,
//         endISO: null,
//         markCompleted: false,
//       });
//       await updateWorkData(jobIdForApi, payload, token);
//       fetchJobDetails();
//     } catch (e) {
//       console.log('Start failed:', e?.message);
//     } finally {
//       setStartLoading(false);
//     }
//   };

//   const handleConfirmPause = async () => {
//     if (!pauseReason) return;
//     try {
//       setPauseConfirmLoading(true);

//       const startedAt = Date.now();
//       setCurrentPauseStartedAt(startedAt);
//       setCurrentPauseTitle(pauseReason);

//       dispatch(pauseTimerWithBackground());
//       // addActivity(`Paused - ${pauseReason}`, {
//       //   notes: pauseNotes,
//       //   color: '#FF9800',
//       // });
//       setPauseModal(false);
//       setPauseNotes('');

//       // send placeholder pause so BE sees it immediately
//       const placeholder = {title: pauseReason, duration: toHHMMSS(0)};
//       const jobIdForApi = storedJobId ?? job?.id ?? job?.id;
//       const payload = buildLaborTimesheetPayload({
//         totalMs: elapsedTime,
//         pauseList: [...pauseList, placeholder],
//         startISO,
//         endISO: null,
//       });
//       await updateWorkData(jobIdForApi, payload, token);
//       fetchJobDetails();
//     } catch (err) {
//       console.log('Confirm pause failed:', err?.message);
//     } finally {
//       setPauseConfirmLoading(false);
//     }
//   };

//   const handleResume = async () => {
//     try {
//       setResumeLoading(true);

//       if (currentPauseStartedAt && currentPauseTitle) {
//         const durSec = Math.max(
//           1,
//           Math.floor((Date.now() - currentPauseStartedAt) / 1000),
//         );
//         const finalItem = {
//           title: currentPauseTitle,
//           duration: toHHMMSS(durSec * 1000),
//         };
//         const newList = [...pauseList, finalItem];
//         setPauseList(newList);
//         setCurrentPauseStartedAt(null);
//         setCurrentPauseTitle(null);

//         const jobIdForApi = storedJobId ?? job?.id ?? job?.id;
//         const payload = buildLaborTimesheetPayload({
//           totalMs: elapsedTime,
//           pauseList: newList,
//           startISO,
//           endISO: null,
//         });
//         await updateWorkData(jobIdForApi, payload, token);
//         fetchJobDetails();
//       }

//       dispatch(resumeTimerWithBackground());
//       // addActivity('Work Resumed', {color: '#4CAF50'});
//     } catch (e) {
//       console.log('Resume failed:', e?.message);
//     } finally {
//       setResumeLoading(false);
//     }
//   };

//   const handleComplete = async () => {
//     try {
//       setCompleteLoading(true);
//       const jobIdForApi = storedJobId ?? job?.id ?? job?.job?.id;
//       const end = new Date().toISOString();

//       const payload = buildLaborTimesheetPayload({
//         totalMs: elapsedTime,
//         pauseList,
//         startISO: startISO ?? new Date().toISOString(),
//         endISO: end,
//         markCompleted: true, // today_time_status: "completed"
//       });

//       await updateWorkData(jobIdForApi, payload, token);
//       fetchJobDetails();

//       await AsyncStorage.removeItem('activeJobId');
//       dispatch(stopTimerWithBackground());
//       endLiveActivity();
//       // addActivity('Work Completed', {color: '#2196F3'});
//       setCompleteModal(false);
//       Alert.alert('Success', 'Work data updated successfully.');
//     } catch (err) {
//       console.log('Error completing job', err);
//       Alert.alert('Error', err?.message || 'Failed to update work data');
//     } finally {
//       setCompleteLoading(false);
//     }
//   };

//   const formatTime = ms => {
//     const sec = Math.floor(ms / 1000);
//     const h = Math.floor(sec / 3600);
//     const m = Math.floor((sec % 3600) / 60);
//     const s = sec % 60;
//     return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
//   };

//   const today = fmtDate(new Date());

//   // const lastTimesheet =
//   //   jobData?.labor_timesheets?.[jobData?.labor_timesheets?.length - 1];

//   // const isTodayCompleted =
//   //   lastTimesheet?.job_status === 'completed' && lastTimesheet?.date === today;
//   const filteredTimesheets =
//     jobData?.labor_timesheets?.filter(
//       item =>
//         item.labor_id === user?.labor?.[0]?.id ||
//         item.lead_labor_id === user?.leadLabor?.[0]?.id,
//     ) || [];

//   const lastTimesheet = filteredTimesheets[filteredTimesheets.length - 1];

//   const isTodayCompleted =
//     lastTimesheet?.job_status == 'completed' && lastTimesheet?.date == today;
//   console.log('isTodayCompletedisTodayCompleted', isTodayCompleted);
//   const renderHeader = () => (
//     <View style={styles.header}>
//       <TouchableOpacity
//         style={styles.backButton}
//         onPress={() => navigation.goBack()}>
//         <Icon name="arrow-back" size={24} color={'#000'} />
//       </TouchableOpacity>

//       <View style={styles.headerContent}>
//         <Text style={styles.headerTitle}>Work Timer</Text>
//         <Text style={styles.headerSubtitle}>
//           {new Date().toLocaleDateString('en-US', {
//             weekday: 'short',
//             month: 'short',
//             day: 'numeric',
//           })}
//         </Text>
//       </View>
//       <View style={styles.headerSpacer} />
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {renderHeader()}
//       {uiLoading ? (
//         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//           <ActivityIndicator size="large" color="#1565C0" />
//           <Text style={{marginTop: 10, fontSize: 16, color: '#555'}}>
//             Loading job details...
//           </Text>
//         </View>
//       ) : (
//         <>
//           {/* Timer Card */}
//           {!isTodayCompleted && (
//             <View style={styles.timerCard}>
//               <View
//                 style={{
//                   display: 'flex',
//                   flexDirection: 'row',
//                   alignItems: 'flex-end',
//                   marginBottom: 20,
//                   gap: 6,
//                 }}>
//                 <Icon name="timer" size={20} color="#000" />
//                 <Text style={styles.summaryTitle}>Time Summary</Text>
//               </View>

//               <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
//               <Text style={styles.statusText}>
//                 {isRunning ? 'Running' : 'Paused'}
//               </Text>

//               {/* Start */}
//               {elapsedTime === 0 && !isRunning && (
//                 <CustomButton
//                   label="Start Work"
//                   color="#4CAF50"
//                   onPress={handleStart}
//                   widthbtn={true}
//                   loading={startLoading}
//                   disabled={startLoading}
//                 />
//               )}

//               {/* Running */}
//               {isRunning && (
//                 <View style={styles.buttonRow}>
//                   <CustomButton
//                     label="Pause"
//                     color="#FF9800"
//                     onPress={() => setPauseModal(true)}
//                     widthbtn={true}
//                     loading={false}
//                   />
//                   <CustomButton
//                     label="Complete"
//                     color="#F44336"
//                     onPress={() => setCompleteModal(true)}
//                     widthbtn={true}
//                     loading={completeLoading}
//                     disabled={completeLoading}
//                   />
//                 </View>
//               )}

//               {/* Paused after start */}
//               {!isRunning && elapsedTime > 0 && (
//                 <View style={styles.buttonRow}>
//                   <CustomButton
//                     label="Resume"
//                     color="#4CAF50"
//                     onPress={handleResume}
//                     widthbtn={true}
//                     loading={resumeLoading}
//                     disabled={resumeLoading}
//                   />
//                   <CustomButton
//                     label="Complete"
//                     color="#F44336"
//                     onPress={() => setCompleteModal(true)}
//                     widthbtn={true}
//                     loading={completeLoading}
//                     disabled={completeLoading}
//                   />
//                 </View>
//               )}
//             </View>
//           )}

//           {/* Completed banner for today */}
//           {isTodayCompleted && (
//             <View style={styles.timerCard}>
//               <Text style={{color: '#2196F3', fontWeight: 'bold'}}>
//                 Today Completed
//               </Text>
//               <Text style={{marginTop: 6, color: '#666', fontSize: 12}}>
//                 Timer will be available after next day.
//               </Text>
//             </View>
//           )}
//           {/* today Activity Log */}
//           {lastActivityLog?.length > 0 && (
//             <View style={[styles.logCard, {marginBottom: 20}]}>
//               <Text style={styles.sectionTitle}>Today's Activity Log</Text>
//               <FlatList
//                 data={lastActivityLog}
//                 keyExtractor={(_, index) => index.toString()}
//                 renderItem={({item}) => (
//                   <View style={styles.logItem}>
//                     <Text
//                       style={[styles.logTitle, {color: item.color || '#333'}]}>
//                       {item.title}
//                     </Text>
//                     <Text style={styles.logTime}>
//                       {item.duration ?? item.time ?? '--:--:--'}
//                     </Text>
//                   </View>
//                 )}
//                 ListEmptyComponent={() => (
//                   <View style={{alignItems: 'center', padding: 20}}>
//                     <Feather name="activity" size={40} color="#9ca3af" />
//                     <Text
//                       style={{marginTop: 10, fontSize: 16, color: '#6b7280'}}>
//                       No activity found
//                     </Text>
//                   </View>
//                 )}
//               />
//             </View>
//           )}
//           {/* Activity Log */}
//           <View style={styles.logCard}>
//             <Text style={styles.sectionTitle}>All Activity Log</Text>
//             <FlatList
//               data={activityLog}
//               keyExtractor={(_, index) => index.toString()}
//               renderItem={({item}) => (
//                 <View style={styles.logItem}>
//                   <Text
//                     style={[styles.logTitle, {color: item.color || '#333'}]}>
//                     {item.title}
//                   </Text>
//                   <Text style={styles.logTime}>
//                     {item.duration ?? item.time ?? '--:--:--'}
//                   </Text>
//                 </View>
//               )}
//               ListEmptyComponent={() => (
//                 <View style={{alignItems: 'center', padding: 20}}>
//                   <Feather name="activity" size={40} color="#9ca3af" />
//                   <Text style={{marginTop: 10, fontSize: 16, color: '#6b7280'}}>
//                     No activity found
//                   </Text>
//                 </View>
//               )}
//             />
//           </View>

//           {/* Pause Modal */}
//           <Modal visible={pauseModal} transparent animationType="fade">
//             <View style={styles.modalOverlay}>
//               <View style={styles.modalContent}>
//                 <Text style={styles.modalTitle}>Pause Timer</Text>
//                 <Text>Select a reason:</Text>
//                 {[
//                   'Lunch Break',
//                   'Material Pickup',
//                   'Customer Meeting',
//                   'Equipment Issue',
//                   'Weather Delay',
//                   'Waiting for Parts',
//                   'Safety Break',
//                   'Other',
//                 ]?.map(reason => (
//                   <TouchableOpacity
//                     key={reason}
//                     style={[
//                       styles.reasonBtn,
//                       pauseReason === reason && {backgroundColor: '#1565C0'},
//                     ]}
//                     onPress={() => setPauseReason(reason)}>
//                     <Text
//                       style={[
//                         styles.reasonText,
//                         pauseReason === reason && {color: '#fff'},
//                       ]}>
//                       {reason}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}

//                 <TextInput
//                   style={styles.input}
//                   placeholder="Additional notes..."
//                   value={pauseNotes}
//                   onChangeText={setPauseNotes}
//                 />

//                 <View style={styles.modalBtnRow}>
//                   <CustomButton
//                     label="Cancel"
//                     color="#9E9E9E"
//                     onPress={() => {
//                       setPauseModal(false);
//                       setPauseReason('');
//                       setPauseNotes('');
//                     }}
//                   />
//                   <CustomButton
//                     label="Confirm Pause"
//                     color="#1565C0"
//                     disabled={!pauseReason}
//                     loading={pauseConfirmLoading}
//                     onPress={handleConfirmPause}
//                   />
//                 </View>
//               </View>
//             </View>
//           </Modal>

//           {/* Complete Job Modal */}
//           <Modal visible={completeModal} transparent animationType="fade">
//             <View style={styles.modalOverlay}>
//               <View style={[styles.modalContent, {width: '85%'}]}>
//                 <Text
//                   style={{
//                     fontSize: 18,
//                     fontWeight: '600',
//                     marginBottom: 5,
//                     color: '#000',
//                   }}>
//                   Complete Job
//                 </Text>
//                 <Text style={{fontSize: 14, color: '#555', marginBottom: 15}}>
//                   You are about to complete this job. Please review the time
//                   summary below before confirming.
//                 </Text>

//                 <View style={styles.successIcon}>
//                   <Icon name="check-circle" size={60} color={'#10B981'} />
//                 </View>

//                 <Text
//                   style={{
//                     textAlign: 'center',
//                     fontSize: 14,
//                     color: '#444',
//                     marginBottom: 15,
//                   }}>
//                   Are you sure you want to complete this job? This action cannot
//                   be undone.
//                 </Text>

//                 <View
//                   style={{
//                     backgroundColor: '#F5F5F5',
//                     borderRadius: 8,
//                     padding: 10,
//                     width: '100%',
//                     marginBottom: 20,
//                   }}>
//                   <View
//                     style={{
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       marginVertical: 10,
//                     }}>
//                     <Text
//                       style={{fontSize: 14, color: '#000', marginVertical: 2}}>
//                       Work Time:
//                     </Text>
//                     <Text
//                       style={{fontSize: 14, color: '#000', marginVertical: 2}}>
//                       {toHHMMSS(elapsedTime)}
//                     </Text>
//                   </View>
//                   <View
//                     style={{
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                     }}>
//                     <Text
//                       style={{fontSize: 14, color: '#000', marginVertical: 2}}>
//                       Activities:
//                     </Text>
//                     <Text
//                       style={{fontSize: 14, color: '#000', marginVertical: 2}}>
//                       {activityLog.length}
//                     </Text>
//                   </View>
//                 </View>

//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     justifyContent: 'space-between',
//                     width: '100%',
//                   }}>
//                   <TouchableOpacity
//                     style={{
//                       flex: 1,
//                       paddingVertical: 10,
//                       borderRadius: 6,
//                       alignItems: 'center',
//                       marginHorizontal: 5,
//                       backgroundColor: '#E0E0E0',
//                     }}
//                     onPress={() => setCompleteModal(false)}>
//                     <Text style={{fontSize: 14, fontWeight: '600'}}>
//                       Cancel
//                     </Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     style={{
//                       flex: 1,
//                       paddingVertical: 10,
//                       borderRadius: 6,
//                       alignItems: 'center',
//                       marginHorizontal: 5,
//                       backgroundColor: '#4CAF50',
//                       opacity: completeLoading ? 0.7 : 1,
//                     }}
//                     disabled={completeLoading}
//                     onPress={handleComplete}>
//                     <Text
//                       style={{fontSize: 14, fontWeight: '600', color: '#fff'}}>
//                       {completeLoading ? 'Please wait…' : 'Complete Job'}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           </Modal>
//         </>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: '#F4F6FA', padding: 20},
//   header: {
//     paddingTop: Platform.OS === 'ios' ? 10 : 10,
//     paddingBottom: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   successIcon: {
//     borderRadius: 40,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   headerContent: {alignItems: 'center'},
//   headerTitle: {fontSize: 18, fontWeight: 'bold', color: '#000'},
//   headerSubtitle: {fontSize: 14, color: '#000', marginTop: 2},
//   headerSpacer: {width: 40},

//   summaryTitle: {fontSize: 16, fontWeight: 'bold'},

//   timerCard: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   timerText: {fontSize: 40, fontWeight: 'bold', color: '#1565C0'},
//   statusText: {fontSize: 16, color: '#777', marginBottom: 10},

//   btn: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginVertical: 4,
//     alignItems: 'center',
//   },
//   btnText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//     width: '100%',
//   },

//   logCard: {backgroundColor: '#fff', padding: 15, borderRadius: 12},
//   sectionTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
//   logItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   logTitle: {fontSize: 16, color: '#333'},
//   logTime: {fontSize: 16, fontWeight: 'bold', color: '#1565C0'},

//   modalOverlay: {
//     flex: 1,
//     backgroundColor: '#00000088',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 12,
//     width: '85%',
//   },
//   modalTitle: {fontSize: 20, fontWeight: 'bold', marginBottom: 10},
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   reasonBtn: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     marginVertical: 4,
//   },
//   reasonText: {color: '#333'},
//   modalBtnRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 15,
//   },
// });

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  FlatList,
  TouchableOpacity,
  Platform,
  NativeModules,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  startTimerWithBackground,
  pauseTimerWithBackground,
  resumeTimerWithBackground,
  stopTimerWithBackground,
} from '../redux/timerSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import {widthPercentageToDP} from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getJobById, updateWorkData} from '../config/apiConfig';

const pad2 = n => String(n).padStart(2, '0');
const toHHMMSS = ms => {
  const sec = Math.max(0, Math.floor(ms / 1000));
  const h = pad2(Math.floor(sec / 3600));
  const m = pad2(Math.floor((sec % 3600) / 60));
  const s = pad2(sec % 60);
  return `${h}:${m}:${s}`;
};
const fmtDate = (d = new Date()) => {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
};
const fmtTime = (d = new Date()) =>
  `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;

const CustomButton = ({label, onPress, color, disabled, widthbtn, loading}) => (
  <TouchableOpacity
    disabled={disabled || loading}
    style={[
      styles.btn,
      {
        backgroundColor: disabled || loading ? '#ccc' : color,
        width: widthbtn && widthPercentageToDP(40),
      },
    ]}
    onPress={onPress}>
    <Text style={styles.btnText}>{loading ? 'Please wait…' : label}</Text>
  </TouchableOpacity>
);

export default function TimerScreen({navigation, route}) {
  const {isRunning, elapsedTime} = useSelector(state => state.timer);
  const token = useSelector(state => state.user?.token);
  const user = useSelector(state => state.user?.user);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Received jobId:', route?.params?.jobId);
  }, [route?.params?.jobId]);
  const job = route?.params?.job;
  const jobId = job?.id || route?.params?.jobId;

  const [startISO, setStartISO] = useState(null);
  const [pauseList, setPauseList] = useState([]);
  const [currentPauseStartedAt, setCurrentPauseStartedAt] = useState(null);
  const [currentPauseTitle, setCurrentPauseTitle] = useState(null);

  const [allSummaries, setAllSummaries] = useState([]);

  const [activityLog, setActivityLog] = useState([]);
  const [lastActivityLog, setLastActivityLog] = useState([]);
  const [lastTodayActivityLog, setTodayActivityLog] = useState([]);

  // Modals
  const [pauseModal, setPauseModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);

  // Pause modal inputs
  const [pauseReason, setPauseReason] = useState('');
  const [pauseNotes, setPauseNotes] = useState('');

  // Loading flags
  const [startLoading, setStartLoading] = useState(false);
  const [pauseConfirmLoading, setPauseConfirmLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [storedJobId, setStoredJobId] = useState(null);
  const [jobData, setJobdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uiLoading, setUiLoading] = useState(true);

  const {TimerModule} = NativeModules;

  // ---------- 🔧 Helpers: local buffer (no rename of existing vars) ----------
  const LS_KEYS = {
    start: 'ts_buffer_startISO',
    pauses: 'ts_buffer_pauseList',
    elapsedOnResume: 'ts_buffer_elapsedOnResume', // snapshot when resume happens
    pending: 'ts_buffer_pending',
    jobId: 'ts_buffer_jobId',
  };
  // 🔧 Buffer se today's activity nikaalo (pauses list)
  const loadTodayActivityFromBuffer = async () => {
    try {
      const todayStr = fmtDate(new Date());
      // agar session aaj start hua hai tabhi show karna
      const bStartISO = await AsyncStorage.getItem('ts_buffer_startISO');
      if (!bStartISO) return []; // koi local running session nahi

      const startDate = fmtDate(new Date(bStartISO));
      if (startDate !== todayStr) return []; // aaj ka session nahi

      const bPausesRaw = await AsyncStorage.getItem('ts_buffer_pauseList');
      const bPauses = bPausesRaw ? JSON.parse(bPausesRaw) : [];

      // shape normalize (UI me item.title + item.duration chahiye)
      const normalized = (bPauses || []).map(p => ({
        title: p.title,
        duration: p.duration || '00:00:00',
      }));

      return normalized;
    } catch (e) {
      return [];
    }
  };

  const bufferSet = async (k, v) => {
    try {
      await AsyncStorage.setItem(
        k,
        typeof v === 'string' ? v : JSON.stringify(v),
      );
    } catch {}
  };
  const bufferGet = async (k, isJSON = true) => {
    try {
      const v = await AsyncStorage.getItem(k);
      if (!isJSON) return v;
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  };
  const bufferDel = async k => {
    try {
      await AsyncStorage.removeItem(k);
    } catch {}
  };

  const enqueuePending = async payload => {
    try {
      const arr = (await bufferGet(LS_KEYS.pending)) || [];
      arr.push(payload);
      await bufferSet(LS_KEYS.pending, arr);
    } catch {}
  };

  const tryFlushPending = async () => {
    // net check simple: just try sending; fail => keep
    const arr = (await bufferGet(LS_KEYS.pending)) || [];
    if (!arr.length) return;

    const jid = (await bufferGet(LS_KEYS.jobId, false)) || jobId;
    for (let i = 0; i < arr.length; i++) {
      try {
        await updateWorkData(jid, arr[i], token);
        // remove sent one
        const fresh = (await bufferGet(LS_KEYS.pending)) || [];
        fresh.shift();
        await bufferSet(LS_KEYS.pending, fresh);
      } catch (e) {
        // stop on first failure, will retry later
        break;
      }
    }
  };

  // ---------- Native Live Activity ----------
  const startLiveActivity = async elapsed => {
    try {
      await TimerModule?.startActivity?.(elapsed);
    } catch {}
  };
  const updateLiveActivity = (elapsed, running) => {
    try {
      TimerModule?.updateActivity?.(elapsed, running);
    } catch {}
  };
  const endLiveActivity = () => {
    try {
      TimerModule?.endActivity?.();
    } catch {}
  };

  // ---------- Build payload (UNCHANGED signature) ----------
  // const buildLaborTimesheetPayload = ({
  //   totalMs = 0,
  //   pauseList = [],
  //   startISO,
  //   endISO, // optional
  //   markCompleted = false,
  // }) => {
  //   const now = new Date();
  //   const dateStr = fmtDate(now);
  //   const startT = startISO ? fmtTime(new Date(startISO)) : fmtTime(now);
  //   const endT = endISO ? fmtTime(new Date(endISO)) : null;
  //   const toSeconds = ms => Math.max(0, Math.floor(ms / 1000));
  //   let payload_id = {
  //     labor_id:
  //       user?.management_type !== 'lead_labor'
  //         ? user?.labor?.[0]?.id
  //         : undefined,
  //     lead_labor_id:
  //       user?.management_type === 'lead_labor'
  //         ? user?.leadLabor?.[0]?.id
  //         : undefined,
  //   };
  //   Object.keys(payload_id).forEach(
  //     key => payload_id[key] === undefined && delete payload_id[key],
  //   );
  //   return {
  //     labor_timesheet: {
  //       ...payload_id,
  //       date: dateStr,
  //       start_time: startT,
  //       ...(endT ? {end_time: endT} : {}),
  //       work_activity: toSeconds(totalMs),
  //       pause_timer: pauseList.map(p => ({
  //         title: p.title,
  //         duration: p.duration, // "HH:MM:SS"
  //       })),
  //       ...(markCompleted ? {job_status: 'completed'} : {}),
  //     },
  //   };
  // };
  const buildLaborTimesheetPayload = ({
    totalMs = 0,
    pauseList = [],
    startISO,
    endISO, // optional
    markCompleted = false,
  }) => {
    const now = new Date();
    const dateStr = fmtDate(now);
    const startT = startISO ? fmtTime(new Date(startISO)) : fmtTime(now);
    const endT = endISO ? fmtTime(new Date(endISO)) : null;

    // ✅ Convert milliseconds to HH:MM:SS
    const formatDuration = ms => {
      const totalSeconds = Math.floor(ms / 1000);
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
        2,
        '0',
      );
      const seconds = String(totalSeconds % 60).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    };

    let payload_id = {
      labor_id:
        user?.management_type !== 'lead_labor'
          ? user?.labor?.[0]?.id
          : undefined,
      lead_labor_id:
        user?.management_type === 'lead_labor'
          ? user?.leadLabor?.[0]?.id
          : undefined,
    };

    Object.keys(payload_id).forEach(
      key => payload_id[key] === undefined && delete payload_id[key],
    );

    return {
      labor_timesheet: {
        ...payload_id,
        date: dateStr,
        start_time: startT,
        ...(endT ? {end_time: endT} : {}),
        work_activity: formatDuration(totalMs), // ✅ Now in HH:MM:SS format
        pause_timer: pauseList.map(p => ({
          title: p.title,
          duration: p.duration, // already "HH:MM:SS"
        })),
        ...(markCompleted ? {job_status: 'completed'} : {}),
      },
    };
  };

  // ---------- Summaries for All Activity Log (API) ----------
  const computeSummaries = timesheets => {
    // keep entire history
    const all = timesheets.map(ts => ({
      start: ts?.start_time || '--:--:--',
      end: ts?.job_status === 'completed' ? ts?.end_time || '--:--:--' : null,
      totalSec: ts?.work_activity || 0,
      date: ts?.date || '',
    }));
    setAllSummaries(all);
  };

  useEffect(() => {
    let t;
    if (!loading) t = setTimeout(() => setUiLoading(false), 2500);
    return () => {
      if (t) clearTimeout(t);
    };
  }, [loading]);

  // On mount: load any buffered session
  useEffect(() => {
    const boot = async () => {
      try {
        const id = await AsyncStorage.getItem('activeJobId');
        if (id) setStoredJobId(id);

        // restore buffered session if any
        const bStart = await bufferGet(LS_KEYS.start, false);
        const bPauses = await bufferGet(LS_KEYS.pauses);
        if (bStart) setStartISO(bStart);
        if (bPauses) setPauseList(bPauses);

        await bufferSet(LS_KEYS.jobId, String(jobId || ''));
        await tryFlushPending(); // in case something was pending
      } catch {}
      fetchJobDetails();
    };
    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const getData = async () => {
      const bufferToday = await loadTodayActivityFromBuffer();

      if (bufferToday) {
        setTodayActivityLog(bufferToday || []);
      }
    };
    getData();
  }, [lastTodayActivityLog]);

  // Keep live activity updating each second
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(
        () => updateLiveActivity(elapsedTime, isRunning),
        1000,
      );
      return () => clearInterval(interval);
    }
  }, [elapsedTime, isRunning]);

  // ---------- Fetch job details (date compare fixed) ----------
  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const res = await getJobById(jobId, token);
      const data = res?.data || {};
      setJobdata(data);
      console.log('datadata>>', data);

      const laborTimesheets = data?.labor_timesheets || [];
      const filteredTimesheets = laborTimesheets.filter(
        item =>
          item.labor_id === user?.labor?.[0]?.id ||
          item.lead_labor_id === user?.leadLabor?.[0]?.id,
      );

      computeSummaries(filteredTimesheets);

      if (filteredTimesheets.length > 0) {
        // today's date using same format as BE: yyyy-mm-dd
        const today = fmtDate(new Date());

        const todayTimesheets = filteredTimesheets.filter(
          item => item.date === today,
        );

        const todayPauseTimers = todayTimesheets
          .map(item => item.pause_timer || [])
          .flat();

        // Show *today's* pauses separately (lastActivityLog) and all pauses (activityLog)
        const allPauseTimers = filteredTimesheets
          .map(item => item.pause_timer || [])
          .flat();

        setActivityLog(allPauseTimers || []);
        setLastActivityLog(todayPauseTimers || []);
      } else {
        setActivityLog([]);
        setLastActivityLog([]);
      }
    } catch (err) {
      setError(err?.message || 'Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  };

  // ---------- START ----------
  const handleStart = async () => {
    try {
      setStartLoading(true);
      await AsyncStorage.setItem('activeJobId', String(job?.id ?? job?.id));
      setStoredJobId(job?.id ?? job?.id);

      const nowISO = new Date().toISOString();
      setStartISO(nowISO);

      //  buffer only; do not hit API yet
      await bufferSet(LS_KEYS.start, nowISO);
      await bufferSet(LS_KEYS.pauses, []);
      await bufferSet(LS_KEYS.pending, []);

      dispatch(startTimerWithBackground());
      await startLiveActivity(elapsedTime);
      updateLiveActivity(elapsedTime, true);
    } catch (e) {
      console.log('Start failed:', e?.message);
    } finally {
      setStartLoading(false);
    }
  };

  // ---------- PAUSE CONFIRM ----------
  const handleConfirmPause = async () => {
    if (!pauseReason) return;
    try {
      setPauseConfirmLoading(true);

      const startedAt = Date.now();
      setCurrentPauseStartedAt(startedAt);
      setCurrentPauseTitle(pauseReason);

      dispatch(pauseTimerWithBackground());
      setPauseModal(false);
      setPauseNotes('');

      // placeholder duration 00:00:00 will be converted on resume
      const placeholder = {title: pauseReason, duration: toHHMMSS(0)};
      const cached = (await bufferGet(LS_KEYS.pauses)) || [];
      const newPauses = [...cached, placeholder];
      setPauseList(newPauses);
      await bufferSet(LS_KEYS.pauses, newPauses);
      await bufferSet(LS_KEYS.elapsedOnResume, elapsedTime);
    } catch (err) {
      console.log('Confirm pause failed:', err?.message);
    } finally {
      setPauseConfirmLoading(false);
    }
  };

  // ---------- RESUME ----------
  const handleResume = async () => {
    try {
      setResumeLoading(true);
      if (currentPauseStartedAt && currentPauseTitle) {
        const durSec = Math.max(
          1,
          Math.floor((Date.now() - currentPauseStartedAt) / 1000),
        );
        const finalItem = {
          title: currentPauseTitle,
          duration: toHHMMSS(durSec * 1000),
        };

        const cached = (await bufferGet(LS_KEYS.pauses)) || [];
        // replace last placeholder (same title & 00:00:00) with finalItem
        let replaced = false;
        const newList = cached.map((p, i, arr) => {
          if (
            !replaced &&
            p.title === currentPauseTitle &&
            p.duration === '00:00:00'
          ) {
            replaced = true;
            return finalItem;
          }
          return p;
        });
        if (!replaced) newList.push(finalItem);
        setPauseList(newList);
        await bufferSet(LS_KEYS.pauses, newList);

        setCurrentPauseStartedAt(null);
        setCurrentPauseTitle(null);
      }
      dispatch(resumeTimerWithBackground());
    } catch (e) {
      console.log('Resume failed:', e?.message);
    } finally {
      setResumeLoading(false);
    }
  };
  // ---------- COMPLETE ----------
  const handleComplete = async () => {
    try {
      setCompleteLoading(true);
      const jobIdForApi = storedJobId ?? job?.id ?? job?.job?.id;
      const end = new Date().toISOString();

      //  USE BUFFERED START (never override) to avoid start=end bug
      const persistedStart =
        (await bufferGet(LS_KEYS.start, false)) ||
        startISO ||
        new Date().toISOString();
      const bufferedPauses = (await bufferGet(LS_KEYS.pauses)) || pauseList;

      const payload = buildLaborTimesheetPayload({
        totalMs: elapsedTime,
        pauseList: bufferedPauses,
        startISO: persistedStart,
        endISO: end,
        markCompleted: true,
      });

      //  single-hit strategy + offline queue
      try {
        await updateWorkData(jobIdForApi, payload, token);
      } catch (e) {
        await enqueuePending(payload);
      }

      await tryFlushPending(); // try once more

      // Clean up buffers after completion
      await AsyncStorage.removeItem('activeJobId');
      await bufferDel(LS_KEYS.start);
      await bufferDel(LS_KEYS.pauses);
      await bufferDel(LS_KEYS.elapsedOnResume);
      await bufferDel(LS_KEYS.pending);
      await bufferDel(LS_KEYS.jobId);

      dispatch(stopTimerWithBackground());
      endLiveActivity();
      setCompleteModal(false);
      Alert.alert('Success', 'Work data updated successfully.');
      fetchJobDetails();
    } catch (err) {
      console.log('Error completing job', err);
      Alert.alert('Error', err?.message || 'Failed to update work data');
    } finally {
      setCompleteLoading(false);
    }
  };

  const formatTime = ms => {
    const sec = Math.floor(ms / 1000);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
  };

  const today = fmtDate(new Date());
  const filteredTimesheets =
    jobData?.labor_timesheets?.filter(
      item =>
        item.labor_id === user?.labor?.[0]?.id ||
        item.lead_labor_id === user?.leadLabor?.[0]?.id,
    ) || [];
  const lastTimesheet = filteredTimesheets[0];

  const isTodayCompleted =
    lastTimesheet?.job_status == 'completed' && lastTimesheet?.date == today;

  console.log(
    'lastTimesheetlastTimesheet,lastTimesheet',
    lastTimesheet,
    isTodayCompleted,filteredTimesheets
  );
  const renderHeader = () => (
    <View style={styles.header}>0
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

  return (
    <View style={styles.container}>
      {renderHeader()}
      {uiLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#1565C0" />
          <Text style={{marginTop: 10, fontSize: 16, color: '#555'}}>
            Loading job details...
          </Text>
        </View>
      ) : (
        <>
          {/* Timer Card */}
          {!isTodayCompleted && (
            <View style={styles.timerCard}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  marginBottom: 20,
                  gap: 6,
                }}>
                <Icon name="timer" size={20} color="#000" />
                <Text style={styles.summaryTitle}>Time Summary</Text>
              </View>

              <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
              <Text style={styles.statusText}>
                {isRunning ? 'Running' : 'Paused'}
              </Text>

              {elapsedTime === 0 && !isRunning && (
                <CustomButton
                  label="Start Work"
                  color="#4CAF50"
                  onPress={handleStart}
                  widthbtn={true}
                  loading={startLoading}
                  disabled={startLoading}
                />
              )}

              {isRunning && (
                <View style={styles.buttonRow}>
                  <CustomButton
                    label="Pause"
                    color="#FF9800"
                    onPress={() => setPauseModal(true)}
                    widthbtn={true}
                    loading={false}
                  />
                  <CustomButton
                    label="Complete"
                    color="#F44336"
                    onPress={() => setCompleteModal(true)}
                    widthbtn={true}
                    loading={completeLoading}
                    disabled={completeLoading}
                  />
                </View>
              )}

              {!isRunning && elapsedTime > 0 && (
                <View style={styles.buttonRow}>
                  <CustomButton
                    label="Resume"
                    color="#4CAF50"
                    onPress={handleResume}
                    widthbtn={true}
                    loading={resumeLoading}
                    disabled={resumeLoading}
                  />
                  <CustomButton
                    label="Complete"
                    color="#F44336"
                    onPress={() => setCompleteModal(true)}
                    widthbtn={true}
                    loading={completeLoading}
                    disabled={completeLoading}
                  />
                </View>
              )}
            </View>
          )}

          {/* Completed banner for today */}
          {isTodayCompleted && (
            <View style={styles.timerCard}>
              <Text style={{color: '#2196F3', fontWeight: 'bold'}}>
                Today Completed
              </Text>
              <Text style={{marginTop: 6, color: '#666', fontSize: 12}}>
                Timer will be available after next day.
              </Text>
            </View>
          )}

          {/* Today's Activity Log (pauses only) */}
          {(lastActivityLog?.length > 0 ||
            lastTodayActivityLog?.length > 0) && (
            <View style={[styles.logCard, {marginBottom: 20}]}>
              <Text style={styles.sectionTitle}>Today's Activity Log</Text>
              <FlatList
                data={
                  lastActivityLog?.length > 0
                    ? lastActivityLog
                    : lastTodayActivityLog
                }
                keyExtractor={(_, index) => index.toString()}
                renderItem={({item}) => (
                  <View style={styles.logItem}>
                    <Text
                      style={[styles.logTitle, {color: item.color || '#333'}]}>
                      {item?.title}
                    </Text>
                    <Text style={styles.logTime}>
                      {item?.duration ?? item?.time ?? '--:--:--'}
                    </Text>
                  </View>
                )}
                ListEmptyComponent={() => (
                  <View style={{alignItems: 'center', padding: 20}}>
                    <Feather name="activity" size={40} color="#9ca3af" />
                    <Text
                      style={{marginTop: 10, fontSize: 16, color: '#6b7280'}}>
                      No activity found
                    </Text>
                  </View>
                )}
              />
            </View>
          )}

          {/* 🔧 All Activity Log — now shows start, end, total from API */}
          <View style={styles.logCard}>
            <Text style={styles.sectionTitle}>All Activity Log</Text>
            <FlatList
              data={allSummaries}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({item}) => (
                <View style={styles.logItem}>
                  <View style={{flex: 1}}>
                    <Text style={[styles.logTitle]}>
                      Date: {item.date || '--'}
                    </Text>
                    <Text style={[styles.logTitle, {marginTop: 10}]}>
                      Start: {item.start || '--:--:--'}
                    </Text>
                  </View>
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.logTitle}>
                      End: {item.end ?? '--:--:--'}
                    </Text>
                    <Text style={[styles.logTime, {marginTop: 10}]}>
                      Total: {item.totalSec}
                    </Text>
                  </View>
                </View>
              )}
              ListEmptyComponent={() => (
                <View style={{alignItems: 'center', padding: 20}}>
                  <Feather name="activity" size={40} color="#9ca3af" />
                  <Text style={{marginTop: 10, fontSize: 16, color: '#6b7280'}}>
                    No activity found
                  </Text>
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
                {[
                  'Lunch Break',
                  'Material Pickup',
                  'Customer Meeting',
                  'Equipment Issue',
                  'Weather Delay',
                  'Waiting for Parts',
                  'Safety Break',
                  'Other',
                ]?.map(reason => (
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
                    onPress={() => {
                      setPauseModal(false);
                      setPauseReason('');
                      setPauseNotes('');
                    }}
                  />
                  <CustomButton
                    label="Confirm Pause"
                    color="#1565C0"
                    disabled={!pauseReason}
                    loading={pauseConfirmLoading}
                    onPress={handleConfirmPause}
                  />
                </View>
              </View>
            </View>
          </Modal>

          {/* Complete Job Modal */}
          <Modal visible={completeModal} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, {width: '85%'}]}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    marginBottom: 5,
                    color: '#000',
                  }}>
                  Complete Job
                </Text>
                <Text style={{fontSize: 14, color: '#555', marginBottom: 15}}>
                  You are about to complete this job. Please review the time
                  summary below before confirming.
                </Text>

                <View style={styles.successIcon}>
                  <Icon name="check-circle" size={60} color={'#10B981'} />
                </View>

                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 14,
                    color: '#444',
                    marginBottom: 15,
                  }}>
                  Are you sure you want to complete this job? This action cannot
                  be undone.
                </Text>

                <View
                  style={{
                    backgroundColor: '#F5F5F5',
                    borderRadius: 8,
                    padding: 10,
                    width: '100%',
                    marginBottom: 20,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginVertical: 10,
                    }}>
                    <Text
                      style={{fontSize: 14, color: '#000', marginVertical: 2}}>
                      Work Time:
                    </Text>
                    <Text
                      style={{fontSize: 14, color: '#000', marginVertical: 2}}>
                      {toHHMMSS(elapsedTime)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{fontSize: 14, color: '#000', marginVertical: 2}}>
                      Activities:
                    </Text>
                    <Text
                      style={{fontSize: 14, color: '#000', marginVertical: 2}}>
                      {activityLog.length}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 6,
                      alignItems: 'center',
                      marginHorizontal: 5,
                      backgroundColor: '#E0E0E0',
                    }}
                    onPress={() => setCompleteModal(false)}>
                    <Text style={{fontSize: 14, fontWeight: '600'}}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 6,
                      alignItems: 'center',
                      marginHorizontal: 5,
                      backgroundColor: '#4CAF50',
                      opacity: completeLoading ? 0.7 : 1,
                    }}
                    disabled={completeLoading}
                    onPress={handleComplete}>
                    <Text
                      style={{fontSize: 14, fontWeight: '600', color: '#fff'}}>
                      {completeLoading ? 'Please wait…' : 'Complete Job'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F4F6FA', padding: 20},
  header: {
    paddingTop: Platform.OS === 'ios' ? 10 : 10,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerContent: {alignItems: 'center'},
  headerTitle: {fontSize: 18, fontWeight: 'bold', color: '#000'},
  headerSubtitle: {fontSize: 14, color: '#000', marginTop: 2},
  headerSpacer: {width: 40},
  summaryTitle: {fontSize: 16, fontWeight: 'bold'},
  timerCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {fontSize: 40, fontWeight: 'bold', color: '#1565C0'},
  statusText: {fontSize: 16, color: '#777', marginBottom: 10},
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
  modalTitle: {fontSize: 20, fontWeight: 'bold', marginBottom: 10},
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
