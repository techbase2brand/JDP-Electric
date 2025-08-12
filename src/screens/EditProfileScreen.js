import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useAuth } from '../utils/AuthContext';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const EditProfileScreen = ({navigation}) => {
  // const { user, updateUser } = useAuth();
  const [avatarUri, setAvatarUri] = useState(null);
  // console.log("user",user);

  const [formData, setFormData] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@jdpelectric.us',
    phone: '+1 (555) 123-4567',
    address: '1234 Main Street',
    city: 'Houston',
    state: 'TX',
    zipCode: '77001',
    emergencyContact: 'John Johnson',
    emergencyPhone: '+1 (555) 987-6543',
    employeeId: 'EMP-001',
    department: 'Electrical Services',
    position: 'Lead Labor',
    hireDate: '2020-03-15',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update user context
      // if (updateUser) {
      //   updateUser({
      //     ...user,
      //     name: formData.name,
      //     email: formData.email,
      //   });
      // }

      // Alert.alert(
      //   'Success',
      //   'Profile updated successfully!',
      //   [{ text: 'OK', onPress: () =>
      navigation.goBack();
      //   }]
      // );
    } catch (error) {
      console.log('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => {
            launchCamera({mediaType: 'photo'}, response => {
              if (!response.didCancel && !response.errorCode) {
                setAvatarUri(response.assets[0].uri);
              }
            });
          },
        },
        {
          text: 'Gallery',
          onPress: () => {
            launchImageLibrary({mediaType: 'photo'}, response => {
              if (!response.didCancel && !response.errorCode) {
                setAvatarUri(response.assets[0].uri);
              }
            });
          },
        },
        {text: 'Cancel', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    editable = true,
  }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.input, !editable && styles.disabledInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        editable={editable}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            // disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {avatarUri ? (
                <Image source={{uri: avatarUri}} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>
                  {formData.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.changePhotoButton}
              onPress={handleImagePicker}>
              <Icon name="camera-alt" size={20} color="#2563eb" />
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <InputField
            label="Full Name"
            value={formData.name}
            onChangeText={text => setFormData({...formData, name: text})}
            placeholder="Enter your full name"
          />

          <InputField
            label="Email Address"
            value={formData.email}
            onChangeText={text => setFormData({...formData, email: text})}
            placeholder="Enter your email"
            keyboardType="email-address"
          />

          <InputField
            label="Phone Number"
            value={formData.phone}
            onChangeText={text => setFormData({...formData, phone: text})}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
        </View>

        {/* Address Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address Information</Text>

          <InputField
            label="Street Address"
            value={formData.address}
            onChangeText={text => setFormData({...formData, address: text})}
            placeholder="Enter your address"
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <InputField
                label="City"
                value={formData.city}
                onChangeText={text => setFormData({...formData, city: text})}
                placeholder="City"
              />
            </View>
            <View style={styles.halfWidth}>
              <InputField
                label="State"
                value={formData.state}
                onChangeText={text => setFormData({...formData, state: text})}
                placeholder="State"
              />
            </View>
          </View>

          <InputField
            label="ZIP Code"
            value={formData.zipCode}
            onChangeText={text => setFormData({...formData, zipCode: text})}
            placeholder="ZIP Code"
            keyboardType="numeric"
          />
        </View>

        {/* Emergency Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>

          <InputField
            label="Contact Name"
            value={formData.emergencyContact}
            onChangeText={text =>
              setFormData({...formData, emergencyContact: text})
            }
            placeholder="Emergency contact name"
          />

          <InputField
            label="Contact Phone"
            value={formData.emergencyPhone}
            onChangeText={text =>
              setFormData({...formData, emergencyPhone: text})
            }
            placeholder="Emergency contact phone"
            keyboardType="phone-pad"
          />
        </View>

        {/* Work Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Information</Text>

          <InputField
            label="Employee ID"
            value={formData.employeeId}
            placeholder="Employee ID"
            editable={false}
          />

          <InputField
            label="Department"
            value={formData.department}
            placeholder="Department"
            editable={false}
          />

          <InputField
            label="Position"
            value={formData.position}
            placeholder="Position"
            editable={false}
          />

          <InputField
            label="Hire Date"
            value={formData.hireDate}
            placeholder="Hire Date"
            editable={false}
          />
        </View>

        {/* Skills Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills & Certifications</Text>
          <View style={styles.skillsContainer}>
            {[
              'Electrical Installation',
              'Project Management',
              'Safety Compliance',
              'Troubleshooting',
            ].map((skill, index) => (
              <View key={index} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
                <TouchableOpacity>
                  <Icon name="close" size={16} color="#6b7280" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addSkillButton}>
              <Icon name="add" size={16} color="#2563eb" />
              <Text style={styles.addSkillText}>Add Skill</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    // paddingBottom:100,
  },
  header: {
    // paddingTop: 50,
    // paddingBottom: 20,
    // paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
    marginLeft: 6,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  disabledInput: {
    backgroundColor: '#f9fafb',
    color: '#6b7280',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  skillText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  addSkillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    gap: 4,
  },
  addSkillText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'cover',
  },
});

export default EditProfileScreen;
