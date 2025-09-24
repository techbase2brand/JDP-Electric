// import React, {useEffect, useRef, useState} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   StatusBar,
//   StyleSheet,
//   Modal,
//   Alert,
//   FlatList,
//   ActivityIndicator,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {useNavigation} from '@react-navigation/native';
// import {getAllProducts, getProductsBySupplier} from '../config/apiConfig';
// import {useDispatch, useSelector} from 'react-redux';
// import {addToCart, updateQuantity} from '../redux/cartSlice';

// // Embedded Colors
// const Colors = {
//   primary: '#3B82F6',
//   primaryLight: '#EBF4FF',
//   white: '#FFFFFF',
//   backgroundLight: '#F8FAFC',
//   text: '#1E293B',
//   textSecondary: '#64748B',
//   textLight: '#94A3B8',
//   border: '#E2E8F0',
//   success: '#10B981',
//   successLight: '#D1FAE5',
//   warning: '#F59E0B',
//   warningLight: '#FEF3C7',
//   error: '#EF4444',
//   errorLight: '#FEE2E2',
// };

// // Embedded Spacing
// const Spacing = {
//   xs: 4,
//   sm: 8,
//   md: 16,
//   lg: 24,
//   xl: 32,
//   xxl: 48,
// };

// const BorderRadius = {
//   sm: 6,
//   md: 8,
//   lg: 12,
//   xl: 16,
// };

// const Shadows = {
//   md: {
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
// };

// const OrderProductsScreen = ({onBack, onNavigate, route}) => {
//   const lastFetchedPageRef = useRef(null);
//   const {id, job} = route.params;

//   const token = useSelector(state => state.user.token);
//   const cart = useSelector(state => state.cart.items);

//   const dispatch = useDispatch();
//   const navigation = useNavigation();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   // const [cart, setCart] = useState([]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [inStockOnly, setInStockOnly] = useState(false);
//   const [stockFilter, setStockFilter] = useState('all');
//   const [categories, setCategories] = useState([
//     {id: 'all', name: 'All Products'},
//   ]);
//   const [products, setProducts] = useState([]); // API data
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [loading, setLoading] = useState(false);
//   const [checkLoading, setCheckLoading] = useState(false);

//   const [hasMore, setHasMore] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   // useEffect(() => {
//   //   fetchProducts();
//   // }, [page]);

//   // const fetchProducts = async () => {
//   //   if (loading || !hasMore) return;

//   //   // ✅ agar same page dobara aa gaya to ignore
//   //   if (lastFetchedPageRef.current === page) {
//   //     console.log('⚠️ Skipping duplicate fetch for page:', page);
//   //     return;
//   //   }
//   //   lastFetchedPageRef.current = page;

//   //   setLoading(true);
//   //   setCheckLoading(true);

//   //   try {
//   //     const res = await getProductsBySupplier(id, page, 10, token);
//   //     const newProducts = res?.data?.data || [];
//   //     console.log('📦 Page', page, '=>', newProducts.length);

//   //     if (newProducts.length > 0) {
//   //       setProducts(prev => [...prev, ...newProducts]);
//   //       if (page === 1) {
//   //         const uniqueCategories = [
//   //           {id: 'all', name: 'All Products'},
//   //           ...Array.from(new Set(newProducts.map(p => p.category))).map(
//   //             cat => ({
//   //               id: cat,
//   //               name: cat
//   //                 ? cat.charAt(0).toUpperCase() + cat.slice(1)
//   //                 : 'Unknown',
//   //             }),
//   //           ),
//   //         ];
//   //         setCategories(uniqueCategories);
//   //       }
//   //     } else {
//   //       setHasMore(false);
//   //     }
//   //   } catch (err) {
//   //     console.log('❌ Error fetching products:', err);
//   //   } finally {
//   //     setLoading(false);
//   //     setCheckLoading(false);
//   //   }
//   // };

//   // const loadMore = () => {
//   //   if (!loading && hasMore) {
//   //     setPage(prev => prev + 1);
//   //   }
//   // };
//   useEffect(() => {
//     fetchProducts(false); // not a refresh
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page]);

//   // 3) fetch with a flag
//   const fetchProducts = async (isRefresh = false) => {
//     // block only normal loads
//     if (!isRefresh && (loading || !hasMore)) return;

//     // skip duplicate page ONLY for non-refresh loads
//     if (!isRefresh && lastFetchedPageRef.current === page) {
//       console.log('⚠️ Skipping duplicate fetch for page:', page);
//       return;
//     }
//     if (!isRefresh) lastFetchedPageRef.current = page;

//     if (!isRefresh) setLoading(true);
//     setCheckLoading(true);

//     try {
//       const res = await getProductsBySupplier(id, page, 10, token);
//       const newProducts = res?.data?.data || [];
//       console.log(
//         isRefresh ? '🔄 Refresh' : '📦 Page',
//         page,
//         '=>',
//         newProducts.length,
//       );

//       if (isRefresh) {
//         setProducts(newProducts);
//         setHasMore(true);
//         // categories on refresh (page will be 1)
//         const uniqueCategories = [
//           {id: 'all', name: 'All Products'},
//           ...Array.from(new Set(newProducts.map(p => p.category))).map(cat => ({
//             id: cat,
//             name: cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'Unknown',
//           })),
//         ];
//         setCategories(uniqueCategories);
//       } else {
//         if (newProducts.length > 0) {
//           setProducts(prev => [...prev, ...newProducts]);
//           if (page === 1) {
//             const uniqueCategories = [
//               {id: 'all', name: 'All Products'},
//               ...Array.from(new Set(newProducts.map(p => p.category))).map(
//                 cat => ({
//                   id: cat,
//                   name: cat
//                     ? cat.charAt(0).toUpperCase() + cat.slice(1)
//                     : 'Unknown',
//                 }),
//               ),
//             ];
//             setCategories(uniqueCategories);
//           }
//         } else {
//           setHasMore(false);
//         }
//       }
//     } catch (err) {
//       console.log('❌ Error fetching products:', err);
//     } finally {
//       if (!isRefresh) setLoading(false);
//       setCheckLoading(false);
//       if (isRefresh) setRefreshing(false);
//     }
//   };

//   // 4) CLEAN refresh handler
//   const handleRefresh = async () => {
//     console.log('🔄 Pull to refresh');
//     setRefreshing(true);
//     setHasMore(true);
//     setPage(1); // make sure we’re on page 1
//     lastFetchedPageRef.current = null; // reset duplicate guard
//     await fetchProducts(true); // pass refresh flag
//   };

//   // 5) load more untouched
//   const loadMore = () => {
//     if (!loading && hasMore) setPage(prev => prev + 1);
//   };
//   const handleAddToCart = product => {
//     dispatch(addToCart(product));
//   };

//   const handleUpdateQuantity = (productId, newQuantity) => {
//     dispatch(updateQuantity({productId, newQuantity}));
//   };

//   const productKey = (p, idx) => {
//   const base =
//     p?.id ??
//     p?.product_id ??
//     p?.jdp_sku ??
//     p?.supplier_sku ??
//     `idx-${idx}`;
//   // include supplier or page context to avoid cross-page dupes
//   return `${base}-${id}`;
// };

//   const getCartItemCount = () => {
//     return cart.reduce((total, item) => total + item.quantity, 0);
//   };

//   const getItemQuantity = productId => {
//     const item = cart.find(item => item.id === productId);
//     return item ? item.quantity : 0;
//   };

//   const handleNavigate = ({screen, params}) => {
//     if (onNavigate) {
//       onNavigate(screen, params);
//     } else {
//       onNavigate(screen, params);
//     }
//   };

//   const handleBack = () => {
//     if (onBack) {
//       onBack();
//     } else {
//       navigation.goBack();
//     }
//   };
//   const filteredProducts = products?.filter(product => {
//     const matchesSearch =
//       product?.product_name
//         ?.toLowerCase()
//         .includes(searchQuery.toLowerCase()) ||
//       product?.supplier_sku
//         ?.toLowerCase()
//         .includes(searchQuery.toLowerCase()) ||
//       product?.jdp_sku?.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesCategory =
//       selectedCategory === 'all' || product?.category === selectedCategory;

//     let matchesStock = true;
//     if (stockFilter === 'inStock') matchesStock = product?.stock_quantity > 0;
//     if (stockFilter === 'outOfStock')
//       matchesStock = product?.stock_quantity === 0;

//     return matchesSearch && matchesCategory && matchesStock;
//   });

//   // ✅ Render Product Card
//   const renderProduct = ({item}) => {
//     const quantity = getItemQuantity(item.id);
//     return (
//       <View style={styles.productCard}>
//         <View style={styles.productContent}>
//           {/* Product Icon */}
//           <View style={styles.productImageContainer}>
//             <Icon name="inventory" size={32} color="#999" />
//           </View>

//           {/* Info */}
//           <View style={styles.productInfo}>
//             <View style={styles.productHeader}>
//               <Text style={styles.productName} numberOfLines={1}>
//                 {item.product_name}
//               </Text>
//               <View
//                 style={[
//                   styles.stockBadge,
//                   item.stock_quantity > 0
//                     ? styles.inStockBadge
//                     : styles.outOfStockBadge,
//                 ]}>
//                 <Text
//                   style={[
//                     styles.stockBadgeText,
//                     item.stock_quantity > 0
//                       ? styles.inStockText
//                       : styles.outOfStockText,
//                   ]}>
//                   {item.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
//                 </Text>
//               </View>
//             </View>

//             <Text style={styles.productDescription} numberOfLines={2}>
//               {item.description}
//             </Text>

//             <View style={styles.productDetails}>
//               <Text style={styles.productSku}>SKU: {item.jdp_sku}</Text>
//               <Text style={styles.productStock}>
//                 Stock: {item.stock_quantity}
//               </Text>
//             </View>

//             <Text style={styles.productSupplier}>
//               Supplier: {item.suppliers.contact_person}
//             </Text>

//             {/* Add to Cart */}
//             {item.stock_quantity > 0 && (
//               <View style={styles.cartControls}>
//                 {quantity === 0 ? (
//                   <TouchableOpacity
//                     style={styles.addToCartButton}
//                     onPress={() => handleAddToCart(item)}>
//                     <Icon name="add" size={16} color="#fff" />
//                     <Text style={styles.addToCartText}>Add to Cart</Text>
//                   </TouchableOpacity>
//                 ) : (
//                   <View style={styles.quantityControls}>
//                     <TouchableOpacity
//                       style={styles.quantityButton}
//                       onPress={() =>
//                         handleUpdateQuantity(item.id, quantity - 1)
//                       }>
//                       <Icon name="remove" size={16} color="#000" />
//                     </TouchableOpacity>
//                     <Text style={styles.quantityText}>{quantity}</Text>
//                     <TouchableOpacity
//                       style={styles.quantityButton}
//                       onPress={() =>
//                         handleUpdateQuantity(item.id, quantity + 1)
//                       }>
//                       <Icon name="add" size={16} color="#000" />
//                     </TouchableOpacity>
//                   </View>
//                 )}
//               </View>
//             )}
//           </View>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerTop}>
//           <TouchableOpacity style={styles.backButton} onPress={handleBack}>
//             <Icon name="arrow-back" size={24} color={Colors.text} />
//           </TouchableOpacity>

//           <Text style={styles.headerTitle}>Order Products</Text>

//           <TouchableOpacity
//             style={styles.cartButton}
//             onPress={() =>
//               navigation.navigate('CartScreen', {
//                 id: id,
//                 job: job,
//               })
//             }>
//             <Icon name="shopping-cart" size={24} color={Colors.text} />
//             {getCartItemCount() > 0 && (
//               <View style={styles.cartBadge}>
//                 <Text style={styles.cartBadgeText}>{getCartItemCount()}</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Search and Filter */}
//         <View style={styles.searchContainer}>
//           <View style={styles.searchInputContainer}>
//             <Icon
//               name="search"
//               size={20}
//               color={Colors.textSecondary}
//               style={styles.searchIcon}
//             />
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search products..."
//               placeholderTextColor={Colors.textSecondary}
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//             />
//           </View>
//           {/* <TouchableOpacity
//             style={styles.filterButton}
//             onPress={() => setShowFilters(true)}>
//             <Icon name="filter-list" size={20} color={Colors.text} />
//           </TouchableOpacity> */}
//         </View>
//       </View>

