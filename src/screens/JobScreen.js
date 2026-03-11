import React, {useState, useEffect, useMemo, useRef} from 'react';
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
  Modal,
  Button,
  Platform,
  LayoutAnimation,
  UIManager,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {widthPercentageToDP} from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import useHasPermission from '../hooks/useHasPermission';
import {getJobs, getlabourJobs, searchMyJobs} from '../config/apiConfig';
import { spacings } from '../constants/Fonts';

// Ensure placeholders remain visible in system dark mode
TextInput.defaultProps = {
  ...(TextInput.defaultProps || {}),
  placeholderTextColor: '#9CA3AF',
};

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

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
};

const dedupeById = arr => {
  const seen = new Set();
  return arr.filter(j => {
    const key = j?._id ?? j?.id ?? String(j?.jobId ?? '');
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const JobListingScreen = ({navigation, route}) => {
  // ----- refs
  const searchTimerRef = useRef(null);
  const latestQueryRef = useRef('');
  const mountedRef = useRef(false);

  // ----- redux/user
  const user = useSelector(state => state.user.user);
  const token = useSelector(state => state.user.token);
  const leadLaborId = user?.lead_labor?.id;
  console.log('leadLaborId>>', user, leadLaborId);

  const laborId = user?.labor?.id;
  const canViewCreateJob = useHasPermission('jobs', 'view');

  // ----- route
  const {status} = route?.params || {};

  // ----- state
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [expandedJobId, setExpandedJobId] = useState(null);
  const [hasAutoExpanded, setHasAutoExpanded] = useState(false);

  const [isSearching, setIsSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false); // list loader
  const [refreshing, setRefreshing] = useState(false); // pull-to-refresh

  const [subJobModalVisible, setSubJobModalVisible] = useState(false);
  const [selectedJobForSub, setSelectedJobForSub] = useState(null);
  const [subJobNewTitle, setSubJobNewTitle] = useState('');

  // ---------- mount mark (prevents double load)
  useEffect(() => {
    mountedRef.current = true;
  }, []);

  // ---------- initial list fetch (once)
  useEffect(() => {
    fetchFirstPage(); // first page only
  }, []);

  // ---------- auto-expand first job only first time
  useEffect(() => {
    if (!hasAutoExpanded && jobs.length > 0) {
      const firstId = jobs[0]?.id ?? jobs[0]?._id;
      if (firstId) {
        setExpandedJobId(firstId);
        setHasAutoExpanded(true);
      }
    }
  }, [jobs, hasAutoExpanded]);

  // ---------- set status tab from route (optional)
  useEffect(() => {
    if (status) setActiveTab(status);
  }, [status]);

  // ---------- search debounce
  useEffect(() => {
    // skip running on very first render (avoid double load)
    if (!mountedRef.current) return;

    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    const q = (searchQuery || '').trim();

    if (!q) {
      // exit search mode; DO NOT refresh immediately (keeps current list)
      setIsSearching(false);
      setSearchLoading(false);
      setPage(1);
      setHasMore(true);
      setJobs([]);

      // fetch normal list page-1 (single call)
      fetchFirstPage();

      return;
    }

    searchTimerRef.current = setTimeout(() => {
      latestQueryRef.current = q;
      setIsSearching(true);
      doSearch();
    }, 1000);

    return () => searchTimerRef.current && clearTimeout(searchTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);
  // add this function near fetchJobs/refreshJobs
  const fetchFirstPage = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res =
        user?.management_type === 'lead_labor'
          ? await getJobs(leadLaborId, 1, 10, token)
          : await getlabourJobs(laborId, 1, 10, token);

      // API shape can be either res.data.{...} or res.{...}
      const root = res?.data ?? res;
      const newJobs = root?.jobs ?? [];
      console.log('job respsoen First:::::::', newJobs);

      setJobs(dedupeById(newJobs));
      setPage(2); // next time onEndReached se page 2 aayega
      const hasNext = !!(root?.pagination?.hasNextPage ?? false);
      setHasMore(hasNext);
    } catch (err) {
      console.error('First page fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- list fetchers
  const fetchJobs = async () => {
    if (loading || !hasMore || isSearching) return;
    setLoading(true);
    try {
      const res =
        user?.management_type === 'lead_labor'
          ? await getJobs(leadLaborId, page, 10, token)
          : await getlabourJobs(laborId, page, 10, token);

      const root = res?.data ?? res;
      const newJobs = root?.jobs ?? [];
      // console.log('newJobs page', page, '→', newJobs.length);

      const combined = dedupeById([...(jobs || []), ...newJobs]);
      console.log('job respsoen :::::::', combined);
      setJobs(combined);

      // pagination flags from server (use hasNextPage)
      const hasNext = !!(root?.pagination?.hasNextPage ?? false);
      setHasMore(hasNext);

      if (newJobs.length > 0) setPage(p => p + 1);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshJobs = async () => {
    if (refreshing) return;
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    try {
      const res =
        user?.management_type === 'lead_labor'
          ? await getJobs(leadLaborId, 1, 10, token)
          : await getlabourJobs(laborId, 1, 10, token);

      const root = res?.data ?? res;
      const newJobs = root?.jobs ?? [];
      setJobs(dedupeById(newJobs));
      const hasNext = !!(root?.pagination?.hasNextPage ?? false);
      setHasMore(hasNext);
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // ---------- search (single hit, no pagination)
  const doSearch = async () => {
    if (searchLoading) return;
    setSearchLoading(true);
    try {
      const res =
        user?.management_type === 'lead_labor'
          ? await searchMyJobs(latestQueryRef.current, token, leadLaborId)
          : await await searchMyJobs(latestQueryRef.current, token, laborId);
      // const res = await searchMyJobs(latestQueryRef.current, token,leadLaborId);
      const newJobs = res?.jobs ?? res?.data?.jobs ?? [];
      setJobs(dedupeById(newJobs));
      setHasMore(false); // disable onEndReached in search mode
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  // ---------- helpers
  const toggleJobExpansion = jobId => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

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

  const handleCall = phoneNumber => Linking.openURL(`tel:${phoneNumber}`);

  const handleNavigateTimer = async job => {
    try {
      const activeJobId = await AsyncStorage.getItem('activeJobId');
      const currentJobId = job?.id?.toString() ?? job?._id?.toString();
      if (!activeJobId || activeJobId === currentJobId) {
        navigation.navigate('TimerScreen', {job});
      } else {
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

  // ---------- tabs
  // const tabs = useMemo(() => {
  //   const counts = jobs?.reduce((acc, j) => {
  //     const s = j?.status || 'unknown';
  //     acc[s] = (acc[s] || 0) + 1;
  //     return acc;
  //   }, {});
  //   const dynamic = Object.keys(counts || {}).map(k => ({
  //     key: k,
  //     label: k.charAt(0).toUpperCase() + k.slice(1),
  //     count: counts[k],
  //   }));
  //   return [{key: 'all', label: 'All', count: jobs?.length || 0}, ...dynamic];
  // }, [jobs]);
  const tabs = useMemo(() => {
    const counts = jobs?.reduce((acc, j) => {
      const s = j?.status || 'unknown';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    const dynamic = Object.keys(counts || {}).map(k => {
      // Format label: convert underscores to spaces + capitalize words
      const formattedLabel = k
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return {
        key: k,
        label: formattedLabel,
        count: counts[k],
      };
    });

    return [{key: 'all', label: 'All', count: jobs?.length || 0}, ...dynamic];
  }, [jobs]);

  // ---------- list filtering (tab only; server already searched)
  const filteredJobs = useMemo(() => {
    return (jobs || []).filter(
      j => activeTab === 'all' || j?.status === activeTab,
    );
  }, [jobs, activeTab]);

  // ---------- UI renderers
  const renderHeader = () => (
    <View style={[styles.header, {justifyContent: 'space-between'}]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={COLORS.white} />
      </TouchableOpacity>

      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>Job Management</Text>
        {/* <Text style={styles.headerSubtitle}>
          {isSearching
            ? searchLoading
              ? 'Searching…'
              : `${filteredJobs.length} results`
            : `${filteredJobs.length} ${activeTab} ${
                filteredJobs.length === 1 ? 'job' : 'jobs'
              }`}
        </Text> */}
      </View>

      {canViewCreateJob ? (
        <TouchableOpacity
          style={[
            styles.headerButton,
            {
              flexDirection: 'row',
              backgroundColor: '#10B981',
              width: widthPercentageToDP(10),
            },
          ]}
          onPress={() => navigation.navigate('CreateJobScreen')}>
          <Ionicons name="add" size={20} color={COLORS.white} />
          {/* <Text style={{color: '#fff', fontWeight: '600', fontSize:12}}>New Job</Text> */}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            styles.headerButton,
            {
              flexDirection: 'row',
              // backgroundColor: '#10B981',
              width: widthPercentageToDP(10),
            },
          ]}
        />
      )}
    </View>
  );

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
        {!!searchQuery?.length && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={COLORS.gray400} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tabsContent}>
          {tabs?.map(tab => (
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
                  {tab?.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderJobCard = ({item: job}) => {
    const isExpanded = expandedJobId === (job?.id ?? job?._id);
    return (
      <TouchableOpacity
        key={job?.id ?? job?._id}
        style={styles.jobCard}
        onPress={() => navigation.navigate('JobDetail', {job})}>
        {/* <View style={styles.jobCardHeader}>
          <View style={styles.jobCardTitleSection}>
            <Text style={styles.jobId}>{job?.jobId || ''}</Text>
            <View style={styles.jobStatusPriority}>
              <View
                style={[
                  styles.statusBadge,
                  {backgroundColor: getStatusColor(job?.status)},
                ]}>
                <Text style={styles.statusText}>
                  {(job?.status == 'in_progress'
                    ? 'In Progress'
                    : job?.status || ''
                  ).toUpperCase()}
                </Text>
              </View>
              <View
                style={[
                  styles.priorityBadge,
                  {backgroundColor: getPriorityColor(job?.priority)},
                ]}>
                <Ionicons name="flag" size={10} color={COLORS.white} />
                <Text style={styles.priorityText}>
                  {(job?.priority || '').toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </View> */}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={[
                styles.jobTitle,
                {
                  width:
                    job?.status == 'in_progress'
                      ? widthPercentageToDP(50)
                      : widthPercentageToDP(55),
                },
              ]}
              numberOfLines={1}>
              {job?.job_title || job?.title}
            </Text>
            {!!job?.isSubJob && (
              <Text style={styles.subJobTag}>Sub Job</Text>
            )}
            {!!job?.isMainJob && !job?.isSubJob && (
              <Text style={styles.mainJobTag}>Main Job</Text>
            )}
          </View>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: getStatusColor(job?.status)},
            ]}>
            <Text style={styles.statusText}>
              {(job?.status == 'in_progress'
                ? 'In Progress'
                : job?.status || ''
              ).toUpperCase()}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => toggleJobExpansion(job?.id ?? job?._id)}>
            <Icon
              name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={28}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>
        {!!job?.description && (
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: COLORS.gray900,
              marginBottom: 12,
            }}
            numberOfLines={3}>
            {job?.description}
          </Text>
        )}
        <View style={styles.scheduleSection}>
          <View style={styles.scheduleItem}>
            <Ionicons name="calendar" size={16} color={COLORS.gray500} />
            <Text style={[styles.scheduleText, {fontWeight: '600'}]}>
              {job?.due_date
                ? new Date(job?.due_date).toLocaleDateString('en-US')
                : '—'}
            </Text>
          </View>
          {job?.isMainJob && !job?.isSubJob && (
            <TouchableOpacity
              style={styles.subJobButtonInline}
              onPress={e => {
                e?.stopPropagation?.();
                setSelectedJobForSub(job);
                setSubJobNewTitle('');
                setSubJobModalVisible(true);
              }}>
              <Ionicons
                name="document-text-outline"
                size={16}
                color={COLORS.primary}
              />
              <Text style={styles.subJobButtonInlineText}>Change Order</Text>
            </TouchableOpacity>
          )}
        </View>

        {isExpanded && (
          <View>
            <View style={styles.customerSection}>
              <Text style={styles.customerName}>
                {job?.customer?.name || job?.customer?.customer_name || '—'}
              </Text>
              <Text style={styles.customerAddress}>
                {job?.address || job?.customer?.address || '—'}
              </Text>
            </View>

            <View
              style={[
                styles.assignedSection,
                {width: widthPercentageToDP(50)},
              ]}>
              <View style={{flexDirection: 'row'}}>
                {/* <Ionicons name="people" size={16} color={COLORS.gray500} />
                <Text style={styles.assignedText}>
                  Assigned by: {job?.created_by_user?.full_name}
                  {job?.assigned_labor?.map(l => l?.user?.full_name).join(', ') ||
                  'N/A'}
                </Text> */}
              </View>
            </View>

            {job?.isMainJob &&
              Array.isArray(job?.subJobs) &&
              job.subJobs.length > 0 && (
                <View style={styles.subJobsContainer}>
                  <Text style={styles.subJobsTitle}>Sub Jobs</Text>
                  {job.subJobs.map(sub => (
                    <TouchableOpacity
                      key={sub.id}
                      style={styles.subJobItem}
                      activeOpacity={0.85}
                      onPress={() =>
                        navigation.navigate('JobDetail', {job: sub})
                      }>
                      {/* Top row: title + small status */}
                      <View style={styles.subJobHeaderRow}>
                        <Text style={styles.subJobTitle}>
                          {sub.job_title || sub.title}
                        </Text>
                        <Text style={styles.subJobStatusText}>
                          {(sub?.status === 'in_progress'
                            ? 'In Progress'
                            : sub?.status || ''
                          ).toUpperCase()}
                        </Text>
                      </View>

                      {/* Description */}
                      {!!sub.description && (
                        <Text
                          style={styles.subJobDescription}
                          numberOfLines={2}>
                          {sub.description}
                        </Text>
                      )}

                      {/* Date + actions row */}
                      <View style={styles.subJobBottomRow}>
                        <View style={styles.subJobDateRow}>
                          <Ionicons
                            name="calendar"
                            size={14}
                            color={COLORS.gray500}
                          />
                          <Text style={styles.subJobDateText}>
                            {sub?.due_date
                              ? new Date(sub?.due_date).toLocaleDateString(
                                  'en-US',
                                )
                              : '—'}
                          </Text>
                        </View>

                        <View style={styles.subJobActionsRow}>
                          <TouchableOpacity
                            style={styles.subJobActionButton}
                            onPress={() =>
                              handleCall(
                                sub?.customer?.phone ||
                                  sub?.contractor?.phone ||
                                  sub?.phone,
                              )
                            }>
                            <Ionicons
                              name="call"
                              size={16}
                              color={COLORS.primary}
                            />
                            <Text style={styles.subJobActionText}>Call</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.subJobActionButton}
                            onPress={() =>
                              navigation.navigate('MapScreen', {job: sub})
                            }>
                            <Ionicons
                              name="navigate"
                              size={16}
                              color={'#10B981'}
                            />
                            <Text
                              style={[
                                styles.subJobActionText,
                                {color: '#10B981'},
                              ]}>
                              Navigate
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.subJobActionButton}
                            onPress={() => handleNavigateTimer(sub)}>
                            <Icon
                              name="timer"
                              size={16}
                              color={COLORS.danger}
                            />
                            <Text
                              style={[
                                styles.subJobActionText,
                                {color: COLORS.danger},
                              ]}>
                              Timer
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
          </View>
        )}

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              handleCall(job?.customer?.phone || job?.contractor?.phone)
            }>
            <Ionicons name="call" size={20} color={COLORS.primary} />
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('MapScreen', {job})}>
            <Ionicons name="navigate" size={20} color={'#10B981'} />
            <Text style={[styles.actionText, {color: '#10B981'}]}>
              Navigate
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleNavigateTimer(job)}>
            <Icon name="timer" size={20} color={COLORS.danger} />
            <Text style={[styles.actionText, {color: COLORS.danger}]}>
              Timer
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="briefcase-outline" size={80} color={COLORS.gray300} />
      </View>
      <Text style={styles.emptyTitle}>No jobs found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? 'Try adjusting your search'
          : `No jobs in the ${activeTab} category`}
      </Text>
    </View>
  );

  // ---------- render
  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        {renderHeader()}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
          }}>
          <View style={{width: widthPercentageToDP(90)}}>
            {renderSearchBar()}
          </View>

          {/* Filter modal trigger (optional) */}
          <View style={styles.container}>
            <Modal
              transparent
              visible={modalVisible}
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}>
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <Text style={styles.label}>Start Date</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowStartPicker(true);
                      setShowEndPicker(false);
                    }}
                    style={styles.dateButton}>
                    <Text>{startDate.toDateString()}</Text>
                  </TouchableOpacity>
                  {showStartPicker && (
                    <DateTimePicker
                      value={startDate}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={(e, d) => {
                        setShowStartPicker(false);
                        d && setStartDate(d);
                      }}
                    />
                  )}

                  <Text style={styles.label}>End Date</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowEndPicker(true);
                      setShowStartPicker(false);
                    }}
                    style={styles.dateButton}>
                    <Text>{endDate.toDateString()}</Text>
                  </TouchableOpacity>
                  {showEndPicker && (
                    <DateTimePicker
                      value={endDate}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={(e, d) => {
                        setShowEndPicker(false);
                        d && setEndDate(d);
                      }}
                    />
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                    }}
                    style={{
                      marginTop: 20,
                      backgroundColor: '#3B82F6',
                      padding: 10,
                      borderRadius: 10,
                      alignItems: 'center',
                    }}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>
                      Apply Filter
                    </Text>
                  </TouchableOpacity>

                  <Button
                    title="Cancel"
                    color="red"
                    onPress={() => setModalVisible(false)}
                  />
                </View>
              </View>
            </Modal>

            {/* Sub Job popup */}
            <Modal
              transparent
              visible={subJobModalVisible}
              animationType="fade"
              onRequestClose={() => {
                setSubJobModalVisible(false);
                setSelectedJobForSub(null);
                setSubJobNewTitle('');
              }}>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.modalBackground}
                onPress={() => {
                  setSubJobModalVisible(false);
                  setSelectedJobForSub(null);
                  setSubJobNewTitle('');
                }}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.subJobModalBox}
                  onPress={e => e?.stopPropagation?.()}>
                  <Text style={styles.subJobModalTitle}>
                    Change Order Details
                  </Text>
                  <Text style={styles.subJobModalLabel}>Job title</Text>
                  <TextInput
                    style={styles.subJobModalInput}
                    value={subJobNewTitle}
                    onChangeText={setSubJobNewTitle}
                    placeholder="Enter Job title"
                    placeholderTextColor={COLORS.gray400}
                  />
                  <View style={styles.subJobModalButtons}>
                    <TouchableOpacity
                      style={[
                        styles.subJobModalBtn,
                        styles.subJobModalBtnCancel,
                      ]}
                      onPress={() => {
                        setSubJobModalVisible(false);
                        setSelectedJobForSub(null);
                        setSubJobNewTitle('');
                      }}>
                      <Text style={styles.subJobModalBtnCancelText}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.subJobModalBtn,
                        styles.subJobModalBtnCreate,
                      ]}
                      onPress={() => {
                        const newTitle = subJobNewTitle?.trim() || '';
                        const parent = selectedJobForSub;
                        setSubJobModalVisible(false);
                        setSelectedJobForSub(null);
                        setSubJobNewTitle('');
                        navigation.navigate('CreateJobScreen', {
                          subJobTitle: newTitle,
                          parentJob: parent,
                        });
                      }}>
                      <Text style={styles.subJobModalBtnCreateText}>
                        Create
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </TouchableOpacity>
            </Modal>
          </View>
        </View>

        {renderTabs()}

        <FlatList
          data={filteredJobs}
          renderItem={renderJobCard}
          keyExtractor={(item, index) =>
            item?._id?.toString?.() ||
            item?.id?.toString?.() ||
            index.toString()
          }
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onEndReached={({distanceFromEnd}) => {
            // distanceFromEnd < 0 means user scrolled up; ignore
            if (distanceFromEnd < 0) return;
            if (!isSearching && hasMore && !loading) {
              fetchJobs();
            }
          }}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={refreshJobs}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingBottom: 100,
          }}
          ListFooterComponent={
            loading && !refreshing && filteredJobs.length > 0 ? (
              <ActivityIndicator size="large" style={{margin: 10}} />
            ) : null
          }
          ListEmptyComponent={
            loading || refreshing || searchLoading ? (
              <ActivityIndicator size="large" style={{marginTop: 40}} />
            ) : (
              renderEmptyState()
            )
          }
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

// ---------- styles
const styles = {
  safeArea: {flex: 1, backgroundColor: COLORS.white},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    // justifyContent: 'space-between',
  },
  backButton: {},
  headerCenter: {alignItems: 'center'},
  headerTitle: {fontSize: 18, fontWeight: '600', color: COLORS.white},
  headerSubtitle: {fontSize: 12, color: COLORS.white, marginTop: 2},
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchContainer: {
    backgroundColor: COLORS.white,
    width: '100%',
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'android' ? 2 : 10,
  },
  searchInput: {flex: 1, fontSize: 16, color: COLORS.gray900, marginLeft: 8},

  tabsContainer: {
    backgroundColor: COLORS.white,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
    paddingHorizontal: 16,
  },
  tabsContent: {flexDirection: 'row', gap: 8},
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    gap: 8,
    marginTop: 8,
  },
  activeTab: {backgroundColor: COLORS.primary},
  tabText: {fontSize: 14, fontWeight: '500', color: COLORS.gray600},
  activeTabText: {color: COLORS.white},
  tabBadge: {
    backgroundColor: COLORS.gray300,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  activeTabBadge: {backgroundColor: 'rgba(255, 255, 255, 0.3)'},
  tabBadgeText: {fontSize: 12, fontWeight: '600', color: COLORS.gray600},
  activeTabBadgeText: {color: COLORS.white},

  jobCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.gray900,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 12,
  },
  jobCardHeader: {marginBottom: 12},
  jobCardTitleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobId: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    // marginBottom: 4,
  },
  jobStatusPriority: {flexDirection: 'row', gap: 8},
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    height: 23,
    margin: 5,
  },
  statusText: {fontSize: 10, fontWeight: '600', color: COLORS.white},
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 3,
  },
  priorityText: {fontSize: 9, fontWeight: '600', color: COLORS.white},
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 12,
  },
  mainJobTag: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: -6,
  },
  subJobTag: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.warning,
    marginTop: -6,
  },
  customerSection: {marginBottom: 12},
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray800,
    marginBottom: 4,
  },
  customerAddress: {fontSize: 14, color: COLORS.gray600, lineHeight: 20},
  scheduleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduleItem: {flexDirection: 'row', alignItems: 'center', gap: 6},
  scheduleText: {fontSize: 13, color: COLORS.gray600},
  subJobButtonInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: COLORS.blue50,
  },
  subJobButtonInlineText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },

  subJobsContainer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  subJobsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray800,
    marginBottom: 4,
  },
  subJobItem: {
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.gray50,
    paddingHorizontal: 10,
    marginTop: 4,
  },
  subJobHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subJobTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray900,
  },
  subJobStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.gray600,
  },
  subJobDescription: {
    fontSize: 12,
    color: COLORS.gray700,
    marginTop: 4,
  },
  subJobBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  subJobDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subJobDateText: {
    fontSize: 12,
    color: COLORS.gray600,
  },
  subJobActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subJobActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subJobActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.primary,
  },

  assignedSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  assignedText: {fontSize: 14, color: COLORS.gray700, flex: 1},

  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    marginTop:spacings.large,
    borderTopColor: COLORS.gray200,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
    gap: 4,
    width: widthPercentageToDP(28),
  },
  actionText: {fontSize: 14, fontWeight: '500', color: COLORS.primary},

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {marginBottom: 16},
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

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  subJobModalBox: {
    margin: 24,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  subJobModalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray700,
    marginBottom: 12,
  },
  subJobModalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray600,
    marginBottom: 6,
  },
  subJobModalInput: {
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.gray900,
    marginBottom: 20,
  },
  subJobModalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  subJobModalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  subJobModalBtnCancel: {
    backgroundColor: COLORS.gray200,
  },
  subJobModalBtnCreate: {
    backgroundColor: COLORS.primary,
  },
  subJobModalBtnCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray700,
  },
  subJobModalBtnCreateText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  label: {marginTop: 10, marginBottom: 5, fontWeight: 'bold'},
  dateButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
};

export default JobListingScreen;
