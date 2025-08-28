// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   StatusBar,
//   StyleSheet,
//   Alert,
//   Switch,
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {useNavigation} from '@react-navigation/native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import moment from 'moment';

// // Embedded Colors
// const Colors = {
//   primary: '#3B82F6',
//   primaryLight: '#EBF4FF',
//   white: '#FFFFFF',
//   backgroundLight: '#F8FAFC',
//   text: '#1E293B',
//   textSecondary: '#64748B',
//   textLight: '#94A3B8',
//   border: '#E2E8F0',
//   success: '#10B981',
//   successLight: '#D1FAE5',
//   warning: '#F59E0B',
//   warningLight: '#FEF3C7',
//   error: '#EF4444',
//   errorLight: '#FEE2E2',
// };

// // Embedded Spacing and Dimensions
// const Spacing = {
//   xs: 4,
//   sm: 8,
//   md: 16,
//   lg: 24,
//   xl: 32,
//   xxl: 48,
// };

// const BorderRadius = {
//   sm: 6,
//   md: 8,
//   lg: 12,
//   xl: 16,
// };

// const Shadows = {
//   md: {
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
// };

// // Embedded Toast Functions
// const showToast = (title, message) => {
//   Alert.alert(title, message);
// };

// const CreateJobScreen = ({onCreateJob, route}) => {
//   const navigation = useNavigation();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [formData, setFormData] = useState({
//     jobType: '',
//     title: '',
//     customer: '',
//     description: '',
//     priority: '',
//     address: '',
//     city: '',
//     zipCode: '',
//     locationPhone: '',
//     locationEmail: '',
//     copyToBilling: false,
//     billingAddress: '',
//     billingCity: '',
//     billingZipCode: '',
//     billingPhone: '',
//     billingEmail: '',
//     dueDate: '',
//     estimatedHours: '',
//     estimatedCost: '',
//     estimate: '',
//     contractor: '',
//     leadLabor: [],
//     labor: [],
//     materials: [],
//   });
//   console.log('formDataformData', formData);

//   // Mock data for dropdowns
//   const contractors = [
//     {id: 'contractor1', name: 'Elite Electrical Services'},
//     {id: 'contractor2', name: 'Texas Power Solutions'},
//     {id: 'contractor3', name: 'Professional Electric Co.'},
//   ];

//   const leadLaborOptions = [
//     {id: 'lead1', name: 'Sarah Johnson'},
//     {id: 'lead2', name: 'Mike Rodriguez'},
//     {id: 'lead3', name: 'Tom Wilson'},
//   ];

//   const laborOptions = [
//     {id: 'labor1', name: 'Alex Smith'},
//     {id: 'labor2', name: 'Jordan Brown'},
//     {id: 'labor3', name: 'Casey Davis'},
//     {id: 'labor4', name: 'Riley Garcia'},
//   ];

//   const availableMaterials = [
//     {id: 'mat1', name: 'Electrical Panel', unit: 'unit'},
//     {id: 'mat2', name: 'Circuit Breaker', unit: 'unit'},
//     {id: 'mat3', name: 'Wire Nuts', unit: 'box'},
//     {id: 'mat4', name: 'THHN Wire', unit: 'ft'},
//     {id: 'mat5', name: 'Conduit', unit: 'ft'},
//     {id: 'mat6', name: 'Junction Box', unit: 'unit'},
//   ];

//   const steps = [
//     // {id: 1, title: 'Job Type', description: 'Select job type'},
//     {id: 1, title: 'Job Details', description: 'Enter job information'},
//     {id: 2, title: 'Resources', description: 'Scheduling & team'},
//     // {id: 4, title: 'Materials', description: 'Required materials'},
//     {id: 3, title: 'Review', description: 'Review & create'},
//   ];

//   useEffect(() => {
//     StatusBar.setBarStyle('dark-content');
//   }, []);

//   const updateFormData = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const onChangeDate = (event, selectedDate) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       updateFormData('dueDate', selectedDate.toISOString());
//     }
//   };
//   const handleCopyToBilling = checked => {
//     updateFormData('copyToBilling', checked);
//     if (checked) {
//       updateFormData('billingAddress', formData.address);
//       updateFormData('billingCity', formData.city);
//       updateFormData('billingZipCode', formData.zipCode);
//       updateFormData('billingPhone', formData.locationPhone);
//       updateFormData('billingEmail', formData.locationEmail);
//     }
//   };

//   const addMaterial = materialId => {
//     const material = availableMaterials.find(m => m.id === materialId);
//     if (material) {
//       const newMaterial = {
//         id: `${material.id}-${Date.now()}`,
//         name: material.name,
//         quantity: 1,
//         unit: material.unit,
//       };
//       updateFormData('materials', [...formData.materials, newMaterial]);
//     }
//   };

//   const updateMaterialQuantity = (materialId, quantity) => {
//     const updatedMaterials = formData.materials.map(m =>
//       m.id === materialId ? {...m, quantity} : m,
//     );
//     updateFormData('materials', updatedMaterials);
//   };

//   const removeMaterial = materialId => {
//     const updatedMaterials = formData.materials.filter(
//       m => m.id !== materialId,
//     );
//     updateFormData('materials', updatedMaterials);
//   };

//   const toggleLabor = (personId, type) => {
//     const currentList = formData[type];
//     if (currentList.includes(personId)) {
//       updateFormData(
//         type,
//         currentList.filter(id => id !== personId),
//       );
//     } else {
//       updateFormData(type, [...currentList, personId]);
//     }
//   };

//   // const validateStep = step => {
//   //   switch (step) {

//   //     case 1:
//   //       if (!formData.title.trim()) {
//   //         showToast('Validation Error', 'Please enter a job title', 'error');
//   //         return false;
//   //       }
//   //       if (!formData.customer.trim()) {
//   //         showToast('Validation Error', 'Please enter customer name', 'error');
//   //         return false;
//   //       }
//   //       if (!formData.description.trim()) {
//   //         showToast(
//   //           'Validation Error',
//   //           'Please enter job description',
//   //           'error',
//   //         );
//   //         return false;
//   //       }
//   //       if (!formData.priority) {
//   //         showToast(
//   //           'Validation Error',
//   //           'Please select priority level',
//   //           'error',
//   //         );
//   //         return false;
//   //       }
//   //       if (!formData.address.trim()) {
//   //         showToast('Validation Error', 'Please enter job address', 'error');
//   //         return false;
//   //       }
//   //       break;
//   //     case 2:
//   //       if (!formData.dueDate) {
//   //         showToast('Validation Error', 'Please select a due date', 'error');
//   //         return false;
//   //       }
//   //       if (!formData.estimatedHours.trim()) {
//   //         showToast(
//   //           'Validation Error',
//   //           'Please enter estimated hours',
//   //           'error',
//   //         );
//   //         return false;
//   //       }
//   //       if (formData.leadLabor.length === 0) {
//   //         showToast(
//   //           'Validation Error',
//   //           'Please assign at least one Lead Labor',
//   //           'error',
//   //         );
//   //         return false;
//   //       }
//   //       break;
//   //     case 3:
//   //       // Materials are optional, so no validation needed
//   //       break;
//   //   }
//   //   return true;
//   // };
// const validateStep = step => {
//   switch (step) {
//     case 1:
//       if (!formData.title.trim()) {
//         showToast('Validation Error', 'Please enter a job title', 'error');
//         return false;
//       }
//       if (!formData.customer.trim()) {
//         showToast('Validation Error', 'Please enter customer name', 'error');
//         return false;
//       }
//       if (!formData.description.trim()) {
//         showToast(
//           'Validation Error',
//           'Please enter job description',
//           'error',
//         );
//         return false;
//       }
//       if (!formData.priority) {
//         showToast(
//           'Validation Error',
//           'Please select priority level',
//           'error',
//         );
//         return false;
//       }
//       if (!formData.address.trim()) {
//         showToast('Validation Error', 'Please enter job address', 'error');
//         return false;
//       }

//       // ✅ Phone validation
//       if (!formData.locationPhone.trim()) {
//         showToast('Validation Error', 'Please enter location phone number', 'error');
//         return false;
//       }
//       if (!/^\d{10}$/.test(formData.locationPhone)) {
//         showToast('Validation Error', 'Phone number must be 10 digits', 'error');
//         return false;
//       }

//       // ✅ Email validation
//       if (!formData.locationEmail.trim()) {
//         showToast('Validation Error', 'Please enter location email', 'error');
//         return false;
//       }
//       if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.locationEmail)) {
//         showToast('Validation Error', 'Please enter a valid email address', 'error');
//         return false;
//       }

//       break;

//     case 2:
//       if (!formData.dueDate) {
//         showToast('Validation Error', 'Please select a due date', 'error');
//         return false;
//       }
//       if (!formData.estimatedHours.trim()) {
//         showToast(
//           'Validation Error',
//           'Please enter estimated hours',
//           'error',
//         );
//         return false;
//       }
//       if (formData.leadLabor.length === 0) {
//         showToast(
//           'Validation Error',
//           'Please assign at least one Lead Labor',
//           'error',
//         );
//         return false;
//       }
//       break;

//     case 3:
//       // Materials are optional
//       break;
//   }
//   return true;
// };

//   const handleNext = () => {
//     if (validateStep(currentStep)) {
//       setCurrentStep(prev => Math.min(prev + 1, 5));
//     }
//   };

//   const handlePrev = () => {
//     setCurrentStep(prev => Math.max(prev - 1, 1));
//   };

//   const handleSubmit = () => {
//     // Transform form data to match expected Job structure
//     const jobData = {
//       id: `job-${Date.now()}`,
//       title: formData.title,
//       description: formData.description,
//       customer: {
//         name: formData.customer,
//         address: formData.address,
//         phone: formData.locationPhone,
//         email: formData.locationEmail,
//       },
//       assignedTo: [...formData.leadLabor, ...formData.labor],
//       status: 'pending',
//       priority: formData.priority,
//       estimatedHours: parseInt(formData.estimatedHours) || 0,
//       scheduledDate: formData.dueDate,
//       scheduledTime: '09:00 AM',
//       startDate: formData.dueDate,
//       dueDate: formData.dueDate,
//       location: {
//         address: formData.address,
//         coordinates: undefined,
//       },
//       materials: formData.materials.map(m => ({
//         name: m.name,
//         quantity: m.quantity,
//         unit: m.unit,
//       })),
//       notes: `Job Type: ${formData.jobType}\n${formData.description}`,
//       createdAt: new Date().toISOString().split('T')[0],
//       updatedAt: new Date().toISOString().split('T')[0],
//       jobType: formData.jobType,
//       contractor: formData.contractor,
//       estimatedCost: formData.estimatedCost,
//       estimate: formData.estimate,
//       billingInfo: formData.copyToBilling
//         ? null
//         : {
//             address: formData.billingAddress,
//             city: formData.billingCity,
//             zipCode: formData.billingZipCode,
//             phone: formData.billingPhone,
//             email: formData.billingEmail,
//           },
//     };

//     if (onCreateJob) {
//       onCreateJob(jobData);
//     }

//     showToast('Success', 'Job created successfully!');
//     navigation.goBack();
//   };

//   const renderProgressBar = () => (
//     <View style={styles.progressContainer}>
//       <View style={styles.progressTrack}>
//         <View
//           style={[styles.progressFill, {width: `${(currentStep / 5) * 100}%`}]}
//         />
//       </View>
//     </View>
//   );

//   const renderStepIndicator = () => (
//     <View style={styles.stepIndicatorContainer}>
//       {steps.map(step => (
//         <View key={step.id} style={styles.stepIndicator}>
//           <View
//             style={[
//               styles.stepCircle,
//               currentStep >= step.id
//                 ? styles.activeStepCircle
//                 : styles.inactiveStepCircle,
//             ]}>
//             {currentStep > step.id ? (
//               <Icon name="check" size={16} color={Colors.white} />
//             ) : (
//               <Text
//                 style={[
//                   styles.stepNumber,
//                   currentStep >= step.id
//                     ? styles.activeStepNumber
//                     : styles.inactiveStepNumber,
//                 ]}>
//                 {step.id}
//               </Text>
//             )}
//           </View>
//           <Text style={[styles.stepTitle, {fontSize: 14}]}>{step.title}</Text>
//           <Text style={styles.stepDescription}>{step.description}</Text>
//         </View>
//       ))}
//     </View>
//   );

//   const renderHeader = () => (
//     <View style={styles.header}>
//       <TouchableOpacity
//         style={styles.backButton}
//         onPress={currentStep === 1 ? () => navigation.goBack() : handlePrev}>
//         <Icon name="arrow-back" size={24} color={Colors.text} />
//       </TouchableOpacity>

//       <View style={styles.headerContent}>
//         <Text style={styles.headerTitle}>Create New Job</Text>
//         <Text style={styles.headerSubtitle}>Step {currentStep} of 3</Text>
//       </View>

//       <View style={styles.headerSpacer} />
//     </View>
//   );

//   const renderJobTypeCard = (type, title, description, iconName, iconColor) => (
//     <TouchableOpacity
//       style={[
//         styles.jobTypeCard,
//         formData.jobType === type && styles.selectedJobTypeCard,
//       ]}
//       onPress={() => updateFormData('jobType', type)}>
//       <View style={styles.jobTypeCardContent}>
//         <View style={[styles.jobTypeIcon, {backgroundColor: `${iconColor}20`}]}>
//           <Icon name={iconName} size={32} color={iconColor} />
//         </View>

//         <View style={styles.jobTypeTextContent}>
//           <Text style={styles.jobTypeTitle}>{title}</Text>
//           <Text style={styles.jobTypeDescription}>{description}</Text>
//         </View>

//         <View
//           style={[
//             styles.radioButton,
//             formData.jobType === type && styles.selectedRadioButton,
//           ]}>
//           {formData.jobType === type && (
//             <Icon name="check" size={16} color={Colors.white} />
//           )}
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
//   useEffect(() => {
//     {
//       renderJobTypeCard(
//         'service-based',
//         'Service-Based Job',
//         'For one-time service jobs with specific deliverables and a defined timeline (e.g., installations, repairs, maintenance).',
//         'build',
//         Colors.primary,
//       );
//     }
//   }, []);

//   // const renderStep1 = () => (
//   //   <View style={styles.stepContainer}>
//   //     <View style={styles.stepHeader}>
//   //       <Text style={styles.stepTitle}>Select Job Type</Text>
//   //       <Text style={styles.stepSubtitle}>
//   //         Choose the type of job you want to create
//   //       </Text>
//   //     </View>

//   //     <View style={styles.jobTypeContainer}>
//   //       {renderJobTypeCard(
//   //         'service-based',
//   //         'Service-Based Job',
//   //         'For one-time service jobs with specific deliverables and a defined timeline (e.g., installations, repairs, maintenance).',
//   //         'build',
//   //         Colors.primary,
//   //       )}

//   //       {renderJobTypeCard(
//   //         'contract-based',
//   //         'Contract-Based Job',
//   //         'For ongoing or long-term jobs involving external contractors or outsourcing with extended timelines and multiple phases.',
//   //         'group',
//   //         Colors.success,
//   //       )}
//   //     </View>
//   //   </View>
//   // );

//   // const renderInputField = (
//   //   label,
//   //   value,
//   //   onChangeText,
//   //   placeholder,
//   //   multiline = false,
//   //   keyboardType = 'default',
//   //   onOpenDatePicker,
//   // ) => (
//   //   <View style={styles.inputGroup}>
//   //     <Text style={styles.inputLabel}>{label}</Text>
//   //     <TextInput
//   //       style={[styles.textInput, multiline && styles.textArea]}
//   //       value={value}
//   //       onChangeText={onChangeText}
//   //       placeholder={placeholder}
//   //       placeholderTextColor={Colors.textSecondary}
//   //       multiline={multiline}
//   //       numberOfLines={multiline ? 4 : 1}
//   //       textAlignVertical={multiline ? 'top' : 'center'}
//   //       keyboardType={keyboardType}
//   //     />
//   //   </View>
//   // );
//   const renderInputField = (
//     label,
//     value,
//     onChangeText,
//     placeholder,
//     multiline = false,
//     keyboardType = 'default',
//     isDateField = false,
//     onOpenDatePicker = () => {},
//   ) => (
//     <View style={styles.inputGroup}>
//       <Text style={styles.inputLabel}>{label}</Text>

//       {isDateField ? (
//         <Pressable onPress={onOpenDatePicker} style={styles.textInput}>
//           <Text style={{color: value ? '#000' : '#aaa'}}>
//             {value ? moment(value).format('YYYY-MM-DD') : placeholder}
//           </Text>
//         </Pressable>
//       ) : (
//         <TextInput
//           style={[styles.textInput, multiline && styles.textArea]}
//           value={value}
//           onChangeText={onChangeText}
//           placeholder={placeholder}
//           placeholderTextColor={'#aaa'}
//           multiline={multiline}
//           numberOfLines={multiline ? 4 : 1}
//           textAlignVertical={multiline ? 'top' : 'center'}
//           keyboardType={keyboardType}
//         />
//       )}
//     </View>
//   );

//   const renderPrioritySelector = () => (
//     <View style={styles.inputGroup}>
//       <Text style={styles.inputLabel}>Priority *</Text>
//       <View style={styles.priorityContainer}>
//         {['high', 'medium', 'low'].map(priority => (
//           <TouchableOpacity
//             key={priority}
//             style={[
//               styles.priorityOption,
//               formData.priority === priority && styles.selectedPriorityOption,
//             ]}
//             onPress={() => updateFormData('priority', priority)}>
//             <Text
//               style={[
//                 styles.priorityText,
//                 formData.priority === priority && styles.selectedPriorityText,
//               ]}>
//               {priority.charAt(0).toUpperCase() + priority.slice(1)}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );

//   const renderStep2 = () => (
//     <ScrollView
//       style={styles.stepContainer}
//       showsVerticalScrollIndicator={false}>
//       <View style={styles.stepHeader}>
//         <Text style={styles.stepTitle}>Job Details</Text>
//         <Text style={styles.stepSubtitle}>
//           Enter the basic information about this job
//         </Text>
//       </View>

//       <View style={styles.sectionCard}>
//         <View style={styles.sectionHeader}>
//           <Icon name="work" size={20} color={Colors.primary} />
//           <Text style={styles.sectionTitle}>Job Information</Text>
//         </View>

//         {renderInputField(
//           'Job Title *',
//           formData.title,
//           text => updateFormData('title', text),
//           'Enter the name/title of the job',
//         )}
//         {renderInputField(
//           // formData.jobType === 'service-based' ? 'Customer *' : 'Contractor *',
//           'Customer *',
//           formData.customer,
//           text => updateFormData('customer', text),
//           "Enter the client's or company's name",
//         )}
//         {renderInputField(
//           'Description *',
//           formData.description,
//           text => updateFormData('description', text),
//           'Add details about job scope and requirements',
//           true,
//         )}
//         {renderPrioritySelector()}
//       </View>

//       <View style={styles.sectionCard}>
//         <View style={styles.sectionHeader}>
//           <Icon name="place" size={20} color={Colors.primary} />
//           <Text style={styles.sectionTitle}>Location Information</Text>
//         </View>

//         {renderInputField(
//           'Address *',
//           formData.address,
//           text => updateFormData('address', text),
//           'Job location details',
//         )}

//         <View style={styles.rowContainer}>
//           <View style={styles.halfWidth}>
//             {renderInputField(
//               'City',
//               formData.city,
//               text => updateFormData('city', text),
//               'City',
//             )}
//           </View>
//           <View style={styles.halfWidth}>
//             {renderInputField(
//               'ZIP Code',
//               formData.zipCode,
//               text => updateFormData('zipCode', text),
//               'Postal code',
//             )}
//           </View>
//         </View>

//         {renderInputField(
//           'Phone *',
//           formData.locationPhone,
//           text => updateFormData('locationPhone', text),
//           'Contact phone number',
//           false,
//           'phone-pad',
//         )}
//         {renderInputField(
//           'Email *',
//           formData.locationEmail,
//           text => updateFormData('locationEmail', text),
//           'Contact email address',
//           false,
//           'email-address',
//         )}
//       </View>

//       <View style={styles.sectionCard}>
//         <View style={styles.sectionHeader}>
//           <Icon name="attach-money" size={20} color={Colors.primary} />
//           <Text style={styles.sectionTitle}>Bill To Information</Text>
//         </View>

//         <View style={styles.checkboxContainer}>
//           <Switch
//             value={formData.copyToBilling}
//             onValueChange={handleCopyToBilling}
//             trackColor={{false: Colors.border, true: Colors.primary}}
//             thumbColor={Colors.white}
//           />
//           <Text style={styles.checkboxLabel}>Same as job address</Text>
//         </View>

//         {!formData.copyToBilling && (
//           <View style={styles.billingSection}>
//             {renderInputField(
//               'Billing Address',
//               formData.billingAddress,
//               text => updateFormData('billingAddress', text),
//               'Billing address',
//             )}

//             <View style={styles.rowContainer}>
//               <View style={styles.halfWidth}>
//                 {renderInputField(
//                   'City',
//                   formData.billingCity,
//                   text => updateFormData('billingCity', text),
//                   'City',
//                 )}
//               </View>
//               <View style={styles.halfWidth}>
//                 {renderInputField(
//                   'ZIP Code',
//                   formData.billingZipCode,
//                   text => updateFormData('billingZipCode', text),
//                   'Postal code',
//                 )}
//               </View>
//             </View>

//             {renderInputField(
//               'Phone',
//               formData.billingPhone,
//               text => updateFormData('billingPhone', text),
//               'Billing contact phone',
//               false,
//               'phone-pad',
//             )}
//             {renderInputField(
//               'Email',
//               formData.billingEmail,
//               text => updateFormData('billingEmail', text),
//               'Billing contact email',
//               false,
//               'email-address',
//             )}
//           </View>
//         )}
//       </View>
//     </ScrollView>
//   );

//   const renderStep3 = () => (
//     <ScrollView
//       style={styles.stepContainer}
//       showsVerticalScrollIndicator={false}>
//       <View style={styles.stepHeader}>
//         <Text style={styles.stepTitle}>Resources & Scheduling</Text>
//         <Text style={styles.stepSubtitle}>
//           Set timeline, estimates, and assign team members
//         </Text>
//       </View>

//       <View style={styles.sectionCard}>
//         <View style={styles.sectionHeader}>
//           <Icon name="schedule" size={20} color={Colors.primary} />
//           <Text style={styles.sectionTitle}>Scheduling & Estimates</Text>
//         </View>
//         {renderInputField(
//           'Due Date *',
//           formData.dueDate,
//           text => updateFormData('dueDate', text),
//           'YYYY-MM-DD',
//           false,
//           'default',
//           true, // isDateField = true
//           () => setShowDatePicker(true),
//         )}

