// import React, {useState, useMemo, useRef, useEffect} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   StatusBar,
//   SafeAreaView,
//   Dimensions,
//   Modal,
//   PanResponder,
//   Animated,
//   LayoutAnimation,
//   Platform,
//   UIManager,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {heightPercentageToDP} from '../utils';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import {useSelector} from 'react-redux';
// import {getJobs, getlabourJobs} from '../config/apiConfig';

// const {width, height} = Dimensions.get('window');

// // Enable LayoutAnimation on Android
// if (Platform.OS === 'android') {
//   if (UIManager.setLayoutAnimationEnabledExperimental) {
//     UIManager.setLayoutAnimationEnabledExperimental(true);
//   }
// }

// const ActivitySummaryScreen = ({navigation, route}) => {
//   const user = useSelector(state => state.user.user);
//   const token = useSelector(state => state.user.token);
//   const leadLaborId = user?.leadLabor?.[0]?.id;
//   const laborId = user?.labor?.[0]?.id;
//   const [filterPeriod, setFilterPeriod] = useState('all');
//   const [showFilterSheet, setShowFilterSheet] = useState(false);
//   const [expandedJobId, setExpandedJobId] = useState(null);

//   // Animation refs
//   const bottomSheetAnim = useRef(new Animated.Value(height)).current;
//   const backdropAnim = useRef(new Animated.Value(0)).current;

//   // Enhanced mock data for hourly reports
//   const [hourlyReports] = useState([
//     {
//       id: '1',
//       jobId: 'JDP-2024-001',
//       jobTitle: 'Electrical Panel Upgrade',
//       customer: 'ABC Manufacturing',
//       date: '2025-08-18',
//       actualHours: 8.5,
//       updatedHours: 8.0,
//       location: '1234 Industrial Blvd, Houston, TX',
//       payRate: 45.0,
//       scheduledTime: '08:00 AM - 04:30 PM',
//       assignedTo: ['Mike Wilson', 'David Chen'],
//       status: 'completed',
//       createdAt: '2024-01-15T08:00:00Z',
//     },
//     {
//       id: '2',
//       jobId: 'JDP-2024-002',
//       jobTitle: 'Residential Rewiring',
//       customer: 'Johnson Family',
//       date: '2025-08-25',
//       actualHours: 6.5,
//       location: '5678 Oak Street, Houston, TX',
//       payRate: 42.0,
//       scheduledTime: '09:00 AM - 04:00 PM',
//       assignedTo: ['Lisa Rodriguez'],
//       status: 'completed',
//       createdAt: '2024-01-12T09:15:00Z',
//     },
//     {
//       id: '3',
//       jobId: 'JDP-2024-003',
//       jobTitle: 'LED Installation Project',
//       customer: 'TechCorp Office',
//       date: '2024-01-14',
//       actualHours: 12.0,
//       updatedHours: 11.5,
//       location: '9012 Business Park Dr, Houston, TX',
//       payRate: 48.0,
//       scheduledTime: '08:00 AM - 08:00 PM',
//       assignedTo: ['Tom Anderson', 'James Mitchell'],
//       status: 'completed',
//       createdAt: '2024-01-14T11:20:00Z',
//     },
//     {
//       id: '4',
//       jobId: 'JDP-2024-004',
//       jobTitle: 'Emergency Repair',
//       customer: 'Metro Hospital',
//       date: '2024-01-17',
//       actualHours: 8.5,
//       location: '3456 Medical Center Dr, Houston, TX',
//       payRate: 55.0,
//       scheduledTime: '08:00 PM - 04:30 AM',
//       assignedTo: ['Sarah Johnson'],
//       status: 'completed',
//       createdAt: '2024-01-17T20:30:00Z',
//     },
//     {
//       id: '5',
//       jobId: 'JDP-2024-005',
//       jobTitle: 'Industrial Wiring',
//       customer: 'Manufacturing Delta',
//       date: '2024-01-18',
//       actualHours: 16.0,
//       location: '7890 Industrial Way, Houston, TX',
//       payRate: 50.0,
//       scheduledTime: '06:00 AM - 10:00 PM',
//       assignedTo: ['Mike Wilson', 'David Chen', 'Lisa Rodriguez'],
//       status: 'completed',
//       createdAt: '2024-01-18T06:00:00Z',
//     },
//     {
//       id: '6',
//       jobId: 'JDP-2024-006',
//       jobTitle: 'Office Outlet Installation',
//       customer: 'Downtown Complex',
//       date: '2024-02-16',
//       actualHours: 4.5,
//       location: '2468 Downtown Ave, Houston, TX',
//       payRate: 40.0,
//       scheduledTime: '09:00 AM - 01:30 PM',
//       assignedTo: ['Tom Anderson'],
//       status: 'completed',
//       createdAt: '2024-01-16T09:00:00Z',
//     },
//     {
//       id: '7',
//       jobId: 'JDP-2024-007',
//       jobTitle: 'Safety Inspection',
//       customer: 'City School District',
//       date: '2024-02-19',
//       actualHours: 3.5,
//       location: '1357 School Rd, Houston, TX',
//       payRate: 38.0,
//       scheduledTime: '10:00 AM - 01:30 PM',
//       assignedTo: ['Sarah Johnson'],
//       status: 'completed',
//       createdAt: '2024-02-19T10:00:00Z',
//     },
//     {
//       id: '8',
//       jobId: 'JDP-2024-008',
//       jobTitle: 'Smart Home Setup',
//       customer: 'Premium Residence',
//       date: '2024-02-20',
//       actualHours: 7.0,
//       updatedHours: 6.5,
//       location: '9753 Luxury Lane, Houston, TX',
//       payRate: 52.0,
//       scheduledTime: '08:00 AM - 03:00 PM',
//       assignedTo: ['James Mitchell', 'Lisa Rodriguez'],
//       status: 'completed',
//       createdAt: '2024-02-20T08:00:00Z',
//     },
//   ]);
//   const today = new Date();
//   const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

//   const [fromDate, setFromDate] = useState(startOfMonth);
//   const [toDate, setToDate] = useState(today);

//   const [showFromPicker, setShowFromPicker] = useState(false);
//   const [showToPicker, setShowToPicker] = useState(false);
//   const [page, setPage] = useState(1);
//   const [paginationData, setPaginationData] = useState({});
//   const [jobs, setJobs] = useState([]);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);

