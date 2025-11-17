// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useSelector} from 'react-redux';
// import {
//   getLaborById,
//   getLeadLaborById,
//   updateLaborProfile,
//   updateLeadLaborProfile,
// } from '../config/apiConfig';

// const EditProfileScreen = ({navigation}) => {
//   const user = useSelector(state => state.user.user);
//   const token = useSelector(state => state.user.token);
//   const [allLabourData, setAllLabourData] = useState();
//   const [avatarUri, setAvatarUri] = useState(null);

//   const [formData, setFormData] = useState();

//   const [isLoading, setIsLoading] = useState(false);

// const formatDate = dateString => {
//   if (!dateString) return '';
//   const date = new Date(dateString);
//   const month = String(date.getMonth() + 1).padStart(2, '0'); // month 0-based hota hai
//   const day = String(date.getDate()).padStart(2, '0');
//   const year = date.getFullYear();
//   return `${month}/${day}/${year}`;
// };
//   useEffect(() => {
//     const fetchProfiles = async () => {
//       try {
//         let profileData;
//         if (user?.management_type === 'lead_labor') {
//           const leadLabor = await getLeadLaborById(user?.lead_labor?.id, token);
//           profileData = leadLabor?.data;
//           console.log('profi;eFDAta', profileData?.users?.photo_url);
//         } else {
//           const labor = await getLaborById(user?.labor?.id, token);
//           profileData = labor?.data;
//         }

//         setAllLabourData(profileData);
//         setAvatarUri(profileData?.users?.photo_url);
//         // API response se formData set karo
//         setFormData({
//           full_name: profileData?.users?.full_name || '',
//           email: profileData?.users?.email || '',
//           phone: profileData?.users?.phone || '',
//           address: profileData?.address || '',
//           department: profileData?.department || '',
//           date_of_joining: formatDate(profileData?.date_of_joining || ''),
//           status: profileData?.users?.status || '',
//           role: profileData?.users?.role || '',
//           dob: formatDate(profileData?.dob || ''),
//           photo_url: profileData?.users?.photo_url || '',
//           supervisor: profileData?.supervisor?.full_name || '',
//         });
//       } catch (err) {
//         console.error('Error fetching profiles:', err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchProfiles();
//   }, []);

//   const handleSave = async () => {
//     setIsLoading(true);
//     try {
//       const form = new FormData();

//       // Text fields
//       form.append('full_name', formData.full_name);
//       form.append('email', formData.email);
//       form.append('phone', formData.phone);
//       form.append('address', formData.address);
//       form.append('department', formData.department);
//       form.append('dob', formData.dob);
//       form.append('date_of_joining', formData.date_of_joining);

//       // Image upload if selected
//       // if (avatarUri && avatarUri.startsWith('file')) {
//       if (avatarUri && avatarUri.startsWith('file')) {
//         form.append('photo', {
//           uri: avatarUri,
//           type: 'image/jpeg', // or 'image/png' if PNG
//           name: 'profile.jpg', // filename is required
//         });
//       }
//       // }

//       let response;
//       if (user?.management_type === 'lead_labor') {
//         response = await updateLeadLaborProfile(
//           user?.lead_labor?.id,
//           form,
//           token,
//         );
//       } else {
//         response = await updateLaborProfile(user?.labor?.id, form, token);
//       }

//       Alert.alert('Success', 'Profile updated successfully!', [
//         {text: 'OK', onPress: () => navigation.goBack()},
//       ]);
//     } catch (error) {
//       console.error('Update Error:', error);
//       Alert.alert('Error', error.message || 'Failed to update profile');
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   const handleImagePicker = () => {
//     Alert.alert(
//       'Select Image',
//       'Choose an option',
//       [
//         {
//           text: 'Camera',
//           onPress: () => {
//             launchCamera({mediaType: 'photo'}, response => {
//               if (!response.didCancel && !response.errorCode) {
//                 setAvatarUri(response.assets[0].uri);
//               }
//             });
//           },
//         },
//         {
//           text: 'Gallery',
//           onPress: () => {
//             launchImageLibrary({mediaType: 'photo'}, response => {
//               if (!response.didCancel && !response.errorCode) {
//                 setAvatarUri(response.assets[0].uri);
//               }
//             });
//           },
//         },
//         {text: 'Cancel', style: 'cancel'},
//       ],
//       {cancelable: true},
//     );
//   };

//   const InputField = ({
//     label,
//     value,
//     onChangeText,
//     placeholder,
//     keyboardType = 'default',
//     editable = true,
//   }) => (
//     <View style={styles.inputGroup}>
//       <Text style={styles.inputLabel}>{label}</Text>
//       <TextInput
//         style={[styles.input, !editable && styles.disabledInput]}
//         value={value}
//         onChangeText={onChangeText}
//         placeholder={placeholder}
//         keyboardType={keyboardType}
//         editable={editable}
//       />
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerContent}>
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={() => navigation.goBack()}>
//             <Icon name="arrow-back" size={24} color="#000" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Edit Profile</Text>
//           <TouchableOpacity
//             style={styles.saveButton}
//             onPress={handleSave}
//             // disabled={isLoading}
//           >
//             <Text style={styles.saveButtonText}>
//               {isLoading ? 'Saving...' : 'Save'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//       {/* <KeyboardAvoidingView
//         style={{flex: 1}}
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}> */}
//       {isLoading || !formData ? (
//         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//           <ActivityIndicator />
//         </View>
//       ) : (
//         <KeyboardAvoidingView
//           style={{flex: 1}}
//           behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//           keyboardShouldPersistTaps="always"
//           keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
//           <ScrollView
//             style={styles.content}
//             showsVerticalScrollIndicator={false}>
//             {/* Profile Picture Section */}
//             <View style={styles.profileSection}>
//               <View style={styles.avatarContainer}>
//                 <View style={styles.avatar}>
//                   {avatarUri ? (
//                     <Image
//                       source={{uri: avatarUri}}
//                       style={styles.avatarImage}
//                     />
//                   ) : (
//                     <Text style={styles.avatarText}>
//                       {formData?.full_name
//                         ? formData.full_name
//                             .split(' ')
//                             .map(n => n[0]?.toUpperCase())
//                             .join('')
//                         : ''}
//                     </Text>
//                   )}
//                 </View>
//                 <TouchableOpacity
//                   style={styles.changePhotoButton}
//                   onPress={handleImagePicker}>
//                   <Icon name="camera-alt" size={20} color="#2563eb" />
//                   <Text style={styles.changePhotoText}>Change Photo</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Personal Information */}
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Personal Information</Text>

//               <InputField
//                 label="Full Name"
//                 value={formData.full_name}
//                 onChangeText={text =>
//                   setFormData({...formData, full_name: text})
//                 }
//                 placeholder="Enter your full name"
//               />

//               <InputField
//                 label="Email Address"
//                 value={formData.email}
//                 onChangeText={text => setFormData({...formData, email: text})}
//                 placeholder="Enter your email"
//                 keyboardType="email-address"
//                 editable={false}
//               />

//               <InputField
//                 label="Phone Number"
//                 value={formData.phone}
//                 onChangeText={text => setFormData({...formData, phone: text})}
//                 placeholder="Enter your phone number"
//                 keyboardType="phone-pad"
//                 // editable={false}
//               />
//               <InputField
//                 label="Date of birth"
//                 value={formData.dob}
//                 placeholder="26/06/1995"
//                 keyboardType="email-address"
//                 editable={false}
//               />
//             </View>

//             {/* Address Information */}
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Address Information</Text>
//               <InputField
//                 label="Address"
//                 value={formData.address}
//                 onChangeText={text => setFormData({...formData, address: text})}
//                 placeholder="Enter your address"
//               />
//             </View>

//             {/* Work Information */}
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Work Information</Text>

