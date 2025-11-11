import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {tabColor, whiteColor} from '../constants/Color';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import LinearGradient from 'react-native-linear-gradient';
import {heightPercentageToDP, widthPercentageToDP} from '../utils';
import {
  COMPLETED,
  CREATE_JOB,
  GROUP_PEOPLE,
  INVOICE_ICON,
  JOB_ICON,
  JOBS_ICON,
  ORDER_HISTORY,
  PERFORMANCE,
  REPORT_ICON,
  REPORTS_ICON,
  SUPPORT_ICON,
  WARRENTY_ICON,
} from '../assests/images';
import {useSelector} from 'react-redux';
import useHasPermission from '../hooks/useHasPermission';
import {
  getJobs,
  getlabourJobs,
  getNotificationsByUser,
} from '../config/apiConfig';
import {useFocusEffect} from '@react-navigation/native';

const HomeScreen = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  const token = useSelector(state => state.user.token);
  const leadLaborId = user?.lead_labor?.id;
  const laborId = user?.labor?.id;
  const canViewCreateJob = useHasPermission('jobs', 'view');

  const userId = user.id;
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [dashboardData, setDashboardData] = useState();
  const [unreadCount, setUnreadCount] = useState(0);
  const [todayDueJobs, setTodayDueJobs] = useState([]);

  console.log('unreadCountunreadCount>>,', unreadCount);

  const statsData = [
    {
      key: 'total',
      title: 'Active Jobs',
      value: dashboardData?.summary?.total_jobs || 0,
      subtitle: "Today's schedule",
      icon: <Feather name="activity" size={24} color={whiteColor} />,
    },
    {
      key: 'active',
      title: 'Active Jobs',
      value: dashboardData?.summary?.active_jobs || 0,
      subtitle: 'Currently working',
      icon: <AntDesign name="sync" size={20} color={whiteColor} />,
    },
    {
      key: 'completed',
      title: 'Completed Jobs',
      value: dashboardData?.summary?.completed_jobs || 0,
      subtitle: 'Next 3 days',
      icon: <Feather name="calendar" size={24} color={whiteColor} />,
    },
    {
      key: 'thisWeek',
      title: 'This Week',
      value: dashboardData?.summary?.this_week_jobs || 0,
      subtitle: 'Total assigned',
      icon: <MaterialIcons name="assignment" size={24} color={whiteColor} />,
    },
  ];

  const quickActions = [
    {
      title: 'View Jobs',
      icon: JOB_ICON,
      color: '#3B82F6',
    },
    {
      title: 'View Activity',
      icon: REPORT_ICON,
      color: '#0D542B',
    },
    // {
    //   title: 'Generate Invoice',
    //   icon: INVOICE_ICON,
    //   color: '#6E11B0',
    // },
    // {
    //   title: 'Order History',
    //   icon: ORDER_HISTORY,
    //   color: '#6E11B0',
    // },
    // {
    //   title: 'Check Warranty',
    //   icon: WARRENTY_ICON,
    //   color: '#9F2D00',
    // },
    canViewCreateJob && {
      title: 'Create Job',
      icon: CREATE_JOB,
      color: '#9F2D00',
    },
    // {
    //   title: 'Support Center',
    //   icon: SUPPORT_ICON,
    //   color: '#A50036',
    // },
  ].filter(Boolean);

  const upcomingJobs = [
    {
      id: 'JOB-003',
      jobId: 'JOB-003',
      title: 'Emergency Generator Maintenance',
      date: '1/26/2024 at 09:00',
      priority: 'high',
      client: 'Metro Hospital',
      duration: '4h',
      priorityColor: '#9F0712',
      customer: {
        name: 'ABC Manufacturing',
        address: '1234 Industrial Blvd, Houston, TX 77001',
        phone: '+1 (555) 0101',
      },
      status: 'upcoming',
      scheduledDate: '2024-01-15',
      scheduledTime: '08:00 AM',
      specialInstructions:
        'Customer prefers work to be done during off-hours. Main power shutdown required.',
      tags: ['Electrical', 'Panel Upgrade', 'High Priority'],
      location: {
        latitude: 29.7604,
        longitude: -95.3698,
        address: '1234 Industrial Blvd, Houston, TX 77001',
      },
      estimatedHours: 8,
    },
  ];
  // useEffect(() => {
  //   const fetchJobs = async () => {
  //     if (loading) return;
  //     setLoading(true);
  //     try {
  //       const res =
  //         user?.management_type === 'lead_labor'
  //           ? await getJobs(leadLaborId, 1, 10, token)
  //           : await getlabourJobs(laborId, 1, 10, token);

  //       const newJobs = res?.data?.jobs ?? [];
  //       setDashboardData(res?.data);
  //       console.log('newJobsnewJobs>>', res?.data);

  //       setJobs(newJobs);
  //     } catch (err) {
  //       console.error('Error fetching jobs:', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchJobs();
  // }, []);
  useFocusEffect(
    useCallback(() => {
      const fetchJobs = async () => {
        if (loading) return;
        setLoading(true);
        try {
          const res =
            user?.management_type === 'lead_labor'
              ? await getJobs(leadLaborId, 1, 10, token)
              : await getlabourJobs(laborId, 1, 10, token);

          const newJobs = res?.data?.jobs ?? [];
          setDashboardData(res?.data);
          console.log('newJobsnewJobs>>', res?.data);
          setJobs(newJobs);
        } catch (err) {
          console.error('Error fetching jobs:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchJobs();
    }, [user, leadLaborId, laborId, token]),
  );
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // e.g. "2025-11-07"

    const filtered = jobs?.filter(item => {
      const createdDate = item?.created_at?.split('T')[0];
      return createdDate === today;
    });
    setTodayDueJobs(filtered);
  }, [jobs]);

  useFocusEffect(
    useCallback(() => {
      loadInitial();
    }, [user, leadLaborId, laborId, token]),
  );
  // useEffect(() => {
  //   loadInitial();
  // }, []);

  const loadInitial = async () => {
    setLoading(true);

    try {
      const res = await getNotificationsByUser(userId, 1, 200, token);
      // res.data.items per your example
      const items = res?.data?.items ?? [];
      console.log('home', res?.data?.pagination?.unread_count);

      setUnreadCount(res?.data?.pagination?.unread_count || 0);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err?.message || 'Unable to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickActionPress = title => {
    if (title == 'Create Job') {
      navigation.navigate('CreateJobScreen'); // replace 'CreateJob' with your actual screen name
    } else if (title == 'View Activity') {
      navigation.navigate('ActivitySummaryScreen');
    } else if (title == 'Order History') {
      navigation.navigate('OrderHistoryScreen');
    } else if (title == 'Check Warranty') {
      navigation.navigate('WarrantyChecker');
    }

    // You can add other conditions here for other actions
    else if (title == 'View Jobs') {
      navigation.navigate('JobStack');
    } else if (title == 'Support Center') {
      navigation.navigate('SupportScreen');
    }
  };

  const renderStatsCard = (item, index) => {
    const handlePress = () => {
      if (item.key === 'thisWeek') {
        return;
      }
      navigation.navigate('JobStack', {status: item.key});
    };
    return (
      <TouchableOpacity
        key={index}
        style={styles.statsCard}
        activeOpacity={0.7}
        // onPress={handlePress}
      >
        {/* <View style={[styles.headerCircle, styles.topRightCircle, {overflow:"hidden"}]} /> */}

        <View
          style={[
            styles.statsIconContainer,
            {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            },
          ]}>
          <Text style={styles.statsIcon}>{item.icon}</Text>
          <Text style={[styles.statsTitle, {fontSize: 16, fontWeight: 700}]}>
            {item.title}
          </Text>
        </View>
        <View style={styles.statsContent}>
          <Text style={styles.statsValue}>{item.value}</Text>
          <Text style={styles.statsSubtitle}>{item.subtitle}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderQuickAction = (item, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.quickActionButton,
        {
          backgroundColor: item.color,
          width:
            index === quickActions.length - 1 && quickActions.length % 2 === 1
              ? '100%'
              : '48%',
          // width: index === 2 ? '100%' : '48%'
        },
      ]}
      onPress={() => handleQuickActionPress(item.title)}>
      <View style={[styles.quickActionIcon, {backgroundColor: item.color}]}>
        <Image
          source={item.icon}
          style={[styles.quickActionIconImage, {alignSelf: 'center'}]}
        />
      </View>
      <Text style={styles.quickActionText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderJobCard = job => (
    <TouchableOpacity
      onPress={() => navigation.navigate('JobDetail', {job})}
      key={job.id}
      style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <View style={styles.jobHeaderLeft}>
          <Text style={styles.jobId}>{job.job_title}</Text>
          <View style={[styles.statusBadge, {backgroundColor: '#E3F2FD'}]}>
            <Text style={[styles.statusText, {color: job.statusColor}]}>
              {job?.status}
            </Text>
          </View>
          {/* <View style={[styles.priorityBadge, {backgroundColor: '#ECEEF2'}]}>
            <Text style={[styles.priorityText, {color: job.priorityColor}]}>
              {job?.priority}
            </Text>
          </View> */}
        </View>
      </View>
      {/* <Text style={styles.jobTitle}>{job.title}</Text> */}
      <Text style={styles.jobDescription}>{job.description}</Text>
      <View style={styles.jobDetails}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'space-between',
          }}>
          <View style={styles.jobDetailRow}>
            <Text style={styles.jobDetailIcon}>
              <Feather name="user" size={18} color={tabColor} />{' '}
            </Text>
            <Text style={styles.jobDetailText}>
              {job?.customer?.customer_name || job?.contractor?.contractor_name}
            </Text>
          </View>
          <View style={styles.jobDetailRow}>
            <Text style={styles.jobDetailIcon}>
              {/* <Ionicons name="timer-outline" size={18} color={tabColor} /> */}
            </Text>
            <Text style={styles.jobDetailText}></Text>
          </View>
        </View>
        <View style={styles.jobDetailRow}>
          <Text style={styles.jobDetailIcon}>
            <Feather name="map-pin" size={18} color={tabColor} />
          </Text>
          <Text
            style={[styles.jobDetailText, {width: widthPercentageToDP(50)}]}>
            {job?.address}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderUpcomingJob = job => (
    <TouchableOpacity
      key={job.id}
      style={styles.upcomingJobCard}
      onPress={() => navigation.navigate('JobDetail', {job})}>
      <View style={styles.upcomingJobHeader}>
        <View style={styles.upcomingJobLeft}>
          <Text style={styles.upcomingJobId}>{job.id}</Text>
          <View style={[styles.priorityBadge, {backgroundColor: '#ECEEF2'}]}>
            <Text style={[styles.priorityText, {color: job.priorityColor}]}>
              {job.priority}
            </Text>
          </View>
        </View>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{job.date}</Text>
        </View>
      </View>
      <Text style={styles.upcomingJobTitle}>{job.title}</Text>
      <Text style={styles.jobDescription}>
        Upgrade main electrical panel from 100A to 200A service
      </Text>
      <View style={styles.jobDetails}>
        <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
          <View style={styles.jobDetailRow}>
            <Text style={styles.jobDetailIcon}>
              {' '}
              <Feather name="user" size={18} color={tabColor} />{' '}
            </Text>
            <Text style={styles.jobDetailText}>TechCorp Office</Text>
          </View>
          <View style={styles.jobDetailRow}>
            <Text style={styles.jobDetailIcon}>
              <Ionicons name="timer-outline" size={18} color={tabColor} />
            </Text>
            <Text style={styles.jobDetailText}>14:00 est.</Text>
          </View>
        </View>
        <View style={styles.jobDetailRow}>
          <Text style={styles.jobDetailIcon}>
            <Feather name="map-pin" size={18} color={tabColor} />
          </Text>
          <Text style={styles.jobDetailText}>
            {'1500 Corporate Blvd, Houston, TX 77002'}
          </Text>
        </View>
      </View>
      {/* <View style={styles.upcomingJobDetails}>
        <View style={styles.jobDetailRow}>
          <Text style={styles.jobDetailIcon}>
            <Feather name="map-pin" size={18} color={tabColor} />
          </Text>
          <Text style={styles.jobDetailText}>{item.client}</Text>
        </View>
        <View style={styles.jobDetailRow}>
          <Text style={styles.jobDetailIcon}>
            {' '}
            <Ionicons name="timer-outline" size={16} color={tabColor} />
          </Text>
          <Text style={styles.jobDetailText}> {item.duration}</Text>
        </View>
      </View> */}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="briefcase-outline" size={40} color={'#D1D5DB'} />
      </View>
      <Text style={styles.emptyTitle}>No jobs found</Text>
    </View>
  );
  const date = new Date();

  // Greeting logic
  const hours = date.getHours();
  let greeting = 'Good Morning';
  if (hours >= 12 && hours < 17) {
    greeting = 'Good Afternoon';
  } else if (hours >= 17) {
    greeting = 'Good Evening';
  }
  const options = {weekday: 'long', month: 'short', day: 'numeric'};
  const today = date.toLocaleDateString('en-US', options);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{marginBottom: 70}}
        showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <LinearGradient
          colors={['#155DFC', '#1447E6', '#432DD7']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.header}>
          <View style={[styles.headerCircle, styles.topRightCircle]} />
          <View style={[styles.headerCircle, styles.bottomLeftCircle]} />
          {/* <View style={styles.header}> */}
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>
                {greeting}, {user?.full_name}!
              </Text>
              <View style={styles.roleContainer}>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>Lead Labor</Text>
                </View>
                <Text style={[styles.dateText, {color: '#fff'}]}>
                  • {today}
                </Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.avatar}
                onPress={() => navigation.navigate('ProfileScreen')}>
                <Text style={styles.avatarText}>
                  {user?.full_name
                    ? user.full_name.charAt(0).toUpperCase()
                    : 'P'}
                </Text>
                <View style={styles.onlineIndicator} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => navigation.navigate('NotificationScreen')}>
                <MaterialIcons
                  name="notifications-none"
                  size={24}
                  color={whiteColor}
                />
                {unreadCount !== 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationCount}>{unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              {statsData.slice(0, 2).map(renderStatsCard)}
            </View>
            <View style={styles.statsRow}>
              {statsData.slice(2, 4).map(renderStatsCard)}
            </View>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Stats Cards */}
          {/* <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            {statsData.slice(0, 2).map(renderStatsCard)}
          </View>
          <View style={styles.statsRow}>
            {statsData.slice(2, 4).map(renderStatsCard)}
          </View>
        </View> */}

          {/* Quick Actions */}
          {user?.management_type == 'lead_labor' && (
            <View style={styles.section}>
              <View
                style={[
                  styles.sectionHeader,
                  {justifyContent: 'space-between'},
                ]}>
                <View style={{flexDirection: 'row'}}>
                  <Ionicons name="flash-outline" size={24} color={tabColor} />
                  <Text style={styles.sectionTitle}>Quick Actions</Text>
                </View>
                <View style={[styles.accessBadge]}>
                  <Text style={styles.accessText}>Lead Access</Text>
                </View>
              </View>
              <View style={styles.quickActionsGrid}>
                {quickActions?.map(renderQuickAction)}
              </View>
            </View>
          )}

          {/* Today's Jobs */}
          <View style={styles.section}>
            <View
              style={[styles.sectionHeader, {justifyContent: 'space-between'}]}>
              <View style={{flexDirection: 'row'}}>
                <AntDesign name="calendar" size={18} color={tabColor} />
                <Text style={[styles.sectionTitle, {marginLeft: 4}]}>
                  Today's Jobs
                </Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{jobs.length}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('JobStack')}>
                <Text style={styles.viewAllText}>View All →</Text>
              </TouchableOpacity>
            </View>
            {loading ? (
              <ActivityIndicator size="large" color="#3B82F6" />
            ) : jobs?.length === 0 ? (
              renderEmptyState()
            ) : (
              jobs?.slice(0, 10).map(renderJobCard)
            )}
          </View>

          {/* Upcoming Jobs */}
          {/* <View style={styles.section}>
            <View
              style={[
                styles.sectionHeader,
                {justifyContent: 'space-between', alignItems: 'center'},
              ]}>
              <View style={{flexDirection: 'row'}}>
                <Feather name="clock" size={20} color={tabColor} />
                <Text style={[styles.sectionTitle, {marginLeft: 4}]}>
                  Upcoming Jobs
                </Text>
                <View style={[styles.countBadge, {backgroundColor: '#F0FDF4'}]}>
                  <Text style={[styles.countText, {color: '#008236'}]}>1</Text>
                </View>
              </View>
              <TouchableOpacity
                // style={{marginLeft: widthPercentageToDP(28)}}
                onPress={() => navigation.navigate('JobStack')}>
                <Text style={styles.viewAllText}>View All →</Text>
              </TouchableOpacity>
            </View>
            {upcomingJobs?.map(renderUpcomingJob)}
          </View> */}

          {/* Team Performance */}
          {/* <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Image
                source={PERFORMANCE}
                style={{width: 28, height: 28, marginRight: 10}}
              />
              <Text style={styles.sectionTitle}>Team Performance Overview</Text>
              <View style={styles.dashboardBadge}>
                <Text style={styles.dashboardText}>Lead Dashboard</Text>
              </View>
            </View>
            <View style={styles.performanceCards}>
              <View
                style={[styles.performanceCard, {backgroundColor: '#F0FDF4'}]}>
                <View style={styles.performanceIcon}>
                  <Image source={COMPLETED} style={{width: 28, height: 28}} />
                </View>
                <Text style={styles.performanceLabel}>Jobs Completed</Text>
                <Text style={[styles.performanceValue, {color: '#0D542B'}]}>
                  18
                </Text>
                <Text style={[styles.performanceTrend, {color: '#00A63E'}]}>
                  ↗ This week
                </Text>
              </View>
              <View
                style={[styles.performanceCard, {backgroundColor: '#EFF6FF'}]}>
                <View style={styles.performanceIcon}>
                  <Image
                    source={GROUP_PEOPLE}
                    style={{width: 28, height: 28}}
                  />
                 
                </View>
                <Text style={styles.performanceLabel}>Active Technicians</Text>
                <Text style={[styles.performanceValue, {color: '#1C398E'}]}>
                  6
                </Text>
                <Text style={[styles.performanceTrend, {color: '#155DFC'}]}>
                  — Currently working
                </Text>
              </View>
            </View>
          </View> */}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    // marginBottom: 100,
  },
  header: {
    // backgroundColor: '#432DD7',
    // paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  headerCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 1000,
  },
  topRightCircle: {
    width: 256,
    height: 256,
    top: -165,
    right: -128,
  },
  bottomLeftCircle: {
    width: 192,
    height: 192,
    bottom: -80,
    left: -96,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  dateText: {
    color: '#000',
    fontSize: 11,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  // emptyIconContainer: {marginBottom: 16},
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 20,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00C950',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationIcon: {
    fontSize: 16,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 3,
    backgroundColor: '#FB2C36',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    marginVertical: 24,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 10,
  },
  statsCard: {
    flex: 1,
    backgroundColor: 'rgba(232, 236, 246, 0.4)',
    borderRadius: 16,
    padding: 16,
    // marginRight: 8,
    backdropFilter: 'blur(10px)',
  },
  statsIconContainer: {
    marginBottom: 8,
  },
  statsIcon: {
    fontSize: 16,
  },
  statsContent: {
    gap: 4,
  },
  statsTitle: {
    fontSize: 11,
    color: '#fff',
  },
  statsValue: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsSubtitle: {
    fontSize: 14,
    color: '#fff',
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionIconImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#101828',
    // flex: 1,
  },
  accessBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BEDBFF',
  },
  accessText: {
    color: tabColor,
    fontSize: 9,
    fontWeight: '500',
  },
  countBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BEDBFF',
    marginRight: 8,
    marginLeft: 10,
  },
  countText: {
    color: '#1447E6',
    fontSize: 10,
    fontWeight: '500',
  },
  viewAllText: {
    color: '#155DFC',
    fontSize: 12,
    fontWeight: '500',
    alignSelf: 'flex-end',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    width: '48%',
    // backgroundColor: '#155DFC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionIconText: {
    fontSize: 16,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  jobCard: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  jobHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  jobId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#101828',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  jobTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#101828',
    marginBottom: 4,
  },
  jobDescription: {
    fontSize: 12,
    color: '#4A5565',
    marginBottom: 12,
    lineHeight: 16,
  },
  jobDetails: {
    gap: 8,
  },
  jobDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  jobDetailIcon: {
    fontSize: 12,
    marginTop: 6,
  },
  jobDetailText: {
    fontSize: 12,
    color: '#4A5565',
  },
  upcomingJobCard: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  upcomingJobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  upcomingJobLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  upcomingJobId: {
    fontSize: 13,
    fontWeight: '500',
    color: '#101828',
  },
  dateBadge: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  upcomingJobTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#101828',
    marginBottom: 8,
  },
  upcomingbDeJotails: {
    flexDirection: 'row',
    gap: 16,
    fontSize: 12,
  },
  dashboardBadge: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E9D4FF',
  },
  dashboardText: {
    color: '#8200DB',
    fontSize: 10,
    fontWeight: '500',
  },
  performanceCards: {
    flexDirection: 'row',
    gap: 12,
  },
  performanceCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  performanceIcon: {
    // backgroundColor: '#FFFFFF',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  performanceLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 16,
  },
  performanceValue: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  performanceTrend: {
    fontSize: 12,
    fontWeight: '400',
  },
});

export default HomeScreen;
