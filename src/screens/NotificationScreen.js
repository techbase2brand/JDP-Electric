// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   StatusBar,
//   StyleSheet,
//   RefreshControl,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useNavigation } from '@react-navigation/native';
// import { widthPercentageToDP } from '../utils';

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
//   sm: {
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
// };
// const NotificationScreen = () => {
//   const navigation = useNavigation();
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [filter, setFilter] = useState('all');

//   useEffect(() => {
//     StatusBar.setBarStyle('dark-content');
//     loadNotifications();
//   }, []);

//   const loadNotifications = async () => {
//     setLoading(true);
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));

//       const mockNotifications = [
//         {
//           id: '1',
//           type: 'job_assigned',
//           title: 'New Job Assigned',
//           message: 'You have been assigned to "Electrical Panel Upgrade" at ABC Manufacturing.',
//           timestamp: '2024-01-15T09:00:00Z',
//           isRead: false,
//           actionRequired: true,
//           relatedJobId: 'job1',
//         },
//         {
//           id: '2',
//           type: 'reminder',
//           title: 'Job Reminder',
//           message: 'Don\'t forget about your scheduled job at XYZ Office Complex at 2:00 PM today.',
//           timestamp: '2024-01-15T08:30:00Z',
//           isRead: false,
//           actionRequired: false,
//           relatedJobId: 'job2',
//         },
//         {
//           id: '3',
//           type: 'job_updated',
//           title: 'Job Status Updated',
//           message: 'Job "Emergency Repair" has been marked as high priority.',
//           timestamp: '2024-01-14T16:45:00Z',
//           isRead: true,
//           actionRequired: false,
//           relatedJobId: 'job3',
//         },
//         {
//           id: '4',
//           type: 'system',
//           title: 'App Update Available',
//           message: 'A new version of the JDP Electrics app is available. Update now for the latest features.',
//           timestamp: '2024-01-14T14:20:00Z',
//           isRead: true,
//           actionRequired: false,
//         },
//         {
//           id: '5',
//           type: 'message',
//           title: 'Message from Manager',
//           message: 'Great work on the recent installations. Keep up the excellent service!',
//           timestamp: '2024-01-13T11:15:00Z',
//           isRead: true,
//           actionRequired: false,
//         },
//       ];

//       setNotifications(mockNotifications);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to load notifications');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadNotifications();
//     setRefreshing(false);
//   };

//   const markAsRead = (notificationId) => {
//     setNotifications(prev =>
//       prev.map(notification =>
//         notification.id === notificationId
//           ? { ...notification, isRead: true }
//           : notification
//       )
//     );
//   };

//   const markAllAsRead = () => {
//     setNotifications(prev =>
//       prev.map(notification => ({ ...notification, isRead: true }))
//     );
//   };

//   const deleteNotification = (notificationId) => {
//     Alert.alert(
//       'Delete Notification',
//       'Are you sure you want to delete this notification?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: () => {
//             setNotifications(prev =>
//               prev.filter(notification => notification.id !== notificationId)
//             );
//           },
//         },
//       ]
//     );
//   };

//   const handleNotificationPress = (notification) => {
//     if (!notification.isRead) {
//       markAsRead(notification.id);
//     }

//     if (notification.relatedJobId) {
//       navigation.navigate('JobDetailScreen' , { jobId: notification.relatedJobId });
//     }
//   };

//   const getNotificationIcon = (type) => {
//     switch (type) {
//       case 'job_assigned':
//         return 'work';
//       case 'job_updated':
//         return 'update';
//       case 'reminder':
//         return 'alarm';
//       case 'system':
//         return 'settings';
//       case 'message':
//         return 'message';
//       default:
//         return 'notifications';
//     }
//   };

//   const getNotificationColor = (type) => {
//     switch (type) {
//       case 'job_assigned':
//         return Colors.primary;
//       case 'job_updated':
//         return Colors.warning;
//       case 'reminder':
//         return Colors.error;
//       case 'system':
//         return Colors.textSecondary;
//       case 'message':
//         return Colors.success;
//       default:
//         return Colors.textSecondary;
//     }
//   };

