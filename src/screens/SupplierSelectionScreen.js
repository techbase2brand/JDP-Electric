import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Linking,
  Alert,
  FlatList,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {widthPercentageToDP} from '../utils';
import {getSuppliers} from '../config/apiConfig';
import {useSelector} from 'react-redux';
import Geocoder from 'react-native-geocoding';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
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
Geocoder.init('AIzaSyBXNyT9zcGdvhAUCUEYTm6e_qPw26AOPgI');
const SupplierSelectionScreen = ({navigation, user, route}) => {
  const token = useSelector(state => state.user.token);
  const job = route?.params?.job;
  const endReachedLockRef = React.useRef(false);
  const [viewMode, setViewMode] = useState('list');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [sortBy, setSortBy] = useState('distance');
  const [searchQuery, setSearchQuery] = useState('');
  const [supplierss, setSuppliers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    if (loading || refreshing) return;
    setRefreshing(true);
    endReachedLockRef.current = false;
    setHasMore(true);
    setSuppliers([]);
    setPage(1);
    try {
      await onRefresdhfetchSuppliers(1, true);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSuppliers(1, true);
    setHasMore(true);
  }, [searchQuery]);

  const PAGE_SIZE = 10;
  const fetchSuppliers = async (targetPage, isReset = false) => {
    if (loading || (!hasMore && !isReset)) return;
    setLoading(true);
    try {
      const res = await getSuppliers(targetPage, PAGE_SIZE, token);
      const rows = res?.data?.data ?? [];
      setSuppliers(prev => (isReset ? rows : [...prev, ...rows]));
      setHasMore(rows.length === PAGE_SIZE);
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch suppliers');
    } finally {
      setLoading(false);
      endReachedLockRef.current = false;
    }
  };

  const onRefresdhfetchSuppliers = async (targetPage, isReset = false) => {
    setLoading(true);
    try {
      const res = await getSuppliers(targetPage, 10, token);
      const rows = res?.data?.data ?? [];
      if (rows.length) {
        setSuppliers(prev => (isReset ? rows : [...prev, ...rows]));
        setPage(targetPage); // commit only after success
      } else {
        setHasMore(false);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch suppliers');
    } finally {
      setLoading(false);
      endReachedLockRef.current = false;
    }
  };
  const loadMore = () => {
    if (loading || endReachedLockRef.current || !hasMore || searchQuery) return;
    endReachedLockRef.current = true;
    fetchSuppliers(page + 1);
  };

  const filteredSuppliers = supplierss?.filter(supplier => {
    // const matchesTab = activeTab === 'all' || job.status === activeTab;

    const matchesSearch =
      searchQuery === '' ||
      supplier?.company_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      supplier?.contact_person
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      String(job.id).toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });
  console.log('filtersd::', filteredSuppliers);

  // const loadMore = () => {
  //   if (!loading && hasMore) {
  //     setPage(prev => prev + 1);
  //   }
  // };

  const handleCall = phone => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = email => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleDirections = supplier => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      supplier.address,
    )}`;
    Linking.openURL(url);
  };

  const renderStarRating = rating => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={i} name="star" size={16} color="#fbbf24" />);
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="star-half" size={16} color="#fbbf24" />,
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon
          key={`empty-${i}`}
          name="star-border"
          size={16}
          color="#d1d5db"
        />,
      );
    }

    return <View style={styles.starsContainer}>{stars}</View>;
  };
  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={'#9CA3AF'} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search suppliers"
          placeholderTextColor={'#9CA3AF'}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={'#9CA3AF'} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderListView = () => (
    <View style={styles.listContainer} showsVerticalScrollIndicator={false}>
      {/* Sort and Filter Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.filterContainer}>
          <View style={{width: widthPercentageToDP(90)}}>
            {renderSearchBar()}
          </View>
        </View>
      </View>

      {/* Results Count */}
      {filteredSuppliers?.length > 0 && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredSuppliers?.length} supplier
            {filteredSuppliers?.length !== 1 ? 's' : ''} found
          </Text>
          <Text style={styles.resultsSubtext}>
            {/* Sorted by {sortBy === 'distance' ? 'distance' : sortBy === 'rating' ? 'rating' : 'name'} */}
          </Text>
        </View>
      )}

      {/* Suppliers List */}
      <View style={styles.suppliersList}>
        <FlatList
          data={filteredSuppliers}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          renderItem={renderSupplier}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1} //  low threshold
          //  momentum start pe lock reset
          onMomentumScrollBegin={() => {
            endReachedLockRef.current = false;
          }}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListFooterComponent={
            hasMore && !searchQuery && loading ? (
              <ActivityIndicator size="large" color="#3B82F6" />
            ) : null
          }
        />
      </View>

      {/* Bottom Spacing */}
    </View>
  );

  const renderSupplier = ({item: supplier}) => (
    <View style={styles.supplierCard}>
      {/* Supplier Header */}
      <View style={styles.supplierHeader}>
        <View style={styles.supplierInfo}>
          <Text style={styles.supplierName}>{supplier.company_name}</Text>
          <Text style={styles.supplierCategory}>{supplier.contact_person}</Text>
        </View>

        {/* Status Indicator */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, {backgroundColor: '#10b981'}]} />
          <Text
            style={[
              styles.statusText,
              {color: '#10b981'},
              // {color: supplier.isOpen ? '#10b981' : '#ef4444'},
            ]}>
            {/* {supplier.isOpen ? 'Open' : 'Closed'} */}
            {'Open'}
          </Text>
        </View>
      </View>

      {/* Address */}
      <View style={styles.addressContainer}>
        <Icon name="place" size={16} color="#6b7280" />
        <Text style={styles.addressText}>{supplier.address}</Text>
      </View>

      {/* Hours */}
      <View style={styles.hoursContainer}>
        <Icon name="schedule" size={16} color="#6b7280" />
        <Text style={styles.hoursText}>
          {/* {supplier.hours.open === '24/7' */}
          24/7 Open
          {/* // : `${supplier.hours.open} - ${supplier.hours.close} • ${supplier.hours.days}`} */}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleCall(supplier.phone)}>
          <Icon name="phone" size={24} color="#3B82F6" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDirections(supplier)}>
          <Icon name="directions" size={28} color="#3B82F6" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.selectButton, {width: widthPercentageToDP(40)}]}
          onPress={() =>
            navigation.navigate('OrderProducts', {
              id: supplier?.id,
              job: job,
            })
          }>
          <Icon name="add" size={16} color="white" />
          <Text style={styles.selectButtonText}>Select</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#3B82F6" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Select Supplier</Text>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            Alert.alert('Filter', 'Filter options coming soon!');
          }}>
          {/* <Icon name="filter-list" size={24} color="white" /> */}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* {viewMode === 'map' ? renderMapView() : renderListView()} */}
        {renderListView()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  searchContainer: {
    backgroundColor: COLORS.white,
    // paddingHorizontal: 16,
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
  viewToggle: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    flexDirection: 'row',
    padding: 4,
    marginHorizontal: 16,
    marginTop: -8,
    marginBottom: 8,
    borderRadius: 12,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  toggleButtonActive: {
    backgroundColor: 'white',
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleButtonTextActive: {
    color: '#3B82F6',
  },
  content: {
    flex: 1,
  },
  // Map View Styles
  mapContainer: {
    flex: 1,
  },
  mockMap: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapPlaceholder: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6b7280',
    marginBottom: 8,
  },
  mapSubtext: {
    fontSize: 16,
    color: '#9ca3af',
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    top: 16,
    gap: 8,
  },
  mapControlButton: {
    backgroundColor: 'white',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  markersContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  markerPreview: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#111827',
    marginTop: 2,
  },
  mapBottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  horizontalScroll: {
    flexGrow: 0,
  },
  mapSupplierCard: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    width: 160,
  },
  mapCardName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  mapCardDistance: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  mapCardHours: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  // List View Styles
  listContainer: {
    flex: 1,
    marginBottom: 180,
  },
  controlsContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
  },
  sortContainer: {
    marginBottom: 16,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
    gap: 4,
  },
  sortButtonActive: {
    backgroundColor: '#3B82F6',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
  sortButtonTextActive: {
    color: 'white',
  },
  filterContainer: {
    marginBottom: 0,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  resultsCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  resultsSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  suppliersList: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  supplierCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  featuredText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  supplierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  supplierInfo: {
    flex: 1,
    marginRight: 12,
  },
  supplierName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  supplierCategory: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  supplierMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 4,
  },
  distanceText: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusContainer: {
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  hoursText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  specialtyTag: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  specialtyText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    width: widthPercentageToDP(10),
    backgroundColor: '#f3f4f6',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  selectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    gap: 4,
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  bottomSpacing: {
    height: 500,
  },
});

export default SupplierSelectionScreen;
