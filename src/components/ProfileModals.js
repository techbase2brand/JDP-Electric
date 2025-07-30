import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

interface PhotoOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onUploadPhoto: () => void;
  onRemovePhoto: () => void;
}

export const PhotoOptionsModal: React.FC<PhotoOptionsModalProps> = ({
  visible,
  onClose,
  onTakePhoto,
  onUploadPhoto,
  onRemovePhoto,
}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={modalStyles.overlay}>
      <View style={modalStyles.content}>
        <View style={modalStyles.header}>
          <Text style={modalStyles.title}>Upload Profile Photo</Text>
          <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
            <Text style={modalStyles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={modalStyles.body}>
          <TouchableOpacity onPress={onTakePhoto} style={modalStyles.button}>
            <Text style={modalStyles.buttonIcon}>📷</Text>
            <Text style={modalStyles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onUploadPhoto} style={modalStyles.button}>
            <Text style={modalStyles.buttonIcon}>📁</Text>
            <Text style={modalStyles.buttonText}>Choose from Library</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onRemovePhoto} style={[modalStyles.button, modalStyles.dangerousButton]}>
            <Text style={modalStyles.buttonIcon}>🗑️</Text>
            <Text style={[modalStyles.buttonText, modalStyles.dangerousButtonText]}>Remove Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  dangerous?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = 'Confirm',
  dangerous = false,
}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
    <View style={modalStyles.overlay}>
      <View style={modalStyles.confirmContent}>
        <Text style={modalStyles.confirmTitle}>{title}</Text>
        <Text style={modalStyles.confirmMessage}>{message}</Text>
        <View style={modalStyles.confirmButtons}>
          <TouchableOpacity onPress={onCancel} style={modalStyles.cancelButton}>
            <Text style={modalStyles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={onConfirm} 
            style={[modalStyles.confirmButton, dangerous && modalStyles.deleteButton]}
          >
            <Text style={modalStyles.confirmButtonText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 16,
    color: '#6B7280',
  },
  body: {
    padding: 16,
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  dangerousButton: {
    borderColor: '#F87171',
    backgroundColor: '#FEF2F2',
  },
  buttonIcon: {
    fontSize: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  dangerousButtonText: {
    color: '#DC2626',
  },
  confirmContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  confirmMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#DC2626',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
});