//   const fetchJobs = async () => {
//     if (loading || !hasMore) return;
//     setLoading(true);
//     console.log('FetchJobs called with page:', page);
//     try {
//       const res =
//         user?.management_type == 'lead_labor'
//           ? await getJobs(leadLaborId, page, 10, token)
//           : await getlabourJobs(laborId, page, 10, token);
//       // const res = await getJobs(leadLaborId, page, 10, token);
//       console.log('jobs result::', res);

//       const newJobs = res?.data?.jobs ?? [];
//       const pg = res?.data?.pagination ?? {};

//       setPaginationData(pg);
//       setJobs(prev => [...prev, ...newJobs]);

//       //  hasMore
//       const limit = Number(pg?.limit ?? 10);
//       const total = Number(pg?.total ?? 0);
//       const loadedSoFar = (page - 1) * limit + newJobs.length;
//       const moreAvailable = loadedSoFar < total;

//       setHasMore(moreAvailable);

//       //  Page
//       if (newJobs.length > 0) {
//         setPage(prev => prev + 1);
//       }
//     } catch (err) {
//       console.error('Error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   console.log("jobsss", jobs);
//   useEffect(() => {

//     fetchJobs(); // first call
//   }, []);

//   // Filter data baßsed on date range and period
//   const filteredReports = useMemo(() => {
//     if (!filterPeriod) {
//       // From – To filter
//       return hourlyReports.filter(report => {
//         const reportDate = new Date(report.date); // ✅ use "date" field
//         const from = new Date(fromDate);
//         const to = new Date(toDate);
//         to.setHours(23, 59, 59, 999);
//         return reportDate >= from && reportDate <= to;
//       });
//     }

//     if (filterPeriod === 'all') {
//       return hourlyReports;
//     }

//     if (filterPeriod === 'month') {
//       return hourlyReports.filter(report => {
//         const d = new Date(report.date); // ✅
//         return (
//           d.getMonth() === today.getMonth() &&
//           d.getFullYear() === today.getFullYear()
//         );
//       });
//     }

//     if (filterPeriod === 'year') {
//       return hourlyReports.filter(report => {
//         const d = new Date(report.date); // ✅
//         return d.getFullYear() === today.getFullYear();
//       });
//     }

//     if (filterPeriod === 'week') {
//       const startOfWeek = new Date(today);
//       startOfWeek.setDate(today.getDate() - today.getDay());
//       startOfWeek.setHours(0, 0, 0, 0);

//       const endOfWeek = new Date(startOfWeek);
//       endOfWeek.setDate(startOfWeek.getDate() + 6);
//       endOfWeek.setHours(23, 59, 59, 999);

//       return hourlyReports.filter(report => {
//         const d = new Date(report.date); // ✅
//         return d >= startOfWeek && d <= endOfWeek;
//       });
//     }

//     return hourlyReports;
//   }, [hourlyReports, filterPeriod, fromDate, toDate]);

//   // 🔹 Step 2: Group data for chart
//   const generatePeriodData = (reports, period) => {
//     const groupedData = {};

//     reports.forEach(report => {
//       const date = new Date(report.date); // ✅ use "date"
//       let periodKey = '';

//       switch (period) {
//         case 'week':
//           const weekStart = new Date(date);
//           weekStart.setDate(date.getDate() - date.getDay());
//           periodKey = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
//           break;
//         case 'month':
//           periodKey = date.toLocaleDateString('en-US', {month: 'short'});
//           break;
//         case 'year':
//           periodKey = date.getFullYear().toString();
//           break;
//         case 'all':
//         case 'date':
//           periodKey = date.toLocaleDateString('en-US', {
//             month: 'short',
//             day: 'numeric',
//           });
//           break;
//       }

//       if (!groupedData[periodKey]) {
//         groupedData[periodKey] = {hours: 0, jobs: 0};
//       }

//       groupedData[periodKey].hours += report.updatedHours || report.actualHours;
//       groupedData[periodKey].jobs += 1;
//     });

//     const sortedKeys = Object.keys(groupedData).sort();
//     return {
//       labels: sortedKeys,
//       hours: sortedKeys.map(
//         key => Math.round(groupedData[key].hours * 10) / 10,
//       ),
//       jobs: sortedKeys.map(key => groupedData[key].jobs),
//     };
//   };

//   // useMemo
//   const chartData = useMemo(() => {
//     const completedReports = filteredReports.filter(
//       report => report.status === 'completed',
//     );

//     const totalHours = completedReports.reduce((sum, report) => {
//       return sum + (report.updatedHours || report.actualHours);
//     }, 0);

//     const jobsCompleted = completedReports.length;

//     const periodData = generatePeriodData(completedReports, filterPeriod);

//     return {
//       totalHours: Math.round(totalHours * 10) / 10,
//       jobsCompleted,
//       periodData,
//     };
//   }, [filteredReports, filterPeriod]);

//   // Navigation handler
//   const handleNavigation = screen => {
//     try {
//       if (navigation && typeof navigation.navigate === 'function') {
//         navigation.navigate(screen);
//       } else if (navigation && typeof navigation.goBack === 'function') {
//         navigation.goBack();
//       } else {
//         console.warn('Navigation function not available');
//       }
//     } catch (error) {
//       console.error('Navigation error:', error);
//     }
//   };

//   // Bottom sheet animation handlers
//   const showBottomSheet = () => {
//     setShowFilterSheet(true);
//     Animated.parallel([
//       Animated.timing(bottomSheetAnim, {
//         toValue: height * 0.4, // Show 60% of screen
//         duration: 300,
//         useNativeDriver: false,
//       }),
//       Animated.timing(backdropAnim, {
//         toValue: 0.5,
//         duration: 300,
//         useNativeDriver: false,
//       }),
//     ]).start();
//   };

//   const hideBottomSheet = () => {
//     Animated.parallel([
//       Animated.timing(bottomSheetAnim, {
//         toValue: height,
//         duration: 300,
//         useNativeDriver: false,
//       }),
//       Animated.timing(backdropAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: false,
//       }),
//     ]).start(() => {
//       setFilterPeriod('');
//       setShowFilterSheet(false);
//     });
//   };

