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

// ---------- Persist helpers for reliable start/end ----------
const startKeyFor = (jobId, day) => `job:${jobId}:startISO:${day}`;

const storeStartISO = async (jobId, iso) => {
  const key = startKeyFor(jobId, fmtDate(new Date()));
  await AsyncStorage.setItem(key, iso);
};

const readPersistedStartISO = async (jobId, dateStr) => {
  const key = startKeyFor(jobId, dateStr);
  return AsyncStorage.getItem(key);
};

const clearPersistedStartISO = async jobId => {
  const key = startKeyFor(jobId, fmtDate(new Date()));
  await AsyncStorage.removeItem(key);
};

// Convert "YYYY-MM-DD" + "HH:MM:SS" to ISO (local tz → ISO)
const makeISOFromDateTimeLocal = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;
  const [hh = '00', mm = '00', ss = '00'] = timeStr.split(':');
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return null;
  const dt = new Date(y, m - 1, d, Number(hh), Number(mm), Number(ss || 0));
  return dt.toISOString();
};
// -----------------------------------------------------------

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

  // Modals
  const [pauseModal, setPauseModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);

  // Pause modal inputs
  const [pauseReason, setPauseReason] = useState('');
  const [pauseNotes, setPauseNotes] = useState('');

  // Loading
  const [startLoading, setStartLoading] = useState(false);
  const [pauseConfirmLoading, setPauseConfirmLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);

  // Job data
  const [storedJobId, setStoredJobId] = useState(null);
  const [jobData, setJobdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uiLoading, setUiLoading] = useState(true);

  useEffect(() => {
    let t;
    if (!loading) {
      t = setTimeout(() => setUiLoading(false), 2500);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [loading]);

  const {TimerModule} = NativeModules;

  const startLiveActivity = async elapsed => {
    try {
      await TimerModule?.startActivity?.(elapsed);
    } catch (e) {}
  };
  const updateLiveActivity = (elapsed, running) => {
    try {
      TimerModule?.updateActivity?.(elapsed, running);
    } catch (e) {}
  };
  const endLiveActivity = () => {
    try {
      TimerModule?.endActivity?.();
    } catch (e) {}
  };

  // ---------- Payload builder (uses reliable start/end) ----------
  const buildLaborTimesheetPayload = ({
    totalMs = 0,
    pauseList = [],
    startISO,
    endISO,
    markCompleted = false,
  }) => {
    const now = new Date();
    const dateStr = fmtDate(now);
    const startDate = startISO ? new Date(startISO) : now;
    const startT = fmtTime(startDate);
    const endT = endISO ? fmtTime(new Date(endISO)) : null;
    const toSeconds = ms => Math.max(0, Math.floor(ms / 1000));

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
        work_activity: toSeconds(totalMs),
        pause_timer: pauseList.map(p => ({
          title: p.title,
          duration: p.duration,
        })),
        ...(markCompleted ? {job_status: 'completed'} : {}),
      },
    };
  };
  // --------------------------------------------------------------

  const computeSummaries = timesheets => {
    const todayStr = fmtDate(new Date());
    const all = timesheets.map(ts => ({
      date: ts?.date,
      start: ts?.start_time || '--:--:--',
      end: ts?.job_status === 'completed' ? ts?.end_time || '--:--:--' : null,
      totalSec: Number(ts?.work_activity || 0),
    }));
    const todayTs = timesheets.filter(ts => ts?.date === todayStr);
    const lastToday = todayTs[todayTs.length - 1];
    const todaySum = lastToday
      ? {
          start: lastToday?.start_time || '--:--:--',
          end:
            lastToday?.job_status === 'completed'
              ? lastToday?.end_time || '--:--:--'
              : null,
          totalSec: Number(lastToday?.work_activity || 0),
        }
      : null;
    setAllSummaries(all);
  };

  const addActivity = (title, extra = {}) => {
    setActivityLog(prev => [
      ...prev,
      {
        title,
        time: new Date().toLocaleTimeString(),
        ...extra,
      },
    ]);
  };

  // Init: get activeJobId, job details, restore startISO
  useEffect(() => {
    const init = async () => {
      try {
        const id = await AsyncStorage.getItem('activeJobId');
        if (id) setStoredJobId(id);
      } catch {}
      await fetchJobDetails();

      if (jobId) {
        const persisted = await readPersistedStartISO(
          jobId,
          fmtDate(new Date()),
        );
        if (persisted) {
          setStartISO(persisted);
        } else {
          // Fallback: reconstruct from today's last timesheet if exists
          const ft =
            (jobData?.labor_timesheets || []).filter(
              item =>
                item.labor_id === user?.labor?.[0]?.id ||
                item.lead_labor_id === user?.leadLabor?.[0]?.id,
            ) || [];
          const today = fmtDate(new Date());
          const todaySheets = ft.filter(t => t?.date === today);
          if (todaySheets?.length) {
            const last = todaySheets[todaySheets.length - 1];
            const reconstructed = makeISOFromDateTimeLocal(
              last?.date,
              last?.start_time,
            );
            if (reconstructed) {
              setStartISO(reconstructed);
              await storeStartISO(jobId, reconstructed);
            }
          }
        }
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        updateLiveActivity(elapsedTime, isRunning);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [elapsedTime, isRunning]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const res = await getJobById(jobId, token);
      const data = res?.data || {};
      setJobdata(data);

      const laborTimesheets = data?.labor_timesheets || [];
      const filteredTimesheets = laborTimesheets.filter(
        item =>
          item.labor_id === user?.labor?.[0]?.id ||
          item.lead_labor_id === user?.leadLabor?.[0]?.id,
      );

      computeSummaries(filteredTimesheets);

      if (filteredTimesheets.length > 0) {
        const allPauseTimers = filteredTimesheets
          .map(item => item.pause_timer || [])
          .flat();
        setActivityLog(allPauseTimers || []);

        const today = fmtDate(new Date());
        const todayTimesheets = filteredTimesheets.filter(
          item => item.date === today,
        );
        const todayPauseTimers = todayTimesheets
          .map(item => item.pause_timer || [])
          .flat();
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

  // Ensure reliable startISO for any API write
  const getStartISOForWrite = async () => {
    const today = fmtDate(new Date());
    if (startISO) return startISO;

    const persisted = jobId ? await readPersistedStartISO(jobId, today) : null;
    if (persisted) {
      setStartISO(persisted);
      return persisted;
    }

    const filteredTimesheets =
      (jobData?.labor_timesheets || []).filter(
        item =>
          item.labor_id === user?.labor?.[0]?.id ||
          item.lead_labor_id === user?.leadLabor?.[0]?.id,
      ) || [];
    const todaySheets = filteredTimesheets.filter(t => t?.date === today);
    if (todaySheets.length) {
      const last = todaySheets[todaySheets.length - 1];
      const reconstructed = makeISOFromDateTimeLocal(
        last?.date,
        last?.start_time,
      );
      if (reconstructed) {
        setStartISO(reconstructed);
        if (jobId) await storeStartISO(jobId, reconstructed);
        return reconstructed;
      }
    }

    const nowISO = new Date().toISOString();
    if (jobId) await storeStartISO(jobId, nowISO);
    setStartISO(nowISO);
    return nowISO;
  };

  const handleStart = async () => {
    try {
      setStartLoading(true);
      await AsyncStorage.setItem('activeJobId', String(job?.id ?? jobId));
      setStoredJobId(job?.id ?? jobId);

      const nowISO = new Date().toISOString();
      setStartISO(nowISO);
      if (jobId) await storeStartISO(jobId, nowISO);

      dispatch(startTimerWithBackground());
      startLiveActivity(elapsedTime);

      const jobIdForApi = job?.id ?? jobId;
      const payload = buildLaborTimesheetPayload({
        totalMs: elapsedTime,
        pauseList,
        startISO: nowISO,
        endISO: null,
        markCompleted: false,
      });
      await updateWorkData(jobIdForApi, payload, token);
      fetchJobDetails();
    } catch (e) {
      console.log('Start failed:', e?.message);
    } finally {
      setStartLoading(false);
    }
  };

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

      const placeholder = {title: pauseReason, duration: toHHMMSS(0)};
      const jobIdForApi = storedJobId ?? job?.id ?? jobId;
      const reliableStartISO = await getStartISOForWrite();

      const payload = buildLaborTimesheetPayload({
        totalMs: elapsedTime,
        pauseList: [...pauseList, placeholder],
        startISO: reliableStartISO,
        endISO: null,
      });
      await updateWorkData(jobIdForApi, payload, token);
      fetchJobDetails();
    } catch (err) {
      console.log('Confirm pause failed:', err?.message);
    } finally {
      setPauseConfirmLoading(false);
    }
  };

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
        const newList = [...pauseList, finalItem];
        setPauseList(newList);
        setCurrentPauseStartedAt(null);
        setCurrentPauseTitle(null);

        const jobIdForApi = storedJobId ?? job?.id ?? jobId;
        const reliableStartISO = await getStartISOForWrite();

        const payload = buildLaborTimesheetPayload({
          totalMs: elapsedTime,
          pauseList: newList,
          startISO: reliableStartISO,
          endISO: null,
        });
        await updateWorkData(jobIdForApi, payload, token);
        fetchJobDetails();
      }

      dispatch(resumeTimerWithBackground());
    } catch (e) {
      console.log('Resume failed:', e?.message);
    } finally {
      setResumeLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      setCompleteLoading(true);
      const jobIdForApi = storedJobId ?? job?.id ?? jobId;

      const reliableStartISO = await getStartISOForWrite();
      const endISO = new Date().toISOString();

      const payload = buildLaborTimesheetPayload({
        totalMs: elapsedTime,
        pauseList,
        startISO: reliableStartISO,
        endISO,
        markCompleted: true,
      });

      await updateWorkData(jobIdForApi, payload, token);
      fetchJobDetails();

      await AsyncStorage.removeItem('activeJobId');
      if (jobId) await clearPersistedStartISO(jobId);

      dispatch(stopTimerWithBackground());
      endLiveActivity();
      setCompleteModal(false);
      Alert.alert('Success', 'Work data updated successfully.');
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

  const lastTimesheet = filteredTimesheets[filteredTimesheets.length - 1];

  const isTodayCompleted =
    lastTimesheet?.job_status == 'completed' && lastTimesheet?.date == today;

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
          {!isTodayCompleted && (
            <View style={styles.timerCard}>
              <View
                style={{
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

          {lastActivityLog?.length > 0 && (
            <View style={[styles.logCard, {marginBottom: 20}]}>
              <Text style={styles.sectionTitle}>Today's Activity Log</Text>
              <FlatList
                data={lastActivityLog}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({item}) => (
                  <View style={styles.logItem}>
                    <Text
                      style={[styles.logTitle, {color: item.color || '#333'}]}>
                      {item.title}
                    </Text>
                    <Text style={styles.logTime}>
                      {item.duration ?? item.time ?? '--:--:--'}
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

          <View style={styles.logCard}>
            <Text style={styles.sectionTitle}>All Activity Log</Text>
            <FlatList
              data={activityLog}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({item}) => (
                <View style={styles.logItem}>
                  <Text
                    style={[styles.logTitle, {color: item.color || '#333'}]}>
                    {item.title}
                  </Text>
                  <Text style={styles.logTime}>
                    {item.duration ?? item.time ?? '--:--:--'}
                  </Text>
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
                ].map(reason => (
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
