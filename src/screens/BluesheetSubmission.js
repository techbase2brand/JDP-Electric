import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';

export default function BluesheetSubmission({
  selectedJob,
  onNavigate,
  onSubmit,
  navigation
}) {
  const [formData, setFormData] = useState({
    workDescription: '',
    materialsUsed: '',
    laborHours: '',
    additionalNotes: '',
    customerSignature: false,
    technicianSignature: false,
  });

  const [teamMembers] = useState([
    { id: '1', name: 'Mike Wilson', hours: '8.0' },
    { id: '2', name: 'Sarah Johnson', hours: '7.5' },
  ]);

  const handleSubmit = () => {
    if (!formData.workDescription.trim()) {
      Alert.alert('Error', 'Please describe the work performed');
      return;
    }

    if (!formData.laborHours.trim()) {
      Alert.alert('Error', 'Please enter labor hours');
      return;
    }

    Alert.alert(
      'Submit Bluesheet',
      'Are you sure you want to submit this bluesheet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            const submissionData = {
              ...formData,
              jobId: selectedJob?.id,
              teamMembers,
              submittedAt: new Date().toISOString(),
            };
            onSubmit(submissionData);
            Alert.alert('Success', 'Bluesheet submitted successfully!');
            onNavigate('dashboard');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Submit Bluesheet</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Job Information */}
        {selectedJob && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Information</Text>
            <View style={styles.jobInfo}>
              <Text style={styles.jobId}>{selectedJob.id}</Text>
              <Text style={styles.jobTitle}>{selectedJob.title}</Text>
              <Text style={styles.customerName}>{selectedJob.customer?.name}</Text>
            </View>
          </View>
        )}

        {/* Work Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Performed *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.workDescription}
            onChangeText={(text) => setFormData({...formData, workDescription: text})}
            placeholder="Describe the work performed in detail..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={6}
          />
        </View>

        {/* Materials Used */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Materials Used</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.materialsUsed}
            onChangeText={(text) => setFormData({...formData, materialsUsed: text})}
            placeholder="List materials used (quantity, description, part numbers)..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Team Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Team Hours</Text>
          {teamMembers.map((member) => (
            <View key={member.id} style={styles.teamMemberRow}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberHours}>{member.hours} hours</Text>
            </View>
          ))}
          <View style={styles.totalHoursRow}>
            <Text style={styles.totalLabel}>Total Labor Hours *</Text>
            <TextInput
              style={styles.hoursInput}
              value={formData.laborHours}
              onChangeText={(text) => setFormData({...formData, laborHours: text})}
              placeholder="0.0"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Additional Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.additionalNotes}
            onChangeText={(text) => setFormData({...formData, additionalNotes: text})}
            placeholder="Any additional comments, issues, or recommendations..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Signatures */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Signatures</Text>
          
          <TouchableOpacity
            style={[styles.signatureButton, formData.customerSignature && styles.signedButton]}
            onPress={() => setFormData({...formData, customerSignature: !formData.customerSignature})}
          >
            <Text style={styles.signatureIcon}>
              {formData.customerSignature ? '✅' : '✍️'}
            </Text>
            <Text style={styles.signatureText}>Customer Signature</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.signatureButton, formData.technicianSignature && styles.signedButton]}
            onPress={() => setFormData({...formData, technicianSignature: !formData.technicianSignature})}
          >
            <Text style={styles.signatureIcon}>
              {formData.technicianSignature ? '✅' : '✍️'}
            </Text>
            <Text style={styles.signatureText}>Technician Signature</Text>
          </TouchableOpacity>
        </View>

        {/* Safety Checklist */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Checklist</Text>
          <View style={styles.checklistItem}>
            <Text style={styles.checklistIcon}>✅</Text>
            <Text style={styles.checklistText}>All electrical connections secured</Text>
          </View>
          <View style={styles.checklistItem}>
            <Text style={styles.checklistIcon}>✅</Text>
            <Text style={styles.checklistText}>Circuit testing completed</Text>
          </View>
          <View style={styles.checklistItem}>
            <Text style={styles.checklistIcon}>✅</Text>
            <Text style={styles.checklistText}>Work area cleaned and restored</Text>
          </View>
          <View style={styles.checklistItem}>
            <Text style={styles.checklistIcon}>✅</Text>
            <Text style={styles.checklistText}>Customer walkthrough completed</Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Bluesheet</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingBottom:100
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 16,
    // backgroundColor: '#1E40AF',
  },
  backButton: {
    fontSize: 24,
    color: '#000',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
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
    marginBottom: 16,
  },
  jobInfo: {
    alignItems: 'center',
  },
  jobId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  customerName: {
    fontSize: 14,
    color: '#6B7280',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: '#1F2937',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  teamMemberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  memberName: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  memberHours: {
    fontSize: 14,
    color: '#6B7280',
  },
  totalHoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  hoursInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    minWidth: 80,
    textAlign: 'center',
  },
  signatureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  signedButton: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  signatureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  signatureText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checklistIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  checklistText: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});