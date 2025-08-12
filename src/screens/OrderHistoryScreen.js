import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  StyleSheet,
  Modal,
  Alert,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

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
  errorLight: '#FEE2E2',
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 8,
  },
};



const OrderHistoryScreen = ({
  user: propUser,
  onNavigate,
  hasLeadAccess: propHasLeadAccess,
  route
}) => {
  const navigation = useNavigation();

  // Mock user data
  const mockUser = {
    role: 'Lead Labor',
    name: 'Sarah Johnson'
  };

  const user = propUser || mockUser;
  const hasLeadAccess = propHasLeadAccess ?? user.role === 'Lead Labor';

  // Mock orders data
  const [orders, setOrders] = useState([
    {
      id: 'ORD-2024-001',
      jobId: 'JOB-001',
      supplier: 'ElectroSupply Pro',
      status: 'delivered',
      totalAmount: 156.48,
      orderDate: new Date('2024-01-15'),
      orderedBy: user.name,
      poNumber: 'PO-648291',
      customerName: 'JDP Electrics',
      customerAddress: '123 Main Street, Houston, TX 77001',
      customerPhone: '(555) 123-4567',
      items: [
        { name: '12 AWG Wire', sku: 'W12-100', price: 45.99, cartQuantity: 2 },
        { name: 'Electrical Outlet', sku: 'EO-15A', price: 12.99, cartQuantity: 5 }
      ]
    },
    {
      id: 'ORD-2024-002',
      jobId: 'JOB-002',
      supplier: 'PowerComponents Inc',
      status: 'pending',
      totalAmount: 89.75,
      orderDate: new Date('2024-01-20'),
      orderedBy: user.name,
      poNumber: 'PO-648292',
      customerName: 'JDP Electrics',
      customerAddress: '456 Oak Avenue, Houston, TX 77002',
      customerPhone: '(555) 123-4568',
      items: [
        { name: 'Circuit Breaker', sku: 'CB-20A', price: 28.50, cartQuantity: 3 },
        { name: 'Wire Nuts', sku: 'WN-12', price: 8.75, cartQuantity: 10 }
      ]
    },
    {
      id: 'ORD-2024-003',
      jobId: 'JOB-003',
      supplier: 'Industrial Electric Supply',
      status: 'order-received',
      totalAmount: 234.99,
      orderDate: new Date('2024-01-25'),
      orderedBy: user.name,
      poNumber: 'PO-648293',
      customerName: 'JDP Electrics',
      customerAddress: '789 Pine Street, Houston, TX 77003',
      customerPhone: '(555) 123-4569',
      items: [
        { name: 'Conduit', sku: 'CD-34', price: 15.99, cartQuantity: 8 },
        { name: 'Junction Box', sku: 'JB-46', price: 24.99, cartQuantity: 6 }
      ]
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [statusUpdateOrderId, setStatusUpdateOrderId] = useState(null);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.jobId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Status configuration
  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending': 
        return { 
          color: Colors.warningLight, 
          textColor: Colors.warning, 
          icon: 'schedule',
          label: 'Pending' 
        };
      case 'approved': 
        return { 
          color: Colors.primaryLight, 
          textColor: Colors.primary, 
          icon: 'check',
          label: 'Approved' 
        };
      case 'delivered': 
        return { 
          color: Colors.successLight, 
          textColor: Colors.successDark, 
          icon: 'local-shipping',
          label: 'Delivered' 
        };
      case 'cancelled': 
        return { 
          color: Colors.errorLight, 
          textColor: Colors.error, 
          icon: 'cancel',
          label: 'Cancelled' 
        };
      case 'order-received': 
        return { 
          color: Colors.purpleLight, 
          textColor: Colors.purple, 
          icon: 'inventory',
          label: 'Order Received' 
        };
      default: 
        return { 
          color: Colors.backgroundLight, 
          textColor: Colors.textLight, 
          icon: 'help',
          label: 'Unknown' 
        };
    }
  };

  // Statistics
  const totalOrderValue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  // Status filter options
  const statusFilters = [
    { key: 'all', label: 'All', count: orders.length },
    { key: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
    { key: 'order-received', label: 'Received', count: orders.filter(o => o.status === 'order-received').length },
    { key: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'order-received', label: 'Order Received' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Handlers
  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
    Alert.alert('Success', `Order ${orderId} status updated to ${newStatus.replace('-', ' ')}`);
    setShowStatusPicker(false);
    setStatusUpdateOrderId(null);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleNavigate = (screen) => {
    if (onNavigate) {
      onNavigate(screen);
    } else {
      navigation.navigate(screen);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const showStatusUpdatePicker = (orderId) => {
    setStatusUpdateOrderId(orderId)
    setShowStatusPicker(true);
  };

  // Render components
  const renderFilterButton = (filter) => (
    <TouchableOpacity
      key={filter.key}
      style={[
        styles.filterButton,
        statusFilter === filter.key && styles.activeFilterButton
      ]}
      onPress={() => setStatusFilter(filter.key)}
    >
      <Text style={[
        styles.filterButtonText,
        statusFilter === filter.key && styles.activeFilterButtonText
      ]}>
        {filter.label} ({filter.count})
      </Text>
    </TouchableOpacity>
  );

  const renderOrderCard = ({ item: order }) => {
    const statusConfig = getStatusConfig(order.status);
    
    return (
      <View style={styles.orderCard}>
        {/* Order Header */}
        <View style={styles.orderHeader}>
          <View style={styles.orderHeaderLeft}>
            <View style={styles.orderIdRow}>
              <Text style={styles.orderId}>{order.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusConfig.color }]}>
                <Icon name={statusConfig.icon} size={12} color={statusConfig.textColor} />
                <Text style={[styles.statusText, { color: statusConfig.textColor }]}>
                  {statusConfig.label}
                </Text>
              </View>
            </View>
            <Text style={styles.orderSubInfo}>Job: {order.jobId}</Text>
            <Text style={styles.orderSubInfo}>{order.supplier}</Text>
          </View>
          
          <View style={styles.orderHeaderRight}>
            <Text style={styles.orderAmount}>${order.totalAmount.toFixed(2)}</Text>
            <Text style={styles.orderDate}>{order.orderDate.toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Customer Details */}
        <View style={styles.customerDetails}>
          <View style={styles.customerDetailsHeader}>
            <Icon name="receipt" size={16} color={Colors.primary} />
            <Text style={styles.customerDetailsTitle}>Customer Details</Text>
          </View>
          
          <View style={styles.customerDetailsContent}>
            <View style={styles.customerDetailRow}>
              <Text style={styles.customerDetailLabel}>PO Number:</Text>
              <Text style={styles.customerDetailValue}>{order.poNumber}</Text>
            </View>
            <View style={styles.customerDetailRow}>
              <Text style={styles.customerDetailLabel}>Name:</Text>
              <Text style={styles.customerDetailValue}>{order.customerName}</Text>
            </View>
            <View style={styles.customerDetailRow}>
              <Text style={styles.customerDetailLabel}>Phone:</Text>
              <Text style={styles.customerDetailValue}>{order.customerPhone}</Text>
            </View>
            <View style={styles.customerDetailColumn}>
              <Text style={styles.customerDetailLabel}>Address:</Text>
              <Text style={styles.customerDetailValueMultiline}>{order.customerAddress}</Text>
            </View>
          </View>
        </View>

        {/* Order Items Preview */}
        <View style={styles.orderItemsPreview}>
          <Text style={styles.orderItemsTitle}>Items ({order.items.length})</Text>
          {order.items.slice(0, 2).map((item, idx) => (
            <View key={idx} style={styles.orderItemPreview}>
              <View style={styles.orderItemInfo}>
                <Text style={styles.orderItemName}>{item.name}</Text>
                <Text style={styles.orderItemSku}>SKU: {item.sku}</Text>
              </View>
              <Text style={styles.orderItemQuantity}>{item.cartQuantity}x</Text>
            </View>
          ))}
          {order.items.length > 2 && (
            <Text style={styles.moreItemsText}>
              +{order.items.length - 2} more items
            </Text>
          )}
        </View>

        {/* Actions */}
        <View style={styles.orderActions}>
          <View style={styles.orderStatusInfo}>
            <Icon name={statusConfig.icon} size={16} color={statusConfig.textColor} />
            <Text style={styles.orderStatusText}>{statusConfig.label}</Text>
          </View>
          
          <View style={styles.orderActionButtons}>
            {hasLeadAccess && order.status !== 'cancelled' && (
              <TouchableOpacity 
                style={styles.statusUpdateButton}
                onPress={() => showStatusUpdatePicker(order.id)}
              >
                <Icon name="edit" size={16} color={Colors.primary} />
                <Text style={styles.statusUpdateText}>Update</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.detailsButton}
              onPress={() => handleViewDetails(order)}
            >
              <Icon name="visibility" size={16} color={Colors.primary} />
              <Text style={styles.detailsButtonText}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Order History</Text>
            <Text style={styles.headerSubtitle}>{orders.length} total orders</Text>
          </View>
          
          <TouchableOpacity style={styles.downloadButton}>
            <Icon name="download" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={Colors.primaryLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search orders..."
            placeholderTextColor={Colors.primaryLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{pendingOrders}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>${totalOrderValue.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Value</Text>
          </View>
        </View>
      </View>

      {/* Status Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterButtons}>
            {statusFilters.map(renderFilterButton)}
          </View>
        </ScrollView>
      </View>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="inventory" size={64} color={Colors.textLight} />
          <Text style={styles.emptyStateTitle}>No orders found</Text>
          <Text style={styles.emptyStateSubtitle}>
            {searchQuery ? 'Try adjusting your search terms' : "You haven't placed any orders yet"}
          </Text>
          <TouchableOpacity 
            style={styles.startShoppingButton}
            onPress={() => handleNavigate('SupplierSelectionScreen')}
          >
            <Text style={styles.startShoppingText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderCard}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.ordersList}
        />
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          visible={showOrderDetails}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowOrderDetails(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.orderDetailsModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Order Details - {selectedOrder.id}</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowOrderDetails(false)}
                >
                  <Icon name="close" size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                {/* Customer Information */}
                <View style={styles.modalSection}>
                  <View style={styles.modalSectionHeader}>
                    <Icon name="receipt" size={20} color={Colors.primary} />
                    <Text style={styles.modalSectionTitle}>Customer Information</Text>
                  </View>
                  
                  <View style={styles.customerInfoGrid}>
                    <View style={styles.customerInfoItem}>
                      <Text style={styles.customerInfoLabel}>PO Number:</Text>
                      <Text style={styles.customerInfoValue}>{selectedOrder.poNumber}</Text>
                    </View>
                    <View style={styles.customerInfoItem}>
                      <Text style={styles.customerInfoLabel}>Customer Name:</Text>
                      <Text style={styles.customerInfoValue}>{selectedOrder.customerName}</Text>
                    </View>
                    <View style={styles.customerInfoItem}>
                      <Text style={styles.customerInfoLabel}>Phone Number:</Text>
                      <Text style={styles.customerInfoValue}>{selectedOrder.customerPhone}</Text>
                    </View>
                    <View style={styles.customerInfoItem}>
                      <Text style={styles.customerInfoLabel}>Address:</Text>
                      <Text style={styles.customerInfoValue}>{selectedOrder.customerAddress}</Text>
                    </View>
                  </View>
                </View>

                {/* Order Items */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Order Items</Text>
                  {selectedOrder.items.map((item, index) => (
                    <View key={index} style={styles.orderItemDetail}>
                      <View style={styles.orderItemDetailInfo}>
                        <Text style={styles.orderItemDetailName}>{item.name}</Text>
                        <Text style={styles.orderItemDetailSku}>SKU: {item.sku}</Text>
                        <Text style={styles.orderItemDetailQuantity}>Quantity: {item.cartQuantity}</Text>
                      </View>
                      <View style={styles.orderItemDetailPrice}>
                        <Text style={styles.orderItemDetailPriceText}>
                          ${(item.price * item.cartQuantity).toFixed(2)}
                        </Text>
                        <Text style={styles.orderItemDetailPriceUnit}>
                          ${item.price.toFixed(2)} each
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Order Summary */}
                <View style={styles.modalSection}>
                  <View style={styles.orderSummaryGrid}>
                    <View style={styles.orderSummaryItem}>
                      <Text style={styles.orderSummaryLabel}>Order Date:</Text>
                      <Text style={styles.orderSummaryValue}>{selectedOrder.orderDate.toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.orderSummaryItem}>
                      <Text style={styles.orderSummaryLabel}>Supplier:</Text>
                      <Text style={styles.orderSummaryValue}>{selectedOrder.supplier}</Text>
                    </View>
                    <View style={styles.orderSummaryItem}>
                      <Text style={styles.orderSummaryLabel}>Job ID:</Text>
                      <Text style={styles.orderSummaryValue}>{selectedOrder.jobId}</Text>
                    </View>
                    <View style={styles.orderSummaryDivider} />
                    <View style={styles.orderSummaryTotal}>
                      <Text style={styles.orderSummaryTotalLabel}>Total Amount:</Text>
                      <Text style={styles.orderSummaryTotalValue}>${selectedOrder.totalAmount.toFixed(2)}</Text>
                    </View>
                  </View>
                </View>

                {/* Lead Actions */}
                {hasLeadAccess && (
                  <View style={styles.modalSection}>
                    <View style={styles.leadActionsContainer}>
                      <Text style={styles.leadActionsTitle}>Lead Actions</Text>
                      <Text style={styles.leadActionsSubtitle}>
                        Update order status or manage this order as needed.
                      </Text>
                      <TouchableOpacity 
                        style={styles.updateStatusButton}
                        onPress={() => {
                          setShowOrderDetails(false);
                          showStatusUpdatePicker(selectedOrder.id);
                        }}
                      >
                        <Text style={styles.updateStatusButtonText}>Update Order Status</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Status Update Picker */}
      {showStatusPicker && statusUpdateOrderId && (
        <Modal
          visible={showStatusPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowStatusPicker(false)}
        >
          <View style={styles.pickerModalOverlay}>
            <View style={styles.pickerModal}>
              <Text style={styles.pickerTitle}>Update Order Status</Text>
              
              {statusOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.pickerOption}
                  onPress={() => handleStatusUpdate(statusUpdateOrderId, option.value)}
                >
                  <Text style={styles.pickerOptionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity
                style={styles.pickerCancelButton}
                onPress={() => setShowStatusPicker(false)}
              >
                <Text style={styles.pickerCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.primaryLight,
    marginTop: Spacing.xs,
  },
  downloadButton: {
    padding: Spacing.sm,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.white,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.primaryLight,
    marginTop: Spacing.xs,
  },

  // Filter
  filterContainer: {
    backgroundColor: Colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: Spacing.lg,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeFilterButtonText: {
    color: Colors.white,
  },

  // Orders List
  ordersList: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },

  // Order Card
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  orderHeaderLeft: {
    flex: 1,
  },
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  orderSubInfo: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  orderHeaderRight: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  orderDate: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },

  // Customer Details
  customerDetails: {
    backgroundColor: Colors.primaryLight,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  customerDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  customerDetailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  customerDetailsContent: {
    gap: Spacing.sm,
  },
  customerDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerDetailColumn: {
    gap: Spacing.xs,
  },
  customerDetailLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  customerDetailValue: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
  },
  customerDetailValueMultiline: {
    fontSize: 12,
    color: Colors.text,
  },

  // Order Items Preview
  orderItemsPreview: {
    backgroundColor: Colors.backgroundLight,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  orderItemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  orderItemPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 13,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  orderItemSku: {
    fontSize: 11,
    color: Colors.textLight,
  },
  orderItemQuantity: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  moreItemsText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },

  // Order Actions
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  orderStatusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  orderStatusText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  orderActionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statusUpdateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    gap: Spacing.xs,
  },
  statusUpdateText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primaryLight,
    gap: Spacing.xs,
  },
  detailsButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  startShoppingButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  startShoppingText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },

  // Modal Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  orderDetailsModal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.lg,
  },

  // Modal Sections
  modalSection: {
    marginBottom: Spacing.xl,
  },
  modalSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },

  // Customer Info Grid
  customerInfoGrid: {
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  customerInfoItem: {
    gap: Spacing.xs,
  },
  customerInfoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  customerInfoValue: {
    fontSize: 14,
    color: Colors.text,
  },

  // Order Item Detail
  orderItemDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  orderItemDetailInfo: {
    flex: 1,
  },
  orderItemDetailName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  orderItemDetailSku: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  orderItemDetailQuantity: {
    fontSize: 14,
    color: Colors.textLight,
  },
  orderItemDetailPrice: {
    alignItems: 'flex-end',
  },
  orderItemDetailPriceText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  orderItemDetailPriceUnit: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },

  // Order Summary Grid
  orderSummaryGrid: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  orderSummaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  orderSummaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  orderSummaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  orderSummaryDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  orderSummaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderSummaryTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  orderSummaryTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },

  // Lead Actions
  leadActionsContainer: {
    backgroundColor: Colors.warningLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.warning + '30',
  },
  leadActionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  leadActionsSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  updateStatusButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  updateStatusButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },

  // Picker Modal
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerModal: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    minWidth: 280,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  pickerOption: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerOptionText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
  pickerCancelButton: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.sm,
  },
  pickerCancelText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default OrderHistoryScreen;