//   // Pan responder for swipe down to dismiss
//   const panResponder = PanResponder.create({
//     onMoveShouldSetPanResponder: (evt, gestureState) => {
//       return (
//         gestureState.dy > 0 &&
//         Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
//       );
//     },
//     onPanResponderMove: (evt, gestureState) => {
//       if (gestureState.dy > 0) {
//         bottomSheetAnim.setValue(height * 0.4 + gestureState.dy);
//       }
//     },
//     onPanResponderRelease: (evt, gestureState) => {
//       if (gestureState.dy > 100) {
//         hideBottomSheet();
//       } else {
//         Animated.timing(bottomSheetAnim, {
//           toValue: height * 0.4,
//           duration: 200,
//           useNativeDriver: false,
//         }).start();
//       }
//     },
//   });

//   // Job card expansion handler
//   const toggleJobExpansion = jobId => {
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     setExpandedJobId(expandedJobId === jobId ? null : jobId);
//   };

//   const formatDate = dateString => {
//     const date = new Date(dateString);

//     const options = {
//       weekday: 'short',
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//     };
//     const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);

//     const weekday = parts.find(p => p.type === 'weekday').value;
//     const day = parts.find(p => p.type === 'day').value;
//     const month = parts.find(p => p.type === 'month').value;
//     const year = parts.find(p => p.type === 'year').value;

//     return `${weekday}, ${day} ${month} ${year}`;
//   };

//   const formatDateForInput = dateString => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   // Chart configuration
//   const chartConfig = {
//     backgroundColor: '#ffffff',
//     backgroundGradientFrom: '#ffffff',
//     backgroundGradientTo: '#ffffff',
//     decimalPlaces: 1,
//     color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
//     labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
//     style: {
//       borderRadius: 16,
//     },
//     propsForDots: {
//       r: '6',
//       strokeWidth: '2',
//       stroke: '#3B82F6',
//     },
//   };

//   // Render filter bottom sheet
//   const renderFilterBottomSheet = () => (
//     <Modal
//       visible={showFilterSheet}
//       transparent
//       animationType="none"
//       statusBarTranslucent>
//       <View style={styles.modalContainer}>
//         <Animated.View
//           style={[
//             styles.backdrop,
//             {
//               opacity: backdropAnim,
//             },
//           ]}>
//           <TouchableOpacity
//             style={styles.backdropTouch}
//             activeOpacity={1}
//             onPress={hideBottomSheet}
//           />
//         </Animated.View>

//         <Animated.View
//           style={[
//             styles.bottomSheet,
//             {
//               transform: [{translateY: bottomSheetAnim}],
//             },
//           ]}
//           {...panResponder.panHandlers}>
//           {/* Handle */}
//           <View style={styles.sheetHandle} />

//           {/* Header */}
//           <View style={styles.sheetHeader}>
//             <Text style={styles.sheetTitle}>Filter Reports</Text>
//             <TouchableOpacity onPress={hideBottomSheet}>
//               <Icon name="close" size={24} color="#6B7280" />
//             </TouchableOpacity>
//           </View>

//           <ScrollView
//             style={styles.sheetContent}
//             showsVerticalScrollIndicator={false}>
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Date Range</Text>
//               <View style={styles.dateRangeContainer}>
//                 {/* From Date */}
//                 <View style={styles.dateInputContainer}>
//                   <Text style={styles.dateLabel}>From</Text>
//                   <TouchableOpacity
//                     style={styles.dateInput}
//                     onPress={() => {
//                       setShowFromPicker(true), setShowToPicker(false);
//                     }}>
//                     <Icon name="calendar-today" size={16} color="#3B82F6" />
//                     <Text style={styles.dateInputText}>
//                       {formatDateForInput(fromDate)}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>

//                 <View style={styles.dateArrow}>
//                   <Icon name="arrow-forward" size={16} color="#9CA3AF" />
//                 </View>

//                 {/* To Date */}
//                 <View style={styles.dateInputContainer}>
//                   <Text style={styles.dateLabel}>To</Text>
//                   <TouchableOpacity
//                     style={styles.dateInput}
//                     onPress={() => {
//                       setShowToPicker(true), setShowFromPicker(false);
//                     }}>
//                     <Icon name="calendar-today" size={16} color="#3B82F6" />
//                     <Text style={styles.dateInputText}>
//                       {formatDateForInput(toDate)}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>

//               {/* From Date Picker */}
//               {showFromPicker && (
//                 <DateTimePicker
//                   value={fromDate}
//                   mode="date"
//                   display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                   maximumDate={toDate}
//                   onChange={(event, selectedDate) => {
//                     setShowFromPicker(false);
//                     if (selectedDate) setFromDate(selectedDate);
//                   }}
//                 />
//               )}

//               {/* To Date Picker */}
//               {showToPicker && (
//                 <DateTimePicker
//                   value={toDate}
//                   mode="date"
//                   display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                   minimumDate={fromDate}
//                   maximumDate={today}
//                   onChange={(event, selectedDate) => {
//                     setShowToPicker(false);
//                     if (selectedDate) setToDate(selectedDate);
//                   }}
//                 />
//               )}

//               {/* Apply Button */}
//               <TouchableOpacity
//                 style={styles.applyButton}
//                 onPress={hideBottomSheet}>
//                 <Text style={styles.applyButtonText}>Apply Filters</Text>
//               </TouchableOpacity>
//             </View>

//             {/* Period Filter Section */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Group By</Text>
//               <View style={styles.periodOptions}>
//                 {[
//                   {key: 'week', label: 'Week', icon: 'view-week'},
//                   {key: 'month', label: 'Month', icon: 'calendar-view-month'},
//                   {key: 'year', label: 'Year', icon: 'date-range'},
//                   {key: 'all', label: 'All', icon: 'view-list'},
//                 ].map(option => (
//                   <TouchableOpacity
//                     key={option.key}
//                     style={[
//                       styles.periodOption,
//                       filterPeriod === option.key && styles.periodOptionActive,
//                     ]}
//                     onPress={() => {
//                       setFilterPeriod(option.key), setShowFilterSheet(false);
//                     }}>
//                     <Icon
//                       name={option.icon}
//                       size={20}
//                       color={
//                         filterPeriod === option.key ? '#3B82F6' : '#6B7280'
//                       }
//                     />
//                     <Text
//                       style={[
//                         styles.periodOptionText,
//                         filterPeriod === option.key &&
//                           styles.periodOptionTextActive,
//                       ]}>
//                       {option.label}
//                     </Text>
//                     {filterPeriod === option.key && (
//                       <Icon name="check" size={18} color="#3B82F6" />
//                     )}
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           </ScrollView>
//         </Animated.View>
//       </View>
//     </Modal>
//   );

