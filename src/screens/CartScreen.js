import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Modal,
  Image,
  Alert,
  Linking,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {heightPercentageToDP, widthPercentageToDP} from '../utils';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart, updateQuantity} from '../redux/cartSlice';
import {createProduct} from '../config/apiConfig';
import DeviceInfo from 'react-native-device-info';

// Embedded Colors
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
  errorLight: '#FEE2E2',
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
};

const Shadows = {
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
};

const CartScreen = ({onBack, onNavigate, route}) => {
  const {id, job} = route.params;
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const token = useSelector(state => state.user.token);
  const user = useSelector(state => state.user.user);

  console.log('cartitemss', id, job.job.id, user?.leadLabor?.[0].id);

  const handleAddMaterial = async () => {
    try {
      const payload = {
        ...material,
        stock_quantity: Number(material.stock_quantity),
        unit_cost: Number(material.unit_cost),
        supplier_id: Number(material.supplier_id),
        system_ip: deviceId._j,
      };

      const res = await createProduct(payload, token);

      dispatch(addToCart(res.data));
      Alert.alert('Success', 'Material added successfully!');
      setShowAddEntryModal(false);
    } catch (error) {
      console.error('Error adding material:', error);
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };

  const navigation = useNavigation();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showAddEntryModal, setShowAddEntryModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [newEntry, setNewEntry] = useState({
    activity: '',
    startTime: '',
    endTime: '',
    description: '',
    location: '',
    worker: '',
    isManual: true,
  });
  const [timeEntries, setTimeEntries] = useState([]);

  const [material, setMaterial] = useState({
    product_name: '',
    supplier_sku: '',
    stock_quantity: '',
    unit: 'pieces',
    unit_cost: '',
    supplier_id: id,
    job_id: job?.job?.id || '',
    is_custom: true,
  });

  // Device unique ID
  const deviceId = DeviceInfo.getUniqueId();

  // ✅ Update Quantity (Redux)
  const handleUpdateQuantity = (itemId, newQuantity) => {
    dispatch(updateQuantity({productId: itemId, newQuantity}));
  };

  // ✅ Remove item
  const handleRemoveItem = itemId => {
    dispatch(updateQuantity({productId: itemId, newQuantity: 0}));
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  const handleCall = phoneNumber => {
    Linking.openURL(`tel:${6184738399}`);
  };
  const handleEmail = email => {
    Linking.openURL(`mailto:${'orders@circuitcity.com'}`);
  };

  const openWhatsApp = (phone, message) => {
    let url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(
      message,
    )}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          Alert.alert('WhatsApp is not installed');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error('Error', err));
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  const renderClearConfirmModal = () => (
    <Modal
      visible={showClearConfirm}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowClearConfirm(false)}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowClearConfirm(false)}>
          <View style={styles.clearModal}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Clear Cart</Text>
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.modalDescription}>
                Are you sure you want to remove all items from your cart? This
                action cannot be undone.
              </Text>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowClearConfirm(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.clearButton}
                  // onPress={clearCart}
                >
                  <Text style={styles.clearButtonText}>Clear Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Cart</Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Empty State */}
        <View style={styles.emptyStateContainer}>
          <Icon name="shopping-cart" size={80} color={Colors.textLight} />
          <Text style={styles.emptyStateTitle}>Your cart is empty</Text>
          <Text style={styles.emptyStateSubtitle}>
            Add some products to get started with your order
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('OrderProducts')}>
            <Icon name="inventory" size={20} color={Colors.white} />
            <Text style={styles.browseButtonText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  const calculateDuration = (startTime, endTime) => {
    // Simple duration calculation (would use proper time parsing in real app)
    const start = new Date(`2024-01-01 ${startTime}`);
    const end = new Date(`2024-01-01 ${endTime}`);
    return Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60));
  };
  const handleAddEntry = () => {
    if (!newEntry.activity || !newEntry.startTime || !newEntry.endTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const duration = calculateDuration(newEntry.startTime, newEntry.endTime);
    const entry = {
      id: Date.now().toString(),
      activity: newEntry.activity,
      startTime: newEntry.startTime,
      endTime: newEntry.endTime,
      duration,
      description: newEntry.description || '',
      location: newEntry.location || '',
      worker: newEntry.worker || '',
      isManual: true,
      jobId: newEntry.jobId,
    };

    setTimeEntries(prev => [...prev, entry]);
    setNewEntry({
      activity: '',
      startTime: '',
      endTime: '',
      description: '',
      location: '',
      worker: '',
      isManual: true,
    });
    setShowAddEntryModal(false);
  };

  const renderAddEntryModal = () => (
    <Modal
      visible={showAddEntryModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowAddEntryModal(false)}>
      <View style={styles.modalOverlay1}>
        <View style={styles.addEntryModal}>
          {/* Header */}
          <View style={styles.modalHeader1}>
            <Text style={styles.modalTitle1}>Add Material</Text>
            <TouchableOpacity onPress={() => setShowAddEntryModal(false)}>
              <Icon name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
            <ScrollView
              style={styles.modalContent1}
              showsVerticalScrollIndicator={false}>
              {/* Material Name */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Material Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={material.product_name}
                  onChangeText={text =>
                    setMaterial(prev => ({...prev, product_name: text}))
                  }
                  placeholder="Enter material name"
                  placeholderTextColor={Colors.textLight}
                />
              </View>

              {/* SKU */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>SKU</Text>
                <TextInput
                  style={styles.textInput}
                  value={material.supplier_sku}
                  onChangeText={text =>
                    setMaterial(prev => ({...prev, supplier_sku: text}))
                  }
                  placeholder="Enter SKU"
                  placeholderTextColor={Colors.textLight}
                />
              </View>

              {/* Quantity + Unit */}
              <View style={styles.timeInputRow}>
                <View
                  style={[
                    styles.formField,
                    {flex: 1, marginRight: Spacing.sm},
                  ]}>
                  <Text style={styles.fieldLabel}>Quantity *</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={material.stock_quantity.toString()}
                    onChangeText={text =>
                      setMaterial(prev => ({...prev, stock_quantity: text}))
                    }
                    placeholder="0"
                    placeholderTextColor={Colors.textLight}
                  />
                </View>

                <View
                  style={[styles.formField, {flex: 1, marginLeft: Spacing.sm}]}>
                  <Text style={styles.fieldLabel}>Unit *</Text>
                  {renderDropdown(
                    [
                      {label: 'Pieces', value: 'pieces'},
                      {label: 'Feet', value: 'feet'},
                      {label: 'Box', value: 'box'},
                      {label: 'Roll', value: 'roll'},
                    ],
                    material.unit,
                    val => setMaterial(prev => ({...prev, unit: val})),
                    showStatusDropdown,
                    () => {
                      setShowStatusDropdown(!showStatusDropdown);
                      setShowSortDropdown(false);
                    },
                    'Select Unit',
                  )}
                </View>
              </View>

              {/* Unit Cost */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Unit Cost *</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={material.unit_cost.toString()}
                  onChangeText={text =>
                    setMaterial(prev => ({...prev, unit_cost: text}))
                  }
                  placeholder="0"
                  placeholderTextColor={Colors.textLight}
                />
              </View>

              {/* Supplier */}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Supplier ID *</Text>
                <TextInput
                  style={styles.textInput}
                  value={material.supplier_id.toString()}
                  onChangeText={text =>
                    setMaterial(prev => ({...prev, supplier_id: text}))
                  }
                  placeholder="Enter Supplier ID"
                  placeholderTextColor={Colors.textLight}
                  editable={false}
                />
              </View>

              {/* Total Cost */}
              {/* <View style={styles.formField}>
                <Text style={styles.fieldLabel}>
                  Total Cost: $
                  {(
                    Number(material.stock_quantity) * Number(material.unit_cost) || 0
                  ).toFixed(2)}
                </Text>
              </View> */}
            </ScrollView>

            {/* Footer Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddEntryModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddMaterial}>
                <Text style={styles.saveButtonText}>Add Material</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );

  const renderDropdown = (
    options,
    selectedValue,
    onSelect,
    isVisible,
    onToggle,
    placeholder,
  ) => (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdownButton} onPress={onToggle}>
        <Text style={styles.dropdownButtonText}>
          {options.find(opt => opt.value === selectedValue)?.label ||
            placeholder}
        </Text>
        <Text style={styles.dropdownArrow}>{isVisible ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {isVisible && (
        <View style={styles.dropdownMenu}>
          {options.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.dropdownMenuItem,
                selectedValue === option.value &&
                  styles.dropdownMenuItemSelected,
              ]}
              onPress={() => {
                onSelect(option.value);
                onToggle();
              }}>
              <Text
                style={[
                  styles.dropdownMenuItemText,
                  selectedValue === option.value &&
                    styles.dropdownMenuItemTextSelected,
                ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Cart</Text>
          <Text style={styles.headerSubtitle}>{getTotalItems()} items</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.addButton,
            {
              width: widthPercentageToDP(8),
              height: heightPercentageToDP(3),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#3B82F6',
              alignSelf: 'flex-end',
              marginHorizontal: 16,
              marginTop: 10,
              borderRadius: 10,
            },
          ]}
          onPress={() => setShowAddEntryModal(true)}>
          <Icon name="add" size={24} color={'#fff'} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {cartItems.map(item => (
          <View key={item.id} style={styles.cartItem}>
            <View style={styles.cartItemContent}>
              {/* Product Image */}
              <View style={styles.productImageContainer}>
                {item.image ? (
                  <Image
                    source={{uri: item.image}}
                    style={styles.productImage}
                  />
                ) : (
                  <Icon name="inventory" size={40} color={Colors.textLight} />
                )}
              </View>

              {/* Product Info */}
              <View style={styles.productInfo}>
                <View style={styles.productHeader}>
                  <View style={styles.productTitleContainer}>
                    <Text style={styles.productName}>{item.product_name}</Text>
                    <Text style={styles.productDescription}>
                      {item.description}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveItem(item.id)}>
                    <Icon name="delete" size={20} color={Colors.error} />
                  </TouchableOpacity>
                </View>

                <View style={styles.productDetails}>
                  <Text style={styles.productSku}>SKU: {item.jdp_sku}</Text>
                  <View style={styles.supplierBadge}>
                    {/* <Text style={styles.supplierText}>{item.supplier}</Text> */}
                  </View>
                </View>

                {/* Quantity Controls */}
                <View style={styles.quantityControls}>
                  <View style={styles.quantitySection}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }>
                      <Icon name="remove" size={20} color={Colors.text} />
                    </TouchableOpacity>
                    <View style={styles.quantityDisplay}>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      disabled={item.quantity >= item.stock_quantity}
                      onPress={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }>
                      <Icon name="add" size={20} color={Colors.text} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.priceSection}>
                    {/* <Text style={styles.priceText}>Quote Required</Text> */}
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
          </View>

          <View style={styles.summaryContent}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Items</Text>
              <Text style={styles.summaryValue}>{getTotalItems()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Unique Products</Text>
              <Text style={styles.summaryValue}>{cartItems.length}</Text>
            </View>
            <View style={styles.summaryDivider} />
            {/* <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>Quote on Request</Text>
            </View> */}
          </View>

          {/* <View style={styles.summaryNotice}>
            <Text style={styles.noticeTitle}>📋 Note about pricing:</Text>
            <Text style={styles.noticeText}>
              Product pricing will be provided via custom quote based on current market rates and your company's pricing agreement.
            </Text>
          </View> */}
        </View>

        <View style={{height: 120}} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.continueButton, {backgroundColor: '#f3f4f6'}]}
            onPress={() => handleCall()}
            // onPress={() => handleNavigate('OrderProducts')}
          >
            {/* <Ionicons name="call" size={20} color={"#fff"} /> */}
            <Icon name="phone" size={22} color="#3B82F6" />
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={[styles.continueButton, {backgroundColor: '#f3f4f6'}]}
            onPress={() =>
              openWhatsApp('+911234567890', 'Hello! This is a test message.')
            }>
            <FontAwesome name="whatsapp" size={22} color="#3B82F6" />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={[styles.continueButton, {backgroundColor: '#f3f4f6'}]}
            onPress={() => handleEmail()}>
            <Icon name="email" size={22} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() =>
              navigation.navigate('CheckoutScreen', {
                leadLabourId: user?.leadLabor?.[0].id,
                jobData: job,
                supplierId: id,
              })
            }
            // onPress={() => handleNavigate('CheckoutScreen')}
          >
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Clear Confirmation Modal */}
      {renderClearConfirmModal()}
      {renderAddEntryModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },

  // Header
  header: {
    backgroundColor: Colors.white,
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  headerSpacer: {
    width: 40,
  },
  clearButton: {
    padding: Spacing.sm,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },

  // Cart Items
  cartItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  cartItemContent: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  productImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.lg,
  },
  productInfo: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  productTitleContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  productDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  removeButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  productDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  productSku: {
    fontSize: 12,
    color: Colors.textLight,
  },
  supplierBadge: {
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  supplierText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },

  // Quantity Controls
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  quantityDisplay: {
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    minWidth: 48,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.primary + '30',
    marginTop: Spacing.md,
  },
  summaryHeader: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  summaryContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  summaryNotice: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  noticeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  // Empty State
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  browseButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
  },

  // Bottom Actions
  bottomActions: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: Spacing.md,
    paddingBottom: 40,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  continueButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  checkoutButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 15,
    color: Colors.white,
    fontWeight: '700',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  clearModal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    maxHeight: '50%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  clearButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
  },

  // Modal
  modalOverlay1: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  addEntryModal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    // maxHeight: '90%',
    height: heightPercentageToDP(90),
  },
  modalHeader1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle1: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  modalContent1: {
    flex: 1,
    padding: Spacing.lg,
  },

  // Form Fields
  formField: {
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  timeInputRow: {
    flexDirection: 'row',
  },

  // Modal Actions
  modalActions1: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  cancelButton1: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelButtonText1: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  dropdownContainer: {
    flex: 1,
    position: 'relative',
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
});

export default CartScreen;
