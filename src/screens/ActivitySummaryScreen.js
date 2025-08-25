// import React, {useState, useMemo} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   StatusBar,
//   SafeAreaView,
//   Dimensions,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Feather from 'react-native-vector-icons/Feather';

// import {tabColor} from '../constants/Color';

// const {width} = Dimensions.get('window');

// const ActivitySummaryScreen = ({navigation, route}) => {
//   const Colors = {
//     primary: '#3B82F6',
//     primaryLight: '#EBF4FF',
//     white: '#FFFFFF',
//     backgroundLight: '#F8FAFC',
//     text: '#1E293B',
//     textSecondary: '#64748B',
//     textLight: '#94A3B8',
//     border: '#E2E8F0',
//     success: '#10B981',
//     successLight: '#D1FAE5',
//     warning: '#F59E0B',
//     warningLight: '#FEF3C7',
//     error: '#EF4444',
//   };
//   const [filterPeriod, setFilterPeriod] = useState('month');

//   // Safe navigation handler
//   const handleNavigation = screen => {
//     try {
//       if (navigation && typeof navigation.navigate === 'function') {
//         navigation.navigate(screen);
//       } else {
//         console.warn('Navigation function not available');
//       }
//     } catch (error) {
//       console.error('Navigation error:', error);
//     }
//   };

//   // Mock job activity data - exactly matching web version
//   const [jobActivities] = useState([
//     {
//       id: '1',
//       jobId: 'JDP-2024-001',
//       title: 'Electrical Panel Upgrade',
//       customer: 'ABC Manufacturing',
//       date: '2025-08-14',
//       actualTimeSpent: 8.5,
//       updatedTimeSpent: 8.0,
//       assignedTo: ['Mike Wilson', 'David Chen'],
//       status: 'completed',
//       createdAt: '2024-01-15T08:00:00Z',
//       timeLogs: [
//         {
//           id: 'tl1',
//           personName: 'Mike Wilson',
//           personRole: 'Labor',
//           actualTime: 4.5,
//           updatedTime: 4.0,
//           date: '2024-01-15',
//           startTime: '08:00 AM',
//           endTime: '12:30 PM',
//         },
//         {
//           id: 'tl2',
//           personName: 'David Chen',
//           personRole: 'Labor',
//           actualTime: 4.0,
//           date: '2024-01-15',
//           startTime: '12:30 PM',
//           endTime: '04:30 PM',
//         },
//       ],
//     },
//     {
//       id: '2',
//       jobId: 'JDP-2024-002',
//       title: 'Outlet Installation Project',
//       customer: 'XYZ Office Complex',
//       date: '2024-01-16',
//       actualTimeSpent: 3.0,
//       assignedTo: ['Lisa Rodriguez'],
//       status: 'in-progress',
//       createdAt: '2024-01-16T09:00:00Z',
//       timeLogs: [
//         {
//           id: 'tl3',
//           personName: 'Lisa Rodriguez',
//           personRole: 'Labor',
//           actualTime: 3.0,
//           date: '2024-01-16',
//           startTime: '09:00 AM',
//           endTime: '12:00 PM',
//         },
//       ],
//     },
//     {
//       id: '3',
//       jobId: 'JDP-2024-003',
//       title: 'LED Lighting Installation',
//       customer: 'GHI Retail Store',
//       date: '2024-01-12',
//       actualTimeSpent: 3.0,
//       assignedTo: ['Tom Anderson'],
//       status: 'completed',
//       createdAt: '2024-01-12T10:00:00Z',
//       timeLogs: [
//         {
//           id: 'tl4',
//           personName: 'Tom Anderson',
//           personRole: 'Labor',
//           actualTime: 3.0,
//           date: '2024-01-12',
//           startTime: '10:00 AM',
//           endTime: '01:00 PM',
//         },
//       ],
//     },
//     {
//       id: '4',
//       jobId: 'JDP-2024-004',
//       title: 'Emergency Repair Service',
//       customer: 'DEF Hospital',
//       date: '2024-01-14',
//       actualTimeSpent: 6.0,
//       updatedTimeSpent: 5.5,
//       assignedTo: ['Sarah Johnson'],
//       status: 'completed',
//       createdAt: '2024-01-14T07:00:00Z',
//       timeLogs: [
//         {
//           id: 'tl5',
//           personName: 'Sarah Johnson',
//           personRole: 'Lead Labor',
//           actualTime: 6.0,
//           updatedTime: 5.5,
//           date: '2024-01-14',
//           startTime: '07:00 AM',
//           endTime: '01:00 PM',
//         },
//       ],
//     },
//     {
//       id: '5',
//       jobId: 'JDP-2024-005',
//       title: 'Wiring Installation',
//       customer: 'JKL Data Center',
//       date: '2024-01-18',
//       actualTimeSpent: 4.5,
//       assignedTo: ['Mike Wilson', 'David Chen'],
//       status: 'in-progress',
//       createdAt: '2024-01-18T06:00:00Z',
//       timeLogs: [
//         {
//           id: 'tl6',
//           personName: 'Mike Wilson',
//           personRole: 'Labor',
//           actualTime: 2.5,
//           date: '2024-01-18',
//           startTime: '06:00 AM',
//           endTime: '08:30 AM',
//         },
//         {
//           id: 'tl7',
//           personName: 'David Chen',
//           personRole: 'Labor',
//           actualTime: 2.0,
//           date: '2024-01-18',
//           startTime: '08:30 AM',
//           endTime: '10:30 AM',
//         },
//       ],
//     },
//   ]);

