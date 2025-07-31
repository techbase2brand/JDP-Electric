import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {tabColor, whiteColor} from '../constants/Color';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import LinearGradient from 'react-native-linear-gradient';
import {widthPercentageToDP} from '../utils';

const HomeScreen = ({navigation}) => {
  const statsData = [
    {
      title: 'Active Jobs',
      value: '2',
      subtitle: "Today's schedule",
      icon: <Feather name="activity" size={24} color={whiteColor} />,
    },
    {
      title: 'In Progress',
      value: '1',
      subtitle: 'Currently working',
      icon: <AntDesign name="sync" size={20} color={whiteColor} />,
    },
    {
      title: 'Upcoming',
      value: '1',
      subtitle: 'Next 3 days',
      icon: <Feather name="calendar" size={24} color={whiteColor} />,
    },
    {
      title: 'This Week',
      value: '24',
      subtitle: 'Total assigned',
      icon: (
        <MaterialIcons
          name="assignment-turned-in"
          size={24}
          color={whiteColor}
        />
      ),
    },
  ];

  const quickActions = [
    {
      title: 'View Jobs',
      icon: <MaterialIcons name="preview" size={26} color={whiteColor} />,
      color: '#3B82F6',
    },
    {
      title: 'View Reports',
      icon: <FontAwesome name="line-chart" size={20} color={whiteColor} />,
      color: '#0D542B',
    },
    {
      title: 'Generate Invoice',
      icon: <FontAwesome name="file-pdf-o" size={24} color={whiteColor} />,
      color: '#6E11B0',
    },
    {
      title: 'Check Warranty',
      icon: <Feather name="check-square" size={24} color={whiteColor} />,
      color: '#9F2D00',
    },
    {
      title: 'Create Job',
      icon: <Ionicons name="create" size={26} color={whiteColor} />,
      color: '#005F5A',
    },
    {
      title: 'Support Center',
      icon: <MaterialIcons name="support-agent" size={26} color={whiteColor} />,
      color: '#A50036',
    },
  ];

  const todaysJobs = [
    {
      id: 'JOB-001',
      title: 'Electrical Panel Upgrade',
      description: 'Upgrade main electrical panel from 100A to 200A service',
      status: 'In Progress',
      priority: 'HIGH',
      technician: 'David Thompson',
      time: '08:00 (8h est.)',
      location: '1234 Oak Street, Houston, TX 77001',
      statusColor: '#193CB8',
      priorityColor: '#9F0712',
      startCoordinates: {latitude: 29.7604, longitude: -95.3698},
      destinationCoordinates: {latitude: 29.713, longitude: -95.399},
    },
    {
      id: 'JOB-002',
      title: 'Commercial Lighting Installation',
      description: 'Install LED lighting system in conference rooms',
      status: 'Scheduled',
      priority: 'MEDIUM',
      technician: 'TechCorp Office',
      time: '14:00 (6h est.)',
      location: '1500 Corporate Blvd, Houston, TX 77002',
      statusColor: '#016630',
      priorityColor: '#894B00',
      startCoordinates: {latitude: 29.7604, longitude: -95.3698},
      destinationCoordinates: {latitude: 29.757, longitude: -95.37},
    },
  ];

  const upcomingJobs = [
    {
      id: 'JOB-003',
      title: 'Emergency Generator Maintenance',
      date: '1/26/2024 at 09:00',
      priority: 'high',
      client: 'Metro Hospital',
      duration: '4h',
      priorityColor: '#9F0712',
    },
  ];

  const handleQuickActionPress = title => {
    if (title == 'Create Job') {
      navigation.navigate('CreateJobScreen'); // replace 'CreateJob' with your actual screen name
    } else if (title == 'View Reports') {
      navigation.navigate('ReportsScreen');
    } else if (title == 'Generate Invoice'){
      navigation.navigate('InvoiceScreen')
    }else if (title == 'Check Warranty'){
      navigation.navigate('WarrantyChecker')
    }

    // You can add other conditions here for other actions
    else if (title == 'View Jobs') {
      navigation.navigate('JobStack');
    } else if (title == 'Support Center') {
      navigation.navigate('SupportScreen');
    }
  };

  const renderStatsCard = (item, index) => (
    <View key={index} style={styles.statsCard}>
      {/* <View style={[styles.headerCircle, styles.topRightCircle, {overflow:"hidden"}]} /> */}

      <View
        style={[
          styles.statsIconContainer,
          {display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8},
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
    </View>
  );

  const renderQuickAction = (item, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.quickActionButton, {backgroundColor: item.color}]}
      onPress={() => handleQuickActionPress(item.title)}>
      <View style={[styles.quickActionIcon, {backgroundColor: item.color}]}>
        <Text style={styles.quickActionIconText}>{item.icon}</Text>
      </View>
      <Text style={styles.quickActionText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderJobCard = item => (
    <TouchableOpacity
      onPress={() => navigation.navigate('JobDetail', {job: item})}
      key={item.id}
      style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <View style={styles.jobHeaderLeft}>
          <Text style={styles.jobId}>{item.id}</Text>
          <View style={[styles.statusBadge, {backgroundColor: '#E3F2FD'}]}>
            <Text style={[styles.statusText, {color: item.statusColor}]}>
              {item.status}
            </Text>
          </View>
          <View style={[styles.priorityBadge, {backgroundColor: '#ECEEF2'}]}>
            <Text style={[styles.priorityText, {color: item.priorityColor}]}>
              {item.priority}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.jobDescription}>{item.description}</Text>
      <View style={styles.jobDetails}>
        <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
          <View style={styles.jobDetailRow}>
            <Text style={styles.jobDetailIcon}>
              {' '}
              <Feather name="user" size={18} color={tabColor} />{' '}
            </Text>
            <Text style={styles.jobDetailText}>{item.technician}</Text>
          </View>
          <View style={styles.jobDetailRow}>
            <Text style={styles.jobDetailIcon}>
              <Ionicons name="timer-outline" size={18} color={tabColor} />
            </Text>
            <Text style={styles.jobDetailText}>{item.time}</Text>
          </View>
        </View>
        <View style={styles.jobDetailRow}>
          <Text style={styles.jobDetailIcon}>
            <Feather name="map-pin" size={18} color={tabColor} />
          </Text>
          <Text style={styles.jobDetailText}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderUpcomingJob = item => (
    <View key={item.id} style={styles.upcomingJobCard}>
      <View style={styles.upcomingJobHeader}>
        <View style={styles.upcomingJobLeft}>
          <Text style={styles.upcomingJobId}>{item.id}</Text>
          <View style={[styles.priorityBadge, {backgroundColor: '#ECEEF2'}]}>
            <Text style={[styles.priorityText, {color: item.priorityColor}]}>
              {item.priority}
            </Text>
          </View>
        </View>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </View>
      <Text style={styles.upcomingJobTitle}>{item.title}</Text>
      <View style={styles.upcomingJobDetails}>
        <View style={styles.jobDetailRow}>
          <Text style={styles.jobDetailIcon}>
            <Feather name="map-pin" size={18} color={tabColor} />
          </Text>
          <Text style={styles.jobDetailText}>{item.client}</Text>
        </View>
        <View style={styles.jobDetailRow}>
          <Text style={styles.jobDetailIcon}>
            {' '}
            <Ionicons name="timer-outline" size={18} color={tabColor} />
          </Text>
          <Text style={styles.jobDetailText}>{item.duration}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar backgroundColor="#155DFC" barStyle="light-content" /> */}

      <ScrollView style={{}} showsVerticalScrollIndicator={false}>
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
              <Text style={styles.greeting}>Good afternoon, Sarah!</Text>
              <View style={styles.roleContainer}>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>Lead Labor</Text>
                </View>
                <Text style={styles.dateText}>• Tuesday, Jul 29</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.avatar} onPress={()=> navigation.navigate("ProfileScreen")}>
                <Text style={styles.avatarText}>SJ</Text>
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
                {/* <Text style={styles.notificationIcon}>🔔</Text> */}
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>3</Text>
                </View>
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
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
              <View style={styles.accessBadge}>
                <Text style={styles.accessText}>Lead Access</Text>
              </View>
            </View>
            <View style={styles.quickActionsGrid}>
              {quickActions?.map(renderQuickAction)}
            </View>
          </View>

          {/* Today's Jobs */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                <AntDesign name="calendar" size={18} color={tabColor} /> Today's
                Jobs
              </Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>2</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('JobStack')}>
                <Text style={styles.viewAllText}>View All →</Text>
              </TouchableOpacity>
            </View>
            {todaysJobs?.map(renderJobCard)}
          </View>

          {/* Upcoming Jobs */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                <Feather name="clock" size={20} color={tabColor} /> Upcoming
                Jobs
              </Text>
              <View style={[styles.countBadge, {backgroundColor: '#F0FDF4'}]}>
                <Text style={[styles.countText, {color: '#008236'}]}>1</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All →</Text>
              </TouchableOpacity>
            </View>
            {upcomingJobs.map(renderUpcomingJob)}
          </View>

          {/* Team Performance */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                <Entypo name="users" size={24} color={tabColor} /> Team
                Performance Overview
              </Text>
              <View style={styles.dashboardBadge}>
                <Text style={styles.dashboardText}>Lead Dashboard</Text>
              </View>
            </View>
            <View style={styles.performanceCards}>
              <View
                style={[styles.performanceCard, {backgroundColor: '#F0FDF4'}]}>
                <View style={styles.performanceIcon}>
                  <Text>✅</Text>
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
                  <Text>
                    {' '}
                    <Entypo name="users" size={24} color={tabColor} />
                  </Text>
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
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    marginBottom: 100,
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
    marginRight: 8,
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  dateText: {
    color: 'rgba(255,255,255,0.8)',
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
  avatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#101828',
    flex: 1,
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
  upcomingJobDetails: {
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
    backgroundColor: '#FFFFFF',
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
