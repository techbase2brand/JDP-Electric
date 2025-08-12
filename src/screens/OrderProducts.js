// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   FlatList,
//   TextInput,
//   Alert,
// } from 'react-native';

// export default function OrderProducts({onNavigate, navigation}) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [cart, setCart] = useState([]);

//   const categories = [
//     {id: 'all', name: 'All Items'},
//     {id: 'wire', name: 'Wire & Cable'},
//     {id: 'outlets', name: 'Outlets & Switches'},
//     {id: 'conduit', name: 'Conduit & Fittings'},
//     {id: 'tools', name: 'Tools'},
//   ];

//   const mockProducts = [
//     {
//       id: '1',
//       name: '12 AWG Copper Wire',
//       category: 'wire',
//       price: 45.99,
//       unit: 'per 100ft',
//       description: 'THHN/THWN-2 copper building wire',
//       inStock: true,
//       image: '🔌',
//     },
//     {
//       id: '2',
//       name: 'GFCI Outlet 15A',
//       category: 'outlets',
//       price: 12.5,
//       unit: 'each',
//       description: 'Ground fault circuit interrupter outlet',
//       inStock: true,
//       image: '🔌',
//     },
//     {
//       id: '3',
//       name: 'EMT Conduit 1/2"',
//       category: 'conduit',
//       price: 8.75,
//       unit: 'per 10ft',
//       description: 'Electrical metallic tubing',
//       inStock: true,
//       image: '🔧',
//     },
//     {
//       id: '4',
//       name: 'Wire Strippers',
//       category: 'tools',
//       price: 28.99,
//       unit: 'each',
//       description: 'Professional wire stripping tool',
//       inStock: false,
//       image: '🔧',
//     },
//   ];

//   const getFilteredProducts = () => {
//     let filtered = mockProducts;

//     if (selectedCategory !== 'all') {
//       filtered = filtered.filter(
//         product => product.category === selectedCategory,
//       );
//     }

//     if (searchQuery) {
//       filtered = filtered.filter(
//         product =>
//           product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           product.description.toLowerCase().includes(searchQuery.toLowerCase()),
//       );
//     }

//     return filtered;
//   };

//   const addToCart = product => {
//     const existingItem = cart.find(item => item.id === product.id);

//     if (existingItem) {
//       setCart(
//         cart.map(item =>
//           item.id === product.id
//             ? {...item, quantity: item.quantity + 1}
//             : item,
//         ),
//       );
//     } else {
//       setCart([...cart, {...product, quantity: 1}]);
//     }

//     Alert.alert('Added to Cart', `${product.name} added to cart`);
//   };

//   const getCartTotal = () => {
//     return cart.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   const renderProductItem = ({item}) => (
//     <View style={styles.productCard}>
//       <View style={styles.productHeader}>
//         <Text style={styles.productIcon}>{item.image}</Text>
//         <View style={styles.productInfo}>
//           <Text style={styles.productName}>{item.name}</Text>
//           <Text style={styles.productDescription} numberOfLines={2}>
//             {item.description}
//           </Text>
//           <View style={styles.priceRow}>
//             <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
//             <Text style={styles.productUnit}>{item.unit}</Text>
//           </View>
//         </View>
//       </View>

//       <View style={styles.productActions}>
//         <View
//           style={[
//             styles.stockIndicator,
//             {backgroundColor: item.inStock ? '#10B981' : '#EF4444'},
//           ]}>
//           <Text style={styles.stockText}>
//             {item.inStock ? 'In Stock' : 'Out of Stock'}
//           </Text>
//         </View>

//         <TouchableOpacity
//           style={[styles.addButton, !item.inStock && styles.disabledButton]}
//           onPress={() => addToCart(item)}
//           disabled={!item.inStock}>
//           <Text style={styles.addButtonText}>Add to Cart</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.backButton}>← Back</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Order Materials</Text>
//         <TouchableOpacity onPress={() => navigation.navigate('CartScreen')}>
//           <View style={styles.cartButton}>
//             <Text style={styles.cartIcon}>🛒</Text>
//             {cart.length > 0 && (
//               <View style={styles.cartBadge}>
//                 <Text style={styles.cartBadgeText}>{cart.length}</Text>
//               </View>
//             )}
//           </View>
//         </TouchableOpacity>
//       </View>

