import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Alert, StatusBar,
  ScrollView, Modal, KeyboardAvoidingView, TextInput, Platform,
  StyleSheet,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import Colors from '../constants/Colors'; // adjust path
// import styles from '../styles/TimerStyles'; // extract styles into its own file if needed
import { AppState } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');


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

const TimerComponent = ({ currentJob }) => {
  const navigation = useNavigation();

  // Timer state
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [currentLocation, setCurrentLocation] = useState('');
  const [breakCount, setBreakCount] = useState(0);
  const [activities, setActivities] = useState([]);
  const [currentActivityId, setCurrentActivityId] = useState(null);

  // Pause modal state
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pauseReason, setPauseReason] = useState('');
  const [selectedPauseReason, setSelectedPauseReason] = useState('');

  const appState = useRef(AppState.currentState);
  const timerRef = useRef(null);

  // Pause reasons
  const pauseReasons = [
    { id: 'break', label: 'Taking a break', icon: 'coffee' },
    { id: 'lunch', label: 'Lunch break', icon: 'restaurant' },
    { id: 'meeting', label: 'Meeting/Call', icon: 'call' },
    // { id: 'materials', label: 'Getting materials', icon: 'build' },
    // { id: 'travel', label: 'Travel time', icon: 'directions-car' },
    // { id: 'other', label: 'Other reason', icon: 'more-horiz' }
  ];

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('#1E293B');
    loadActivities();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, isPaused]);

  const handleAppStateChange = (nextAppState) => {
    appState.current = nextAppState;
  };

  const loadActivities = () => {
    setActivities([]);
  };

  const getCurrentLocation = () => {
    setCurrentLocation(currentJob?.location?.address || 'Manual location');
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0
      ? `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const checkForActiveTimer = () =>
    activities.some(a => a.status === 'running' || a.status === 'paused') || isRunning;

  const handleStartTimer = () => {
    if (checkForActiveTimer()) {
      Alert.alert('Active Timer Found', 'Only one timer can be active.');
      return;
    }
    const now = new Date();
    const id = `activity-${Date.now()}`;
    setStartTime(now);
    setIsRunning(true);
    setIsPaused(false);
    setElapsedTime(0);
    setBreakCount(0);
    setCurrentActivityId(id);
    getCurrentLocation();
    setActivities(prev => [
      { id, jobId: currentJob?.id, jobTitle: currentJob?.title, startTime: now, elapsedTime: 0, status: 'running', location: currentLocation, breaks: 0 },
      ...prev
    ]);
  };

  const handlePauseTimer = () => {
    if (isRunning && !isPaused) setShowPauseModal(true);
    else if (isPaused) {
      setIsPaused(false);
      updateCurrentActivity({ status: 'running' });
    }
  };

  const confirmPauseTimer = () => {
    const reason = selectedPauseReason || pauseReason || 'No reason';
    setIsPaused(true);
    setShowPauseModal(false);
    if (reason.includes('break')) setBreakCount(prev => prev + 1);
    updateCurrentActivity({ status: 'paused', pauseReason: reason, breaks: breakCount + 1 });
    setSelectedPauseReason('');
    setPauseReason('');
  };

  const handleStopTimer = () => {
    Alert.alert('Stop Timer', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Stop', style: 'destructive', onPress: confirmStopTimer }
    ]);
  };

  const confirmStopTimer = () => {
    const now = new Date();
    setIsRunning(false);
    setIsPaused(false);
    updateCurrentActivity({ endTime: now, elapsedTime, status: 'completed', breaks: breakCount });
    setElapsedTime(0);
    setStartTime(null);
    setCurrentActivityId(null);
    setBreakCount(0);
  };

  const updateCurrentActivity = (updates) => {
    setActivities(prev => prev.map(a => a.id === currentActivityId ? { ...a, ...updates } : a));
  };

  return (
    <View style={styles.container}>
      {/* Timer UI */}
      <View style={styles.timerDisplay}>
        <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
        {!isRunning ? (
          <TouchableOpacity style={styles.startButton} onPress={handleStartTimer}>
            <Text style={styles.startButtonText}>Start Work</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.pauseButton} onPress={handlePauseTimer}>
              <Text style={styles.controlButtonText}>{isPaused ? 'Resume' : 'Pause'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.stopButton} onPress={handleStopTimer}>
              <Text style={styles.controlButtonText}>Stop</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Pause modal */}
      <Modal visible={showPauseModal} transparent>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={{ backgroundColor: 'white', padding: 20 }}>
            <Text>Pause Reason</Text>
            <ScrollView>
              {pauseReasons.map(r => (
                <TouchableOpacity key={r.id} onPress={() => setSelectedPauseReason(r.id)}>
                  <Text>{r.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TextInput placeholder="Custom reason" value={pauseReason} onChangeText={setPauseReason} />
            <TouchableOpacity onPress={confirmPauseTimer}><Text>Confirm</Text></TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
export default TimerComponent;
