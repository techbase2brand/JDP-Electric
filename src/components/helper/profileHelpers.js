import { Alert } from 'react-native';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  department?: string;
  skills?: string[];
  hire_date?: string;
  avatar?: string;
}

export const validateProfileForm = (editForm: any): boolean => {
  if (!editForm.name.trim() || !editForm.email.trim()) {
    Alert.alert('Error', 'Name and email are required');
    return false;
  }
  return true;
};

export const showSuccessAlert = (message: string) => {
  Alert.alert('Success', message);
};

export const showInfoAlert = (message: string) => {
  Alert.alert('Info', message);
};

export const handlePhotoUpload = () => {
  showInfoAlert('Photo upload functionality would be implemented here');
};

export const handleTakePhoto = () => {
  showInfoAlert('Camera functionality would be implemented here');
};

export const handleRemovePhoto = (user: User, setEditForm: (fn: (prev: any) => any) => void) => {
  setEditForm(prev => ({ 
    ...prev, 
    avatar: user?.name?.split(' ').map(n => n[0]).join('') || 'U' 
  }));
  showSuccessAlert('Photo removed');
};

export const getInitialEditForm = (user: User) => ({
  name: user?.name || '',
  email: user?.email || '',
  phoneNumber: user?.phone || '',
  department: user?.department || '',
  skills: user?.skills?.join(', ') || '',
  avatar: user?.name?.split(' ').map(n => n[0]).join('') || 'U'
});