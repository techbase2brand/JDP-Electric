// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   StatusBar,
//   StyleSheet,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {useNavigation, useRoute} from '@react-navigation/native';

// // Embedded Colors
// const Colors = {
//   primary: '#3B82F6',
//   primaryLight: '#EBF4FF',
//   white: '#FFFFFF',
//   backgroundLight: '#F8FAFC',
//   text: '#1E293B',
//   textSecondary: '#64748B',
//   border: '#E2E8F0',
//   borderLight: '#F1F5F9',
// };

// // Embedded Spacing and Dimensions
// const Spacing = {
//   xs: 4,
//   sm: 8,
//   md: 16,
//   lg: 24,
//   xl: 32,
// };

// const BorderRadius = {
//   md: 8,
//   lg: 12,
// };

// const Shadows = {
//   md: {
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
// };

// // Embedded Toast Functions
// const showSuccessToast = (title, message) => {
//   Alert.alert(title, message);
// };

// const showErrorToast = (title, message) => {
//   Alert.alert(title, message);
// };

// const CheckoutScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const params = route.params;

//   const [orderItems, setOrderItems] = useState([]);
//   const [shippingAddress, setShippingAddress] = useState({
//     name: '',
//     company: 'JDP Electrics',
//     address: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     phone: '',
//   });
//   const [selectedPayment, setSelectedPayment] = useState('');
//   const [specialInstructions, setSpecialInstructions] = useState('');
//   const [rushOrder, setRushOrder] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [poNumber, setPONumber] = useState('');

//   const paymentMethods = [
//     {
//       id: 'company_account',
//       type: 'company_account',
//       name: 'Company Account',
//       details: 'JDP Electrics - Account #12345',
//     },
//     {
//       id: 'purchase_order',
//       type: 'purchase_order',
//       name: 'Purchase Order',
//       details: 'Enter PO number during checkout',
//     },
//     {
//       id: 'credit_card',
//       type: 'credit_card',
//       name: 'Company Credit Card',
//       details: 'Ending in 4567',
//     },
//   ];

//   useEffect(() => {
//     StatusBar.setBarStyle('dark-content');
//     loadOrderData();
//     loadDefaultShipping();
//   }, []);

//   const loadOrderData = () => {
//     // Load from params or use mock data
//     if (params?.cartItems) {
//       setOrderItems(params.cartItems);
//     } else {
//       // Mock order items
//       const mockItems = [
//         {
//           id: '1',
//           name: 'Wire Nuts (Box of 100)',
//           quantity: 2,
//           price: 24.99,
//           unit: 'box',
//         },
//         {
//           id: '2',
//           name: '12 AWG THHN Wire',
//           quantity: 3,
//           price: 89.5,
//           unit: 'spool',
//         },
//         {
//           id: '4',
//           name: 'Electrical Outlet - GFCI',
//           quantity: 8,
//           price: 32.0,
//           unit: 'each',
//         },
//       ];
//       setOrderItems(mockItems);
//     }
//     setSelectedPayment('company_account');
//   };

//   const loadDefaultShipping = () => {
//     // Set default shipping address
//     setShippingAddress(prev => ({
//       ...prev,
//       name: 'JDP Electrics',
//       company: 'JDP Electrics',
//       address: '1234 Industrial Blvd',
//       city: 'Houston',
//       state: 'TX',
//       zipCode: '77001',
//       phone: '(555) 123-4567',
//     }));
//   };

//   const calculateSubtotal = () => {
//     return orderItems.reduce(
//       (total, item) => total + item.price * item.quantity,
//       0,
//     );
//   };

//   const calculateTax = () => {
//     return calculateSubtotal() * 0.0825; // 8.25% tax rate
//   };

//   const calculateShipping = () => {
//     const subtotal = calculateSubtotal();
//     if (rushOrder) return 45.0; // Rush shipping
//     if (subtotal > 200) return 0; // Free shipping over $200
//     return 15.0; // Standard shipping
//   };

//   const calculateTotal = () => {
//     return calculateSubtotal() + calculateTax() + calculateShipping();
//   };

