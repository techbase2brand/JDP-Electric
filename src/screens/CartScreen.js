// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   RefreshControl,
//   StatusBar,
//   StyleSheet,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useNavigation } from '@react-navigation/native';

// // Embedded Colors
// const Colors = {
//   primary: '#3B82F6',
//   white: '#FFFFFF',
//   backgroundLight: '#F8FAFC',
//   text: '#1E293B',
//   textSecondary: '#64748B',
//   textLight: '#94A3B8',
//   border: '#E2E8F0',
//   error: '#EF4444',
//   errorLight: '#FEF2F2',
//   warning: '#F59E0B',
//   warningLight: '#FFFBEB',
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
//   sm: 6,
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

// const CartScreen = () => {
//   const navigation = useNavigation();
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     StatusBar.setBarStyle('dark-content');
//     loadCartItems();
//   }, []);

//   const loadCartItems = async () => {
//     setLoading(true);
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));

//       const mockCartItems = [
//         {
//           id: '1',
//           name: 'Wire Nuts (Box of 100)',
//           category: 'Electrical Supplies',
//           price: 24.99,
//           quantity: 2,
//           unit: 'box',
//           supplier: 'ElectriCorp Supply',
//           partNumber: 'WN-100-YEL',
//           inStock: true,
//         },
//         {
//           id: '2',
//           name: '12 AWG THHN Wire',
//           category: 'Wire & Cable',
//           price: 89.50,
//           quantity: 3,
//           unit: 'spool',
//           supplier: 'Professional Electric',
//           partNumber: 'THHN-12-BLK-500',
//           inStock: true,
//         },
//         {
//           id: '3',
//           name: 'Circuit Breaker - 20A',
//           category: 'Breakers & Panels',
//           price: 15.75,
//           quantity: 5,
//           unit: 'each',
//           supplier: 'ElectriCorp Supply',
//           partNumber: 'CB-20A-SP',
//           inStock: false,
//         },
//         {
//           id: '4',
//           name: 'Electrical Outlet - GFCI',
//           category: 'Outlets & Switches',
//           price: 32.00,
//           quantity: 8,
//           unit: 'each',
//           supplier: 'Wholesale Electric',
//           partNumber: 'GFCI-15A-WH',
//           inStock: true,
//         },
//       ];

//       setCartItems(mockCartItems);
//     } catch (error) {
//       showErrorToast('Error', 'Failed to load cart items');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadCartItems();
//     setRefreshing(false);
//   };

//   const updateQuantity = (itemId, newQuantity) => {
//     if (newQuantity < 1) {
//       removeItem(itemId);
//       return;
//     }

//     setCartItems(prev =>
//       prev.map(item =>
//         item.id === itemId
//           ? { ...item, quantity: newQuantity }
//           : item
//       )
//     );
//   };

//   const removeItem = (itemId) => {
//     Alert.alert(
//       'Remove Item',
//       'Are you sure you want to remove this item from your cart?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Remove',
//           style: 'destructive',
//           onPress: () => {
//             setCartItems(prev => prev.filter(item => item.id !== itemId));
//             showSuccessToast('Item Removed', 'Item has been removed from your cart');
//           },
//         },
//       ]
//     );
//   };

//   const clearCart = () => {
//     Alert.alert(
//       'Clear Cart',
//       'Are you sure you want to remove all items from your cart?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Clear All',
//           style: 'destructive',
//           onPress: () => {
//             setCartItems([]);
//             showSuccessToast('Cart Cleared', 'All items have been removed from your cart');
//           },
//         },
//       ]
//     );
//   };

//   const getTotalPrice = () => {
//     return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
//   };

//   const getTotalItems = () => {
//     return cartItems.reduce((total, item) => total + item.quantity, 0);
//   };

//   const proceedToCheckout = () => {
//     if (cartItems.length === 0) {
//       showErrorToast('Empty Cart', 'Please add items to your cart before checkout');
//       return;
//     }

