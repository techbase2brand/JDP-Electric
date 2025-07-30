// import React, {useState} from 'react';
// import {
//   FlatList,
//   Image,
//   Platform,
//   Pressable,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import {BaseStyle} from '../constants/Style';
// import {widthPercentageToDP as wp, heightPercentageToDP as hp} from '../utils';
// import {style, spacings} from '../constants/Fonts';
// import {
//   blackColor,
//   blueColor,
//   darkYellowColor,
//   grayColor,
//   lightGrayColor,
//   pinkColor,
//   simpleBlueColor,
//   whiteColor,
// } from '../constants/Color';
// import Header from '../components/Header';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Feather from 'react-native-vector-icons/Feather';
// import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
// import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
// import Carousel, {Pagination} from 'react-native-snap-carousel';
// import JobsComponent from '../components/JobsComponent';

// const {
//   flex,
//   alignItemsCenter,
//   alignJustifyCenter,
//   resizeModeContain,
//   flexDirectionRow,
//   justifyContentSpaceBetween,
//   textAlign,
// } = BaseStyle;

// const HomeScreen = () => {
//   const [activeSlide, setActiveSlide] = useState(0);

//   const carousalData = [
//     {
//       image:
//         'https://media.istockphoto.com/id/969234244/photo/woman-setting-up-for-party.jpg?s=612x612&w=0&k=20&c=mV12VC4FKrq5gulXjPbkjvOEOaqOFCkECQJYScPKids=',
//     },
//     {
//       image:
//         'https://media.istockphoto.com/id/1497057589/photo/creative-entrepreneur-having-an-idea-and-holding-a-light-bulb.jpg?b=1&s=612x612&w=0&k=20&c=tPJcfeImyE3-ecBiQV6TyI1PBUnMfg7qTux6TcqA_hs=',
//     },
//     {
//       image:
//         'https://as1.ftcdn.net/jpg/03/88/20/98/1000_F_388209813_cXAsdSN74mPz0QKlQvATgSMO09vjZiS1.jpg',
//     },
//   ];

//   const dashboardCards = [
//     {
//       id: '1',
//       title: 'Total Hours',
//       subtitle: 'This Week',
//       value: '40',
//       bgColor: blueColor,
//       icon: <Feather name="clock" size={24} color={whiteColor} />,
//     },
//     {
//       id: '2',
//       title: 'Ongoing Jobs',
//       subtitle: '',
//       value: '30',
//       bgColor: darkYellowColor,
//       icon:<MaterialIcons
//       name="directions-walk"
//       size={30}
//       color={whiteColor}
//       style={{transform: [{scaleX: -1}]}}
//     />
//       // icon: <Ionicons name="briefcase" size={24} color={whiteColor} />,
//     },
//     {
//       id: '3',
//       title: 'Pending Jobs',
//       subtitle: '',
//       value: '10',
//       bgColor: pinkColor,
//       icon: (
//         <MaterialCommunityIcons
//           name="clock-time-eight-outline"
//           size={24}
//           color={whiteColor}
//         />
//       ),
//     },
//     {
//       id: '4',
//       title: 'Completed Jobs',
//       subtitle: '',
//       value: '5',
//       bgColor: simpleBlueColor,
//       icon: (
//         <View
//           style={{
//             flexDirection: 'row',
//             gap: 5,
//             justifyContent: 'space-between',
//             width: '100%',
//           }}>
//           <Ionicons name="briefcase" size={24} color={whiteColor} />
//         </View>
//       ),
//     },
//   ];

//   const carousalRenderItem = ({item}) => (
//     <View
//       style={[
//         alignJustifyCenter,
//         {marginTop: spacings.xxLarge, marginBottom: spacings.Large1x},
//       ]}>
//       <Image source={{uri: item.image}} style={styles.image} />
//     </View>
//   );

//   const renderItem = ({item}) => (
//     <View style={[styles.card, {backgroundColor: item.bgColor}]}>
//       <View>
//         <Text style={styles.title}>{item.title} </Text>
//         <Text style={[styles.title, {fontWeight: 0}]}>{item.subtitle}</Text>
//       </View>
//       <View
//         style={{
//           display: 'flex',
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//         }}>
//         <Text style={styles.value}>{item.value}</Text>
//         <View style={styles.icon}>{item.icon}</View>
//       </View>
//     </View>
//   );

