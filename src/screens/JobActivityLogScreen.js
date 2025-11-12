// import React, {useState, useMemo, useEffect} from 'react';
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
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {getJobActivity} from '../config/apiConfig';
// import {useSelector} from 'react-redux';
// import {widthPercentageToDP} from '../utils';

// const {width} = Dimensions.get('window');

// const JobActivityLogScreen = ({navigation, route}) => {
//   const {job} = route?.params || {};
//   const token = useSelector(state => state.user.token);
//   const [selectedJob] = useState(job || null);
//   const [jobActivities, setJobActivities] = useState([]);
//   const jobId = job?.id;
//   console.log('jobjobjob', job, jobId);
//   // ---------------- Helpers ----------------
//   const stripMicroseconds = iso => String(iso || '').replace(/\.\d+/, '');

//   const toSeconds = (hhmmss = '00:00:00') => {
//     const [hh = '0', mm = '0', ss = '0'] = String(hhmmss).split(':');
//     const h = parseInt(hh, 10) || 0;
//     const m = parseInt(mm, 10) || 0;
//     const s = parseInt(ss, 10) || 0;
//     return h * 3600 + m * 60 + s;
//   };

//   const secondsToHours = (sec = 0) => +(sec / 3600).toFixed(2);

//   const safeISO = d => {
//     if (!d) return null;
//     const date = new Date(d);
//     return isNaN(date) ? null : date.toISOString();
//   };

//   useEffect(() => {
//     const fetchJobActivity = async () => {
//       try {
//         // fetch for current date so route-seeding uses that data immediately
//         const res = await getJobActivity(jobId, token);
//         console.log("fetchJobActivityfetchJobActivity",res);

//         // res might be { success, message, data: { labor_timesheets: [...], orders: [...] } }
//         // setBulesheetData(res?.data ?? {}); // keep shape similar to previous code
//       } catch (error) {
//         console.log('Error fetching timesheet:', error);
//         // setBulesheetData({}); // fail-safe
//       }
//     };

//     fetchJobActivity();
//   }, [jobId]);
//   const joinDateTimeToISO = (dateStr, timeStr) => {
//     if (!dateStr || !timeStr) return null;
//     // Create ISO in local time (acceptable for display; if you need exact TZ, adapt here)
//     const isoRaw = `${dateStr}T${timeStr}`;
//     const d = new Date(isoRaw);
//     return isNaN(d) ? null : d.toISOString();
//   };

//   const getEarliestStartISO = (timesheets = []) => {
//     const allStarts = timesheets
//       .map(
//         ts =>
//           joinDateTimeToISO(ts.date, ts.start_time) || safeISO(ts.created_at),
//       )
//       .filter(Boolean)
//       .sort((a, b) => new Date(a) - new Date(b));
//     return allStarts[0] || null;
//   };

//   // Build timeline dynamically from job object
//   useEffect(() => {
//     if (!job) return;

//     const createdISO = safeISO(stripMicroseconds(job.created_at));
//     const completedISO = safeISO(stripMicroseconds(job.updated_at));
//     const timesheets = Array.isArray(job.labor_timesheets)
//       ? job.labor_timesheets
//       : [];

//     const dynamicActivities = [];

//     // 1) Job Created
//     if (createdISO) {
//       dynamicActivities.push({
//         id: 'job_created',
//         jobId: job.id,
//         type: 'job_created',
//         title: 'Job Created',
//         description: `Job ${job.job_title || `#${job.id}`} was created.`,
//         timestamp: createdISO,
//         user: job?.created_by_user?.full_name || 'System',
//         metadata: {status: job.status || 'pending'},
//       });
//     }

//     // 2) Job Started (earliest start across timesheets)
//     const earliestStartISO = getEarliestStartISO(timesheets);
//     if (earliestStartISO) {
//       dynamicActivities.push({
//         id: 'job_started',
//         jobId: job.id,
//         type: 'job_started',
//         title: 'Job Started',
//         description: 'Teams started working on the job.',
//         timestamp: earliestStartISO,
//         user: job?.assigned_lead_labor?.[0]?.user?.full_name || 'Lead',
//         metadata: {status: 'in-progress'},
//       });
//     }

