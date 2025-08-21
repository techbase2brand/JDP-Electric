// import React, { useState, useMemo } from 'react';
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
// import { tabColor } from '../constants/Color';
// import Feather from 'react-native-vector-icons/Feather';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Entypo from 'react-native-vector-icons/Entypo';

// const { width } = Dimensions.get('window');


// const JobActivityLogScreen = ({ navigation, route }) => {
//   const { job } = route?.params || {};
//   const [selectedJob] = useState(job || null);

//   // Mock job activities data - exact match with web version
//   const [jobActivities] = useState([
//     {
//       id: '1',
//       jobId: selectedJob?.id || 'JDP-2024-001',
//       type: 'job_created',
//       title: 'Job Created',
//       description: 'New electrical panel upgrade job was created and assigned to the team.',
//       timestamp: '2024-01-10T08:00:00Z',
//       user: 'Sarah Johnson',
//       metadata: {
//         status: 'pending'
//       }
//     },
//     {
//       id: '2',
//       jobId: selectedJob?.id || 'JDP-2024-001',
//       type: 'job_started',
//       title: 'Job Started',
//       description: 'Work began on electrical panel upgrade with on-site arrival confirmation.',
//       timestamp: '2024-01-15T08:30:00Z',
//       user: 'Mike Wilson',
//       metadata: {
//         status: 'in-progress'
//       }
//     },
//     {
//       id: '3',
//       jobId: selectedJob?.id || 'JDP-2024-001',
//       type: 'labour_hours',
//       title: 'Labour Hours Logged',
//       description: 'Team logged 6.5 hours of work on electrical installations and safety checks.',
//       timestamp: '2024-01-15T15:00:00Z',
//       user: 'Mike Wilson',
//       metadata: {
//         hours: 6.5
//       }
//     },
//     {
//       id: '4',
//       jobId: selectedJob?.id || 'JDP-2024-001',
//       type: 'material_ordered',
//       title: 'Job Material Ordered',
//       description: 'Ordered electrical components and safety equipment from preferred supplier.',
//       timestamp: '2024-01-15T16:30:00Z',
//       user: 'David Chen',
//       metadata: {
//         materialCount: 12,
//         amount: 850.00
//       }
//     },
//     {
//       id: '5',
//       jobId: selectedJob?.id || 'JDP-2024-001',
//       type: 'labour_hours',
//       title: 'Labour Hours Logged',
//       description: 'Additional 4.2 hours logged for final installations and testing.',
//       timestamp: '2024-01-16T14:30:00Z',
//       user: 'Mike Wilson',
//       metadata: {
//         hours: 4.2
//       }
//     },
//     {
//       id: '6',
//       jobId: selectedJob?.id || 'JDP-2024-001',
//       type: 'timesheet_submitted',
//       title: 'Timesheet Submitted',
//       description: 'Daily timesheet submitted with 10.7 total hours and job completion details.',
//       timestamp: '2024-01-16T17:00:00Z',
//       user: 'Mike Wilson',
//       metadata: {
//         hours: 10.7
//       }
//     },
//     {
//       id: '7',
//       jobId: selectedJob?.id || 'JDP-2024-001',
//       type: 'job_completed',
//       title: 'Job Completed',
//       description: 'Electrical panel upgrade completed successfully with customer sign-off.',
//       timestamp: '2024-01-16T17:30:00Z',
//       user: 'Mike Wilson',
//       metadata: {
//         status: 'completed'
//       }
//     }
//   ]);

//   // Calculate summary statistics - exact match with web version
//   const summaryStats = useMemo(() => {
//     const totalHours = jobActivities
//       .filter(activity => activity.type === 'labour_hours')
//       .reduce((sum, activity) => sum + (activity.metadata?.hours || 0), 0);

//     const totalOrders = jobActivities
//       .filter(activity => activity.type === 'material_ordered')
//       .length;

//     const totalAmount = jobActivities
//       .filter(activity => activity.type === 'material_ordered')
//       .reduce((sum, activity) => sum + (activity.metadata?.amount || 0), 0);

//     const totalMaterials = jobActivities
//       .filter(activity => activity.type === 'material_ordered')
//       .reduce((sum, activity) => sum + (activity.metadata?.materialCount || 0), 0);