//       {loading ? (
//         // ✅ Loading state dikhana
//         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//           <ActivityIndicator size="large" color={Colors.primary} />
//           <Text>Loading products...</Text>
//         </View>
//       ) : filteredProducts?.length > 0 ? (
//         <View>
//           <View style={styles.categoryTabs}>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {categories?.slice(0, 4)?.map(category => (
//                 <TouchableOpacity
//                   key={category.id}
//                   style={[
//                     styles.categoryTab,
//                     selectedCategory === category.id &&
//                       styles.selectedCategoryTab,
//                   ]}
//                   onPress={() => setSelectedCategory(category.id)}>
//                   <Text
//                     style={[
//                       styles.categoryTabText,
//                       selectedCategory === category.id &&
//                         styles.selectedCategoryTabText,
//                     ]}>
//                     {category.name}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>

//           {/* Products List */}
//           {/* ✅ Products FlatList with Pagination */}
//           <FlatList
//             data={filteredProducts}
//             showsVerticalScrollIndicator={false}
//            keyExtractor={(item, index) => productKey(item, index)}
//             renderItem={renderProduct}
//             onEndReached={loadMore}
//             refreshing={refreshing}
//             onRefresh={handleRefresh}
//             onEndReachedThreshold={0.5}
//             contentContainerStyle={{flexGrow: 1}}
//             ListFooterComponent={
//               loading ? (
//                 <ActivityIndicator
//                   style={{margin: 10}}
//                   color={Colors.primary}
//                 />
//               ) : null
//             }
//           />

//           {/* Bottom Cart Summary */}
//         </View>
//       ) : (
//         <View style={styles.emptyStateContainer}>
//           <Icon name="shopping-cart" size={80} color={Colors.textLight} />
//           <Text style={styles.emptyStateTitle1}>No Product found</Text>
//           <Text style={styles.emptyStateSubtitle1}>
//             Add some products to get started with your order
//           </Text>
//         </View>
//       )}
//       {getCartItemCount() > 0 && (
//         <View style={styles.bottomCartSummary}>
//           <TouchableOpacity
//             style={styles.cartSummaryButton}
//             onPress={() =>
//               navigation.navigate('CartScreen', {
//                 id: id,
//                 job: job,
//               })
//             }>
//             <Text style={styles.cartSummaryText}>
//               View Cart ({getCartItemCount()} items)
//             </Text>
//             <Icon name="shopping-cart" size={20} color={Colors.white} />
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.backgroundLight,
//     paddingBottom: 60,
//   },

//   // Header
//   header: {
//     backgroundColor: Colors.white,
//     paddingTop: Spacing.xl,
//     paddingHorizontal: Spacing.md,
//     paddingBottom: Spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//   },
//   headerTop: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: Spacing.md,
//   },
//   backButton: {
//     padding: Spacing.sm,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: Colors.text,
//   },
//   cartButton: {
//     padding: Spacing.sm,
//     position: 'relative',
//   },
//   cartBadge: {
//     position: 'absolute',
//     top: 4,
//     right: 4,
//     backgroundColor: Colors.primary,
//     borderRadius: 10,
//     minWidth: 20,
//     height: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cartBadgeText: {
//     fontSize: 12,
//     color: Colors.white,
//     fontWeight: 'bold',
//   },

//   // Search
//   searchContainer: {
//     flexDirection: 'row',
//     gap: Spacing.sm,
//   },
//   searchInputContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: Colors.backgroundLight,
//     borderRadius: BorderRadius.md,
//     paddingHorizontal: Spacing.md,
//   },
//   searchIcon: {
//     marginRight: Spacing.sm,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     fontSize: 16,
//     color: Colors.text,
//   },
//   filterButton: {
//     backgroundColor: Colors.backgroundLight,
//     borderRadius: BorderRadius.md,
//     padding: Spacing.md,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   // Category Tabs
//   categoryTabs: {
//     backgroundColor: Colors.white,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//   },
//   categoryTab: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.md,
//     marginRight: Spacing.sm,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   selectedCategoryTab: {
//     backgroundColor: Colors.primary,
//     borderColor: Colors.primary,
//   },
//   categoryTabText: {
//     fontSize: 14,
//     color: Colors.text,
//     fontWeight: '500',
//   },
//   selectedCategoryTabText: {
//     color: Colors.white,
//   },

