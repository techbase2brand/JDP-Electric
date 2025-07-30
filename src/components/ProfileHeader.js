import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ProfileHeaderProps {
  userInfo: any;
  isEditing: boolean;
  onEditToggle: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userInfo, isEditing, onEditToggle }) => {
  return (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userInfo.name.charAt(0)}</Text>
          <View style={styles.onlineIndicator} />
        </View>
        <TouchableOpacity style={styles.changePhotoButton}>
          <Text style={styles.changePhotoText}>📷 Change Photo</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{userInfo.name}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{userInfo.role}</Text>
        </View>
        <Text style={styles.profileEmail}>{userInfo.email}</Text>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={onEditToggle}>
        <Text style={styles.editButtonText}>
          {isEditing ? '✓ Save' : '✏️ Edit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  changePhotoButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  changePhotoText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },
  roleBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  editButton: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProfileHeader;