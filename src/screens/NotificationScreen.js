// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   SafeAreaView,
//   StyleSheet,
//   StatusBar,
//   TextInput,
//   Alert,
// } from 'react-native';

// const NotificationScreen = () => {
//   const [selectedFilter, setSelectedFilter] = useState('All');
//   const [searchQuery, setSearchQuery] = useState('');

//   const filters = ['All', 'Jobs', 'Timer', 'Materials', 'System', 'Team'];

//   const notifications = [
//     {
//       id: 1,
//       type: 'Jobs',
//       title: 'New Job Assignment',
//       message: 'You have been assigned to JOB-003: Emergency Generator Maintenance',
//       time: '5 minutes ago',
//       isRead: false,
//       priority: 'high',
//       icon: '📋',
//       actionable: true,
//       jobId: 'JOB-003',
//     },
//     {
//       id: 2,
//       type: 'Timer',
//       title: 'Timer Reminder',
//       message: 'You have been working for 4 hours. Consider taking a break.',
//       time: '15 minutes ago',
//       isRead: false,
//       priority: 'medium',
//       icon: '⏰',
//       actionable: false,
//     },
//     {
//       id: 3,
//       type: 'Materials',
//       title: 'Material Order Delivered',
//       message: 'Your order #ORD-145 has been delivered to the job site',
//       time: '1 hour ago',
//       isRead: true,
//       priority: 'low',
//       icon: '📦',
//       actionable: true,
//       orderId: 'ORD-145',
//     },
//     {
//       id: 4,
//       type: 'System',
//       title: 'App Update Available',
//       message: 'Version 1.1.0 is now available with new features and bug fixes',
//       time: '2 hours ago',
//       isRead: true,
//       priority: 'low',
//       icon: '🔄',
//       actionable: true,
//     },
//     {
//       id: 5,
//       type: 'Jobs',
//       title: 'Job Schedule Change',
//       message: 'JOB-001 has been rescheduled from 8:00 AM to 10:00 AM tomorrow',
//       time: '3 hours ago',
//       isRead: false,
//       priority: 'medium',
//       icon: '📅',
//       actionable: true,
//       jobId: 'JOB-001',
//     },
//     {
//       id: 6,
//       type: 'Team',
//       title: 'Team Message',
//       message: 'David Thompson: "Great job on the Metro Hospital project team!"',
//       time: '4 hours ago',
//       isRead: true,
//       priority: 'low',
//       icon: '💬',
//       actionable: false,
//     },
//     {
//       id: 7,
//       type: 'Timer',
//       title: 'Timesheet Reminder',
//       message: 'Don\'t forget to submit your timesheet for this week by Friday',
//       time: '1 day ago',
//       isRead: true,
//       priority: 'medium',
//       icon: '📝',
//       actionable: true,
//     },
//     {
//       id: 8,
//       type: 'System',
//       title: 'Maintenance Notice',
//       message: 'Scheduled system maintenance tonight from 11 PM to 1 AM',
//       time: '1 day ago',
//       isRead: true,
//       priority: 'medium',
//       icon: '🔧',
//       actionable: false,
//     },
//   ];

//   const getFilteredNotifications = () => {
//     let filtered = notifications;
    
//     if (selectedFilter !== 'All') {
//       filtered = filtered.filter(notification => notification.type === selectedFilter);
//     }
    
//     if (searchQuery) {
//       filtered = filtered.filter(notification => 
//         notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         notification.message.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
    
//     return filtered;
//   };

//   const getUnreadCount = () => {
//     return notifications.filter(n => !n.isRead).length;
//   };

//   const markAsRead = (id) => {
//     // Implementation to mark notification as read
//     Alert.alert('Marked as Read', 'Notification marked as read');
//   };

//   const markAllAsRead = () => {
//     Alert.alert(
//       'Mark All as Read',
//       'Are you sure you want to mark all notifications as read?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Mark All', onPress: () => Alert.alert('Success', 'All notifications marked as read') },
//       ]
//     );
//   };

//   const handleNotificationAction = (notification) => {
//     if (!notification.actionable) return

//     switch (notification.type) {
//       case 'Jobs':
//         Alert.alert('View Job', `Opening job ${notification.jobId}`);
//         break;
//       case 'Materials':
//         Alert.alert('View Order', `Opening order ${notification.orderId}`);
//         break;
//       case 'System':
//         if (notification.title.includes('Update')) {
//           Alert.alert('Update App', 'Redirecting to app store...');
//         }
//         break;
//       case 'Timer':
//         if (notification.title.includes('Timesheet')) {
//           Alert.alert('Open Timesheet', 'Opening timesheet screen...');
//         }
//         break;
//       default:
//         Alert.alert('Action', 'Opening related screen...');
//     }
//   };