//     return {
//       totalHours: Math.round(totalHours * 10) / 10,
//       totalOrders,
//       totalAmount,
//       totalMaterials
//     };
//   }, [jobActivities]);

//   // Get activity icon and color - exact match with web version
//   const getActivityConfig = (type) => {
//     switch (type) {
//       case 'job_created':
//         return { 
//           icon: '🏢', 
//           color: '#3B82F6',
//           bgColor: '#EFF6FF',
//           borderColor: '#DBEAFE'
//         };
//       case 'job_started':
//         return { 
//           icon: '▶️', 
//           color: '#10B981',
//           bgColor: '#F0FDF4',
//           borderColor: '#BBF7D0'
//         };
//       case 'labour_hours':
//         return { 
//           icon: '⏱️', 
//           color: '#F59E0B',
//           bgColor: '#FFFBEB',
//           borderColor: '#FED7AA'
//         };
//       case 'timesheet_submitted':
//         return { 
//           icon: '📄', 
//           color: '#8B5CF6',
//           bgColor: '#F5F3FF',
//           borderColor: '#DDD6FE'
//         };
//       case 'material_ordered':
//         return { 
//           icon: '📦', 
//           color: '#6366F1',
//           bgColor: '#EEF2FF',
//           borderColor: '#C7D2FE'
//         };
//       case 'job_completed':
//         return { 
//           icon: '✅', 
//           color: '#059669',
//           bgColor: '#ECFDF5',
//           borderColor: '#A7F3D0'
//         };
//       default:
//         return { 
//           icon: '⚠️', 
//           color: '#6B7280',
//           bgColor: '#F9FAFB',
//           borderColor: '#E5E7EB'
//         };
//     }
//   };

//   // Format timestamp - exact match with web version
//   const formatTimestamp = (timestamp) => {
//     const date = new Date(timestamp);
//     return {
//       date: date.toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric'
//       }),
//       time: date.toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true
//       })
//     };
//   };

//   const handleNavigation = (screen) => {
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

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      
//       {/* Header - exact match with web version */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.backButton}>←</Text>
//         </TouchableOpacity>
        
//         <View style={styles.headerContent}>
//           <Text style={styles.headerTitle}>Job Activity Log</Text>
//           <Text style={styles.headerSubtitle}>
//             {selectedJob ? `#${selectedJob.id}` : 'Job Activities'}
//           </Text>
//         </View>
        
//         <View style={styles.headerSpacer} />
//       </View>

//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//         <View style={styles.content}>
//           {/* Summary Section - exact match with web version */}
//           <View style={styles.summaryCard}>
//             <View style={styles.summaryHeader}>
//                <Ionicons name="flash-outline" size={24} color={tabColor} />
//               <Text style={styles.summaryTitle}>Activity Summary</Text>
//             </View>
//             <View style={styles.summaryGrid}>
//               {/* Total Spent Hours */}
//               <View style={styles.summaryItem}>
//                 <View style={[styles.summaryItemIcon, { backgroundColor: '#FED7AA' }]}>
//                   <AntDesign name="clock-circle" size={20} color="#000" />
//                 </View>
//                 <Text style={styles.summaryItemValue}>
//                   {summaryStats.totalHours}h
//                 </Text>
//                 <Text style={styles.summaryItemLabel}>Total Spent Hours</Text>
//               </View>

//               {/* Total Number of Orders */}
//               <View style={styles.summaryItem}>
//                 <View style={[styles.summaryItemIcon, { backgroundColor: '#C7D2FE' }]}>
//                   <Text style={styles.summaryItemIconText}>📦</Text>
//                 </View>
//                 <Text style={styles.summaryItemValue}>
//                   {summaryStats.totalOrders}
//                 </Text>
//                 <Text style={styles.summaryItemLabel}>Total Number of Orders</Text>
//               </View>

//               {/* Material Costs */}
//               {/* <View style={styles.summaryItem}>
//                 <View style={[styles.summaryItemIcon, { backgroundColor: '#BBF7D0' }]}>
//                   <Text style={styles.summaryItemIconText}>💰</Text>
//                 </View>
//                 <Text style={styles.summaryItemValue}>
//                   ${summaryStats.totalAmount.toLocaleString()}
//                 </Text>
//                 <Text style={styles.summaryItemLabel}>Material Costs</Text>
//               </View> */}