//     const outOfStockItems = cartItems.filter(item => !item.inStock);
//     if (outOfStockItems.length > 0) {
//       Alert.alert(
//         'Out of Stock Items',
//         `Some items in your cart are out of stock. Would you like to remove them and continue?`,
//         [
//           { text: 'Cancel', style: 'cancel' },
//           {
//             text: 'Remove & Continue',
//             onPress: () => {
//               setCartItems(prev => prev.filter(item => item.inStock));
//               navigation.navigate('CheckoutScreen');
//             },
//           },
//         ]
//       );
//       return;
//     }

//     navigation.navigate('CheckoutScreen');
//   };

//   const renderCartItem = (item) => (
//     <View key={item.id} style={styles.cartItem}>
//       <View style={styles.itemHeader}>
//         <View style={styles.itemInfo}>
//           <Text style={styles.itemName}>{item.name}</Text>
//           <Text style={styles.itemCategory}>{item.category}</Text>
//           <Text style={styles.itemSupplier}>Supplier: {item.supplier}</Text>
//           {item.partNumber && (
//             <Text style={styles.partNumber}>Part #: {item.partNumber}</Text>
//           )}
//         </View>
//         <TouchableOpacity
//           style={styles.removeButton}
//           onPress={() => removeItem(item.id)}
//         >
//           <Icon name="close" size={20} color={Colors.error} />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.itemFooter}>
//         <View style={styles.quantityControls}>
//           <TouchableOpacity
//             style={styles.quantityButton}
//             onPress={() => updateQuantity(item.id, item.quantity - 1)}
//           >
//             <Icon name="remove" size={16} color={Colors.primary} />
//           </TouchableOpacity>

//           <Text style={styles.quantityText}>
//             {item.quantity} {item.unit}
//           </Text>

//           <TouchableOpacity
//             style={styles.quantityButton}
//             onPress={() => updateQuantity(item.id, item.quantity + 1)}
//           >
//             <Icon name="add" size={16} color={Colors.primary} />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.priceContainer}>
//           <Text style={styles.itemPrice}>
//             ${(item.price * item.quantity).toFixed(2)}
//           </Text>
//           <Text style={styles.unitPrice}>
//             ${item.price.toFixed(2)} per {item.unit}
//           </Text>
//         </View>
//       </View>

//       {!item.inStock && (
//         <View style={styles.outOfStockBanner}>
//           <Icon name="warning" size={16} color={Colors.warning} />
//           <Text style={styles.outOfStockText}>Out of Stock</Text>
//         </View>
//       )}
//     </View>
//   );

//   const renderEmptyCart = () => (
//     <View style={styles.emptyContainer}>
//       <Icon name="shopping-cart" size={80} color={Colors.textLight} />
//       <Text style={styles.emptyTitle}>Your cart is empty</Text>
//       <Text style={styles.emptySubtitle}>
//         Add materials and supplies to get started
//       </Text>
//       <TouchableOpacity
//         style={styles.shopButton}
//         onPress={() => navigation.navigate('OrderProducts')}
//       >
//         <Text style={styles.shopButtonText}>Start Shopping</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const renderHeader = () => (
//     <View style={styles.header}>
//       <View style={styles.headerTop}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Icon name="arrow-back" size={24} color={Colors.text} />
//         </TouchableOpacity>

//         <Text style={styles.headerTitle}>Shopping Cart</Text>

//         {cartItems.length > 0 && (
//           <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
//             <Text style={styles.clearButtonText}>Clear</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {cartItems.length > 0 && (
//         <Text style={styles.itemCount}>
//           {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} in cart
//         </Text>
//       )}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

//       {renderHeader()}

//       {cartItems?.length === 0 ? (
//         renderEmptyCart()
//       ) : (
//         <>
//           <ScrollView
//             style={styles.scrollContainer}
//             showsVerticalScrollIndicator={false}
//             refreshControl={
//               <RefreshControl
//                 refreshing={refreshing}
//                 onRefresh={onRefresh}
//                 colors={[Colors.primary]}
//                 tintColor={Colors.primary}
//               />
//             }
//             contentContainerStyle={styles.scrollContent}
//           >
//             <View style={styles.itemsList}>
//               {cartItems.map(renderCartItem)}
//             </View>
//           </ScrollView>

