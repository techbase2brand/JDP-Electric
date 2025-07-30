import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';

const CreateJobScreen = () => {
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    client: '',
    location: '',
    priority: 'MEDIUM',
    estimatedDuration: '',
    scheduledDate: '',
    scheduledTime: '',
    technician: '',
    notes: '',
  });

  const priorities = ['LOW', 'MEDIUM', 'HIGH'];
  const technicians = [
    'David Thompson',
    'Sarah Johnson', 
    'Mike Rodriguez',
    'Lisa Chen',
    'Auto Assign',
  ];

  const handleInputChange = (field: string, value: string) => {
    setJobData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateJob = () => {
    // Validate required fields
    if (!jobData.title || !jobData.client || !jobData.location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Create job logic would go here
    Alert.alert(
      'Success',
      'Job created successfully!',
      [{ text: 'OK', onPress: () => {
        // Reset form
        setJobData({
          title: '',
          description: '',
          client: '',
          location: '',
          priority: 'MEDIUM',
          estimatedDuration: '',
          scheduledDate: '',
          scheduledTime: '',
          technician: '',
          notes: '',
        });
      }}]
    );
  };

  const renderPriorityButton = (priority: string) => (
    <TouchableOpacity
      key={priority}
      style={[
        styles.priorityButton,
        jobData.priority === priority && styles.activePriorityButton,
        priority === 'HIGH' && jobData.priority === priority && styles.highPriorityActive,
        priority === 'LOW' && jobData.priority === priority && styles.lowPriorityActive,
      ]}
      onPress={() => handleInputChange('priority', priority)}
    >
      <Text style={[
        styles.priorityText,
        jobData.priority === priority && styles.activePriorityText,
      ]}>
        {priority}
      </Text>
    </TouchableOpacity>
  );

  const renderTechnicianButton = (technician: string) => (
    <TouchableOpacity
      key={technician}
      style={[
        styles.technicianButton,
        jobData.technician === technician && styles.activeTechnicianButton,
      ]}
      onPress={() => handleInputChange('technician', technician)}
    >
      <Text style={[
        styles.technicianText,
        jobData.technician === technician && styles.activeTechnicianText,
      ]}>
        {technician}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create New Job</Text>
        <TouchableOpacity style={styles.helpButton}>
          <Text style={styles.helpIcon}>❓</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Job Title *</Text>
            <TextInput
              style={styles.textInput}
              value={jobData.title}
              onChangeText={(value) => handleInputChange('title', value)}
              placeholder="Enter job title"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={jobData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Describe the work to be done"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Priority</Text>
            <View style={styles.priorityContainer}>
              {priorities.map(renderPriorityButton)}
            </View>
          </View>
        </View>

        {/* Client & Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏢 Client & Location</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Client Name *</Text>
            <TextInput
              style={styles.textInput}
              value={jobData.client}
              onChangeText={(value) => handleInputChange('client', value)}
              placeholder="Enter client name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location *</Text>
            <TextInput
              style={styles.textInput}
              value={jobData.location}
              onChangeText={(value) => handleInputChange('location', value)}
              placeholder="Enter full address"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Scheduling */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Scheduling</Text>
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Text style={styles.dateText}>
                  {jobData.scheduledDate || 'Select date'}
                </Text>
                <Text style={styles.dateIcon}>📅</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Time</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Text style={styles.dateText}>
                  {jobData.scheduledTime || 'Select time'}
                </Text>
                <Text style={styles.dateIcon}>🕒</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Estimated Duration</Text>
            <TextInput
              style={styles.textInput}
              value={jobData.estimatedDuration}
              onChangeText={(value) => handleInputChange('estimatedDuration', value)}
              placeholder="e.g., 4 hours"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Assignment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Assignment</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Assign Technician</Text>
            <View style={styles.technicianContainer}>
              {technicians.map(renderTechnicianButton)}
            </View>
          </View>
        </View>

        {/* Additional Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Additional Notes</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={jobData.notes}
              onChangeText={(value) => handleInputChange('notes', value)}
              placeholder="Any additional notes or special instructions"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.draftButton}>
            <Text style={styles.draftButtonText}>Save as Draft</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateJob}>
            <Text style={styles.createButtonText}>Create Job</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    color: '#101828',
  },
  helpButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpIcon: {
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#101828',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activePriorityButton: {
    backgroundColor: '#155DFC',
    borderColor: '#155DFC',
  },
  highPriorityActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  lowPriorityActive: {
    backgroundColor: '#6B7280',
    borderColor: '#6B7280',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activePriorityText: {
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  dateInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#6B7280',
  },
  dateIcon: {
    fontSize: 16,
  },
  technicianContainer: {
    gap: 8,
  },
  technicianButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeTechnicianButton: {
    backgroundColor: '#EFF6FF',
    borderColor: '#155DFC',
  },
  technicianText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  activeTechnicianText: {
    color: '#155DFC',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 16,
    padding: 20,
  },
  draftButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  draftButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  createButton: {
    flex: 2,
    backgroundColor: '#155DFC',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default CreateJobScreen;