//   return (
//     <View style={[flex, {backgroundColor: whiteColor}]}>
//       <Header showProfile={true} />
//       <View style={[styles.container]}>
//         {/* Carousel Component */}
//         {/* FlatList for Dashboard Cards */}
//         <FlatList
//           data={dashboardCards}
//           renderItem={renderItem}
//           keyExtractor={item => item?.id}
//           numColumns={2}
//           scrollEnabled={false}
//         />
//       </View>
//         <JobsComponent/>
//     </View>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: whiteColor,
//     padding: spacings.large,
//   },
//   card: {
//     width: wp(45),
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//     borderRadius: 10,
//     padding: wp(4),
//     height: hp(13),
//     margin: 5,
//   },
//   title: {
//     color: whiteColor,
//     fontSize: style.fontSizeNormal2x.fontSize,
//     fontWeight: 'bold',
//   },
//   subtitle: {
//     fontSize: style.fontSizeMedium.fontSize,
//     fontWeight: 'normal',
//   },
//   value: {
//     fontSize: wp(7),
//     fontWeight: 'bold',
//     color: whiteColor,
//   },
//   icon: {
//     // position: 'absolute',
//     // bottom: wp(3),
//     // right: wp(3),
//   },
//   image: {
//     width: wp(92),
//     height: hp(20),
//     borderRadius: 10,
//     resizeMode: 'cover',
//     marginRight: spacings.xxLarge,
//   },
// });

// kdsakda

// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Dimensions,
//   Animated,
// } from 'react-native';
// import Feather from 'react-native-vector-icons/Feather';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// import { whiteColor } from '../constants/Color';

// const {width} = Dimensions.get('window');

// export default function HomeScreen({
//   user,
//   jobs,
//   onNavigate,
//   onViewJob,
//   onCreateJob,
//   unreadNotificationCount,
// }) {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const fadeAnim = new Animated.Value(0);
//   const cards = [
//     {
//       icon: <Feather name="activity" size={24} color={whiteColor} />,
//       number: 2,
//       label: 'Active Jobs',
//       subtitle: "Today's schedule",
//     },
//     {
//       icon: <AntDesign name="sync" size={24} color={whiteColor} />,
//       number: 1,
//       label: 'In Progress',
//       subtitle: "Currently working",
//     },
//     {
//       icon: <Feather name="calendar" size={24} color={whiteColor} />,
//       number: 1,
//       label: 'Upcoming',
//       subtitle: "Next 3 days",
//     },
//     {
//      icon: <MaterialIcons name="assignment-turned-in" size={24} color={whiteColor} />,
//       number: 24,
//       label: 'This Week',
//       subtitle: "Total assigned",
//     },
//   ];

//   // Helper to chunk array into rows of 2
//   const chunkArray = (arr, size) =>
//     arr.reduce(
//       (acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]),
//       [],
//     );

//   const chunkedCards = chunkArray(cards, 2);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 60000);

//     // Fade in animation
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 800,
//       useNativeDriver: true,
//     }).start();

//     return () => clearInterval(timer);
//   }, []);

//   const todayJobs = [
//     {
//       id: 'JOB-001',
//       title: 'Electrical Panel Upgrade',
//       customer: {name: 'David Thompson'},
//       location: {address: '1234 Oak Street, Houston, TX 77001'},
//       status: 'in_progress',
//       priority: 'high',
//       startTime: '08:00',
//       estimatedHours: 8,
//       description: 'Upgrade main electrical panel from 100A to 200A service',
//     },
//     {
//       id: 'JOB-002',
//       title: 'Commercial Lighting Installation',
//       customer: {name: 'TechCorp Office'},
//       location: {address: '1500 Corporate Blvd, Houston, TX 77002'},
//       status: 'scheduled',
//       priority: 'medium',
//       startTime: '14:00',
//       estimatedHours: 6,
//       description: 'Install LED lighting system in conference rooms',
//     },
//   ];

//   const upcomingJobs = [
//     {
//       id: 'JOB-003',
//       title: 'Emergency Generator Maintenance',
//       customer: {name: 'Metro Hospital'},
//       location: {address: '2200 Medical Center Dr, Houston, TX 77030'},
//       status: 'assigned',
//       priority: 'high',
//       scheduledDate: '2024-01-26',
//       startTime: '09:00',
//       estimatedHours: 4,
//       description: 'Quarterly maintenance on backup generator system',
//     },
//   ];

//   const getGreeting = () => {
//     const hour = currentTime.getHours();
//     if (hour < 12) return 'Good morning';
//     if (hour < 17) return 'Good afternoon';
//     return 'Good evening';
//   };

//   const getStatusColor = status => {
//     switch (status) {
//       case 'in_progress':
//         return '#3B82F6';
//       case 'scheduled':
//         return '#10B981';
//       case 'assigned':
//         return '#8B5CF6';
//       default:
//         return '#6B7280';
//     }
//   };

//   const getPriorityColor = priority => {
//     switch (priority) {
//       case 'high':
//         return '#EF4444';
//       case 'medium':
//         return '#F59E0B';
//       case 'low':
//         return '#10B981';
//       default:
//         return '#6B7280';
//     }
//   };

//   const hasLeadAccess = user?.role === 'Lead Labor';