//               {/* Materials Ordered */}
//               <View style={styles.summaryItem}>
//                 <View style={[styles.summaryItemIcon, { backgroundColor: '#DDD6FE' }]}>
//                   <Text style={styles.summaryItemIconText}>🔧</Text>
//                 </View>
//                 <Text style={styles.summaryItemValue}>
//                   {summaryStats.totalMaterials}
//                 </Text>
//                 <Text style={styles.summaryItemLabel}>Materials Ordered</Text>
//               </View>
//             </View>
//           </View>

//           {/* Activity Timeline - exact match with web version */}
//           <View style={styles.timelineCard}>
//             <View style={styles.timelineHeader}>
//               <Text style={styles.timelineIcon}>📄</Text>
//               <Text style={styles.timelineTitle}>Activity Timeline</Text>
//             </View>
            
//             <View style={styles.timelineContent}>
//               {jobActivities.length === 0 ? (
//                 <View style={styles.emptyState}>
//                   <Text style={styles.emptyStateIcon}>⚠️</Text>
//                   <Text style={styles.emptyStateTitle}>No activities found</Text>
//                   <Text style={styles.emptyStateText}>
//                     No job activities have been recorded yet.
//                   </Text>
//                 </View>
//               ) : (
//                 <View style={styles.timeline}>
//                   {/* Timeline line */}
//                   <View style={styles.timelineLine} />
                  
//                   {jobActivities.map((activity, index) => {
//                     const config = getActivityConfig(activity.type);
//                     const { date, time } = formatTimestamp(activity.timestamp);
                    
//                     return (
//                       <View key={activity.id} style={styles.timelineItem}>
//                         {/* Timeline dot */}
//                         <View style={[styles.timelineDot, { backgroundColor: config.color }]}>
//                           <Text style={styles.timelineDotIcon}>{config.icon}</Text>
//                         </View>
                        
//                         {/* Activity content */}
//                         <View style={[
//                           styles.activityContent,
//                           index === jobActivities.length - 1 ? {} : styles.activityContentBorder
//                         ]}>
//                           <View style={[
//                             styles.activityCard,
//                             { backgroundColor: config.bgColor, borderColor: config.borderColor }
//                           ]}>
//                             <View style={styles.activityHeader}>
//                               <Text style={styles.activityTitle}>
//                                 {activity.title}
//                               </Text>
//                               <View style={styles.activityTimestamp}>
//                                 <Text style={styles.activityDate}>{date}</Text>
//                                 <Text style={styles.activityTime}>{time}</Text>
//                               </View>
//                             </View>
                            
//                             <Text style={styles.activityDescription}>
//                               {activity.description}
//                             </Text>
                            
//                             {/* Activity metadata */}
//                             <View style={styles.activityFooter}>
//                               <View style={styles.activityUser}>
//                                 <Text style={styles.activityUserIcon}>👤</Text>
//                                 <Text style={styles.activityUserText}>{activity.user}</Text>
//                               </View>
                              
//                               {/* Metadata badges */}
//                               <View style={styles.metadataBadges}>
//                                 {activity.metadata?.hours && (
//                                   <View style={[styles.metadataBadge, { backgroundColor: '#FED7AA' }]}>
//                                     <Text style={[styles.metadataBadgeText, { color: '#C2410C' }]}>
//                                       {activity.metadata.hours}h
//                                     </Text>
//                                   </View>
//                                 )}
//                                 {activity.metadata?.materialCount && (
//                                   <View style={[styles.metadataBadge, { backgroundColor: '#C7D2FE' }]}>
//                                     <Text style={[styles.metadataBadgeText, { color: '#4338CA' }]}>
//                                       {activity.metadata.materialCount} items
//                                     </Text>
//                                   </View>
//                                 )}
//                                 {activity.metadata?.amount && (
//                                   <View style={[styles.metadataBadge, { backgroundColor: '#BBF7D0' }]}>
//                                     <Text style={[styles.metadataBadgeText, { color: '#059669' }]}>
//                                       ${activity.metadata.amount.toLocaleString()}
//                                     </Text>
//                                   </View>
//                                 )}
//                                 {activity.metadata?.status && (
//                                   <View style={[
//                                     styles.metadataBadge,
//                                     { 
//                                       backgroundColor: 
//                                         activity.metadata.status === 'completed' ? '#A7F3D0' :
//                                         activity.metadata.status === 'in-progress' ? '#DBEAFE' : '#E5E7EB'
//                                     }
//                                   ]}>
//                                     <Text style={[
//                                       styles.metadataBadgeText,
//                                       { 
//                                         color: 
//                                           activity.metadata.status === 'completed' ? '#059669' :
//                                           activity.metadata.status === 'in-progress' ? '#3B82F6' : '#6B7280'
//                                       }
//                                     ]}>
//                                       {activity.metadata.status.replace('-', ' ')}
//                                     </Text>
//                                   </View>
//                                 )}
//                               </View>
//                             </View>
//                           </View>
//                         </View>
//                       </View>
//                     );
//                   })}
//                 </View>
//               )}
//             </View>
//           </View>