//         {showDatePicker && (
//           <DateTimePicker
//             value={formData.dueDate ? new Date(formData.dueDate) : new Date()}
//             mode="date"
//             display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//             onChange={onChangeDate}
//           />
//         )}
//         {/* {renderInputField('Due Date *', formData.dueDate, (text) => updateFormData('dueDate', text), 'YYYY-MM-DD')} */}
//         {renderInputField(
//           'Estimated Hours *',
//           formData.estimatedHours,
//           text => updateFormData('estimatedHours', text),
//           'Hours required',
//           false,
//           'numeric',
//         )}
//         {/* {renderInputField(
//           'Cost ($)',
//           formData.estimatedCost,
//           text => updateFormData('estimatedCost', text),
//           'Internal cost estimate',
//           false,
//           'numeric',
//         )} */}
//         {renderInputField(
//           'Estimate ($)',
//           formData.estimate,
//           text => updateFormData('estimate', text),
//           'Customer estimate',
//           false,
//           'numeric',
//         )}

//         {/* {formData.jobType === 'contract-based' && (
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>Contractor (Optional)</Text>
//             <View style={styles.dropdownContainer}>
//               {contractors.map(contractor => (
//                 <TouchableOpacity
//                   key={contractor.id}
//                   style={[
//                     styles.dropdownOption,
//                     formData.contractor === contractor.id &&
//                       styles.selectedDropdownOption,
//                   ]}
//                   onPress={() => updateFormData('contractor', contractor.id)}>
//                   <Text
//                     style={[
//                       styles.dropdownOptionText,
//                       formData.contractor === contractor.id &&
//                         styles.selectedDropdownOptionText,
//                     ]}>
//                     {contractor.name}
//                   </Text>
//                   {formData.contractor === contractor.id && (
//                     <Icon name="check" size={20} color={Colors.primary} />
//                   )}
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         )} */}
//       </View>

//       <View style={styles.sectionCard}>
//         <View style={styles.sectionHeader}>
//           <Icon name="group" size={20} color={Colors.primary} />
//           <Text style={styles.sectionTitle}>Assign Labor</Text>
//         </View>

//         <View style={styles.laborSection}>
//           <Text style={styles.laborSectionTitle}>Lead Labor *</Text>
//           <Text style={styles.laborSectionSubtitle}>
//             Main responsible persons
//           </Text>

//           {leadLaborOptions.map(person => (
//             <TouchableOpacity
//               key={person.id}
//               style={styles.laborOption}
//               onPress={() => toggleLabor(person.id, 'leadLabor')}>
//               <View
//                 style={[
//                   styles.checkbox,
//                   formData.leadLabor.includes(person.id) &&
//                     styles.selectedCheckbox,
//                 ]}>
//                 {formData.leadLabor.includes(person.id) && (
//                   <Icon name="check" size={16} color={Colors.white} />
//                 )}
//               </View>
//               <Text style={styles.laborOptionText}>{person.name}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <View style={styles.laborSection}>
//           <Text style={styles.laborSectionTitle}>Labor</Text>
//           <Text style={styles.laborSectionSubtitle}>
//             Supporting team members
//           </Text>

//           {laborOptions.map(person => (
//             <TouchableOpacity
//               key={person.id}
//               style={styles.laborOption}
//               onPress={() => toggleLabor(person.id, 'labor')}>
//               <View
//                 style={[
//                   styles.checkbox,
//                   formData.labor.includes(person.id) && styles.selectedCheckbox,
//                 ]}>
//                 {formData.labor.includes(person.id) && (
//                   <Icon name="check" size={16} color={Colors.white} />
//                 )}
//               </View>
//               <Text style={styles.laborOptionText}>{person.name}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>
//     </ScrollView>
//   );

//   // const renderStep4 = () => (
//   //   <ScrollView
//   //     style={styles.stepContainer}
//   //     showsVerticalScrollIndicator={false}>
//   //     <View style={styles.stepHeader}>
//   //       <Text style={styles.stepTitle}>Materials</Text>
//   //       <Text style={styles.stepSubtitle}>
//   //         Add materials required for this job
//   //       </Text>
//   //     </View>

//   //     <View style={styles.sectionCard}>
//   //       <View style={styles.sectionHeader}>
//   //         <Icon name="build" size={20} color={Colors.primary} />
//   //         <Text style={styles.sectionTitle}>Required Materials</Text>
//   //       </View>

//   //       <View style={styles.inputGroup}>
//   //         <Text style={styles.inputLabel}>Add Material</Text>
//   //         <View style={styles.materialsDropdown}>
//   //           {availableMaterials.map(material => (
//   //             <TouchableOpacity
//   //               key={material.id}
//   //               style={styles.materialOption}
//   //               onPress={() => addMaterial(material.id)}>
//   //               <Text style={styles.materialOptionText}>{material.name}</Text>
//   //               <Icon name="add" size={20} color={Colors.primary} />
//   //             </TouchableOpacity>
//   //           ))}
//   //         </View>
//   //       </View>

//   //       {formData.materials.length > 0 && (
//   //         <View style={styles.selectedMaterials}>
//   //           <Text style={styles.selectedMaterialsTitle}>
//   //             Selected Materials
//   //           </Text>
//   //           {formData.materials.map(material => (
//   //             <View key={material.id} style={styles.materialItem}>
//   //               <View style={styles.materialInfo}>
//   //                 <Text style={styles.materialName}>{material.name}</Text>
//   //               </View>

//   //               <View style={styles.quantityContainer}>
//   //                 <TextInput
//   //                   style={styles.quantityInput}
//   //                   value={material.quantity.toString()}
//   //                   onChangeText={text =>
//   //                     updateMaterialQuantity(material.id, parseInt(text) || 1)
//   //                   }
//   //                   keyboardType="numeric"
//   //                 />
//   //                 <Text style={styles.unitText}>{material.unit}</Text>
//   //               </View>

//   //               <TouchableOpacity
//   //                 style={styles.removeButton}
//   //                 onPress={() => removeMaterial(material.id)}>
//   //                 <Icon name="close" size={20} color={Colors.error} />
//   //               </TouchableOpacity>
//   //             </View>
//   //           ))}
//   //         </View>
//   //       )}

//   //       {formData.materials.length === 0 && (
//   //         <View style={styles.emptyMaterials}>
//   //           <Icon name="build" size={48} color={Colors.textLight} />
//   //           <Text style={styles.emptyMaterialsTitle}>
//   //             No materials added yet
//   //           </Text>
//   //           <Text style={styles.emptyMaterialsSubtitle}>
//   //             Select materials from the list above
//   //           </Text>
//   //         </View>
//   //       )}
//   //     </View>
//   //   </ScrollView>
//   // );

//   const renderReviewItem = (label, value) => (
//     <View style={styles.reviewItem}>
//       <Text style={styles.reviewLabel}>{label}</Text>
//       <Text style={styles.reviewValue}>{value}</Text>
//     </View>
//   );

//   const getPriorityBadgeStyle = priority => {
//     switch (priority) {
//       case 'high':
//         return {backgroundColor: Colors.error, color: Colors.white};
//       case 'medium':
//         return {backgroundColor: Colors.warning, color: Colors.white};
//       case 'low':
//         return {backgroundColor: Colors.success, color: Colors.white};
//       default:
//         return {backgroundColor: Colors.textSecondary, color: Colors.white};
//     }
//   };

//   const renderStep4 = () => (
//     <ScrollView
//       style={styles.stepContainer}
//       showsVerticalScrollIndicator={false}>
//       <View style={styles.stepHeader}>
//         <Text style={styles.stepTitle}>Review & Create Job</Text>
//         <Text style={styles.stepSubtitle}>
//           Review all details before creating the job
//         </Text>
//       </View>

//       <View style={styles.sectionCard}>
//         <View style={styles.sectionHeader}>
//           <Icon name="work" size={20} color={Colors.primary} />
//           <Text style={styles.sectionTitle}>Job Summary</Text>
//         </View>

//         {renderReviewItem(
//           'Job Type',
//           formData.jobType
//             .replace('-', ' ')
//             .replace(/\b\w/g, l => l.toUpperCase()),
//         )}
//         {renderReviewItem('Title', formData.title)}
//         {renderReviewItem('Customer', formData.customer)}
//         {formData.contractor &&
//           renderReviewItem(
//             'Contractor',
//             contractors.find(c => c.id === formData.contractor)?.name || '',
//           )}

//         <View style={styles.reviewRow}>
//           <View style={styles.reviewColumn}>
//             <Text style={styles.reviewLabel}>Priority</Text>
//             <View
//               style={[
//                 styles.priorityBadge,
//                 getPriorityBadgeStyle(formData.priority),
//               ]}>
//               <Text
//                 style={[
//                   styles.priorityBadgeText,
//                   {color: getPriorityBadgeStyle(formData.priority).color},
//                 ]}>
//                 {formData.priority.toUpperCase()}
//               </Text>
//             </View>
//           </View>
//           <View style={styles.reviewColumn}>
//             {renderReviewItem(
//               'Due Date',
//               new Date(formData.dueDate).toLocaleDateString(),
//             )}
//           </View>
//           <View style={styles.reviewColumn}>
//             {renderReviewItem('Est. Hours', `${formData.estimatedHours}h`)}
//           </View>
//         </View>

//         {(formData.estimatedCost || formData.estimate) && (
//           <View style={styles.reviewRow}>
//             {formData.estimatedCost && (
//               <View style={styles.reviewColumn}>
//                 {renderReviewItem('Cost', `$${formData.estimatedCost}`)}
//               </View>
//             )}
//             {formData.estimate && (
//               <View style={styles.reviewColumn}>
//                 {renderReviewItem('Estimate', `$${formData.estimate}`)}
//               </View>
//             )}
//           </View>
//         )}

//         <View style={styles.descriptionSection}>
//           <Text style={styles.reviewLabel}>Description</Text>
//           <Text style={styles.descriptionText}>{formData.description}</Text>
//         </View>
//       </View>

//       <View style={styles.sectionCard}>
//         <View style={styles.sectionHeader}>
//           <Icon name="place" size={20} color={Colors.primary} />
//           <Text style={styles.sectionTitle}>Address & Contact</Text>
//         </View>

//         <Text style={styles.reviewLabel}>Job Location</Text>
//         <Text style={styles.addressText}>{formData.address}</Text>
//         {(formData.city || formData.zipCode) && (
//           <Text style={styles.addressText}>
//             {formData.city}
//             {formData.city && formData.zipCode ? ', ' : ''}
//             {formData.zipCode}
//           </Text>
//         )}

//         {(formData.locationPhone || formData.locationEmail) && (
//           <View style={styles.contactInfo}>
//             {formData.locationPhone && (
//               <View style={styles.contactItem}>
//                 <Icon name="phone" size={16} color={Colors.textSecondary} />
//                 <Text style={styles.contactText}>{formData.locationPhone}</Text>
//               </View>
//             )}
//             {formData.locationEmail && (
//               <View style={styles.contactItem}>
//                 <Icon name="email" size={16} color={Colors.textSecondary} />
//                 <Text style={styles.contactText}>{formData.locationEmail}</Text>
//               </View>
//             )}
//           </View>
//         )}
//       </View>

//       <View style={styles.sectionCard}>
//         <View style={styles.sectionHeader}>
//           <Icon name="group" size={20} color={Colors.primary} />
//           <Text style={styles.sectionTitle}>Assigned Team</Text>
//         </View>