//       {/* Search */}
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           placeholder="Search materials..."
//           placeholderTextColor="#9CA3AF"
//         />
//       </View>

//       {/* Categories */}
//       <View style={styles.categoriesContainer}>
//         <FlatList
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           data={categories}
//           keyExtractor={item => item.id}
//           renderItem={({item}) => (
//             <TouchableOpacity
//               style={[
//                 styles.categoryButton,
//                 selectedCategory === item.id && styles.activeCategoryButton,
//               ]}
//               onPress={() => setSelectedCategory(item.id)}>
//               <Text
//                 style={[
//                   styles.categoryText,
//                   selectedCategory === item.id && styles.activeCategoryText,
//                 ]}>
//                 {item.name}
//               </Text>
//             </TouchableOpacity>
//           )}
//         />
//       </View>

//       {/* Products List */}
//       <FlatList
//         data={getFilteredProducts()}
//         keyExtractor={item => item.id}
//         renderItem={renderProductItem}
//         contentContainerStyle={styles.listContainer}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={() => (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyIcon}>📦</Text>
//             <Text style={styles.emptyTitle}>No products found</Text>
//             <Text style={styles.emptyText}>
//               Try adjusting your search or category filter
//             </Text>
//           </View>
//         )}
//       />
//       {/* Cart Summary */}
//       {cart.length > 0 && (
//         <View style={styles.cartSummary}>
//           <View style={styles.cartInfo}>
//             <Text style={styles.cartItemCount}>{cart.length} items</Text>
//             <Text style={styles.cartTotal}>${getCartTotal().toFixed(2)}</Text>
//           </View>
//           <TouchableOpacity
//             style={styles.viewCartButton}
//             onPress={() => navigation.navigate('CartScreen')}>
//             <Text style={styles.viewCartText}>View Cart</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8FAFC',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingTop: 50,
//     paddingBottom: 16,
//     backgroundColor: '#1E40AF',
//   },
//   backButton: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     fontWeight: '500',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   cartButton: {
//     position: 'relative',
//     padding: 4,
//   },
//   cartIcon: {
//     fontSize: 20,
//   },
//   cartBadge: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     backgroundColor: '#EF4444',
//     borderRadius: 8,
//     minWidth: 16,
//     height: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cartBadgeText: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   searchContainer: {
//     padding: 16,
//     backgroundColor: '#FFFFFF',
//   },
//   searchInput: {
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderRadius: 10,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     fontSize: 16,
//     backgroundColor: '#F9FAFB',
//   },
//   categoriesContainer: {
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   categoryButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     marginRight: 8,
//     borderRadius: 20,
//     backgroundColor: '#F3F4F6',
//   },
//   activeCategoryButton: {
//     backgroundColor: '#3B82F6',
//   },
//   categoryText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#6B7280',
//   },
//   activeCategoryText: {
//     color: '#FFFFFF',
//   },
//   listContainer: {
//     padding: 16,
//   },
//   productCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   productHeader: {
//     flexDirection: 'row',
//     marginBottom: 12,
//   },
//   productIcon: {
//     fontSize: 32,
//     marginRight: 12,
//   },
//   productInfo: {
//     flex: 1,
//   },
//   productName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   productDescription: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 8,
//     lineHeight: 20,
//   },
//   priceRow: {
//     flexDirection: 'row',
//     alignItems: 'baseline',
//   },
//   productPrice: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#3B82F6',
//     marginRight: 8,
//   },
//   productUnit: {
//     fontSize: 12,
//     color: '#9CA3AF',
//   },
//   productActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   stockIndicator: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   stockText: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   addButton: {
//     backgroundColor: '#3B82F6',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   disabledButton: {
//     backgroundColor: '#9CA3AF',
//   },
//   addButtonText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     paddingVertical: 60,
//   },
//   emptyIcon: {
//     fontSize: 48,
//     marginBottom: 16,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: '500',
//     color: '#1F2937',
//     marginBottom: 8,
//   },
//   emptyText: {
//     fontSize: 14,
//     color: '#6B7280',
//     textAlign: 'center',
//   },
//   cartSummary: {
//     backgroundColor: '#FFFFFF',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     marginBottom: 110,
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//   },
//   cartInfo: {
//     flex: 1,
//   },
//   cartItemCount: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   cartTotal: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1F2937',
//   },
//   viewCartButton: {
//     backgroundColor: '#3B82F6',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   viewCartText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
// });



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