//           <View style={styles.footer}>
//             <View style={styles.totalContainer}>
//               <View style={styles.totalRow}>
//                 <Text style={styles.totalLabel}>Subtotal</Text>
//                 <Text style={styles.totalAmount}>
//                   ${getTotalPrice().toFixed(2)}
//                 </Text>
//               </View>
//               <View style={styles.totalRow}>
//                 <Text style={styles.totalLabel}>Tax (8.25%)</Text>
//                 <Text style={styles.totalAmount}>
//                   ${(getTotalPrice() * 0.0825).toFixed(2)}
//                 </Text>
//               </View>
//               <View style={[styles.totalRow, styles.grandTotalRow]}>
//                 <Text style={styles.grandTotalLabel}>Total</Text>
//                 <Text style={styles.grandTotalAmount}>
//                   ${(getTotalPrice() * 1.0825).toFixed(2)}
//                 </Text>
//               </View>
//             </View>

//             <TouchableOpacity
//               style={styles.checkoutButton}
//               onPress={proceedToCheckout}
//               disabled={cartItems.length === 0}
//             >
//               <Text style={styles.checkoutButtonText}>
//                 Proceed to Checkout
//               </Text>
//               <Icon name="arrow-forward" size={20} color={Colors.white} />
//             </TouchableOpacity>
//           </View>
//         </>
//       )}
//       </View>
//   );
// };

// // Embedded Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.backgroundLight,
//   },
//   // Header
//   header: {
//     backgroundColor: Colors.white,
//     paddingTop: Spacing.lg,
//     paddingHorizontal: Spacing.md,
//     paddingBottom: Spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//   },
//   headerTop: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: Spacing.sm,
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
//   clearButton: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     backgroundColor: Colors.errorLight,
//     borderRadius: BorderRadius.sm,
//   },
//   clearButtonText: {
//     fontSize: 14,
//     color: Colors.error,
//     fontWeight: '500',
//   },
//   itemCount: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//   },

//   // Scroll Container
//   scrollContainer: {
//     flex: 1,

//   },
//   scrollContent: {
//     paddingBottom: Spacing.xl,
//   },

//   // Items List
//   itemsList: {
//     padding: Spacing.md,
//     gap: Spacing.md,
//   },

//   // Cart Item
//   cartItem: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     ...Shadows.md,
//   },
//   itemHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: Spacing.md,
//   },
//   itemInfo: {
//     flex: 1,
//     marginRight: Spacing.sm,
//   },
//   itemName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.text,
//     marginBottom: Spacing.xs,
//   },
//   itemCategory: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     marginBottom: Spacing.xs,
//   },
//   itemSupplier: {
//     fontSize: 13,
//     color: Colors.primary,
//     marginBottom: 2,
//   },
//   partNumber: {
//     fontSize: 12,
//     color: Colors.textLight,
//     fontFamily: 'monospace',
//   },
//   removeButton: {
//     padding: Spacing.xs,
//     backgroundColor: Colors.errorLight,
//     borderRadius: BorderRadius.sm,
//   },

//   // Item Footer
//   itemFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   quantityControls: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: Colors.backgroundLight,
//     borderRadius: BorderRadius.md,
//     padding: Spacing.xs,
//   },
//   quantityButton: {
//     width: 32,
//     height: 32,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.sm,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   quantityText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: Colors.text,
//     marginHorizontal: Spacing.md,
//     minWidth: 60,
//     textAlign: 'center',
//   },
//   priceContainer: {
//     alignItems: 'flex-end',
//   },
//   itemPrice: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: Colors.text,
//   },
//   unitPrice: {
//     fontSize: 12,
//     color: Colors.textSecondary,
//     marginTop: 2,
//   },

//   // Out of Stock
//   outOfStockBanner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: Colors.warningLight,
//     padding: Spacing.sm,
//     borderRadius: BorderRadius.sm,
//     marginTop: Spacing.sm,
//   },
//   outOfStockText: {
//     fontSize: 14,
//     color: Colors.warning,
//     fontWeight: '500',
//     marginLeft: Spacing.xs,
//   },