//   const validateForm = () => {
//     if (!shippingAddress.name.trim()) {
//       showErrorToast('Validation Error', 'Please enter recipient name');
//       return false;
//     }
//     if (!shippingAddress.address.trim()) {
//       showErrorToast('Validation Error', 'Please enter shipping address');
//       return false;
//     }
//     if (!shippingAddress.city.trim()) {
//       showErrorToast('Validation Error', 'Please enter city');
//       return false;
//     }
//     if (!shippingAddress.state.trim()) {
//       showErrorToast('Validation Error', 'Please enter state');
//       return false;
//     }
//     if (!shippingAddress.zipCode.trim()) {
//       showErrorToast('Validation Error', 'Please enter ZIP code');
//       return false;
//     }
//     if (!selectedPayment) {
//       showErrorToast('Validation Error', 'Please select a payment method');
//       return false;
//     }
//     if (selectedPayment === 'purchase_order' && !poNumber.trim()) {
//       showErrorToast('Validation Error', 'Please enter PO number');
//       return false;
//     }
//     return true;
//   };

//   const submitOrder = async () => {
//     if (!validateForm()) return;

//     Alert.alert(
//       'Confirm Order',
//       `Place order for $${calculateTotal().toFixed(2)}?`,
//       [
//         {text: 'Cancel', style: 'cancel'},
//         {
//           text: 'Place Order',
//           onPress: async () => {
//             setLoading(true);
//             try {
//               // Simulate API call
//               await new Promise(resolve => setTimeout(resolve, 2000));
//               const orderNumber = `ORD-${Date.now()}`;
//               showSuccessToast(
//                 'Order Placed Successfully',
//                 `Order #${orderNumber} has been submitted`,
//               );

//               // Navigate back to orders or dashboard
//               navigation.navigate('JobStack');
//             } catch (error) {
//               showErrorToast(
//                 'Order Failed',
//                 'Failed to place order. Please try again.',
//               );
//             } finally {
//               setLoading(false);
//             }
//           },
//         },
//       ],
//     );
//   };

//   const renderHeader = () => (
//     <View style={styles.header}>
//       <TouchableOpacity
//         style={styles.backButton}
//         onPress={() => navigation.goBack()}>
//         <Icon name="arrow-back" size={24} color={Colors.text} />
//       </TouchableOpacity>

//       <Text style={styles.headerTitle}>Checkout</Text>

//       <View style={styles.placeholder} />
//     </View>
//   );

//   const renderOrderSummary = () => (
//     <View style={styles.section}>
//       <Text style={styles.sectionTitle}>Order Summary</Text>
//       {orderItems.map(item => (
//         <View key={item.id} style={styles.orderItem}>
//           <View style={styles.itemInfo}>
//             <Text style={styles.itemName}>{item.name}</Text>
//             <Text style={styles.itemQuantity}>
//               Qty: {item.quantity} {item.unit}
//             </Text>
//           </View>
//           <Text style={styles.itemPrice}>
//             ${(item.price * item.quantity).toFixed(2)}
//           </Text>
//         </View>
//       ))}
//     </View>
//   );

//   const renderShippingForm = () => (
//     <View style={styles.section}>
//       <Text style={styles.sectionTitle}>Shipping Address</Text>

//       <View style={styles.inputGroup}>
//         <Text style={styles.inputLabel}>Recipient Name</Text>
//         <TextInput
//           style={styles.textInput}
//           value={shippingAddress.name}
//           onChangeText={text =>
//             setShippingAddress(prev => ({...prev, name: text}))
//           }
//           placeholder="Enter recipient name"
//           autoCapitalize="words"
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.inputLabel}>Company</Text>
//         <TextInput
//           style={styles.textInput}
//           value={shippingAddress.company}
//           onChangeText={text =>
//             setShippingAddress(prev => ({...prev, company: text}))
//           }
//           placeholder="Company name"
//           autoCapitalize="words"
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.inputLabel}>Address</Text>
//         <TextInput
//           style={styles.textInput}
//           value={shippingAddress.address}
//           onChangeText={text =>
//             setShippingAddress(prev => ({...prev, address: text}))
//           }
//           placeholder="Street address"
//           autoCapitalize="words"
//         />
//       </View>

//       <View style={styles.row}>
//         <View style={styles.inputGroup}>
//           <Text style={styles.inputLabel}>City</Text>
//           <TextInput
//             style={styles.textInput}
//             value={shippingAddress.city}
//             onChangeText={text =>
//               setShippingAddress(prev => ({...prev, city: text}))
//             }
//             placeholder="City"
//             autoCapitalize="words"
//           />
//         </View>

//         <View style={styles.inputGroup}>
//           <Text style={styles.inputLabel}>State</Text>
//           <TextInput
//             style={styles.textInput}
//             value={shippingAddress.state}
//             onChangeText={text =>
//               setShippingAddress(prev => ({...prev, state: text.toUpperCase()}))
//             }
//             placeholder="TX"
//             maxLength={2}
//             autoCapitalize="characters"
//           />
//         </View>