//   const quickActions = [
//     {
//       icon: '💼',
//       title: 'View Jobs',
//       color: '#3B82F6',
//       screen: 'job-listing',
//     },
//     {
//       icon: '📊',
//       title: 'View Reports',
//       color: '#10B981',
//       screen: 'reports',
//     },
//     // ...(hasLeadAccess ? [
//     {
//       icon: '💰',
//       title: 'Generate Invoice',
//       color: '#8B5CF6',
//       screen: 'invoice-management',
//     },
//     {
//       icon: '🛡️',
//       title: 'Check Warranty',
//       color: '#F59E0B',
//       screen: 'warranty-checker',
//     },
//     {
//       icon: '➕',
//       title: 'Create Job',
//       color: '#06B6D4',
//       action: onCreateJob,
//     },

//     {
//       icon: '👤',
//       title: 'Support Center',
//       color: '#EC4899',
//       screen: 'support-center',
//     },
//   ];

//   return (
//     <View style={styles.container}>
//       {/* Header with gradient matching web design */}
//       <View style={styles.header}>
//         {/* Background decorations */}
//         <View style={[styles.headerCircle, styles.topRightCircle]} />
//         <View style={[styles.headerCircle, styles.bottomLeftCircle]} />

//         <Animated.View style={[styles.headerContent, {opacity: fadeAnim}]}>
//           {/* User info and notifications */}
//           <View style={styles.headerTop}>
//             <View style={styles.userInfo}>
//               <View style={styles.avatar}>
//                 <Text style={styles.avatarText}>
//                   {user?.name
//                     ?.split(' ')
//                     .map(n => n[0])
//                     .join('') || 'U'}
//                 </Text>
//                 <View style={styles.statusDot} />
//               </View>
//               <View style={styles.userDetails}>
//                 <Text style={styles.greeting}>
//                   {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}!
//                 </Text>
//                 <View style={styles.roleContainer}>
//                   <View style={styles.roleBadge}>
//                     <Text style={styles.roleText}>
//                       {user?.role || 'Employee'}
//                     </Text>
//                   </View>
//                   <Text style={styles.dateText}>
//                     {currentTime.toLocaleDateString('en-US', {
//                       weekday: 'long',
//                       month: 'short',
//                       day: 'numeric',
//                     })}
//                   </Text>
//                 </View>
//               </View>
//             </View>

//             <TouchableOpacity
//               style={styles.notificationButton}
//               onPress={() => onNavigate('notifications')}>
//               <Text style={styles.notificationIcon}>🔔</Text>
//               {unreadNotificationCount > 0 && (
//                 <View style={styles.notificationBadge}>
//                   <Text style={styles.notificationBadgeText}>
//                     {unreadNotificationCount}
//                   </Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//           </View>

//           {/* Enhanced Stats Cards matching web design */}
//           <View style={styles.statsContainer}>
//             {chunkedCards?.map((row, rowIndex) => (
//               <View key={rowIndex} style={styles.row}>
//                 {row.map((card, index) => (
//                   <View key={index} style={styles.statCard}>
//                     <View style={[styles.statIconContainer,{display:"flex"}]}>
//                       <Text style={styles.statIcon}>{card.icon}</Text>
//                        <Text style={styles.statLabel}>{card.label}</Text>
//                     </View>
//                     <Text style={styles.statNumber}>{card.number}</Text>

//                   </View>
//                 ))}
//               </View>
//             ))}
//           </View>
//         </Animated.View>
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {/* Quick Actions */}
//         <Animated.View
//           style={[styles.quickActionsContainer, {opacity: fadeAnim}]}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Quick Actions</Text>
//             {hasLeadAccess && (
//               <View style={styles.leadBadge}>
//                 <Text style={styles.leadBadgeText}>Lead Access</Text>
//               </View>
//             )}
//           </View>

//           <View style={styles.quickActionsGrid}>
//             {quickActions.map((action, index) => (
//               <View key={action.title} style={styles.actionButtonContainer}>
//                 <TouchableOpacity
//                   style={[styles.actionButton, {backgroundColor: action.color}]}
//                   onPress={() =>
//                     action.action ? action.action() : onNavigate(action.screen)
//                   }>
//                   <View style={styles.actionIconContainer}>
//                     <Text style={styles.actionIcon}>{action.icon}</Text>
//                   </View>
//                   <Text style={styles.actionText}>{action.title}</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </View>
//         </Animated.View>

//         {/* Today's Jobs */}
//         <View style={styles.jobsContainer}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Today's Jobs</Text>
//             <TouchableOpacity onPress={() => onNavigate('job-listing')}>
//               <Text style={styles.viewAllText}>View All →</Text>
//             </TouchableOpacity>
//           </View>

