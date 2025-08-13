import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {widthPercentageToDP} from '../utils';

// JDP Electrics Colors
const COLORS = {
  primary: '#3B82F6',
  primaryDark: '#1E40AF',
  primaryLight: '#93C5FD',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  blue50: '#EFF6FF',
  blue100: '#DBEAFE',
  green50: '#ECFDF5',
  green100: '#D1FAE5',
  yellow50: '#FFFBEB',
  yellow100: '#FEF3C7',
  red50: '#FEF2F2',
  red100: '#FEE2E2',
};

const JobListingScreen = ({user, onNavigate, onStartTimer, navigation}) => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active');

  // Load mock job data
  useEffect(() => {
    const mockJobs = [
      {
        id: '1',
        jobId: 'JDP-2024-001',
        title: 'Electrical Panel Upgrade',
        customer: {
          name: 'ABC Manufacturing',
          address: '1234 Industrial Blvd, Houston, TX 77001',
          phone: '+1 (555) 0101',
        },
        status: 'active',
        priority: 'high',
        scheduledDate: '2024-01-15',
        scheduledTime: '08:00 AM',
        assignedTo: ['Sarah Johnson', 'Mike Wilson'],
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
      {
        id: '2',
        jobId: 'JDP-2024-002',
        title: 'Outlet Installation Project',
        customer: {
          name: 'XYZ Office Complex',
          address: '5678 Business Dr, Dallas, TX 75201',
          phone: '+1 (555) 0102',
        },
        status: 'assigned',
        priority: 'medium',
        scheduledDate: '2024-01-16',
        scheduledTime: '09:00 AM',
        assignedTo: ['David Chen'],
        specialInstructions:
          'Install GFCI outlets in conference rooms. Coordinate with building manager.',
        tags: ['Outlets', 'GFCI', 'Office'],
        location: {
          latitude: 32.7767,
          longitude: -96.797,
          address: '5678 Business Dr, Dallas, TX 75201',
        },
        estimatedHours: 4,
      },
      {
        id: '3',
        jobId: 'JDP-2024-003',
        title: 'Emergency Lighting Repair',
        customer: {
          name: 'DEF Hospital',
          address: '9876 Medical Center Dr, Austin, TX 78701',
          phone: '+1 (555) 0103',
        },
        status: 'pending',
        priority: 'high',
        scheduledDate: '2024-01-14',
        scheduledTime: '07:00 AM',
        assignedTo: ['Lisa Rodriguez'],
        specialInstructions:
          'Critical infrastructure repair. Hospital environment - follow safety protocols.',
        tags: ['Emergency', 'Lighting', 'Hospital', 'Critical'],
        location: {
          latitude: 30.2672,
          longitude: -97.7431,
          address: '9876 Medical Center Dr, Austin, TX 78701',
        },
        estimatedHours: 6,
      },
      {
        id: '4',
        jobId: 'JDP-2024-004',
        title: 'LED Lighting Installation',
        customer: {
          name: 'GHI Retail Store',
          address: '2468 Shopping Center, San Antonio, TX 78201',
          phone: '+1 (555) 0104',
        },
        status: 'completed',
        priority: 'low',
        scheduledDate: '2024-01-12',
        scheduledTime: '10:00 AM',
        assignedTo: ['Tom Anderson'],
        specialInstructions:
          'Replace fluorescent fixtures with LED. Store remains open during work.',
        tags: ['LED', 'Lighting', 'Retail', 'Energy Efficient'],
        location: {
          latitude: 29.4241,
          longitude: -98.4936,
          address: '2468 Shopping Center, San Antonio, TX 78201',
        },
        estimatedHours: 3,
      },
      {
        id: '5',
        jobId: 'JDP-2024-005',
        title: 'Generator Installation',
        customer: {
          name: 'JKL Data Center',
          address: '1357 Technology Pkwy, Houston, TX 77002',
          phone: '+1 (555) 0105',
        },
        status: 'active',
        priority: 'high',
        scheduledDate: '2024-01-18',
        scheduledTime: '06:00 AM',
        assignedTo: ['Sarah Johnson', 'Mike Wilson', 'David Chen'],
        specialInstructions:
          'Backup generator installation. Coordinate with facility management and IT team.',
        tags: ['Generator', 'Backup Power', 'Data Center', 'Critical'],
        location: {
          latitude: 29.7604,
          longitude: -95.3698,
          address: '1357 Technology Pkwy, Houston, TX 77002',
        },
        estimatedHours: 12,
      },
    ];

    setJobs(mockJobs);
  }, []);

  // Tab configuration
  const tabs = [
    {
      key: 'active',
      label: 'Active',
      count: jobs.filter(j => j.status === 'active').length,
    },
    {
      key: 'assigned',
      label: 'Assigned',
      count: jobs.filter(j => j.status === 'assigned').length,
    },
    {
      key: 'pending',
      label: 'Pending',
      count: jobs.filter(j => j.status === 'pending').length,
    },
    {
      key: 'completed',
      label: 'Completed',
      count: jobs.filter(j => j.status === 'completed').length,
    },
  ];

  // Filter jobs based on active tab and search query
  const filteredJobs = jobs.filter(job => {
    const matchesTab = job.status === activeTab;
    const matchesSearch =
      searchQuery === '' ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.jobId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Get status color
  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return COLORS.primary;
      case 'assigned':
        return COLORS.warning;
      case 'pending':
        return COLORS.danger;
      case 'completed':
        return COLORS.success;
      default:
        return COLORS.gray500;
    }
  };

  // Get priority color
  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return COLORS.danger;
      case 'medium':
        return COLORS.warning;
      case 'low':
        return COLORS.success;
      default:
        return COLORS.gray500;
    }
  };

  // Handle phone call
  const handleCall = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  // Handle navigation
  const handleNavigate = job => {
    const address = encodeURIComponent(job.location.address);
    const url = `https://maps.google.com/?q=${address}`;
    Linking.openURL(url);
  };

  // Handle start timer
  const handleStartTimer = job => {
    navigation.navigate('TimerScreen')
    // if (onStartTimer) {
    //   onStartTimer(job);
    // } else {
    //   Alert.alert('Timer', `Starting timer for ${job.title}`);
    // }
  };

  // Render header
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={COLORS.white} />
      </TouchableOpacity>

      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>Job Management</Text>
        <Text style={styles.headerSubtitle}>
          {filteredJobs.length} {activeTab} jobs
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.headerButton,
          {
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: '#10B981',
            width: widthPercentageToDP(24),
          },
        ]}
        onPress={() => navigation.navigate('CreateJobScreen')}>
        <Ionicons name="add" size={24} color={COLORS.white} />
        <Text style={{color: '#fff', fontWeight: '600'}}>New Job</Text>
      </TouchableOpacity>
    </View>
  );

  // Render search bar
  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={COLORS.gray400} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search jobs, customers, job ID..."
          placeholderTextColor={COLORS.gray400}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={COLORS.gray400} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // Render tabs
  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tabsContent}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.activeTabText,
                ]}>
                {tab.label}
              </Text>
              <View
                style={[
                  styles.tabBadge,
                  activeTab === tab.key && styles.activeTabBadge,
                ]}>
                <Text
                  style={[
                    styles.tabBadgeText,
                    activeTab === tab.key && styles.activeTabBadgeText,
                  ]}>
                  {tab.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  // Render job card
  const renderJobCard = job => (
    <TouchableOpacity
      key={job.id}
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobDetail', job)}>
      {/* Job Header */}
      <View style={styles.jobCardHeader}>
        <View style={styles.jobCardTitleSection}>
          <Text style={styles.jobId}>{job.jobId}</Text>
          <View style={styles.jobStatusPriority}>
            <View
              style={[
                styles.statusBadge,
                {backgroundColor: getStatusColor(job.status)},
              ]}>
              <Text style={styles.statusText}>{job.status.toUpperCase()}</Text>
            </View>
            <View
              style={[
                styles.priorityBadge,
                {backgroundColor: getPriorityColor(job.priority)},
              ]}>
              <Ionicons name="flag" size={10} color={COLORS.white} />
              <Text style={styles.priorityText}>
                {job.priority.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Job Title */}
      <Text style={styles.jobTitle}>{job.title}</Text>

      {/* Customer Info */}
      <View style={styles.customerSection}>
        <Text style={styles.customerName}>{job.customer.name}</Text>
        <Text style={styles.customerAddress}>{job.customer.address}</Text>
      </View>

      {/* Schedule Info */}
      <View style={styles.scheduleSection}>
        <View style={styles.scheduleItem}>
          <Ionicons name="calendar" size={16} color={COLORS.gray500} />
          <Text style={styles.scheduleText}>
            {new Date(job.scheduledDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.scheduleItem}>
          <Ionicons name="time" size={16} color={COLORS.gray500} />
          <Text style={styles.scheduleText}>{job.scheduledTime}</Text>
        </View>
        <View style={styles.scheduleItem}>
          <Ionicons name="hourglass" size={16} color={COLORS.gray500} />
          <Text style={styles.scheduleText}>{job.estimatedHours}h</Text>
        </View>
      </View>

      {/* Assigned To */}
      <View style={styles.assignedSection}>
        <Ionicons name="people" size={16} color={COLORS.gray500} />
        <Text style={styles.assignedText}>
          Assigned to: {job.assignedTo.join(', ')}
        </Text>
      </View>

      {/* Special Instructions */}
      {job.specialInstructions && (
        <View style={styles.instructionsSection}>
          <Ionicons
            name="information-circle"
            size={16}
            color={COLORS.warning}
          />
          <Text style={styles.instructionsText}>{job.specialInstructions}</Text>
        </View>
      )}

      {/* Tags */}
      <View style={styles.tagsSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tagsContainer}>
            {job.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Action Icons */}
      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleCall(job.customer.phone)}>
          <Ionicons name="call" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleNavigate(job)}>
          <Ionicons name="navigate" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Navigate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleStartTimer(job)}>
          <Ionicons name="timer" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Timer</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="briefcase-outline" size={80} color={COLORS.gray300} />
      </View>
      <Text style={styles.emptyTitle}>No {activeTab} jobs</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? 'Try adjusting your search criteria'
          : `No jobs in the ${activeTab} category`}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {renderHeader()}
      {renderSearchBar()}
      {renderTabs()}

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {filteredJobs.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.jobsList}>{filteredJobs.map(renderJobCard)}</View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.primaryLight,
    marginTop: 2,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.gray900,
    marginLeft: 8,
  },
  tabsContainer: {
    backgroundColor: COLORS.white,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  tabsContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    gap: 8,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray600,
  },
  activeTabText: {
    color: COLORS.white,
  },
  tabBadge: {
    backgroundColor: COLORS.gray300,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  activeTabBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray600,
  },
  activeTabBadgeText: {
    color: COLORS.white,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  jobsList: {
    padding: 16,
    gap: 16,
  },
  jobCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.gray900,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobCardHeader: {
    marginBottom: 12,
  },
  jobCardTitleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobId: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  jobStatusPriority: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.white,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 3,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.white,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 12,
  },
  customerSection: {
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray800,
    marginBottom: 4,
  },
  customerAddress: {
    fontSize: 14,
    color: COLORS.gray600,
    lineHeight: 20,
  },
  scheduleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scheduleText: {
    fontSize: 13,
    color: COLORS.gray600,
  },
  assignedSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  assignedText: {
    fontSize: 14,
    color: COLORS.gray700,
    flex: 1,
  },
  instructionsSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: COLORS.yellow50,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 13,
    color: COLORS.gray700,
    flex: 1,
    lineHeight: 18,
  },
  tagsSection: {
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  tag: {
    backgroundColor: COLORS.blue50,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.blue100,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.primary,
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    paddingTop: 16,
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical:6,
    gap: 4,
    width:widthPercentageToDP(20),
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.gray600,
    textAlign: 'center',
    lineHeight: 20,
  },
};

export default JobListingScreen;