//           {/* Quick Actions - exact match with web version */}
//           {/* <View style={styles.quickActionsCard}>
//             <View style={styles.quickActionsHeader}>
//               <Text style={styles.quickActionsIcon}>⭐</Text>
//               <Text style={styles.quickActionsTitle}>Quick Actions</Text>
//             </View>
//             <View style={styles.quickActionsList}>
//               <TouchableOpacity
//                 style={styles.quickActionButton}
//                 onPress={() => handleNavigation('Reports')}
//               >
//                 <View style={styles.quickActionContent}>
//                   <View style={[styles.quickActionIcon, { backgroundColor: '#DBEAFE' }]}>
//                     <Text style={styles.quickActionIconText}>📄</Text>
//                   </View>
//                   <View style={styles.quickActionTextContainer}>
//                     <Text style={styles.quickActionTitle}>View Reports</Text>
//                     <Text style={styles.quickActionSubtitle}>Access detailed analytics and reports</Text>
//                   </View>
//                 </View>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.quickActionButton}
//                 onPress={() => navigation.navigate('TimeSheetStack')}
//               >
//                 <View style={styles.quickActionContent}>
//                   <View style={[styles.quickActionIcon, { backgroundColor: '#BBF7D0' }]}>
//                     <Text style={styles.quickActionIconText}>⏰</Text>
//                   </View>
//                   <View style={styles.quickActionTextContainer}>
//                     <Text style={styles.quickActionTitle}>View BlueSheet</Text>
//                     <Text style={styles.quickActionSubtitle}>Check time entries and logging</Text>
//                   </View>
//                 </View>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.quickActionButton}
//                 onPress={() => navigation('JobListing')}
//               >
//                 <View style={styles.quickActionContent}>
//                   <View style={[styles.quickActionIcon, { backgroundColor: '#DDD6FE' }]}>
//                     <Text style={styles.quickActionIconText}>🏢</Text>
//                   </View>
//                   <View style={styles.quickActionTextContainer}>
//                     <Text style={styles.quickActionTitle}>All Jobs</Text>
//                     <Text style={styles.quickActionSubtitle}>View and manage all jobs</Text>
//                   </View>
//                 </View>
//               </TouchableOpacity>
//             </View>
//           </View> */}

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
//   },
//   header: {
//     backgroundColor: '#3B82F6',
//     flexDirection: 'row',
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
//   content: {
//     padding: 16,
//     gap: 24,
//   },
//   summaryCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   summaryHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 16,
//   },
//   summaryIcon: {
//     fontSize: 20,
//   },
//   summaryTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   summaryGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 16,
//   },
//   summaryItem: {
//     width: '30%',
//     alignItems: 'center',
//   },
//   summaryItemIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 12,
//   },
//   summaryItemIconText: {
//     fontSize: 20,
//   },
//   summaryItemValue: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   summaryItemLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//     textAlign: 'center',
//   },
//   timelineCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   timelineHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 16,
//   },
//   timelineIcon: {
//     fontSize: 20,
//   },
//   timelineTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   timelineContent: {
//     flex: 1,
//   },
//   emptyState: {
//     alignItems: 'center',
//     paddingVertical: 32,
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
//   timeline: {
//     position: 'relative',
//   },
//   timelineLine: {
//     position: 'absolute',
//     left: 24,
//     top: 0,
//     bottom: 0,
//     width: 2,
//     backgroundColor: '#E5E7EB',
//   },
//   timelineItem: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     gap: 16,
//     position: 'relative',
//   },
//   timelineDot: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 1,
//   },
//   timelineDotIcon: {
//     fontSize: 20,
//     color: '#FFFFFF',
//   },
//   activityContent: {
//     flex: 1,
//     paddingBottom: 24,
//   },
//   activityContentBorder: {
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },
//   activityCard: {
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 16,
//   },
//   activityHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 8,
//   },
//   activityTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1F2937',
//     flex: 1,
//   },
//   activityTimestamp: {
//     alignItems: 'flex-end',
//   },
//   activityDate: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   activityTime: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   activityDescription: {
//     fontSize: 14,
//     color: '#374151',
//     marginBottom: 12,
//     lineHeight: 20,
//   },
//   activityFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   activityUser: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   activityUserIcon: {
//     fontSize: 16,
//   },
//   activityUserText: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   metadataBadges: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   metadataBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   metadataBadgeText: {
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   quickActionsCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   quickActionsHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 16,
//   },
//   quickActionsIcon: {
//     fontSize: 20,
//   },
//   quickActionsTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   quickActionsList: {
//     gap: 12,
//   },
//   quickActionButton: {
//     borderWidth: 2,
//     borderColor: '#E5E7EB',
//     borderRadius: 8,
//     padding: 16,
//   },
//   quickActionContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   quickActionIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   quickActionIconText: {
//     fontSize: 18,
//   },
//   quickActionTextContainer: {
//     flex: 1,
//   },
//   quickActionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1F2937',
//     marginBottom: 2,
//   },
//   quickActionSubtitle: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   bottomSpacer: {
//     height: 24,
//   },
// });