//         <View style={styles.inputGroup}>
//           <Text style={styles.inputLabel}>ZIP</Text>
//           <TextInput
//             style={styles.textInput}
//             value={shippingAddress.zipCode}
//             onChangeText={text =>
//               setShippingAddress(prev => ({...prev, zipCode: text}))
//             }
//             placeholder="77001"
//             keyboardType="numeric"
//             maxLength={5}
//           />
//         </View>
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.inputLabel}>Phone</Text>
//         <TextInput
//           style={styles.textInput}
//           value={shippingAddress.phone}
//           onChangeText={text =>
//             setShippingAddress(prev => ({...prev, phone: text}))
//           }
//           placeholder="(555) 123-4567"
//           keyboardType="phone-pad"
//         />
//       </View>
//     </View>
//   );

//   const renderPaymentMethods = () => (
//     <View style={styles.section}>
//       <Text style={styles.sectionTitle}>Payment Method</Text>
//       {paymentMethods.map(method => (
//         <TouchableOpacity
//           key={method.id}
//           style={[
//             styles.paymentOption,
//             selectedPayment === method.id && styles.selectedPayment,
//           ]}
//           onPress={() => setSelectedPayment(method.id)}>
//           <View style={styles.paymentInfo}>
//             <Icon
//               name={
//                 method.type === 'company_account'
//                   ? 'business'
//                   : method.type === 'credit_card'
//                   ? 'credit-card'
//                   : 'receipt'
//               }
//               size={24}
//               color={
//                 selectedPayment === method.id
//                   ? Colors.primary
//                   : Colors.textSecondary
//               }
//             />
//             <View style={styles.paymentDetails}>
//               <Text
//                 style={[
//                   styles.paymentName,
//                   selectedPayment === method.id && styles.selectedPaymentText,
//                 ]}>
//                 {method.name}
//               </Text>
//               <Text style={styles.paymentSubtext}>{method.details}</Text>
//             </View>
//           </View>
//           <Icon
//             name={
//               selectedPayment === method.id
//                 ? 'radio-button-checked'
//                 : 'radio-button-unchecked'
//             }
//             size={24}
//             color={
//               selectedPayment === method.id
//                 ? Colors.primary
//                 : Colors.textSecondary
//             }
//           />
//         </TouchableOpacity>
//       ))}

//       {selectedPayment === 'purchase_order' && (
//         <View style={styles.inputGroup}>
//           <Text style={styles.inputLabel}>Purchase Order Number</Text>
//           <TextInput
//             style={styles.textInput}
//             value={poNumber}
//             onChangeText={setPONumber}
//             placeholder="Enter PO number"
//             autoCapitalize="characters"
//           />
//         </View>
//       )}
//     </View>
//   );

//   const renderOrderOptions = () => (
//     <View style={styles.section}>
//       <Text style={styles.sectionTitle}>Delivery Options</Text>

//       <TouchableOpacity
//         style={styles.optionRow}
//         onPress={() => setRushOrder(!rushOrder)}>
//         <View style={styles.optionInfo}>
//           <Text style={styles.optionName}>Rush Delivery</Text>
//           <Text style={styles.optionSubtext}>Next business day (+$45.00)</Text>
//         </View>
//         <Icon
//           name={rushOrder ? 'check-box' : 'check-box-outline-blank'}
//           size={24}
//           color={rushOrder ? Colors.primary : Colors.textSecondary}
//         />
//       </TouchableOpacity>

//       <View style={styles.inputGroup}>
//         <Text style={styles.inputLabel}>Special Instructions</Text>
//         <TextInput
//           style={[styles.textInput, styles.textArea]}
//           value={specialInstructions}
//           onChangeText={setSpecialInstructions}
//           placeholder="Delivery instructions, preferred time, etc."
//           multiline
//           numberOfLines={3}
//           textAlignVertical="top"
//         />
//       </View>
//     </View>
//   );

//   const renderPricingSummary = () => (
//     <View style={styles.pricingSection}>
//       <View style={styles.priceRow}>
//         <Text style={styles.priceLabel}>Subtotal</Text>
//         <Text style={styles.priceAmount}>
//           ${calculateSubtotal().toFixed(2)}
//         </Text>
//       </View>

//       <View style={styles.priceRow}>
//         <Text style={styles.priceLabel}>Tax (8.25%)</Text>
//         <Text style={styles.priceAmount}>${calculateTax().toFixed(2)}</Text>
//       </View>

