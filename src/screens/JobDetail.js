import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

export default function JobDetail({
  //   job,
  onNavigate,
  onStartTimer,
  onUpdateStatus,
  navigation,
  route,
}) {
  const [currentStatus, setCurrentStatus] = useState(job?.status || 'assigned');
  const {job} = route.params;
  console.log('const { item } = route.params;', job);

  if (!job) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Details</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Job not found</Text>
        </View>
      </View>
    );
  }

  const getStatusColor = status => {
    switch (status) {
      case 'in_progress':
        return '#3B82F6';
      case 'scheduled':
        return '#10B981';
      case 'assigned':
        return '#8B5CF6';
      case 'completed':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const handleStatusUpdate = newStatus => {
    Alert.alert(
      'Update Status',
      `Are you sure you want to change the status to ${newStatus}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Update',
          onPress: () => {
            setCurrentStatus(newStatus);
            onUpdateStatus(job.id, newStatus);
          },
        },
      ],
    );
  };

  const getStatusButtons = () => {
    const buttons = [];

    if (currentStatus === 'assigned') {
      buttons.push({
        status: 'in_progress',
        label: 'Start Job',
        color: '#3B82F6',
      });
    }

    if (currentStatus === 'in_progress') {
      buttons.push({
        status: 'completed',
        label: 'Complete Job',
        color: '#10B981',
      });
    }

    return buttons;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <TouchableOpacity>
          <Text style={styles.timerButton}></Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Job Header */}
        <View style={styles.jobHeader}>
          <View style={styles.jobTitleContainer}>
            <Text style={styles.jobId}>{job?.id}</Text>
            <Text style={styles.jobTitle}>{job?.title}</Text>
          </View>
          <View style={styles.statusBadges}>
            <View
              style={[
                styles.badge,
                {backgroundColor: getStatusColor(currentStatus)},
              ]}>
              <Text style={styles.badgeText}>
                {currentStatus === 'in_progress'
                  ? 'In Progress'
                  : currentStatus === 'scheduled'
                  ? 'Scheduled'
                  : currentStatus === 'assigned'
                  ? 'Assigned'
                  : 'Completed'}
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                {backgroundColor: getPriorityColor(job.priority)},
              ]}>
              <Text style={styles.badgeText}>
                {job.priority?.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Job Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{job.description}</Text>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{job.customer?.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{job.customer?.phone}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.address}>{job.location?.address}</Text>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() =>
              navigation.navigate('MapScreen', {
                startCoordinates: job?.startCoordinates,
                destinationCoordinates: job?.destinationCoordinates,
                title: job?.title,
                JobId: job?.id,
              })
            }>
            <Text style={styles.mapButtonText}>📍 View on Map</Text>
          </TouchableOpacity>
        </View>

        {/* Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>
              {new Date(job.scheduledDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Start Time:</Text>
            <Text style={styles.infoValue}>{job.startTime}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estimated Hours:</Text>
            <Text style={styles.infoValue}>{job.estimatedHours}h</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>Actions</Text>

          <TouchableOpacity
            style={[styles.actionButton, {backgroundColor: '#3B82F6'}]}
            onPress={() => navigation.navigate('TimeSheetScreen')}>
            <Text style={styles.actionButtonText}>⏱️ Start Timer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, {backgroundColor: '#8B5CF6'}]}
            onPress={() => navigation.navigate('OrderProducts')}>
            <Text style={styles.actionButtonText}>📦 Order Materials</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, {backgroundColor: '#10B981'}]}
            onPress={() => navigation.navigate('BluesheetSubmission')}>
            <Text style={styles.actionButtonText}>📋 Submit Bluesheet</Text>
          </TouchableOpacity>

          {/* Status Update Buttons */}
          {/* {getStatusButtons().map(button => (
            <TouchableOpacity
              key={button.status}
              style={[styles.actionButton, {backgroundColor: button.color}]}
              onPress={() => handleStatusUpdate(button.status)}>
              <Text style={styles.actionButtonText}>{button.label}</Text>
            </TouchableOpacity>
          ))} */}
        </View>

        {/* Additional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Safety Requirements</Text>
            <Text style={styles.infoCardText}>
              • Wear safety glasses and hard hat{'\n'}• Use lockout/tagout
              procedures{'\n'}• Check for live wires before starting
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Tools Required</Text>
            <Text style={styles.infoCardText}>
              • Multimeter{'\n'}• Wire strippers{'\n'}• Screwdrivers{'\n'}•
              Electrical tape
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#1E40AF',
  },
  backButton: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  timerButton: {
    fontSize: 20,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  jobHeader: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  jobTitleContainer: {
    marginBottom: 12,
  },
  jobId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statusBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
  },
  address: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
    lineHeight: 24,
  },
  mapButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  mapButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  actionSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButton: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  infoCardText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#6B7280',
  },
});