//           {todayJobs.length === 0 ? (
//             <View style={styles.emptyContainer}>
//               <Text style={styles.emptyIcon}>📅</Text>
//               <Text style={styles.emptyTitle}>No jobs scheduled for today</Text>
//               <Text style={styles.emptyText}>
//                 Check back later or view upcoming jobs.
//               </Text>
//             </View>
//           ) : (
//             todayJobs.map((job, index) => (
//               <View key={job.id} style={styles.jobCard}>
//                 <TouchableOpacity
//                   onPress={() => onViewJob(job)}
//                   activeOpacity={0.8}>
//                   <View style={styles.jobHeader}>
//                     <View style={styles.jobIdContainer}>
//                       <Text style={styles.jobId}>{job.id}</Text>
//                       <View style={styles.jobBadges}>
//                         <View
//                           style={[
//                             styles.statusBadge,
//                             {backgroundColor: getStatusColor(job.status)},
//                           ]}>
//                           <Text style={styles.badgeText}>
//                             {job.status === 'in_progress'
//                               ? 'In Progress'
//                               : 'Scheduled'}
//                           </Text>
//                         </View>
//                         <View
//                           style={[
//                             styles.priorityBadge,
//                             {backgroundColor: getPriorityColor(job.priority)},
//                           ]}>
//                           <Text style={styles.badgeText}>
//                             {job.priority.toUpperCase()}
//                           </Text>
//                         </View>
//                       </View>
//                     </View>
//                   </View>

//                   <Text style={styles.jobTitle}>{job.title}</Text>
//                   <Text style={styles.jobDescription} numberOfLines={2}>
//                     {job.description}
//                   </Text>

//                   <View style={styles.jobDetails}>
//                     <View style={styles.jobDetailRow}>
//                       <Text style={styles.jobDetailIcon}>🏢</Text>
//                       <Text style={styles.jobDetailText} numberOfLines={1}>
//                         {job.customer.name}
//                       </Text>
//                     </View>
//                     <View style={styles.jobDetailRow}>
//                       <Text style={styles.jobDetailIcon}>🕐</Text>
//                       <Text style={styles.jobDetailText}>
//                         {job.startTime} ({job.estimatedHours}h est.)
//                       </Text>
//                     </View>
//                     <View style={styles.jobDetailRow}>
//                       <Text style={styles.jobDetailIcon}>📍</Text>
//                       <Text style={styles.jobDetailText} numberOfLines={1}>
//                         {job.location.address}
//                       </Text>
//                     </View>
//                   </View>
//                 </TouchableOpacity>
//               </View>
//             ))
//           )}
//         </View>

//         {/* Upcoming Jobs */}
//         <View style={styles.jobsContainer}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Upcoming Jobs</Text>
//             <TouchableOpacity onPress={() => onNavigate('job-listing')}>
//               <Text style={styles.viewAllText}>View All →</Text>
//             </TouchableOpacity>
//           </View>

//           {upcomingJobs.length === 0 ? (
//             <View style={styles.emptyContainer}>
//               <Text style={styles.emptyIcon}>✅</Text>
//               <Text style={styles.emptyText}>No upcoming jobs scheduled.</Text>
//             </View>
//           ) : (
//             upcomingJobs.map(job => (
//               <View key={job.id} style={styles.upcomingJobCard}>
//                 <TouchableOpacity onPress={() => onViewJob(job)}>
//                   <View style={styles.upcomingJobHeader}>
//                     <View style={styles.upcomingJobInfo}>
//                       <Text style={styles.upcomingJobId}>{job.id}</Text>
//                       <View
//                         style={[
//                           styles.priorityBadge,
//                           {backgroundColor: getPriorityColor(job.priority)},
//                         ]}>
//                         <Text style={styles.badgeText}>{job.priority}</Text>
//                       </View>
//                     </View>
//                     <Text style={styles.upcomingJobDate}>
//                       {new Date(job.scheduledDate).toLocaleDateString()} at{' '}
//                       {job.startTime}
//                     </Text>
//                   </View>
//                   <Text style={styles.upcomingJobTitle}>{job.title}</Text>
//                   <View style={styles.upcomingJobDetails}>
//                     <Text style={styles.upcomingJobDetailText}>
//                       🏢 {job.customer.name}
//                     </Text>
//                     <Text style={styles.upcomingJobDetailText}>
//                       🕐 {job.estimatedHours}h
//                     </Text>
//                   </View>
//                 </TouchableOpacity>
//               </View>
//             ))
//           )}
//         </View>

//         {/* Lead Performance Overview */}
//         {hasLeadAccess && (
//           <View style={styles.performanceContainer}>
//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>Team Performance</Text>
//               <View style={styles.leadIndicator}>
//                 <Text style={styles.leadIndicatorText}>Lead Dashboard</Text>
//               </View>
//             </View>

//             <View style={styles.performanceGrid}>
//               <View
//                 style={[styles.performanceCard, {backgroundColor: '#F0FDF4'}]}>
//                 <View style={styles.performanceIconContainer}>
//                   <Text style={styles.performanceIcon}>✅</Text>
//                 </View>
//                 <Text style={styles.performanceNumber}>18</Text>
//                 <Text style={styles.performanceLabel}>Jobs Completed</Text>
//                 <Text style={styles.performanceSubtext}>This week</Text>
//               </View>