//     // 3) Timesheet → Labour Hours (+ optional Timesheet Submitted)
//     timesheets.forEach((ts, idx) => {
//       const workedSeconds = toSeconds(ts.work_hours || '00:00:00');
//       const hours = secondsToHours(workedSeconds);
//       const tsStartISO =
//         joinDateTimeToISO(ts.date, ts.start_time) || safeISO(ts.created_at);
//       const tsEndISO =
//         joinDateTimeToISO(ts.date, ts.end_time) || safeISO(ts.updated_at);

//       dynamicActivities.push({
//         id: `labour_${idx + 1}`,
//         jobId: job.id,
//         type: 'labour_hours',
//         title: 'Labour Hours Logged',
//         description: `${ts.labor_name || 'Technician'} logged ${hours}h on ${
//           ts.date || ''
//         }.`,
//         timestamp:
//           tsEndISO || tsStartISO || createdISO || new Date().toISOString(),
//         user: ts.labor_name || 'Technician',
//         metadata: {hours},
//       });

//       if (ts.updated_at) {
//         const updISO = safeISO(ts.updated_at);
//         if (updISO) {
//           dynamicActivities.push({
//             id: `timesheet_${idx + 1}`,
//             jobId: job.id,
//             type: 'timesheet_submitted',
//             title: 'Timesheet Submitted',
//             description: `Timesheet updated/submitted by ${
//               ts.labor_name || 'Technician'
//             }.`,
//             timestamp: updISO,
//             user: ts.labor_name || 'Technician',
//             metadata: {hours},
//           });
//         }
//       }
//     });

//     // 4) Job Completed
//     if ((job.status || '').toLowerCase() === 'completed' && completedISO) {
//       dynamicActivities.push({
//         id: 'job_completed',
//         jobId: job.id,
//         type: 'job_completed',
//         title: 'Job Completed',
//         description: 'Job marked as completed.',
//         timestamp: completedISO,
//         user: job?.assigned_lead_labor?.[0]?.user?.full_name || 'Lead',
//         metadata: {status: 'completed'},
//       });
//     }

//     // Sort timeline
//     dynamicActivities.sort(
//       (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
//     );

//     setJobActivities(dynamicActivities);
//   }, [job]);

//   // Summary (Total Spent Hours from all timesheets)
//   const summaryStats = useMemo(() => {
//     const timesheets = Array.isArray(job?.labor_timesheets)
//       ? job.labor_timesheets
//       : [];
//     const totalSpentSeconds = timesheets.reduce(
//       (sum, ts) => sum + toSeconds(ts.work_hours || '00:00:00'),
//       0,
//     );

//     // Placeholder for materials/orders aggregation if needed later
//     const totalOrders = job?.orders?.length;
//     const totalAmount = 0;
//     const totalMaterials = 0;

//     return {
//       totalHours: secondsToHours(totalSpentSeconds),
//       totalOrders,
//       totalAmount,
//       totalMaterials,
//     };
//   }, [job]);

//   // UI helpers
//   const getActivityConfig = type => {
//     switch (type) {
//       case 'job_created':
//         return {
//           iconName: 'business',
//           iconLib: 'material',
//           color: '#3B82F6',
//           bgColor: '#EFF6FF',
//           borderColor: '#DBEAFE',
//         };
//       case 'job_started':
//         return {
//           iconName: 'play-arrow',
//           iconLib: 'material',
//           color: '#10B981',
//           bgColor: '#F0FDF4',
//           borderColor: '#BBF7D0',
//         };
//       case 'labour_hours':
//         return {
//           iconName: 'schedule',
//           iconLib: 'material',
//           color: '#F59E0B',
//           bgColor: '#FFFBEB',
//           borderColor: '#FED7AA',
//         };
//       case 'timesheet_submitted':
//         return {
//           iconName: 'description',
//           iconLib: 'material',
//           color: '#8B5CF6',
//           bgColor: '#F5F3FF',
//           borderColor: '#DDD6FE',
//         };
//       case 'material_ordered':
//         return {
//           iconName: 'inventory',
//           iconLib: 'material',
//           color: '#6366F1',
//           bgColor: '#EEF2FF',
//           borderColor: '#C7D2FE',
//         };
//       case 'job_completed':
//         return {
//           iconName: 'check-circle',
//           iconLib: 'material',
//           color: '#059669',
//           bgColor: '#ECFDF5',
//           borderColor: '#A7F3D0',
//         };
//       default:
//         return {
//           iconName: 'warning',
//           iconLib: 'material',
//           color: '#6B7280',
//           bgColor: '#F9FAFB',
//           borderColor: '#E5E7EB',
//         };
//     }
//   };

