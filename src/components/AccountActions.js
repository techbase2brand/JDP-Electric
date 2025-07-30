import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

interface AccountActionsProps {
  onLogout: () => void;
  onDeleteAccount: () => void;
}

const AccountActions: React.FC<AccountActionsProps> = ({ onLogout, onDeleteAccount }) => {
  const handleExportData = () => {
    Alert.alert('Export Data', 'Your data export will be emailed to you within 24 hours.');
  };

  const handleContactSupport = () => {
    Alert.alert('Contact Support', 'Opening support contact options...');
  };

  const handleTermsConditions = () => {
    Alert.alert('Terms & Conditions', 'Opening terms and conditions...');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Opening privacy policy...');
  };

  const actionButtons = [
    { title: '📤 Export My Data', onPress: handleExportData },
    { title: '📞 Contact Support', onPress: handleContactSupport },
    { title: '📋 Terms & Conditions', onPress: handleTermsConditions },
    { title: '🔒 Privacy Policy', onPress: handlePrivacyPolicy },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🔧 Account Actions</Text>
      
      {actionButtons.map((button, index) => (
        <TouchableOpacity key={index} style={styles.actionButton} onPress={button.onPress}>
          <Text style={styles.actionButtonText}>{button.title}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={onLogout}>
        <Text style={[styles.actionButtonText, styles.logoutButtonText]}>🚪 Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={onDeleteAccount}>
        <Text style={[styles.actionButtonText, styles.deleteButtonText]}>🗑️ Delete Account</Text>
      </TouchableOpacity>
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
  actionButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#FEF3C7',
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#D97706',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
  },
  deleteButtonText: {
    color: '#DC2626',
  },
});

export default AccountActions;