//   // Render job card
//   const renderJobCard = report => {
//     const isExpanded = expandedJobId === report.id;
//     const hasTimeUpdate =
//       report.updatedHours && report.updatedHours !== report.actualHours;
//     const finalHours = report.updatedHours || report.actualHours;

//     return (
//       <View key={report.id} style={styles.jobCard}>
//         <TouchableOpacity
//           style={styles.jobCardHeader}
//           onPress={() => toggleJobExpansion(report.id)}>
//           <View style={styles.jobCardMain}>
//             <View style={styles.jobCardInfo}>
//               <View></View>
//               <View>
//                 <Text
//                   style={[
//                     styles.jobDate,
//                     {fontSize: 16, color: '#3B82F6', fontWeight: '700'},
//                   ]}>
//                   {formatDate(report.date)}
//                 </Text>
//               </View>
//               <View>
//                 <Text style={styles.jobTitle}>{report.jobTitle}</Text>
//                 <Text style={styles.jobCustomer}>{report.customer}</Text>
//               </View>
//             </View>
//             <View style={styles.jobCardRight}>
//               <View style={styles.hoursContainer}>
//                 <Text style={styles.hoursText}>{finalHours}h</Text>
//                 {hasTimeUpdate && (
//                   <View style={styles.updatedBadge}>
//                     <Text style={styles.updatedBadgeText}>Updated</Text>
//                   </View>
//                 )}
//               </View>
//               <Icon
//                 name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
//                 size={24}
//                 color="#6B7280"
//               />
//             </View>
//           </View>
//         </TouchableOpacity>

//         {isExpanded && (
//           <View style={styles.jobCardExpanded}>
//             {/* Location */}
//             <View style={styles.expandedItem}>
//               <Icon name="location-on" size={16} color="#6B7280" />
//               <Text style={styles.expandedLabel}>Location:</Text>
//               <Text style={styles.expandedValue}>{report.location}</Text>
//             </View>

//             {/* Scheduled Time */}
//             <View style={styles.expandedItem}>
//               <Icon name="schedule" size={16} color="#6B7280" />
//               <Text style={styles.expandedLabel}>Scheduled:</Text>
//               <Text style={styles.expandedValue}>{report.scheduledTime}</Text>
//             </View>

//             {/* Time Details */}
//             {hasTimeUpdate && (
//               <View style={styles.timeDetailsContainer}>
//                 <View style={styles.timeDetail}>
//                   <Text style={styles.timeDetailLabel}>Original Time:</Text>
//                   <Text style={styles.timeDetailValue}>
//                     {report.actualHours}h
//                   </Text>
//                 </View>
//                 <View style={styles.timeDetail}>
//                   <Text style={styles.timeDetailLabel}>Updated Time:</Text>
//                   <Text style={[styles.timeDetailValue, styles.updatedTime]}>
//                     {report.updatedHours}h
//                   </Text>
//                 </View>
//               </View>
//             )}

//             {/* Assigned To */}
//             <View style={styles.expandedItem}>
//               <Icon name="people" size={16} color="#6B7280" />
//               <Text style={styles.expandedLabel}>Assigned:</Text>
//               <Text style={styles.expandedValue}>
//                 {report.assignedTo.join(', ')}
//               </Text>
//             </View>
//           </View>
//         )}
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}>
//           <Icon name="arrow-back" size={24} color="#FFFFFF" />
//         </TouchableOpacity>

//         <View style={styles.headerContent}>
//           <Text style={styles.headerTitle}>Hourly Reports</Text>
//           <Text style={styles.headerSubtitle}>
//             {filteredReports.length} jobs • {formatDateForInput(fromDate)} -{' '}
//             {formatDateForInput(toDate)}
//           </Text>
//         </View>

//         <TouchableOpacity style={styles.filterButton} onPress={showBottomSheet}>
//           <Icon name="filter-list" size={24} color="#FFFFFF" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}>
//         {/* Charts Section */}
//         <View style={styles.chartsContainer}>
//           {/* Summary Cards */}
//           <View style={styles.summaryCards}>
//             <View style={styles.summaryCard}>
//               <View style={styles.summaryCardIcon}>
//                 <Icon name="schedule" size={24} color="#F59E0B" />
//               </View>
//               <Text style={styles.summaryCardValue}>
//                 {chartData.totalHours}h
//               </Text>
//               <Text style={styles.summaryCardLabel}>Total Hours</Text>
//             </View>

//             <View style={styles.summaryCard}>
//               <View
//                 style={[styles.summaryCardIcon, {backgroundColor: '#DBEAFE'}]}>
//                 <Icon name="check-circle" size={24} color="#3B82F6" />
//               </View>
//               <Text style={styles.summaryCardValue}>
//                 {chartData.jobsCompleted}
//               </Text>
//               <Text style={styles.summaryCardLabel}>Jobs Completed</Text>
//             </View>
//           </View>
//         </View>

//         {/* Job Listings */}
//         <View style={styles.jobListingsContainer}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Job Details</Text>
//             <View style={styles.jobCount}>
//               <Text style={styles.jobCountText}>{filteredReports.length}</Text>
//             </View>
//           </View>

//           {filteredReports.length === 0 ? (
//             <View style={styles.emptyState}>
//               <Icon name="assignment" size={48} color="#9CA3AF" />
//               <Text style={styles.emptyStateTitle}>No reports found</Text>
//               <Text style={styles.emptyStateText}>
//                 No hourly reports found in the selected date range.
//               </Text>
//             </View>
//           ) : (
//             <View style={styles.jobsList}>
//               {filteredReports.map(renderJobCard)}
//             </View>
//           )}
//         </View>

//         <View style={styles.bottomSpacer} />
//       </ScrollView>