//   const formatTimestamp = (timestamp) => {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

//     if (diffInHours < 1) {
//       return 'Just now';
//     } else if (diffInHours < 24) {
//       return `${diffInHours}h ago`;
//     } else {
//       const diffInDays = Math.floor(diffInHours / 24);
//       return `${diffInDays}d ago`;
//     }
//   };

//   const filteredNotifications = notifications.filter(notification =>
//     filter === 'all' || (filter === 'unread' && !notification.isRead)
//   );

//   const unreadCount = notifications.filter(n => !n.isRead).length;

//   const renderHeader = () => (
//     <View style={styles.header}>
//       <TouchableOpacity
//         style={styles.backButton}
//         onPress={() => navigation.goBack()}
//       >
//         <Icon name="arrow-back" size={24} color={Colors.text} />
//       </TouchableOpacity>

//       <Text style={styles.headerTitle}>Notifications</Text>

//       {unreadCount > 0 && (
//         <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
//           <Text style={styles.markAllText}>Mark All Read</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );

//   const renderFilters = () => (
//     <View style={[styles.filtersContainer,{marginVertical:10, border:1, borderColor:"red", backgroundColor: 'rgba(183, 188, 223, 0.09)',}]}>
//       <TouchableOpacity
//         style={[styles.filterButton, filter === 'all' && styles.activeFilter, {width:widthPercentageToDP(45),}]}
//         onPress={() => setFilter('all')}
//       >
//         <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText,{alignSelf:"center"}]}>
//           All ({notifications.length})
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[styles.filterButton, filter === 'unread' && styles.activeFilter,{width:widthPercentageToDP(45)}]}
//         onPress={() => setFilter('unread')}
//       >
//         <Text style={[styles.filterText, filter === 'unread' && styles.activeFilterText,{alignSelf:"center"}]}>
//           Unread ({unreadCount})
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const renderNotification = (notification) => (
//     <TouchableOpacity
//       key={notification.id}
//       style={[
//         styles.notificationCard,
//         !notification.isRead && styles.unreadNotification,
//       ]}
//       onPress={() => handleNotificationPress(notification)}
//     >
//       <View style={styles.notificationHeader}>
//         <View style={styles.notificationIcon}>
//           <Icon
//             name={getNotificationIcon(notification.type)}
//             size={24}
//             color={getNotificationColor(notification.type)}
//           />
//         </View>

//         <View style={styles.notificationContent}>
//           <View style={styles.notificationTitleRow}>
//             <Text style={[
//               styles.notificationTitle,
//               !notification.isRead && styles.unreadTitle,
//             ]}>
//               {notification.title}
//             </Text>
//             {!notification.isRead && <View style={styles.unreadDot} />}
//           </View>

//           <Text style={styles.notificationMessage} numberOfLines={2}>
//             {notification.message}
//           </Text>

//           <Text style={styles.notificationTime}>
//             {formatTimestamp(notification.timestamp)}
//           </Text>

//           {notification.actionRequired && (
//             <View style={styles.actionRequired}>
//               <Icon name="priority-high" size={16} color={Colors.error} />
//               <Text style={styles.actionRequiredText}>Action Required</Text>
//             </View>
//           )}
//         </View>

//         <TouchableOpacity
//           style={styles.deleteButton}
//           onPress={() => deleteNotification(notification.id)}
//         >
//           <Icon name="close" size={20} color={Colors.textLight} />
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderEmptyState = () => (
//     <View style={styles.emptyContainer}>
//       <Icon name="notifications-none" size={80} color={Colors.textLight} />
//       <Text style={styles.emptyTitle}>
//         {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
//       </Text>
//       <Text style={styles.emptySubtitle}>
//         {filter === 'unread'
//           ? 'All caught up! You have no unread notifications.'
//           : 'You\'ll see job updates and important messages here.'
//         }
//       </Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

//       {renderHeader()}
//       {renderFilters()}

//       <ScrollView
//         style={styles.scrollContainer}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={[Colors.primary]}
//             tintColor={Colors.primary}
//           />
//         }
//         contentContainerStyle={styles.scrollContent}
//       >
//         {filteredNotifications.length === 0 ? (
//           renderEmptyState()
//         ) : (
//           <View style={styles.notificationsList}>
//             {filteredNotifications.map(renderNotification)}
//           </View>
//         )}
//       </ScrollView>
//     </View>
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
//   markAllButton: {
//     paddingVertical: Spacing.sm,
//     paddingHorizontal: Spacing.md,
//   },
//   markAllText: {
//     fontSize: 14,
//     color: Colors.primary,
//     fontWeight: '500',
//   },

//   // Filters
//   filtersContainer: {
//     flexDirection: 'row',
//     backgroundColor: Colors.white,
//     paddingHorizontal: Spacing.md,
//     paddingBottom: Spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//     width:'100%'
//   },
//   filterButton: {
//     paddingVertical: Spacing.sm,
//     paddingHorizontal: Spacing.md,
//     borderRadius: BorderRadius.md,
//     marginRight: Spacing.sm,
//     backgroundColor: Colors.backgroundLight,
//   },
//   activeFilter: {
//     backgroundColor: Colors.primary,
//   },
//   filterText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: Colors.textSecondary,
//   },
//   activeFilterText: {
//     color: Colors.white,
//   },

//   // Scroll Container
//   scrollContainer: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: Spacing.xl,
//   },

//   // Notifications List
//   notificationsList: {
//     padding: Spacing.md,
//     gap: Spacing.sm,
//   },

//   // Notification Card
//   notificationCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     ...Shadows.sm,
//   },
//   unreadNotification: {
//     borderLeftWidth: 4,
//     borderLeftColor: Colors.primary,
//   },
//   notificationHeader: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   notificationIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: Colors.backgroundLight,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: Spacing.md,
//   },
//   notificationContent: {
//     flex: 1,
//   },
//   notificationTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: Spacing.xs,
//   },
//   notificationTitle: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: Colors.text,
//     flex: 1,
//   },
//   unreadTitle: {
//     fontWeight: '600',
//   },
//   unreadDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: Colors.primary,
//     marginLeft: Spacing.sm,
//   },
//   notificationMessage: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     lineHeight: 20,
//     marginBottom: Spacing.sm,
//   },
//   notificationTime: {
//     fontSize: 12,
//     color: Colors.textLight,
//   },
//   actionRequired: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: Spacing.sm,
//     gap: Spacing.xs,
//   },
//   actionRequiredText: {
//     fontSize: 12,
//     color: Colors.error,
//     fontWeight: '500',
//   },
//   deleteButton: {
//     padding: Spacing.xs,
//   },

//   // Empty State
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: Spacing.xl,
//   },
//   emptyTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: Colors.text,
//     marginTop: Spacing.lg,
//     marginBottom: Spacing.sm,
//   },
//   emptySubtitle: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//     textAlign: 'center',
//     lineHeight: 22,
//   },
// });

// export default NotificationScreen;

// NotificationScreen.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {widthPercentageToDP} from '../utils';
import {
  getNotificationsByUser,
  markNotificationAsRead,
  deleteNotificationRecipient,
} from '../config/apiConfig';
import {useSelector} from 'react-redux';

// Colors, Spacing, BorderRadius, Shadows
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
const Spacing = {xs: 4, sm: 8, md: 16, lg: 24, xl: 32};
const BorderRadius = {sm: 6, md: 8, lg: 12};
const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
};

const NotificationScreen = ({route}) => {
  const navigation = useNavigation();
  const user = useSelector(state => state.user.user);
  const token = useSelector(state => state.user.token);
  const userId = user?.id;

  const [allNotifications, setAllNotifications] = useState([]); // all notifications from API
  const [notifications, setNotifications] = useState([]); // filtered notifications
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const [hasNextPage, setHasNextPage] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    loadInitial();
  }, []);

  // Local filter whenever filter changes
  useEffect(() => {
    if (filter === 'all') {
      setNotifications(allNotifications);
    } else if (filter === 'unread') {
      setNotifications(allNotifications.filter(n => n.status === 'unread'));
    }
  }, [filter, allNotifications]);

  const loadInitial = async () => {
    setLoading(true);
    setPage(1);
    setHasNextPage(true);
    try {
      const res = await getNotificationsByUser(userId, 1, limit, token, 'all'); // fetch all
      const items = res?.data?.items ?? [];
      console.log('items>>>>', items);
      setAllNotifications(items);
      setUnreadCount(items.filter(i => i.status === 'unread').length);
      setNotifications(items);
      const totalPages = res?.data?.pagination?.total_pages ?? 1;
      setHasNextPage(1 < totalPages);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err?.message || 'Unable to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loadingMore || !hasNextPage) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const res = await getNotificationsByUser(
        userId,
        nextPage,
        limit,
        token,
        'all',
      ); // fetch all
      const items = res?.data?.items ?? [];
      setAllNotifications(prev => [...prev, ...items]); // update full list

      // apply current filter locally
      if (filter === 'all') {
        setNotifications(prev => [...prev, ...items]);
      } else if (filter === 'unread') {
        setNotifications(prev => [
          ...prev,
          ...items.filter(n => n.status === 'unread'),
        ]);
      }

      const totalPages = res?.data?.pagination?.total_pages ?? nextPage;
      setHasNextPage(nextPage < totalPages);
      setPage(nextPage);
      setUnreadCount(
        prev => prev + items.filter(i => i.status === 'unread').length,
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitial();
    setRefreshing(false);
  };

  const handleNotificationPress = async recipient => {
    try {
      if (recipient.status !== 'read') {
        setAllNotifications(prev =>
          prev.map(r =>
            r.recipient_id === recipient.recipient_id
              ? {...r, status: 'read', read_at: new Date().toISOString()}
              : r,
          ),
        );
        setUnreadCount(u => Math.max(0, u - 1));
        await markNotificationAsRead(recipient.recipient_id, token);
      }

      const customLink = recipient.notification?.custom_link;
      // console.log("customLinkcustomLink",recipient.notification?.job_id);

      // if (customLink) {
      //   // navigation.navigate('WebViewScreen', { url: customLink });
      // } else
      if (recipient.notification?.job_id || recipient.relatedJobId) {
        navigation.navigate('JobStack', {
          jobId: recipient.notification.job_id || recipient.relatedJobId,
        });
      } else {
        // navigation.navigate('NotificationDetailScreen', {recipient});
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to mark notification as read');
      await loadInitial();
    }
  };

  const confirmDelete = recipient => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDelete(recipient),
        },
      ],
    );
  };

  const handleDelete = async recipient => {
    try {
      setAllNotifications(prev =>
        prev.filter(r => r.recipient_id !== recipient.recipient_id),
      );
      setNotifications(prev =>
        prev.filter(r => r.recipient_id !== recipient.recipient_id),
      );
      await deleteNotificationRecipient(recipient.recipient_id, token);
      setUnreadCount(prev =>
        recipient.status === 'unread' ? Math.max(0, prev - 1) : prev,
      );
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to delete notification');
      await loadInitial();
    }
  };

  const renderNotification = ({item}) => {
    const isRead = item.status === 'read';
    const title =
      item.notification?.notification_title ??
      item.notification?.message ??
      'Notification';
    const message = item.notification?.message ?? '';
    const timestamp =
      item.read_at ?? item.notification?.created_at ?? item.delivered_at;

    return (
      <TouchableOpacity
        style={[styles.notificationCard, !isRead && styles.unreadNotification]}
        onPress={() => handleNotificationPress(item)}>
        <View style={styles.notificationHeader}>
          <View style={styles.notificationIcon}>
            <Icon
              name="notifications"
              size={20}
              color={isRead ? Colors.textSecondary : Colors.primary}
            />
          </View>

          <View style={styles.notificationContent}>
            <View style={styles.notificationTitleRow}>
              <Text
                style={[
                  styles.notificationTitle,
                  !isRead && styles.unreadTitle,
                ]}>
                {title}
              </Text>
              {!isRead && <View style={styles.unreadDot} />}
            </View>

            <Text style={styles.notificationMessage} numberOfLines={2}>
              {message}
            </Text>

            <Text style={styles.notificationTime}>
              {formatTimestamp(timestamp)}
            </Text>

            {item.notification?.actionRequired && (
              <View style={styles.actionRequired}>
                <Icon name="priority-high" size={16} color={Colors.error} />
                <Text style={styles.actionRequiredText}>Action Required</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => confirmDelete(item)}>
            <Icon name="close" size={20} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const ListFooter = () => {
    if (!loadingMore) return null;
    return <View style={{padding: 12}} />;
  };

  const formatTimestamp = timestamp => {
    if (!timestamp) return '';
    const utcDate = new Date(timestamp);
    const localDate = new Date(
      utcDate.getTime() - utcDate.getTimezoneOffset() * 60000,
    );
    const now = new Date();
    const diffInMs = now.getTime() - localDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    }
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifications</Text>
        <Text></Text>
      </View>

      <View
        style={[
          styles.filtersContainer,
          {marginVertical: 10, backgroundColor: 'rgba(183, 188, 223, 0.09)'},
        ]}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' && styles.activeFilter,
            {width: widthPercentageToDP(45)},
          ]}
          onPress={() => setFilter('all')}>
          <Text
            style={[
              styles.filterText,
              filter === 'all' && styles.activeFilterText,
            ]}>
            All ({allNotifications.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'unread' && styles.activeFilter,
            {width: widthPercentageToDP(45)},
          ]}
          onPress={() => setFilter('unread')}>
          <Text
            style={[
              styles.filterText,
              filter === 'unread' && styles.activeFilterText,
            ]}>
            Unread ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => String(item.recipient_id)}
        renderItem={renderNotification}
        contentContainerStyle={{padding: Spacing.md, paddingBottom: Spacing.xl}}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (!loading && hasNextPage) loadMore();
        }}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Icon
                name="notifications-none"
                size={80}
                color={Colors.textLight}
              />
              <Text style={styles.emptyTitle}>
                {filter === 'unread'
                  ? 'No unread notifications'
                  : 'No notifications'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {filter === 'unread'
                  ? 'All caught up! You have no unread notifications.'
                  : "You'll see job updates and important messages here."}
              </Text>
            </View>
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListFooterComponent={ListFooter}
      />

      {loading && (
        <View
          style={{
            position: 'absolute',
            top: '45%',
            left: 0,
            right: 0,
            alignItems: 'center',
          }}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.backgroundLight},
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
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {fontSize: 20, fontWeight: 'bold', color: Colors.text},
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    width: '100%',
  },
  filterButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.sm,
    textAlign: 'center',
    backgroundColor: Colors.backgroundLight,
  },
  activeFilter: {backgroundColor: Colors.primary},
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  activeFilterText: {color: Colors.white},
  notificationCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
    marginBottom: Spacing.sm,
  },
  unreadNotification: {borderLeftWidth: 4, borderLeftColor: Colors.primary},
  notificationHeader: {flexDirection: 'row', alignItems: 'flex-start'},
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  notificationContent: {flex: 1},
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
  unreadTitle: {fontWeight: '600'},
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
  notificationTime: {fontSize: 12, color: Colors.textLight},
  actionRequired: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  actionRequiredText: {fontSize: 12, color: Colors.error, fontWeight: '500'},
  deleteButton: {padding: Spacing.xs},
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
