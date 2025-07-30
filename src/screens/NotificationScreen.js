import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';

const NotificationScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = ['All', 'Jobs', 'Timer', 'Materials', 'System', 'Team'];

  const notifications = [
    {
      id: 1,
      type: 'Jobs',
      title: 'New Job Assignment',
      message: 'You have been assigned to JOB-003: Emergency Generator Maintenance',
      time: '5 minutes ago',
      isRead: false,
      priority: 'high',
      icon: '📋',
      actionable: true,
      jobId: 'JOB-003',
    },
    {
      id: 2,
      type: 'Timer',
      title: 'Timer Reminder',
      message: 'You have been working for 4 hours. Consider taking a break.',
      time: '15 minutes ago',
      isRead: false,
      priority: 'medium',
      icon: '⏰',
      actionable: false,
    },
    {
      id: 3,
      type: 'Materials',
      title: 'Material Order Delivered',
      message: 'Your order #ORD-145 has been delivered to the job site',
      time: '1 hour ago',
      isRead: true,
      priority: 'low',
      icon: '📦',
      actionable: true,
      orderId: 'ORD-145',
    },
    {
      id: 4,
      type: 'System',
      title: 'App Update Available',
      message: 'Version 1.1.0 is now available with new features and bug fixes',
      time: '2 hours ago',
      isRead: true,
      priority: 'low',
      icon: '🔄',
      actionable: true,
    },
    {
      id: 5,
      type: 'Jobs',
      title: 'Job Schedule Change',
      message: 'JOB-001 has been rescheduled from 8:00 AM to 10:00 AM tomorrow',
      time: '3 hours ago',
      isRead: false,
      priority: 'medium',
      icon: '📅',
      actionable: true,
      jobId: 'JOB-001',
    },
    {
      id: 6,
      type: 'Team',
      title: 'Team Message',
      message: 'David Thompson: "Great job on the Metro Hospital project team!"',
      time: '4 hours ago',
      isRead: true,
      priority: 'low',
      icon: '💬',
      actionable: false,
    },
    {
      id: 7,
      type: 'Timer',
      title: 'Timesheet Reminder',
      message: 'Don\'t forget to submit your timesheet for this week by Friday',
      time: '1 day ago',
      isRead: true,
      priority: 'medium',
      icon: '📝',
      actionable: true,
    },
    {
      id: 8,
      type: 'System',
      title: 'Maintenance Notice',
      message: 'Scheduled system maintenance tonight from 11 PM to 1 AM',
      time: '1 day ago',
      isRead: true,
      priority: 'medium',
      icon: '🔧',
      actionable: false,
    },
  ];

  const getFilteredNotifications = () => {
    let filtered = notifications;
    
    if (selectedFilter !== 'All') {
      filtered = filtered.filter(notification => notification.type === selectedFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(notification => 
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  const markAsRead = (id) => {
    // Implementation to mark notification as read
    Alert.alert('Marked as Read', 'Notification marked as read');
  };

  const markAllAsRead = () => {
    Alert.alert(
      'Mark All as Read',
      'Are you sure you want to mark all notifications as read?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Mark All', onPress: () => Alert.alert('Success', 'All notifications marked as read') },
      ]
    );
  };

  const handleNotificationAction = (notification) => {
    if (!notification.actionable) return

    switch (notification.type) {
      case 'Jobs':
        Alert.alert('View Job', `Opening job ${notification.jobId}`);
        break;
      case 'Materials':
        Alert.alert('View Order', `Opening order ${notification.orderId}`);
        break;
      case 'System':
        if (notification.title.includes('Update')) {
          Alert.alert('Update App', 'Redirecting to app store...');
        }
        break;
      case 'Timer':
        if (notification.title.includes('Timesheet')) {
          Alert.alert('Open Timesheet', 'Opening timesheet screen...');
        }
        break;
      default:
        Alert.alert('Action', 'Opening related screen...');
    }
  };

  const deleteNotification = (id) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Deleted', 'Notification deleted') },
      ]
    );
  };

  const renderFilterButton = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === item && styles.activeFilterButton,
      ]}
      onPress={() => setSelectedFilter(item)}
    >
      <Text style={[
        styles.filterText,
        selectedFilter === item && styles.activeFilterText,
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderNotification = ({ item  }) => (
    <TouchableOpacity 
      style={[
        styles.notificationCard,
        !item.isRead && styles.unreadNotificationCard,
      ]}
      onPress={() => handleNotificationAction(item)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationLeft}>
          <Text style={styles.notificationIcon}>{item.icon}</Text>
          <View style={styles.notificationContent}>
            <View style={styles.notificationTitleRow}>
              <Text style={[
                styles.notificationTitle,
                !item.isRead && styles.unreadNotificationTitle,
              ]}>
                {item.title}
              </Text>
              {!item.isRead && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.notificationMessage}>{item.message}</Text>
            <Text style={styles.notificationTime}>{item.time}</Text>
          </View>
        </View>
        
        <View style={styles.notificationActions}>
          <View style={[
            styles.priorityBadge,
            {
              backgroundColor: 
                item.priority === 'high' ? '#FEE2E2' :
                item.priority === 'medium' ? '#FEF3C7' : '#F0FDF4'
            }
          ]}>
            <Text style={[
              styles.priorityText,
              {
                color: 
                  item.priority === 'high' ? '#DC2626' :
                  item.priority === 'medium' ? '#D97706' : '#15803D'
              }
            ]}>
              {item.priority.toUpperCase()}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              if (!item.isRead) {
                markAsRead(item.id);
              } else {
                deleteNotification(item.id);
              }
            }}
          >
            <Text style={styles.actionButtonText}>
              {!item.isRead ? '✓' : '🗑️'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {item.actionable && (
        <View style={styles.actionIndicator}>
          <Text style={styles.actionIndicatorText}>Tap to view details →</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerActions}>
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{getUnreadCount()} unread</Text>
          </View>
          <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
            <Text style={styles.markAllButtonText}>Mark All Read</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search notifications..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <FlatList
          horizontal
          data={filters}
          renderItem={renderFilterButton}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Notifications List */}
      <FlatList
        data={getFilteredNotifications()}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.notificationsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🔔</Text>
            <Text style={styles.emptyStateTitle}>No Notifications</Text>
            <Text style={styles.emptyStateMessage}>
              {searchQuery ? 'No notifications match your search' : 'You\'re all caught up!'}
            </Text>
          </View>
        )}
      />

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionText}>⚙️ Notification Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionText}>📱 Push Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  unreadBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unreadBadgeText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },
  markAllButton: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  markAllButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  filtersSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersList: {
    paddingHorizontal: 20,
  },
  filterButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  activeFilterButton: {
    backgroundColor: '#1E40AF',
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  notificationsList: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  unreadNotificationCard: {
    borderLeftColor: '#1E40AF',
    backgroundColor: '#FEFEFE',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  notificationLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  notificationIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  unreadNotificationTitle: {
    fontWeight: '600',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E40AF',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  notificationActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
  },
  actionIndicator: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionIndicatorText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  quickActions: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickActionText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default NotificationScreen;