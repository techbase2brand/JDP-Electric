import React, {useState, useMemo, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  StatusBar,
  SafeAreaView,
  Platform,
  UIManager,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {tabColor} from '../constants/Color';
import {widthPercentageToDP} from '../utils';
import {getBlueSheets} from '../config/apiConfig';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const TimesheetScreen = ({navigation, user, jobs}) => {
  const token = useSelector(state => state.user.token);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blueSheetData, setBlueSheetData] = useState([]);

  // Mock comprehensive timesheet data across all jobs
  const allTimesheets = [
    {
      id: 'TS-2024-001',
      jobId: 'JDP-2024-001',
      jobTitle: 'Electrical Panel Upgrade',
      customer: 'ABC Manufacturing',
      date: '2024-01-15',
      submittedAt: '2024-01-15T18:00:00Z',
      approvedAt: '2024-01-16T09:30:00Z',
      approvedBy: 'Sarah Johnson',
      status: 'approved',
      labourHours: 8.5,
      labourCost: 680.0,
      materialCost: 450.0,
      additionalCharges: 75.0,
      totalCost: 1205.0,
      assignedTo: ['Mike Wilson', 'David Chen'],
      submittedBy: 'Sarah Johnson',
      employeeId: 'JDP002',
      location: '1234 Oak Street, Houston, TX',
      priority: 'high',
    },
    {
      id: 'TS-2024-002',
      jobId: 'JDP-2024-002',
      jobTitle: 'Commercial Lighting Retrofit',
      customer: 'TechCorp Office Building',
      date: '2024-01-16',
      submittedAt: '2024-01-16T17:45:00Z',
      status: 'submitted',
      labourHours: 6.0,
      labourCost: 480.0,
      materialCost: 320.0,
      additionalCharges: 25.0,
      totalCost: 825.0,
      assignedTo: ['Lisa Rodriguez', 'James Mitchell'],
      submittedBy: 'Sarah Johnson',
      employeeId: 'JDP003',
      location: '567 Corporate Dr, Houston, TX',
      priority: 'medium',
    },
    {
      id: 'TS-2024-003',
      jobId: 'JDP-2024-003',
      jobTitle: 'Emergency Generator Maintenance',
      customer: 'Metro Hospital',
      date: '2024-01-12',
      submittedAt: '2024-01-12T16:20:00Z',
      approvedAt: '2024-01-13T08:15:00Z',
      approvedBy: 'Sarah Johnson',
      status: 'approved',
      labourHours: 4.5,
      labourCost: 450.0,
      materialCost: 180.0,
      additionalCharges: 50.0,
      totalCost: 680.0,
      assignedTo: ['Tom Anderson'],
      submittedBy: 'Sarah Johnson',
      employeeId: 'JDP004',
      location: '890 Medical Center Blvd, Houston, TX',
      priority: 'high',
    },
    {
      id: 'TS-2024-004',
      jobId: 'JDP-2024-004',
      jobTitle: 'Security System Wiring',
      customer: 'Retail Mall Complex',
      date: '2024-01-18',
      submittedAt: '2024-01-18T19:00:00Z',
      status: 'submitted',
      labourHours: 7.0,
      labourCost: 560.0,
      materialCost: 280.0,
      additionalCharges: 40.0,
      totalCost: 880.0,
      assignedTo: ['Sarah Johnson', 'David Chen'],
      submittedBy: 'Sarah Johnson',
      employeeId: 'JDP005',
      location: '777 Shopping Center Dr, Houston, TX',
      priority: 'medium',
    },
    // {
    //   id: 'TS-2024-005',
    //   jobId: 'JDP-2024-005',
    //   jobTitle: 'Office Building Rewiring',
    //   customer: 'Downtown Business Center',
    //   date: '2024-01-10',
    //   submittedAt: '2024-01-10T17:30:00Z',
    //   status: 'rejected',
    //   rejectionReason:
    //     'Material costs seem excessive. Please review and resubmit with detailed breakdown.',
    //   labourHours: 12.0,
    //   labourCost: 960.0,
    //   materialCost: 800.0,
    //   additionalCharges: 120.0,
    //   totalCost: 1880.0,
    //   assignedTo: ['Mike Wilson', 'Tom Anderson', 'James Mitchell'],
    //   submittedBy: 'Sarah Johnson',
    //   employeeId: 'JDP002',
    //   location: '456 Business Ave, Houston, TX',
    //   priority: 'low',
    // },
    {
      id: 'TS-2024-006',
      jobId: 'JDP-2024-006',
      jobTitle: 'Data Center Power Installation',
      customer: 'CloudTech Data Center',
      date: '2024-01-19',
      submittedAt: '2024-01-19T20:15:00Z',
      status: 'submitted',
      labourHours: 16.0,
      labourCost: 1280.0,
      materialCost: 950.0,
      additionalCharges: 200.0,
      totalCost: 2430.0,
      assignedTo: ['Sarah Johnson', 'Sarah Johnsonn', 'David Chen'],
      submittedBy: 'Sarah Johnson',
      employeeId: 'JDP001',
      location: '999 Tech Park Dr, Houston, TX',
      priority: 'high',
    },
  ];

  // Filter and sort timesheets
  const filteredTimesheets = useMemo(() => {
    let filtered = blueSheetData;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        timesheet => timesheet.status === statusFilter,
      );
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        timesheet =>
          timesheet?.job?.job_title.toLowerCase().includes(query) ||
          timesheet?.job?.customer?.customer_name
            ?.toLowerCase()
            .includes(query),
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'submitted':
          return (
            new Date(b.submittedAt).getTime() -
            new Date(a.submittedAt).getTime()
          );
        case 'cost':
          return b.totalCost - a.totalCost;
        case 'customer':
          return a.customer.localeCompare(b.customer);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allTimesheets, statusFilter, searchQuery, sortBy]);

  const toggleJobExpansion = jobId => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };
  useFocusEffect(
    useCallback(() => {
      const fetchBlueSheet = async () => {
        if (loading) return;
        setLoading(true);
        try {
          const res = await getBlueSheets(token);
          const blue = Array.isArray(res)
            ? res
            : res?.data ?? res?.items ?? res?.rows ?? [];

          console.log('✅ full response:', res);
          console.log('✅ normalized rows:', blue.bluesheets);

          setBlueSheetData(blue.bluesheets);
        } catch (err) {
          console.error('Error fetching bluesheets:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchBlueSheet();

      // Cleanup optional (e.g. reset state)
      return () => {};
    }, [token]), // dependencies if needed
  );

  // Helper functions
  const getStatusColor = status => {
    switch (status) {
      case 'draft':
        return {backgroundColor: '#f3f4f6', color: '#374151'};
      case 'submitted':
        return {backgroundColor: '#dbeafe', color: '#1d4ed8'};
      case 'approved':
        return {backgroundColor: '#dcfce7', color: '#166534'};
      case 'rejected':
        return {backgroundColor: '#fee2e2', color: '#dc2626'};
      default:
        return {backgroundColor: '#f3f4f6', color: '#374151'};
    }
  };

  const formatDateTime = dateString => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      // hour: 'numeric',
      // minute: '2-digit',
      // hour12: true,
    });
  };

  const handleViewTimesheet = timesheet => {
    navigation.navigate('ViewTimesheet', {timesheet});
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#3B82F6" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>All Bluesheets</Text>
          <Text style={styles.headerSubtitle}>
            {/* {filteredTimesheets.length} of {allTimesheets.length} timesheets */}
          </Text>
        </View>

        {/* <View style={styles.headerSpacer} /> */}
      </View>
      {loading ? (
        <ActivityIndicator color="#3B82F6" style={{marginTop: 40}} />
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Filters and Search */}
          <View style={styles.filtersCard}>
            {/* Search */}
            <View style={styles.searchContainer}>
              <Feather name="search" size={20} color={'#6b7280'} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by job name and customer name"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#6b7280"
              />
            </View>
          </View>

          {/* Timesheets List */}
          <View style={styles.timesheetsList}>
            {filteredTimesheets?.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>📋</Text>
                <Text style={styles.emptyStateTitle}>
                  {searchQuery
                    ? 'No matching timesheets found'
                    : 'No timesheets found'}
                </Text>
                <Text style={styles.emptyStateSubtitle}>
                  {searchQuery
                    ? 'Try adjusting your search terms or filters.'
                    : 'Timesheets will appear here once they are submitted.'}
                </Text>
              </View>
            ) : (
              filteredTimesheets?.map(timesheet => {
                const isExpanded = expandedJobId === timesheet.id;
                return (
                  <View key={timesheet?.id} style={styles.timesheetCard}>
                    {/* Header */}
                    <View style={styles.timesheetHeader}>
                      <View style={styles.timesheetTitleContainer}>
                        <View style={styles.timesheetBadges}>
                          <Text style={styles.timesheetId}>
                            {timesheet?.job?.job_title}
                          </Text>
                          <View
                            style={[
                              styles.statusBadge,
                              getStatusColor(timesheet?.status),
                            ]}>
                            <Text style={styles.statusIcon}>
                              {/* {getStatusIcon(timesheet?.status)} */}
                            </Text>
                            <Text
                              style={[
                                styles.statusBadgeText,
                                {
                                  color: getStatusColor(timesheet?.status)
                                    .color,
                                },
                              ]}>
                              {timesheet?.status?.toUpperCase() || 'Pending'}
                            </Text>
                          </View>
                          {/* <View
                          style={[
                            styles.priorityBadge,
                            getPriorityColor(timesheet.priority),
                          ]}>
                          <Text
                            style={[
                              styles.priorityBadgeText,
                              {
                                color: getPriorityColor(timesheet.priority)
                                  .color,
                              },
                            ]}>
                            {timesheet.priority.toUpperCase()}
                          </Text>
                        </View> */}
                        </View>
                        <Text style={styles.timesheetTitle}>
                          {timesheet.jobTitle}
                        </Text>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text style={styles.timesheetCustomer}>
                            {timesheet?.job?.customer?.customer_name}
                          </Text>
                          {/* <TouchableOpacity
                          onPress={() => toggleJobExpansion(timesheet.id)}>
                          <MaterialIcons
                            name={
                              isExpanded
                                ? 'keyboard-arrow-up'
                                : 'keyboard-arrow-down'
                            }
                            size={28}
                            color="#6B7280"
                          />
                        </TouchableOpacity> */}
                        </View>
                      </View>
                    </View>

                    {/* Details Grid */}
                    {/* {isExpanded && ( */}
                    <View style={styles.detailsGrid}>
                      <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                          <AntDesign
                            name="calendar"
                            size={18}
                            color={tabColor}
                          />
                          <Text style={styles.detailText}>
                            Job Date: {timesheet?.date}
                          </Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Feather name="clock" size={20} color={tabColor} />
                          <Text style={styles.detailText}>
                            Hours:{' '}
                            {timesheet?.labor_entries?.reduce((sum, item) => {
                              const hours =
                                parseFloat(
                                  item?.total_hours?.replace('h', ''),
                                ) || 0;
                              return sum + hours;
                            }, 0)}
                            h
                          </Text>
                        </View>
                      </View>
                      <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                          <Feather name="user" size={20} color={tabColor} />
                          <Text style={styles.detailText}>
                            By: {timesheet?.created_by_user?.full_name}
                          </Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Feather name="users" size={20} color={tabColor} />
                          <Text style={styles.detailText}>
                            Team: {timesheet?.labor_entries?.length}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {/* // )} */}

                    {/* Status-specific information */}
                    {timesheet?.status === 'approved' &&
                      timesheet?.approvedAt && (
                        <View style={styles.statusInfo}>
                          <View style={styles.statusInfoIcon}>
                            <FontAwesome
                              name="check-circle"
                              size={18}
                              color="#166534"
                            />
                          </View>
                          <Text style={styles.statusInfoText}>
                            Approved by {timesheet?.approvedBy} on{' '}
                            {formatDateTime(timesheet?.approvedAt)}
                          </Text>
                        </View>
                      )}

                    {/* {timesheet.status === 'rejected' &&
                    timesheet.rejectionReason && (
                      <View
                        style={[
                          styles.statusInfo,
                          {backgroundColor: '#fee2e2'},
                        ]}>
                        <View style={styles.statusInfoIcon}>
                          <MaterialIcons
                            name="warning-amber"
                            size={24}
                            color="#dc2626"
                          />
                        </View>
                        <View style={{width: widthPercentageToDP(70)}}>
                          <Text
                            style={[
                              styles.statusInfoText,
                              {color: '#dc2626', fontWeight: '600'},
                            ]}>
                            Rejected
                          </Text>
                          <Text
                            style={[styles.statusInfoText, {color: '#dc2626'}]}>
                            {timesheet.rejectionReason}
                          </Text>
                        </View>
                      </View>
                    )} */}

                    {/* Footer */}
                    <View style={styles.timesheetFooter}>
                      <Text style={styles.submittedText}>
                        Submitted {formatDateTime(timesheet.created_at)}
                      </Text>
                      <TouchableOpacity
                        style={[styles.viewButton]}
                        onPress={() => handleViewTimesheet(timesheet)}>
                        <Feather name="eye" size={20} color={tabColor} />
                        <Text
                          style={[
                            styles.viewButtonText,

                            styles.viewButtonTextSecondary,
                          ]}>
                          {'View (Read-only)'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </View>

          {/* Bottom spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    marginBottom: 100,
  },
  header: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 20,
    justifyContent: 'center',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#93c5fd',
    fontSize: 14,
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconText: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  filtersCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#f9fafb',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dropdownContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 1000,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6b7280',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 2000,
  },
  dropdownMenuItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownMenuItemSelected: {
    backgroundColor: '#3B82F6',
  },
  dropdownMenuItemText: {
    fontSize: 14,
    color: '#111827',
  },
  dropdownMenuItemTextSelected: {
    color: 'white',
  },
  timesheetsList: {
    paddingHorizontal: 16,
  },
  emptyState: {
    backgroundColor: 'white',
    padding: 48,
    borderRadius: 12,
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
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  timesheetCard: {
    backgroundColor: 'white',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timesheetHeader: {
    marginBottom: 12,
  },
  timesheetTitleContainer: {
    flex: 1,
  },
  timesheetBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  timesheetId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  statusIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  priorityBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timesheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    // marginBottom: 4,
  },
  timesheetCustomer: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailsGrid: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
    marginLeft: 10,
  },
  costBreakdown: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  costRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  costItem: {
    flex: 1,
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  costValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  costTotal: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
    alignItems: 'center',
  },
  costTotalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  statusInfo: {
    backgroundColor: '#dcfce7',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statusInfoIcon: {
    marginRight: 12,
  },
  statusInfoText: {
    fontSize: 14,
    color: '#166534',
    flex: 1,
  },
  timesheetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submittedText: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewButtonPrimary: {
    backgroundColor: '#3B82F6',
  },
  viewButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  viewButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  viewButtonText: {
    fontSize: 14,
    marginLeft: 10,
    fontWeight: '600',
  },
  viewButtonTextPrimary: {
    color: 'white',
  },
  viewButtonTextSecondary: {
    color: '#6b7280',
  },
  bottomSpacing: {
    // height: ,
  },
});

export default TimesheetScreen;