//   // Debug: Log the data
//   console.log('🔍 Debug: jobActivities length:', jobActivities.length);
//   console.log('🔍 Debug: jobActivities:', jobActivities);

//   // Filter jobs based on selected period - exact match with web version
//   const filteredJobs = useMemo(() => {
//     console.log('🔍 Debug: Filtering jobs for period:', filterPeriod);

//     if (!jobActivities || !Array.isArray(jobActivities)) {
//       console.warn('jobActivities is not a valid array:', jobActivities);
//       return [];
//     }

//     try {
//       const now = new Date();
//       const cutoffDate = new Date();

//       switch (filterPeriod) {
//         case 'today':
//           cutoffDate.setDate(now.getDate() - 7);
//           break;
//         case 'week':
//           cutoffDate.setDate(now.getDate() - 7);
//           break;
//         case 'month':
//           cutoffDate.setMonth(now.getMonth() - 1);
//           break;
//         case 'year':
//           cutoffDate.setFullYear(now.getFullYear() - 1);
//           break;
//         default:
//           cutoffDate.setMonth(now.getMonth() - 1);
//       }

//       console.log('🔍 Debug: cutoffDate:', cutoffDate);

//       // Temporarily return all jobs for debugging
//       const filtered = jobActivities.filter(job => {
//         if (!job || !job.createdAt) {
//           console.warn('Invalid job data:', job);
//           return false;
//         }

//         try {
//           const jobDate = new Date(job.createdAt);
//           const isInRange = jobDate >= cutoffDate;
//           console.log(
//             '🔍 Debug: Job',
//             job.jobId,
//             'date:',
//             jobDate,
//             'in range:',
//             isInRange,
//           );
//           // Temporarily return all jobs to see if data shows up
//           return true; // Changed from isInRange to true
//         } catch (error) {
//           console.warn('Invalid date format for job:', job.createdAt);
//           return false;
//         }
//       });

//       console.log('🔍 Debug: filtered jobs count:', filtered.length);
//       return filtered;
//     } catch (error) {
//       console.error('Error filtering jobs:', error);
//       return [];
//     }
//   }, [jobActivities, filterPeriod]);

//   // Calculate summary statistics - exact match with web version
//   const summaryStats = useMemo(() => {
//     if (!filteredJobs || !Array.isArray(filteredJobs)) {
//       return {
//         totalCompleted: 0,
//         totalTimeSpent: 0,
//         totalJobs: 0,
//       };
//     }

//     try {
//       const completedJobs = filteredJobs.filter(
//         job => job && job.status === 'completed',
//       );

//       const totalCompleted = completedJobs.length;
//       const totalTimeSpent = completedJobs.reduce((sum, job) => {
//         if (!job) return sum;
//         const timeSpent = job.updatedTimeSpent || job.actualTimeSpent || 0;
//         return sum + timeSpent;
//       }, 0);

//       return {
//         totalCompleted,
//         totalTimeSpent: Math.round(totalTimeSpent * 10) / 10,
//         totalJobs: filteredJobs.length,
//       };
//     } catch (error) {
//       console.error('Error calculating summary stats:', error);
//       return {
//         totalCompleted: 0,
//         totalTimeSpent: 0,
//         totalJobs: 0,
//       };
//     }
//   }, [filteredJobs]);

//   // Helper functions - exact match with web version
//   const getStatusColor = status => {
//     switch (status) {
//       case 'completed':
//         return '#10B981';
//       case 'in-progress':
//         return '#3B82F6';
//       case 'pending':
//         return '#EAB308';
//       default:
//         return '#6B7280';
//     }
//   };

//   const formatDate = dateString => {
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric',
//       });
//     } catch (error) {
//       console.warn('Invalid date format:', dateString);
//       return 'Invalid Date';
//     }
//   };

//   // Debug: Log what we're about to render
//   console.log('🔍 Debug: About to render - filteredJobs:', filteredJobs);
//   console.log('🔍 Debug: About to render - summaryStats:', summaryStats);

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

//       {/* Header - exact match with web version */}
//       <View style={styles.header}>
//         {/* <TouchableOpacity onPress={() => handleNavigation('HomeScreen')}>
//           <Text style={styles.backButton}></Text>
//         </TouchableOpacity> */}