// export default JobActivityLogScreen;



import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

// Activity interface for job activities - exact match with web version
interface JobActivity {
  id: string;
  jobId: string;
  type: 'job_created' | 'job_started' | 'labour_hours' | 'timesheet_submitted' | 'material_ordered' | 'job_completed';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  metadata?: {
    hours?: number;
    materialCount?: number;
    amount?: number;
    status?: string;
  };
}

interface Job {
  id: string;
  title: string;
  customer: string;
  status: string;
  location: string;
  assignedTo: string[];
}

interface Props {
  navigation: any;
  route: {
    params?: {
      job?: Job;
    };
  };
}

const JobActivityLogScreen = ({ navigation, route }) => {
  const { job } = route?.params || {};
  const [selectedJob] = useState(job || null);

  // Mock job activities data - exact match with web version
  const [jobActivities] = useState([
    {
      id: '1',
      jobId: selectedJob?.id || 'JDP-2024-001',
      type: 'job_created',
      title: 'Job Created',
      description: 'New electrical panel upgrade job was created and assigned to the team.',
      timestamp: '2024-01-10T08:00:00Z',
      user: 'Sarah Johnson',
      metadata: {
        status: 'pending'
      }
    },
    {
      id: '2',
      jobId: selectedJob?.id || 'JDP-2024-001',
      type: 'job_started',
      title: 'Job Started',
      description: 'Work began on electrical panel upgrade with on-site arrival confirmation.',
      timestamp: '2024-01-15T08:30:00Z',
      user: 'Mike Wilson',
      metadata: {
        status: 'in-progress'
      }
    },
    {
      id: '3',
      jobId: selectedJob?.id || 'JDP-2024-001',
      type: 'labour_hours',
      title: 'Labour Hours Logged',
      description: 'Team logged 6.5 hours of work on electrical installations and safety checks.',
      timestamp: '2024-01-15T15:00:00Z',
      user: 'Mike Wilson',
      metadata: {
        hours: 6.5
      }
    },
    {
      id: '4',
      jobId: selectedJob?.id || 'JDP-2024-001',
      type: 'material_ordered',
      title: 'Job Material Ordered',
      description: 'Ordered electrical components and safety equipment from preferred supplier.',
      timestamp: '2024-01-15T16:30:00Z',
      user: 'David Chen',
      metadata: {
        materialCount: 12,
        amount: 850.00
      }
    },
    {
      id: '5',
      jobId: selectedJob?.id || 'JDP-2024-001',
      type: 'labour_hours',
      title: 'Labour Hours Logged',
      description: 'Additional 4.2 hours logged for final installations and testing.',
      timestamp: '2024-01-16T14:30:00Z',
      user: 'Mike Wilson',
      metadata: {
        hours: 4.2
      }
    },
    {
      id: '6',
      jobId: selectedJob?.id || 'JDP-2024-001',
      type: 'timesheet_submitted',
      title: 'Timesheet Submitted',
      description: 'Daily timesheet submitted with 10.7 total hours and job completion details.',
      timestamp: '2024-01-16T17:00:00Z',
      user: 'Mike Wilson',
      metadata: {
        hours: 10.7
      }
    },
    {
      id: '7',
      jobId: selectedJob?.id || 'JDP-2024-001',
      type: 'job_completed',
      title: 'Job Completed',
      description: 'Electrical panel upgrade completed successfully with customer sign-off.',
      timestamp: '2024-01-16T17:30:00Z',
      user: 'Mike Wilson',
      metadata: {
        status: 'completed'
      }
    }
  ]);

  // Calculate summary statistics - exact match with web version
  const summaryStats = useMemo(() => {
    const totalHours = jobActivities
      .filter(activity => activity.type === 'labour_hours')
      .reduce((sum, activity) => sum + (activity.metadata?.hours || 0), 0);

    const totalOrders = jobActivities
      .filter(activity => activity.type === 'material_ordered')
      .length;

    const totalAmount = jobActivities
      .filter(activity => activity.type === 'material_ordered')
      .reduce((sum, activity) => sum + (activity.metadata?.amount || 0), 0);

    const totalMaterials = jobActivities
      .filter(activity => activity.type === 'material_ordered')
      .reduce((sum, activity) => sum + (activity.metadata?.materialCount || 0), 0);

    return {
      totalHours: Math.round(totalHours * 10) / 10,
      totalOrders,
      totalAmount,
      totalMaterials
    };
  }, [jobActivities]);

  // Get activity icon and color - using React Native Vector Icons
  const getActivityConfig = (type) => {
    switch (type) {
      case 'job_created':
        return { 
          iconName: 'business',
          iconLib: 'material',
          color: '#3B82F6',
          bgColor: '#EFF6FF',
          borderColor: '#DBEAFE'
        };
      case 'job_started':
        return { 
          iconName: 'play-arrow',
          iconLib: 'material',
          color: '#10B981',
          bgColor: '#F0FDF4',
          borderColor: '#BBF7D0'
        };
      case 'labour_hours':
        return { 
          iconName: 'schedule',
          iconLib: 'material',
          color: '#F59E0B',
          bgColor: '#FFFBEB',
          borderColor: '#FED7AA'
        };
      case 'timesheet_submitted':
        return { 
          iconName: 'description',
          iconLib: 'material',
          color: '#8B5CF6',
          bgColor: '#F5F3FF',
          borderColor: '#DDD6FE'
        };
      case 'material_ordered':
        return { 
          iconName: 'inventory',
          iconLib: 'material',
          color: '#6366F1',
          bgColor: '#EEF2FF',
          borderColor: '#C7D2FE'
        };
      case 'job_completed':
        return { 
          iconName: 'check-circle',
          iconLib: 'material',
          color: '#059669',
          bgColor: '#ECFDF5',
          borderColor: '#A7F3D0'
        };
      default:
        return { 
          iconName: 'warning',
          iconLib: 'material',
          color: '#6B7280',
          bgColor: '#F9FAFB',
          borderColor: '#E5E7EB'
        };
    }
  };

  // Format timestamp - exact match with web version
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const handleNavigation = (screen) => {
    try {
      if (navigation && typeof navigation.navigate === 'function') {
        navigation.navigate(screen);
      } else {
        console.warn('Navigation function not available');
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const renderIcon = (iconName, iconLib, size, color) => {
    if (iconLib === 'ionicon') {
      return <Ionicons name={iconName} size={size} color={color} />;
    }
    return <Icon name={iconName} size={size} color={color} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />
      
      {/* Header - exact match with web version */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Job Activity Log</Text>
          <Text style={styles.headerSubtitle}>
            {selectedJob ? `#${selectedJob.id}` : 'Job Activities'}
          </Text>
        </View>
        
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Summary Section - exact match with web version */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Icon name="flash-on" size={24} color="#F59E0B" />
              <Text style={styles.summaryTitle}>Activity Summary</Text>
            </View>
            <View style={styles.summaryGrid}>
              {/* Total Spent Hours */}
              <View style={styles.summaryItem}>
                <View style={[styles.summaryItemIcon, { backgroundColor: '#FED7AA' }]}>
                  <Icon name="schedule" size={24} color="#C2410C" />
                </View>
                <Text style={styles.summaryItemValue}>
                  {summaryStats.totalHours}h
                </Text>
                <Text style={styles.summaryItemLabel}>Total Spent Hours</Text>
              </View>

              {/* Total Number of Orders */}
              <View style={styles.summaryItem}>
                <View style={[styles.summaryItemIcon, { backgroundColor: '#C7D2FE' }]}>
                  <Icon name="inventory" size={24} color="#4338CA" />
                </View>
                <Text style={styles.summaryItemValue}>
                  {summaryStats.totalOrders}
                </Text>
                <Text style={styles.summaryItemLabel}>Total Number of Orders</Text>
              </View>

              {/* Material Costs */}
              {/* <View style={styles.summaryItem}>
                <View style={[styles.summaryItemIcon, { backgroundColor: '#BBF7D0' }]}>
                  <Icon name="attach-money" size={24} color="#059669" />
                </View>
                <Text style={styles.summaryItemValue}>
                  ${summaryStats.totalAmount.toLocaleString()}
                </Text>
                <Text style={styles.summaryItemLabel}>Material Costs</Text>
              </View> */}

              {/* Materials Ordered */}
              <View style={styles.summaryItem}>
                <View style={[styles.summaryItemIcon, { backgroundColor: '#DDD6FE' }]}>
                  <Icon name="build" size={24} color="#7C3AED" />
                </View>
                <Text style={styles.summaryItemValue}>
                  {summaryStats.totalMaterials}
                </Text>
                <Text style={styles.summaryItemLabel}>Materials Ordered</Text>
              </View>
            </View>
          </View>

          {/* Activity Timeline - exact match with web version */}
          <View style={styles.timelineCard}>
            <View style={styles.timelineHeader}>
              <Icon name="timeline" size={24} color="#3B82F6" />
              <Text style={styles.timelineTitle}>Activity Timeline</Text>
            </View>
            
            <View style={styles.timelineContent}>
              {jobActivities.length === 0 ? (
                <View style={styles.emptyState}>
                  <Icon name="info" size={48} color="#6B7280" />
                  <Text style={styles.emptyStateTitle}>No activities found</Text>
                  <Text style={styles.emptyStateText}>
                    No job activities have been recorded yet.
                  </Text>
                </View>
              ) : (
                <View style={styles.timeline}>
                  {/* Timeline line */}
                  <View style={styles.timelineLine} />
                  
                  {jobActivities.map((activity, index) => {
                    const config = getActivityConfig(activity.type);
                    const { date, time } = formatTimestamp(activity.timestamp);
                    
                    return (
                      <View key={activity.id} style={styles.timelineItem}>
                        {/* Timeline dot */}
                        <View style={[styles.timelineDot, { backgroundColor: config.color }]}>
                          {renderIcon(config.iconName, config.iconLib, 24, '#FFFFFF')}
                        </View>
                        
                        {/* Activity content */}
                        <View style={[
                          styles.activityContent,
                          index === jobActivities.length - 1 ? {} : styles.activityContentBorder
                        ]}>
                          <View style={[
                            styles.activityCard,
                            { backgroundColor: config.bgColor, borderColor: config.borderColor }
                          ]}>
                            <View style={styles.activityHeader}>
                              <Text style={styles.activityTitle}>
                                {activity.title}
                              </Text>
                              <View style={styles.activityTimestamp}>
                                <Text style={styles.activityDate}>{date}</Text>
                                <Text style={styles.activityTime}>{time}</Text>
                              </View>
                            </View>
                            
                            <Text style={styles.activityDescription}>
                              {activity.description}
                            </Text>
                            
                            {/* Activity metadata */}
                            <View style={styles.activityFooter}>
                              <View style={styles.activityUser}>
                                <Icon name="person" size={16} color="#6B7280" />
                                <Text style={styles.activityUserText}>{activity.user}</Text>
                              </View>
                              
                              {/* Metadata badges */}
                              <View style={styles.metadataBadges}>
                                {activity.metadata?.hours && (
                                  <View style={[styles.metadataBadge, { backgroundColor: '#FED7AA' }]}>
                                    <Text style={[styles.metadataBadgeText, { color: '#C2410C' }]}>
                                      {activity.metadata.hours}h
                                    </Text>
                                  </View>
                                )}
                                {activity.metadata?.materialCount && (
                                  <View style={[styles.metadataBadge, { backgroundColor: '#C7D2FE' }]}>
                                    <Text style={[styles.metadataBadgeText, { color: '#4338CA' }]}>
                                      {activity.metadata.materialCount} items
                                    </Text>
                                  </View>
                                )}
                                {/* {activity.metadata?.amount && (
                                  <View style={[styles.metadataBadge, { backgroundColor: '#BBF7D0' }]}>
                                    <Text style={[styles.metadataBadgeText, { color: '#059669' }]}>
                                      ${activity.metadata.amount.toLocaleString()}
                                    </Text>
                                  </View>
                                )} */}
                                {activity.metadata?.status && (
                                  <View style={[
                                    styles.metadataBadge,
                                    { 
                                      backgroundColor: 
                                        activity.metadata.status === 'completed' ? '#A7F3D0' :
                                        activity.metadata.status === 'in-progress' ? '#DBEAFE' : '#E5E7EB'
                                    }
                                  ]}>
                                    <Text style={[
                                      styles.metadataBadgeText,
                                      { 
                                        color: 
                                          activity.metadata.status === 'completed' ? '#059669' :
                                          activity.metadata.status === 'in-progress' ? '#3B82F6' : '#6B7280'
                                      }
                                    ]}>
                                      {activity.metadata.status.replace('-', ' ')}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </View>

          {/* Quick Actions - exact match with web version */}
          {/* <View style={styles.quickActionsCard}>
            <View style={styles.quickActionsHeader}>
              <Icon name="star" size={24} color="#F59E0B" />
              <Text style={styles.quickActionsTitle}>Quick Actions</Text>
            </View>
            <View style={styles.quickActionsList}>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => handleNavigation('Reports')}
              >
                <View style={styles.quickActionContent}>
                  <View style={[styles.quickActionIcon, { backgroundColor: '#DBEAFE' }]}>
                    <Icon name="assessment" size={20} color="#3B82F6" />
                  </View>
                  <View style={styles.quickActionTextContainer}>
                    <Text style={styles.quickActionTitle}>View Reports</Text>
                    <Text style={styles.quickActionSubtitle}>Access detailed analytics and reports</Text>
                  </View>
                  <Icon name="chevron-right" size={20} color="#9CA3AF" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => handleNavigation('Timesheet')}
              >
                <View style={styles.quickActionContent}>
                  <View style={[styles.quickActionIcon, { backgroundColor: '#BBF7D0' }]}>
                    <Icon name="schedule" size={20} color="#059669" />
                  </View>
                  <View style={styles.quickActionTextContainer}>
                    <Text style={styles.quickActionTitle}>View Timesheet</Text>
                    <Text style={styles.quickActionSubtitle}>Check time entries and logging</Text>
                  </View>
                  <Icon name="chevron-right" size={20} color="#9CA3AF" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => handleNavigation('JobListing')}
              >
                <View style={styles.quickActionContent}>
                  <View style={[styles.quickActionIcon, { backgroundColor: '#DDD6FE' }]}>
                    <Icon name="work" size={20} color="#7C3AED" />
                  </View>
                  <View style={styles.quickActionTextContainer}>
                    <Text style={styles.quickActionTitle}>All Jobs</Text>
                    <Text style={styles.quickActionSubtitle}>Browse and manage all jobs</Text>
                  </View>
                  <Icon name="chevron-right" size={20} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            </View>
          </View> */}

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
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
    shadowOffset: { width: 0, height: 2 },
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
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  summaryItem: {
    width: '30%',
    alignItems: 'center',
  },
  summaryItemIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  summaryItemValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  summaryItemLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timelineTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 12,
  },
  timelineContent: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  timeline: {
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 28,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#E5E7EB',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    position: 'relative',
  },
  timelineDot: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityContentBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 24,
  },
  activityCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  activityTimestamp: {
    alignItems: 'flex-end',
  },
  activityDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  activityDescription: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 16,
    lineHeight: 24,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  activityUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activityUserText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  metadataBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  metadataBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  metadataBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  quickActionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  quickActionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 12,
  },
  quickActionsList: {
    gap: 12,
  },
  quickActionButton: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  quickActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionTextContainer: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  bottomSpacer: {
    height: 32,
  },
});

export default JobActivityLogScreen;