//   // Products
//   productsList: {
//     flex: 1,
//     paddingHorizontal: Spacing.md,
//   },
//   productCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     marginVertical: Spacing.sm,
//     ...Shadows.md,
//   },
//   productContent: {
//     flexDirection: 'row',
//     padding: Spacing.md,
//     gap: Spacing.md,
//   },
//   productImageContainer: {
//     width: 64,
//     height: 64,
//     backgroundColor: Colors.backgroundLight,
//     borderRadius: BorderRadius.lg,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   productInfo: {
//     flex: 1,
//   },
//   productHeader: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     justifyContent: 'space-between',
//     marginBottom: Spacing.sm,
//   },
//   productName: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#000',
//     flex: 1,
//     marginRight: Spacing.sm,
//   },
//   stockBadge: {
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.sm,
//   },
//   inStockBadge: {
//     backgroundColor: Colors.successLight,
//   },
//   outOfStockBadge: {
//     backgroundColor: Colors.errorLight,
//   },
//   stockBadgeText: {
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   inStockText: {
//     color: Colors.success,
//   },
//   outOfStockText: {
//     color: Colors.error,
//   },
//   productDescription: {
//     fontSize: 14,
//     color: Colors.text,
//     marginBottom: Spacing.sm,
//   },
//   productDetails: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: Spacing.xs,
//   },
//   productSku: {
//     fontSize: 12,
//     color: Colors.text,
//   },
//   productStock: {
//     fontSize: 12,
//     color: Colors.text,
//   },
//   productSupplier: {
//     fontSize: 12,
//     color: Colors.text,
//     marginBottom: Spacing.md,
//   },

//   // Cart Controls
//   cartControls: {
//     alignItems: 'flex-start',
//   },
//   addToCartButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: Colors.primary,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.md,
//     gap: Spacing.xs,
//   },
//   addToCartText: {
//     fontSize: 14,
//     color: Colors.white,
//     fontWeight: '500',
//   },
//   quantityControls: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: Spacing.sm,
//   },
//   quantityButton: {
//     width: 32,
//     height: 32,
//     borderRadius: BorderRadius.md,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: Colors.white,
//   },
//   quantityText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: Colors.text,
//     paddingHorizontal: Spacing.md,
//   },

//   // Empty State
//   emptyState: {
//     alignItems: 'center',
//     paddingVertical: Spacing.xxl,
//   },
//   emptyStateTitle: {
//     fontSize: 18,
//     color: Colors.textSecondary,
//     marginTop: Spacing.md,
//   },
//   emptyStateSubtitle: {
//     fontSize: 14,
//     color: Colors.textLight,
//     marginTop: Spacing.xs,
//   },

//   // Bottom Cart Summary
//   bottomCartSummary: {
//     position: 'absolute',
//     bottom: 30,
//     left: 0,
//     right: 0,
//     backgroundColor: Colors.white,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//     padding: Spacing.md,
//   },
//   cartSummaryButton: {
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.md,
//     paddingVertical: Spacing.md,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: Spacing.lg,
//   },
//   cartSummaryText: {
//     fontSize: 16,
//     color: Colors.white,
//     fontWeight: '600',
//   },

//   // Modal
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//   },
//   modalBackdrop: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   filtersModal: {
//     backgroundColor: Colors.white,
//     borderTopLeftRadius: BorderRadius.xl,
//     borderTopRightRadius: BorderRadius.xl,
//     paddingHorizontal: Spacing.lg,
//     paddingBottom: Spacing.xl,
//     maxHeight: '80%',
//   },
//   modalHandle: {
//     width: 40,
//     height: 4,
//     backgroundColor: Colors.border,
//     borderRadius: 2,
//     alignSelf: 'center',
//     marginTop: Spacing.md,
//     marginBottom: Spacing.lg,
//   },
//   modalHeader: {
//     alignItems: 'center',
//     marginBottom: Spacing.lg,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: Colors.text,
//   },
//   modalContent: {
//     // flex: 1,
//   },

//   // Filter Sections
//   filterSection: {
//     marginBottom: Spacing.lg,
//   },
//   filterSectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.text,
//     marginBottom: Spacing.md,
//   },
//   categoryGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: Spacing.sm,
//   },
//   categoryOption: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.md,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     backgroundColor: Colors.white,
//   },
//   selectedCategoryOption: {
//     backgroundColor: Colors.primary,
//     borderColor: Colors.primary,
//   },
//   categoryOptionText: {
//     fontSize: 14,
//     color: Colors.text,
//     fontWeight: '500',
//   },
//   selectedCategoryOptionText: {
//     color: Colors.white,
//   },
//   availabilityOption: {
//     paddingVertical: Spacing.md,
//     paddingHorizontal: Spacing.md,
//     borderRadius: BorderRadius.md,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     backgroundColor: Colors.white,
//     marginBottom: Spacing.sm,
//   },
//   availabilityOptionText: {
//     fontSize: 14,
//     color: Colors.text,
//     fontWeight: '500',
//   },
//   emptyStateContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: Spacing.md,
//   },
//   emptyStateTitle1: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: Colors.text,
//     marginTop: Spacing.md,
//     marginBottom: Spacing.sm,
//   },
//   emptyStateSubtitle1: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//     textAlign: 'center',
//     marginBottom: Spacing.xl,
//   },
// });

// export default OrderProductsScreen;
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {getProductsBySupplier} from '../config/apiConfig';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart, updateQuantity} from '../redux/cartSlice';

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
const Spacing = {xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48};
const BorderRadius = {sm: 6, md: 8, lg: 12, xl: 16};
const Shadows = {
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
};

