import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {widthPercentageToDP} from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  errorLight: '#f4dcdcff',
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

// Interfaces

const JobDetailScreen = ({
  onBack,
  onNavigate,
  onViewTimesheet,
  onUpdateJobStatus,
  route,
  user,
  // job: propJob,
}) => {
  const navigation = useNavigation();
  // const {job1} =route?.params?.job

  const [timerSession, setTimerSession] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTimerId, setActiveTimerId] = useState('');

  // Get job from props or route params
  const job = route?.params?.job;
  console.log('job1>>>>', job);

  // const job = {
  //   jobId: 'JOB-0001',
  //   jobName: 'Electrical Panel Upgrade',
  //   status: 'Unknown',
  //   priority: 'High Priority',
  //   actions: {
  //     timerScreen: true,
  //     directions: true,
  //   },
  //   jobInfo: {
  //     description: 'Upgrade main electrical panel from 100A to 200A service',
  //     estimatedTime: '8 hours',
  //     scheduledDate: '8/21/2025',
  //     assignedTo: 'Sarah Johnson',
  //   },
  //   customer: {
  //     name: 'David Thompson',
  //     phone: '+1 (555) 0101',
  //     email: 'david.thompson@gmail.com',
  //   },
  //   location: {
  //     address: '1234 Oak Street, Houston, TX 77001',
  //     getDirections: true,
  //   },
  //   requiredMaterials: [],
  //   moreActions: {
  //     timesheet: true,
  //     reports: true,
  //     support: true,
  //   },
  // };

  // Mock user if not provided
  const currentUser = user || {role: 'Lead Labor'};
  const openEmail = () => {
    const email = 'paul@jdpelectric.us';
    const subject = 'Support Request';
    const body = 'Hello, I need help with...';

    const url = `mailto:${email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          Alert.alert('Error', 'No email client installed');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => Alert.alert('Error', err.message));
  };
  // Timer effect
  useEffect(() => {
    let interval;

    if (timerSession?.isRunning && !timerSession?.isPaused) {
      interval = setInterval(() => {
        setTimerSession(prev =>
          prev
            ? {
                ...prev,
                elapsedTime: prev.elapsedTime + 1,
              }
            : null,
        );
        setCurrentTime(new Date());
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerSession?.isRunning, timerSession?.isPaused]);

  // Handle null job case
  if (!job) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => (onBack ? onBack() : navigation.goBack())}>
            <Icon name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Not Found</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={64} color={Colors.textLight} />
          <Text style={styles.errorTitle}>Job Not Found</Text>
          <Text style={styles.errorSubtitle}>
            The requested job could not be found.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              onNavigate
                ? onNavigate('JobListingScreen')
                : navigation.navigate('JobListingScreen')
            }>
            <Text style={styles.primaryButtonText}>View All Jobs</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Status helpers
  const isCompleted = job.status === 'completed';
  const isInProgress = job.status === 'in-progress';
  const canStartWork = ['pending', 'scheduled', 'assigned'].includes(
    job.status,
  );

  const getStatusConfig = status => {
    switch (status) {
      case 'completed':
        return {
          icon: 'check-circle',
          color: Colors.successLight,
          textColor: Colors.successDark,
          label: 'Completed',
        };
      case 'in-progress':
        return {
          icon: 'play-arrow',
          color: Colors.primaryLight,
          textColor: Colors.primaryDark,
          label: 'In Progress',
        };
      case 'assigned':
        return {
          icon: 'person',
          color: Colors.purpleLight,
          textColor: Colors.purple,
          label: 'Assigned',
        };
      case 'scheduled':
        return {
          icon: 'schedule',
          color: Colors.indigoLight,
          textColor: Colors.indigo,
          label: 'Scheduled',
        };
      case 'pending':
        return {
          icon: 'hourglass-empty',
          color: Colors.orangeLight,
          textColor: Colors.orange,
          label: 'Pending',
        };
      default:
        return {
          icon: 'help-outline',
          color: Colors.backgroundLight,
          textColor: Colors.textLight,
          label: 'Unknown',
        };
    }
  };

  const getPriorityConfig = priority => {
    switch (priority) {
      case 'high':
        return {
          color: Colors.errorLight,
          textColor: Colors.error,
          label: 'High Priority',
        };
      case 'medium':
        return {
          color: Colors.warningLight,
          textColor: Colors.warning,
          label: 'Medium Priority',
        };
      case 'low':
        return {
          color: Colors.greenLight,
          textColor: Colors.green,
          label: 'Low Priority',
        };
      default:
        return {
          color: Colors.backgroundLight,
          textColor: Colors.textLight,
          label: 'High Priority',
        };
    }
  };

  // Timer functions
  const handleStartJob = () => {
    if (!timerSession && canStartWork) {
      const now = new Date();
      setTimerSession({
        startTime: now,
        elapsedTime: 0,
        isRunning: true,
        isPaused: false,
      });

      // Update job status to in-progress
      if (onUpdateJobStatus) {
        onUpdateJobStatus(job.id, 'in-progress');
      }

      Alert.alert('Success', `Job started at ${now.toLocaleTimeString()}`);
    }
  };

  const handlePauseTimer = () => {
    if (timerSession) {
      setTimerSession(prev =>
        prev
          ? {
              ...prev,
              isPaused: !prev.isPaused,
            }
          : null,
      );

      Alert.alert(
        'Success',
        timerSession.isPaused ? 'Timer resumed' : 'Timer paused',
      );
    }
  };

  const handleStopTimer = () => {
    if (timerSession) {
      const duration = formatDuration(timerSession.elapsedTime);
      setTimerSession(null);

      // Update job status to completed
      if (onUpdateJobStatus) {
        onUpdateJobStatus(job.id, 'completed');
      }

      Alert.alert('Success', `Job completed in ${duration}`);
    }
  };

  const formatDuration = seconds => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const formatTime = date => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const hasLeadAccess = role => {
    return role === 'Lead Labor';
  };

  const statusConfig = getStatusConfig(job.status);
  const priorityConfig = getPriorityConfig(job.priority || 'medium');

  const handleNavigate = (screen, jobData) => {
    // if (onNavigate) {
    //   navigation.navigate(screen, jobData);
    // } else {
    navigation.navigate(screen, jobData ? {job: jobData} : undefined);
    // }
  };
  useEffect(() => {
    const getTimerId = async () => {
      const activeJobId = await AsyncStorage.getItem('activeJobId');
      if (job?.jobId?.toString() == activeJobId) {
      }
      setActiveTimerId(activeJobId);
    };
    getTimerId();
  }, []);

  const handleNavigateTimer = async job => {
    try {
      const activeJobId = await AsyncStorage.getItem('activeJobId');
      // setActiveTimerId(activeJobId)
      const currentJobId = job?.jobId?.toString();
      if (!activeJobId) {
        // No active job → allow navigation
        navigation.navigate('TimerScreen', {job});
        return;
      }

      if (activeJobId === currentJobId) {
        // Same job → allow navigation
        navigation.navigate('TimerScreen', {job});
      } else {
        // Different job already running → block
        Alert.alert(
          'Active Job Running',
          `Another job (ID: ${activeJobId}) is already running. Please complete it first.`,
          [{text: 'OK'}],
        );
      }
    } catch (error) {
      console.log('❌ Error checking jobId:', error);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {job.title}
          </Text>
          <Text style={styles.headerSubtitle}>#{job.jobId}</Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleNavigate('JobStack')}>
          {/* <Icon name="edit" size={20} color={Colors.white} /> */}
        </TouchableOpacity>
      </View>

      {/* Status and Priority Badges */}
      <View style={styles.badgesContainer}>
        {/* <View style={[styles.badge, {backgroundColor: statusConfig.color}]}>
          <Icon
            name={statusConfig.icon}
            size={16}
            color={statusConfig.textColor}
          />
          <Text style={[styles.badgeText, {color: statusConfig.textColor}]}>
            {statusConfig.label}
          </Text>
        </View> */}
        <View style={[styles.badge, {backgroundColor: Colors.errorLight}]}>
          <Icon name="star" size={16} color={Colors.error} />
          <Text style={[styles.badgeText, {color: Colors.error}]}>
            {priorityConfig.label}
          </Text>
        </View>
      </View>

      {/* Timer Display */}
      {timerSession && (
        <View style={styles.timerCard}>
          <View style={styles.timerHeader}>
            <Icon name="timer" size={20} color={Colors.white} />
            <Text style={styles.timerHeaderText}>Active Session</Text>
          </View>
          <Text style={styles.timerDuration}>
            {formatDuration(timerSession.elapsedTime)}
          </Text>
          <Text style={styles.timerStartTime}>
            Started at {formatTime(timerSession.startTime)}
          </Text>
          {timerSession.isPaused && (
            <Text style={styles.timerPausedText}>Timer Paused</Text>
          )}
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Primary Actions */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="build" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Actions</Text>
          </View>
          <View style={styles.cardContent}>
            {/* {!timerSession && canStartWork && (
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStartJob}>
                <Icon name="play-arrow" size={24} color={Colors.white} />
                <Text style={styles.startButtonText}>Start Job</Text>
              </TouchableOpacity>
            )}

            {timerSession && (
              <View style={styles.timerControls}>
                <View style={styles.timerButtonRow}>
                  <TouchableOpacity
                    style={styles.timerButton}
                    onPress={handlePauseTimer}>
                    <Icon
                      name={timerSession.isPaused ? 'play-arrow' : 'pause'}
                      size={20}
                      color={Colors.text}
                    />
                    <Text style={styles.timerButtonText}>
                      {timerSession.isPaused ? 'Resume' : 'Pause'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.timerButton, styles.stopButton]}
                    onPress={handleStopTimer}>
                    <Icon name="stop" size={20} color={Colors.white} />
                    <Text
                      style={[styles.timerButtonText, styles.stopButtonText]}>
                      Complete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )} */}

            <View style={styles.actionButtonRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleNavigateTimer(job)}>
                <Icon name="timer" size={20} color={Colors.successDark} />
                <Text style={styles.actionButtonText}>{'Start Timer'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('MapScreen', job)}>
                <Icon name="directions" size={20} color={Colors.primary} />
                <Text style={[styles.actionButtonText,{color:Colors.primary}]}>Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Job Information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="business" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Job Details</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Description</Text>
              <Text style={styles.infoText}>{job?.description}</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoColumn}>
                <Text style={styles.infoLabel}>Estimated Time</Text>
                <View style={styles.infoWithIcon}>
                  <Icon
                    name="schedule"
                    size={16}
                    color={Colors.textSecondary}
                  />
                  <Text style={styles.infoText}>
                    {job?.estimatedHours || 'N/A'}
                  </Text>
                </View>
              </View>
              <View style={styles.infoColumn}>
                <Text style={styles.infoLabel}>Scheduled</Text>
                <View style={styles.infoWithIcon}>
                  <Icon name="event" size={16} color={Colors.textSecondary} />
                  <Text style={styles.infoText}>{job?.scheduledDate}</Text>
                </View>
              </View>
            </View>

            {job?.assignedTo && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Assigned To</Text>
                <View style={styles.infoWithIcon}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {Array.isArray(job?.assignedTo)
                        ? job?.assignedTo[0]
                            ?.split(' ')
                            .map(n => n[0])
                            .join('')
                        : job?.assignedTo
                            .split(' ')
                            .map(n => n[0])
                            .join('')}
                    </Text>
                  </View>
                  <Text style={styles.infoText}>
                    {Array.isArray(job?.assignedTo)
                      ? job?.assignedTo.join(', ')
                      : job?.assignedTo}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="person" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Customer</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoText}>
                {job?.customer?.name || 'N/A'}
              </Text>
            </View>

            {job.customer?.phone && (
              <View style={styles.customerContactItem}>
                <View style={styles.contactInfo}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoText}>{job.customer.phone}</Text>
                </View>
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() => {
                    const phoneNumber = 'tel:+1334444477';
                    Linking.canOpenURL(phoneNumber)
                      .then(supported => {
                        if (!supported) {
                          Alert.alert('Error', 'Unable to open dialer');
                        } else {
                          return Linking.openURL(phoneNumber);
                        }
                      })
                      .catch(err => Alert.alert('Error', err.message));
                  }}>
                  <Icon name="phone" size={16} color={Colors.white} />
                  <Text style={styles.contactButtonText}>Call</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* {job.customer?.email && (
              <View style={styles.customerContactItem}>
                <View style={styles.contactInfo}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoText}>{job.customer.email}</Text>
                </View>
                <TouchableOpacity
                  style={styles.emailButton}
                  onPress={openEmail}>
                  <Icon name="email" size={16} color={Colors.text} />
                  <Text style={styles.emailButtonText}>Email</Text>
                </TouchableOpacity>
              </View>
            )} */}
          </View>
        </View>

        {/* Location */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="place" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Location</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.locationText}>
              {job.location?.address || 'Location not specified'}
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleNavigate('MapScreen', job)}>
              <Icon name="directions" size={20} color={Colors.white} />
              <Text style={styles.primaryButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Materials */}
        {/* {job.materials && job.materials.length > 0 && ( */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="inventory" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Required Materials</Text>
          </View>
          <View style={styles.cardContent}>
            {job?.requiredMaterials?.map((material, idx) => (
              <View key={idx} style={styles.materialItem}>
                <Text style={styles.materialName}>{material.name}</Text>
                <Text style={styles.materialQuantity}>
                  {material.quantity} {material.unit}
                </Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => handleNavigate('SupplierSelectionScreen', job)}>
              <Icon name="shopping-cart" size={20} color={Colors.primary} />
              <Text style={styles.outlineButtonText}>Order Materials</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* )} */}

        {/* Special Instructions */}
        {job.notes && (
          <View style={[styles.card, styles.warningCard]}>
            <View style={styles.cardHeader}>
              <Icon name="warning" size={20} color={Colors.orange} />
              <Text style={[styles.cardTitle, {color: Colors.orange}]}>
                Special Instructions
              </Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.warningContent}>
                <Text style={styles.warningText}>{job.notes}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Additional Actions */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="description" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>More Actions</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.actionGrid}>
              <TouchableOpacity
                style={styles.gridActionButton}
                onPress={() =>
                  onViewTimesheet
                    ? onViewTimesheet(job)
                    : handleNavigate('JobTimesheet')
                }>
                <Icon name="schedule" size={20} color={Colors.text} />
                <Text style={styles.gridActionText}>Bluesheet</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.gridActionButton}
                onPress={() => navigation.navigate('JobActivityLogScreen')}>
                <Icon name="bar-chart" size={20} color={Colors.text} />
                <Text style={styles.gridActionText}>Job Activity</Text>
              </TouchableOpacity>
              {/*               
              {hasLeadAccess(currentUser.role) && (
                <TouchableOpacity 
                  style={styles.gridActionButton} 
                  onPress={() => handleNavigate('InvoiceManagementScreen', job)}
                >
                  <Icon name="receipt" size={20} color={Colors.text} />
                  <Text style={styles.gridActionText}>Invoice</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={styles.gridActionButton} 
                onPress={() => handleNavigate('SupportCenterScreen')}
              >
                <Icon name="support" size={20} color={Colors.text} />
                <Text style={styles.gridActionText}>Support</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{height: 80}} />
      </ScrollView>
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
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.primaryLight,
    marginTop: Spacing.xs,
  },
  editButton: {
    padding: Spacing.sm,
  },
  headerSpacer: {
    width: 40,
  },

  // Error State
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  errorSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },

  // Badges
  badgesContainer: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Timer Card
  timerCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    marginHorizontal: Spacing.md,
    marginTop: -Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  timerHeaderText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.white,
  },
  timerDuration: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
    fontFamily: 'monospace',
    marginBottom: Spacing.sm,
  },
  timerStartTime: {
    fontSize: 14,
    color: Colors.primaryLight,
  },
  timerPausedText: {
    fontSize: 14,
    color: Colors.warningLight,
    marginTop: Spacing.xs,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    marginTop: 20,
  },

  // Cards
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  warningCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.orange,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  cardContent: {
    padding: Spacing.md,
    paddingTop: 0,
  },
  // Buttons
  primaryButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  startButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },

  // Timer Controls
  timerControls: {
    marginBottom: Spacing.md,
  },
  timerButtonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  timerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    gap: Spacing.sm,
  },
  timerButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  stopButton: {
    backgroundColor: Colors.error,
    borderColor: Colors.error,
  },
  stopButtonText: {
    color: Colors.white,
  },

  // Action Buttons
  actionButtonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    gap: Spacing.sm,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.successDark,
  },

  // Info Items
  infoItem: {
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  infoColumn: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  infoText: {
    fontSize: 16,
    color: Colors.text,
  },
  infoWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },

  // Avatar
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },

  // Customer Contact
  customerContactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactButton: {
    backgroundColor: Colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
    width: widthPercentageToDP(20),
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.white,
  },
  emailButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
    width: widthPercentageToDP(20),
  },
  emailButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },

  // Location
  locationText: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: Spacing.md,
  },

  // Materials
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  materialName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  materialQuantity: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  // Warning Content
  warningContent: {
    backgroundColor: Colors.orangeLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  warningText: {
    fontSize: 16,
    color: Colors.orange,
  },

  // Action Grid
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  gridActionButton: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    gap: Spacing.sm,
  },
  gridActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
});

export default JobDetailScreen;
