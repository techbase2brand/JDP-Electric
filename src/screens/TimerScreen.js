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
const CustomButton = ({label, onPress, color, disabled, widthbtn}) => (
  <TouchableOpacity
    disabled={disabled}
    style={[
      styles.btn,
      {
        backgroundColor: disabled ? '#ccc' : color,
        width: widthbtn && widthPercentageToDP(40),
      },
    ]}
    onPress={onPress}>
    <Text style={styles.btnText}>{label}</Text>
  </TouchableOpacity>
);
export default function TimerScreen({navigation, route}) {
  const {isRunning, elapsedTime} = useSelector(state => state.timer);
  const token = useSelector(state => state.user?.token);
  const [startISO, setStartISO] = useState(null);
  const [pauseList, setPauseList] = useState([]); // final pauses
  const [currentPauseStartedAt, setCurrentPauseStartedAt] = useState(null);
  const [currentPauseTitle, setCurrentPauseTitle] = useState(null);
  const dispatch = useDispatch();
  const job = route?.params?.job;
  console.log('jobtimerr>>', job);
  const toHHMMSS = ms => {
    const sec = Math.max(0, Math.floor(ms / 1000));
    const h = String(Math.floor(sec / 3600)).padStart(2, '0');
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const buildPayload = ({
    work_activity = 5,
    totalMs = 0,
    pauseList = [],
    startISO,
    endISO,
    isComplete = false,
  }) => ({
    work_activity,
    total_work_time: toHHMMSS(totalMs),
    pause_timer: pauseList, // [{ title, duration(seconds) }]
    start_timer: startISO, // ISO
    end_timer: endISO || new Date(endISO).toISOString(),
    ...(isComplete && {status: 'completed'}),
    // ISO (can be null on mid-session updates)
  });
  const {TimerModule} = NativeModules;

  const startLiveActivity = async elapsed => {
    await TimerModule.startActivity(elapsed);
  };

  const updateLiveActivity = (elapsed, isRunning) => {
    TimerModule.updateActivity(elapsed, isRunning);
  };

  const endLiveActivity = () => {
    TimerModule.endActivity();
  };
  // Activity Log
  const [activityLog, setActivityLog] = useState([]);
  console.log('activityLogactivityLog', activityLog);

  // Modals
  const [pauseModal, setPauseModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);
  // console.log("activityLogactivityLog",activityLog);

  // Pause Handling
  const [pauseReason, setPauseReason] = useState('');
  const [pauseNotes, setPauseNotes] = useState('');
  const [lastPauseTime, setLastPauseTime] = useState(null);

  // Break Tracking
  const [breakTime, setBreakTime] = useState(0);
  const [storedJobId, setStoredJobId] = useState(null);
  const [jobData, setJobdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const jobId = job?.id;
  console.log('jobdatajobdata', jobData);

  // Check AsyncStorage on mount
  useEffect(() => {
    const checkJobId = async () => {
      try {
        const id = await AsyncStorage.getItem('activeJobId');
        if (id) {
          setStoredJobId(id);
          console.log('Found running job in storage:', id);
        }
      } catch (error) {
        console.log('Error reading jobId:', error);
      }
    };
    checkJobId();
    fetchJobDetails();
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
      console.log('viewjob >.', res);

      setJobdata(res?.data);
      let pauses = [];
      if (typeof res?.data?.pause_timer === 'string') {
        try {
          pauses = JSON.parse(res?.data.pause_timer);
        } catch (e) {
          console.error('Failed to parse pause_timer', e);
        }
      } else if (Array.isArray(res?.data?.pause_timer)) {
        pauses = res?.data.pause_timer;
      }

      // ✅ activity log set karo
      setActivityLog(
        pauses.map(p => ({
          title: p.title,
          duration: p.duration, // already formatted string
          time: new Date().toLocaleTimeString(), // local time jab fetch hua
          ...p,
        })),
      );
    } catch (err) {
      setError(err.message || 'Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  };
  // const handleStart = async () => {
  //   await AsyncStorage.setItem(
  //     'activeJobId',
  //     String(job?.id) || String(job?.id),
  //   );
  //   setStoredJobId(job?.job?.id);
  //   dispatch(startTimerWithBackground());
  //   if (TimerModule) {
  //     startLiveActivity(elapsedTime);
  //     console.log('this is working');
  //   }
  //   addActivity('Work Started', {color: '#4CAF50'});
  // };
  const handleStart = async () => {
    await AsyncStorage.setItem('activeJobId', String(job?.id ?? job?.id));
    setStoredJobId(job?.id ?? job?.id);
    const nowISO = new Date().toISOString();
    setStartISO(nowISO);

    dispatch(startTimerWithBackground());
    if (TimerModule) startLiveActivity(elapsedTime);
    addActivity('Work Started', {color: '#4CAF50'});

    // (optional) start snapshot hit
    try {
      const jobIdForApi = job?.id ?? job?.id;
      const payload = buildPayload({
        work_activity: job?.work_activity ?? 5,
        totalMs: elapsedTime,
        pauseList,
        startISO: nowISO,
        endISO: null,
      });
      await updateWorkData(jobIdForApi, payload, token);
      fetchJobDetails();
    } catch (e) {
      console.log(
        'Start snapshot failed (ok to ignore mid-session):',
        e?.message,
      );
    }
  };

  // const handleComplete = async () => {
  //   try {
  //     // remove jobId from AsyncStorage
  //     await AsyncStorage.removeItem('activeJobId');
  //     dispatch(stopTimerWithBackground());
  //     endLiveActivity();
  //     addActivity('Work Completed', {color: '#2196F3'});
  //     setCompleteModal(false);
  //   } catch (err) {
  //     console.log('Error removing jobId', err);
  //   }
  // };

  const handleComplete = async () => {
    try {
      const jobIdForApi = storedJobId ?? job?.id ?? job?.job?.id;
      const end = new Date().toISOString();
      const payload = buildPayload({
        work_activity: job?.work_activity ?? 5,
        totalMs: elapsedTime,
        pauseList, // all finalized pauses
        startISO: startISO ?? new Date().toISOString(),
        endISO: end,
        isComplete: true,
      });

      await updateWorkData(jobIdForApi, payload, token);
      fetchJobDetails();

      await AsyncStorage.removeItem('activeJobId');
      dispatch(stopTimerWithBackground());
      endLiveActivity();
      addActivity('Work Completed', {color: '#2196F3'});
      setCompleteModal(false);
      Alert.alert('Success', 'Work data updated successfully.');
    } catch (err) {
      console.log('Error completing job', err);
      Alert.alert('Error', err?.message || 'Failed to update work data');
    }
  };

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
    // setActivityLog(prev => [
    //   ...prev,
    //   {
    //     title,
    //     duration: elapsedTime,
    //     time: new Date().toLocaleTimeString(),
    //     ...extra,
    //   },
    // ]);
  };

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
      {/* ✅ Time Summary */}
      {/* Timer Card */}jobData
      {/* {!activityLog?.some(item => item.title === 'Work Completed') && ( */}
      {jobData?.status !== 'completed' && (
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

          {/* Start Button */}
          {elapsedTime === 0 && !isRunning && (
            <CustomButton
              label="Start Work"
              color="#4CAF50"
              // onPress={() => {
              //   dispatch(startTimerWithBackground());
              //   addActivity('Work Started', {color: '#4CAF50'});
              // }}
              onPress={handleStart}
              widthbtn={true}
            />
          )}

          {/* Running state */}
          {isRunning && (
            <View style={styles.buttonRow}>
              <CustomButton
                label="Pause"
                color="#FF9800"
                onPress={() => setPauseModal(true)}
                widthbtn={true}
              />
              <CustomButton
                label="Complete"
                color="#F44336"
                onPress={() => setCompleteModal(true)}
                widthbtn={true}
              />
            </View>
          )}
          {/* Paused state */}
          {!isRunning && elapsedTime > 0 && (
            <View style={styles.buttonRow}>
              <CustomButton
                label="Resume"
                color="#4CAF50"
                // onPress={() => {
                //   dispatch(resumeTimerWithBackground());
                //   if (lastPauseTime && pauseReason === 'Break') {
                //     const breakDuration = Date.now() - lastPauseTime;
                //     setBreakTime(prev => prev + breakDuration);
                //     setLastPauseTime(null);
                //   }
                //   addActivity('Work Resumed', {color: '#4CAF50'});
                // }}
                // Resume button onPress
                onPress={async () => {
                  // finalize the current pause
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

                    // ---- API HIT at resume with the finalized pause ----
                    try {
                      const jobIdForApi = storedJobId ?? job?.id ?? job?.id;
                      const payload = buildPayload({
                        work_activity: job?.work_activity ?? 5,
                        totalMs: elapsedTime,
                        pauseList: newList,
                        startISO,
                        endISO: null,
                      });
                      await updateWorkData(jobIdForApi, payload, token);
                      fetchJobDetails();
                    } catch (e) {
                      console.log('Resume snapshot failed:', e?.message);
                    }
                  }
                  dispatch(resumeTimerWithBackground());
                  addActivity('Work Resumed', {color: '#4CAF50'});
                }}
                widthbtn={true}
              />
              <CustomButton
                label="Complete"
                color="#F44336"
                onPress={() => setCompleteModal(true)}
                widthbtn={true}
              />
            </View>
          )}
        </View>
      )}
      {/* {activityLog?.some(item => item.title === 'Work Completed') && ( */}
      {jobData?.status == 'completed' && (
        <View style={styles.timerCard}>
          <Text style={{color: '#2196F3', fontWeight: 'bold'}}>
            Work Completed
          </Text>
        </View>
      )}
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
              <Text style={styles.logTime}>{item.duration}</Text>
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
                onPress={() => {
                  setPauseReason(reason);
                  if (reason === 'Break') setLastPauseTime(Date.now());
                }}>
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
                disabled={!pauseReason}
                // onPress={() => {
                //   if (!pauseReason) return;
                //   dispatch(pauseTimerWithBackground());
                //   addActivity(`Paused - ${pauseReason}`, {
                //     notes: pauseNotes,
                //     color: '#FF9800',
                //   });
                //   setPauseModal(false);
                //   setPauseNotes('');
                // }}
                // Pause Modal -> Confirm Pause button onPress
                onPress={async () => {
                  if (!pauseReason) return;

                  // mark current pause
                  const startedAt = Date.now();
                  setCurrentPauseStartedAt(startedAt);
                  setCurrentPauseTitle(pauseReason);

                  dispatch(pauseTimerWithBackground());
                  addActivity(`Paused - ${pauseReason}`, {
                    notes: pauseNotes,
                    color: '#FF9800',
                  });
                  setPauseModal(false);
                  setPauseNotes('');

                  // ---- API HIT at confirm pause ----
                  try {
                    const jobIdForApi = storedJobId ?? job?.id ?? job?.id;

                    // OPTION A: send placeholder pause (0 sec) so server sees the pause title immediately
                    const placeholder = {
                      title: pauseReason,
                      duration: toHHMMSS(0),
                    };

                    // (we do NOT mutate pauseList state yet— just send a "what server should see now")
                    const payload = buildPayload({
                      work_activity: job?.work_activity ?? 5,
                      totalMs: elapsedTime, // current stored total time
                      pauseList: [...pauseList, placeholder],
                      startISO,
                      endISO: null, // still running overall
                    });

                    await updateWorkData(jobIdForApi, payload, token);
                    fetchJobDetails();
                  } catch (err) {
                    console.log('Confirm pause snapshot failed:', err?.message);

                    // OPTION B fallback: try without placeholder if server rejects duration:0
                    try {
                      const jobIdForApi = storedJobId ?? job?.id ?? job?.id;
                      const payloadNoPlaceholder = buildPayload({
                        work_activity: job?.work_activity ?? 5,
                        totalMs: elapsedTime,
                        pauseList, // no new pause included
                        startISO,
                        endISO: null,
                      });
                      await updateWorkData(
                        jobIdForApi,
                        payloadNoPlaceholder,
                        token,
                      );
                    } catch (e2) {
                      console.log('Fallback also failed:', e2?.message);
                    }
                  }
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
      {/* ✅ Complete Job Modal */}
      <Modal visible={completeModal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 20,
              width: '85%',
            }}>
            {/* Title */}
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                marginBottom: 5,
                color: '#000',
              }}>
              Complete Job
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#555',
                marginBottom: 15,
              }}>
              You are about to complete this job. Please review the time summary
              below before confirming.
            </Text>

            {/* Success Icon */}
            {/* <View
              style={{
                backgroundColor: '#E8F5E9',
                borderRadius: 50,
                padding: 15,
                marginBottom: 10,
              }}>
              <Text style={{fontSize: 28, color: '#4CAF50'}}>✔️</Text>
            </View> */}
            <View style={styles.successIcon}>
              <Icon name="check-circle" size={60} color={'#10B981'} />
            </View>

            {/* Confirmation Text */}
            <Text
              style={{
                textAlign: 'center',
                fontSize: 14,
                color: '#444',
                marginBottom: 15,
              }}>
              Are you sure you want to complete this job? This action cannot be
              undone.
            </Text>

            {/* Summary List */}
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
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                }}>
                <Text style={{fontSize: 14, color: '#000', marginVertical: 2}}>
                  Work Time:
                </Text>
                <Text style={{fontSize: 14, color: '#000', marginVertical: 2}}>
                  {formatTime(elapsedTime)}
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontSize: 14, color: '#000', marginVertical: 2}}>
                  Activities:
                </Text>
                <Text style={{fontSize: 14, color: '#000', marginVertical: 2}}>
                  {activityLog.length}
                </Text>
              </View>
            </View>
            {/* Buttons */}
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
                <Text style={{fontSize: 14, fontWeight: '600'}}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 6,
                  alignItems: 'center',
                  marginHorizontal: 5,
                  backgroundColor: '#4CAF50',
                }}
                onPress={handleComplete}>
                <Text style={{fontSize: 14, fontWeight: '600', color: '#fff'}}>
                  Complete Job
                </Text>
              </TouchableOpacity>
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
    // width: 80,
    // height: 80,
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

  // Summary Card
  summaryCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  summaryTitle: {fontSize: 16, fontWeight: 'bold'},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between'},
  summaryBox: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  summaryTime: {fontSize: 18, fontWeight: 'bold'},

  // Timer Card
  timerCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {fontSize: 40, fontWeight: 'bold', color: '#1565C0'},
  statusText: {fontSize: 16, color: '#777', marginBottom: 10},

  // Buttons
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 4,
    // width: widthPercentageToDP(40),
    alignItems: 'center',
  },
  btnText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
  },

  // Log Card
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

  // Modal
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
  modalDesc: {fontSize: 14, color: '#555', marginBottom: 15},
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
  summaryList: {marginBottom: 20},
});
