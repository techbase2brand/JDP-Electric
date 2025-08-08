import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

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
};

// Embedded Spacing and Dimensions
const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const BorderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
};

const Shadows = {
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
};



const TimeSheetScreen = () => {
  const navigation = useNavigation();
  const [currentEntry, setCurrentEntry] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);

  // useEffect(() => {
  //   StatusBar.setBarStyle('dark-content');
  //   loadTimeEntries();
    
  //   // Timer interval for active entries
  //   const interval = setInterval(() => {
  //     if (currentEntry && currentEntry.status === 'active') {
  //       const now = new Date();
  //       const elapsed = Math.floor((now.getTime() - currentEntry.startTime.getTime()) / 1000);
  //       setElapsedTime(elapsed);
  //     }
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [currentEntry]);

  const loadTimeEntries = () => {
    // Mock data for time entries
    const mockEntries = [
      {
        id: '1',
        jobId: 'job1',
        jobTitle: 'Electrical Panel Upgrade',
        startTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        endTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        totalHours: 3,
        status: 'completed',
        notes: 'Completed main panel installation',
      },
      {
        id: '2',
        jobId: 'job2',
        jobTitle: 'Outlet Installation',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        totalHours: 0,
        status: 'active',
        notes: '',
      },
    ];

    setTimeEntries(mockEntries);
    const activeEntry = mockEntries.find(entry => entry.status === 'active');
    if (activeEntry) {
      setCurrentEntry(activeEntry);
    }
  };

  const startTimer = () => {
    Alert.alert(
      'Start Timer',
      'Select a job to start tracking time',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Select Job',
          onPress: () => {
            // In a real app, this would open job selection
            const newEntry = {
              id: `entry-${Date.now()}`,
              jobId: 'selected-job',
              jobTitle: 'New Job Task',
              startTime: new Date(),
              totalHours: 0,
              status: 'active',
            };
            setCurrentEntry(newEntry);
            setTimeEntries(prev => [...prev, newEntry]);
          },
        },
      ]
    );
  };

  const pauseTimer = () => {
    if (!currentEntry) return;
    
    const updatedEntry = {
      ...currentEntry,
      status: 'paused',
    };
    
    setCurrentEntry(updatedEntry);
    setTimeEntries(prev => 
      prev.map(entry => 
        entry.id === currentEntry.id ? updatedEntry : entry
      )
    );
  };

  const resumeTimer = () => {
    if (!currentEntry) return;
    
    const updatedEntry = {
      ...currentEntry,
      status: 'active',
    };
    
    setCurrentEntry(updatedEntry);
    setTimeEntries(prev => 
      prev.map(entry => 
        entry.id === currentEntry.id ? updatedEntry : entry
      )
    );
  };

  const stopTimer = () => {
    if (!currentEntry) return;

    Alert.alert(
      'Stop Timer',
      'Are you sure you want to stop tracking time for this job?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Stop',
          style: 'destructive',
          onPress: () => {
            const now = new Date();
            const totalHours = Math.floor((now.getTime() - currentEntry.startTime.getTime()) / (1000 * 60 * 60));
            
            const updatedEntry = {
              ...currentEntry,
              endTime: now,
              totalHours,
              status: 'completed',
            };
            
            setTimeEntries(prev => 
              prev.map(entry => 
                entry.id === currentEntry.id ? updatedEntry : entry
              )
            );
            setCurrentEntry(null);
            setElapsedTime(0);
          },
        },
      ]
    );
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalHoursToday = () => {
    const today = new Date().toDateString();
    return timeEntries
      .filter(entry => entry.startTime.toDateString() === today)
      .reduce((total, entry) => total + entry.totalHours, 0);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color={Colors.text} />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Timesheet</Text>
      
      <TouchableOpacity 
        style={styles.historyButton}
        onPress={() => navigation.navigate('TimesheetHistory')}
      >
        <Icon name="history" size={24} color={Colors.text} />
      </TouchableOpacity>
    </View>
  );

  const renderActiveTimer = () => {
    if (!currentEntry) return null;

    return (
      <View style={styles.activeTimerContainer}>
        <Text style={styles.activeJobTitle}>{currentEntry.jobTitle}</Text>
        <Text style={styles.timerDisplay}>{formatTime(elapsedTime)}</Text>
        
        <View style={styles.timerControls}>
          {currentEntry.status === 'active' ? (
            <>
              <TouchableOpacity style={styles.pauseButton} onPress={pauseTimer}>
                <Icon name="pause" size={24} color={Colors.white} />
                <Text style={styles.controlButtonText}>Pause</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.stopButton} onPress={stopTimer}>
                <Icon name="stop" size={24} color={Colors.white} />
                <Text style={styles.controlButtonText}>Stop</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.resumeButton} onPress={resumeTimer}>
                <Icon name="play-arrow" size={24} color={Colors.white} />
                <Text style={styles.controlButtonText}>Resume</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.stopButton} onPress={stopTimer}>
                <Icon name="stop" size={24} color={Colors.white} />
                <Text style={styles.controlButtonText}>Stop</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  const renderStartTimer = () => {
    if (currentEntry) return null;

    return (
      <View style={styles.startTimerContainer}>
        <Icon name="timer" size={80} color={Colors.textLight} />
        <Text style={styles.startTimerTitle}>Ready to track time</Text>
        <Text style={styles.startTimerSubtitle}>
          Start a timer to track time spent on jobs
        </Text>
        
        <TouchableOpacity style={styles.startButton} onPress={startTimer}>
          <Icon name="play-arrow" size={24} color={Colors.white} />
          <Text style={styles.startButtonText}>Start Timer</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTodaysSummary = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>Today's Summary</Text>
      
      <View style={styles.summaryStats}>
        <View style={styles.statCard}>
          <Icon name="schedule" size={24} color={Colors.primary} />
          <Text style={styles.statNumber}>{getTotalHoursToday()}h</Text>
          <Text style={styles.statLabel}>Total Hours</Text>
        </View>
        
        <View style={styles.statCard}>
          <Icon name="work" size={24} color={Colors.success} />
          <Text style={styles.statNumber}>
            {timeEntries.filter(entry => 
              entry.startTime.toDateString() === new Date().toDateString()
            ).length}
          </Text>
          <Text style={styles.statLabel}>Jobs Worked</Text>
        </View>
        
        <View style={styles.statCard}>
          <Icon name="check-circle" size={24} color={Colors.warning} />
          <Text style={styles.statNumber}>
            {timeEntries.filter(entry => 
              entry.status === 'completed' && 
              entry.startTime.toDateString() === new Date().toDateString()
            ).length}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>
    </View>
  );

  const renderRecentEntries = () => (
    <View style={styles.recentContainer}>
      <Text style={styles.sectionTitle}>Recent Entries</Text>
      
      {timeEntries.slice(0, 5).map((entry) => (
        <View key={entry.id} style={styles.entryCard}>
          <View style={styles.entryHeader}>
            <Text style={styles.entryJobTitle}>{entry.jobTitle}</Text>
            <View style={[
              styles.entryStatus,
              { backgroundColor: 
                entry.status === 'active' ? Colors.success :
                entry.status === 'paused' ? Colors.warning :
                Colors.textSecondary
              }
            ]}>
              <Text style={styles.entryStatusText}>{entry.status}</Text>
            </View>
          </View>
          
          <Text style={styles.entryTime}>
            {entry.startTime.toLocaleDateString()} - {entry.totalHours}h
          </Text>
          
          {entry.notes && (
            <Text style={styles.entryNotes}>{entry.notes}</Text>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      
      {renderHeader()}
      
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderActiveTimer()}
        {renderStartTimer()}
        {renderTodaysSummary()}
        {renderRecentEntries()}
      </ScrollView>
    </View>
  );
};

// Embedded Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },

  // Header
  header: {
    backgroundColor: Colors.white,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  historyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Scroll Container
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },

  // Active Timer
  activeTimerContainer: {
    backgroundColor: Colors.white,
    margin: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.md,
  },
  activeJobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  timerDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.xl,
    fontFamily: 'monospace',
  },
  timerControls: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  pauseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  resumeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },

  // Start Timer
  startTimerContainer: {
    backgroundColor: Colors.white,
    margin: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.md,
  },
  startTimerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  startTimerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },

  // Summary
  summaryContainer: {
    backgroundColor: Colors.white,
    margin: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.md,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.xs,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },

  // Recent Entries
  recentContainer: {
    backgroundColor: Colors.white,
    margin: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  entryCard: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  entryJobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  entryStatus: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  entryStatusText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  entryTime: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  entryNotes: {
    fontSize: 14,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
});

export default TimeSheetScreen;