//         <View style={styles.headerContent}>
//           <Text style={styles.headerTitle}>Activity Summary</Text>
//           <Text style={styles.headerSubtitle}>
//             {filteredJobs && Array.isArray(filteredJobs)
//               ? filteredJobs.length
//               : 0}{' '}
//             jobs • {filterPeriod}
//           </Text>
//         </View>

//         {/* <View style={styles.headerSpacer} /> */}
//       </View>

//       <ScrollView
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}>
//         {/* Filter Tabs - exact match with web version */}
//         <View style={styles.filterContainer}>
//           {['today', 'week', 'month', 'year'].map(period => (
//             <TouchableOpacity
//               key={period}
//               style={[
//                 styles.filterTab,
//                 filterPeriod === period && styles.filterTabActive,
//               ]}
//               onPress={() => setFilterPeriod(period)}>
//               <Text
//                 style={[
//                   styles.filterTabText,
//                   filterPeriod === period && styles.filterTabTextActive,
//                 ]}>
//                 {period.charAt(0).toUpperCase() + period.slice(1)}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <View style={styles.content}>
//           {/* Summary Stats - exact match with web version */}
//           <View style={styles.summaryGrid}>
//             <View style={styles.summaryCard}>
//               <View style={styles.summaryCardContent}>
//                 <View style={styles.summaryIconContainer}>
//                   <View
//                     style={[styles.summaryIcon, {backgroundColor: '#DCFCE7'}]}>
//                     <Icon
//                       name="check-circle"
//                       size={24}
//                       color={Colors.success}
//                     />
//                   </View>
//                   <View>
//                     <Text style={styles.summaryValue}>
//                       {summaryStats.totalCompleted}
//                     </Text>
//                     <Text style={styles.summaryLabel}>Jobs Completed</Text>
//                   </View>
//                 </View>
//               </View>
//             </View>

//             <View style={styles.summaryCard}>
//               <View style={styles.summaryCardContent}>
//                 <View style={styles.summaryIconContainer}>
//                   <View
//                     style={[styles.summaryIcon, {backgroundColor: '#DBEAFE'}]}>
//                     {/* <Text style={styles.summaryIconText}>⏰</Text> */}
//                     <Icon name="schedule" size={24} color={Colors.primary} />
//                   </View>
//                   <View>
//                     <Text style={styles.summaryValue}>
//                       {summaryStats.totalTimeSpent}h
//                     </Text>
//                     <Text style={styles.summaryLabel}>Total Time Spent</Text>
//                   </View>
//                 </View>
//               </View>
//             </View>
//           </View>

//           {/* Job Activities List - exact match with web version */}
//           <View style={styles.activitiesSection}>
//             <View style={styles.activitiesHeader}>
//               <Text style={styles.activitiesTitle}>Job Activities</Text>
//               <Text style={styles.activitiesCount}>
//                 {filteredJobs && Array.isArray(filteredJobs)
//                   ? filteredJobs.length
//                   : 0}{' '}
//                 jobs
//               </Text>
//             </View>

//             {!filteredJobs ||
//             !Array.isArray(filteredJobs) ||
//             filteredJobs.length === 0 ? (
//               <View style={styles.emptyState}>
//                 <Text style={styles.emptyStateIcon}>⚠️</Text>
//                 <Text style={styles.emptyStateTitle}>No activities found</Text>
//                 <Text style={styles.emptyStateText}>
//                   No job activities in the selected {filterPeriod} period.
//                 </Text>
//               </View>
//             ) : (
//               <View style={styles.jobsList}>
//                 {filteredJobs && Array.isArray(filteredJobs)
//                   ? filteredJobs.map(job => {
//                       // Exact null checking logic from web version
//                       if (!job || typeof job !== 'object') {
//                         console.warn('Invalid job object:', job);
//                         return null;
//                       }

//                       const jobId = job.jobId || job.id || 'Unknown ID';
//                       const jobTitle = job.title || 'Untitled Job';
//                       const jobCustomer = job.customer || 'Unknown Customer';
//                       const jobStatus = job.status || 'pending';
//                       const actualTime =
//                         typeof job.actualTimeSpent === 'number'
//                           ? job.actualTimeSpent
//                           : 0;
//                       const updatedTime =
//                         typeof job.updatedTimeSpent === 'number'
//                           ? job.updatedTimeSpent
//                           : null;

//                       const hasTimeModification =
//                         updatedTime !== null && updatedTime !== actualTime;
//                       const timeDifference = hasTimeModification
//                         ? actualTime - updatedTime
//                         : 0;

