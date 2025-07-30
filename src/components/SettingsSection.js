import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import {formatSettingLabel } from '../components/helper/profileHelpers';

interface SettingsSectionProps {
  title: string;
  icon: string;
  settings: any;
  onSettingChange: (key: string, value: any) => void;
  additionalButtons?: Array<{
    title: string;
    onPress: () => void;
    style?: 'default' | 'security' | 'preference';
  }>;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ 
  title, 
  icon, 
  settings, 
  onSettingChange, 
  additionalButtons = [] 
}) => {
  const renderSettingItem = (key: string, value: boolean) => (
    <View key={key} style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>
          {formatSettingLabel(key)}
        </Text>
        <Text style={styles.settingDescription}>
          { 'Setting description'}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={(newValue) => onSettingChange(key, newValue)}
        trackColor={{ false: '#E5E7EB', true: '#1E40AF' }}
        thumbColor={value ? '#FFFFFF' : '#F3F4F6'}
      />
    </View>
  );

  const getButtonStyle = (style?: string) => {
    switch (style) {
      case 'security':
        return styles.securityButton;
      case 'preference':
        return styles.preferenceButton;
      default:
        return styles.actionButton;
    }
  };

  const getButtonTextStyle = (style?: string) => {
    switch (style) {
      case 'security':
        return styles.securityButtonText;
      case 'preference':
        return styles.preferenceButtonText;
      default:
        return styles.actionButtonText;
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{icon} {title}</Text>
      
      {Object.entries(settings).map(([key, value]) =>
        typeof value === 'boolean' ? renderSettingItem(key, value) : null
      )}

      {additionalButtons.map((button, index) => (
        <TouchableOpacity 
          key={index}
          style={getButtonStyle(button.style)} 
          onPress={button.onPress}
        >
          <Text style={getButtonTextStyle(button.style)}>{button.title}</Text>
        </TouchableOpacity>
      ))}
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  actionButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  actionButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  securityButton: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  securityButtonText: {
    color: '#1E40AF',
    fontSize: 14,
    fontWeight: '500',
  },
  preferenceButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  preferenceButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SettingsSection;