const OrderProductsScreen = ({ onBack, onNavigate, route }) => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Mock products data (removed price and rating)
  const products = [
    {
      id: '1',
      name: 'Electrical Panel - 200A',
      category: 'panels',
      description: 'Main breaker panel for residential use',
      sku: 'EP-200A-001',
      inStock: true,
      stockLevel: 15,
      supplier: 'ElectricPro Supply',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop'
    },
    {
      id: '2',
      name: 'Circuit Breaker - 20A',
      category: 'breakers',
      description: 'Standard 20 amp circuit breaker',
      sku: 'CB-20A-002',
      inStock: true,
      stockLevel: 45,
      supplier: 'ElectricPro Supply'
    },
    {
      id: '3',
      name: 'THHN Wire - 12 AWG',
      category: 'wire',
      description: '12 gauge THHN copper wire, 500ft roll',
      sku: 'THHN-12-003',
      inStock: false,
      stockLevel: 0,
      supplier: 'Wire Solutions Inc'
    },
    {
      id: '4',
      name: 'Conduit - 1/2 inch EMT',
      category: 'conduit',
      description: 'Electrical metallic tubing, 10ft length',
      sku: 'EMT-12-004',
      inStock: true,
      stockLevel: 28,
      supplier: 'Conduit Corp'
    },
    {
      id: '5',
      name: 'Junction Box - 4x4',
      category: 'boxes',
      description: 'Square steel junction box',
      sku: 'JB-4X4-005',
      inStock: true,
      stockLevel: 120,
      supplier: 'ElectricPro Supply'
    },
    {
      id: '6',
      name: 'GFCI Outlet - 20A',
      category: 'outlets',
      description: 'Ground fault circuit interrupter outlet',
      sku: 'GFCI-20A-006',
      inStock: true,
      stockLevel: 32,
      supplier: 'Safety Electric Co'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'panels', name: 'Panels' },
    { id: 'breakers', name: 'Breakers' },
    { id: 'wire', name: 'Wire & Cable' },
    { id: 'conduit', name: 'Conduit' },
    { id: 'boxes', name: 'Boxes' },
    { id: 'outlets', name: 'Outlets & Switches' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    Alert.alert('Success', `${product.name} added to cart`);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.id !== productId));
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getItemQuantity = (productId) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
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

  const renderFiltersModal = () => (
    <Modal
      visible={showFilters}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowFilters(false)}
        >
          <View style={styles.filtersModal}>
            <View style={styles.modalHandle} />
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Products</Text>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Category</Text>
                <View style={styles.categoryGrid}>
                  {categories?.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryOption,
                        selectedCategory === category.id && styles.selectedCategoryOption
                      ]}
                      onPress={() => {
                        setSelectedCategory(category.id);
                        setShowFilters(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.categoryOptionText,
                          selectedCategory === category.id && styles.selectedCategoryOptionText
                        ]}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Availability</Text>
                <TouchableOpacity style={styles.availabilityOption}>
                  <Text style={styles.availabilityOptionText}>In Stock Only</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.availabilityOption}>
                  <Text style={styles.availabilityOptionText}>All Products</Text>
                </TouchableOpacity>
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
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Order Products</Text>
          
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => handleNavigate('CartScreen')}
          >
            <Icon name="shopping-cart" size={24} color={Colors.text} />
            {getCartItemCount() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getCartItemCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Icon name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor={Colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Icon name="filter-list" size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.slice(0, 4).map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryTab,
                selectedCategory === category.id && styles.selectedCategoryTab
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  selectedCategory === category.id && styles.selectedCategoryTabText
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products List */}
      <ScrollView style={styles.productsList} showsVerticalScrollIndicator={false}>
        {filteredProducts.map((product) => {
          const quantity = getItemQuantity(product.id);
          
          return (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productContent}>
                {/* Product Icon */}
                <View style={styles.productImageContainer}>
                  <Icon name="inventory" size={32} color={Colors.textLight} />
                </View>

                {/* Product Info */}
                <View style={styles.productInfo}>
                  <View style={styles.productHeader}>
                    <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                    <View style={[
                      styles.stockBadge,
                      product.inStock ? styles.inStockBadge : styles.outOfStockBadge
                    ]}>
                      <Text style={[
                        styles.stockBadgeText,
                        product.inStock ? styles.inStockText : styles.outOfStockText
                      ]}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.productDescription} numberOfLines={2}>{product.description}</Text>
                  
                  <View style={styles.productDetails}>
                    <Text style={styles.productSku}>SKU: {product.sku}</Text>
                    <Text style={styles.productStock}>Stock: {product.stockLevel}</Text>
                  </View>

                  <Text style={styles.productSupplier}>Supplier: {product.supplier}</Text>

                  {/* Add to Cart Controls */}
                  {product.inStock && (
                    <View style={styles.cartControls}>
                      {quantity === 0 ? (
                        <TouchableOpacity
                          style={styles.addToCartButton}
                          onPress={() => addToCart(product)}
                        >
                          <Icon name="add" size={16} color={Colors.white} />
                          <Text style={styles.addToCartText}>Add to Cart</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.quantityControls}>
                          <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => updateQuantity(product.id, quantity - 1)}
                          >
                            <Icon name="remove" size={16} color={Colors.text} />
                          </TouchableOpacity>
                          <Text style={styles.quantityText}>{quantity}</Text>
                          <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => updateQuantity(product.id, quantity + 1)}
                          >
                            <Icon name="add" size={16} color={Colors.text} />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        })}

        {filteredProducts.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="inventory" size={64} color={Colors.textLight} />
            <Text style={styles.emptyStateTitle}>No products found</Text>
            <Text style={styles.emptyStateSubtitle}>Try adjusting your search or filters</Text>
          </View>
        )}
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Cart Summary */}
      {getCartItemCount() > 0 && (
        <View style={styles.bottomCartSummary}>
          <TouchableOpacity
            style={styles.cartSummaryButton}
            onPress={() => handleNavigate('CartScreen')}
          >
            <Text style={styles.cartSummaryText}>View Cart ({getCartItemCount()} items)</Text>
            <Icon name="shopping-cart" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      )}

      {/* Filters Modal */}
      {renderFiltersModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    paddingBottom:60
  },

  // Header
  header: {
    backgroundColor: Colors.white,
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  cartButton: {
    padding: Spacing.sm,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: 'bold',
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.text,
  },
  filterButton: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Category Tabs
  categoryTabs: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCategoryTab: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryTabText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  selectedCategoryTabText: {
    color: Colors.white,
  },

  // Products
  productsList: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  productCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginVertical: Spacing.sm,
    ...Shadows.md,
  },
  productContent: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  productImageContainer: {
    width: 64,
    height: 64,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  productInfo: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  stockBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  inStockBadge: {
    backgroundColor: Colors.successLight,
  },
  outOfStockBadge: {
    backgroundColor: Colors.errorLight,
  },
  stockBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  inStockText: {
    color: Colors.success,
  },
  outOfStockText: {
    color: Colors.error,
  },
  productDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  productSku: {
    fontSize: 12,
    color: Colors.textLight,
  },
  productStock: {
    fontSize: 12,
    color: Colors.textLight,
  },
  productSupplier: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: Spacing.md,
  },

  // Cart Controls
  cartControls: {
    alignItems: 'flex-start',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  addToCartText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '500',
  },
  quantityControls: {
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
  quantityText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    paddingHorizontal: Spacing.md,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyStateTitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },

  // Bottom Cart Summary
  bottomCartSummary: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: Spacing.md,
  },
  cartSummaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },
  cartSummaryText: {
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
  filtersModal: {
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
    // flex: 1,
  },

  // Filter Sections
  filterSection: {
    marginBottom: Spacing.lg,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  selectedCategoryOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryOptionText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  selectedCategoryOptionText: {
    color: Colors.white,
  },
  availabilityOption: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    marginBottom: Spacing.sm,
  },
  availabilityOptionText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
});

export default OrderProductsScreen;