//                       return (
//                         <View
//                           key={job.id || `job-${Math.random()}`}
//                           style={styles.jobCard}>
//                           {/* Job Header */}
//                           <View style={styles.jobHeader}>
//                             <View style={styles.jobBadges}>
//                               <Text style={styles.jobId}>{jobId}</Text>
//                               <View
//                                 style={[
//                                   styles.statusBadge,
//                                   {backgroundColor: getStatusColor(jobStatus)},
//                                 ]}>
//                                 <Text style={styles.statusBadgeText}>
//                                   {jobStatus.toUpperCase()}
//                                 </Text>
//                               </View>
//                             </View>
//                             <View
//                               style={{
//                                 display: 'flex',
//                                 flexDirection: 'row',
//                                 justifyContent: 'space-between',
//                               }}>
//                               <Text style={styles.jobTitle}>{jobTitle}</Text>
//                               {/* Date */}
//                               <View style={styles.jobDateRow}>
//                                 <AntDesign
//                                   name="calendar"
//                                   size={18}
//                                   color={tabColor}
//                                 />
//                                 <Text
//                                   style={[
//                                     styles.jobDateText,
//                                     {color: '#000', fontWeight: '600'},
//                                   ]}>
//                                   {formatDate(job.date || job.createdAt || '')}
//                                 </Text>
//                               </View>
//                             </View>
//                             <Text style={styles.jobCustomer}>
//                               {jobCustomer}
//                             </Text>
//                           </View>

//                           {/* Time Section */}
//                           <View style={styles.timeSection}>
//                             <View style={styles.timeRow}>
//                               <Text style={styles.timeLabel}>Actual Time:</Text>
//                               <Text style={styles.timeValue}>
//                                 {actualTime}h
//                               </Text>
//                             </View>

//                             {hasTimeModification && (
//                               <>
//                                 <View style={styles.timeRow}>
//                                   <Text style={styles.timeLabel}>
//                                     Updated Time:
//                                   </Text>
//                                   <Text style={styles.timeValue}>
//                                     {updatedTime}h
//                                   </Text>
//                                 </View>
//                                 <View style={styles.timeModificationContainer}>
//                                   <View
//                                     style={[
//                                       styles.timeModificationBadge,
//                                       {
//                                         backgroundColor:
//                                           timeDifference > 0
//                                             ? '#FEE2E2'
//                                             : '#D1FAE5',
//                                       },
//                                     ]}>
//                                     <Text
//                                       style={[
//                                         styles.timeModificationText,
//                                         {
//                                           color:
//                                             timeDifference > 0
//                                               ? '#DC2626'
//                                               : '#059669',
//                                         },
//                                       ]}>
//                                       {timeDifference > 0 ? '-' : '+'}
//                                       {Math.abs(timeDifference)}h Modified
//                                     </Text>
//                                   </View>
//                                 </View>
//                               </>
//                             )}
//                           </View>

//                           {/* Assigned To */}
//                           <View style={styles.assignedToRow}>
//                             <Feather name="users" size={18} color={tabColor} />
//                             {/* <Text style={styles.assignedToIcon}>👥</Text> */}
//                             <Text style={styles.assignedToText}>
//                               Assigned to:{' '}
//                               {job.assignedTo &&
//                               Array.isArray(job.assignedTo) &&
//                               job.assignedTo.length > 0
//                                 ? job.assignedTo.join(', ')
//                                 : 'Not assigned'}
//                             </Text>
//                           </View>
//                         </View>
//                       );
//                     })
//                   : []}
//               </View>
//             )}
//           </View>