//   // Footer
//   footer: {
//     backgroundColor: Colors.white,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//     padding: Spacing.md,
//     paddingBottom: Spacing.xl,
//     marginBottom:80
//   },
//   totalContainer: {
//     marginBottom: Spacing.md,
//   },
//   totalRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: Spacing.sm,
//   },
//   grandTotalRow: {
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//     paddingTop: Spacing.sm,
//     marginBottom: 0,
//   },
//   totalLabel: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//   },
//   totalAmount: {
//     fontSize: 16,
//     color: Colors.text,
//     fontWeight: '500',
//   },
//   grandTotalLabel: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: Colors.text,
//   },
//   grandTotalAmount: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: Colors.primary,
//   },
//   checkoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.lg,
//     paddingVertical: Spacing.md,
//     paddingHorizontal: Spacing.lg,
//     gap: Spacing.sm,
//   },
//   checkoutButtonText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: Colors.white,
//   },

//   // Empty State
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: Spacing.xl,
//   },
//   emptyTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: Colors.text,
//     marginTop: Spacing.lg,
//     marginBottom: Spacing.sm,
//   },
//   emptySubtitle: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//     textAlign: 'center',
//     marginBottom: Spacing.xl,
//   },
//   shopButton: {
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.lg,
//     paddingVertical: Spacing.md,
//     paddingHorizontal: Spacing.xl,
//   },
//   shopButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.white,
//   },
// });