const PAGE_SIZE = 10;

const OrderProductsScreen = ({onBack, onNavigate, route}) => {
  const {id, job} = route.params;

  const token = useSelector(state => state.user.token);
  const cart = useSelector(state => state.cart.items);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Filters / UI
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [categories, setCategories] = useState([
    {id: 'all', name: 'All Products'},
  ]);

  // Data / Paging
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Loading states
  const [initialLoading, setInitialLoading] = useState(true);
  const [pagingLoading, setPagingLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Refs / guards
  const lastFetchedPageRef = useRef(null);
  const replaceNextRef = useRef(true); // initial load is a replace
  const onEndReachedLock = useRef(false);

  // ---------- Data Fetch ----------
  const fetchPage = useCallback(async () => {
    // duplicate guard
    if (!replaceNextRef.current && (pagingLoading || !hasMore)) return;
    if (!replaceNextRef.current && lastFetchedPageRef.current === page) return;

    // mark page fetched
    lastFetchedPageRef.current = page;

    const isReplace = replaceNextRef.current;

    try {
      if (isReplace) {
        if (!refreshing) setInitialLoading(true);
      } else {
        setPagingLoading(true);
      }

      const res = await getProductsBySupplier(id, page, PAGE_SIZE, token);
      const newProducts = res?.data?.data || [];
      console.log('order res :::', res);

      if (isReplace) {
        setProducts(newProducts);
        setHasMore(newProducts.length === PAGE_SIZE);
        // Build categories from first page (fresh list)
        const uniqueCategories = [
          {id: 'all', name: 'All Products'},
          ...Array.from(new Set(newProducts.map(p => p?.category)))
            .filter(cat => cat) // 👈 null / undefined / empty ko hata dega
            .map(cat => ({
              id: cat,
              name: cat.charAt(0).toUpperCase() + cat.slice(1),
            })),
        ];
        setCategories(uniqueCategories);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
        if (newProducts?.length < PAGE_SIZE) setHasMore(false);
      }
    } catch (e) {
      console.log('❌ Error fetching products:', e);
      // in case of error on first load, keep state sane
      if (replaceNextRef.current) setHasMore(true);
    } finally {
      if (replaceNextRef.current) {
        setInitialLoading(false);
        setRefreshing(false);
        replaceNextRef.current = false;
      } else {
        setPagingLoading(false);
      }
      onEndReachedLock.current = false; // release lock
    }
  }, [id, page, token, hasMore, pagingLoading, refreshing]);

  useEffect(() => {
    fetchPage();
  }, [page, fetchPage]);

  // ---------- Handlers ----------
  const handleRefresh = () => {
    // Clean refresh: just set flags; effect will fetch with page=1
    setRefreshing(true);
    setHasMore(true);
    lastFetchedPageRef.current = null;
    replaceNextRef.current = true;
    setPage(1);
  };

  const loadMore = () => {
    if (onEndReachedLock.current) return;
    if (hasMore && !pagingLoading && !initialLoading && !refreshing) {
      onEndReachedLock.current = true; // prevent multiple rapid calls
      setPage(prev => prev + 1);
    }
  };

  const productKey = (p, idx) => {
    const base =
      p?.id ?? p?.product_id ?? p?.jdp_sku ?? p?.supplier_sku ?? `idx-${idx}`;
    return `${base}-${id}`;
  };

  const handleAddToCart = product => dispatch(addToCart(product));
  const handleUpdateQuantity = (productId, newQuantity) =>
    dispatch(updateQuantity({productId, newQuantity}));

  const getCartItemCount = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  const getItemQuantity = productId => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const handleBack = () => (onBack ? onBack() : navigation.goBack());
  const goCart = () => navigation.navigate('CartScreen', {id, job});

  // ---------- Filters ----------
  const filteredProducts = products?.filter(product => {
    const s = (searchQuery || '').toLowerCase();
    const matchesSearch =
      product?.product_name?.toLowerCase().includes(s) ||
      product?.supplier_sku?.toLowerCase().includes(s) ||
      product?.jdp_sku?.toLowerCase().includes(s);

    const matchesCategory =
      selectedCategory === 'all' || product?.category === selectedCategory;

    let matchesStock = true;
    if (stockFilter === 'inStock')
      matchesStock = (product?.stock_quantity ?? 0) > 0;
    if (stockFilter === 'outOfStock')
      matchesStock = (product?.stock_quantity ?? 0) === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  // ---------- UI ----------
  const renderProduct = ({item}) => {
    const quantity = getItemQuantity(item.id);
    return (
      <View style={styles.productCard}>
        <View style={styles.productContent}>
          <View style={styles.productImageContainer}>
            <Icon name="inventory" size={32} color="#999" />
          </View>

          <View style={styles.productInfo}>
            <View style={styles.productHeader}>
              <Text style={styles.productName} numberOfLines={1}>
                {item.product_name}
              </Text>
              <View
                style={[
                  styles.stockBadge,
                  (item.stock_quantity ?? 0) > 0
                    ? styles.inStockBadge
                    : styles.outOfStockBadge,
                ]}>
                <Text
                  style={[
                    styles.stockBadgeText,
                    (item.stock_quantity ?? 0) > 0
                      ? styles.inStockText
                      : styles.outOfStockText,
                  ]}>
                  {(item.stock_quantity ?? 0) > 0 ? 'In Stock' : 'Out of Stock'}
                </Text>
              </View>
            </View>

            <Text style={styles.productDescription} numberOfLines={2}>
              {item.description}
            </Text>

            <View style={styles.productDetails}>
              <Text style={styles.productSku}>SKU: {item.jdp_sku}</Text>
              <Text style={styles.productStock}>
                Stock: {item.stock_quantity}
              </Text>
            </View>

            <Text style={styles.productSupplier}>
              Supplier: {item?.suppliers?.contact_person}
            </Text>

            {(item.stock_quantity ?? 0) > 0 && (
              <View style={styles.cartControls}>
                {quantity === 0 ? (
                  <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={() => handleAddToCart(item)}>
                    <Icon name="add" size={16} color="#fff" />
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() =>
                        handleUpdateQuantity(item.id, Math.max(0, quantity - 1))
                      }>
                      <Icon name="remove" size={16} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() =>
                        handleUpdateQuantity(item.id, quantity + 1)
                      }>
                      <Icon name="add" size={16} color="#000" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

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

          <TouchableOpacity style={styles.cartButton} onPress={goCart}>
            <Icon name="shopping-cart" size={24} color={Colors.text} />
            {getCartItemCount() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getCartItemCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Icon
              name="search"
              size={20}
              color={Colors.textSecondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor={Colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </View>

      {/* First load full-screen spinner */}
      {initialLoading && products.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text>Loading products...</Text>
        </View>
      ) : filteredProducts?.length > 0 ? (
        <View>
          <View className="categoryTabs" style={styles.categoryTabs}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories?.slice(0, 4)?.map(category => (
                <TouchableOpacity
                  key={category.id ?? String(category.name)}
                  style={[
                    styles.categoryTab,
                    selectedCategory === category.id &&
                      styles.selectedCategoryTab,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}>
                  <Text
                    style={[
                      styles.categoryTabText,
                      selectedCategory === category.id &&
                        styles.selectedCategoryTabText,
                    ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <FlatList
            data={filteredProducts}
            keyExtractor={(item, index) => productKey(item, index)}
            renderItem={renderProduct}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => {
              onEndReachedLock.current = false;
            }}
            contentContainerStyle={{flexGrow: 1, paddingHorizontal: Spacing.md}}
            ListFooterComponent={
              pagingLoading ? (
                <ActivityIndicator
                  style={{margin: 12}}
                  color={Colors.primary}
                />
              ) : null
            }
          />
        </View>
      ) : (
        // Empty state (only when not loading)
        <View style={styles.emptyStateContainer}>
          <Icon name="shopping-cart" size={80} color={Colors.textLight} />
          <Text style={styles.emptyStateTitle1}>No Product found</Text>
          <Text style={styles.emptyStateSubtitle1}>
            Add some products to get started with your order
          </Text>
        </View>
      )}

      {getCartItemCount() > 0 && (
        <View style={styles.bottomCartSummary}>
          <TouchableOpacity style={styles.cartSummaryButton} onPress={goCart}>
            <Text style={styles.cartSummaryText}>
              View Cart ({getCartItemCount()} items)
            </Text>
            <Icon name="shopping-cart" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    paddingBottom: 250,
  },

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
  backButton: {padding: Spacing.sm},
  headerTitle: {fontSize: 18, fontWeight: 'bold', color: Colors.text},
  cartButton: {padding: Spacing.sm, position: 'relative'},
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
  cartBadgeText: {fontSize: 12, color: Colors.white, fontWeight: 'bold'},

  searchContainer: {flexDirection: 'row', gap: Spacing.sm},
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  searchIcon: {marginRight: Spacing.sm},
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.text,
  },

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
  categoryTabText: {fontSize: 14, color: Colors.text, fontWeight: '500'},
  selectedCategoryTabText: {color: Colors.white},

  productsList: {flex: 1, paddingHorizontal: Spacing.md},
  productCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginVertical: Spacing.sm,
    ...Shadows.md,
  },
  productContent: {flexDirection: 'row', padding: Spacing.md, gap: Spacing.md},
  productImageContainer: {
    width: 64,
    height: 64,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  productInfo: {flex: 1},
  productHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    flex: 1,
    marginRight: Spacing.sm,
  },
  stockBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  inStockBadge: {backgroundColor: Colors.successLight},
  outOfStockBadge: {backgroundColor: Colors.errorLight},
  stockBadgeText: {fontSize: 12, fontWeight: '500'},
  inStockText: {color: Colors.success},
  outOfStockText: {color: Colors.error},
  productDescription: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  productSku: {fontSize: 12, color: Colors.text},
  productStock: {fontSize: 12, color: Colors.text},
  productSupplier: {fontSize: 12, color: Colors.text, marginBottom: Spacing.md},

  cartControls: {alignItems: 'flex-start'},
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  addToCartText: {fontSize: 14, color: Colors.white, fontWeight: '500'},
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

  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  emptyStateTitle1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyStateSubtitle1: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },

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
  cartSummaryText: {fontSize: 16, color: Colors.white, fontWeight: '600'},
});

export default OrderProductsScreen;