//           <View style={styles.bottomSpacer} />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//     marginBottom: 100,
//   },
//   header: {
//     backgroundColor: '#3B82F6',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     paddingTop: 20,
//   },
//   backButton: {
//     fontSize: 24,
//     color: '#FFFFFF',
//     fontWeight: '600',
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
//   headerSpacer: {
//     width: 40,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   filterTab: {
//     flex: 1,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     marginHorizontal: 2,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     backgroundColor: '#FFFFFF',
//     alignItems: 'center',
//   },
//   filterTabActive: {
//     backgroundColor: '#3B82F6',
//     borderColor: '#3B82F6',
//   },
//   filterTabText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#6B7280',
//   },
//   filterTabTextActive: {
//     color: '#FFFFFF',
//   },
//   content: {
//     padding: 16,
//   },
//   summaryGrid: {
//     flexDirection: 'row',
//     gap: 16,
//     marginBottom: 24,
//   },
//   summaryCard: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   summaryCardContent: {
//     padding: 16,
//   },
//   summaryIconContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   summaryIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   summaryIconText: {
//     fontSize: 20,
//   },
//   summaryValue: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   summaryLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   activitiesSection: {
//     gap: 16,
//   },
//   activitiesHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   activitiesTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   activitiesCount: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   emptyState: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 32,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   emptyStateIcon: {
//     fontSize: 48,
//     marginBottom: 16,
//   },
//   emptyStateTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1F2937',
//     marginBottom: 8,
//   },
//   emptyStateText: {
//     fontSize: 14,
//     color: '#6B7280',
//     textAlign: 'center',
//   },
//   jobsList: {
//     gap: 16,
//   },
//   jobCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   jobHeader: {
//     marginBottom: 12,
//   },
//   jobBadges: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 8,
//   },
//   jobId: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#3B82F6',
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   statusBadgeText: {
//     fontSize: 10,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
//   jobTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   jobCustomer: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   jobDateRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 12,
//   },
//   jobDateIcon: {
//     fontSize: 16,
//   },
//   jobDateText: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   timeSection: {
//     backgroundColor: '#F9FAFB',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//   },
//   timeRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   timeLabel: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   timeValue: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   timeModificationContainer: {
//     alignItems: 'flex-end',
//   },
//   timeModificationBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   timeModificationText: {
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   assignedToRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   assignedToIcon: {
//     fontSize: 16,
//   },
//   assignedToText: {
//     fontSize: 14,
//     color: '#6B7280',
//     flex: 1,
//   },
//   bottomSpacer: {
//     height: 24,
//   },
// });

// export default ActivitySummaryScreen;

import React, {useState, useMemo, useRef} from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {heightPercentageToDP} from '../utils';
import DateTimePicker from '@react-native-community/datetimepicker';
// import { LineChart, BarChart } from 'react-native-chart-kit';

const {width, height} = Dimensions.get('window');

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const ActivitySummaryScreen = ({navigation, route}) => {
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState(null);

  // Animation refs
  const bottomSheetAnim = useRef(new Animated.Value(height)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  // Enhanced mock data for hourly reports
  const [hourlyReports] = useState([
    {
      id: '1',
      jobId: 'JDP-2024-001',
      jobTitle: 'Electrical Panel Upgrade',
      customer: 'ABC Manufacturing',
      date: '2025-08-18',
      actualHours: 8.5,
      updatedHours: 8.0,
      location: '1234 Industrial Blvd, Houston, TX',
      payRate: 45.0,
      scheduledTime: '08:00 AM - 04:30 PM',
      assignedTo: ['Mike Wilson', 'David Chen'],
      status: 'completed',
      createdAt: '2024-01-15T08:00:00Z',
    },
    {
      id: '2',
      jobId: 'JDP-2024-002',
      jobTitle: 'Residential Rewiring',
      customer: 'Johnson Family',
      date: '2025-08-21',
      actualHours: 6.5,
      location: '5678 Oak Street, Houston, TX',
      payRate: 42.0,
      scheduledTime: '09:00 AM - 04:00 PM',
      assignedTo: ['Lisa Rodriguez'],
      status: 'completed',
      createdAt: '2024-01-12T09:15:00Z',
    },
    {
      id: '3',
      jobId: 'JDP-2024-003',
      jobTitle: 'LED Installation Project',
      customer: 'TechCorp Office',
      date: '2024-01-14',
      actualHours: 12.0,
      updatedHours: 11.5,
      location: '9012 Business Park Dr, Houston, TX',
      payRate: 48.0,
      scheduledTime: '08:00 AM - 08:00 PM',
      assignedTo: ['Tom Anderson', 'James Mitchell'],
      status: 'completed',
      createdAt: '2024-01-14T11:20:00Z',
    },
    {
      id: '4',
      jobId: 'JDP-2024-004',
      jobTitle: 'Emergency Repair',
      customer: 'Metro Hospital',
      date: '2024-01-17',
      actualHours: 8.5,
      location: '3456 Medical Center Dr, Houston, TX',
      payRate: 55.0,
      scheduledTime: '08:00 PM - 04:30 AM',
      assignedTo: ['Sarah Johnson'],
      status: 'completed',
      createdAt: '2024-01-17T20:30:00Z',
    },
    {
      id: '5',
      jobId: 'JDP-2024-005',
      jobTitle: 'Industrial Wiring',
      customer: 'Manufacturing Delta',
      date: '2024-01-18',
      actualHours: 16.0,
      location: '7890 Industrial Way, Houston, TX',
      payRate: 50.0,
      scheduledTime: '06:00 AM - 10:00 PM',
      assignedTo: ['Mike Wilson', 'David Chen', 'Lisa Rodriguez'],
      status: 'completed',
      createdAt: '2024-01-18T06:00:00Z',
    },
    {
      id: '6',
      jobId: 'JDP-2024-006',
      jobTitle: 'Office Outlet Installation',
      customer: 'Downtown Complex',
      date: '2024-02-16',
      actualHours: 4.5,
      location: '2468 Downtown Ave, Houston, TX',
      payRate: 40.0,
      scheduledTime: '09:00 AM - 01:30 PM',
      assignedTo: ['Tom Anderson'],
      status: 'completed',
      createdAt: '2024-01-16T09:00:00Z',
    },
    {
      id: '7',
      jobId: 'JDP-2024-007',
      jobTitle: 'Safety Inspection',
      customer: 'City School District',
      date: '2024-02-19',
      actualHours: 3.5,
      location: '1357 School Rd, Houston, TX',
      payRate: 38.0,
      scheduledTime: '10:00 AM - 01:30 PM',
      assignedTo: ['Sarah Johnson'],
      status: 'completed',
      createdAt: '2024-02-19T10:00:00Z',
    },
    {
      id: '8',
      jobId: 'JDP-2024-008',
      jobTitle: 'Smart Home Setup',
      customer: 'Premium Residence',
      date: '2024-02-20',
      actualHours: 7.0,
      updatedHours: 6.5,
      location: '9753 Luxury Lane, Houston, TX',
      payRate: 52.0,
      scheduledTime: '08:00 AM - 03:00 PM',
      assignedTo: ['James Mitchell', 'Lisa Rodriguez'],
      status: 'completed',
      createdAt: '2024-02-20T08:00:00Z',
    },
  ]);
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [fromDate, setFromDate] = useState(startOfMonth);
  const [toDate, setToDate] = useState(today);

  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  // Filter data based on date range and period
  const filteredReports = useMemo(() => {
    if (!filterPeriod) {
      // From – To filter
      return hourlyReports.filter(report => {
        const reportDate = new Date(report.date); // ✅ use "date" field
        const from = new Date(fromDate);
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        return reportDate >= from && reportDate <= to;
      });
    }

    if (filterPeriod === 'all') {
      return hourlyReports;
    }

    if (filterPeriod === 'month') {
      return hourlyReports.filter(report => {
        const d = new Date(report.date); // ✅
        return (
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear()
        );
      });
    }

    if (filterPeriod === 'year') {
      return hourlyReports.filter(report => {
        const d = new Date(report.date); // ✅
        return d.getFullYear() === today.getFullYear();
      });
    }

    if (filterPeriod === 'week') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      return hourlyReports.filter(report => {
        const d = new Date(report.date); // ✅
        return d >= startOfWeek && d <= endOfWeek;
      });
    }

    return hourlyReports;
  }, [hourlyReports, filterPeriod, fromDate, toDate]);

  // 🔹 Step 2: Group data for chart
  const generatePeriodData = (reports, period) => {
    const groupedData = {};

    reports.forEach(report => {
      const date = new Date(report.date); // ✅ use "date"
      let periodKey = '';

      switch (period) {
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          periodKey = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
          break;
        case 'month':
          periodKey = date.toLocaleDateString('en-US', {month: 'short'});
          break;
        case 'year':
          periodKey = date.getFullYear().toString();
          break;
        case 'all':
        case 'date':
          periodKey = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          break;
      }

      if (!groupedData[periodKey]) {
        groupedData[periodKey] = {hours: 0, jobs: 0};
      }

      groupedData[periodKey].hours += report.updatedHours || report.actualHours;
      groupedData[periodKey].jobs += 1;
    });

    const sortedKeys = Object.keys(groupedData).sort();
    return {
      labels: sortedKeys,
      hours: sortedKeys.map(
        key => Math.round(groupedData[key].hours * 10) / 10,
      ),
      jobs: sortedKeys.map(key => groupedData[key].jobs),
    };
  };

  // const chartData = useMemo(() => generatePeriodData(filteredReports, filterPeriod), [filteredReports, filterPeriod]);
  // Ab useMemo me safe hoga
  const chartData = useMemo(() => {
    const completedReports = filteredReports.filter(
      report => report.status === 'completed',
    );

    const totalHours = completedReports.reduce((sum, report) => {
      return sum + (report.updatedHours || report.actualHours);
    }, 0);

    const jobsCompleted = completedReports.length;

    const periodData = generatePeriodData(completedReports, filterPeriod);

    return {
      totalHours: Math.round(totalHours * 10) / 10,
      jobsCompleted,
      periodData,
    };
  }, [filteredReports, filterPeriod]);

  // Navigation handler
  const handleNavigation = screen => {
    try {
      if (navigation && typeof navigation.navigate === 'function') {
        navigation.navigate(screen);
      } else if (navigation && typeof navigation.goBack === 'function') {
        navigation.goBack();
      } else {
        console.warn('Navigation function not available');
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  // Bottom sheet animation handlers
  const showBottomSheet = () => {
    setShowFilterSheet(true);
    Animated.parallel([
      Animated.timing(bottomSheetAnim, {
        toValue: height * 0.4, // Show 60% of screen
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
      setFilterPeriod('');
      setShowFilterSheet(false);
    });
  };

  // Pan responder for swipe down to dismiss
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return (
        gestureState.dy > 0 &&
        Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
      );
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dy > 0) {
        bottomSheetAnim.setValue(height * 0.4 + gestureState.dy);
      }
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

  // Job card expansion handler
  const toggleJobExpansion = jobId => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  // Date formatting helpers
  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateForInput = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Chart configuration
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#3B82F6',
    },
  };

  // Render filter bottom sheet
  const renderFilterBottomSheet = () => (
    <Modal
      visible={showFilterSheet}
      transparent
      animationType="none"
      statusBarTranslucent>
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropAnim,
            },
          ]}>
          <TouchableOpacity
            style={styles.backdropTouch}
            activeOpacity={1}
            onPress={hideBottomSheet}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{translateY: bottomSheetAnim}],
            },
          ]}
          {...panResponder.panHandlers}>
          {/* Handle */}
          <View style={styles.sheetHandle} />

          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Filter Reports</Text>
            <TouchableOpacity onPress={hideBottomSheet}>
              <Icon name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.sheetContent}
            showsVerticalScrollIndicator={false}>
            {/* Date Range Section */}
            {/* <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Date Range</Text>
              <View style={styles.dateRangeContainer}>
                <View style={styles.dateInputContainer}>
                  <Text style={styles.dateLabel}>From</Text>
                  <TouchableOpacity style={styles.dateInput}>
                    <Icon name="calendar-today" size={16} color="#3B82F6" />
                    <Text style={styles.dateInputText}>{formatDateForInput(fromDate)}</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.dateArrow}>
                  <Icon name="arrow-forward" size={16} color="#9CA3AF" />
                </View>
                
                <View style={styles.dateInputContainer}>
                  <Text style={styles.dateLabel}>To</Text>
                  <TouchableOpacity style={styles.dateInput}>
                    <Icon name="calendar-today" size={16} color="#3B82F6" />
                    <Text style={styles.dateInputText}>{formatDateForInput(toDate)}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View> */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Date Range</Text>
              <View style={styles.dateRangeContainer}>
                {/* From Date */}
                <View style={styles.dateInputContainer}>
                  <Text style={styles.dateLabel}>From</Text>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => {
                      setShowFromPicker(true), setShowToPicker(false);
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

                {/* To Date */}
                <View style={styles.dateInputContainer}>
                  <Text style={styles.dateLabel}>To</Text>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => {
                      setShowToPicker(true), setShowFromPicker(false);
                    }}>
                    <Icon name="calendar-today" size={16} color="#3B82F6" />
                    <Text style={styles.dateInputText}>
                      {formatDateForInput(toDate)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* From Date Picker */}
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

              {/* To Date Picker */}
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

              {/* Apply Button */}
              <TouchableOpacity
                style={styles.applyButton}
                onPress={hideBottomSheet}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>

            {/* Period Filter Section */}
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
                      setFilterPeriod(option.key), setShowFilterSheet(false);
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

  // Render job card
  const renderJobCard = report => {
    const isExpanded = expandedJobId === report.id;
    const hasTimeUpdate =
      report.updatedHours && report.updatedHours !== report.actualHours;
    const finalHours = report.updatedHours || report.actualHours;

    return (
      <View key={report.id} style={styles.jobCard}>
        <TouchableOpacity
          style={styles.jobCardHeader}
          onPress={() => toggleJobExpansion(report.id)}>
          <View style={styles.jobCardMain}>
            <View style={styles.jobCardInfo}>
              <Text style={styles.jobTitle}>{report.jobTitle}</Text>
              <Text style={styles.jobCustomer}>{report.customer}</Text>
              <Text style={styles.jobDate}>{formatDate(report.date)}</Text>
            </View>
            <View style={styles.jobCardRight}>
              <View style={styles.hoursContainer}>
                <Text style={styles.hoursText}>{finalHours}h</Text>
                {hasTimeUpdate && (
                  <View style={styles.updatedBadge}>
                    <Text style={styles.updatedBadgeText}>Updated</Text>
                  </View>
                )}
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
            {/* Location */}
            <View style={styles.expandedItem}>
              <Icon name="location-on" size={16} color="#6B7280" />
              <Text style={styles.expandedLabel}>Location:</Text>
              <Text style={styles.expandedValue}>{report.location}</Text>
            </View>

            {/* Pay Rate */}
            {/* <View style={styles.expandedItem}>
              <Icon name="attach-money" size={16} color="#6B7280" />
              <Text style={styles.expandedLabel}>Pay Rate:</Text>
              <Text style={styles.expandedValue}>
                ${report.payRate.toFixed(2)}/hour
              </Text>
            </View> */}

            {/* Scheduled Time */}
            <View style={styles.expandedItem}>
              <Icon name="schedule" size={16} color="#6B7280" />
              <Text style={styles.expandedLabel}>Scheduled:</Text>
              <Text style={styles.expandedValue}>{report.scheduledTime}</Text>
            </View>

            {/* Time Details */}
            {hasTimeUpdate && (
              <View style={styles.timeDetailsContainer}>
                <View style={styles.timeDetail}>
                  <Text style={styles.timeDetailLabel}>Original Time:</Text>
                  <Text style={styles.timeDetailValue}>
                    {report.actualHours}h
                  </Text>
                </View>
                <View style={styles.timeDetail}>
                  <Text style={styles.timeDetailLabel}>Updated Time:</Text>
                  <Text style={[styles.timeDetailValue, styles.updatedTime]}>
                    {report.updatedHours}h
                  </Text>
                </View>
              </View>
            )}

            {/* Assigned To */}
            <View style={styles.expandedItem}>
              <Icon name="people" size={16} color="#6B7280" />
              <Text style={styles.expandedLabel}>Assigned:</Text>
              <Text style={styles.expandedValue}>
                {report.assignedTo.join(', ')}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Hourly Reports</Text>
          <Text style={styles.headerSubtitle}>
            {filteredReports.length} jobs • {formatDateForInput(fromDate)} -{' '}
            {formatDateForInput(toDate)}
          </Text>
        </View>

        <TouchableOpacity style={styles.filterButton} onPress={showBottomSheet}>
          <Icon name="filter-list" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Charts Section */}
        <View style={styles.chartsContainer}>
          {/* Summary Cards */}
          <View style={styles.summaryCards}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryCardIcon}>
                <Icon name="schedule" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.summaryCardValue}>
                {chartData.totalHours}h
              </Text>
              <Text style={styles.summaryCardLabel}>Total Hours</Text>
            </View>

            <View style={styles.summaryCard}>
              <View
                style={[styles.summaryCardIcon, {backgroundColor: '#DBEAFE'}]}>
                <Icon name="check-circle" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.summaryCardValue}>
                {chartData.jobsCompleted}
              </Text>
              <Text style={styles.summaryCardLabel}>Jobs Completed</Text>
            </View>
          </View>

          {/* Hours Chart */}
          {/* {chartData?.periodData?.labels.length > 0 && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Hours Trend</Text>
              <LineChart
                data={{
                  labels: chartData.periodData.labels,
                  datasets: [
                    {
                      data: chartData.periodData.hours,
                      strokeWidth: 3,
                    },
                  ],
                }}
                width={width - 32}
                height={200}
                chartConfig={chartConfig}
                style={styles.chart}
                bezier
              />
            </View>
          )} */}

          {/* Jobs Chart */}
          {/* {chartData.periodData.labels.length > 0 && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Jobs Completed</Text>
              <BarChart
                data={{
                  labels: chartData.periodData.labels,
                  datasets: [
                    {
                      data: chartData.periodData.jobs,
                    },
                  ],
                }}
                width={width - 32}
                height={200}
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                }}
                style={styles.chart}
              />
            </View>
          )} */}
        </View>

        {/* Job Listings */}
        <View style={styles.jobListingsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Job Details</Text>
            <View style={styles.jobCount}>
              <Text style={styles.jobCountText}>{filteredReports.length}</Text>
            </View>
          </View>

          {filteredReports.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="assignment" size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateTitle}>No reports found</Text>
              <Text style={styles.emptyStateText}>
                No hourly reports found in the selected date range.
              </Text>
            </View>
          ) : (
            <View style={styles.jobsList}>
              {filteredReports.map(renderJobCard)}
            </View>
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Filter Bottom Sheet */}
      {renderFilterBottomSheet()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
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
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#BFDBFE',
    marginTop: 2,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
  },
  chartsContainer: {
    padding: 16,
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
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
  summaryCardLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  jobListingsContainer: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  jobCount: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  jobCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
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
  jobsList: {
    gap: 12,
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
  jobCardHeader: {
    padding: 16,
  },
  jobCardMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobCardInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  jobCustomer: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  jobDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  jobCardRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  hoursContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  hoursText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
  },
  updatedBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  updatedBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#D97706',
  },
  jobCardExpanded: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    padding: 16,
    gap: 12,
  },
  expandedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expandedLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    width: 70,
  },
  expandedValue: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
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
  timeDetailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  timeDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  updatedTime: {
    color: '#3B82F6',
  },
  bottomSpacer: {
    height: 32,
  },
  // Bottom Sheet Styles
  modalContainer: {
    flex: 1,
    height: heightPercentageToDP(100),
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  backdropTouch: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 50,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: heightPercentageToDP(100),
    // minHeight: height * 0.6,
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
  sheetTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginVertical: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateInputContainer: {
    flex: 1,
    gap: 8,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
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
  dateInputText: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  dateArrow: {
    marginTop: 24,
  },
  periodOptions: {
    gap: 8,
  },
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
  periodOptionText: {
    fontSize: 16,
    color: '#6B7280',
    flex: 1,
  },
  periodOptionTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    marginVertical: 20,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ActivitySummaryScreen;