//   const formatTimestamp = timestamp => {
//     const date = new Date(timestamp);
//     return {
//       date: date.toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric',
//       }),
//       time: date.toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true,
//       }),
//     };
//   };

//   const renderIcon = (iconName, iconLib, size, color) => {
//     if (iconLib === 'ionicon') {
//       return <Ionicons name={iconName} size={size} color={color} />;
//     }
//     return <Icon name={iconName} size={size} color={color} />;
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
//           <Text style={styles.headerTitle}>Job Activity Log</Text>
//           <Text style={styles.headerSubtitle}>
//             {selectedJob ? `${selectedJob?.job_title}` : 'Job Activities'}
//           </Text>
//         </View>

//         <View style={styles.headerSpacer} />
//       </View>

//       <ScrollView
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}>
//         <View style={styles.content}>
//           {/* Summary */}
//           <View style={styles.summaryCard}>
//             <View style={styles.summaryHeader}>
//               <Icon name="flash-on" size={24} color="#F59E0B" />
//               <Text style={styles.summaryTitle}>Activity Summary</Text>
//             </View>
//             <View style={styles.summaryGrid}>
//               {/* Total Spent Hours */}
//               <View style={styles.summaryItem}>
//                 <View
//                   style={[
//                     styles.summaryItemIcon,
//                     {backgroundColor: '#FED7AA'},
//                   ]}>
//                   <Icon name="schedule" size={24} color="#C2410C" />
//                 </View>
//                 <Text style={styles.summaryItemValue}>
//                   {summaryStats.totalHours}h
//                 </Text>
//                 <Text style={styles.summaryItemLabel}>Total Spent Hours</Text>
//               </View>

//               {/* Total Number of Orders (placeholder) */}
//               <View style={styles.summaryItem}>
//                 <View
//                   style={[
//                     styles.summaryItemIcon,
//                     {backgroundColor: '#C7D2FE'},
//                   ]}>
//                   <Icon name="inventory" size={24} color="#4338CA" />
//                 </View>
//                 <Text style={styles.summaryItemValue}>
//                   {summaryStats.totalOrders || 0}
//                 </Text>
//                 <Text style={styles.summaryItemLabel}>
//                   Total Number of Orders
//                 </Text>
//               </View>

//               {/* Materials Ordered (placeholder) */}
//               {/* <View style={styles.summaryItem}>
//                 <View
//                   style={[
//                     styles.summaryItemIcon,
//                     {backgroundColor: '#DDD6FE'},
//                   ]}>
//                   <Icon name="build" size={24} color="#7C3AED" />
//                 </View>
//                 <Text style={styles.summaryItemValue}>
//                   {summaryStats.totalMaterials}
//                 </Text>
//                 <Text style={styles.summaryItemLabel}>Materials Ordered</Text>
//               </View> */}
//             </View>
//           </View>

//           {/* Activity Timeline */}
//           <View style={styles.timelineCard}>
//             <View style={styles.timelineHeader}>
//               <Icon name="timeline" size={24} color="#3B82F6" />
//               <Text style={styles.timelineTitle}>Activity Timeline</Text>
//             </View>

//             <View style={styles.timelineContent}>
//               {jobActivities.length === 0 ? (
//                 <View style={styles.emptyState}>
//                   <Icon name="info" size={48} color="#6B7280" />
//                   <Text style={styles.emptyStateTitle}>
//                     No activities found
//                   </Text>
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
//                     const {date, time} = formatTimestamp(activity.timestamp);