//               {user.management_type == 'lead_labor' && (
//                 <InputField
//                   label="Department"
//                   value={formData.department}
//                   placeholder="Department"
//                   editable={false}
//                 />
//               )}
//               {user.management_type == 'labor' && (
//                 <InputField
//                   label="Supervisor"
//                   value={formData.supervisor}
//                   placeholder="supervisor"
//                   editable={false}
//                 />
//               )}
//               <InputField
//                 label="Status"
//                 value={formData.status}
//                 placeholder="Status"
//                 editable={false}
//               />
//               {/* <InputField
//             label="Position"
//             value={formData.position}
//             placeholder="Position"
//             editable={false}
//           /> */}

//               <InputField
//                 label="Joining Date"
//                 value={formData.date_of_joining}
//                 placeholder="Hire Date"
//                 editable={false}
//               />
//             </View>

//             {/* Skills Section */}
//             {/* <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Skills & Certifications</Text>
//           <View style={styles.skillsContainer}>
//             {[
//               'Electrical Installation',
//               'Project Management',
//               'Safety Compliance',
//               'Troubleshooting',
//             ].map((skill, index) => (
//               <View key={index} style={styles.skillChip}>
//                 <Text style={styles.skillText}>{skill}</Text>
//                 <TouchableOpacity>
//                   <Icon name="close" size={16} color="#6b7280" />
//                 </TouchableOpacity>
//               </View>
//             ))}
//             <TouchableOpacity style={styles.addSkillButton}>
//               <Icon name="add" size={16} color="#2563eb" />
//               <Text style={styles.addSkillText}>Add Skill</Text>
//             </TouchableOpacity>
//           </View>
//         </View> */}

//             {/* <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Skills & Certifications</Text>
//           <View style={styles.skillsContainer}>
//             {skills.map((skill, index) => (
//               <View key={index} style={styles.skillChip}>
//                 <Text style={styles.skillText}>{skill}</Text>
//                 <TouchableOpacity onPress={() => deleteSkill(index)}>
//                   <Icon name="close" size={16} color="#6b7280" />
//                 </TouchableOpacity>
//               </View>
//             ))}

//             {isAdding ? (
//               <View style={styles.addSkillInputContainer}>
//                 <TextInput
//                   style={styles.addSkillInput}
//                   placeholder="Enter skill"
//                   value={newSkill}
//                   onChangeText={setNewSkill}
//                   onSubmitEditing={addSkill}
//                   autoFocus
//                 />
//                 <TouchableOpacity
//                   onPress={addSkill}
//                   style={styles.addSkillConfirm}>
//                   <Icon name="check" size={20} color="#2563eb" />
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <TouchableOpacity
//                 style={styles.addSkillButton}
//                 onPress={() => setIsAdding(true)}>
//                 <Icon name="add" size={16} color="#2563eb" />
//                 <Text style={styles.addSkillText}>Add Skill</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View> */}
//             <View style={{height: 40}} />
//           </ScrollView>
//         </KeyboardAvoidingView>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8fafc',
//     // paddingBottom:100,
//   },
//   header: {
//     // paddingTop: 50,
//     // paddingBottom: 20,
//     // paddingHorizontal: 20,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 10,
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#000',
//     flex: 1,
//     textAlign: 'center',
//   },
//   saveButton: {
//     backgroundColor: '#3B82F6',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   profileSection: {
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   avatarContainer: {
//     alignItems: 'center',
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#2563eb',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   avatarText: {
//     fontSize: 36,
//     fontWeight: 'bold',
//     color: '#ffffff',
//   },
//   changePhotoButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   changePhotoText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#2563eb',
//     marginLeft: 6,
//   },
//   section: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1f2937',
//     marginBottom: 16,
//   },
//   inputGroup: {
//     marginBottom: 16,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: '#1f2937',
//     backgroundColor: '#ffffff',
//   },
//   disabledInput: {
//     backgroundColor: '#f9fafb',
//     color: '#6b7280',
//   },
//   row: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   halfWidth: {
//     flex: 1,
//   },
//   skillsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   skillChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#eff6ff',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     gap: 6,
//   },
//   skillText: {
//     fontSize: 14,
//     color: '#2563eb',
//     fontWeight: '500',
//   },
//   addSkillButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f3f4f6',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderStyle: 'dashed',
//     gap: 4,
//   },
//   addSkillText: {
//     fontSize: 14,
//     color: '#2563eb',
//     fontWeight: '500',
//   },
//   avatarImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     resizeMode: 'cover',
//   },
// });

// export default EditProfileScreen;

// EditProfileScreen.js
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useSelector} from 'react-redux';
import {
  getLaborById,
  getLeadLaborById,
  updateLaborProfile,
  updateLeadLaborProfile,
} from '../config/apiConfig';

