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
  ActivityIndicator,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Skeleton from 'react-native-reanimated-skeleton';
import {useNavigation} from '@react-navigation/native';
import {widthPercentageToDP} from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import useHasPermission from '../hooks/useHasPermission';
import {getJobById} from '../config/apiConfig';
import {style} from '../constants/Fonts';
import {blackColor} from '../constants/Color';

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
  // job: propJob,
}) => {
  const navigation = useNavigation();
  const job = route?.params?.job;
  const user = useSelector(state => state.user.user);
  const token = useSelector(state => state.user.token);
  const canCreateOrders = useHasPermission('orders', 'create');
  const canViewProducts = useHasPermission('products', 'view');
  const canViewSuppliers = useHasPermission('suppliers', 'view');
  const canViewSubJobs = useHasPermission('sub_jobs', 'view');
  const canCreateSubJobs = useHasPermission('sub_jobs', 'create');
  const canViewBlueSheet = useHasPermission('bluesheet', 'view');
  const canCreateBlueSheet = useHasPermission('bluesheet', 'create');
  const canViewActivityLogs = useHasPermission('activity_logs', 'view');
  const canOrderMaterials =
    canCreateOrders && canViewProducts && canViewSuppliers;
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [viewingJob, setViewingJob] = useState(null);
  const [subJobModalVisible, setSubJobModalVisible] = useState(false);
  const [subJobNewTitle, setSubJobNewTitle] = useState('');
  const [timerPickerVisible, setTimerPickerVisible] = useState(false);
  const [timerSelectedJobId, setTimerSelectedJobId] = useState(null);
  console.log('detailjob', job);

  const formatSentence = text => {
    if (!text || typeof text !== 'string') {
      return text;
    }
    const trimmed = text.trim();
    if (!trimmed) {
      return trimmed;
    }
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  };

  const mainJob =
    route?.params?.mainJob || (job?.isMainJob ? job : null) || null;

  const subJobs = Array.isArray(mainJob?.subJobs) ? mainJob.subJobs : [];

  const effectiveJob = viewingJob ?? job;

  const getTimerStorageKey = () => {
    const base =
      mainJob?.customer?.id ||
      mainJob?.customer?.customer_id ||
      mainJob?.contractor?.id ||
      mainJob?.address ||
      mainJob?.id ||
      mainJob?._id;
    return base ? `timerSelection:${String(base)}` : null;
  };

  useEffect(() => {
    const loadSavedTimerSelection = async () => {
      try {
        const key = getTimerStorageKey();
        if (!key) {
          setTimerSelectedJobId(null);
          return;
        }
        const saved = await AsyncStorage.getItem(key);
        setTimerSelectedJobId(saved || null);
      } catch (e) {
        console.log('Error loading timer selection', e);
      }
    };
    if (mainJob) {
      loadSavedTimerSelection();
    } else {
      setTimerSelectedJobId(null);
    }
  }, [mainJob?.id, mainJob?._id]);

  useEffect(() => {
    setViewingJob(null);
  }, [job?.id, job?._id]);

  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return Colors.primary;
      case 'assigned':
        return Colors.warning;
      case 'pending':
        return Colors.error;
      case 'completed':
        return Colors.success;
      case 'in_progress':
        return Colors.primaryDark;
      default:
        return Colors.textSecondary;
    }
  };

  const [timerSession, setTimerSession] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTimerId, setActiveTimerId] = useState('');
  // const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get job from props or route params
  const jobId = route?.params?.job?.id;

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
  // useEffect(() => {
  //   const fetchJobDetails = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await getJobById(jobId, token);
  //       console.log('viewjob >.', res);

  //       setJob(res?.data);
  //     } catch (err) {
  //       setError(err.message || 'Failed to fetch job details');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (jobId && token) {
  //     fetchJobDetails();
  //   }
  // }, [jobId, token]);
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

  useEffect(() => {
    const getTimerId = async () => {
      const activeJobId = await AsyncStorage.getItem('activeJobId');
      if (job?.jobId?.toString() == activeJobId) {
      }
      setActiveTimerId(activeJobId);
    };
    getTimerId();
  }, []);
  // Handle null job case
  // if (loading) {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         backgroundColor: Colors.background,
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //       }}>
  //       <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
  //       <ActivityIndicator size="large" color={Colors.primary} />
  //     </View>
  //   );
  // }

  // if (loading) {
  //   return (
  //     <Skeleton
  //       isLoading={false}
  //       duration={1200}
  //       animationType="shiver"
  //       animationDirection="horizontalRight"
  //       boneColor="#E1E9EE"
  //       highlightColor="#F2F8FC"
  //       containerStyle={{
  //         flex: 1,
  //         backgroundColor: Colors.background,
  //         padding: 16,
  //       }}>
  //       {/* Header Skeleton */}
  //       <View
  //         style={{
  //           height: 60,
  //           borderRadius: 8,
  //           backgroundColor: '#E1E9EE',
  //           marginBottom: 20,
  //         }}
  //       />

  //       {/* Priority / Badge Skeleton */}
  //       <View
  //         style={{
  //           height: 40,
  //           borderRadius: 8,
  //           backgroundColor: '#E1E9EE',
  //           marginBottom: 20,
  //         }}
  //       />

  //       {/* Actions Card Skeleton */}
  //       <View
  //         style={{
  //           height: 120,
  //           borderRadius: 12,
  //           backgroundColor: '#E1E9EE',
  //           marginBottom: 20,
  //         }}
  //       />

  //       {/* Job Details Card Skeleton */}
  //       <View
  //         style={{
  //           height: 180,
  //           borderRadius: 12,
  //           backgroundColor: '#E1E9EE',
  //           marginBottom: 20,
  //         }}
  //       />

  //       {/* Customer Card Skeleton */}
  //       <View
  //         style={{
  //           height: 140,
  //           borderRadius: 12,
  //           backgroundColor: '#E1E9EE',
  //           marginBottom: 20,
  //         }}
  //       />

  //       {/* Location Card Skeleton */}
  //       <View
  //         style={{
  //           height: 100,
  //           borderRadius: 12,
  //           backgroundColor: '#E1E9EE',
  //           marginBottom: 20,
  //         }}
  //       />

  //       {/* Materials Card Skeleton (if canViewOrders) */}
  //       {canViewOrders && (
  //         <View
  //           style={{
  //             height: 140,
  //             borderRadius: 12,
  //             backgroundColor: '#E1E9EE',
  //             marginBottom: 20,
  //           }}
  //         />
  //       )}

  //       {/* Special Instructions Skeleton */}
  //       {job?.notes && (
  //         <View
  //           style={{
  //             height: 80,
  //             borderRadius: 12,
  //             backgroundColor: '#E1E9EE',
  //             marginBottom: 20,
  //           }}
  //         />
  //       )}

  //       {/* Additional Actions Skeleton */}
  //       {canViewBlueSheet && (
  //         <View
  //           style={{
  //             height: 100,
  //             borderRadius: 12,
  //             backgroundColor: '#E1E9EE',
  //             marginBottom: 20,
  //           }}
  //         />
  //       )}
  //     </Skeleton>
  //   );
  // }

  // if (!job) {
  //   return (
  //     <View style={styles.container}>
  //       <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

  //       {/* Header */}
  //       <View style={styles.header}>
  //         <TouchableOpacity
  //           style={styles.backButton}
  //           onPress={() => (onBack ? onBack() : navigation.goBack())}>
  //           <Icon name="arrow-back" size={24} color={Colors.white} />
  //         </TouchableOpacity>
  //         <Text style={styles.headerTitle}>Job Not Found</Text>
  //         <View style={styles.headerSpacer} />
  //       </View>

  //       <View style={styles.errorContainer}>
  //         <Icon name="error-outline" size={64} color={Colors.textLight} />
  //         <Text style={styles.errorTitle}>Job Not Found</Text>
  //         <Text style={styles.errorSubtitle}>
  //           The requested job could not be found.
  //         </Text>
  //         <TouchableOpacity
  //           style={[styles.primaryButton, {width: widthPercentageToDP(40)}]}
  //           onPress={() =>
  //             onNavigate
  //               ? onNavigate('JobStack')
  //               : navigation.navigate('JobStack')
  //           }>
  //           <Text style={styles.primaryButtonText}>View All Jobs</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   );
  // }

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

  // const priorityConfig = getPriorityConfig(job.priority || 'medium');

  const handleNavigate = (screen, jobData) => {
    navigation.navigate(screen, jobData ? {job: jobData} : undefined);
  };

  const handleNavigateTimer = async job => {
    try {
      const activeJobId = await AsyncStorage.getItem('activeJobId');
      // setActiveTimerId(activeJobId)
      const currentJobId = job?.id?.toString();
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
    if (viewingJob) {
      setViewingJob(null);
      return;
    }
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {/* <StatusBar barStyle="light-content" backgroundColor={Colors.primary} /> */}
      {/* Header */}
      <View style={[styles.header]}>
        <TouchableOpacity
          style={[styles.backButton, {width: widthPercentageToDP(30)}]}
          onPress={handleBack}>
          <Icon name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={[styles.headerCenter, {width: widthPercentageToDP(30)}]}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {effectiveJob?.job_title || effectiveJob?.title}
          </Text>
          {/* <Text style={styles.headerSubtitle}>{job?.job_title}</Text> */}
        </View>
        <TouchableOpacity
          style={[styles.editButton, {width: widthPercentageToDP(30)}]}
          // onPress={() => handleNavigate('JobStack')}
        >
          {/* <Icon name="edit" size={20} color={Colors.white} /> */}
        </TouchableOpacity>
      </View>

      {/* Status and Priority Badges */}
      {/* <View style={styles.badgesContainer}>
        <View style={[styles.badge, {backgroundColor: Colors.errorLight}]}>
          <Icon name="star" size={16} color={Colors.error} />
          <Text style={[styles.badgeText, {color: Colors.error}]}>
            {priorityConfig.label}
          </Text>
        </View>
      </View> */}

      {/* Timer Display */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main & Sub Job section: show only on overview; hide when user tapped main/sub card */}
        {canViewSubJobs &&
          mainJob &&
          subJobs.length > 0 &&
          !viewingJob &&
          (job?.id === mainJob?.id || job?._id === mainJob?._id) && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="work" size={20} color={Colors.primary} />
                <View>
                  <Text style={styles.cardTitle}>Jobs</Text>
                </View>
              </View>
              <View style={styles.cardContent}>
                <View style={styles.jobsListContainer}>
                  <ScrollView
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={true}>
                    {/* Main job row – icon + title + status + date */}
                    <TouchableOpacity
                      style={[styles.mainSubJobCard, styles.mainSubJobCardMain]}
                      activeOpacity={0.9}
                      onPress={() => setViewingJob(mainJob)}>
                      <View style={styles.mainSubJobTopRow}>
                        <View style={styles.mainSubIconCol}>
                          <Icon name="work" size={18} color={Colors.primary} />
                        </View>
                        <View style={styles.mainSubJobMiddleCol}>
                          <Text
                            style={styles.mainSubJobTitle}
                            numberOfLines={1}>
                            {mainJob.job_title || mainJob.title}
                          </Text>
                          <Text style={styles.mainSubJobTag}>
                            {mainJob?.isSubJob ? 'Sub Job' : 'Main Job'}
                          </Text>
                        </View>
                        <View style={styles.mainSubRightCol}>
                          <View
                            style={[
                              styles.mainSubJobStatusBadge,
                              {
                                backgroundColor: getStatusColor(
                                  mainJob?.status,
                                ),
                              },
                            ]}>
                            <Text style={styles.mainSubJobStatusText}>
                              {(mainJob?.status === 'in_progress'
                                ? 'In Progress'
                                : mainJob?.status || ''
                              ).toUpperCase()}
                            </Text>
                          </View>
                          <Text style={styles.mainSubJobDateText}>
                            {mainJob?.due_date
                              ? new Date(mainJob?.due_date).toLocaleDateString(
                                  'en-US',
                                )
                              : '—'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {/* Sub job rows – icon + title + status + date */}
                    {subJobs.map(sub => {
                      const enrichedSub = {
                        ...mainJob,
                        ...sub,
                        customer: sub.customer || mainJob.customer,
                        contractor: sub.contractor || mainJob.contractor,
                        address: sub.address || mainJob.address,
                        assigned_labor:
                          sub.assigned_labor || mainJob.assigned_labor,
                        assigned_lead_labor:
                          sub.assigned_lead_labor ||
                          mainJob.assigned_lead_labor,
                        notes: sub.notes ?? mainJob.notes,
                        requiredMaterials:
                          sub.requiredMaterials || mainJob.requiredMaterials,
                        bluesheets: sub.bluesheets || mainJob.bluesheets,
                      };

                      return (
                        <TouchableOpacity
                          key={sub.id}
                          style={[
                            styles.mainSubJobCard,
                            styles.mainSubJobCardSub,
                          ]}
                          activeOpacity={0.9}
                          onPress={() => setViewingJob(enrichedSub)}>
                          <View style={styles.mainSubJobTopRow}>
                            <View style={styles.mainSubIconCol}>
                              <Icon
                                name="subdirectory-arrow-right"
                                size={18}
                                color={Colors.warning}
                              />
                            </View>
                            <View style={styles.mainSubJobMiddleCol}>
                              <Text
                                style={styles.mainSubJobTitle}
                                numberOfLines={1}>
                                {sub.job_title || sub.title}
                              </Text>
                              <Text style={styles.subJobTag}>Sub Job</Text>
                            </View>
                            <View style={styles.mainSubRightCol}>
                              <View
                                style={[
                                  styles.mainSubJobStatusBadge,
                                  {
                                    backgroundColor: getStatusColor(
                                      sub?.status,
                                    ),
                                  },
                                ]}>
                                <Text style={styles.mainSubJobStatusText}>
                                  {(sub?.status === 'in_progress'
                                    ? 'In Progress'
                                    : sub?.status || ''
                                  ).toUpperCase()}
                                </Text>
                              </View>
                              <Text style={styles.mainSubJobDateText}>
                                {sub?.due_date
                                  ? new Date(sub?.due_date).toLocaleDateString(
                                      'en-US',
                                    )
                                  : '—'}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            </View>
          )}

        {/* Primary Actions */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="build" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Actions</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.actionButtonRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  if (mainJob && subJobs.length > 0) {
                    setTimerPickerVisible(true);
                  } else {
                    handleNavigateTimer(effectiveJob);
                  }
                }}>
                <Icon name="timer" size={20} color={Colors.successDark} />
                <Text style={styles.actionButtonText}>{'Start Timer'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('MapScreen', {job})}>
                <Icon name="directions" size={20} color={Colors.primary} />
                <Text
                  style={[styles.actionButtonText, {color: Colors.primary}]}>
                  Directions
                </Text>
              </TouchableOpacity>
            </View>

            {effectiveJob?.isMainJob &&
              !effectiveJob?.isSubJob &&
              canCreateSubJobs && (
                <TouchableOpacity
                  style={[
                    styles.fullWidthActionButton,
                    {marginTop: Spacing.md},
                  ]}
                  onPress={() => {
                    setSubJobNewTitle('');
                    setSubJobModalVisible(true);
                  }}>
                  <Icon name="note-add" size={20} color={Colors.primary} />
                  <Text style={styles.fullWidthActionText}>
                    Add New Change Order
                  </Text>
                </TouchableOpacity>
              )}
          </View>
        </View>

        {/* Job Information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="business" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Job Details</Text>
          </View>
          <View style={styles.cardContent}>
            {/* Top summary: status + type */}
            <View style={styles.summaryRow}>
              <View style={styles.summaryBadge}>
                <Icon
                  name="flag"
                  size={14}
                  color={Colors.white}
                  style={{marginRight: Spacing.xs}}
                />
                <Text style={styles.summaryBadgeText}>
                  {(effectiveJob?.status === 'in_progress'
                    ? 'In Progress'
                    : effectiveJob?.status || 'Pending'
                  ).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.summaryTypeText}>
                {effectiveJob?.isSubJob ? 'Sub Job' : 'Main Job'}
              </Text>
            </View>

            {/* Description */}
            <View style={styles.descriptionBox}>
              <Text style={styles.infoLabel}>Description</Text>
              <Text
                style={styles.infoText}
                numberOfLines={showFullDesc ? 0 : 4}>
                {formatSentence(
                  effectiveJob?.description || 'No description available',
                )}
              </Text>
              {effectiveJob?.description?.length > 150 && (
                <TouchableOpacity
                  onPress={() => setShowFullDesc(prev => !prev)}>
                  <Text style={styles.readMoreText}>
                    {showFullDesc ? 'Read Less' : 'Read More'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Divider */}
            <View style={styles.infoDivider} />

            {/* Assigned To */}
            <View style={styles.infoItemColumn}>
              <Text style={styles.infoLabel}>Assigned To</Text>
              <View style={styles.infoWithIcon}>
                <Icon
                  name="people"
                  size={16}
                  color={Colors.textSecondary}
                  style={{marginRight: Spacing.xs}}
                />
                <Text style={styles.infoText}>
                  {(() => {
                    const leadNames =
                      effectiveJob?.assigned_lead_labor &&
                      Array.isArray(effectiveJob?.assigned_lead_labor)
                        ? effectiveJob?.assigned_lead_labor
                            ?.map(labor =>
                              formatSentence(labor.user?.full_name || ''),
                            )
                            .filter(Boolean)
                        : [];

                    const labourNames =
                      effectiveJob?.assigned_labor &&
                      Array.isArray(effectiveJob?.assigned_labor)
                        ? effectiveJob?.assigned_labor
                            ?.map(labor =>
                              formatSentence(labor.user?.full_name || ''),
                            )
                            .filter(Boolean)
                        : [];

                    const allNames = [...leadNames, ...labourNames];
                    return allNames.length ? allNames.join(', ') : '—';
                  })()}
                </Text>
              </View>
            </View>

            {/* Scheduled */}
            <View style={styles.infoItemColumn}>
              <Text style={styles.infoLabel}>Scheduled</Text>
              <View style={styles.infoWithIcon}>
                <Icon name="event" size={16} color={Colors.textSecondary} />
                <Text style={styles.infoText}>{effectiveJob?.due_date}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="person" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>
              {effectiveJob?.customer?.customer_name
                ? 'Customer'
                : 'Contractor'}
            </Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.customerBox}>
              <Text style={styles.customerLabel}>Name</Text>
              <Text style={styles.customerNameText}>
                <Text>
                  {(
                    effectiveJob?.customer?.customer_name ||
                    effectiveJob?.contractor?.contractor_name ||
                    'N/A'
                  )
                    .charAt(0)
                    .toUpperCase() +
                    (
                      effectiveJob?.customer?.customer_name ||
                      effectiveJob?.contractor?.contractor_name ||
                      'N/A'
                    ).slice(1)}
                </Text>
              </Text>

              {(effectiveJob?.customer?.phone ||
                effectiveJob?.contractor?.phone) && (
                <View style={styles.customerContactRow}>
                  <View style={styles.contactInfo}>
                    <Text style={styles.customerLabel}>Phone</Text>
                    <View style={styles.infoWithIcon}>
                      <Icon
                        name="phone"
                        size={16}
                        color={Colors.textSecondary}
                        style={{marginRight: Spacing.xs}}
                      />
                      <Text style={styles.customerPhoneText}>
                        {effectiveJob?.customer?.phone ||
                          effectiveJob?.contractor?.phone}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.contactButton}
                    onPress={async () => {
                      try {
                        const phoneNumber =
                          effectiveJob?.customer?.phone ||
                          effectiveJob?.contractor?.phone;

                        if (!phoneNumber) {
                          Alert.alert('Error', 'No phone number available');
                          return;
                        }

                        const cleanedNumber = String(phoneNumber).replace(
                          /[^\d+]/g,
                          '',
                        );

                        if (!cleanedNumber) {
                          Alert.alert('Error', 'Invalid phone number');
                          return;
                        }

                        const primaryUrl =
                          Platform.OS === 'ios'
                            ? `telprompt:${cleanedNumber}`
                            : `tel:${cleanedNumber}`;

                        const fallbackUrl = `tel:${cleanedNumber}`;

                        try {
                          await Linking.openURL(primaryUrl);
                        } catch (e) {
                          await Linking.openURL(fallbackUrl);
                        }
                      } catch (err) {
                        console.error('Call error:', err);
                        Alert.alert(
                          'Error',
                          'Something went wrong while trying to call',
                        );
                      }
                    }}>
                    <Icon name="call" size={16} color={Colors.white} />
                    <Text style={styles.contactButtonText}>Call</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
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
              {effectiveJob?.address || 'Location not specified'}
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleNavigate('MapScreen', effectiveJob)}>
              <Icon name="directions" size={20} color={Colors.white} />
              <Text style={styles.primaryButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Materials */}
        {/* {job.materials && job.materials.length > 0 && ( */}
        {/* {user?.role == 'Lead Labour' && ( */}
        {/* {canViewOrders && (
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
                onPress={() =>
                  handleNavigate('SupplierSelectionScreen', job)
                }>
                <Icon name="shopping-cart" size={20} color={Colors.primary} />
                <Text style={styles.outlineButtonText}>Order Materials</Text>
              </TouchableOpacity>
            </View>
          </View>
        )} */}

        {canViewProducts && canOrderMaterials && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="inventory" size={20} color={Colors.primary} />
              <Text style={styles.cardTitle}>Required Materials</Text>
            </View>
            <View style={styles.cardContent}>
              {effectiveJob?.requiredMaterials?.map((material, idx) => (
                <View key={idx} style={styles.materialItem}>
                  <Text style={styles.materialName}>{material.name}</Text>
                  <Text style={styles.materialQuantity}>
                    {material.quantity} {material.unit}
                  </Text>
                </View>
              ))}
              {canOrderMaterials && (
                <TouchableOpacity
                  style={styles.outlineButton}
                  onPress={() =>
                    handleNavigate('SupplierSelectionScreen', effectiveJob)
                  }>
                  <Icon name="shopping-cart" size={20} color={Colors.primary} />
                  <Text style={styles.outlineButtonText}>Order Materials</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* )} */}
        {/* )} */}

        {/* Special Instructions */}
        {effectiveJob?.notes && (
          <View style={[styles.card, styles.warningCard]}>
            <View style={styles.cardHeader}>
              <Icon name="warning" size={20} color={Colors.orange} />
              <Text style={[styles.cardTitle, {color: Colors.orange}]}>
                Special Instructions
              </Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.warningContent}>
                <Text style={styles.warningText}>{effectiveJob?.notes}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Additional Actions */}
        {(canCreateBlueSheet || canViewActivityLogs) && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="description" size={20} color={Colors.primary} />
              <Text style={styles.cardTitle}>More Actions</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.actionGrid}>
                {canCreateBlueSheet && (
                  <TouchableOpacity
                    style={styles.gridActionButton}
                    onPress={() =>
                      navigation.navigate('JobTimesheet', {job: effectiveJob})
                    }>
                    <Icon name="schedule" size={20} color={Colors.text} />
                    <Text style={styles.gridActionText}>Create Bluesheet</Text>
                  </TouchableOpacity>
                )}

                {canViewActivityLogs && (
                  <TouchableOpacity
                    style={styles.gridActionButton}
                    onPress={() =>
                      navigation.navigate('JobActivityLogScreen', {
                        job: effectiveJob,
                      })
                    }>
                    <Icon name="bar-chart" size={20} color={Colors.text} />
                    <Text style={styles.gridActionText}>Job Activity</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Change Order / Sub Job Modal */}
        <Modal
          transparent
          visible={subJobModalVisible}
          animationType="fade"
          onRequestClose={() => {
            setSubJobModalVisible(false);
            setSubJobNewTitle('');
          }}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalBackground}
            onPress={() => {
              setSubJobModalVisible(false);
              setSubJobNewTitle('');
            }}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.subJobModalBox}
              onPress={e => e?.stopPropagation?.()}>
              <Text style={styles.subJobModalTitle}>Change Order Details</Text>
              <Text style={styles.subJobModalLabel}>Job title</Text>
              <TextInput
                style={styles.subJobModalInput}
                value={subJobNewTitle}
                onChangeText={setSubJobNewTitle}
                placeholder="Enter Job title"
                placeholderTextColor={Colors.textLight}
              />
              <View style={styles.subJobModalButtons}>
                <TouchableOpacity
                  style={[styles.subJobModalBtn, styles.subJobModalBtnCancel]}
                  onPress={() => {
                    setSubJobModalVisible(false);
                    setSubJobNewTitle('');
                  }}>
                  <Text style={styles.subJobModalBtnCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.subJobModalBtn, styles.subJobModalBtnCreate]}
                  onPress={() => {
                    const newTitle = subJobNewTitle?.trim() || '';
                    const parent = effectiveJob;
                    setSubJobModalVisible(false);
                    setSubJobNewTitle('');
                    navigation.navigate('CreateJobScreen', {
                      subJobTitle: newTitle,
                      parentJob: parent,
                    });
                  }}>
                  <Text style={styles.subJobModalBtnCreateText}>Create</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Timer job picker modal */}
        <Modal
          transparent
          visible={timerPickerVisible}
          animationType="fade"
          onRequestClose={() => setTimerPickerVisible(false)}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalBackground}
            onPress={() => setTimerPickerVisible(false)}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.timerPickerBox}
              onPress={e => e?.stopPropagation?.()}>
              <Text style={styles.timerPickerTitle}>
                Select job to start timer
              </Text>

              <View style={styles.timerPickerList}>
                <ScrollView
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={1 + (subJobs?.length || 0) > 3}>
                  <TouchableOpacity
                    style={[styles.mainSubJobCard, styles.mainSubJobCardMain]}
                    activeOpacity={0.9}
                    onPress={async () => {
                      setTimerSelectedJobId(
                        String(mainJob?.id || mainJob?._id),
                      );
                      const key = getTimerStorageKey();
                      if (key) {
                        await AsyncStorage.setItem(
                          key,
                          String(mainJob?.id || mainJob?._id),
                        );
                      }
                    }}>
                    <View style={styles.mainSubJobTopRow}>
                      <View style={styles.mainSubIconCol}>
                        <Icon name="work" size={18} color={Colors.primary} />
                      </View>
                      <View style={styles.mainSubJobMiddleCol}>
                        <Text style={styles.mainSubJobTitle} numberOfLines={1}>
                          {mainJob?.job_title || mainJob?.title}
                        </Text>
                        <Text style={styles.mainSubJobTag}>Main Job</Text>
                      </View>
                      <View style={styles.timerPickerCheckCol}>
                        <Icon
                          name={
                            String(timerSelectedJobId) ===
                            String(mainJob?.id || mainJob?._id)
                              ? 'check-circle'
                              : 'radio-button-unchecked'
                          }
                          size={18}
                          color={Colors.primary}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>

                  {subJobs.map(sub => (
                    <TouchableOpacity
                      key={sub.id}
                      style={[styles.mainSubJobCard, styles.mainSubJobCardSub]}
                      activeOpacity={0.9}
                      onPress={async () => {
                        const selectedId = String(sub.id || sub._id);
                        setTimerSelectedJobId(selectedId);
                        const key = getTimerStorageKey();
                        if (key) {
                          await AsyncStorage.setItem(key, selectedId);
                        }
                      }}>
                      <View style={styles.mainSubJobTopRow}>
                        <View style={styles.mainSubIconCol}>
                          <Icon
                            name="subdirectory-arrow-right"
                            size={18}
                            color={Colors.warning}
                          />
                        </View>
                        <View style={styles.mainSubJobMiddleCol}>
                          <Text
                            style={styles.mainSubJobTitle}
                            numberOfLines={1}>
                            {sub.job_title || sub.title}
                          </Text>
                          <Text style={styles.subJobTag}>Sub Job</Text>
                        </View>
                        <View style={styles.timerPickerCheckCol}>
                          <Icon
                            name={
                              String(timerSelectedJobId) ===
                              String(sub.id || sub._id)
                                ? 'check-circle'
                                : 'radio-button-unchecked'
                            }
                            size={18}
                            color={Colors.warning}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <TouchableOpacity
                disabled={!timerSelectedJobId}
                style={[
                  styles.timerPickerContinueBtn,
                  !timerSelectedJobId && styles.timerPickerContinueBtnDisabled,
                ]}
                onPress={() => {
                  if (!timerSelectedJobId) {
                    return;
                  }
                  const id = String(timerSelectedJobId);
                  let selected = null;
                  if (id === String(mainJob?.id || mainJob?._id)) {
                    selected = mainJob;
                  } else {
                    selected =
                      subJobs.find(s => String(s.id || s._id) === id) ||
                      mainJob;
                  }
                  setTimerPickerVisible(false);
                  handleNavigateTimer(selected);
                }}>
                <Text style={styles.timerPickerContinueText}>Continue</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

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
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Platform.OS === 'android' ? 0 : Spacing.sm,
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
  cardSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  cardContent: {
    padding: Spacing.md,
    paddingTop: 0,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  summaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  summaryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
  summaryTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  descriptionBox: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  infoDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.md,
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
    flexDirection: 'row',
    gap: 5,
  },
  infoItemColumn: {
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
  infoColumnWide: {
    flex: 3,
  },
  infoColumnNarrow: {
    flex: 2,
    alignItems: 'flex-start',
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
    flexWrap: 'wrap', // 🔥 line break allow
    flexShrink: 1,
  },
  readMoreText: {
    color: Colors.primary,
    marginTop: Spacing.xs,
    fontWeight: '700',
  },
  infoWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
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
    justifyContent: 'center',
    // paddingHorizontal: Spacing.md,
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
  customerBox: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  customerLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  customerNameText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  customerContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  customerPhoneText: {
    fontSize: 15,
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
  fullWidthActionButton: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    columnGap: Spacing.sm,
  },
  fullWidthActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  subJobModalBox: {
    margin: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
  },
  subJobModalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  subJobModalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  subJobModalInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  subJobModalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: Spacing.sm,
  },
  subJobModalBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  subJobModalBtnCancel: {
    backgroundColor: Colors.backgroundLight,
  },
  subJobModalBtnCreate: {
    backgroundColor: Colors.primary,
  },
  subJobModalBtnCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  subJobModalBtnCreateText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  timerPickerBox: {
    margin: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
  },
  timerPickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  timerPickerList: {
    maxHeight: 210,
    marginBottom: Spacing.md,
  },
  timerPickerCheckCol: {
    marginLeft: Spacing.sm,
  },
  timerPickerContinueBtn: {
    // marginTop: Spacing.lg,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerPickerContinueBtnDisabled: {
    backgroundColor: Colors.border,
  },
  timerPickerContinueText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.white,
  },
  mainSubJobCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.backgroundLight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainSubJobCardMain: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  mainSubJobCardSub: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning,
  },
  mainSubJobTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainSubIconCol: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  mainSubJobMiddleCol: {
    flex: 1,
  },
  mainSubRightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  mainSubJobTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  mainSubJobTag: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  subJobTag: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.warning,
  },
  mainSubJobStatusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  mainSubJobStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
  jobsListContainer: {
    marginTop: Spacing.sm,
    maxHeight: 180,
  },
  mainSubJobDescription: {
    fontSize: 12,
    color: Colors.text,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  mainSubJobDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: Spacing.xs,
  },
  mainSubJobDateText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  mainSubJobActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  mainSubJobActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  mainSubJobActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
});

export default JobDetailScreen;
