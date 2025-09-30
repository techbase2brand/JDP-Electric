import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Animated,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

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
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 8,
  },
};

const OrderConfirmationScreen = ({
  onNavigate,
  orderData: propOrderData,
  user: propUser,
  route,
}) => {
  const navigation = useNavigation();
  const [showConfetti, setShowConfetti] = useState(true);
  const [orderNumber, setOrderNumber] = useState('');
  const [confettiAnimations] = useState(
    [...Array(20)].map(() => new Animated.Value(0)),
  );

  // Generate order number
  useEffect(() => {
    const generateOrderNumber = () => {
      const timestamp = Date.now().toString().slice(-6);
      return timestamp;
    };
    setOrderNumber(generateOrderNumber());
  }, []);

  // Mock data
  const mockOrderData = {
    orderId: `ORD-${orderNumber}`,
    totalAmount: 0, // Quote on request
    items: [
      {name: '12 AWG Wire', quantity: 2, price: 0, sku: 'W12-100'},
      {name: 'Electrical Outlet', quantity: 5, price: 0, sku: 'EO-15A'},
      {name: 'Circuit Breaker', quantity: 1, price: 0, sku: 'CB-20A'},
    ],
  };

  const mockUser = {
    name: 'JDP Electrics',
    phone: '(555) 123-4567',
    email: 'orders@jdpelectric.com',
  };

  const order = route?.params?.order || mockOrderData;
  console.log('orderorderorder', order?.data);

  // Confetti animation
  useEffect(() => {
    if (showConfetti) {
      confettiAnimations.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 3000,
          delay: Math.random() * 1000,
          useNativeDriver: true,
        }).start();
      });

      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleShareOrder = async () => {
    try {
      await Share.share({
        title: `Order ${order.orderId}`,
        message: `Order placed successfully for ${order.items.length} items. PO Number: PO-${orderNumber}`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleNavigate = screen => {
    if (onNavigate) {
      onNavigate(screen);
    } else {
      navigation.navigate(screen);
    }
  };

  const formatDate = date => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.success} />

      {/* Confetti Animation */}
      {showConfetti && (
        <View style={styles.confettiContainer}>
          {confettiAnimations.map((anim, index) => (
            <Animated.View
              key={index}
              style={[
                styles.confetti,
                {
                  left: Math.random() * 350,
                  backgroundColor:
                    index % 3 === 0
                      ? Colors.primary
                      : index % 3 === 1
                      ? Colors.success
                      : Colors.orange,
                  transform: [
                    {
                      translateY: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-50, 800],
                      }),
                    },
                    {
                      rotate: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                  opacity: anim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1, 0],
                  }),
                },
              ]}
            />
          ))}
        </View>
      )}

      {/* Success Header */}
      <View style={styles.header}>
        <View style={styles.successIcon}>
          <Icon name="check-circle" size={60} color={Colors.success} />
        </View>

        <Text style={styles.headerTitle}>Order Placed Successfully!</Text>
        <Text style={styles.headerSubtitle}>
          Your order has been confirmed and is being processed
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing.sm,
                paddingBottom: Spacing.md,
              }}>
              <Icon name="receipt" size={20} color={Colors.primary} />
              <Text style={styles.cardTitle}>Order Summary</Text>
            </View>

            <View style={styles.statusBadge}>
              <Icon name="check-circle" size={16} color={Colors.successDark} />
              <Text style={styles.statusText}>Confirmed</Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.orderInfo}>
              <View style={styles.orderInfoRow}>
                <Text style={styles.orderInfoLabel}>Order Number</Text>
                <Text style={styles.orderInfoValue}>
                  {order?.data?.order_number}
                </Text>
              </View>
              <View style={styles.orderInfoRow}>
                <Text style={styles.orderInfoLabel}>Placed on</Text>
                <Text style={styles.orderInfoValue}>
                  {formatDate(new Date())}
                </Text>
              </View>
              {/* <View style={styles.orderInfoRow}>
                <Text style={styles.orderInfoLabel}>Total Amount</Text>
                <Text style={[styles.orderInfoValue, styles.totalAmount]}>
                  Quote on Request
                </Text>
              </View> */}
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="inventory" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Order Items</Text>
          </View>

          <View style={styles.cardContent}>
            {order?.data?.order_items?.map((item, index) => (
              <View key={index} style={styles.orderItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>
                    {item?.product?.product_name}
                  </Text>
                  <Text style={styles.itemSku}>
                    SKU: {item?.product?.supplier_sku}
                  </Text>
                  <Text style={styles.itemQuantity}>
                    Quantity: {item.quantity}
                  </Text>
                </View>
                {/* <Text style={styles.itemPrice}>Quote on Request</Text> */}
              </View>
            ))}
          </View>
        </View>

        {/* Delivery Details */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="local-shipping" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Delivery Details</Text>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.deliveryDetail}>
              <View style={styles.deliveryDetailIcon}>
                <Icon name="receipt" size={20} color={Colors.textSecondary} />
              </View>
              <View style={styles.deliveryDetailInfo}>
                <Text style={styles.deliveryDetailLabel}>PO Number</Text>
                <Text style={styles.deliveryDetailValue}>
                  {order?.data?.delivery_address}
                </Text>
              </View>
            </View>

            <View style={styles.deliveryDetail}>
              <View style={styles.deliveryDetailIcon}>
                <Icon name="business" size={20} color={Colors.textSecondary} />
              </View>
              <View style={styles.deliveryDetailInfo}>
                <Text style={styles.deliveryDetailLabel}>Customer Name</Text>
                <Text style={styles.deliveryDetailValue}>
                  {order?.data?.customer?.customer_name}
                </Text>
              </View>
            </View>

            <View style={styles.deliveryDetail}>
              {/* <View style={styles.deliveryDetailIcon}>
                <Icon name="place" size={20} color={Colors.textSecondary} />
              </View> */}
              {/* <View style={styles.deliveryDetailInfo}>
                <Text style={styles.deliveryDetailLabel}>Customer Address</Text>
                <Text style={styles.deliveryDetailValue}>
                  123 Main Street, Houston, TX 77001
                </Text>
              </View> */}
            </View>

            <View style={styles.deliveryDetail}>
              <View style={styles.deliveryDetailIcon}>
                <Icon name="phone" size={20} color={Colors.textSecondary} />
              </View>
              <View style={styles.deliveryDetailInfo}>
                <Text style={styles.deliveryDetailLabel}>Phone Number</Text>
                <Text style={styles.deliveryDetailValue}>
                  {order?.data?.delivery_phone}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Support Information */}
        <View style={styles.supportCard}>
          <View style={styles.cardHeader}>
            <Icon name="help" size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Need Help?</Text>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.supportOption}>
              <Icon name="phone" size={20} color={Colors.primary} />
              <View style={styles.supportInfo}>
                <Text style={styles.supportLabel}>Call Support</Text>
                <Text style={styles.supportValue}>(555) 123-4567</Text>
              </View>
            </View>

            <View style={styles.supportOption}>
              <Icon name="email" size={20} color={Colors.primary} />
              <View style={styles.supportInfo}>
                <Text style={styles.supportLabel}>Email Support</Text>
                <Text style={styles.supportValue}>orders@jdpelectric.com</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{height: 100}} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <View style={styles.actionButtonRow}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShareOrder}>
            <Icon name="share" size={20} color={Colors.text} />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.downloadButton}>
            <Icon name="download" size={20} color={Colors.text} />
            <Text style={styles.downloadButtonText}>Receipt</Text>
          </TouchableOpacity>
        </View>

        {/* <TouchableOpacity
          style={styles.primaryActionButton}
          onPress={() => handleNavigate('OrderHistoryScreen')}>
          <Icon name="history" size={20} color={Colors.white} />
          <Text style={styles.primaryActionText}>View Order History</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.secondaryActionButton}
          onPress={() => handleNavigate('HomeScreen')}>
          <Text style={styles.secondaryActionText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Confetti
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    pointerEvents: 'none',
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 4,
  },

  // Header
  header: {
    backgroundColor: Colors.success,
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.successLight,
    textAlign: 'center',
    opacity: 0.9,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },

  // Cards
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  supportCard: {
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  cardContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },

  // Order Info
  orderInfo: {
    marginBottom: Spacing.lg,
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  orderInfoLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  orderInfoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  totalAmount: {
    color: Colors.primary,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.successDark,
  },

  // Order Items
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  itemSku: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  itemQuantity: {
    fontSize: 14,
    color: Colors.textLight,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },

  // Delivery Details
  deliveryDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  deliveryDetailIcon: {
    marginRight: Spacing.md,
    marginTop: 2,
  },
  deliveryDetailInfo: {
    flex: 1,
  },
  deliveryDetailLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  deliveryDetailValue: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  // Support Options
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  supportInfo: {
    marginLeft: Spacing.md,
  },
  supportLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  supportValue: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  // Action Buttons
  actionButtons: {
    backgroundColor: Colors.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  actionButtonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    gap: Spacing.sm,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    gap: Spacing.sm,
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    gap: Spacing.sm,
    marginBottom: 10,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  secondaryActionButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  secondaryActionText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});

export default OrderConfirmationScreen;