//               <View
//                 style={[styles.performanceCard, {backgroundColor: '#EFF6FF'}]}>
//                 <View style={styles.performanceIconContainer}>
//                   <Text style={styles.performanceIcon}>👥</Text>
//                 </View>
//                 <Text style={styles.performanceNumber}>6</Text>
//                 <Text style={styles.performanceLabel}>Active Technicians</Text>
//                 <Text style={styles.performanceSubtext}>Currently working</Text>
//               </View>
//             </View>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F1F5F9',
//   },
//   header: {
//     backgroundColor: '#1E40AF',
//     paddingTop: 50,
//     paddingBottom: 24,
//     paddingHorizontal: 20,
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   headerCircle: {
//     position: 'absolute',
//     backgroundColor: 'rgba(255, 255, 255, 0.05)',
//     borderRadius: 1000,
//   },
//   topRightCircle: {
//     width: 256,
//     height: 256,
//     top: -128,
//     right: -128,
//   },
//   bottomLeftCircle: {
//     width: 192,
//     height: 192,
//     bottom: -96,
//     left: -96,
//   },
//   headerContent: {
//     zIndex: 10,
//   },
//   headerTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 24,
//   },
//   userInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   avatar: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//     borderWidth: 2,
//     borderColor: 'rgba(255, 255, 255, 0.2)',
//     position: 'relative',
//   },
//   avatarText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   statusDot: {
//     position: 'absolute',
//     bottom: -2,
//     right: -2,
//     width: 20,
//     height: 20,
//     backgroundColor: '#10B981',
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#FFFFFF',
//   },
//   userDetails: {
//     flex: 1,
//   },
//   greeting: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 4,
//   },
//   roleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//   },
//   roleBadge: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 12,
//     marginRight: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   roleText: {
//     fontSize: 12,
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   dateText: {
//     fontSize: 14,
//     color: 'rgba(255, 255, 255, 0.8)',
//   },
//   notificationButton: {
//     position: 'relative',
//     padding: 8,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     borderRadius: 20,
//   },
//   notificationIcon: {
//     fontSize: 20,
//   },
//   notificationBadge: {
//     position: 'absolute',
//     top: 2,
//     right: 2,
//     backgroundColor: '#EF4444',
//     borderRadius: 9,
//     minWidth: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   notificationBadgeText: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   statsContainer: {
//     flexDirection: 'column',
//     gap: 12, // optional spacing between rows
//   },

//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },

//   statCard: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderRadius: 16,
//     padding: 12,
//     width: (width - 60) / 2, // ensures 2 per row with spacing
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.1)',
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   statIconContainer: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderRadius: 12,
//     padding: 8,
//     marginBottom: 8,
//   },
//   statIcon: {
//     fontSize: 16,
//   },
//   statNumber: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: 'rgba(255, 255, 255, 0.8)',
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   content: {
//     flex: 1,
//     padding: 20,
//   },
//   quickActionsContainer: {
//     marginBottom: 24,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1F2937',
//   },
//   leadBadge: {
//     backgroundColor: '#8B5CF6',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   leadBadgeText: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   quickActionsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   actionButtonContainer: {
//     width: (width - 60) / 2,
//     marginBottom: 16,
//   },
//   actionButton: {
//     borderRadius: 16,
//     padding: 20,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 4},
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   actionIconContainer: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderRadius: 20,
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   actionIcon: {
//     fontSize: 20,
//   },
//   actionText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#FFFFFF',
//     textAlign: 'center',
//   },
//   jobsContainer: {
//     marginBottom: 24,
//   },
//   viewAllText: {
//     fontSize: 14,
//     color: '#3B82F6',
//     fontWeight: '600',
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     paddingVertical: 40,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//   },
//   emptyIcon: {
//     fontSize: 48,
//     marginBottom: 16,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1F2937',
//     marginBottom: 8,
//   },
//   emptyText: {
//     fontSize: 14,
//     color: '#6B7280',
//     textAlign: 'center',
//   },
//   jobCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   jobHeader: {
//     marginBottom: 12,
//   },
//   jobIdContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   jobId: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#3B82F6',
//   },
//   jobBadges: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   priorityBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   badgeText: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   jobTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1F2937',
//     marginBottom: 8,
//   },
//   jobDescription: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 16,
//     lineHeight: 20,
//   },
//   jobDetails: {
//     gap: 8,
//   },
//   jobDetailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   jobDetailIcon: {
//     fontSize: 16,
//     marginRight: 8,
//     width: 20,
//   },
//   jobDetailText: {
//     fontSize: 14,
//     color: '#6B7280',
//     flex: 1,
//   },
//   upcomingJobCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 1},
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   upcomingJobHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   upcomingJobInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   upcomingJobId: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#3B82F6',
//   },
//   upcomingJobDate: {
//     fontSize: 12,
//     color: '#6B7280',
//     backgroundColor: '#F3F4F6',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   upcomingJobTitle: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#1F2937',
//     marginBottom: 8,
//   },
//   upcomingJobDetails: {
//     flexDirection: 'row',
//     gap: 16,
//   },
//   upcomingJobDetailText: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   performanceContainer: {
//     marginBottom: 24,
//   },
//   leadIndicator: {
//     backgroundColor: '#8B5CF6',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   leadIndicatorText: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   performanceGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 8,
//   },
//   performanceCard: {
//     flex: 1,
//     borderRadius: 16,
//     padding: 20,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   performanceIconContainer: {
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     borderRadius: 12,
//     padding: 8,
//     marginBottom: 12,
//   },
//   performanceIcon: {
//     fontSize: 20,
//   },
//   performanceNumber: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   performanceLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1F2937',
//     marginBottom: 4,
//     textAlign: 'center',
//   },
//   performanceSubtext: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
// });

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {tabColor, whiteColor} from '../constants/Color';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import LinearGradient from 'react-native-linear-gradient';
import {widthPercentageToDP} from '../utils';

const HomeScreen = ({navigation}) => {
  const statsData = [
    {
      title: 'Active Jobs',
      value: '2',
      subtitle: "Today's schedule",
      icon: <Feather name="activity" size={24} color={whiteColor} />,
    },
    {
      title: 'In Progress',
      value: '1',
      subtitle: 'Currently working',
      icon: <AntDesign name="sync" size={20} color={whiteColor} />,
    },
    {
      title: 'Upcoming',
      value: '1',
      subtitle: 'Next 3 days',
      icon: <Feather name="calendar" size={24} color={whiteColor} />,
    },
    {
      title: 'This Week',
      value: '24',
      subtitle: 'Total assigned',
      icon: (
        <MaterialIcons
          name="assignment-turned-in"
          size={24}
          color={whiteColor}
        />
      ),
    },
  ];

  const quickActions = [
    {
      title: 'View Jobs',
      icon: <MaterialIcons name="preview" size={26} color={whiteColor} />,
      color: '#3B82F6',
    },
    {
      title: 'View Reports',
      icon: <FontAwesome name="line-chart" size={20} color={whiteColor} />,
      color: '#0D542B',
    },
    {
      title: 'Generate Invoice',
      icon: <FontAwesome name="file-pdf-o" size={24} color={whiteColor} />,
      color: '#6E11B0',
    },
    {
      title: 'Check Warranty',
      icon: <Feather name="check-square" size={24} color={whiteColor} />,
      color: '#9F2D00',
    },
    {
      title: 'Create Job',
      icon: <Ionicons name="create" size={26} color={whiteColor} />,
      color: '#005F5A',
    },
    {
      title: 'Support Center',
      icon: <MaterialIcons name="support-agent" size={26} color={whiteColor} />,
      color: '#A50036',
    },
  ];

  const todaysJobs = [
    {
      id: 'JOB-001',
      title: 'Electrical Panel Upgrade',
      description: 'Upgrade main electrical panel from 100A to 200A service',
      status: 'In Progress',
      priority: 'HIGH',
      technician: 'David Thompson',
      time: '08:00 (8h est.)',
      location: '1234 Oak Street, Houston, TX 77001',
      statusColor: '#193CB8',
      priorityColor: '#9F0712',
      startCoordinates: {latitude: 29.7604, longitude: -95.3698},
      destinationCoordinates: {latitude: 29.713, longitude: -95.399},
    },
    {
      id: 'JOB-002',
      title: 'Commercial Lighting Installation',
      description: 'Install LED lighting system in conference rooms',
      status: 'Scheduled',
      priority: 'MEDIUM',
      technician: 'TechCorp Office',
      time: '14:00 (6h est.)',
      location: '1500 Corporate Blvd, Houston, TX 77002',
      statusColor: '#016630',
      priorityColor: '#894B00',
      startCoordinates: {latitude: 29.7604, longitude: -95.3698},
      destinationCoordinates: {latitude: 29.757, longitude: -95.37},
    },
  ];

  const upcomingJobs = [
    {
      id: 'JOB-003',
      title: 'Emergency Generator Maintenance',
      date: '1/26/2024 at 09:00',
      priority: 'high',
      client: 'Metro Hospital',
      duration: '4h',
      priorityColor: '#9F0712',
    },
  ];

  const handleQuickActionPress = title => {
    if (title == 'Create Job') {
      navigation.navigate('CreateJobScreen'); // replace 'CreateJob' with your actual screen name
    } else if (title == 'View Reports') {
      navigation.navigate('ReportsScreen');
    }

    // You can add other conditions here for other actions
    else if (title == 'View Jobs') {
      navigation.navigate('JobStack');
    } else if (title == 'Support Center') {
      navigation.navigate('SupportScreen');
    }
  };

  const renderStatsCard = (item, index) => (
    <View key={index} style={styles.statsCard}>
      {/* <View style={[styles.headerCircle, styles.topRightCircle, {overflow:"hidden"}]} /> */}

      <View
        style={[
          styles.statsIconContainer,
          {display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8},
        ]}>
        <Text style={styles.statsIcon}>{item.icon}</Text>
        <Text style={[styles.statsTitle, {fontSize: 16, fontWeight: 700}]}>
          {item.title}
        </Text>
      </View>
      <View style={styles.statsContent}>
        <Text style={styles.statsValue}>{item.value}</Text>
        <Text style={styles.statsSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  const renderQuickAction = (item, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.quickActionButton, {backgroundColor: item.color}]}
      onPress={() => handleQuickActionPress(item.title)}>
      <View style={[styles.quickActionIcon, {backgroundColor: item.color}]}>
        <Text style={styles.quickActionIconText}>{item.icon}</Text>
      </View>
      <Text style={styles.quickActionText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderJobCard = item => (
    <TouchableOpacity
      onPress={() => navigation.navigate('JobDetail', {job: item})}
      key={item.id}
      style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <View style={styles.jobHeaderLeft}>
          <Text style={styles.jobId}>{item.id}</Text>
          <View style={[styles.statusBadge, {backgroundColor: '#E3F2FD'}]}>
            <Text style={[styles.statusText, {color: item.statusColor}]}>
              {item.status}
            </Text>
          </View>
          <View style={[styles.priorityBadge, {backgroundColor: '#ECEEF2'}]}>
            <Text style={[styles.priorityText, {color: item.priorityColor}]}>
              {item.priority}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.jobDescription}>{item.description}</Text>
      <View style={styles.jobDetails}>
        <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
          <View style={styles.jobDetailRow}>
            <Text style={styles.jobDetailIcon}>
              {' '}
              <Feather name="user" size={18} color={tabColor} />{' '}
            </Text>
            <Text style={styles.jobDetailText}>{item.technician}</Text>
          </View>
          <View style={styles.jobDetailRow}>
            <Text style={styles.jobDetailIcon}>
              <Ionicons name="timer-outline" size={18} color={tabColor} />
            </Text>
            <Text style={styles.jobDetailText}>{item.time}</Text>
          </View>
        </View>
        <View style={styles.jobDetailRow}>
          <Text style={styles.jobDetailIcon}>
            <Feather name="map-pin" size={18} color={tabColor} />
          </Text>
          <Text style={styles.jobDetailText}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderUpcomingJob = item => (
    <View key={item.id} style={styles.upcomingJobCard}>
      <View style={styles.upcomingJobHeader}>
        <View style={styles.upcomingJobLeft}>
          <Text style={styles.upcomingJobId}>{item.id}</Text>
          <View style={[styles.priorityBadge, {backgroundColor: '#ECEEF2'}]}>
            <Text style={[styles.priorityText, {color: item.priorityColor}]}>
              {item.priority}
            </Text>
          </View>
        </View>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </View>
      <Text style={styles.upcomingJobTitle}>{item.title}</Text>
      <View style={styles.upcomingJobDetails}>
        <View style={styles.jobDetailRow}>
          <Text style={styles.jobDetailIcon}>
            <Feather name="map-pin" size={18} color={tabColor} />
          </Text>
          <Text style={styles.jobDetailText}>{item.client}</Text>
        </View>
        <View style={styles.jobDetailRow}>
          <Text style={styles.jobDetailIcon}>
            {' '}
            <Ionicons name="timer-outline" size={18} color={tabColor} />
          </Text>
          <Text style={styles.jobDetailText}>{item.duration}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar backgroundColor="#155DFC" barStyle="light-content" /> */}

      <ScrollView style={{}} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <LinearGradient
          colors={['#155DFC', '#1447E6', '#432DD7']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.header}>
          <View style={[styles.headerCircle, styles.topRightCircle]} />
          <View style={[styles.headerCircle, styles.bottomLeftCircle]} />
          {/* <View style={styles.header}> */}
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Good afternoon, Sarah!</Text>
              <View style={styles.roleContainer}>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>Lead Labor</Text>
                </View>
                <Text style={styles.dateText}>• Tuesday, Jul 29</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>SJ</Text>
                <View style={styles.onlineIndicator} />
              </View>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => navigation.navigate('NotificationScreen')}>
                <MaterialIcons
                  name="notifications-none"
                  size={24}
                  color={whiteColor}
                />
                {/* <Text style={styles.notificationIcon}>🔔</Text> */}
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              {statsData.slice(0, 2).map(renderStatsCard)}
            </View>
            <View style={styles.statsRow}>
              {statsData.slice(2, 4).map(renderStatsCard)}
            </View>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Stats Cards */}
          {/* <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            {statsData.slice(0, 2).map(renderStatsCard)}
          </View>
          <View style={styles.statsRow}>
            {statsData.slice(2, 4).map(renderStatsCard)}
          </View>
        </View> */}

          {/* Quick Actions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
              <View style={styles.accessBadge}>
                <Text style={styles.accessText}>Lead Access</Text>
              </View>
            </View>
            <View style={styles.quickActionsGrid}>
              {quickActions?.map(renderQuickAction)}
            </View>
          </View>

          {/* Today's Jobs */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                <AntDesign name="calendar" size={18} color={tabColor} /> Today's
                Jobs
              </Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>2</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('JobStack')}>
                <Text style={styles.viewAllText}>View All →</Text>
              </TouchableOpacity>
            </View>
            {todaysJobs?.map(renderJobCard)}
          </View>

          {/* Upcoming Jobs */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                <Feather name="clock" size={20} color={tabColor} /> Upcoming
                Jobs
              </Text>
              <View style={[styles.countBadge, {backgroundColor: '#F0FDF4'}]}>
                <Text style={[styles.countText, {color: '#008236'}]}>1</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All →</Text>
              </TouchableOpacity>
            </View>
            {upcomingJobs.map(renderUpcomingJob)}
          </View>

          {/* Team Performance */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                <Entypo name="users" size={24} color={tabColor} /> Team
                Performance Overview
              </Text>
              <View style={styles.dashboardBadge}>
                <Text style={styles.dashboardText}>Lead Dashboard</Text>
              </View>
            </View>
            <View style={styles.performanceCards}>
              <View
                style={[styles.performanceCard, {backgroundColor: '#F0FDF4'}]}>
                <View style={styles.performanceIcon}>
                  <Text>✅</Text>
                </View>
                <Text style={styles.performanceLabel}>Jobs Completed</Text>
                <Text style={[styles.performanceValue, {color: '#0D542B'}]}>
                  18
                </Text>
                <Text style={[styles.performanceTrend, {color: '#00A63E'}]}>
                  ↗ This week
                </Text>
              </View>
              <View
                style={[styles.performanceCard, {backgroundColor: '#EFF6FF'}]}>
                <View style={styles.performanceIcon}>
                  <Text>
                    {' '}
                    <Entypo name="users" size={24} color={tabColor} />
                  </Text>
                </View>
                <Text style={styles.performanceLabel}>Active Technicians</Text>
                <Text style={[styles.performanceValue, {color: '#1C398E'}]}>
                  6
                </Text>
                <Text style={[styles.performanceTrend, {color: '#155DFC'}]}>
                  — Currently working
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    marginBottom: 100,
  },
  header: {
    // backgroundColor: '#432DD7',
    // paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  headerCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 1000,
  },
  topRightCircle: {
    width: 256,
    height: 256,
    top: -165,
    right: -128,
  },
  bottomLeftCircle: {
    width: 192,
    height: 192,
    bottom: -80,
    left: -96,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  dateText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00C950',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationIcon: {
    fontSize: 16,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 3,
    backgroundColor: '#FB2C36',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    marginVertical: 24,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 10,
  },
  statsCard: {
    flex: 1,
    backgroundColor: 'rgba(232, 236, 246, 0.4)',
    borderRadius: 16,
    padding: 16,
    // marginRight: 8,
    backdropFilter: 'blur(10px)',
  },
  statsIconContainer: {
    marginBottom: 8,
  },
  statsIcon: {
    fontSize: 16,
  },
  statsContent: {
    gap: 4,
  },
  statsTitle: {
    fontSize: 11,
    color: '#fff',
  },
  statsValue: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsSubtitle: {
    fontSize: 14,
    color: '#fff',
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#101828',
    flex: 1,
  },
  accessBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BEDBFF',
  },
  accessText: {
    color: tabColor,
    fontSize: 9,
    fontWeight: '500',
  },
  countBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BEDBFF',
    marginRight: 8,
  },
  countText: {
    color: '#1447E6',
    fontSize: 10,
    fontWeight: '500',
  },
  viewAllText: {
    color: '#155DFC',
    fontSize: 12,
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    width: '48%',
    // backgroundColor: '#155DFC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionIconText: {
    fontSize: 16,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  jobCard: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  jobHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  jobId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#101828',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  jobTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#101828',
    marginBottom: 4,
  },
  jobDescription: {
    fontSize: 12,
    color: '#4A5565',
    marginBottom: 12,
    lineHeight: 16,
  },
  jobDetails: {
    gap: 8,
  },
  jobDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  jobDetailIcon: {
    fontSize: 12,
  },
  jobDetailText: {
    fontSize: 12,
    color: '#4A5565',
  },
  upcomingJobCard: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  upcomingJobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  upcomingJobLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  upcomingJobId: {
    fontSize: 13,
    fontWeight: '500',
    color: '#101828',
  },
  dateBadge: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  upcomingJobTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#101828',
    marginBottom: 8,
  },
  upcomingJobDetails: {
    flexDirection: 'row',
    gap: 16,
    fontSize: 12,
  },
  dashboardBadge: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E9D4FF',
  },
  dashboardText: {
    color: '#8200DB',
    fontSize: 10,
    fontWeight: '500',
  },
  performanceCards: {
    flexDirection: 'row',
    gap: 12,
  },
  performanceCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  performanceIcon: {
    backgroundColor: '#FFFFFF',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  performanceLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 16,
  },
  performanceValue: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  performanceTrend: {
    fontSize: 12,
    fontWeight: '400',
  },
});

export default HomeScreen;
