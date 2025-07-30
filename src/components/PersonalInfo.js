import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface PersonalInfoProps {
  userInfo: any;
  isEditing: boolean;
  onUserInfoChange: (field: string, value: string) => void;
  onSave: () => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ 
  userInfo, 
  isEditing, 
  onUserInfoChange, 
  onSave 
}) => {
  const renderInfoItem = (label: string, field: string, value: string, editable = true, keyboardType: any = 'default') => (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      {isEditing && editable ? (
        <TextInput
          style={styles.infoInput}
          value={value}
          onChangeText={(text) => onUserInfoChange(field, text)}
          keyboardType={keyboardType}
        />
      ) : (
        <Text style={styles.infoValue}>{value}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>👤 Personal Information</Text>
      
      <View style={styles.infoGrid}>
        {renderInfoItem('Full Name', 'name', userInfo.name)}
        {renderInfoItem('Email', 'email', userInfo.email, true, 'email-address')}
        {renderInfoItem('Phone', 'phone', userInfo.phone, true, 'phone-pad')}
        {renderInfoItem('Employee ID', 'employeeId', userInfo.employeeId, false)}
        {renderInfoItem('Department', 'department', userInfo.department, false)}
        {renderInfoItem('Hire Date', 'hireDate', userInfo.hireDate, false)}
      </View>

      {isEditing && (
        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    color: '#111827',
    marginBottom: 16,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  infoInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
    paddingVertical: 2,
  },
  saveButton: {
    backgroundColor: '#1E40AF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PersonalInfo;