//   const deleteNotification = (id) => {
//     Alert.alert(
//       'Delete Notification',
//       'Are you sure you want to delete this notification?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Deleted', 'Notification deleted') },
//       ]
//     );
//   };

//   const renderFilterButton = ({ item }) => (
//     <TouchableOpacity
//       style={[
//         styles.filterButton,
//         selectedFilter === item && styles.activeFilterButton,
//       ]}
//       onPress={() => setSelectedFilter(item)}
//     >
//       <Text style={[
//         styles.filterText,
//         selectedFilter === item && styles.activeFilterText,
//       ]}>
//         {item}
//       </Text>
//     </TouchableOpacity>
//   );

//   const renderNotification = ({ item  }) => (
//     <TouchableOpacity 
//       style={[
//         styles.notificationCard,
//         !item.isRead && styles.unreadNotificationCard,
//       ]}
//       onPress={() => handleNotificationAction(item)}
//     >
//       <View style={styles.notificationHeader}>
//         <View style={styles.notificationLeft}>
//           <Text style={styles.notificationIcon}>{item.icon}</Text>
//           <View style={styles.notificationContent}>
//             <View style={styles.notificationTitleRow}>
//               <Text style={[
//                 styles.notificationTitle,
//                 !item.isRead && styles.unreadNotificationTitle,
//               ]}>
//                 {item.title}
//               </Text>
//               {!item.isRead && <View style={styles.unreadDot} />}
//             </View>
//             <Text style={styles.notificationMessage}>{item.message}</Text>
//             <Text style={styles.notificationTime}>{item.time}</Text>
//           </View>
//         </View>
        
//         <View style={styles.notificationActions}>
//           <View style={[
//             styles.priorityBadge,
//             {
//               backgroundColor: 
//                 item.priority === 'high' ? '#FEE2E2' :
//                 item.priority === 'medium' ? '#FEF3C7' : '#F0FDF4'
//             }
//           ]}>
//             <Text style={[
//               styles.priorityText,
//               {
//                 color: 
//                   item.priority === 'high' ? '#DC2626' :
//                   item.priority === 'medium' ? '#D97706' : '#15803D'
//               }
//             ]}>
//               {item.priority.toUpperCase()}
//             </Text>
//           </View>
          
//           <TouchableOpacity 
//             style={styles.actionButton}
//             onPress={(e) => {
//               e.stopPropagation();
//               if (!item.isRead) {
//                 markAsRead(item.id);
//               } else {
//                 deleteNotification(item.id);
//               }
//             }}
//           >
//             <Text style={styles.actionButtonText}>
//               {!item.isRead ? '✓' : '🗑️'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {item.actionable && (
//         <View style={styles.actionIndicator}>
//           <Text style={styles.actionIndicatorText}>Tap to view details →</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Notifications</Text>
//         <View style={styles.headerActions}>
//           <View style={styles.unreadBadge}>
//             <Text style={styles.unreadBadgeText}>{getUnreadCount()} unread</Text>
//           </View>
//           <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
//             <Text style={styles.markAllButtonText}>Mark All Read</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Search */}
//       <View style={styles.searchSection}>
//         <View style={styles.searchContainer}>
//           <Text style={styles.searchIcon}>🔍</Text>
//           <TextInput
//             style={styles.searchInput}
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             placeholder="Search notifications..."
//             placeholderTextColor="#9CA3AF"
//           />
//         </View>
//       </View>

//       {/* Filters */}
//       <View style={styles.filtersSection}>
//         <FlatList
//           horizontal
//           data={filters}
//           renderItem={renderFilterButton}
//           keyExtractor={(item) => item}
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.filtersList}
//         />
//       </View>

//       {/* Notifications List */}
//       <FlatList
//         data={getFilteredNotifications()}
//         renderItem={renderNotification}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.notificationsList}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={() => (
//           <View style={styles.emptyState}>
//             <Text style={styles.emptyStateIcon}>🔔</Text>
//             <Text style={styles.emptyStateTitle}>No Notifications</Text>
//             <Text style={styles.emptyStateMessage}>
//               {searchQuery ? 'No notifications match your search' : 'You\'re all caught up!'}
//             </Text>
//           </View>
//         )}
//       />

