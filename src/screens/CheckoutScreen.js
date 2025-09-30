import React, {useState} from 'react';
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
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import {createOrders} from '../config/apiConfig';
import {clearCart} from '../redux/cartSlice';

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

const CheckoutScreen = ({onBack, onNavigate, route}) => {
  const navigation = useNavigation();
  const deviceId = DeviceInfo.getUniqueId();
  console.log('deviceIddeviceId>>>', deviceId._j);
  const token = useSelector(state => state.user.token);
  const dispatch = useDispatch();
  const {leadLabourId, jobData, supplierId} = route.params;
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [loading, setLoading] = useState(false);
  const cartItems = useSelector(state => state.cart.items);
  console.log('Labour ID:', leadLabourId, cartItems);
  console.log('Job ID:', jobData);
  console.log('Supplier ID:', supplierId);
  const jobId = jobData?.job?.id;

  const handlePlaceOrder = async () => {
    const today = new Date().toISOString().split('T')[0];
    const formattedCartItems = cartItems.map(item => ({
      product_id: item?.id,
      quantity: item?.quantity,
    }));

    const payload = {
      lead_labour_id: leadLabourId,
      job_id: jobId,
      supplier_id: supplierId,
      customer_id: jobData?.job?.customer_id,
      contractor_id: jobData?.job?.contractor_id,
      // totalItems: formattedCartItems?.length,
      cartItems: formattedCartItems,
      // order details.
      order_date: today,
      delivery_address: jobData?.job?.customer?.address,
      // delivery_city_zip: 'New York, NY 10001',
      delivery_phone: jobData?.job?.customer?.phone,
      created_from: 'app',
      status: 'pending',
      system_ip: deviceId._j,
      notes: specialInstructions,
      internal_notes: 'Internal notes',
    };
    try {
      setLoading(true);
      const res = await createOrders(payload, token);
      dispatch(clearCart()); // clear cart
      Alert.alert('Success', 'Order Created successfully!');
      navigation.navigate('OrderConfirmationScreen', {order: res});
    } catch (error) {
      console.error('Error Creating Order:', error);
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  const renderOrderSummaryModal = () => (
    <Modal
      visible={showOrderSummary}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowOrderSummary(false)}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowOrderSummary(false)}>
          <View style={styles.orderSummaryModal}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Summary</Text>
            </View>

            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}>
              {cartItems?.map(item => (
                <View key={item.id} style={styles.summaryItem}>
                  <View style={styles.summaryItemInfo}>
                    <Text style={styles.summaryItemName}>
                      {item.product_name}
                    </Text>
                    <Text style={styles.summaryItemSku}>
                      SKU: {item.jdp_sku}
                    </Text>
                    <Text style={styles.summaryItemSupplier}>
                      Supplier: {item.suppliers.contact_person}
                    </Text>
                  </View>
                  <View style={styles.summaryItemQuantity}>
                    <Text style={styles.summaryQuantityText}>
                      Qty: {item.quantity}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View style={{}}>
              <View style={styles.summaryTotals}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    Items (
                    {cartItems?.reduce((sum, item) => sum + item.quantity, 0)})
                  </Text>
                  {/* <Text style={styles.summaryValue}>Quote on Request</Text> */}
                </View>

                <View style={styles.summaryDivider} />
                {/* <View style={styles.summaryRow}>
                    <Text style={styles.summaryTotalLabel}>Total</Text>
                    <Text style={styles.summaryTotalValue}>
                      Quote on Request
                    </Text>
                  </View> */}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Checkout</Text>

        <TouchableOpacity
          style={styles.summaryButton}
          onPress={() => setShowOrderSummary(true)}>
          <Text style={styles.summaryButtonText}>Summary</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="inventory" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Order Summary</Text>
          </View>

          <View style={styles.cardContent}>
            {cartItems?.slice(0, 2).map(item => (
              <View key={item.id} style={styles.orderItem}>
                <View style={styles.orderItemInfo}>
                  <Text style={styles.orderItemName}>{item.product_name}</Text>
                  <Text style={styles.orderItemQuantity}>
                    Qty: {item.quantity}
                  </Text>
                </View>
              </View>
            ))}

            {cartItems?.length > 2 && (
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => setShowOrderSummary(true)}>
                <Text style={styles.viewMoreText}>
                  View {cartItems.length - 2} more items
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.orderSummaryDivider} />
            <View style={styles.orderSummaryTotal}>
              <Text style={styles.totalItemsText}>
                Total Items:{' '}
                {cartItems?.reduce((sum, item) => sum + item.quantity, 0)}
              </Text>
              {/* <Text style={styles.totalValueText}>Quote on Request</Text> */}
            </View>
          </View>
        </View>

        {/* Special Instructions */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Special Instructions</Text>
          </View>

          <View style={styles.cardContent}>
            <TextInput
              style={styles.textAreaInput}
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              placeholder="Any special instructions or requirements..."
              placeholderTextColor={Colors.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Important Notice */}
        {/* <View style={styles.noticeCard}>
          <View style={styles.noticeContent}>
            <Icon name="info" size={20} color={Colors.warning} />
            <View style={styles.noticeText}>
              <Text style={styles.noticeTitle}>Quote Required</Text>
              <Text style={styles.noticeDescription}>
                Product pricing will be provided via quote based on current
                market rates and availability.
              </Text>
            </View>
          </View>
        </View> */}

        <View style={{height: 100}} />
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <TouchableOpacity
          disabled={loading}
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderText}>
            {loading ? 'Placing Order..' : 'Place Order'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Order Summary Modal */}
      {renderOrderSummaryModal()}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  summaryButton: {
    padding: Spacing.sm,
  },
  summaryButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },

  // Cards
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  cardContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },

  // Order Summary
  orderItem: {
    paddingVertical: Spacing.sm,
  },
  orderItemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    flex: 1,
  },
  orderItemQuantity: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  viewMoreButton: {
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  orderSummaryDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  orderSummaryTotal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  totalItemsText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  totalValueText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },

  // Input Fields
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  textAreaInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.white,
    minHeight: 80,
    textAlignVertical: 'top',
  },

  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  selectedRadioButton: {
    borderColor: Colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },

  // Notice Card
  noticeCard: {
    backgroundColor: Colors.warningLight,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.warning + '30',
    marginBottom: Spacing.md,
  },
  noticeContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  noticeText: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  noticeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // Bottom Action
  bottomAction: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: Spacing.md,
    paddingBottom: 50,
  },
  placeOrderButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  placeOrderText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
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
  orderSummaryModal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    height: '80%',
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
    flex: 1,
  },

  // Summary Modal Items
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryItemInfo: {
    flex: 1,
  },
  summaryItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  summaryItemSku: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  summaryItemSupplier: {
    fontSize: 12,
    color: Colors.textLight,
  },
  summaryItemQuantity: {
    alignItems: 'flex-end',
  },
  summaryQuantityText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },

  // Summary Totals
  summaryTotals: {
    paddingTop: Spacing.md,
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
});

export default CheckoutScreen;