//                     return (
//                       <View key={activity.id} style={styles.timelineItem}>
//                         {/* Timeline dot */}
//                         <View
//                           style={[
//                             styles.timelineDot,
//                             {backgroundColor: config.color},
//                           ]}>
//                           {renderIcon(
//                             config.iconName,
//                             config.iconLib,
//                             24,
//                             '#FFFFFF',
//                           )}
//                         </View>

//                         {/* Activity content */}
//                         <View
//                           style={[
//                             styles.activityContent,
//                             index === jobActivities.length - 1
//                               ? {}
//                               : styles.activityContentBorder,
//                           ]}>
//                           <View
//                             style={[
//                               styles.activityCard,
//                               {
//                                 backgroundColor: config.bgColor,
//                                 borderColor: config.borderColor,
//                               },
//                             ]}>
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
//                                 <Icon name="person" size={16} color="#6B7280" />
//                                 <Text style={styles.activityUserText}>
//                                   {activity.user}
//                                 </Text>
//                               </View>

//                               {/* Metadata badges */}
//                               <View style={styles.metadataBadges}>
//                                 {activity.metadata?.hours ? (
//                                   <View
//                                     style={[
//                                       styles.metadataBadge,
//                                       {backgroundColor: '#FED7AA'},
//                                     ]}>
//                                     <Text
//                                       style={[
//                                         styles.metadataBadgeText,
//                                         {color: '#C2410C'},
//                                       ]}>
//                                       {activity.metadata.hours}h
//                                     </Text>
//                                   </View>
//                                 ) : null}

//                                 {activity.metadata?.materialCount ? (
//                                   <View
//                                     style={[
//                                       styles.metadataBadge,
//                                       {backgroundColor: '#C7D2FE'},
//                                     ]}>
//                                     <Text
//                                       style={[
//                                         styles.metadataBadgeText,
//                                         {color: '#4338CA'},
//                                       ]}>
//                                       {activity.metadata.materialCount} items
//                                     </Text>
//                                   </View>
//                                 ) : null}

//                                 {activity.metadata?.status ? (
//                                   <View
//                                     style={[
//                                       styles.metadataBadge,
//                                       {
//                                         backgroundColor:
//                                           activity.metadata.status ===
//                                           'completed'
//                                             ? '#A7F3D0'
//                                             : activity.metadata.status ===
//                                               'in-progress'
//                                             ? '#DBEAFE'
//                                             : '#E5E7EB',
//                                       },
//                                     ]}>
//                                     <Text
//                                       style={[
//                                         styles.metadataBadgeText,
//                                         {
//                                           color:
//                                             activity.metadata.status ===
//                                             'completed'
//                                               ? '#059669'
//                                               : activity.metadata.status ===
//                                                 'in-progress'
//                                               ? '#3B82F6'
//                                               : '#6B7280',
//                                         },
//                                       ]}>
//                                       {String(activity.metadata.status).replace(
//                                         '-',
//                                         ' ',
//                                       )}
//                                     </Text>
//                                   </View>
//                                 ) : null}
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
//           <View style={styles.bottomSpacer} />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// // ---------------- Styles (same as your original) ----------------
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
//   headerSpacer: {
//     width: 40,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   content: {
//     padding: 16,
//   },
//   summaryCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 4},
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   summaryHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   summaryTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginLeft: 12,
//   },
//   summaryGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 16,
//   },
//   summaryItem: {
//     width: widthPercentageToDP(38),
//     alignItems: 'center',
//   },
//   summaryItemIcon: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 12,
//   },
//   summaryItemValue: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginBottom: 8,
//   },
//   summaryItemLabel: {
//     fontSize: 14,
//     color: '#6B7280',
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   timelineCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 4},
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   timelineHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   timelineTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginLeft: 12,
//   },
//   timelineContent: {
//     flex: 1,
//   },
//   emptyState: {
//     alignItems: 'center',
//     paddingVertical: 48,
//   },
//   emptyStateTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#1F2937',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptyStateText: {
//     fontSize: 16,
//     color: '#6B7280',
//     textAlign: 'center',
//     lineHeight: 24,
//   },
//   timeline: {
//     position: 'relative',
//   },
//   timelineLine: {
//     position: 'absolute',
//     left: 28,
//     top: 0,
//     bottom: 0,
//     width: 2,
//     backgroundColor: '#E5E7EB',
//   },
//   timelineItem: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 24,
//     position: 'relative',
//   },
//   timelineDot: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 1,
//     marginRight: 16,
//   },
//   activityContent: {
//     flex: 1,
//   },
//   activityContentBorder: {
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//     paddingBottom: 24,
//   },
//   activityCard: {
//     borderWidth: 1,
//     borderRadius: 12,
//     padding: 16,
//   },
//   activityHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },
//   activityTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1F2937',
//     flex: 1,
//     marginRight: 12,
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
//     marginTop: 2,
//   },
//   activityDescription: {
//     fontSize: 16,
//     color: '#374151',
//     marginBottom: 16,
//     lineHeight: 24,
//   },
//   activityFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   activityUser: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   activityUserText: {
//     fontSize: 14,
//     color: '#6B7280',
//     fontWeight: '500',
//   },
//   metadataBadges: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 6,
//   },
//   metadataBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },
//   metadataBadgeText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   quickActionsCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 4},
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   quickActionsHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   quickActionsTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginLeft: 12,
//   },
//   quickActionsList: {
//     gap: 12,
//   },
//   quickActionButton: {
//     borderWidth: 2,
//     borderColor: '#E5E7EB',
//     borderRadius: 12,
//     padding: 16,
//     backgroundColor: '#FAFAFA',
//   },
//   quickActionContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   quickActionIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   quickActionTextContainer: {
//     flex: 1,
//   },
//   quickActionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   quickActionSubtitle: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   bottomSpacer: {
//     height: 32,
//   },
// });

