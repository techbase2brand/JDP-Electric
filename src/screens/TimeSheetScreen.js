import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';

const TimeSheetScreen = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [selectedJob, setSelectedJob] = useState('');
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakSeconds, setBreakSeconds] = useState(0);
  const [location, setLocation] = useState('Houston, TX');
  const [gpsStatus, setGpsStatus] = useState('Connected');

  const jobs = [
    { id: 'JOB-001', title: 'Electrical Panel Upgrade' },
    { id: 'JOB-002', title: 'Commercial Lighting Installation' },
    { id: 'JOB-003', title: 'Emergency Generator Maintenance' },
  ];

  const timeEntries = [
    { id: 1, job: 'JOB-001', duration: '2h 30m', date: 'Today 08:00' },
    { id: 2, job: 'JOB-002', duration: '1h 45m', date: 'Today 11:00' },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && !isPaused && !isOnBreak) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    } else if (isOnBreak && isRunning) {
      interval = setInterval(() => {
        setBreakSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused, isOnBreak]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!selectedJob) {
      Alert.alert('Select Job', 'Please select a job before starting the timer');
      return;
    }
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    Alert.alert(
      'Stop Timer',
      'Are you sure you want to stop the timer and save this time entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Stop & Save', 
          onPress: () => {
            setIsRunning(false);
            setIsPaused(false);
            setIsOnBreak(false);
            setSeconds(0);
            setBreakSeconds(0);
            Alert.alert('Success', 'Time entry saved successfully!');
          }
        },
      ]
    );
  };

  const handleBreak = () => {
    if (isOnBreak) {
      setIsOnBreak(false);
      setBreakSeconds(0);
    } else {
      setIsOnBreak(true);
    }
  };

  const renderJobSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Select Job</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.jobSelector}>
          {jobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              style={[
                styles.jobOption,
                selectedJob === job.id && styles.jobOptionSelected,
              ]}
              onPress={() => setSelectedJob(job.id)}
            >
              <Text style={styles.jobId}>{job.id}</Text>
              <Text style={[
                styles.jobTitle,
                selectedJob === job.id && styles.jobTitleSelected,
              ]}>
                {job.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderLocationStatus = () => (
    <View style={styles.locationContainer}>
      <View style={styles.locationHeader}>
        <Text style={styles.locationIcon}>📍</Text>
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>{location}</Text>
          <Text style={styles.gpsStatusText}>GPS: {gpsStatus}</Text>
        </View>
        <View style={[
          styles.gpsIndicator,
          { backgroundColor: gpsStatus === 'Connected' ? '#10B981' : '#F59E0B' }
        ]} />
      </View>
      <View style={styles.geofenceStatus}>
        <Text style={styles.geofenceText}>🎯 Within job site geofence</Text>
      </View>
    </View>
  );

  const renderTimeEntry = (entry) => (
    <View key={entry.id} style={styles.timeEntryCard}>
      <View style={styles.timeEntryHeader}>
        <Text style={styles.timeEntryJob}>{entry.job}</Text>
        <Text style={styles.timeEntryDuration}>{entry.duration}</Text>
      </View>
      <Text style={styles.timeEntryDate}>{entry.date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Time Tracker</Text>
        <View style={styles.todayHours}>
          <Text style={styles.todayHoursText}>Today: 4h 15m</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Job Selector */}
        {renderJobSelector()}

        {/* Timer Display */}
        <View style={styles.timerSection}>
          <View style={styles.timerDisplay}>
            <Text style={styles.timerText}>{formatTime(seconds)}</Text>
            {isOnBreak && (
              <View style={styles.breakDisplay}>
                <Text style={styles.breakLabel}>Break Time</Text>
                <Text style={styles.breakTime}>{formatTime(breakSeconds)}</Text>
              </View>
            )}
          </View>

          {/* Timer Controls */}
          <View style={styles.timerControls}>
            {!isRunning ? (
              <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                <Text style={styles.startButtonText}>▶️ Start</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.activeControls}>
                <TouchableOpacity 
                  style={[styles.controlButton, styles.pauseButton]} 
                  onPress={handlePause}
                >
                  <Text style={styles.controlButtonText}>
                    {isPaused ? '▶️ Resume' : '⏸️ Pause'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.controlButton, styles.stopButton]} 
                  onPress={handleStop}
                >
                  <Text style={styles.controlButtonText}>⏹️ Stop</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Break Button */}
          {isRunning && (
            <TouchableOpacity 
              style={[
                styles.breakButton,
                isOnBreak && styles.breakButtonActive
              ]} 
              onPress={handleBreak}
            >
              <Text style={[
                styles.breakButtonText,
                isOnBreak && styles.breakButtonTextActive
              ]}>
                {isOnBreak ? '🔄 End Break' : '☕ Take Break'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Status Indicators */}
          {isRunning && (
            <View style={styles.statusIndicators}>
              <View style={[
                styles.statusBadge,
                { backgroundColor: isPaused ? '#F59E0B' : '#10B981' }
              ]}>
                <Text style={styles.statusText}>
                  {isPaused ? 'PAUSED' : isOnBreak ? 'ON BREAK' : 'ACTIVE'}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Location Status */}
        {renderLocationStatus()}

        {/* Manual Time Entry */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Manual Entry</Text>
          <TouchableOpacity style={styles.manualEntryButton}>
            <Text style={styles.manualEntryText}>➕ Add Manual Time Entry</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Time Entries */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Time Entries</Text>
          {timeEntries.map(renderTimeEntry)}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionText}>📋 View Timesheet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionText}>📤 Submit Hours</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  todayHours: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  todayHoursText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  jobSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  jobOption: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    minWidth: 180,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  jobOptionSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#1E40AF',
  },
  jobId: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  jobTitleSelected: {
    color: '#1E40AF',
  },
  timerSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1E40AF',
    fontFamily: 'monospace',
  },
  breakDisplay: {
    marginTop: 12,
    alignItems: 'center',
  },
  breakLabel: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '500',
    marginBottom: 4,
  },
  breakTime: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F59E0B',
    fontFamily: 'monospace',
  },
  timerControls: {
    width: '100%',
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  activeControls: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: '#F59E0B',
  },
  stopButton: {
    backgroundColor: '#EF4444',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  breakButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  breakButtonActive: {
    backgroundColor: '#FEF3C7',
  },
  breakButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  breakButtonTextActive: {
    color: '#92400E',
  },
  statusIndicators: {
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  locationContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  locationInfo: {
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  gpsStatusText: {
    fontSize: 12,
    color: '#6B7280',
  },
  gpsIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  geofenceStatus: {
    backgroundColor: '#F0FDF4',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  geofenceText: {
    fontSize: 12,
    color: '#15803D',
    textAlign: 'center',
  },
  manualEntryButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  manualEntryText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  timeEntryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  timeEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeEntryJob: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  timeEntryDuration: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
  },
  timeEntryDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#1E40AF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default TimeSheetScreen;