//         {formData.leadLabor.length > 0 && (
//           <View style={styles.teamSection}>
//             <Text style={styles.reviewLabel}>Lead Labor</Text>
//             <View style={styles.teamBadges}>
//               {formData.leadLabor.map(id => (
//                 <View
//                   key={id}
//                   style={[styles.teamBadge, {backgroundColor: Colors.primary}]}>
//                   <Text style={styles.teamBadgeText}>
//                     {leadLaborOptions.find(p => p.id === id)?.name}
//                   </Text>
//                 </View>
//               ))}
//             </View>
//           </View>
//         )}

//         {formData.labor.length > 0 && (
//           <View style={styles.teamSection}>
//             <Text style={styles.reviewLabel}>Labor</Text>
//             <View style={styles.teamBadges}>
//               {formData.labor.map(id => (
//                 <View
//                   key={id}
//                   style={[
//                     styles.teamBadge,
//                     {backgroundColor: Colors.textSecondary},
//                   ]}>
//                   <Text style={styles.teamBadgeText}>
//                     {laborOptions.find(p => p.id === id)?.name}
//                   </Text>
//                 </View>
//               ))}
//             </View>
//           </View>
//         )}
//       </View>

//       {formData.materials.length > 0 && (
//         <View style={styles.sectionCard}>
//           <View style={styles.sectionHeader}>
//             <Icon name="build" size={20} color={Colors.primary} />
//             <Text style={styles.sectionTitle}>Materials</Text>
//           </View>

//           {formData.materials.map(material => (
//             <View key={material.id} style={styles.reviewMaterialItem}>
//               <Text style={styles.materialReviewName}>{material.name}</Text>
//               <Text style={styles.materialReviewQuantity}>
//                 {material.quantity} {material.unit}
//               </Text>
//             </View>
//           ))}
//         </View>
//       )}
//     </ScrollView>
//   );

//   const renderFooter = () => (
//     <View style={styles.footer}>
//       <View style={styles.footerContent}>
//         {currentStep > 1 && (
//           <TouchableOpacity style={styles.prevButton} onPress={handlePrev}>
//             <Text style={styles.prevButtonText}>Previous</Text>
//           </TouchableOpacity>
//         )}

//         {currentStep < 3 ? (
//           <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
//             <Text style={styles.nextButtonText}>Next</Text>
//             <Icon name="arrow-forward" size={20} color={Colors.white} />
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity style={styles.createButton} onPress={handleSubmit}>
//             <Icon name="check" size={20} color={Colors.white} />
//             <Text style={styles.createButtonText}>Create Job</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//       <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
//       {renderHeader()}
//       {renderProgressBar()}
//       {renderStepIndicator()}

//       <View style={styles.content}>
//         {/* {currentStep === 1 && renderStep1()} */}
//         {currentStep === 1 && renderStep2()}
//         {currentStep === 2 && renderStep3()}
//         {/* {currentStep === 4 && renderStep4()} */}
//         {currentStep === 3 && renderStep4()}
//       </View>

//       {renderFooter()}
//     </KeyboardAvoidingView>
//   );
// };

// // Embedded Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.backgroundLight,
//     marginBottom: 20,
//   },

//   // Header
//   header: {
//     backgroundColor: Colors.white,
//     paddingTop: Spacing.xl,
//     paddingHorizontal: Spacing.md,
//     paddingBottom: Spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: Colors.backgroundLight,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerContent: {
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: Colors.text,
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     marginTop: Spacing.xs,
//   },
//   headerSpacer: {
//     width: 40,
//   },

//   // Progress Bar
//   progressContainer: {
//     backgroundColor: Colors.white,
//     paddingHorizontal: Spacing.md,
//     paddingBottom: Spacing.md,
//   },
//   progressTrack: {
//     height: 4,
//     backgroundColor: Colors.border,
//     borderRadius: 2,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: Colors.primary,
//     borderRadius: 2,
//   },

