import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {heightPercentageToDP} from '../utils';

// Embedded Colors - JDP Electrics Theme
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

const JobTimesheet = ({
  user: propUser,
  selectedJob: propSelectedJob,
  onNavigate,
  hasLeadAccess: propHasLeadAccess,
  route,
}) => {
  const navigation = useNavigation();

  // Mock user data
  const mockUser = {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Lead Labor',
  };

  const user = propUser || mockUser;
  const hasLeadAccess = propHasLeadAccess ?? user.role === 'Lead Labor';
  const selectedJob = propSelectedJob || route?.params?.job;

  // State
  const [selectedDate, setSelectedDate] = useState(new Date());
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

  const [showAddEntryModal, setShowAddEntryModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [newEntry, setNewEntry] = useState({
    activity: '',
    startTime: '',
    endTime: '',
    description: '',
    location: '',
    worker: user.name,
    isManual: true,
  });

  // Calculate totals
  const totalMinutes = timeEntries.reduce(
    (sum, entry) => sum + entry.duration,
    0,
  );
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  // Helper functions
  const formatDate = date => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDuration = minutes => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const calculateDuration = (startTime, endTime) => {
    // Simple duration calculation (would use proper time parsing in real app)
    const start = new Date(`2024-01-01 ${startTime}`);
    const end = new Date(`2024-01-01 ${endTime}`);
    return Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60));
  };

  // Handlers
  const handleBack = () => {
    navigation.goBack();
  };

  const handleNavigate = (screen, params) => {
    if (onNavigate) {
      onNavigate(screen, params);
    } else {
      navigation.navigate(screen, params);
    }
  };

  const handleAddEntry = () => {
    if (!newEntry.activity || !newEntry.startTime || !newEntry.endTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const duration = calculateDuration(newEntry.startTime, newEntry.endTime);
    const entry = {
      id: Date.now().toString(),
      activity: newEntry.activity,
      startTime: newEntry.startTime,
      endTime: newEntry.endTime,
      duration,
      description: newEntry.description || '',
      location: newEntry.location || '',
      worker: newEntry.worker || user.name,
      isManual: true,
      jobId: newEntry.jobId,
    };

    setTimeEntries(prev => [...prev, entry]);
    setNewEntry({
      activity: '',
      startTime: '',
      endTime: '',
      description: '',
      location: '',
      worker: user.name,
      isManual: true,
    });
    setShowAddEntryModal(false);
  };

  const handleEditEntry = entry => {
    if (!hasLeadAccess && !entry.isManual) {
      Alert.alert(
        'Access Denied',
        'Only Lead Labor can edit automatic entries',
      );
      return;
    }
    setEditingEntry(entry);
    setNewEntry({
      activity: entry.activity,
      startTime: entry.startTime,
      endTime: entry.endTime,
      description: entry.description,
      location: entry.location,
      worker: entry.worker,
      jobId: entry.jobId,
    });
    setShowAddEntryModal(true);
  };

  const handleUpdateEntry = () => {
    if (
      !editingEntry ||
      !newEntry.activity ||
      !newEntry.startTime ||
      !newEntry.endTime
    ) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const duration = calculateDuration(newEntry.startTime, newEntry.endTime);
    const updatedEntry = {
      ...editingEntry,
      activity: newEntry.activity,
      startTime: newEntry.startTime,
      endTime: newEntry.endTime,
      duration,
      description: newEntry.description || '',
      location: newEntry.location || '',
      worker: newEntry.worker || user.name,
      jobId: newEntry.jobId,
    };

    setTimeEntries(prev =>
      prev.map(entry => (entry.id === editingEntry.id ? updatedEntry : entry)),
    );
    setEditingEntry(null);
    setNewEntry({
      activity: '',
      startTime: '',
      endTime: '',
      description: '',
      location: '',
      worker: user.name,
      isManual: true,
    });
    setShowAddEntryModal(false);
  };

  const handleDeleteEntry = entryId => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this time entry?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTimeEntries(prev => prev.filter(entry => entry.id !== entryId));
          },
        },
      ],
    );
  };

  const handleSubmitTimesheet = () => {
    if (!hasLeadAccess) {
      Alert.alert('Access Denied', 'Only Lead Labor can submit timesheets');
      return;
    }

    Alert.alert(
      'Submit Timesheet',
      `Submit timesheet for ${formatDate(
        selectedDate,
      )}?\n\nTotal Hours: ${totalHours}h ${remainingMinutes}m`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Submit',
          onPress: () => {
            Alert.alert('Success', 'Timesheet submitted successfully');
            handleNavigate('JDPSubmissionScreen', {
              timesheet: {
                entries: timeEntries,
                totalHours: totalHours + remainingMinutes / 60,
              },
              date: selectedDate,
            });
          },
        },
      ],
    );
  };

  const renderTimeEntry = entry => (
    <View key={entry.id} style={styles.timeEntryCard}>
      <View style={styles.timeEntryHeader}>
        <View style={styles.timeEntryTitle}>
          <Text style={styles.activityName}>{entry.activity}</Text>
          <View style={styles.timeEntryMeta}>
            {entry.isManual ? (
              <View style={styles.manualBadge}>
                <Icon name="edit" size={12} color={Colors.warning} />
                <Text style={styles.manualBadgeText}>Manual</Text>
              </View>
            ) : (
              <View style={styles.autoBadge}>
                <Icon name="timer" size={12} color={Colors.success} />
                <Text style={styles.autoBadgeText}>Auto</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.timeEntryActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditEntry(entry)}>
            <Icon name="edit" size={16} color={Colors.primary} />
          </TouchableOpacity>

          {entry.isManual && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteEntry(entry.id)}>
              <Icon name="delete" size={16} color={Colors.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.timeEntryBody}>
        <View style={styles.timeDetails}>
          <View style={styles.timeRow}>
            <Icon name="access-time" size={16} color={Colors.textSecondary} />
            <Text style={styles.timeText}>
              {entry.startTime} - {entry.endTime}
            </Text>
            <Text style={styles.durationText}>
              ({formatDuration(entry.duration)})
            </Text>
          </View>

          <View style={styles.locationRow}>
            <Icon name="location-on" size={16} color={Colors.textSecondary} />
            <Text style={styles.locationText}>{entry.location}</Text>
          </View>

          <View style={styles.workerRow}>
            <Icon name="person" size={16} color={Colors.textSecondary} />
            <Text style={styles.workerText}>{entry.worker}</Text>
          </View>
        </View>

        {entry.description ? (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>{entry.description}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );

  const renderAddEntryModal = () => (
    <Modal
      visible={showAddEntryModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        setShowAddEntryModal(false);
        setEditingEntry(null);
        setNewEntry({
          activity: '',
          startTime: '',
          endTime: '',
          description: '',
          location: '',
          worker: user.name,
          isManual: true,
        });
      }}>
      <View style={styles.modalOverlay}>
        <View style={styles.addEntryModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingEntry ? 'Edit Time Entry' : 'Add Time Entry'}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowAddEntryModal(false);
                setEditingEntry(null);
              }}>
              <Icon name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Activity *</Text>
              <TextInput
                style={styles.textInput}
                value={newEntry.activity}
                onChangeText={text =>
                  setNewEntry(prev => ({...prev, activity: text}))
                }
                placeholder="Enter activity name"
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <View style={styles.timeInputRow}>
              <View
                style={[styles.formField, {flex: 1, marginRight: Spacing.sm}]}>
                <Text style={styles.fieldLabel}>Start Time *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEntry.startTime}
                  onChangeText={text =>
                    setNewEntry(prev => ({...prev, startTime: text}))
                  }
                  placeholder="09:00 AM"
                  placeholderTextColor={Colors.textLight}
                />
              </View>

              <View
                style={[styles.formField, {flex: 1, marginLeft: Spacing.sm}]}>
                <Text style={styles.fieldLabel}>End Time *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEntry.endTime}
                  onChangeText={text =>
                    setNewEntry(prev => ({...prev, endTime: text}))
                  }
                  placeholder="05:00 PM"
                  placeholderTextColor={Colors.textLight}
                />
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Location</Text>
              <TextInput
                style={styles.textInput}
                value={newEntry.location}
                onChangeText={text =>
                  setNewEntry(prev => ({...prev, location: text}))
                }
                placeholder="Work location"
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Worker</Text>
              <TextInput
                style={styles.textInput}
                value={newEntry.worker}
                onChangeText={text =>
                  setNewEntry(prev => ({...prev, worker: text}))
                }
                placeholder="Worker name"
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newEntry.description}
                onChangeText={text =>
                  setNewEntry(prev => ({...prev, description: text}))
                }
                placeholder="Description of work performed"
                placeholderTextColor={Colors.textLight}
                multiline={true}
                numberOfLines={3}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowAddEntryModal(false);
                  setEditingEntry(null);
                }}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={editingEntry ? handleUpdateEntry : handleAddEntry}>
                <Text style={styles.saveButtonText}>
                  {editingEntry ? 'Update' : 'Add Entry'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Job Timesheet</Text>
            <Text style={styles.headerSubtitle}>
              {formatDate(selectedDate)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddEntryModal(true)}>
            <Icon name="add" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>
              {7}h {50}m
            </Text>
            <Text style={styles.summaryLabel}>Total Time</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{timeEntries.length}</Text>
            <Text style={styles.summaryLabel}>Activities</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>
              {timeEntries.filter(e => !e.isManual).length}
            </Text>
            <Text style={styles.summaryLabel}>Auto Tracked</Text>
          </View>
        </View>
      </View>

      {/* Time Entries */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.entriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Time Entries</Text>
            <Text style={styles.sectionSubtitle}>
              {timeEntries.length} activities logged
            </Text>
          </View>

          {timeEntries?.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="schedule" size={64} color={Colors.textLight} />
              <Text style={styles.emptyStateTitle}>No time entries</Text>
              <Text style={styles.emptyStateSubtitle}>
                Add your first time entry to get started
              </Text>
              <TouchableOpacity
                style={styles.addFirstEntryButton}
                onPress={() => setShowAddEntryModal(true)}>
                <Text style={styles.addFirstEntryText}>Add Time Entry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            timeEntries?.map(renderTimeEntry)
          )}
        </View>

        {/* <View style={{height: 100}} /> */}
      </ScrollView>
      {/* Quick Actions */}
      {timeEntries?.length > 0 && (
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}></Text>

          {/* <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                handleNavigate('MaterialTrackingScreen', {job: selectedJob})
              }>
              <Icon name="inventory" size={20} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Material Tracking</Text>
              <Icon name="chevron-right" size={20} color={Colors.textLight} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                handleNavigate('JobSummaryScreen', {job: selectedJob})
              }>
              <Icon name="assessment" size={20} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Job Summary</Text>
              <Icon name="chevron-right" size={20} color={Colors.textLight} />
            </TouchableOpacity> */}

          {hasLeadAccess && (
            <TouchableOpacity
              style={[styles.actionButton, styles.submitActionButton]}
              onPress={handleSubmitTimesheet}>
              <Icon name="send" size={20} color={Colors.white} />
              <Text style={[styles.actionButtonText, styles.submitActionText]}>
                Submit For Approval
              </Text>
              <Icon name="chevron-right" size={20} color={Colors.white} />
            </TouchableOpacity>
          )}
        </View>
      )}
      {renderAddEntryModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    backgroundColor: Colors.primary,
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
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

  // Content
  content: {
    flex: 1,
  },

  // Sections
  entriesSection: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.lg,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 40,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },

  // Time Entry Cards
  timeEntryCard: {
    backgroundColor: Colors.backgroundLight,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  timeEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  timeEntryTitle: {
    flex: 1,
    marginRight: Spacing.md,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  timeEntryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  manualBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warningLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  manualBadgeText: {
    fontSize: 12,
    color: Colors.warning,
    fontWeight: '500',
  },
  autoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  autoBadgeText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '500',
  },
  timeEntryActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  editButton: {
    padding: Spacing.sm,
  },
  deleteButton: {
    padding: Spacing.sm,
  },
  timeEntryBody: {
    gap: Spacing.sm,
  },
  timeDetails: {
    gap: Spacing.sm,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  timeText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  durationText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  locationText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  workerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  workerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  descriptionContainer: {
    backgroundColor: Colors.white,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  addFirstEntryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  addFirstEntryText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },

  // Actions Section
  actionsSection: {
    backgroundColor: Colors.white,
    // paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  submitActionButton: {
    backgroundColor: Colors.primary,
    position: 'absolute',
    bottom: 10,
    left: 20,
  },
  submitActionText: {
    color: Colors.white,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  addEntryModal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    // maxHeight: '90%',
    height: heightPercentageToDP(80),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.lg,
  },

  // Form Fields
  formField: {
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  timeInputRow: {
    flexDirection: 'row',
  },

  // Modal Actions
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});

export default JobTimesheet;