//       {/* Quick Actions */}
//       <View style={styles.quickActions}>
//         <TouchableOpacity style={styles.quickActionButton}>
//           <Text style={styles.quickActionText}>⚙️ Notification Settings</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.quickActionButton}>
//           <Text style={styles.quickActionText}>📱 Push Settings</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8FAFC',
//   },
//   header: {
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#111827',
//   },
//   headerActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   unreadBadge: {
//     backgroundColor: '#FEE2E2',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   unreadBadgeText: {
//     fontSize: 12,
//     color: '#DC2626',
//     fontWeight: '500',
//   },
//   markAllButton: {
//     backgroundColor: '#1E40AF',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 6,
//   },
//   markAllButtonText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   searchSection: {
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   searchContainer: {
//     backgroundColor: '#F9FAFB',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   searchIcon: {
//     fontSize: 16,
//     marginRight: 12,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#111827',
//   },
//   filtersSection: {
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   filtersList: {
//     paddingHorizontal: 20,
//   },
//   filterButton: {
//     backgroundColor: '#F3F4F6',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginRight: 12,
//   },
//   activeFilterButton: {
//     backgroundColor: '#1E40AF',
//   },
//   filterText: {
//     fontSize: 14,
//     color: '#6B7280',
//     fontWeight: '500',
//   },
//   activeFilterText: {
//     color: '#FFFFFF',
//   },
//   notificationsList: {
//     padding: 16,
//   },
//   notificationCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderLeftWidth: 4,
//     borderLeftColor: '#E5E7EB',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   unreadNotificationCard: {
//     borderLeftColor: '#1E40AF',
//     backgroundColor: '#FEFEFE',
//   },
//   notificationHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   notificationLeft: {
//     flexDirection: 'row',
//     flex: 1,
//   },
//   notificationIcon: {
//     fontSize: 20,
//     marginRight: 12,
//     marginTop: 2,
//   },
//   notificationContent: {
//     flex: 1,
//   },
//   notificationTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   notificationTitle: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#111827',
//     flex: 1,
//   },
//   unreadNotificationTitle: {
//     fontWeight: '600',
//   },
//   unreadDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#1E40AF',
//     marginLeft: 8,
//   },
//   notificationMessage: {
//     fontSize: 14,
//     color: '#6B7280',
//     lineHeight: 20,
//     marginBottom: 8,
//   },
//   notificationTime: {
//     fontSize: 12,
//     color: '#9CA3AF',
//   },
//   notificationActions: {
//     alignItems: 'flex-end',
//     gap: 8,
//   },
//   priorityBadge: {
//     paddingHorizontal: 6,
//     paddingVertical: 3,
//     borderRadius: 8,
//   },
//   priorityText: {
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   actionButton: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: '#F3F4F6',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   actionButtonText: {
//     fontSize: 14,
//   },
//   actionIndicator: {
//     marginTop: 12,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#F3F4F6',
//   },
//   actionIndicatorText: {
//     fontSize: 12,
//     color: '#1E40AF',
//     fontWeight: '500',
//     textAlign: 'center',
//   },
//   emptyState: {
//     alignItems: 'center',
//     paddingVertical: 60,
//   },
//   emptyStateIcon: {
//     fontSize: 48,
//     marginBottom: 16,
//   },
//   emptyStateTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: 8,
//   },
//   emptyStateMessage: {
//     fontSize: 14,
//     color: '#6B7280',
//     textAlign: 'center',
//   },
//   quickActions: {
//     backgroundColor: '#FFFFFF',
//     flexDirection: 'row',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//     gap: 12,
//   },
//   quickActionButton: {
//     flex: 1,
//     backgroundColor: '#F3F4F6',
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   quickActionText: {
//     color: '#6B7280',
//     fontSize: 12,
//     fontWeight: '500',
//   },
// });

// export default NotificationScreen;





import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP } from '../utils';

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

// Embedded Spacing and Dimensions
const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const BorderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
};

const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
};
const NotificationScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockNotifications = [
        {
          id: '1',
          type: 'job_assigned',
          title: 'New Job Assigned',
          message: 'You have been assigned to "Electrical Panel Upgrade" at ABC Manufacturing.',
          timestamp: '2024-01-15T09:00:00Z',
          isRead: false,
          actionRequired: true,
          relatedJobId: 'job1',
        },
        {
          id: '2',
          type: 'reminder',
          title: 'Job Reminder',
          message: 'Don\'t forget about your scheduled job at XYZ Office Complex at 2:00 PM today.',
          timestamp: '2024-01-15T08:30:00Z',
          isRead: false,
          actionRequired: false,
          relatedJobId: 'job2',
        },
        {
          id: '3',
          type: 'job_updated',
          title: 'Job Status Updated',
          message: 'Job "Emergency Repair" has been marked as high priority.',
          timestamp: '2024-01-14T16:45:00Z',
          isRead: true,
          actionRequired: false,
          relatedJobId: 'job3',
        },
        {
          id: '4',
          type: 'system',
          title: 'App Update Available',
          message: 'A new version of the JDP Electrics app is available. Update now for the latest features.',
          timestamp: '2024-01-14T14:20:00Z',
          isRead: true,
          actionRequired: false,
        },
        {
          id: '5',
          type: 'message',
          title: 'Message from Manager',
          message: 'Great work on the recent installations. Keep up the excellent service!',
          timestamp: '2024-01-13T11:15:00Z',
          isRead: true,
          actionRequired: false,
        },
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      Alert.alert('Error', 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setNotifications(prev => 
              prev.filter(notification => notification.id !== notificationId)
            );
          },
        },
      ]
    );
  };

  const handleNotificationPress = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    if (notification.relatedJobId) {
      navigation.navigate('JobDetailScreen' , { jobId: notification.relatedJobId });
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'job_assigned':
        return 'work';
      case 'job_updated':
        return 'update';
      case 'reminder':
        return 'alarm';
      case 'system':
        return 'settings';
      case 'message':
        return 'message';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'job_assigned':
        return Colors.primary;
      case 'job_updated':
        return Colors.warning;
      case 'reminder':
        return Colors.error;
      case 'system':
        return Colors.textSecondary;
      case 'message':
        return Colors.success;
      default:
        return Colors.textSecondary;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' || (filter === 'unread' && !notification.isRead)
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color={Colors.text} />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Notifications</Text>
      
      {unreadCount > 0 && (
        <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
          <Text style={styles.markAllText}>Mark All Read</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFilters = () => (
    <View style={[styles.filtersContainer,{marginVertical:10, border:1, borderColor:"red", backgroundColor: 'rgba(183, 188, 223, 0.09)',}]}>
      <TouchableOpacity
        style={[styles.filterButton, filter === 'all' && styles.activeFilter, {width:widthPercentageToDP(45),}]}
        onPress={() => setFilter('all')}
      >
        <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText,{alignSelf:"center"}]}>
          All ({notifications.length})
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.filterButton, filter === 'unread' && styles.activeFilter,{width:widthPercentageToDP(45)}]}
        onPress={() => setFilter('unread')}
      >
        <Text style={[styles.filterText, filter === 'unread' && styles.activeFilterText,{alignSelf:"center"}]}>
          Unread ({unreadCount})
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderNotification = (notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationCard,
        !notification.isRead && styles.unreadNotification,
      ]}
      onPress={() => handleNotificationPress(notification)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationIcon}>
          <Icon 
            name={getNotificationIcon(notification.type)} 
            size={24} 
            color={getNotificationColor(notification.type)} 
          />
        </View>
        
        <View style={styles.notificationContent}>
          <View style={styles.notificationTitleRow}>
            <Text style={[
              styles.notificationTitle,
              !notification.isRead && styles.unreadTitle,
            ]}>
              {notification.title}
            </Text>
            {!notification.isRead && <View style={styles.unreadDot} />}
          </View>
          
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {notification.message}
          </Text>
          
          <Text style={styles.notificationTime}>
            {formatTimestamp(notification.timestamp)}
          </Text>
          
          {notification.actionRequired && (
            <View style={styles.actionRequired}>
              <Icon name="priority-high" size={16} color={Colors.error} />
              <Text style={styles.actionRequiredText}>Action Required</Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteNotification(notification.id)}
        >
          <Icon name="close" size={20} color={Colors.textLight} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="notifications-none" size={80} color={Colors.textLight} />
      <Text style={styles.emptyTitle}>
        {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {filter === 'unread' 
          ? 'All caught up! You have no unread notifications.'
          : 'You\'ll see job updates and important messages here.'
        }
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      
      {renderHeader()}
      {renderFilters()}
      
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {filteredNotifications.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.notificationsList}>
            {filteredNotifications.map(renderNotification)}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// Embedded Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },

  // Header
  header: {
    backgroundColor: Colors.white,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  markAllButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  markAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },

  // Filters
  filtersContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    width:'100%'
  },
  filterButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.sm,
    backgroundColor: Colors.backgroundLight,
  },
  activeFilter: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeFilterText: {
    color: Colors.white,
  },

  // Scroll Container
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },

  // Notifications List
  notificationsList: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },

  // Notification Card
  notificationCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    flex: 1,
  },
  unreadTitle: {
    fontWeight: '600',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: Spacing.sm,
  },
  notificationMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  notificationTime: {
    fontSize: 12,
    color: Colors.textLight,
  },
  actionRequired: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  actionRequiredText: {
    fontSize: 12,
    color: Colors.error,
    fontWeight: '500',
  },
  deleteButton: {
    padding: Spacing.xs,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default NotificationScreen;