//       <View style={styles.priceRow}>
//         <Text style={styles.priceLabel}>
//           Shipping{' '}
//           {rushOrder
//             ? '(Rush)'
//             : calculateSubtotal() > 200
//             ? '(Free)'
//             : '(Standard)'}
//         </Text>
//         <Text style={styles.priceAmount}>
//           ${calculateShipping().toFixed(2)}
//         </Text>
//       </View>

//       <View style={[styles.priceRow, styles.totalRow]}>
//         <Text style={styles.totalLabel}>Total</Text>
//         <Text style={styles.totalAmount}>${calculateTotal().toFixed(2)}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

//       {renderHeader()}

//       <KeyboardAvoidingView
//         style={styles.keyboardContainer}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//         <ScrollView
//           style={styles.scrollContainer}
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//           contentContainerStyle={styles.scrollContent}>
//           {renderOrderSummary()}
//           {renderShippingForm()}
//           {/* {renderPaymentMethods()} */}
//           {renderOrderOptions()}
//           {renderPricingSummary()}
//         </ScrollView>

//         <View style={styles.footer}>
//           <TouchableOpacity
//             style={[styles.submitButton, loading && styles.disabledButton]}
//             onPress={submitOrder}
//             disabled={loading}>
//             {loading ? (
//               <Text style={styles.submitButtonText}>Placing Order...</Text>
//             ) : (
//               <>
//                 <Text style={styles.submitButtonText}>
//                   Place Order - ${calculateTotal().toFixed(2)}
//                 </Text>
//                 <Icon name="check" size={20} color={Colors.white} />
//               </>
//             )}
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// // Embedded Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.backgroundLight,
//     paddingBottom: 80,
//   },
//   keyboardContainer: {
//     flex: 1,
//   },

//   // Header
//   header: {
//     backgroundColor: Colors.white,
//     paddingTop: Spacing.lg,
//     paddingHorizontal: Spacing.md,
//     paddingBottom: Spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: Colors.backgroundLight,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: Colors.text,
//   },
//   placeholder: {
//     width: 40,
//   },

//   // Scroll Container
//   scrollContainer: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: Spacing.xl,
//   },

//   // Section
//   section: {
//     backgroundColor: Colors.white,
//     marginHorizontal: Spacing.md,
//     marginVertical: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     ...Shadows.md,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: Colors.text,
//     marginBottom: Spacing.md,
//   },

//   // Order Summary
//   orderItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.borderLight,
//   },
//   itemInfo: {
//     flex: 1,
//   },
//   itemName: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: Colors.text,
//     marginBottom: Spacing.xs,
//   },
//   itemQuantity: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//   },
//   itemPrice: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.text,
//   },

//   // Form Inputs
//   inputGroup: {
//     marginBottom: Spacing.md,
//     flex: 1,
//     marginHorizontal: Spacing.xs,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: Colors.text,
//     marginBottom: Spacing.xs,
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: BorderRadius.md,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     fontSize: 16,
//     color: Colors.text,
//     backgroundColor: Colors.white,
//   },
//   textArea: {
//     height: 80,
//     paddingTop: Spacing.sm,
//   },
//   row: {
//     flexDirection: 'row',
//     marginHorizontal: -Spacing.xs,
//   },

//   // Payment Methods
//   paymentOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: Spacing.md,
//     paddingHorizontal: Spacing.sm,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: BorderRadius.md,
//     marginBottom: Spacing.sm,
//     backgroundColor: Colors.white,
//   },
//   selectedPayment: {
//     borderColor: Colors.primary,
//     backgroundColor: Colors.primaryLight,
//   },
//   paymentInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   paymentDetails: {
//     marginLeft: Spacing.md,
//     flex: 1,
//   },
//   paymentName: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: Colors.text,
//     marginBottom: 2,
//   },
//   selectedPaymentText: {
//     color: Colors.primary,
//   },
//   paymentSubtext: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//   },

//   // Order Options
//   optionRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: Spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.borderLight,
//   },
//   optionInfo: {
//     flex: 1,
//   },
//   optionName: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: Colors.text,
//     marginBottom: 2,
//   },
//   optionSubtext: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//   },