////////////////////////////////////////////////////////////////////////////////
// Memoized/forwardRef InputField to avoid unnecessary re-renders and focus loss
////////////////////////////////////////////////////////////////////////////////
const InputField = React.memo(
  React.forwardRef(
    (
      {
        label,
        value,
        onChangeText,
        placeholder,
        keyboardType = 'default',
        editable = true,
        returnKeyType = 'done',
        onSubmitEditing,
        blurOnSubmit = true,
      },
      ref,
    ) => {
      return (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{label}</Text>
          <TextInput
            ref={ref}
            style={[styles.input, !editable && styles.disabledInput]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            keyboardType={keyboardType}
            editable={editable}
            blurOnSubmit={blurOnSubmit}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            underlineColorAndroid="transparent"
            // keep selection/caret stable
            allowFontScaling={false}
          />
        </View>
      );
    },
  ),
);

const EditProfileScreen = ({navigation}) => {
  const user = useSelector(state => state.user.user);
  const token = useSelector(state => state.user.token);

  const [allLabourData, setAllLabourData] = useState(null);
  const [avatarUri, setAvatarUri] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // refs for inputs to chain focus
  const fullNameRef = useRef(null);
  const phoneRef = useRef(null);
  const addressRef = useRef(null);

  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  useEffect(() => {
    let mounted = true;
    const fetchProfiles = async () => {
      setIsLoading(true);
      try {
        let profileData;
        if (user?.management_type === 'lead_labor') {
          const leadLabor = await getLeadLaborById(user?.lead_labor?.id, token);
          profileData = leadLabor?.data;
        } else {
          const labor = await getLaborById(user?.labor?.id, token);
          profileData = labor?.data;
        }

        if (!mounted) return;

        setAllLabourData(profileData);
        setAvatarUri(profileData?.users?.photo_url || null);

        setFormData({
          full_name: profileData?.users?.full_name || '',
          email: profileData?.users?.email || '',
          phone: profileData?.users?.phone || '',
          address: profileData?.address || '',
          department: profileData?.department || '',
          date_of_joining: formatDate(profileData?.date_of_joining || ''),
          status: profileData?.users?.status || '',
          role: profileData?.users?.role || '',
          dob: formatDate(profileData?.dob || ''),
          photo_url: profileData?.users?.photo_url || '',
          supervisor: profileData?.supervisor?.full_name || '',
        });
      } catch (err) {
        console.error('Error fetching profiles:', err);
        Alert.alert('Error', 'Failed to load profile data');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchProfiles();
    return () => {
      mounted = false;
    };
  }, [user, token]);

  // stable handlers using useCallback and functional updater to avoid recreating handlers
  const handleChange = useCallback((key, value) => {
    setFormData(prev => ({...prev, [key]: value}));
  }, []);

  const handleSave = useCallback(async () => {
    if (!formData) return;
    setIsLoading(true);
    try {
      const form = new FormData();

      form.append('full_name', formData.full_name);
      form.append('email', formData.email);
      form.append('phone', formData.phone);
      form.append('address', formData.address);
      form.append('department', formData.department);
      form.append('dob', formData.dob);
      form.append('date_of_joining', formData.date_of_joining);

      if (avatarUri && avatarUri.startsWith('file')) {
        form.append('photo', {
          uri: avatarUri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      }

      let response;
      if (user?.management_type === 'lead_labor') {
        response = await updateLeadLaborProfile(
          user?.lead_labor?.id,
          form,
          token,
        );
      } else {
        response = await updateLaborProfile(user?.labor?.id, form, token);
      }

      Alert.alert('Success', 'Profile updated successfully!', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      console.error('Update Error:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  }, [formData, avatarUri, user, token, navigation]);

  const handleImagePicker = useCallback(() => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => {
            launchCamera({mediaType: 'photo'}, response => {
              if (
                !response.didCancel &&
                !response.errorCode &&
                response.assets?.[0]?.uri
              ) {
                setAvatarUri(response.assets[0].uri);
                // also update formData.photo_url if needed
                setFormData(prev => ({
                  ...prev,
                  photo_url: response.assets[0].uri,
                }));
              }
            });
          },
        },
        {
          text: 'Gallery',
          onPress: () => {
            launchImageLibrary({mediaType: 'photo'}, response => {
              if (
                !response.didCancel &&
                !response.errorCode &&
                response.assets?.[0]?.uri
              ) {
                setAvatarUri(response.assets[0].uri);
                setFormData(prev => ({
                  ...prev,
                  photo_url: response.assets[0].uri,
                }));
              }
            });
          },
        },
        {text: 'Cancel', style: 'cancel'},
      ],
      {cancelable: true},
    );
  }, []);

  if (isLoading || !formData) {
    return (
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          contentContainerStyle={{paddingBottom: 40}}>
          {/* Profile Picture Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                {avatarUri ? (
                  <Image source={{uri: avatarUri}} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarText}>
                    {formData?.full_name
                      ? formData.full_name
                          .split(' ')
                          .map(n => n[0]?.toUpperCase())
                          .join('')
                      : ''}
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
              ref={fullNameRef}
              label="Full Name"
              value={formData.full_name}
              onChangeText={text => handleChange('full_name', text)}
              placeholder="Enter your full name"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() =>
                phoneRef.current && phoneRef.current.focus()
              }
            />

            <InputField
              label="Email Address"
              value={formData.email}
              onChangeText={text => handleChange('email', text)}
              placeholder="Enter your email"
              keyboardType="email-address"
              editable={false}
            />

            <InputField
              ref={phoneRef}
              label="Phone Number"
              value={formData.phone}
              onChangeText={text => handleChange('phone', text)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() =>
                addressRef.current && addressRef.current.focus()
              }
            />

            <InputField
              label="Date of birth"
              value={formData.dob}
              placeholder="26/06/1995"
              keyboardType="default"
              editable={false}
            />
          </View>

          {/* Address Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address Information</Text>
            <InputField
              ref={addressRef}
              label="Address"
              value={formData.address}
              onChangeText={text => handleChange('address', text)}
              placeholder="Enter your address"
              returnKeyType="done"
              blurOnSubmit={true}
            />
          </View>

          {/* Work Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Information</Text>

            {user?.management_type === 'lead_labor' && (
              <InputField
                label="Department"
                value={formData.department}
                placeholder="Department"
                editable={false}
              />
            )}
            {user?.management_type === 'labor' && (
              <InputField
                label="Supervisor"
                value={formData.supervisor}
                placeholder="Supervisor"
                editable={false}
              />
            )}

            <InputField
              label="Status"
              value={formData.status}
              placeholder="Status"
              editable={false}
            />

            <InputField
              label="Joining Date"
              value={formData.date_of_joining}
              placeholder="Hire Date"
              editable={false}
            />
          </View>

          <View style={{height: 40}} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {},
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  backButton: {padding: 8},
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
  avatarContainer: {alignItems: 'center'},
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
    backgroundColor: '#e5e8eaff',
    color: '#000',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'cover',
  },
});

export default EditProfileScreen;
