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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {widthPercentageToDP} from '../utils';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const SupplierSelectionScreen = ({navigation, user}) => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [sortBy, setSortBy] = useState('distance');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock supplier data
  const suppliers = [
    {
      id: '1',
      name: 'Houston Electrical Supply',
      category: 'Electrical Wholesale',
      address: '1234 Industrial Blvd',
      city: 'Houston, TX 77032',
      phone: '+1 (713) 555-0123',
      email: 'orders@houstonelectric.com',
      rating: 4.8,
      reviewCount: 152,
      distance: 0.8,
      hours: {
        open: '07:00',
        close: '17:00',
        days: 'Mon-Fri',
      },
      specialties: [
        'Industrial Supplies',
        'Electrical Components',
        'Safety Equipment',
      ],
      coordinates: {
        latitude: 29.7604,
        longitude: -95.3698,
      },
      isOpen: true,
      featured: true,
    },
    {
      id: '2',
      name: 'TechFlow Electrical Distributors',
      category: 'Commercial Electrical',
      address: '567 Commerce Street',
      city: 'Houston, TX 77002',
      phone: '+1 (713) 555-0124',
      email: 'support@techflow.com',
      rating: 4.6,
      reviewCount: 89,
      distance: 1.2,
      hours: {
        open: '08:00',
        close: '18:00',
        days: 'Mon-Sat',
      },
      specialties: ['Smart Systems', 'LED Lighting', 'Control Panels'],
      coordinates: {
        latitude: 29.7589,
        longitude: -95.3677,
      },
      isOpen: true,
      featured: false,
    },
    {
      id: '3',
      name: 'PowerLine Supply Co.',
      category: 'Residential & Commercial',
      address: '890 Warehouse Drive',
      city: 'Houston, TX 77040',
      phone: '+1 (713) 555-0125',
      email: 'info@powerline.com',
      rating: 4.4,
      reviewCount: 203,
      distance: 2.1,
      hours: {
        open: '07:30',
        close: '16:30',
        days: 'Mon-Fri',
      },
      specialties: ['Wire & Cable', 'Breakers', 'Conduit & Fittings'],
      coordinates: {
        latitude: 29.7749,
        longitude: -95.3922,
      },
      isOpen: true,
      featured: true,
    },
    {
      id: '4',
      name: 'ElectroMax Wholesale',
      category: 'Industrial Electrical',
      address: '456 Industry Park Way',
      city: 'Houston, TX 77053',
      phone: '+1 (713) 555-0126',
      email: 'sales@electromax.com',
      rating: 4.7,
      reviewCount: 124,
      distance: 3.5,
      hours: {
        open: '06:00',
        close: '17:00',
        days: 'Mon-Fri',
      },
      specialties: ['Motor Controls', 'Transformers', 'High Voltage'],
      coordinates: {
        latitude: 29.691,
        longitude: -95.337,
      },
      isOpen: false,
      featured: false,
    },
    {
      id: '5',
      name: 'Circuit City Electrical',
      category: 'General Electrical',
      address: '321 Electric Avenue',
      city: 'Houston, TX 77079',
      phone: '+1 (713) 555-0127',
      email: 'orders@circuitcity.com',
      rating: 4.2,
      reviewCount: 67,
      distance: 4.2,
      hours: {
        open: '08:00',
        close: '17:00',
        days: 'Mon-Fri',
      },
      specialties: ['Residential Wiring', 'Lighting', 'HVAC Electrical'],
      coordinates: {
        latitude: 29.7752,
        longitude: -95.5618,
      },
      isOpen: true,
      featured: false,
    },
    {
      id: '6',
      name: 'Voltage Supply House',
      category: 'Emergency Supplies',
      address: '654 Service Road',
      city: 'Houston, TX 77081',
      phone: '+1 (713) 555-0128',
      email: 'emergency@voltage.com',
      rating: 4.9,
      reviewCount: 45,
      distance: 1.8,
      hours: {
        open: '24/7',
        close: '24/7',
        days: 'Every Day',
      },
      specialties: ['Emergency Supplies', '24/7 Service', 'Repair Parts'],
      coordinates: {
        latitude: 29.737,
        longitude: -95.4194,
      },
      isOpen: true,
      featured: true,
    },
  ];

  const categories = [
    'all',
    'Electrical Wholesale',
    'Commercial Electrical',
    'Residential & Commercial',
    'Industrial Electrical',
    'General Electrical',
    'Emergency Supplies',
  ];

  // Filter and sort suppliers
  const filteredSuppliers = suppliers
    .filter(
      supplier =>
        filterCategory === 'all' || supplier.category === filterCategory,
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleCall = phone => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = email => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleDirections = supplier => {
    const url = `https://maps.google.com/?q=${supplier.coordinates.latitude},${supplier.coordinates.longitude}`;
    Linking.openURL(url);
  };

  const handleSelectSupplier = supplier => {
    Alert.alert(
      'Select Supplier',
      `Would you like to add ${supplier.name} as your preferred supplier for this job?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Select',
          onPress: () => {
            // Here you would typically save the supplier selection
            // Alert.alert(
            //   'Success',
            //   `${supplier.name} has been added to your suppliers.`,
            // );
            navigation.navigate("OrderProducts");
          },
        },
      ],
    );
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

  const renderMapView = () => (
    <View style={styles.mapContainer}>
      {/* Mock Map View - In a real app, you'd use react-native-maps */}
      <View style={styles.mockMap}>
        <Text style={styles.mapPlaceholder}>Interactive Map View</Text>
        <Text style={styles.mapSubtext}>
          Showing {filteredSuppliers.length} suppliers nearby
        </Text>

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.mapControlButton}>
            <Icon name="my-location" size={24} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.mapControlButton}>
            <Icon name="zoom-in" size={24} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.mapControlButton}>
            <Icon name="zoom-out" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* Supplier Markers Preview */}
        <View style={styles.markersContainer}>
          {filteredSuppliers.slice(0, 3).map((supplier, index) => (
            <View
              key={supplier.id}
              style={[
                styles.markerPreview,
                {top: 100 + index * 80, left: 50 + index * 60},
              ]}>
              <Icon name="place" size={24} color="#ef4444" />
              <Text style={styles.markerText}>
                {supplier.name.split(' ')[0]}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom Sheet Preview */}
      <View style={styles.mapBottomSheet}>
        <View style={styles.bottomSheetHandle} />
        <Text style={styles.bottomSheetTitle}>Nearby Suppliers</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}>
          {filteredSuppliers.slice(0, 3).map(supplier => (
            <TouchableOpacity
              key={supplier.id}
              style={styles.mapSupplierCard}
              onPress={() => handleSelectSupplier(supplier)}>
              <Text style={styles.mapCardName}>{supplier.name}</Text>
              <Text style={styles.mapCardDistance}>{supplier.distance} mi</Text>
              {renderStarRating(supplier.rating)}
              <Text style={styles.mapCardHours}>
                {supplier.isOpen ? '🟢 Open' : '🔴 Closed'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  const renderListView = () => (
    <ScrollView
      style={styles.listContainer}
      showsVerticalScrollIndicator={false}>
      {/* Sort and Filter Controls */}
      <View style={styles.controlsContainer}>
        {/* <View style={styles.sortContainer}>
          <Text style={styles.controlLabel}>Sort by:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { key: 'distance', label: 'Distance', icon: 'navigation' },
              { key: 'rating', label: 'Rating', icon: 'star' },
              { key: 'name', label: 'Name', icon: 'sort-by-alpha' }
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.sortButton,
                  sortBy === option.key && styles.sortButtonActive
                ]}
                onPress={() => setSortBy(option.key)}
              >
                <Icon 
                  name={option.icon} 
                  size={16} 
                  color={sortBy === option.key ? 'white' : '#6b7280'} 
                />
                <Text style={[
                  styles.sortButtonText,
                  sortBy === option.key && styles.sortButtonTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View> */}

        <View style={styles.filterContainer}>
          <Text style={styles.controlLabel}>Category:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterButton,
                  filterCategory === category && styles.filterButtonActive,
                ]}
                onPress={() => setFilterCategory(category)}>
                <Text
                  style={[
                    styles.filterButtonText,
                    filterCategory === category &&
                      styles.filterButtonTextActive,
                  ]}>
                  {category === 'all' ? 'All Categories' : category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredSuppliers.length} supplier
          {filteredSuppliers.length !== 1 ? 's' : ''} found
        </Text>
        <Text style={styles.resultsSubtext}>
          {/* Sorted by {sortBy === 'distance' ? 'distance' : sortBy === 'rating' ? 'rating' : 'name'} */}
        </Text>
      </View>

      {/* Suppliers List */}
      <View style={styles.suppliersList}>
        {filteredSuppliers.map(supplier => (
          <View key={supplier.id} style={styles.supplierCard}>
            {/* Featured Badge */}
            {/* {supplier.featured && (
              <View style={styles.featuredBadge}>
                <Icon name="star" size={12} color="white" />
                <Text style={styles.featuredText}>Featured</Text>
              </View>
            )} */}

            {/* Supplier Header */}
            <View style={styles.supplierHeader}>
              <View style={styles.supplierInfo}>
                <Text style={styles.supplierName}>{supplier.name}</Text>
                <Text style={styles.supplierCategory}>{supplier.category}</Text>

                {/* Rating and Distance */}
                <View style={styles.supplierMeta}>
                  {/* {renderStarRating(supplier.rating)} */}
                  {/* <Text style={styles.ratingText}>
                    {supplier.rating} ({supplier.reviewCount} reviews)
                  </Text>
                  <Text style={styles.distanceText}>• {supplier.distance} mi</Text> */}
                </View>
              </View>

              {/* Status Indicator */}
              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.statusDot,
                    {backgroundColor: supplier.isOpen ? '#10b981' : '#ef4444'},
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    {color: supplier.isOpen ? '#10b981' : '#ef4444'},
                  ]}>
                  {supplier.isOpen ? 'Open' : 'Closed'}
                </Text>
              </View>
            </View>

            {/* Address */}
            <View style={styles.addressContainer}>
              <Icon name="place" size={16} color="#6b7280" />
              <Text style={styles.addressText}>
                {supplier.address}, {supplier.city}
              </Text>
            </View>

            {/* Hours */}
            <View style={styles.hoursContainer}>
              <Icon name="schedule" size={16} color="#6b7280" />
              <Text style={styles.hoursText}>
                {supplier.hours.open === '24/7'
                  ? '24/7 Open'
                  : `${supplier.hours.open} - ${supplier.hours.close} • ${supplier.hours.days}`}
              </Text>
            </View>

            {/* Specialties */}
            {/* <View style={styles.specialtiesContainer}>
              <Icon name="build" size={16} color="#6b7280" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {supplier.specialties.map((specialty, index) => (
                  <View key={index} style={styles.specialtyTag}>
                    <Text style={styles.specialtyText}>{specialty}</Text>
                  </View>
                ))}
              </ScrollView>
            </View> */}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              {/* <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleCall(supplier.phone)}>
                <Icon name="phone" size={24} color="#3B82F6" />
              </TouchableOpacity> */}

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEmail(supplier.email)}>
                <Icon name="email" size={24} color="#3B82F6" />
                {/* <Text style={styles.actionButtonText}>Email</Text> */}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDirections(supplier)}>
                <Icon name="directions" size={28} color="#3B82F6" />
                {/* <Text style={styles.actionButtonText}>Directions</Text> */}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.selectButton, {width: widthPercentageToDP(40)}]}
                onPress={() => navigation.navigate("OrderProducts")}>
                <Icon name="add" size={16} color="white" />
                <Text style={styles.selectButtonText}>Select</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
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
            // Filter functionality can be expanded
            Alert.alert('Filter', 'Filter options coming soon!');
          }}>
          {/* <Icon name="filter-list" size={24} color="white" /> */}
        </TouchableOpacity>
      </View>

      {/* View Toggle */}
      {/* <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'map' && styles.toggleButtonActive]}
          onPress={() => setViewMode('map')}
        >
          <Icon 
            name="map" 
            size={20} 
            color={viewMode === 'map' ? '#3B82F6' : 'white'} 
          />
          <Text style={[
            styles.toggleButtonText,
            viewMode === 'map' && styles.toggleButtonTextActive
          ]}>
            Map
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
          onPress={() => setViewMode('list')}
        >
          <Icon 
            name="list" 
            size={20} 
            color={viewMode === 'list' ? '#3B82F6' : 'white'} 
          />
          <Text style={[
            styles.toggleButtonText,
            viewMode === 'list' && styles.toggleButtonTextActive
          ]}>
            List
          </Text>
        </TouchableOpacity>
      </View> */}

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
    width:widthPercentageToDP(10),
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
    height: 24,
  },
});

export default SupplierSelectionScreen;
