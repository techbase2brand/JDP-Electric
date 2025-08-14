import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';


import { tabColor } from '../constants/Color';

const {width} = Dimensions.get('window');

const ActivitySummaryScreen = ({navigation, route}) => {
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
  };
  const [filterPeriod, setFilterPeriod] = useState('month');

  // Safe navigation handler
  const handleNavigation = screen => {
    try {
      if (navigation && typeof navigation.navigate === 'function') {
        navigation.navigate(screen);
      } else {
        console.warn('Navigation function not available');
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  // Mock job activity data - exactly matching web version
  const [jobActivities] = useState([
    {
      id: '1',
      jobId: 'JDP-2024-001',
      title: 'Electrical Panel Upgrade',
      customer: 'ABC Manufacturing',
      date: '2025-08-14',
      actualTimeSpent: 8.5,
      updatedTimeSpent: 8.0,
      assignedTo: ['Mike Wilson', 'David Chen'],
      status: 'completed',
      createdAt: '2024-01-15T08:00:00Z',
      timeLogs: [
        {
          id: 'tl1',
          personName: 'Mike Wilson',
          personRole: 'Labor',
          actualTime: 4.5,
          updatedTime: 4.0,
          date: '2024-01-15',
          startTime: '08:00 AM',
          endTime: '12:30 PM',
        },
        {
          id: 'tl2',
          personName: 'David Chen',
          personRole: 'Labor',
          actualTime: 4.0,
          date: '2024-01-15',
          startTime: '12:30 PM',
          endTime: '04:30 PM',
        },
      ],
    },
    {
      id: '2',
      jobId: 'JDP-2024-002',
      title: 'Outlet Installation Project',
      customer: 'XYZ Office Complex',
      date: '2024-01-16',
      actualTimeSpent: 3.0,
      assignedTo: ['Lisa Rodriguez'],
      status: 'in-progress',
      createdAt: '2024-01-16T09:00:00Z',
      timeLogs: [
        {
          id: 'tl3',
          personName: 'Lisa Rodriguez',
          personRole: 'Labor',
          actualTime: 3.0,
          date: '2024-01-16',
          startTime: '09:00 AM',
          endTime: '12:00 PM',
        },
      ],
    },
    {
      id: '3',
      jobId: 'JDP-2024-003',
      title: 'LED Lighting Installation',
      customer: 'GHI Retail Store',
      date: '2024-01-12',
      actualTimeSpent: 3.0,
      assignedTo: ['Tom Anderson'],
      status: 'completed',
      createdAt: '2024-01-12T10:00:00Z',
      timeLogs: [
        {
          id: 'tl4',
          personName: 'Tom Anderson',
          personRole: 'Labor',
          actualTime: 3.0,
          date: '2024-01-12',
          startTime: '10:00 AM',
          endTime: '01:00 PM',
        },
      ],
    },
    {
      id: '4',
      jobId: 'JDP-2024-004',
      title: 'Emergency Repair Service',
      customer: 'DEF Hospital',
      date: '2024-01-14',
      actualTimeSpent: 6.0,
      updatedTimeSpent: 5.5,
      assignedTo: ['Sarah Johnson'],
      status: 'completed',
      createdAt: '2024-01-14T07:00:00Z',
      timeLogs: [
        {
          id: 'tl5',
          personName: 'Sarah Johnson',
          personRole: 'Lead Labor',
          actualTime: 6.0,
          updatedTime: 5.5,
          date: '2024-01-14',
          startTime: '07:00 AM',
          endTime: '01:00 PM',
        },
      ],
    },
    {
      id: '5',
      jobId: 'JDP-2024-005',
      title: 'Wiring Installation',
      customer: 'JKL Data Center',
      date: '2024-01-18',
      actualTimeSpent: 4.5,
      assignedTo: ['Mike Wilson', 'David Chen'],
      status: 'in-progress',
      createdAt: '2024-01-18T06:00:00Z',
      timeLogs: [
        {
          id: 'tl6',
          personName: 'Mike Wilson',
          personRole: 'Labor',
          actualTime: 2.5,
          date: '2024-01-18',
          startTime: '06:00 AM',
          endTime: '08:30 AM',
        },
        {
          id: 'tl7',
          personName: 'David Chen',
          personRole: 'Labor',
          actualTime: 2.0,
          date: '2024-01-18',
          startTime: '08:30 AM',
          endTime: '10:30 AM',
        },
      ],
    },
  ]);

  // Debug: Log the data
  console.log('🔍 Debug: jobActivities length:', jobActivities.length);
  console.log('🔍 Debug: jobActivities:', jobActivities);

  // Filter jobs based on selected period - exact match with web version
  const filteredJobs = useMemo(() => {
    console.log('🔍 Debug: Filtering jobs for period:', filterPeriod);

    if (!jobActivities || !Array.isArray(jobActivities)) {
      console.warn('jobActivities is not a valid array:', jobActivities);
      return [];
    }

    try {
      const now = new Date();
      const cutoffDate = new Date();

      switch (filterPeriod) {
         case 'today':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          cutoffDate.setMonth(now.getMonth() - 1);
      }

      console.log('🔍 Debug: cutoffDate:', cutoffDate);

      // Temporarily return all jobs for debugging
      const filtered = jobActivities.filter(job => {
        if (!job || !job.createdAt) {
          console.warn('Invalid job data:', job);
          return false;
        }

        try {
          const jobDate = new Date(job.createdAt);
          const isInRange = jobDate >= cutoffDate;
          console.log(
            '🔍 Debug: Job',
            job.jobId,
            'date:',
            jobDate,
            'in range:',
            isInRange,
          );
          // Temporarily return all jobs to see if data shows up
          return true; // Changed from isInRange to true
        } catch (error) {
          console.warn('Invalid date format for job:', job.createdAt);
          return false;
        }
      });

      console.log('🔍 Debug: filtered jobs count:', filtered.length);
      return filtered;
    } catch (error) {
      console.error('Error filtering jobs:', error);
      return [];
    }
  }, [jobActivities, filterPeriod]);

  // Calculate summary statistics - exact match with web version
  const summaryStats = useMemo(() => {
    if (!filteredJobs || !Array.isArray(filteredJobs)) {
      return {
        totalCompleted: 0,
        totalTimeSpent: 0,
        totalJobs: 0,
      };
    }

    try {
      const completedJobs = filteredJobs.filter(
        job => job && job.status === 'completed',
      );

      const totalCompleted = completedJobs.length;
      const totalTimeSpent = completedJobs.reduce((sum, job) => {
        if (!job) return sum;
        const timeSpent = job.updatedTimeSpent || job.actualTimeSpent || 0;
        return sum + timeSpent;
      }, 0);

      return {
        totalCompleted,
        totalTimeSpent: Math.round(totalTimeSpent * 10) / 10,
        totalJobs: filteredJobs.length,
      };
    } catch (error) {
      console.error('Error calculating summary stats:', error);
      return {
        totalCompleted: 0,
        totalTimeSpent: 0,
        totalJobs: 0,
      };
    }
  }, [filteredJobs]);

  // Helper functions - exact match with web version
  const getStatusColor = status => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'in-progress':
        return '#3B82F6';
      case 'pending':
        return '#EAB308';
      default:
        return '#6B7280';
    }
  };

  const formatDate = dateString => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      console.warn('Invalid date format:', dateString);
      return 'Invalid Date';
    }
  };

  // Debug: Log what we're about to render
  console.log('🔍 Debug: About to render - filteredJobs:', filteredJobs);
  console.log('🔍 Debug: About to render - summaryStats:', summaryStats);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

      {/* Header - exact match with web version */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleNavigation('HomeScreen')}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Activity Summary</Text>
          <Text style={styles.headerSubtitle}>
            {filteredJobs && Array.isArray(filteredJobs)
              ? filteredJobs.length
              : 0}{' '}
            jobs • {filterPeriod}
          </Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Filter Tabs - exact match with web version */}
        <View style={styles.filterContainer}>
          {['today','week', 'month', 'year'].map(period => (
            <TouchableOpacity
              key={period}
              style={[
                styles.filterTab,
                filterPeriod === period && styles.filterTabActive,
              ]}
              onPress={() => setFilterPeriod(period)}>
              <Text
                style={[
                  styles.filterTabText,
                  filterPeriod === period && styles.filterTabTextActive,
                ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.content}>
          {/* Summary Stats - exact match with web version */}
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryCardContent}>
                <View style={styles.summaryIconContainer}>
                  <View
                    style={[styles.summaryIcon, {backgroundColor: '#DCFCE7'}]}>
                    <Icon
                      name="check-circle"
                      size={24}
                      color={Colors.success}
                    />
                  </View>
                  <View>
                    <Text style={styles.summaryValue}>
                      {summaryStats.totalCompleted}
                    </Text>
                    <Text style={styles.summaryLabel}>Jobs Completed</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryCardContent}>
                <View style={styles.summaryIconContainer}>
                  <View
                    style={[styles.summaryIcon, {backgroundColor: '#DBEAFE'}]}>
                    {/* <Text style={styles.summaryIconText}>⏰</Text> */}
                    <Icon name="schedule" size={24} color={Colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.summaryValue}>
                      {summaryStats.totalTimeSpent}h
                    </Text>
                    <Text style={styles.summaryLabel}>Total Time Spent</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Job Activities List - exact match with web version */}
          <View style={styles.activitiesSection}>
            <View style={styles.activitiesHeader}>
              <Text style={styles.activitiesTitle}>Job Activities</Text>
              <Text style={styles.activitiesCount}>
                {filteredJobs && Array.isArray(filteredJobs)
                  ? filteredJobs.length
                  : 0}{' '}
                jobs
              </Text>
            </View>

            {!filteredJobs ||
            !Array.isArray(filteredJobs) ||
            filteredJobs.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>⚠️</Text>
                <Text style={styles.emptyStateTitle}>No activities found</Text>
                <Text style={styles.emptyStateText}>
                  No job activities in the selected {filterPeriod} period.
                </Text>
              </View>
            ) : (
              <View style={styles.jobsList}>
                {filteredJobs && Array.isArray(filteredJobs)
                  ? filteredJobs.map(job => {
                      // Exact null checking logic from web version
                      if (!job || typeof job !== 'object') {
                        console.warn('Invalid job object:', job);
                        return null;
                      }

                      const jobId = job.jobId || job.id || 'Unknown ID';
                      const jobTitle = job.title || 'Untitled Job';
                      const jobCustomer = job.customer || 'Unknown Customer';
                      const jobStatus = job.status || 'pending';
                      const actualTime =
                        typeof job.actualTimeSpent === 'number'
                          ? job.actualTimeSpent
                          : 0;
                      const updatedTime =
                        typeof job.updatedTimeSpent === 'number'
                          ? job.updatedTimeSpent
                          : null;

                      const hasTimeModification =
                        updatedTime !== null && updatedTime !== actualTime;
                      const timeDifference = hasTimeModification
                        ? actualTime - updatedTime
                        : 0;

                      return (
                        <View
                          key={job.id || `job-${Math.random()}`}
                          style={styles.jobCard}>
                          {/* Job Header */}
                          <View style={styles.jobHeader}>
                            <View style={styles.jobBadges}>
                              <Text style={styles.jobId}>{jobId}</Text>
                              <View
                                style={[
                                  styles.statusBadge,
                                  {backgroundColor: getStatusColor(jobStatus)},
                                ]}>
                                <Text style={styles.statusBadgeText}>
                                  {jobStatus.toUpperCase()}
                                </Text>
                              </View>
                            </View>
                            <Text style={styles.jobTitle}>{jobTitle}</Text>
                            <Text style={styles.jobCustomer}>
                              {jobCustomer}
                            </Text>
                          </View>

                          {/* Date */}
                          <View style={styles.jobDateRow}>
                            <AntDesign name="calendar" size={18} color={tabColor} />
                            {/* <Text style={styles.jobDateIcon}>📅</Text> */}
                            <Text style={styles.jobDateText}>
                              {formatDate(job.date || job.createdAt || '')}
                            </Text>
                          </View>

                          {/* Time Section */}
                          <View style={styles.timeSection}>
                            <View style={styles.timeRow}>
                              <Text style={styles.timeLabel}>Actual Time:</Text>
                              <Text style={styles.timeValue}>
                                {actualTime}h
                              </Text>
                            </View>

                            {hasTimeModification && (
                              <>
                                <View style={styles.timeRow}>
                                  <Text style={styles.timeLabel}>
                                    Updated Time:
                                  </Text>
                                  <Text style={styles.timeValue}>
                                    {updatedTime}h
                                  </Text>
                                </View>
                                <View style={styles.timeModificationContainer}>
                                  <View
                                    style={[
                                      styles.timeModificationBadge,
                                      {
                                        backgroundColor:
                                          timeDifference > 0
                                            ? '#FEE2E2'
                                            : '#D1FAE5',
                                      },
                                    ]}>
                                    <Text
                                      style={[
                                        styles.timeModificationText,
                                        {
                                          color:
                                            timeDifference > 0
                                              ? '#DC2626'
                                              : '#059669',
                                        },
                                      ]}>
                                      {timeDifference > 0 ? '-' : '+'}
                                      {Math.abs(timeDifference)}h Modified
                                    </Text>
                                  </View>
                                </View>
                              </>
                            )}
                          </View>

                          {/* Assigned To */}
                          <View style={styles.assignedToRow}>
                             <Feather name="users" size={18} color={tabColor} />
                            {/* <Text style={styles.assignedToIcon}>👥</Text> */}
                            <Text style={styles.assignedToText}>
                              Assigned to:{' '}
                              {job.assignedTo &&
                              Array.isArray(job.assignedTo) &&
                              job.assignedTo.length > 0
                                ? job.assignedTo.join(', ')
                                : 'Not assigned'}
                            </Text>
                          </View>
                        </View>
                      );
                    })
                  : []}
              </View>
            )}
          </View>

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    marginBottom:100
  },
  header: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 20,
  },
  backButton: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#BFDBFE',
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryCardContent: {
    padding: 16,
  },
  summaryIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryIconText: {
    fontSize: 20,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  activitiesSection: {
    gap: 16,
  },
  activitiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activitiesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  activitiesCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  jobsList: {
    gap: 16,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobHeader: {
    marginBottom: 12,
  },
  jobBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  jobId: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  jobCustomer: {
    fontSize: 14,
    color: '#6B7280',
  },
  jobDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  jobDateIcon: {
    fontSize: 16,
  },
  jobDateText: {
    fontSize: 14,
    color: '#6B7280',
  },
  timeSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  timeModificationContainer: {
    alignItems: 'flex-end',
  },
  timeModificationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  timeModificationText: {
    fontSize: 10,
    fontWeight: '600',
  },
  assignedToRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  assignedToIcon: {
    fontSize: 16,
  },
  assignedToText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  bottomSpacer: {
    height: 24,
  },
});

export default ActivitySummaryScreen;