//       {/* Filter Bottom Sheet */}
//       {renderFilterBottomSheet()}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   header: {
//     backgroundColor: '#3B82F6',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   backButton: {
//     padding: 8,
//     borderRadius: 8,
//   },
//   headerContent: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: '#BFDBFE',
//     marginTop: 2,
//   },
//   filterButton: {
//     padding: 8,
//     borderRadius: 8,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   chartsContainer: {
//     padding: 16,
//   },
//   summaryCards: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 20,
//   },
//   summaryCard: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   summaryCardIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#FEF3C7',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 12,
//   },
//   summaryCardValue: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   summaryCardLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//     textAlign: 'center',
//   },
//   chartContainer: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   chartTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1F2937',
//     marginBottom: 16,
//   },
//   chart: {
//     borderRadius: 16,
//   },
//   jobListingsContainer: {
//     padding: 16,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   jobCount: {
//     backgroundColor: '#EFF6FF',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   jobCountText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#3B82F6',
//   },
//   emptyState: {
//     alignItems: 'center',
//     paddingVertical: 48,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   emptyStateTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1F2937',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptyStateText: {
//     fontSize: 14,
//     color: '#6B7280',
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   jobsList: {
//     gap: 12,
//   },
//   jobCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     overflow: 'hidden',
//   },
//   jobCardHeader: {
//     padding: 16,
//   },
//   jobCardMain: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   jobCardInfo: {
//     flex: 1,
//   },
//   jobTitle: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   jobCustomer: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 2,
//   },
//   jobDate: {
//     fontSize: 12,
//     color: '#9CA3AF',
//   },
//   jobCardRight: {
//     alignItems: 'flex-end',
//     gap: 8,
//   },
//   hoursContainer: {
//     alignItems: 'flex-end',
//     gap: 4,
//   },
//   hoursText: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#3B82F6',
//   },
//   updatedBadge: {
//     backgroundColor: '#FEF3C7',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 8,
//   },
//   updatedBadgeText: {
//     fontSize: 10,
//     fontWeight: '600',
//     color: '#D97706',
//   },
//   jobCardExpanded: {
//     borderTopWidth: 1,
//     borderTopColor: '#F3F4F6',
//     padding: 16,
//     gap: 12,
//   },
//   expandedItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   expandedLabel: {
//     fontSize: 13,
//     fontWeight: '500',
//     color: '#6B7280',
//     width: 70,
//   },
//   expandedValue: {
//     fontSize: 14,
//     color: '#1F2937',
//     flex: 1,
//   },
//   timeDetailsContainer: {
//     backgroundColor: '#F9FAFB',
//     borderRadius: 8,
//     padding: 12,
//     gap: 8,
//   },
//   timeDetail: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   timeDetailLabel: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   timeDetailValue: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   updatedTime: {
//     color: '#3B82F6',
//   },
//   bottomSpacer: {
//     height: 32,
//   },
//   // Bottom Sheet Styles
//   modalContainer: {
//     flex: 1,
//     height: heightPercentageToDP(100),
//   },
//   backdrop: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: '#000',
//   },
//   backdropTouch: {
//     flex: 1,
//   },
//   bottomSheet: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 50,
//     backgroundColor: '#FFFFFF',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     height: heightPercentageToDP(100),
//     // minHeight: height * 0.6,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: -4},
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   sheetHandle: {
//     width: 40,
//     height: 4,
//     backgroundColor: '#D1D5DB',
//     borderRadius: 2,
//     alignSelf: 'center',
//     marginTop: 12,
//     marginBottom: 8,
//   },
//   sheetHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },
//   sheetTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   sheetContent: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   filterSection: {
//     marginVertical: 20,
//   },
//   filterSectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1F2937',
//     marginBottom: 16,
//   },
//   dateRangeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   dateInputContainer: {
//     flex: 1,
//     gap: 8,
//   },
//   dateLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#6B7280',
//   },
//   dateInput: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F9FAFB',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     gap: 8,
//   },
//   dateInputText: {
//     fontSize: 14,
//     color: '#1F2937',
//     flex: 1,
//   },
//   dateArrow: {
//     marginTop: 24,
//   },
//   periodOptions: {
//     gap: 8,
//   },
//   periodOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 8,
//     backgroundColor: '#F9FAFB',
//     gap: 12,
//   },
//   periodOptionActive: {
//     backgroundColor: '#EFF6FF',
//     borderWidth: 1,
//     borderColor: '#DBEAFE',
//   },
//   periodOptionText: {
//     fontSize: 16,
//     color: '#6B7280',
//     flex: 1,
//   },
//   periodOptionTextActive: {
//     color: '#3B82F6',
//     fontWeight: '600',
//   },
//   applyButton: {
//     backgroundColor: '#3B82F6',
//     borderRadius: 12,
//     paddingVertical: 16,
//     marginVertical: 20,
//     alignItems: 'center',
//   },
//   applyButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
// });

// export default ActivitySummaryScreen;

import React, {useState, useMemo, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Modal,
  PanResponder,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {heightPercentageToDP} from '../utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useSelector} from 'react-redux';
import {getJobs, getlabourJobs} from '../config/apiConfig';

const {width, height} = Dimensions.get('window');

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const ActivitySummaryScreen = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  const token = useSelector(state => state.user.token);
  const leadLaborId = user?.leadLabor?.[0]?.id;
  const laborId = user?.labor?.[0]?.id;

  // -------- UI State
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState(null);

  // Animations
  const bottomSheetAnim = useRef(new Animated.Value(height)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  // -------- Dates
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const [fromDate, setFromDate] = useState(startOfMonth);
  const [toDate, setToDate] = useState(today);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  // -------- Data + Pagination
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState([]); // API jobs
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  // Helpers
  const secondsToHoursDecimal = (secs = 0, digits = 2) =>
    (Number(secs || 0) / 3600).toFixed(digits);

  const parseHMS = (hms = '00:00:00') => {
    // "HH:MM:SS" -> seconds
    const [h = '0', m = '0', s = '0'] = String(hms).split(':');
    return +h * 3600 + +m * 60 + +s;
  };

  // Sum matched timesheets seconds (work_activity or fallback to work_hours)
  const getMatchedTimesheetsSeconds = useCallback(
    job => {
      const tss = Array.isArray(job?.labor_timesheets)
        ? job.labor_timesheets
        : [];
      const matched = tss.filter(ts => {
        // match labor OR lead labor (if present)
        const matchLabor = laborId ? ts?.labor_id === laborId : false;
        const matchLead = leadLaborId
          ? ts?.lead_labor_id === leadLaborId
          : false;
        // if user is lead_labor: show all in job (common case), else match by labor
        if (user?.management_type === 'lead_labor') return true;
        return matchLabor || matchLead;
      });

      // prefer work_activity (seconds). If 0/undefined, fallback to work_hours string
      const secs = matched.reduce((sum, ts) => {
        const wa = Number(ts?.work_activity || 0); // seconds
        if (wa && wa > 0) return sum + wa;
        const wh = ts?.work_hours ? parseHMS(ts.work_hours) : 0;
        return sum + wh;
      }, 0);

      return secs;
    },
    [laborId, leadLaborId, user?.management_type],
  );

  const jobIsCompleted = useCallback(job => {
    // completed if any matched timesheet has job_status === 'completed' OR job.status === 'completed'
    if (String(job?.status).toLowerCase() === 'completed') return true;
    const tss = Array.isArray(job?.labor_timesheets)
      ? job.labor_timesheets
      : [];
    return tss.some(ts => String(ts?.job_status).toLowerCase() === 'completed');
  }, []);

  // API fetch: first page 20, next pages 10
  const fetchJobs = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const limit = page === 1 ? 20 : 10;
      const res =
        user?.management_type === 'lead_labor'
          ? await getJobs(leadLaborId, page, limit, token)
          : await getlabourJobs(laborId, page, limit, token);

      const newJobs = res?.data?.jobs ?? [];
      const pg = res?.data?.pagination ?? {};
      const total = Number(pg?.total ?? 0);
      const loadedSoFar = (page - 1) * limit + newJobs.length;
      const moreAvailable = loadedSoFar < total;

      setJobs(prev => [...prev, ...newJobs]);
      setHasMore(moreAvailable);
      if (newJobs.length > 0) setPage(prev => prev + 1);
      if (!initialLoaded) setInitialLoaded(true);
    } catch (err) {
      console.error('Jobs fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    hasMore,
    loading,
    user?.management_type,
    leadLaborId,
    laborId,
    token,
    initialLoaded,
  ]);

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Filter by date period (using job.due_date primarily; fallback created_at)
  const inRange = (d, from, to) => {
    const dd = new Date(d);
    const f = new Date(from);
    const t = new Date(to);
    t.setHours(23, 59, 59, 999);
    return dd >= f && dd <= t;
  };

  const filteredJobs = useMemo(() => {
    if (!Array.isArray(jobs) || jobs.length === 0) return [];

    if (!filterPeriod || filterPeriod === 'all') {
      return jobs.filter(j => {
        const when = j?.due_date || j?.created_at || j?.updated_at;
        return when ? inRange(when, fromDate, toDate) : true;
      });
    }

    const byPeriod = d => {
      const date = new Date(d);
      const now = new Date();
      if (filterPeriod === 'year')
        return date.getFullYear() === now.getFullYear();
      if (filterPeriod === 'month')
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      if (filterPeriod === 'week') {
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay());
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        return date >= start && date <= end;
      }
      return true;
    };

    return jobs.filter(j => {
      const when = j?.due_date || j?.created_at || j?.updated_at || today;
      return byPeriod(when);
    });
  }, [jobs, filterPeriod, fromDate, toDate]);

  // ---------- Summary (Total Hours & Jobs Completed)
  const summary = useMemo(() => {
    const hrsSecs = filteredJobs.reduce(
      (sum, job) => sum + getMatchedTimesheetsSeconds(job),
      0,
    );
    const totalHours = Number(secondsToHoursDecimal(hrsSecs, 2));
    const jobsCompleted = filteredJobs.reduce(
      (count, job) => count + (jobIsCompleted(job) ? 1 : 0),
      0,
    );
    return {totalHours, jobsCompleted};
  }, [filteredJobs, getMatchedTimesheetsSeconds, jobIsCompleted]);

  // ---------- UI helpers
  const toggleJobExpansion = jobId => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  const formatDate = dateString => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const options = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);
    const weekday = parts.find(p => p.type === 'weekday')?.value ?? '';
    const day = parts.find(p => p.type === 'day')?.value ?? '';
    const month = parts.find(p => p.type === 'month')?.value ?? '';
    const year = parts.find(p => p.type === 'year')?.value ?? '';
    return `${weekday}, ${day} ${month} ${year}`;
  };

  const formatDateForInput = dateString => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
  };

  // ---------- Bottom sheet open/close
  const showBottomSheet = () => {
    setShowFilterSheet(true);
    Animated.parallel([
      Animated.timing(bottomSheetAnim, {
        toValue: height * 0.4,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const hideBottomSheet = () => {
    Animated.parallel([
      Animated.timing(bottomSheetAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setFilterPeriod(filterPeriod || 'all');
      setShowFilterSheet(false);
    });
  };

  // Pan responder for swipe down to dismiss
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) =>
      gestureState.dy > 0 &&
      Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dy > 0)
        bottomSheetAnim.setValue(height * 0.4 + gestureState.dy);
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy > 100) {
        hideBottomSheet();
      } else {
        Animated.timing(bottomSheetAnim, {
          toValue: height * 0.4,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  // ---------- Renderers
  const renderFilterBottomSheet = () => (
    <Modal
      visible={showFilterSheet}
      transparent
      animationType="none"
      statusBarTranslucent>
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.backdrop, {opacity: backdropAnim}]}>
          <TouchableOpacity
            style={styles.backdropTouch}
            activeOpacity={1}
            onPress={hideBottomSheet}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.bottomSheet,
            {transform: [{translateY: bottomSheetAnim}]},
          ]}
          {...panResponder.panHandlers}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Filter</Text>
            <TouchableOpacity onPress={hideBottomSheet}>
              <Icon name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.sheetContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Date Range</Text>
              <View style={styles.dateRangeContainer}>
                <View style={styles.dateInputContainer}>
                  <Text style={styles.dateLabel}>From</Text>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => {
                      setShowFromPicker(true);
                      setShowToPicker(false);
                    }}>
                    <Icon name="calendar-today" size={16} color="#3B82F6" />
                    <Text style={styles.dateInputText}>
                      {formatDateForInput(fromDate)}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.dateArrow}>
                  <Icon name="arrow-forward" size={16} color="#9CA3AF" />
                </View>

                <View style={styles.dateInputContainer}>
                  <Text style={styles.dateLabel}>To</Text>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => {
                      setShowToPicker(true);
                      setShowFromPicker(false);
                    }}>
                    <Icon name="calendar-today" size={16} color="#3B82F6" />
                    <Text style={styles.dateInputText}>
                      {formatDateForInput(toDate)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {showFromPicker && (
                <DateTimePicker
                  value={fromDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  maximumDate={toDate}
                  onChange={(event, selectedDate) => {
                    setShowFromPicker(false);
                    if (selectedDate) setFromDate(selectedDate);
                  }}
                />
              )}
              {showToPicker && (
                <DateTimePicker
                  value={toDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minimumDate={fromDate}
                  maximumDate={today}
                  onChange={(event, selectedDate) => {
                    setShowToPicker(false);
                    if (selectedDate) setToDate(selectedDate);
                  }}
                />
              )}

              <TouchableOpacity
                style={styles.applyButton}
                onPress={hideBottomSheet}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Group By</Text>
              <View style={styles.periodOptions}>
                {[
                  {key: 'week', label: 'Week', icon: 'view-week'},
                  {key: 'month', label: 'Month', icon: 'calendar-view-month'},
                  {key: 'year', label: 'Year', icon: 'date-range'},
                  {key: 'all', label: 'All', icon: 'view-list'},
                ].map(option => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.periodOption,
                      filterPeriod === option.key && styles.periodOptionActive,
                    ]}
                    onPress={() => {
                      setFilterPeriod(option.key);
                      setShowFilterSheet(false);
                    }}>
                    <Icon
                      name={option.icon}
                      size={20}
                      color={
                        filterPeriod === option.key ? '#3B82F6' : '#6B7280'
                      }
                    />
                    <Text
                      style={[
                        styles.periodOptionText,
                        filterPeriod === option.key &&
                          styles.periodOptionTextActive,
                      ]}>
                      {option.label}
                    </Text>
                    {filterPeriod === option.key && (
                      <Icon name="check" size={18} color="#3B82F6" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );

  const renderJobCard = ({item: job}) => {
    const isExpanded = expandedJobId === job.id;
    const matchedSecs = getMatchedTimesheetsSeconds(job);
    const matchedHoursStr = secondsToHoursDecimal(matchedSecs, 2); // show hours on card

    const customerName =
      job?.customer?.customer_name || job?.customer?.company_name || '-';
    const title = job?.job_title || 'Untitled Job';
    const when = job?.due_date || job?.created_at || job?.updated_at;

    // details (assigned names)
    const assignedLead = Array.isArray(job?.assigned_lead_labor)
      ? job.assigned_lead_labor.map(x => x?.user?.full_name).filter(Boolean)
      : [];
    const assignedLabor = Array.isArray(job?.assigned_labor)
      ? job.assigned_labor.map(x => x?.user?.full_name).filter(Boolean)
      : [];
    const assignedAll = [...assignedLead, ...assignedLabor];
    const scheduledTime =
      job?.start_timer && job?.end_timer
        ? `${job.start_timer} - ${job.end_timer}`
        : '-';

    // show updated vs original? not applicable; we just show hours from timesheets (work_activity)
    return (
      <View key={job.id} style={styles.jobCard}>
        <TouchableOpacity
          style={styles.jobCardHeader}
          onPress={() => toggleJobExpansion(job.id)}>
          <View style={styles.jobCardMain}>
            <View style={styles.jobCardInfo}>
              <View />
              <View>
                <Text
                  style={[
                    styles.jobDate,
                    {fontSize: 16, color: '#3B82F6', fontWeight: '700'},
                  ]}>
                  {formatDate(when)}
                </Text>
              </View>
              <View>
                <Text style={[styles.jobTitle, {marginVertical: 10}]}>
                  {title}
                </Text>
                <Text style={styles.jobCustomer}>{customerName}</Text>
              </View>
            </View>
            <View style={styles.jobCardRight}>
              <View style={styles.hoursContainer}>
                <Text style={styles.hoursText}>{matchedHoursStr}h</Text>
              </View>
              <Icon
                name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={24}
                color="#6B7280"
              />
            </View>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.jobCardExpanded}>
            {/* Address */}
            <View style={styles.expandedItem}>
              <Icon name="location-on" size={16} color="#6B7280" />
              <Text style={styles.expandedLabel}>Address:</Text>
              <Text style={styles.expandedValue}>
                {job?.address || job?.bill_to_address || '-'}
              </Text>
            </View>

            {/* Scheduled */}
            <View style={styles.expandedItem}>
              <Icon name="schedule" size={16} color="#6B7280" />
              <Text style={styles.expandedLabel}>Scheduled:</Text>
              <Text style={styles.expandedValue}>{scheduledTime}</Text>
            </View>

            {/* Assigned */}
            <View style={styles.expandedItem}>
              <Icon name="people" size={16} color="#6B7280" />
              <Text style={styles.expandedLabel}>Assigned:</Text>
              <Text style={styles.expandedValue}>
                {assignedAll.length ? assignedAll.join(', ') : '-'}
              </Text>
            </View>

            {/* Timesheets (matched only) */}
            <View style={[styles.timeDetailsContainer, {marginTop: 4}]}>
              <Text style={{fontSize: 13, color: '#6B7280', marginBottom: 8}}>
                Matched Timesheets
              </Text>
              {Array.isArray(job?.labor_timesheets) &&
                job.labor_timesheets
                  .filter(ts => {
                    if (user?.management_type === 'lead_labor') return true;
                    const matchLabor = laborId
                      ? ts?.labor_id === laborId
                      : false;
                    const matchLead = leadLaborId
                      ? ts?.lead_labor_id === leadLaborId
                      : false;
                    return matchLabor || matchLead;
                  })
                  .map((ts, idx) => {
                    const secs =
                      Number(ts?.work_activity || 0) ||
                      parseHMS(ts?.work_hours || '00:00:00');
                    const hrs = secondsToHoursDecimal(secs, 2);
                    const name = ts?.labor_name || '-';
                    return (
                      <View
                        key={`${job.id}-ts-${idx}`}
                        style={styles.timeDetail}>
                        <Text style={styles.timeDetailLabel}>{name}</Text>
                        <Text
                          style={[styles.timeDetailValue, styles.updatedTime]}>
                          {hrs}h
                        </Text>
                      </View>
                    );
                  })}
              {!job?.labor_timesheets?.length && (
                <Text style={{fontSize: 12, color: '#9CA3AF'}}>
                  No timesheets
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  const keyExtractor = item => String(item.id);

  const handleEndReached = () => {
    if (!loading && hasMore) {
      fetchJobs();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Hourly Reports</Text>
          <Text style={styles.headerSubtitle}>
            {filteredJobs.length} jobs • {formatDateForInput(fromDate)} -{' '}
            {formatDateForInput(toDate)}
          </Text>
        </View>

        <TouchableOpacity style={styles.filterButton} onPress={showBottomSheet}>
          <Icon name="filter-list" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={{padding: 16}}>
        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryCardIcon}>
              <Icon name="schedule" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.summaryCardValue}>
              {summary.totalHours.toFixed(2)}h
            </Text>
            <Text style={styles.summaryCardLabel}>Total Hours</Text>
          </View>

          <View style={styles.summaryCard}>
            <View
              style={[styles.summaryCardIcon, {backgroundColor: '#DBEAFE'}]}>
              <Icon name="check-circle" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.summaryCardValue}>{summary.jobsCompleted}</Text>
            <Text style={styles.summaryCardLabel}>Jobs Completed</Text>
          </View>
        </View>
      </View>

      {/* Job List */}
      <View style={styles.jobListingsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Job Details</Text>
          <View style={styles.jobCount}>
            <Text style={styles.jobCountText}>{filteredJobs.length}</Text>
          </View>
        </View>

        {!initialLoaded && loading ? (
          <View style={{paddingVertical: 40, alignItems: 'center'}}>
            <ActivityIndicator size="large" />
          </View>
        ) : filteredJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="assignment" size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>No reports found</Text>
            <Text style={styles.emptyStateText}>
              No jobs found in the selected date range.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredJobs}
            keyExtractor={keyExtractor}
            renderItem={renderJobCard}
            contentContainerStyle={{gap: 12, paddingBottom: 32}}
            onEndReachedThreshold={0.4}
            onEndReached={handleEndReached}
            ListFooterComponent={
              loading ? (
                <View style={{paddingVertical: 16, alignItems: 'center'}}>
                  <ActivityIndicator />
                </View>
              ) : !hasMore ? (
                <View style={{paddingVertical: 12, alignItems: 'center'}}>
                  <Text style={{fontSize: 12, color: '#9CA3AF'}}>
                    No more jobs
                  </Text>
                </View>
              ) : null
            }
          />
        )}
      </View>

      {/* Filter Bottom Sheet */}
      {renderFilterBottomSheet()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F9FAFB'},
  header: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {padding: 8, borderRadius: 8},
  headerContent: {flex: 1, alignItems: 'center'},
  headerTitle: {fontSize: 20, fontWeight: '600', color: '#FFFFFF'},
  headerSubtitle: {fontSize: 14, color: '#BFDBFE', marginTop: 2},
  filterButton: {padding: 8, borderRadius: 8},

  summaryCards: {flexDirection: 'row', gap: 12, marginBottom: 8},
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  summaryCardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  summaryCardLabel: {fontSize: 12, color: '#6B7280', textAlign: 'center'},

  jobListingsContainer: {paddingHorizontal: 16},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {fontSize: 20, fontWeight: '600', color: '#1F2937'},
  jobCount: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  jobCountText: {fontSize: 14, fontWeight: '600', color: '#3B82F6'},

  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },

  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  jobCardHeader: {padding: 16},
  jobCardMain: {flexDirection: 'row', alignItems: 'center'},
  jobCardInfo: {flex: 1},
  jobTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  jobCustomer: {fontSize: 14, color: '#6B7280', marginBottom: 2},
  jobDate: {fontSize: 12, color: '#9CA3AF'},
  jobCardRight: {alignItems: 'flex-end', gap: 8},
  hoursContainer: {alignItems: 'flex-end', gap: 4},
  hoursText: {fontSize: 18, fontWeight: '700', color: '#3B82F6'},
  updatedBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  updatedBadgeText: {fontSize: 10, fontWeight: '600', color: '#D97706'},
  jobCardExpanded: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    padding: 16,
    gap: 12,
  },
  expandedItem: {flexDirection: 'row', alignItems: 'center', gap: 8},
  expandedLabel: {fontSize: 13, fontWeight: '500', color: '#6B7280', width: 70},
  expandedValue: {fontSize: 14, color: '#1F2937', flex: 1},
  timeDetailsContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  timeDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeDetailLabel: {fontSize: 14, color: '#6B7280'},
  timeDetailValue: {fontSize: 14, fontWeight: '600', color: '#1F2937'},
  updatedTime: {color: '#3B82F6'},

  bottomSpacer: {height: 32},

  // Bottom Sheet
  modalContainer: {flex: 1, height: heightPercentageToDP(100)},
  backdrop: {...StyleSheet.absoluteFillObject, backgroundColor: '#000'},
  backdropTouch: {flex: 1},
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 50,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: heightPercentageToDP(100),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sheetTitle: {fontSize: 20, fontWeight: '600', color: '#1F2937'},
  sheetContent: {flex: 1, paddingHorizontal: 20},
  filterSection: {marginVertical: 20},
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  dateRangeContainer: {flexDirection: 'row', alignItems: 'center', gap: 12},
  dateInputContainer: {flex: 1, gap: 8},
  dateLabel: {fontSize: 14, fontWeight: '500', color: '#6B7280'},
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  dateInputText: {fontSize: 14, color: '#1F2937', flex: 1},
  dateArrow: {marginTop: 24},
  periodOptions: {gap: 8},
  periodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    gap: 12,
  },
  periodOptionActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  periodOptionText: {fontSize: 16, color: '#6B7280', flex: 1},
  periodOptionTextActive: {color: '#3B82F6', fontWeight: '600'},
  applyButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    marginVertical: 20,
    alignItems: 'center',
  },
  applyButtonText: {fontSize: 16, fontWeight: '600', color: '#FFFFFF'},
});

export default ActivitySummaryScreen;