// export default JobActivityLogScreen;

import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getJobActivity} from '../config/apiConfig';
import {useSelector} from 'react-redux';
import {widthPercentageToDP} from '../utils';

const {width} = Dimensions.get('window');

const JobActivityLogScreen = ({navigation, route}) => {
  const {job: routeJob} = route?.params || {};
  const token = useSelector(state => state.user.token);
  const [jobData, setJobData] = useState(null);
  const [jobActivities, setJobActivities] = useState([]);
  const [jobTotalTime, setJobTotalTime] = useState();
  const [jobTotalOrders, setJobTotalOrders] = useState([]);

  const [loading, setLoading] = useState(false);

  const jobId = routeJob?.id || jobData?.id;
  console.log('jobdata>>>', jobData);

  // ---------------- Helpers ----------------
  const stripMicroseconds = iso => String(iso || '').replace(/\.\d+/, '');
  const toSeconds = (hhmmss = '00:00:00') => {
    const [hh = '0', mm = '0', ss = '0'] = String(hhmmss).split(':');
    return (
      (parseInt(hh, 10) || 0) * 3600 +
      (parseInt(mm, 10) || 0) * 60 +
      (parseInt(ss, 10) || 0)
    );
  };
  const secondsToHours = (sec = 0) => +(sec / 3600).toFixed(2);
  const safeISO = d => {
    if (!d) return null;
    const date = new Date(d);
    return isNaN(date) ? null : date.toISOString();
  };
  const getOnlyDate = d => {
    if (!d) return null;
    const date = new Date(d);
    if (isNaN(date)) return null;
    return date.toISOString().split('T')[0]; // returns "YYYY-MM-DD"
  };
  const joinDateTimeToISO = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;
    const isoRaw = `${dateStr}T${timeStr}`;
    const d = new Date(isoRaw);
    return isNaN(d) ? null : d.toISOString();
  };

  const getEarliestStartISO = (timesheets = []) => {
    const allStarts = timesheets
      .map(
        ts =>
          joinDateTimeToISO(ts.date, ts.start_time) || safeISO(ts.created_at),
      )
      .filter(Boolean)
      .sort((a, b) => new Date(a) - new Date(b));
    return allStarts[0] || null;
  };

  // ---------------- Fetch Job ----------------
  useEffect(() => {
    if (!jobId) return;

    const fetchJobActivity = async () => {
      try {
        setLoading(true);
        const res = await getJobActivity(jobId, token);
        if (res?.success && res?.data) {
          setJobData(res?.data?.job);
          setJobTotalTime(res?.data?.regular_hours?.formatted);
          setJobTotalOrders(res?.data?.total_orders);
        }
        console.log('fetchJobActivityfetchJobActivity', res, jobId);
      } catch (error) {
        console.log('Error fetching job activity:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if jobData not passed via route
    if (!jobData) fetchJobActivity();
  }, [jobId]);

  // ---------------- Build Timeline ----------------
  useEffect(() => {
    if (!jobData) return;
    const createdISO = getOnlyDate(jobData.created_at);
    const completedISO = safeISO(stripMicroseconds(jobData.updated_at));
    const timesheets = Array.isArray(jobData.labor_timesheets)
      ? jobData.labor_timesheets
      : [];
    const dynamicActivities = [];
    // Job Created
    if (createdISO) {
      dynamicActivities.push({
        id: 'job_created',
        type: 'job_created',
        title: 'Job Created',
        description: `Job ${jobData.job_title} was created.`,
        timestamp: createdISO,
        user: jobData.created_by_user?.full_name || 'System',
        metadata: {status: jobData.status || 'pending'},
      });
    }

    // Job Started
    const earliestStartISO = getEarliestStartISO(timesheets);
    if (earliestStartISO) {
      dynamicActivities.push({
        id: 'job_started',
        type: 'job_started',
        title: 'Job Started',
        description: 'Team started working on the job.',
        timestamp: earliestStartISO,
        user: jobData.assigned_lead_labor?.[0]?.user?.full_name || 'Lead',
        metadata: {status: 'in-progress'},
      });
    }

    // Labour hours
    timesheets?.forEach((ts, idx) => {
      const workedSeconds = toSeconds(ts.work_hours || '00:00:00');
      const hours = secondsToHours(workedSeconds);
      const tsStartISO =
        joinDateTimeToISO(ts.date, ts.start_time) || safeISO(ts.created_at);
      const tsEndISO =
        joinDateTimeToISO(ts.date, ts.end_time) || safeISO(ts.updated_at);

      dynamicActivities.push({
        id: `labour_${idx + 1}`,
        type: 'labour_hours',
        title: 'Labour Hours Logged',
        description: `${ts.labor_name || 'Technician'} logged ${hours}h on ${
          ts.date || ''
        }.`,
        timestamp:
          tsEndISO || tsStartISO || createdISO || new Date().toISOString(),
        user: ts.labor_name || 'Technician',
        metadata: {hours},
      });

      if (ts.updated_at) {
        const updISO = safeISO(ts.updated_at);
        if (updISO) {
          dynamicActivities.push({
            id: `timesheet_${idx + 1}`,
            type: 'timesheet_submitted',
            title: 'Timesheet Submitted',
            description: `Timesheet updated/submitted by ${
              ts.labor_name || 'Technician'
            }.`,
            timestamp: updISO,
            user: ts.labor_name || 'Technician',
            metadata: {hours},
          });
        }
      }
    });

    // Job Completed
    if ((jobData.status || '').toLowerCase() === 'completed' && completedISO) {
      dynamicActivities.push({
        id: 'job_completed',
        type: 'job_completed',
        title: 'Job Completed',
        description: 'Job marked as completed.',
        timestamp: completedISO,
        user: jobData.assigned_lead_labor?.[0]?.user?.full_name || 'Lead',
        metadata: {status: 'completed'},
      });
    }

    // Sort timeline
    dynamicActivities.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    );
    setJobActivities(dynamicActivities);
  }, [jobData]);

  // ---------------- Summary ----------------
  const summaryStats = useMemo(() => {
    const timesheets = Array.isArray(jobData?.labor_timesheets)
      ? jobData.labor_timesheets
      : [];
    const totalSpentSeconds = timesheets.reduce(
      (sum, ts) => sum + toSeconds(ts.work_hours || '00:00:00'),
      0,
    );

    return {
      totalHours: secondsToHours(totalSpentSeconds),
      totalOrders: jobData?.total_orders || 0,
    };
  }, [jobData]);

  // ---------------- UI helpers ----------------
  const getActivityConfig = type => {
    switch (type) {
      case 'job_created':
        return {
          iconName: 'business',
          color: '#3B82F6',
          bgColor: '#EFF6FF',
          borderColor: '#DBEAFE',
        };
      case 'job_started':
        return {
          iconName: 'play-arrow',
          color: '#10B981',
          bgColor: '#F0FDF4',
          borderColor: '#BBF7D0',
        };
      case 'labour_hours':
        return {
          iconName: 'schedule',
          color: '#F59E0B',
          bgColor: '#FFFBEB',
          borderColor: '#FED7AA',
        };
      case 'timesheet_submitted':
        return {
          iconName: 'description',
          color: '#8B5CF6',
          bgColor: '#F5F3FF',
          borderColor: '#DDD6FE',
        };
      case 'job_completed':
        return {
          iconName: 'check-circle',
          color: '#059669',
          bgColor: '#ECFDF5',
          borderColor: '#A7F3D0',
        };
      default:
        return {
          iconName: 'warning',
          color: '#6B7280',
          bgColor: '#F9FAFB',
          borderColor: '#E5E7EB',
        };
    }
  };

  const formatTimestamp = timestamp => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
  };

  const renderIcon = (iconName, size, color) => (
    <Icon name={iconName} size={size} color={color} />
  );

  if (loading && !jobData) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#3B82F6"
          style={{flex: 1, justifyContent: 'center'}}
        />
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>Job Activity Log</Text>
          <Text style={styles.headerSubtitle}>
            {jobData?.job_title || 'Job Activities'}
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Icon name="flash-on" size={24} color="#F59E0B" />
              <Text style={styles.summaryTitle}>Activity Summary</Text>
            </View>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <View
                  style={[
                    styles.summaryItemIcon,
                    {backgroundColor: '#FED7AA'},
                  ]}>
                  <Icon name="schedule" size={24} color="#C2410C" />
                </View>
                <Text style={styles.summaryItemValue}>{jobTotalTime}</Text>
                <Text style={styles.summaryItemLabel}>Total Spent Hours</Text>
              </View>

              <View style={styles.summaryItem}>
                <View
                  style={[
                    styles.summaryItemIcon,
                    {backgroundColor: '#C7D2FE'},
                  ]}>
                  <Icon name="inventory" size={24} color="#4338CA" />
                </View>
                <Text style={styles.summaryItemValue}>{jobTotalOrders}</Text>
                <Text style={styles.summaryItemLabel}>Total Orders</Text>
              </View>
            </View>
          </View>

          {/* Timeline */}
          <View style={styles.timelineCard}>
            <View style={styles.timelineHeader}>
              <Icon name="timeline" size={24} color="#3B82F6" />
              <Text style={styles.timelineTitle}>Activity Timeline</Text>
            </View>

            <View style={styles.timelineContent}>
              {jobActivities.length === 0 ? (
                <View style={styles.emptyState}>
                  <Icon name="info" size={48} color="#6B7280" />
                  <Text style={styles.emptyStateTitle}>
                    No activities found
                  </Text>
                  <Text style={styles.emptyStateText}>
                    No job activities have been recorded yet.
                  </Text>
                </View>
              ) : (
                <View style={styles.timeline}>
                  <View style={styles.timelineLine} />
                  {jobActivities.map((activity, index) => {
                    const config = getActivityConfig(activity.type);
                    const {date, time} = formatTimestamp(activity.timestamp);

                    return (
                      <View key={activity.id} style={styles.timelineItem}>
                        <View
                          style={[
                            styles.timelineDot,
                            {backgroundColor: config.color},
                          ]}>
                          {renderIcon(config.iconName, 24, '#FFFFFF')}
                        </View>

                        <View
                          style={[
                            styles.activityContent,
                            index === jobActivities.length - 1
                              ? {}
                              : styles.activityContentBorder,
                          ]}>
                          <View
                            style={[
                              styles.activityCard,
                              {
                                backgroundColor: config.bgColor,
                                borderColor: config.borderColor,
                              },
                            ]}>
                            <View style={styles.activityHeader}>
                              <Text style={styles.activityTitle}>
                                {activity.title}
                              </Text>
                              <View style={styles.activityTimestamp}>
                                <Text style={styles.activityDate}>{date}</Text>
                                {/* <Text style={styles.activityTime}>{time}</Text> */}
                              </View>
                            </View>

                            <Text style={styles.activityDescription}>
                              {activity.description}
                            </Text>

                            <View style={styles.activityFooter}>
                              <View style={styles.activityUser}>
                                <Icon name="person" size={16} color="#6B7280" />
                                <Text style={styles.activityUserText}>
                                  {activity.user}
                                </Text>
                              </View>

                              <View style={styles.metadataBadges}>
                                {activity.metadata?.hours ? (
                                  <View
                                    style={[
                                      styles.metadataBadge,
                                      {backgroundColor: '#FED7AA'},
                                    ]}>
                                    <Text
                                      style={[
                                        styles.metadataBadgeText,
                                        {color: '#C2410C'},
                                      ]}>
                                      {activity.metadata.hours}h
                                    </Text>
                                  </View>
                                ) : null}

                                {activity.metadata?.status ? (
                                  <View
                                    style={[
                                      styles.metadataBadge,
                                      {
                                        backgroundColor:
                                          activity.metadata.status ===
                                          'completed'
                                            ? '#A7F3D0'
                                            : activity.metadata.status ===
                                              'in-progress'
                                            ? '#DBEAFE'
                                            : '#E5E7EB',
                                      },
                                    ]}>
                                    <Text
                                      style={[
                                        styles.metadataBadgeText,
                                        {
                                          color:
                                            activity.metadata.status ===
                                            'completed'
                                              ? '#059669'
                                              : activity.metadata.status ===
                                                'in-progress'
                                              ? '#3B82F6'
                                              : '#6B7280',
                                        },
                                      ]}>
                                      {String(activity.metadata.status).replace(
                                        '-',
                                        ' ',
                                      )}
                                    </Text>
                                  </View>
                                ) : null}
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

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------------- Styles (updated slightly) ----------------
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F9FAFB'},
  header: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 4,
  },
  backButton: {padding: 8, borderRadius: 8},
  headerContent: {flex: 1, alignItems: 'center'},
  headerTitle: {fontSize: 20, fontWeight: '600', color: '#FFFFFF'},
  headerSubtitle: {fontSize: 14, color: '#BFDBFE', marginTop: 2},
  headerSpacer: {width: 40},
  scrollView: {flex: 1},
  content: {padding: 16},
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 6,
  },
  summaryHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: 20},
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 12,
  },
  summaryGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 16},
  summaryItem: {width: widthPercentageToDP(38), alignItems: 'center'},
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
  timelineContent: {flex: 1},
  emptyState: {alignItems: 'center', paddingVertical: 48},
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
  timeline: {position: 'relative'},
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
  activityContent: {flex: 1},
  activityContentBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 24,
  },
  activityCard: {borderWidth: 1, borderRadius: 12, padding: 16},
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
  activityTimestamp: {alignItems: 'flex-end'},
  activityDate: {fontSize: 14, fontWeight: '600', color: '#1F2937'},
  activityTime: {fontSize: 12, color: '#6B7280', marginTop: 2},
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
  activityUser: {flexDirection: 'row', alignItems: 'center', gap: 8},
  activityUserText: {fontSize: 14, color: '#6B7280', fontWeight: '500'},
  metadataBadges: {flexDirection: 'row', flexWrap: 'wrap', gap: 6},
  metadataBadge: {paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16},
  metadataBadgeText: {fontSize: 12, fontWeight: '600'},
  bottomSpacer: {height: 32},
});

export default JobActivityLogScreen;