// export default CartScreen;

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
import Ionicons from 'react-native-vector-icons/Ionicons';
import {heightPercentageToDP, widthPercentageToDP} from '../utils';

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
  const statusOptions = [
    {label: 'Feet', value: 'Feet'},
    {label: 'Pieces', value: 'Pieces'},
    {label: 'Meters', value: 'Meters'},
    {label: 'Boxes', value: 'Boxes'},
    {label: 'Rolls', value: 'Rolls'},
    {label: 'Gallons', value: 'Gallons'},
    {label: 'Pounds', value: 'Pounds'},
  ];
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

  // Mock cart data (removed pricing)
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Electrical Panel - 200A',
      category: 'panels',
      description: 'Main breaker panel for residential use',
      sku: 'EP-200A-001',
      quantity: 2,
      supplier: 'ElectricPro Supply',
      // image: 'https://images.unsplash.cxssom/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop'
    },
    {
      id: '2',
      name: 'Circuit Breaker - 20A',
      category: 'breakers',
      description: 'Standard 20 amp circuit breaker',
      sku: 'CB-20A-002',
      quantity: 8,
      supplier: 'ElectricPro Supply',
    },
    {
      id: '4',
      name: 'Conduit - 1/2 inch EMT',
      category: 'conduit',
      description: 'Electrical metallic tubing, 10ft length',
      sku: 'EMT-12-004',
      quantity: 15,
      supplier: 'Conduit Corp',
    },
    {
      id: '6',
      name: 'GFCI Outlet - 20A',
      category: 'outlets',
      description: 'Ground fault circuit interrupter outlet',
      sku: 'GFCI-20A-006',
      quantity: 4,
      supplier: 'Safety Electric Co',
    },
  ]);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(itemId);
      return;
    }

    setCartItems(
      cartItems.map(item =>
        item.id === itemId ? {...item, quantity: newQuantity} : item,
      ),
    );
  };

  const removeItem = itemId => {
    const item = cartItems.find(item => item.id === itemId);
    setCartItems(cartItems.filter(item => item.id !== itemId));

    if (item) {
      // Alert.alert('Success', `${item.name} removed from cart`);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setShowClearConfirm(false);
    // Alert.alert('Success', 'Cart cleared');
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  const handleCall = phoneNumber => {
    Linking.openURL(`tel:${6184738399}`);
  };
  const handleNavigate = screen => {
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
                  onPress={clearCart}>
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
      onRequestClose={() => {
        setShowAddEntryModal(false);
        setEditingEntry(null);
        setNewEntry({
          activity: '',
          startTime: '',
          endTime: '',
          description: '',
          location: '',
          worker: '',
          isManual: true,
        });
      }}>
      <View style={styles.modalOverlay1}>
        <View style={styles.addEntryModal}>
          <View style={styles.modalHeader1}>
            <Text style={styles.modalTitle1}>{'Add Custom Material'}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowAddEntryModal(false);
                setEditingEntry(null);
              }}>
              <Icon name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          {/* ✅ KeyboardAvoidingView Wrap */}
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
            <ScrollView
              style={styles.modalContent1}
              showsVerticalScrollIndicator={false}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Material Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEntry.activity}
                  onChangeText={text =>
                    setNewEntry(prev => ({...prev, activity: text}))
                  }
                  placeholder="Enter material name"
                  placeholderTextColor={Colors.textLight}
                />
              </View>
               <Text style={styles.fieldLabel}>Unit *</Text>
              <View style={styles.filtersRow}>
                {renderDropdown(
                  statusOptions,
                  statusFilter,
                  setStatusFilter,
                  showStatusDropdown,
                  () => {
                    setShowStatusDropdown(!showStatusDropdown);
                    setShowSortDropdown(false);
                  },
                  'Select Unit',
                )}
              </View>
              <View style={styles.timeInputRow}>
                <View
                  style={[
                    styles.formField,
                    {flex: 1, marginRight: Spacing.sm},
                  ]}>
                  <Text style={styles.fieldLabel}>Total Orders *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newEntry.startTime}
                    onChangeText={text =>
                      setNewEntry(prev => ({...prev, startTime: text}))
                    }
                    placeholder="Orders"
                    placeholderTextColor={Colors.textLight}
                  />
                </View>

                <View
                  style={[styles.formField, {flex: 1, marginLeft: Spacing.sm}]}>
                  <Text style={styles.fieldLabel}>Amount Used *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newEntry.endTime}
                    onChangeText={text =>
                      setNewEntry(prev => ({...prev, endTime: text}))
                    }
                    placeholder="Amount"
                    placeholderTextColor={Colors.textLight}
                  />
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Supplier Order ID</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEntry.location}
                  onChangeText={text =>
                    setNewEntry(prev => ({...prev, location: text}))
                  }
                  placeholder="e.g.  ORD-2024-19"
                  placeholderTextColor={Colors.textLight}
                />
              </View>

              {/* <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Worker</Text>
                <TextInput
                  style={styles.textInput}
                  value={newEntry.worker}
                  onChangeText={text =>
                    setNewEntry(prev => ({...prev, worker: text}))
                  }
                  placeholder="Worker name"
                  placeholderTextColor={Colors.textLight}
                />
              </View> */}
{/* 
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={newEntry.description}
                  onChangeText={text =>
                    setNewEntry(prev => ({...prev, description: text}))
                  }
                  placeholder="Description of work performed"
                  placeholderTextColor={Colors.textLight}
                  multiline={true}
                  numberOfLines={3}
                />
              </View> */}

             
            </ScrollView>
             <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowAddEntryModal(false);
                    setEditingEntry(null);
                  }}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleAddEntry}>
                  <Text style={styles.saveButtonText}>{'Add Material'}</Text>
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

        {/* <TouchableOpacity
          style={styles.clearButton1}
        
          onPress={() => setShowClearConfirm(true)}> 
          <Icon name="delete" size={24} color={Colors.error} />
        </TouchableOpacity> */}
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

      {/* Cart Items */}
      {/* <TouchableOpacity
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
      </TouchableOpacity> */}
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
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productDescription}>
                      {item.description}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeItem(item.id)}>
                    <Icon name="delete" size={20} color={Colors.error} />
                  </TouchableOpacity>
                </View>

                <View style={styles.productDetails}>
                  <Text style={styles.productSku}>SKU: {item.sku}</Text>
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
                        updateQuantity(item.id, item.quantity - 1)
                      }>
                      <Icon name="remove" size={20} color={Colors.text} />
                    </TouchableOpacity>
                    <View style={styles.quantityDisplay}>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() =>
                        updateQuantity(item.id, item.quantity + 1)
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
            style={[styles.continueButton, {backgroundColor: '#10B981'}]}
            onPress={() => handleCall()}
            // onPress={() => handleNavigate('OrderProducts')}
          >
            {/* <Ionicons name="call" size={20} color={"#fff"} /> */}
            <Text style={[styles.continueButtonText, {color: '#fff'}]}>
              Call & Verify
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => handleNavigate('CheckoutScreen')}>
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
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
    paddingHorizontal:16,
    marginBottom:20
    
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
});

export default CartScreen;