//   // Step Indicator
//   stepIndicatorContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     backgroundColor: Colors.white,
//     paddingHorizontal: Spacing.md,
//     paddingBottom: Spacing.md,
//   },
//   stepIndicator: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   stepCircle: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: Spacing.sm,
//   },
//   activeStepCircle: {
//     backgroundColor: Colors.primary,
//   },
//   inactiveStepCircle: {
//     backgroundColor: Colors.border,
//   },
//   stepNumber: {
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   activeStepNumber: {
//     color: Colors.white,
//   },
//   inactiveStepNumber: {
//     color: Colors.textSecondary,
//   },
//   // stepTitle: {
//   //   fontSize: 12,
//   //   fontWeight: '600',
//   //   color: Colors.text,
//   //   textAlign: 'center',
//   // },
//   stepDescription: {
//     fontSize: 10,
//     color: Colors.textSecondary,
//     textAlign: 'center',
//     marginTop: Spacing.xs,
//   },

//   // Content
//   content: {
//     flex: 1,
//   },
//   stepContainer: {
//     flex: 1,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.lg,
//   },
//   stepHeader: {
//     alignItems: 'center',
//     marginBottom: Spacing.xl,
//   },
//   stepTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: Colors.text,
//     marginBottom: Spacing.sm,
//     textAlign: 'center',
//   },
//   stepSubtitle: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//     textAlign: 'center',
//   },

//   // Job Type Cards
//   jobTypeContainer: {
//     gap: Spacing.md,
//   },
//   jobTypeCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     borderWidth: 2,
//     borderColor: Colors.border,
//     ...Shadows.md,
//   },
//   selectedJobTypeCard: {
//     borderColor: Colors.primary,
//     backgroundColor: Colors.primaryLight,
//   },
//   jobTypeCardContent: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     gap: Spacing.md,
//   },
//   jobTypeIcon: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   jobTypeTextContent: {
//     flex: 1,
//   },
//   jobTypeTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: Colors.text,
//     marginBottom: Spacing.sm,
//   },
//   jobTypeDescription: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     lineHeight: 20,
//   },
//   radioButton: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: Colors.border,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   selectedRadioButton: {
//     backgroundColor: Colors.primary,
//     borderColor: Colors.primary,
//   },

//   // Section Cards
//   sectionCard: {
//     backgroundColor: Colors.white,
//     borderRadius: BorderRadius.lg,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//     ...Shadows.md,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: Spacing.sm,
//     marginBottom: Spacing.md,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: Colors.text,
//   },

//   // Input Fields
//   inputGroup: {
//     marginBottom: Spacing.md,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: Colors.text,
//     marginBottom: Spacing.sm,
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: BorderRadius.md,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.md,
//     fontSize: 16,
//     color: Colors.text,
//     backgroundColor: Colors.white,
//   },
//   textArea: {
//     height: 100,
//     textAlignVertical: 'top',
//     paddingTop: Spacing.md,
//   },

//   // Row Layout
//   rowContainer: {
//     flexDirection: 'row',
//     gap: Spacing.md,
//   },
//   halfWidth: {
//     flex: 1,
//   },

//   // Priority Selector
//   priorityContainer: {
//     flexDirection: 'row',
//     gap: Spacing.sm,
//   },
//   priorityOption: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     paddingHorizontal: Spacing.sm,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: BorderRadius.md,
//     alignItems: 'center',
//   },
//   selectedPriorityOption: {
//     backgroundColor: Colors.primary,
//     borderColor: Colors.primary,
//   },
//   priorityText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: Colors.text,
//   },
//   selectedPriorityText: {
//     color: Colors.white,
//   },

//   // Checkbox
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: Spacing.sm,
//     marginBottom: Spacing.md,
//   },
//   checkboxLabel: {
//     fontSize: 16,
//     color: Colors.text,
//     fontWeight: '500',
//   },

//   // Billing Section
//   billingSection: {
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//     paddingTop: Spacing.md,
//   },

//   // Dropdown
//   dropdownContainer: {
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: BorderRadius.md,
//     backgroundColor: Colors.white,
//   },
//   dropdownOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//   },
//   selectedDropdownOption: {
//     backgroundColor: Colors.primaryLight,
//   },
//   dropdownOptionText: {
//     fontSize: 16,
//     color: Colors.text,
//   },
//   selectedDropdownOptionText: {
//     color: Colors.primary,
//     fontWeight: '500',
//   },

//   // Labor Section
//   laborSection: {
//     marginBottom: Spacing.lg,
//   },
//   laborSectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: Colors.text,
//     marginBottom: Spacing.xs,
//   },
//   laborSectionSubtitle: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     marginBottom: Spacing.md,
//   },
//   laborOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: Spacing.sm,
//     paddingVertical: Spacing.sm,
//   },
//   checkbox: {
//     width: 20,
//     height: 20,
//     borderRadius: 4,
//     borderWidth: 2,
//     borderColor: Colors.border,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   selectedCheckbox: {
//     backgroundColor: Colors.primary,
//     borderColor: Colors.primary,
//   },
//   laborOptionText: {
//     fontSize: 16,
//     color: Colors.text,
//   },

//   // Materials
//   materialsDropdown: {
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: BorderRadius.md,
//     backgroundColor: Colors.white,
//     marginBottom: Spacing.md,
//   },
//   materialOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//   },
//   materialOptionText: {
//     fontSize: 16,
//     color: Colors.text,
//   },
//   selectedMaterials: {
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//     paddingTop: Spacing.md,
//   },
//   selectedMaterialsTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: Colors.text,
//     marginBottom: Spacing.md,
//   },
//   materialItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: Spacing.sm,
//     paddingVertical: Spacing.sm,
//     paddingHorizontal: Spacing.md,
//     backgroundColor: Colors.backgroundLight,
//     borderRadius: BorderRadius.md,
//     marginBottom: Spacing.sm,
//   },
//   materialInfo: {
//     flex: 1,
//   },
//   materialName: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: Colors.text,
//   },
//   quantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: Spacing.sm,
//   },
//   quantityInput: {
//     width: 60,
//     height: 32,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: BorderRadius.sm,
//     paddingHorizontal: Spacing.sm,
//     textAlign: 'center',
//     fontSize: 14,
//     color: Colors.text,
//   },
//   unitText: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//   },
//   removeButton: {
//     padding: Spacing.sm,
//   },
//   emptyMaterials: {
//     alignItems: 'center',
//     paddingVertical: Spacing.xl,
//   },
//   emptyMaterialsTitle: {
//     fontSize: 16,
//     color: Colors.textSecondary,
//     marginTop: Spacing.md,
//   },
//   emptyMaterialsSubtitle: {
//     fontSize: 14,
//     color: Colors.textLight,
//     marginTop: Spacing.xs,
//   },

//   // Review
//   reviewItem: {
//     marginBottom: Spacing.md,
//   },
//   reviewLabel: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     fontWeight: '500',
//     marginBottom: Spacing.xs,
//   },
//   reviewValue: {
//     fontSize: 16,
//     color: Colors.text,
//     fontWeight: '500',
//   },
//   reviewRow: {
//     flexDirection: 'row',
//     gap: Spacing.md,
//     marginVertical: Spacing.md,
//     paddingTop: Spacing.md,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//   },
//   reviewColumn: {
//     flex: 1,
//   },
//   priorityBadge: {
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: Spacing.xs,
//     borderRadius: BorderRadius.sm,
//     alignSelf: 'flex-start',
//     marginTop: Spacing.xs,
//   },
//   priorityBadgeText: {
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   descriptionSection: {
//     marginTop: Spacing.md,
//     paddingTop: Spacing.md,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//   },
//   descriptionText: {
//     fontSize: 16,
//     color: Colors.text,
//     lineHeight: 24,
//     marginTop: Spacing.xs,
//   },
//   addressText: {
//     fontSize: 16,
//     color: Colors.text,
//     marginTop: Spacing.xs,
//   },
//   contactInfo: {
//     marginTop: Spacing.md,
//     gap: Spacing.sm,
//   },
//   contactItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: Spacing.sm,
//   },
//   contactText: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//   },
//   teamSection: {
//     marginBottom: Spacing.md,
//   },
//   teamBadges: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: Spacing.sm,
//     marginTop: Spacing.sm,
//   },
//   teamBadge: {
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.sm,
//     borderRadius: BorderRadius.md,
//   },
//   teamBadgeText: {
//     fontSize: 14,
//     color: Colors.white,
//     fontWeight: '500',
//   },
//   reviewMaterialItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: Spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//   },
//   materialReviewName: {
//     fontSize: 16,
//     color: Colors.text,
//   },
//   materialReviewQuantity: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//   },

//   // Footer
//   footer: {
//     backgroundColor: Colors.white,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.md,
//   },
//   footerContent: {
//     flexDirection: 'row',
//     gap: Spacing.md,
//   },
//   prevButton: {
//     flex: 1,
//     paddingVertical: Spacing.md,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: BorderRadius.md,
//     alignItems: 'center',
//   },
//   prevButtonText: {
//     fontSize: 16,
//     color: Colors.text,
//     fontWeight: '500',
//   },
//   nextButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.md,
//     paddingVertical: Spacing.md,
//     gap: Spacing.sm,
//   },
//   nextButtonText: {
//     fontSize: 16,
//     color: Colors.white,
//     fontWeight: '600',
//   },
//   createButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.md,
//     paddingVertical: Spacing.md,
//     gap: Spacing.sm,
//   },
//   createButtonText: {
//     fontSize: 16,
//     color: Colors.white,
//     fontWeight: '600',
//   },
// });

// export default CreateJobScreen;
import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  StatusBar,
  SafeAreaView,
  Switch,
  Modal,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  findNodeHandle,
  UIManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {heightPercentageToDP, widthPercentageToDP} from '../utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width: screenWidth} = Dimensions.get('window');

const customers = [
  {id: '1', name: 'John Smith'},
  {id: '2', name: 'Emily Johnson'},
  {id: '3', name: 'Michael Brown'},
  {id: '4', name: 'Olivia Davis'},
  {id: '5', name: 'William Miller'},
];

const CreateJobScreen = ({navigation, user, onCreateJob}) => {
  const scrollRef = useRef(null);
  const fieldPositions = useRef({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  // Dropdown states
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  // Location autocomplete states
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [billingLocationSuggestions, setBillingLocationSuggestions] = useState(
    [],
  );
  const [billingCitySuggestions, setBillingCitySuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [showBillingLocationSuggestions, setShowBillingLocationSuggestions] =
    useState(false);
  const [showBillingCitySuggestions, setShowBillingCitySuggestions] =
    useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = member => {
    const isSelected = formData.assignedTo.includes(member.name);

    if (isSelected) {
      updateFormData(
        'assignedTo',
        formData.assignedTo.filter(name => name !== member.name),
      );
    } else {
      updateFormData('assignedTo', [...formData.assignedTo, member.name]);
    }
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    city: '',
    priority: 'medium',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '09:00',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    billingName: '',
    billingPhone: '',
    billingEmail: '',
    billingAddress: '',
    billingCity: '',
    sameAsCustomer: true,
    assignedTo: [],
    estimatedHours: 8,
    notes: '',
  });
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  //  Load from AsyncStorage on mount
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await AsyncStorage.getItem('customers');
      if (data) {
        setCustomers(JSON.parse(data));
      }
    } catch (e) {
      console.log('Error loading customers:', e);
    }
  };

  const saveCustomers = async newList => {
    try {
      await AsyncStorage.setItem('customers', JSON.stringify(newList));
      setCustomers(newList);
    } catch (e) {
      console.log('Error saving customers:', e);
    }
  };

  const handleChange = text => {
    setSearch(text);
    setFormData({...formData, customerName: text});
    if (validationErrors.customerName) {
      setValidationErrors(prev => ({...prev, customerName: ''}));
    }
    if (text.length > 0) {
      const matches = customers.filter(c =>
        c.toLowerCase().includes(text.toLowerCase()),
      );
      setFiltered(matches);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelectName = name => {
    setSearch(name);
    setFormData({...formData, customerName: name});
    setShowDropdown(false);
  };

  const handleAddIfNotExist = async () => {
    if (search.trim().length === 0) return;

    if (!customers.includes(search)) {
      const newList = [...customers, search];
      await saveCustomers(newList);
    }
    setFormData({...formData, customerName: search});
    setShowDropdown(false);
  };
  // const handleSelect = customer => {
  //   updateFormData('customerName', customer.name);
  //   setModalVisible(false);
  // };
  // Mock team members for assignment
  const teamMembers = [
    {id: '1', name: 'Mike Wilson', role: 'Labor'},
    {id: '2', name: 'Lisa Rodriguez', role: 'Labor'},
    {id: '3', name: 'David Chen', role: 'Labor'},
    {id: '4', name: 'Tom Anderson', role: 'Labor'},
    {id: '5', name: 'James Mitchell', role: 'Labor'},
  ];

  const priorityOptions = [
    {
      value: 'low',
      label: 'Low Priority',
      color: '#10b981',
      icon: 'trending-down',
    },
    {
      value: 'medium',
      label: 'Medium Priority',
      color: '#f59e0b',
      icon: 'trending-flat',
    },
    {
      value: 'high',
      label: 'High Priority',
      color: '#ef4444',
      icon: 'trending-up',
    },
  ];

  const timeSlots = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
  ];
  const onChange = (event, selectedDate, type) => {
    if (type === 'scheduledDate') {
      setShowDatePicker(false);
      if (selectedDate) {
        updateFormData(
          'scheduledDate',
          selectedDate.toISOString().split('T')[0],
        );
      }
    } else if (type === 'scheduledTime') {
      setShowTimePicker(false);
      if (selectedDate) {
        let time = selectedDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        updateFormData('scheduledTime', time);
      }
    } else if (type === 'dueDate') {
      setShowDueDatePicker(false);
      if (selectedDate) {
        updateFormData('dueDate', selectedDate.toISOString().split('T')[0]);
      }
    }
  };
  // Google Places API integration (mock implementation)
  const searchPlaces = useCallback(async (query, type) => {
    if (!query || query.length < 3) return [];

    try {
      // Mock API response for demo
      const mockSuggestions = [
        {description: `${query} Street, Houston, TX`, place_id: 'mock1'},
        {description: `${query} Avenue, Houston, TX`, place_id: 'mock2'},
        {description: `${query} Boulevard, Houston, TX`, place_id: 'mock3'},
      ];

      if (type === 'city') {
        return [
          {description: `${query}, TX`, place_id: 'city1'},
          {description: `${query}, TX, USA`, place_id: 'city2'},
        ];
      } else {
        return mockSuggestions;
      }
    } catch (error) {
      console.warn('Places API not available, using fallback');
      return [];
    }
  }, []);

  // Debounced search effects
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (formData.customerAddress.length >= 3) {
        const suggestions = await searchPlaces(
          formData.customerAddress,
          'address',
        );
        setLocationSuggestions(suggestions);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [formData.customerAddress, searchPlaces]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (formData.city.length >= 3) {
        const suggestions = await searchPlaces(formData.city, 'city');
        setCitySuggestions(suggestions);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [formData.city, searchPlaces]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (formData.billingAddress.length >= 3 && !formData.sameAsCustomer) {
        const suggestions = await searchPlaces(
          formData.billingAddress,
          'address',
        );
        setBillingLocationSuggestions(suggestions);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [formData.billingAddress, formData.sameAsCustomer, searchPlaces]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (formData.billingCity.length >= 3 && !formData.sameAsCustomer) {
        const suggestions = await searchPlaces(formData.billingCity, 'city');
        setBillingCitySuggestions(suggestions);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [formData.billingCity, formData.sameAsCustomer, searchPlaces]);

  const updateFormData = (field, value) => {
    setFormData(prev => {
      const updated = {...prev, [field]: value};

      // Auto-sync billing address when "Same as Customer" is enabled
      if (field === 'sameAsCustomer' && value === true) {
        updated.billingName = prev.customerName;
        updated.billingPhone = prev.customerPhone;
        updated.billingEmail = prev.customerEmail;
        updated.billingAddress = prev.customerAddress;
        updated.billingCity = prev.city;
      }

      // Auto-sync when customer info changes and "Same as Customer" is enabled
      if (
        prev.sameAsCustomer &&
        (field === 'customerName' ||
          field === 'customerPhone' ||
          field === 'customerEmail' ||
          field === 'customerAddress' ||
          field === 'city')
      ) {
        switch (field) {
          case 'customerName':
            updated.billingName = value;
            break;
          case 'customerPhone':
            updated.billingPhone = value;
            break;
          case 'customerEmail':
            updated.billingEmail = value;
            break;
          case 'customerAddress':
            updated.billingAddress = value;
            break;
          case 'city':
            updated.billingCity = value;
            break;
        }
      }

      return updated;
    });

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({...prev, [field]: ''}));
    }
  };

  const validateStep = step => {
    const errors = {};

    switch (step) {
      case 1: // Job Details
        if (!formData.title.trim()) errors.title = 'Job title is required';
        if (!formData.description.trim())
          errors.description = 'Job description is required';
        if (!formData.customerName.trim())
          errors.customerName = 'Customer name is required';
        if (!formData.customerPhone.trim())
          errors.customerPhone = 'Customer phone is required';
        if (!formData.customerAddress.trim())
          errors.customerAddress = 'Customer address is required';
        if (!formData.city.trim()) errors.city = 'City is required';
        if (!formData.scheduledDate)
          errors.scheduledDate = 'Scheduled date is required';
        if (!formData.scheduledTime)
          errors.scheduledTime = 'Scheduled time is required';

        // Validate billing address if not same as customer
        if (!formData.sameAsCustomer) {
          if (!formData.billingName.trim())
            errors.billingName = 'Billing name is required';
          if (!formData.billingPhone.trim())
            errors.billingPhone = 'Billing phone is required';
          if (!formData.billingAddress.trim())
            errors.billingAddress = 'Billing address is required';
          if (!formData.billingCity.trim())
            errors.billingCity = 'Billing city is required';
        }

        // Validate phone format
        const phoneRegex =
          /^\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
        if (
          formData.customerPhone &&
          !phoneRegex.test(formData.customerPhone)
        ) {
          errors.customerPhone = 'Please enter a valid phone number';
        }
        if (
          !formData.sameAsCustomer &&
          formData.billingPhone &&
          !phoneRegex.test(formData.billingPhone)
        ) {
          errors.billingPhone = 'Please enter a valid phone number';
        }

        // Validate email format if provided
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (
          formData.customerEmail &&
          !emailRegex.test(formData.customerEmail)
        ) {
          errors.customerEmail = 'Please enter a valid email address';
        }
        if (
          !formData.sameAsCustomer &&
          formData.billingEmail &&
          !emailRegex.test(formData.billingEmail)
        ) {
          errors.billingEmail = 'Please enter a valid email address';
        }

        // Validate dates
        // const today = new Date().toISOString().split('T')[0];
        // if (formData.scheduledDate < today) {
        //   errors.scheduledDate = 'Scheduled date cannot be in the past';
        // }
        // if (formData.dueDate < formData.scheduledDate) {
        //   errors.dueDate = 'Due date must be after scheduled date';
        // }
        break;

      case 2: // Resources
        if (formData.assignedTo.length === 0)
          errors.assignedTo = 'At least one team member must be assigned';
        if (formData.estimatedHours <= 0)
          errors.estimatedHours = 'Estimated hours must be greater than 0';
        if (formData.estimatedHours > 100)
          errors.estimatedHours = 'Estimated hours seems too high (max 100)';
        break;

      case 3: // Review
        if (!formData.title.trim() || !formData.customerName.trim()) {
          errors.general = 'Please complete all required fields';
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    const firstErrorField = Object.keys(validationErrors)[0];
    if (firstErrorField && fieldPositions.current[firstErrorField]) {
      const handle = findNodeHandle(fieldPositions.current[firstErrorField]);
      if (handle) {
        UIManager.measureLayout(
          handle,
          findNodeHandle(scrollRef.current),
          () => {},
          (x, y) => {
            scrollRef.current.scrollTo({y: y - 50, animated: true});
          },
        );
      }
    }
  }, [validationErrors]);
  //  whenever validationErrors change, scroll to first error field
  // useEffect(() => {
  //   const firstErrorField = Object.keys(validationErrors)[0];
  //   if (firstErrorField && fieldPositions.current[firstErrorField] !== undefined) {
  //     scrollRef.current.scrollTo({
  //       y: fieldPositions.current[firstErrorField] - 20,
  //       animated: true,
  //     });
  //   }
  // }, [validationErrors]);

  const submitJob = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      const job = {
        id: `job-${Date.now()}`,
        jobId: `job-${Date.now()}`,
        title: formData.title.trim(),
        description: formData.description.trim(),
        customer: {
          name: formData.customerName.trim(),
          phone: formData.customerPhone.trim(),
          email: formData.customerEmail.trim(),
          address: formData.customerAddress.trim(),
        },
        billingAddress: formData.sameAsCustomer
          ? {
              name: formData.customerName.trim(),
              phone: formData.customerPhone.trim(),
              email: formData.customerEmail.trim(),
              address: formData.customerAddress.trim(),
              city: formData.city.trim(),
            }
          : {
              name: formData.billingName.trim(),
              phone: formData.billingPhone.trim(),
              email: formData.billingEmail.trim(),
              address: formData.billingAddress.trim(),
              city: formData.billingCity.trim(),
            },
        assignedTo: formData.assignedTo,
        status: 'pending',
        priority: formData.priority,
        estimatedHours: formData.estimatedHours,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
        startDate: formData.scheduledDate,
        dueDate: formData.dueDate,
        location: {
          address: formData.customerAddress.trim(),
          city: formData.city.trim(),
        },
        materials: [], // No materials section
        notes: formData.notes.trim(),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };

      await new Promise(resolve => setTimeout(resolve, 1500));
      // Simulate API call
      // onCreateJob(jobData);
      console.log('jobjob>>', job);

      Alert.alert('Success', 'Job created successfully!', [
        {text: 'OK', onPress: () => navigation.navigate('JobDetail', {job})},
      ]);
    } catch (error) {
      console.error('Failed to create job:', error);
      Alert.alert('Error', 'Failed to create job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressIndicator = () => (
    <View style={styles.progressContainer}>
      {[1, 2, 3].map(step => (
        <React.Fragment key={step}>
          <View
            style={[
              styles.progressStep,
              step === currentStep && styles.progressStepActive,
              step < currentStep && styles.progressStepCompleted,
            ]}>
            {step < currentStep ? (
              <Icon name="check" size={16} color="white" />
            ) : (
              <Text
                style={[
                  styles.progressStepText,
                  step === currentStep && styles.progressStepTextActive,
                ]}>
                {step}
              </Text>
            )}
          </View>
          {step < 3 && (
            <View
              style={[
                styles.progressLine,
                step < currentStep && styles.progressLineCompleted,
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  const renderStepTitle = () => {
    const titles = {1: 'Job Details', 2: 'Resources', 3: 'Review'};
    return (
      <View style={styles.stepTitleContainer}>
        <Text style={styles.stepTitle}>{titles[currentStep]}</Text>
        <Text style={styles.stepSubtitle}>Step {currentStep} of 3</Text>
      </View>
    );
  };

  const renderDropdown = (
    value,
    options,
    onSelect,
    isVisible,
    onToggle,
    placeholder,
    renderValue,
  ) => (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdownButton} onPress={onToggle}>
        <View style={styles.dropdownButtonContent}>
          {renderValue ? (
            renderValue(options.find(opt => opt.value === value))
          ) : (
            <Text style={styles.dropdownButtonText}>
              {options.find(opt => opt.value === value)?.label || placeholder}
            </Text>
          )}
        </View>
        <Icon
          name={isVisible ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color="#6b7280"
        />
      </TouchableOpacity>

      <Modal visible={isVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={onToggle}>
          <View style={styles.dropdownMenu}>
            {options.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.dropdownMenuItem,
                  value === option.value && styles.dropdownMenuItemSelected,
                ]}
                onPress={() => {
                  onSelect(option.value);
                  onToggle();
                }}>
                {/* {option.icon && option.color && (
                  <Icon name={option.icon} size={20} color={option.color} style={styles.dropdownMenuItemIcon} />
                )} */}
                <Text
                  style={[
                    styles.dropdownMenuItemText,
                    value === option.value &&
                      styles.dropdownMenuItemTextSelected,
                  ]}>
                  {option.label}
                </Text>
                {value === option.value && (
                  <Icon name="check" size={20} color="#3B82F6" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );

  const renderSuggestions = (suggestions, visible, onSelect) => {
    if (!visible || suggestions.length === 0) return null;

    return (
      <View style={styles.suggestionsContainer}>
        {suggestions?.map(suggestion => (
          <TouchableOpacity
            key={suggestion.place_id}
            style={styles.suggestionItem}
            onPress={() => onSelect(suggestion)}>
            <Icon
              name="place"
              size={16}
              color="#9ca3af"
              style={styles.suggestionIcon}
            />
            <Text style={styles.suggestionText}>{suggestion.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderJobDetailsStep = () => {
    return (
      <ScrollView
        ref={scrollRef}
        style={styles.stepContent}
        showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon name="work" size={24} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Basic Information</Text>
          </View>

          <View
            style={styles.formGroup}
            ref={ref => (fieldPositions.current['title'] = ref)}>
            <Text style={styles.formLabel}>Job Title *</Text>
            <View
              style={[
                styles.inputContainer,
                validationErrors.title && styles.inputContainerError,
              ]}>
              <TextInput
                style={styles.formInput}
                value={formData.title}
                onChangeText={text => updateFormData('title', text)}
                placeholder="Enter job title"
                placeholderTextColor="#9ca3af"
              />
            </View>
            {validationErrors.title && (
              <View style={styles.errorContainer}>
                <Icon name="error" size={16} color="#ef4444" />
                <Text style={styles.errorText}>{validationErrors.title}</Text>
              </View>
            )}
          </View>

          <View
            style={styles.formGroup}
            ref={ref => (fieldPositions.current['description'] = ref)}>
            <Text style={styles.formLabel}>Job Description *</Text>
            <View
              style={[
                styles.inputContainer,
                validationErrors.description && styles.inputContainerError,
              ]}>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={formData.description}
                onChangeText={text => updateFormData('description', text)}
                placeholder="Describe the work to be performed"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
            {validationErrors.description && (
              <View style={styles.errorContainer}>
                <Icon name="error" size={16} color="#ef4444" />
                <Text style={styles.errorText}>
                  {validationErrors.description}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Priority Level</Text>
            {renderDropdown(
              formData.priority,
              priorityOptions,
              value => updateFormData('priority', value),
              showPriorityDropdown,
              () => setShowPriorityDropdown(!showPriorityDropdown),
              'Select priority',
              option =>
                option && (
                  <View style={styles.priorityDisplayContainer}>
                    {/* <Icon name={option.icon} size={20} color={option.color} /> */}
                    <Text style={styles.dropdownButtonText}>
                      {option.label}
                    </Text>
                  </View>
                ),
            )}
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon name="person" size={24} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Customer Information</Text>
          </View>
          <View
            style={styles.formGroup}
            ref={ref => (fieldPositions.current['customerName'] = ref)}>
            <Text style={styles.formLabel}>Customer Name *</Text>

            <TextInput
              style={[
                styles.inputContainer,
                validationErrors.customerName && styles.inputContainerError,
              ]}
              placeholder="Enter Customer"
              value={search}
              onChangeText={handleChange}
              onBlur={handleAddIfNotExist} // ✅ jab field se bahar nikle to add
            />

            {/* Validation Error */}
            {validationErrors.customerName && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {validationErrors.customerName}
                </Text>
              </View>
            )}

            {showDropdown && filtered.length > 0 && (
              <View style={styles.dropdownWrapper}>
                <FlatList
                  data={filtered}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={styles.customerItem}
                      onPress={() => handleSelectName(item)}>
                      <Text style={styles.customerText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>

          <View
            style={styles.formGroup}
            ref={ref => (fieldPositions.current['customerPhone'] = ref)}>
            <Text style={styles.formLabel}>Phone Number *</Text>
            <View
              style={[
                styles.inputContainer,
                validationErrors.customerPhone && styles.inputContainerError,
              ]}>
              <Icon
                name="phone"
                size={20}
                color="#9ca3af"
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.formInput, styles.inputWithIcon]}
                value={formData.customerPhone}
                onChangeText={text => updateFormData('customerPhone', text)}
                placeholder="(555) 123-4567"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
              />
            </View>
            {validationErrors.customerPhone && (
              <View style={styles.errorContainer}>
                <Icon name="error" size={16} color="#ef4444" />
                <Text style={styles.errorText}>
                  {validationErrors.customerPhone}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Email Address</Text>
            <View
              style={[
                styles.inputContainer,
                validationErrors.customerEmail && styles.inputContainerError,
              ]}>
              <Icon
                name="email"
                size={20}
                color="#9ca3af"
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.formInput, styles.inputWithIcon]}
                value={formData.customerEmail}
                onChangeText={text => updateFormData('customerEmail', text)}
                placeholder="customer@email.com"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {validationErrors.customerEmail && (
              <View style={styles.errorContainer}>
                <Icon name="error" size={16} color="#ef4444" />
                <Text style={styles.errorText}>
                  {validationErrors.customerEmail}
                </Text>
              </View>
            )}
          </View>

          <View
            style={styles.formGroup}
            ref={ref => (fieldPositions.current['customerAddress'] = ref)}>
            <Text style={styles.formLabel}>Address *</Text>
            <View
              style={[
                styles.inputContainer,
                validationErrors.customerAddress && styles.inputContainerError,
              ]}>
              <Icon
                name="place"
                size={20}
                color="#9ca3af"
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.formInput, styles.inputWithIcon]}
                value={formData.customerAddress}
                onChangeText={text => {
                  updateFormData('customerAddress', text);
                  setShowLocationSuggestions(true);
                }}
                onFocus={() => setShowLocationSuggestions(true)}
                placeholder="Enter customer address"
                placeholderTextColor="#9ca3af"
              />
            </View>
            {renderSuggestions(
              locationSuggestions,
              showLocationSuggestions,
              suggestion => {
                updateFormData('customerAddress', suggestion.description);
                setShowLocationSuggestions(false);
              },
            )}
            {validationErrors.customerAddress && (
              <View style={styles.errorContainer}>
                <Icon name="error" size={16} color="#ef4444" />
                <Text style={styles.errorText}>
                  {validationErrors.customerAddress}
                </Text>
              </View>
            )}
          </View>

          <View
            style={styles.formGroup}
            ef={ref => (fieldPositions.current['city'] = ref)}>
            <Text style={styles.formLabel}>City *</Text>
            <View
              style={[
                styles.inputContainer,
                validationErrors.city && styles.inputContainerError,
              ]}>
              <Icon
                name="location-city"
                size={20}
                color="#9ca3af"
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.formInput, styles.inputWithIcon]}
                value={formData.city}
                onChangeText={text => {
                  updateFormData('city', text);
                  setShowCitySuggestions(true);
                }}
                onFocus={() => setShowCitySuggestions(true)}
                placeholder="Enter city"
                placeholderTextColor="#9ca3af"
              />
            </View>
            {renderSuggestions(
              citySuggestions,
              showCitySuggestions,
              suggestion => {
                updateFormData('city', suggestion.description);
                setShowCitySuggestions(false);
              },
            )}
            {validationErrors.city && (
              <View style={styles.errorContainer}>
                <Icon name="error" size={16} color="#ef4444" />
                <Text style={styles.errorText}>{validationErrors.city}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Billing Address */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderWithToggle}>
            <View style={styles.sectionHeaderLeft}>
              <Icon name="receipt" size={24} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Billing Address</Text>
            </View>
            <View style={styles.toggleContainer}>
              <Text style={[styles.toggleLabel, {fontSize: 12}]}>
                Same as Customer
              </Text>
              <Switch
                value={formData.sameAsCustomer}
                onValueChange={value => updateFormData('sameAsCustomer', value)}
                trackColor={{false: '#e5e7eb', true: '#3B82F6'}}
                thumbColor={formData.sameAsCustomer ? '#ffffff' : '#f4f3f4'}
                ios_backgroundColor="#e5e7eb"
              />
            </View>
          </View>

          {!formData.sameAsCustomer ? (
            <>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Billing Contact Name *</Text>
                <View
                  style={[
                    styles.inputContainer,
                    validationErrors.billingName && styles.inputContainerError,
                  ]}>
                  <TextInput
                    style={styles.formInput}
                    value={formData.billingName}
                    onChangeText={text => updateFormData('billingName', text)}
                    placeholder="Enter billing contact name"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                {validationErrors.billingName && (
                  <View style={styles.errorContainer}>
                    <Icon name="error" size={16} color="#ef4444" />
                    <Text style={styles.errorText}>
                      {validationErrors.billingName}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Billing Phone Number *</Text>
                <View
                  style={[
                    styles.inputContainer,
                    validationErrors.billingPhone && styles.inputContainerError,
                  ]}>
                  <Icon
                    name="phone"
                    size={20}
                    color="#9ca3af"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.formInput, styles.inputWithIcon]}
                    value={formData.billingPhone}
                    onChangeText={text => updateFormData('billingPhone', text)}
                    placeholder="(555) 123-4567"
                    placeholderTextColor="#9ca3af"
                    keyboardType="phone-pad"
                  />
                </View>
                {validationErrors.billingPhone && (
                  <View style={styles.errorContainer}>
                    <Icon name="error" size={16} color="#ef4444" />
                    <Text style={styles.errorText}>
                      {validationErrors.billingPhone}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Billing Email Address</Text>
                <View
                  style={[
                    styles.inputContainer,
                    validationErrors.billingEmail && styles.inputContainerError,
                  ]}>
                  <Icon
                    name="email"
                    size={20}
                    color="#9ca3af"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.formInput, styles.inputWithIcon]}
                    value={formData.billingEmail}
                    onChangeText={text => updateFormData('billingEmail', text)}
                    placeholder="billing@company.com"
                    placeholderTextColor="#9ca3af"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {validationErrors.billingEmail && (
                  <View style={styles.errorContainer}>
                    <Icon name="error" size={16} color="#ef4444" />
                    <Text style={styles.errorText}>
                      {validationErrors.billingEmail}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Billing Address *</Text>
                <View
                  style={[
                    styles.inputContainer,
                    validationErrors.billingAddress &&
                      styles.inputContainerError,
                  ]}>
                  <Icon
                    name="place"
                    size={20}
                    color="#9ca3af"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.formInput, styles.inputWithIcon]}
                    value={formData.billingAddress}
                    onChangeText={text => {
                      updateFormData('billingAddress', text);
                      setShowBillingLocationSuggestions(true);
                    }}
                    onFocus={() => setShowBillingLocationSuggestions(true)}
                    placeholder="Enter billing address"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                {renderSuggestions(
                  billingLocationSuggestions,
                  showBillingLocationSuggestions,
                  suggestion => {
                    updateFormData('billingAddress', suggestion.description);
                    setShowBillingLocationSuggestions(false);
                  },
                )}
                {validationErrors.billingAddress && (
                  <View style={styles.errorContainer}>
                    <Icon name="error" size={16} color="#ef4444" />
                    <Text style={styles.errorText}>
                      {validationErrors.billingAddress}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Billing City *</Text>
                <View
                  style={[
                    styles.inputContainer,
                    validationErrors.billingCity && styles.inputContainerError,
                  ]}>
                  <Icon
                    name="location-city"
                    size={20}
                    color="#9ca3af"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.formInput, styles.inputWithIcon]}
                    value={formData.billingCity}
                    onChangeText={text => {
                      updateFormData('billingCity', text);
                      setShowBillingCitySuggestions(true);
                    }}
                    onFocus={() => setShowBillingCitySuggestions(true)}
                    placeholder="Enter billing city"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                {renderSuggestions(
                  billingCitySuggestions,
                  showBillingCitySuggestions,
                  suggestion => {
                    updateFormData('billingCity', suggestion.description);
                    setShowBillingCitySuggestions(false);
                  },
                )}
                {validationErrors.billingCity && (
                  <View style={styles.errorContainer}>
                    <Icon name="error" size={16} color="#ef4444" />
                    <Text style={styles.errorText}>
                      {validationErrors.billingCity}
                    </Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <View style={styles.sameAsCustomerInfo}>
              <Icon name="check-circle" size={24} color="#10b981" />
              <Text style={styles.sameAsCustomerText}>
                Billing address will be the same as customer address
              </Text>
            </View>
          )}
        </View>

        {/* Scheduling */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon name="schedule" size={24} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Scheduling</Text>
          </View>

          {/* Scheduled Date */}
          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeItem}>
              <Text style={styles.formLabel}>Want to Schedule Date</Text>
              <TouchableOpacity
                style={[
                  styles.inputContainer,
                  validationErrors.scheduledDate && styles.inputContainerError,
                ]}
                onPress={() => {
                  setShowDatePicker(true),
                    setShowTimePicker(false),
                    setShowDueDatePicker(false);
                }}>
                <Icon
                  name="event"
                  size={20}
                  color="#9ca3af"
                  style={styles.inputIcon}
                />
                <Text style={[styles.formInput, styles.inputWithIcon]}>
                  {formData.scheduledDate || 'Select Date'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, date) =>
                    onChange(event, date, 'scheduledDate')
                  }
                />
              )}
            </View>
          </View>
          {/* Scheduled Time */}
          <View style={[styles.dateTimeItem, {marginVertical: 10}]}>
            <Text style={styles.formLabel}>Time</Text>
            <TouchableOpacity
              style={[
                styles.inputContainer,
                validationErrors.scheduledTime && styles.inputContainerError,
              ]}
              onPress={() => {
                setShowTimePicker(true),
                  setShowDatePicker(false),
                  setShowDueDatePicker(false);
              }}>
              <Icon
                name="access-time"
                size={20}
                color="#9ca3af"
                style={styles.inputIcon}
              />
              <Text style={[styles.formInput, styles.inputWithIcon]}>
                {formData.scheduledTime || 'Select Time'}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) =>
                  onChange(event, date, 'scheduledTime')
                }
              />
            )}
          </View>
          {/* Due Date */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Due Date</Text>
            <TouchableOpacity
              style={[
                styles.inputContainer,
                validationErrors.dueDate && styles.inputContainerError,
              ]}
              onPress={() => {
                setShowDueDatePicker(true),
                  setShowTimePicker(false),
                  setShowDatePicker(false);
              }}>
              <Icon
                name="event"
                size={20}
                color="#9ca3af"
                style={styles.inputIcon}
              />
              <Text style={[styles.formInput, styles.inputWithIcon]}>
                {formData.dueDate || 'Select Due Date'}
              </Text>
            </TouchableOpacity>
            {showDueDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) => onChange(event, date, 'dueDate')}
              />
            )}
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderResourcesStep = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      {/* Team Assignment */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Icon name="groups" size={24} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Team Assignment</Text>
        </View>

        <Text style={styles.formLabel}>Assigned Team Members *</Text>
        {/* <View style={styles.teamMembersList}>
          {teamMembers.map(member => (
            <TouchableOpacity
              key={member.id}
              style={styles.teamMemberItem}
              onPress={() => {
                const isSelected = formData.assignedTo.includes(member.id);
                if (isSelected) {
                  updateFormData(
                    'assignedTo',
                    formData.assignedTo.filter(id => id !== member.id),
                  );
                } else {
                  updateFormData('assignedTo', [
                    ...formData.assignedTo,
                    member.id,
                  ]);
                }
              }}>
              <View
                style={[
                  styles.checkbox,
                  formData.assignedTo.includes(member.id) &&
                    styles.checkboxChecked,
                ]}>
                {formData.assignedTo.includes(member.id) && (
                  <Icon name="check" size={16} color="white" />
                )}
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
              </View>
              {member.id === user?.id && (
                <View style={styles.youBadge}>
                  <Text style={styles.youBadgeText}>You</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View> */}
        <View style={styles.container}>
          {/* Dropdown Header */}

          <TouchableOpacity style={styles.dropdownItem}>
            <View
              style={[
                styles.checkboxChecked1,
                {
                  width: 20,
                  height: 20,
                  borderWidth: 1,
                  borderColor: '#aaa',
                  marginRight: 10,
                  borderRadius: 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              <Icon name="check" size={16} color="white" />
            </View>
            <View style={styles.memberInfo1}>
              <Text style={styles.memberName1}>{'Sarah Johnson'}</Text>
              <Text style={styles.memberRole1}>{'Lead Labour'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={toggleDropdown}>
            <Text style={styles.headerText}>
              {formData.assignedTo.length > 0
                ? formData.assignedTo.join(',')
                : 'Select Members'}
            </Text>
            <Icon
              name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={24}
            />
          </TouchableOpacity>

          {/* Dropdown List */}
          {isOpen && (
            <View style={styles.dropdownList}>
              <FlatList
                data={teamMembers}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => {
                  const isSelected = formData.assignedTo.includes(item.name);
                  return (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => handleSelect(item)}>
                      <View
                        style={[
                          styles.checkbox1,
                          isSelected && styles.checkboxChecked1,
                        ]}>
                        {isSelected && (
                          <Icon name="check" size={16} color="white" />
                        )}
                      </View>
                      <View style={styles.memberInfo1}>
                        <Text style={styles.memberName1}>{item.name}</Text>
                        <Text style={styles.memberRole1}>{item.role}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}
        </View>
        {validationErrors.assignedTo && (
          <View style={styles.errorContainer}>
            <Icon name="error" size={16} color="#ef4444" />
            <Text style={styles.errorText}>{validationErrors.assignedTo}</Text>
          </View>
        )}
      </View>

      {/* Time Estimation */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Icon name="timer" size={24} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Time Estimation</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Estimated Hours *</Text>
          <View
            style={[
              styles.inputContainer,
              validationErrors.estimatedHours && styles.inputContainerError,
            ]}>
            <Icon
              name="access-time"
              size={20}
              color="#9ca3af"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.formInput, styles.inputWithIcon]}
              value={formData.estimatedHours.toString()}
              onChangeText={text =>
                updateFormData('estimatedHours', parseFloat(text) || 0)
              }
              placeholder="8"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>
          {validationErrors.estimatedHours && (
            <View style={styles.errorContainer}>
              <Icon name="error" size={16} color="#ef4444" />
              <Text style={styles.errorText}>
                {validationErrors.estimatedHours}
              </Text>
            </View>
          )}
          <Text style={styles.helpText}>
            Estimated total hours for completion
          </Text>
        </View>
      </View>

      {/* Additional Notes */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Icon name="note" size={24} color="#3B82F6" />
          <Text style={styles.sectionTitle}>Additional Notes</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Special Instructions or Notes</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={formData.notes}
              onChangeText={text => updateFormData('notes', text)}
              placeholder="Any special instructions, safety requirements, or additional notes..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderReviewStep = () => {
    const assignedMembers = teamMembers?.filter(member =>
      formData.assignedTo.includes(member.name),
    );
    const billingInfo = formData.sameAsCustomer
      ? {
          name: formData.customerName,
          phone: formData.customerPhone,
          email: formData.customerEmail,
          address: formData.customerAddress,
          city: formData.city,
        }
      : {
          name: formData.billingName,
          phone: formData.billingPhone,
          email: formData.billingEmail,
          address: formData.billingAddress,
          city: formData.billingCity,
        };

    return (
      <ScrollView
        style={styles.stepContent}
        showsVerticalScrollIndicator={false}>
        {validationErrors.general && (
          <View style={styles.generalErrorContainer}>
            <Icon name="error" size={24} color="#ef4444" />
            <Text style={styles.generalErrorText}>
              {validationErrors.general}
            </Text>
          </View>
        )}

        {/* Job Summary */}
        <View style={styles.sectionCard}>
          <View style={styles.reviewSectionHeader}>
            <View style={styles.reviewSectionLeft}>
              <Icon name="check-circle" size={24} color="#10b981" />
              <Text style={styles.sectionTitle}>Job Summary</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setCurrentStep(1)}>
              <Icon name="edit" size={16} color="#6b7280" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.reviewContent}>
            <Text style={styles.reviewTitle}>{formData.title}</Text>
            <Text style={styles.reviewDescription}>{formData.description}</Text>

            <View style={styles.priorityBadge}>
              <Icon
                name={
                  priorityOptions.find(p => p.value === formData.priority)
                    ?.icon || 'trending-flat'
                }
                size={16}
                color={
                  priorityOptions.find(p => p.value === formData.priority)
                    ?.color || '#f59e0b'
                }
              />
              <Text style={styles.priorityBadgeText}>
                {formData.priority.charAt(0).toUpperCase() +
                  formData.priority.slice(1)}{' '}
                Priority
              </Text>
            </View>

            <View style={styles.reviewGrid}>
              <View style={styles.reviewSection}>
                <Text style={styles.reviewLabel}>Customer</Text>
                <Text style={styles.reviewValue}>{formData.customerName}</Text>
                <Text style={styles.reviewValue}>{formData.customerPhone}</Text>
                {formData.customerEmail && (
                  <Text style={styles.reviewValue}>
                    {formData.customerEmail}
                  </Text>
                )}
                <Text style={styles.reviewValue}>
                  {formData.customerAddress}
                </Text>
                <Text style={styles.reviewValue}>{formData.city}</Text>
              </View>

              <View style={styles.reviewSection}>
                <Text style={styles.reviewLabel}>Billing Address</Text>
                {formData.sameAsCustomer ? (
                  <Text style={styles.sameAddressText}>
                    Same as customer address
                  </Text>
                ) : (
                  <>
                    <Text style={styles.reviewValue}>{billingInfo.name}</Text>
                    <Text style={styles.reviewValue}>{billingInfo.phone}</Text>
                    {billingInfo.email && (
                      <Text style={styles.reviewValue}>
                        {billingInfo.email}
                      </Text>
                    )}
                    <Text style={styles.reviewValue}>
                      {billingInfo.address}
                    </Text>
                    <Text style={styles.reviewValue}>{billingInfo.city}</Text>
                  </>
                )}
              </View>
            </View>

            <View style={styles.dateTimeGrid}>
              <View style={styles.reviewSection}>
                <Text style={styles.reviewLabel}>Scheduled</Text>
                <Text style={styles.reviewValue}>
                  {new Date(formData.scheduledDate).toLocaleDateString(
                    'en-US',
                    {
                      month: 'numeric', // "August"
                      day: 'numeric',
                      year: 'numeric',
                    },
                  )}{' '}
                  at {formData.scheduledTime}
                </Text>
              </View>
              <View style={styles.reviewSection}>
                <Text style={styles.reviewLabel}>Due Date</Text>
                <Text style={styles.reviewValue}>
                  {new Date(formData.dueDate).toLocaleDateString('en-US', {
                    month: 'numeric', // "August"
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Resources Summary */}
        <View style={styles.sectionCard}>
          <View style={styles.reviewSectionHeader}>
            <View style={styles.reviewSectionLeft}>
              <Icon name="groups" size={24} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Resources</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setCurrentStep(2)}>
              <Icon name="edit" size={16} color="#6b7280" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.reviewContent}>
            <View style={styles.teamSummary}>
              <Text style={styles.reviewLabel}>
                Assigned Team ({assignedMembers.length})
              </Text>
              {assignedMembers.map(member => (
                <View key={member.id} style={styles.memberSummary}>
                  <Text style={styles.memberSummaryName}>{member.name}</Text>
                  <Text style={styles.memberSummaryRole}>{member.role}</Text>
                </View>
              ))}
            </View>

            <View style={styles.timeSummary}>
              <Text style={styles.reviewLabel}>Estimated Time</Text>
              <Text style={styles.reviewValue}>
                {formData.estimatedHours} hours
              </Text>
            </View>

            {formData.notes && (
              <View style={styles.notesSummary}>
                <Text style={styles.reviewLabel}>Additional Notes</Text>
                <Text style={styles.reviewValue}>{formData.notes}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#3B82F6" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Create New Job</Text>
          <Text style={styles.headerSubtitle}>JDP Electrics</Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>
      {/* <KeyboardAvoidingView
        style={{height: heightPercentageToDP(86), backgroundColor:"red"}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}> */}
      <View style={styles.content}>
        {renderProgressIndicator()}
        {renderStepTitle()}
        {currentStep === 1 && renderJobDetailsStep()}
        {currentStep === 2 && renderResourcesStep()}
        {currentStep === 3 && renderReviewStep()}

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.prevButton,
              currentStep === 1 && styles.disabledButton,
            ]}
            onPress={prevStep}
            disabled={currentStep === 1}>
            <Icon name="chevron-left" size={24} color="#6b7280" />
            <Text style={styles.prevButtonText}>Previous</Text>
          </TouchableOpacity>

          {currentStep < 3 ? (
            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={nextStep}>
              <Text style={styles.nextButtonText}>Next</Text>
              <Icon name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navButton, styles.submitButton]}
              onPress={submitJob}
              disabled={isSubmitting}>
              <Icon name="check" size={20} color="white" />
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Creating...' : 'Create Job'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#93c5fd',
    fontSize: 14,
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  progressStep: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  progressStepCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  progressStepText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  progressStepTextActive: {
    color: 'white',
  },
  progressLine: {
    width: 64,
    height: 2,
    backgroundColor: '#d1d5db',
    marginHorizontal: 8,
  },
  progressLineCompleted: {
    backgroundColor: '#10b981',
  },
  stepTitleContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 15,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  stepContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionHeaderWithToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    minHeight: 48,
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 20,
  },
  inputContainerError: {
    borderColor: '#ef4444',
  },
  formInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  inputWithIcon: {
    paddingLeft: 48,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 14,
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    marginLeft: 8,
    flex: 1,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    minHeight: 48,
  },
  dropdownButtonContent: {
    flex: 1,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#111827',
  },
  priorityDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 20,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    width: widthPercentageToDP(60),
  },
  dropdownMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownMenuItemSelected: {
    backgroundColor: '#eff6ff',
  },
  dropdownMenuItemIcon: {
    marginRight: 12,
  },
  dropdownMenuItemText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  dropdownMenuItemTextSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  suggestionsContainer: {
    position: 'relative',
    // top: 52,
    // left: 0,
    // right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 99999,
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  sameAsCustomerInfo: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sameAsCustomerText: {
    fontSize: 16,
    color: '#3B82F6',
    marginLeft: 12,
    flex: 1,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 16,
  },
  dateTimeItem: {
    flex: 1,
  },
  teamMembersList: {
    gap: 12,
  },
  teamMemberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#f9fafb',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 6,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  memberRole: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  youBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  youBadgeText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  helpText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  generalErrorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  generalErrorText: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  reviewSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  reviewSectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  editButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  reviewContent: {
    gap: 20,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  reviewDescription: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    gap: 6,
  },
  priorityBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  reviewGrid: {
    gap: 20,
  },
  reviewSection: {
    gap: 6,
  },
  reviewLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  reviewValue: {
    fontSize: 16,
    color: '#6b7280',
  },
  sameAddressText: {
    fontSize: 16,
    color: '#3B82F6',
    fontStyle: 'italic',
  },
  dateTimeGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  teamSummary: {
    gap: 12,
  },
  memberSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberSummaryName: {
    fontSize: 16,
    color: '#6b7280',
  },
  memberSummaryRole: {
    fontSize: 14,
    color: '#9ca3af',
  },
  timeSummary: {
    gap: 6,
  },
  notesSummary: {
    gap: 6,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  prevButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  nextButton: {
    backgroundColor: '#3B82F6',
  },
  submitButton: {
    backgroundColor: '#10b981',
  },
  disabledButton: {
    opacity: 0.5,
  },
  prevButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    maxHeight: '70%',
  },
  modalTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  customerItem: {padding: 12, borderBottomWidth: 1, borderColor: '#ddd'},
  customerText: {fontSize: 16},
  closeBtn: {marginTop: 10, alignSelf: 'flex-end'},
  closeBtnText: {color: '#ef4444', fontSize: 16},
  dropdownWrapper: {
    position: 'absolute',
    top: 70, // 👈 input height ke hisaab se adjust karo
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    maxHeight: 150,
    zIndex: 1000, // dropdown upar aaye
    elevation: 5, // android shadow
  },

  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
  },
  headerText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 5,
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  checkbox1: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#aaa',
    marginRight: 10,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked1: {
    backgroundColor: '#007AFF',
  },
  memberInfo1: {
    flexDirection: 'column',
  },
  memberName1: {
    fontSize1: 16,
    fontWeight: '600',
  },
  memberRole1: {
    fontSize: 14,
    color: '#555',
  },
});

export default CreateJobScreen;