//   // Pricing Summary
//   pricingSection: {
//     backgroundColor: Colors.white,
//     marginHorizontal: Spacing.md,
//     marginVertical: Spacing.sm,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     ...Shadows.md,
//   },
//   priceRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: Spacing.sm,
//   },
//   totalRow: {
//     borderTopWidth: 2,
//     borderTopColor: Colors.border,
//     paddingTop: Spacing.md,
//     marginTop: Spacing.sm,
//   },
//   priceLabel: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//   },
//   priceAmount: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: Colors.text,
//   },
//   totalLabel: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: Colors.text,
//   },
//   totalAmount: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: Colors.primary,
//   },

//   // Footer
//   footer: {
//     backgroundColor: Colors.white,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//     padding: Spacing.md,
//     paddingBottom: Spacing.xl,
//   },
//   submitButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.lg,
//     paddingVertical: Spacing.md,
//     gap: Spacing.sm,
//   },
//   disabledButton: {
//     backgroundColor: Colors.textSecondary,
//   },
//   submitButtonText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: Colors.white,
//   },
// });

// export default CheckoutScreen;



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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
};


const CheckoutScreen = ({ onBack, onNavigate, route }) => {
  const navigation = useNavigation();
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  // Mock cart data (removed pricing)
  const cartItems = [
    {
      id: '1',
      name: 'Electrical Panel - 200A',
      sku: 'EP-200A-001',
      quantity: 2,
      supplier: 'ElectricPro Supply'
    },
    {
      id: '2',
      name: 'Circuit Breaker - 20A',
      sku: 'CB-20A-002',
      quantity: 8,
      supplier: 'ElectricPro Supply'
    },
    {
      id: '4',
      name: 'Conduit - 1/2 inch EMT',
      sku: 'EMT-12-004',
      quantity: 15,
      supplier: 'Conduit Corp'
    }
  ];





  const handlePlaceOrder = () => {
    // Mock order placement
    Alert.alert('Success', 'Order placed successfully!');
    setTimeout(() => {
      handleNavigate('OrderConfirmationScreen');
    }, 1500);
  };

  const handleNavigate = (screen) => {
    if (onNavigate) {
      onNavigate(screen);
    } else {
      navigation.navigate(screen);
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
      onRequestClose={() => setShowOrderSummary(false)}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowOrderSummary(false)}
        >
          <View style={styles.orderSummaryModal}>
            <View style={styles.modalHandle} />
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Summary</Text>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {cartItems.map((item) => (
                <View key={item.id} style={styles.summaryItem}>
                  <View style={styles.summaryItemInfo}>
                    <Text style={styles.summaryItemName}>{item.name}</Text>
                    <Text style={styles.summaryItemSku}>SKU: {item.sku}</Text>
                    <Text style={styles.summaryItemSupplier}>Supplier: {item.supplier}</Text>
                  </View>
                  <View style={styles.summaryItemQuantity}>
                    <Text style={styles.summaryQuantityText}>Qty: {item.quantity}</Text>
                  </View>
                </View>
              ))}
              
              <View style={styles.summaryTotals}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</Text>
                  <Text style={styles.summaryValue}>Quote on Request</Text>
                </View>

                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryTotalLabel}>Total</Text>
                  <Text style={styles.summaryTotalValue}>Quote on Request</Text>
                </View>
              </View>
            </ScrollView>
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
          onPress={() => setShowOrderSummary(true)}
        >
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
            {cartItems.slice(0, 2).map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <View style={styles.orderItemInfo}>
                  <Text style={styles.orderItemName}>{item.name}</Text>
                  <Text style={styles.orderItemQuantity}>Qty: {item.quantity}</Text>
                </View>
              </View>
            ))}
            
            {cartItems.length > 2 && (
              <TouchableOpacity 
                style={styles.viewMoreButton}
                onPress={() => setShowOrderSummary(true)}
              >
                <Text style={styles.viewMoreText}>View {cartItems.length - 2} more items</Text>
              </TouchableOpacity>
            )}
            
            <View style={styles.orderSummaryDivider} />
            <View style={styles.orderSummaryTotal}>
              <Text style={styles.totalItemsText}>Total Items: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</Text>
              <Text style={styles.totalValueText}>Quote on Request</Text>
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
        <View style={styles.noticeCard}>
          <View style={styles.noticeContent}>
            <Icon name="info" size={20} color={Colors.warning} />
            <View style={styles.noticeText}>
              <Text style={styles.noticeTitle}>Quote Required</Text>
              <Text style={styles.noticeDescription}>
                Product pricing will be provided via quote based on current market rates and availability.
              </Text>
            </View>
          </View>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.placeOrderText}>Place Order</Text>
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
    justifyContent: 'space-between',
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
    paddingBottom:50
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
    maxHeight: '80%',
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