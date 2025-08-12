import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  StyleSheet,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

// Embedded Colors
const Colors = {
  primary: '#3B82F6',
  primaryLight: '#EBF4FF',
  white: '#FFFFFF',
  backgroundLight: '#F8FAFC',
  text: '#1E293B',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  border: '#E2E8F0',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
};

// Embedded Spacing and Dimensions
const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const BorderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
};

const Shadows = {
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
};

// Embedded Toast Functions
const showToast = (title, message) => {
  Alert.alert(title, message);
};

const CreateJobScreen = ({onCreateJob, route}) => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    jobType: '',
    title: '',
    customer: '',
    description: '',
    priority: '',
    address: '',
    city: '',
    zipCode: '',
    locationPhone: '',
    locationEmail: '',
    copyToBilling: false,
    billingAddress: '',
    billingCity: '',
    billingZipCode: '',
    billingPhone: '',
    billingEmail: '',
    dueDate: '',
    estimatedHours: '',
    estimatedCost: '',
    estimate: '',
    contractor: '',
    leadLabor: [],
    labor: [],
    materials: [],
  });
  console.log('formDataformData', formData);

  // Mock data for dropdowns
  const contractors = [
    {id: 'contractor1', name: 'Elite Electrical Services'},
    {id: 'contractor2', name: 'Texas Power Solutions'},
    {id: 'contractor3', name: 'Professional Electric Co.'},
  ];

  const leadLaborOptions = [
    {id: 'lead1', name: 'Sarah Johnson'},
    {id: 'lead2', name: 'Mike Rodriguez'},
    {id: 'lead3', name: 'Tom Wilson'},
  ];

  const laborOptions = [
    {id: 'labor1', name: 'Alex Smith'},
    {id: 'labor2', name: 'Jordan Brown'},
    {id: 'labor3', name: 'Casey Davis'},
    {id: 'labor4', name: 'Riley Garcia'},
  ];

  const availableMaterials = [
    {id: 'mat1', name: 'Electrical Panel', unit: 'unit'},
    {id: 'mat2', name: 'Circuit Breaker', unit: 'unit'},
    {id: 'mat3', name: 'Wire Nuts', unit: 'box'},
    {id: 'mat4', name: 'THHN Wire', unit: 'ft'},
    {id: 'mat5', name: 'Conduit', unit: 'ft'},
    {id: 'mat6', name: 'Junction Box', unit: 'unit'},
  ];

  const steps = [
    {id: 1, title: 'Job Type', description: 'Select job type'},
    {id: 2, title: 'Job Details', description: 'Enter job information'},
    {id: 3, title: 'Resources', description: 'Scheduling & team'},
    // {id: 4, title: 'Materials', description: 'Required materials'},
    {id: 4, title: 'Review', description: 'Review & create'},
  ];

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  }, []);

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      updateFormData('dueDate', selectedDate.toISOString());
    }
  };
  const handleCopyToBilling = checked => {
    updateFormData('copyToBilling', checked);
    if (checked) {
      updateFormData('billingAddress', formData.address);
      updateFormData('billingCity', formData.city);
      updateFormData('billingZipCode', formData.zipCode);
      updateFormData('billingPhone', formData.locationPhone);
      updateFormData('billingEmail', formData.locationEmail);
    }
  };

  const addMaterial = materialId => {
    const material = availableMaterials.find(m => m.id === materialId);
    if (material) {
      const newMaterial = {
        id: `${material.id}-${Date.now()}`,
        name: material.name,
        quantity: 1,
        unit: material.unit,
      };
      updateFormData('materials', [...formData.materials, newMaterial]);
    }
  };

  const updateMaterialQuantity = (materialId, quantity) => {
    const updatedMaterials = formData.materials.map(m =>
      m.id === materialId ? {...m, quantity} : m,
    );
    updateFormData('materials', updatedMaterials);
  };

  const removeMaterial = materialId => {
    const updatedMaterials = formData.materials.filter(
      m => m.id !== materialId,
    );
    updateFormData('materials', updatedMaterials);
  };

  const toggleLabor = (personId, type) => {
    const currentList = formData[type];
    if (currentList.includes(personId)) {
      updateFormData(
        type,
        currentList.filter(id => id !== personId),
      );
    } else {
      updateFormData(type, [...currentList, personId]);
    }
  };

  const validateStep = step => {
    switch (step) {
      case 1:
        if (!formData.jobType) {
          showToast('Validation Error', 'Please select a job type', 'error');
          return false;
        }
        break;
      case 2:
        if (!formData.title.trim()) {
          showToast('Validation Error', 'Please enter a job title', 'error');
          return false;
        }
        if (!formData.customer.trim()) {
          showToast('Validation Error', 'Please enter customer name', 'error');
          return false;
        }
        if (!formData.description.trim()) {
          showToast(
            'Validation Error',
            'Please enter job description',
            'error',
          );
          return false;
        }
        if (!formData.priority) {
          showToast(
            'Validation Error',
            'Please select priority level',
            'error',
          );
          return false;
        }
        if (!formData.address.trim()) {
          showToast('Validation Error', 'Please enter job address', 'error');
          return false;
        }
        break;
      case 3:
        if (!formData.dueDate) {
          showToast('Validation Error', 'Please select a due date', 'error');
          return false;
        }
        if (!formData.estimatedHours.trim()) {
          showToast(
            'Validation Error',
            'Please enter estimated hours',
            'error',
          );
          return false;
        }
        if (formData.leadLabor.length === 0) {
          showToast(
            'Validation Error',
            'Please assign at least one Lead Labor',
            'error',
          );
          return false;
        }
        break;
      case 4:
        // Materials are optional, so no validation needed
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    // Transform form data to match expected Job structure
    const jobData = {
      id: `job-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      customer: {
        name: formData.customer,
        address: formData.address,
        phone: formData.locationPhone,
        email: formData.locationEmail,
      },
      assignedTo: [...formData.leadLabor, ...formData.labor],
      status: 'pending',
      priority: formData.priority,
      estimatedHours: parseInt(formData.estimatedHours) || 0,
      scheduledDate: formData.dueDate,
      scheduledTime: '09:00 AM',
      startDate: formData.dueDate,
      dueDate: formData.dueDate,
      location: {
        address: formData.address,
        coordinates: undefined,
      },
      materials: formData.materials.map(m => ({
        name: m.name,
        quantity: m.quantity,
        unit: m.unit,
      })),
      notes: `Job Type: ${formData.jobType}\n${formData.description}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      jobType: formData.jobType,
      contractor: formData.contractor,
      estimatedCost: formData.estimatedCost,
      estimate: formData.estimate,
      billingInfo: formData.copyToBilling
        ? null
        : {
            address: formData.billingAddress,
            city: formData.billingCity,
            zipCode: formData.billingZipCode,
            phone: formData.billingPhone,
            email: formData.billingEmail,
          },
    };

    if (onCreateJob) {
      onCreateJob(jobData);
    }

    showToast('Success', 'Job created successfully!');
    navigation.goBack();
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressTrack}>
        <View
          style={[styles.progressFill, {width: `${(currentStep / 5) * 100}%`}]}
        />
      </View>
    </View>
  );

  const renderStepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      {steps.map(step => (
        <View key={step.id} style={styles.stepIndicator}>
          <View
            style={[
              styles.stepCircle,
              currentStep >= step.id
                ? styles.activeStepCircle
                : styles.inactiveStepCircle,
            ]}>
            {currentStep > step.id ? (
              <Icon name="check" size={16} color={Colors.white} />
            ) : (
              <Text
                style={[
                  styles.stepNumber,
                  currentStep >= step.id
                    ? styles.activeStepNumber
                    : styles.inactiveStepNumber,
                ]}>
                {step.id}
              </Text>
            )}
          </View>
          <Text style={[styles.stepTitle, {fontSize: 14}]}>{step.title}</Text>
          <Text style={styles.stepDescription}>{step.description}</Text>
        </View>
      ))}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={currentStep === 1 ? () => navigation.goBack() : handlePrev}>
        <Icon name="arrow-back" size={24} color={Colors.text} />
      </TouchableOpacity>

      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Create New Job</Text>
        <Text style={styles.headerSubtitle}>Step {currentStep} of 4</Text>
      </View>

      <View style={styles.headerSpacer} />
    </View>
  );

  const renderJobTypeCard = (type, title, description, iconName, iconColor) => (
    <TouchableOpacity
      style={[
        styles.jobTypeCard,
        formData.jobType === type && styles.selectedJobTypeCard,
      ]}
      onPress={() => updateFormData('jobType', type)}>
      <View style={styles.jobTypeCardContent}>
        <View style={[styles.jobTypeIcon, {backgroundColor: `${iconColor}20`}]}>
          <Icon name={iconName} size={32} color={iconColor} />
        </View>

        <View style={styles.jobTypeTextContent}>
          <Text style={styles.jobTypeTitle}>{title}</Text>
          <Text style={styles.jobTypeDescription}>{description}</Text>
        </View>

        <View
          style={[
            styles.radioButton,
            formData.jobType === type && styles.selectedRadioButton,
          ]}>
          {formData.jobType === type && (
            <Icon name="check" size={16} color={Colors.white} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Select Job Type</Text>
        <Text style={styles.stepSubtitle}>
          Choose the type of job you want to create
        </Text>
      </View>

      <View style={styles.jobTypeContainer}>
        {renderJobTypeCard(
          'service-based',
          'Service-Based Job',
          'For one-time service jobs with specific deliverables and a defined timeline (e.g., installations, repairs, maintenance).',
          'build',
          Colors.primary,
        )}

        {renderJobTypeCard(
          'contract-based',
          'Contract-Based Job',
          'For ongoing or long-term jobs involving external contractors or outsourcing with extended timelines and multiple phases.',
          'group',
          Colors.success,
        )}
      </View>
    </View>
  );

  // const renderInputField = (
  //   label,
  //   value,
  //   onChangeText,
  //   placeholder,
  //   multiline = false,
  //   keyboardType = 'default',
  //   onOpenDatePicker,
  // ) => (
  //   <View style={styles.inputGroup}>
  //     <Text style={styles.inputLabel}>{label}</Text>
  //     <TextInput
  //       style={[styles.textInput, multiline && styles.textArea]}
  //       value={value}
  //       onChangeText={onChangeText}
  //       placeholder={placeholder}
  //       placeholderTextColor={Colors.textSecondary}
  //       multiline={multiline}
  //       numberOfLines={multiline ? 4 : 1}
  //       textAlignVertical={multiline ? 'top' : 'center'}
  //       keyboardType={keyboardType}
  //     />
  //   </View>
  // );
  const renderInputField = (
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    keyboardType = 'default',
    isDateField = false,
    onOpenDatePicker = () => {},
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>

      {isDateField ? (
        <Pressable onPress={onOpenDatePicker} style={styles.textInput}>
          <Text style={{color: value ? '#000' : '#aaa'}}>
            {value ? moment(value).format('YYYY-MM-DD') : placeholder}
          </Text>
        </Pressable>
      ) : (
        <TextInput
          style={[styles.textInput, multiline && styles.textArea]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={'#aaa'}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          textAlignVertical={multiline ? 'top' : 'center'}
          keyboardType={keyboardType}
        />
      )}
    </View>
  );

  const renderPrioritySelector = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Priority *</Text>
      <View style={styles.priorityContainer}>
        {['high', 'medium', 'low'].map(priority => (
          <TouchableOpacity
            key={priority}
            style={[
              styles.priorityOption,
              formData.priority === priority && styles.selectedPriorityOption,
            ]}
            onPress={() => updateFormData('priority', priority)}>
            <Text
              style={[
                styles.priorityText,
                formData.priority === priority && styles.selectedPriorityText,
              ]}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <ScrollView
      style={styles.stepContainer}
      showsVerticalScrollIndicator={false}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Job Details</Text>
        <Text style={styles.stepSubtitle}>
          Enter the basic information about this job
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Icon name="work" size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Job Information</Text>
        </View>

        {renderInputField(
          'Job Title *',
          formData.title,
          text => updateFormData('title', text),
          'Enter the name/title of the job',
        )}
        {renderInputField(
          formData.jobType === 'service-based' ? 'Customer *' : 'Contractor *',
          formData.customer,
          text => updateFormData('customer', text),
          "Enter the client's or company's name",
        )}
        {renderInputField(
          'Description *',
          formData.description,
          text => updateFormData('description', text),
          'Add details about job scope and requirements',
          true,
        )}
        {renderPrioritySelector()}
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Icon name="place" size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Location Information</Text>
        </View>

        {renderInputField(
          'Address *',
          formData.address,
          text => updateFormData('address', text),
          'Job location details',
        )}

        <View style={styles.rowContainer}>
          <View style={styles.halfWidth}>
            {renderInputField(
              'City',
              formData.city,
              text => updateFormData('city', text),
              'City',
            )}
          </View>
          <View style={styles.halfWidth}>
            {renderInputField(
              'ZIP Code',
              formData.zipCode,
              text => updateFormData('zipCode', text),
              'Postal code',
            )}
          </View>
        </View>

        {renderInputField(
          'Phone',
          formData.locationPhone,
          text => updateFormData('locationPhone', text),
          'Contact phone number',
          false,
          'phone-pad',
        )}
        {renderInputField(
          'Email',
          formData.locationEmail,
          text => updateFormData('locationEmail', text),
          'Contact email address',
          false,
          'email-address',
        )}
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Icon name="attach-money" size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Bill To Information</Text>
        </View>

        <View style={styles.checkboxContainer}>
          <Switch
            value={formData.copyToBilling}
            onValueChange={handleCopyToBilling}
            trackColor={{false: Colors.border, true: Colors.primary}}
            thumbColor={Colors.white}
          />
          <Text style={styles.checkboxLabel}>Same as job address</Text>
        </View>

        {!formData.copyToBilling && (
          <View style={styles.billingSection}>
            {renderInputField(
              'Billing Address',
              formData.billingAddress,
              text => updateFormData('billingAddress', text),
              'Billing address',
            )}

            <View style={styles.rowContainer}>
              <View style={styles.halfWidth}>
                {renderInputField(
                  'City',
                  formData.billingCity,
                  text => updateFormData('billingCity', text),
                  'City',
                )}
              </View>
              <View style={styles.halfWidth}>
                {renderInputField(
                  'ZIP Code',
                  formData.billingZipCode,
                  text => updateFormData('billingZipCode', text),
                  'Postal code',
                )}
              </View>
            </View>

            {renderInputField(
              'Phone',
              formData.billingPhone,
              text => updateFormData('billingPhone', text),
              'Billing contact phone',
              false,
              'phone-pad',
            )}
            {renderInputField(
              'Email',
              formData.billingEmail,
              text => updateFormData('billingEmail', text),
              'Billing contact email',
              false,
              'email-address',
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView
      style={styles.stepContainer}
      showsVerticalScrollIndicator={false}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Resources & Scheduling</Text>
        <Text style={styles.stepSubtitle}>
          Set timeline, estimates, and assign team members
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Icon name="schedule" size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Scheduling & Estimates</Text>
        </View>
        {renderInputField(
          'Due Date *',
          formData.dueDate,
          text => updateFormData('dueDate', text),
          'YYYY-MM-DD',
          false,
          'default',
          true, // isDateField = true
          () => setShowDatePicker(true),
        )}

        {showDatePicker && (
          <DateTimePicker
            value={formData.dueDate ? new Date(formData.dueDate) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeDate}
          />
        )}
        {/* {renderInputField('Due Date *', formData.dueDate, (text) => updateFormData('dueDate', text), 'YYYY-MM-DD')} */}
        {renderInputField(
          'Estimated Hours *',
          formData.estimatedHours,
          text => updateFormData('estimatedHours', text),
          'Hours required',
          false,
          'numeric',
        )}
        {/* {renderInputField(
          'Cost ($)',
          formData.estimatedCost,
          text => updateFormData('estimatedCost', text),
          'Internal cost estimate',
          false,
          'numeric',
        )} */}
        {renderInputField(
          'Estimate ($)',
          formData.estimate,
          text => updateFormData('estimate', text),
          'Customer estimate',
          false,
          'numeric',
        )}

        {/* {formData.jobType === 'contract-based' && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contractor (Optional)</Text>
            <View style={styles.dropdownContainer}>
              {contractors.map(contractor => (
                <TouchableOpacity
                  key={contractor.id}
                  style={[
                    styles.dropdownOption,
                    formData.contractor === contractor.id &&
                      styles.selectedDropdownOption,
                  ]}
                  onPress={() => updateFormData('contractor', contractor.id)}>
                  <Text
                    style={[
                      styles.dropdownOptionText,
                      formData.contractor === contractor.id &&
                        styles.selectedDropdownOptionText,
                    ]}>
                    {contractor.name}
                  </Text>
                  {formData.contractor === contractor.id && (
                    <Icon name="check" size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )} */}
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Icon name="group" size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Assign Labor</Text>
        </View>

        <View style={styles.laborSection}>
          <Text style={styles.laborSectionTitle}>Lead Labor *</Text>
          <Text style={styles.laborSectionSubtitle}>
            Main responsible persons
          </Text>

          {leadLaborOptions.map(person => (
            <TouchableOpacity
              key={person.id}
              style={styles.laborOption}
              onPress={() => toggleLabor(person.id, 'leadLabor')}>
              <View
                style={[
                  styles.checkbox,
                  formData.leadLabor.includes(person.id) &&
                    styles.selectedCheckbox,
                ]}>
                {formData.leadLabor.includes(person.id) && (
                  <Icon name="check" size={16} color={Colors.white} />
                )}
              </View>
              <Text style={styles.laborOptionText}>{person.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.laborSection}>
          <Text style={styles.laborSectionTitle}>Labor</Text>
          <Text style={styles.laborSectionSubtitle}>
            Supporting team members
          </Text>

          {laborOptions.map(person => (
            <TouchableOpacity
              key={person.id}
              style={styles.laborOption}
              onPress={() => toggleLabor(person.id, 'labor')}>
              <View
                style={[
                  styles.checkbox,
                  formData.labor.includes(person.id) && styles.selectedCheckbox,
                ]}>
                {formData.labor.includes(person.id) && (
                  <Icon name="check" size={16} color={Colors.white} />
                )}
              </View>
              <Text style={styles.laborOptionText}>{person.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  // const renderStep4 = () => (
  //   <ScrollView
  //     style={styles.stepContainer}
  //     showsVerticalScrollIndicator={false}>
  //     <View style={styles.stepHeader}>
  //       <Text style={styles.stepTitle}>Materials</Text>
  //       <Text style={styles.stepSubtitle}>
  //         Add materials required for this job
  //       </Text>
  //     </View>

  //     <View style={styles.sectionCard}>
  //       <View style={styles.sectionHeader}>
  //         <Icon name="build" size={20} color={Colors.primary} />
  //         <Text style={styles.sectionTitle}>Required Materials</Text>
  //       </View>

  //       <View style={styles.inputGroup}>
  //         <Text style={styles.inputLabel}>Add Material</Text>
  //         <View style={styles.materialsDropdown}>
  //           {availableMaterials.map(material => (
  //             <TouchableOpacity
  //               key={material.id}
  //               style={styles.materialOption}
  //               onPress={() => addMaterial(material.id)}>
  //               <Text style={styles.materialOptionText}>{material.name}</Text>
  //               <Icon name="add" size={20} color={Colors.primary} />
  //             </TouchableOpacity>
  //           ))}
  //         </View>
  //       </View>

  //       {formData.materials.length > 0 && (
  //         <View style={styles.selectedMaterials}>
  //           <Text style={styles.selectedMaterialsTitle}>
  //             Selected Materials
  //           </Text>
  //           {formData.materials.map(material => (
  //             <View key={material.id} style={styles.materialItem}>
  //               <View style={styles.materialInfo}>
  //                 <Text style={styles.materialName}>{material.name}</Text>
  //               </View>

  //               <View style={styles.quantityContainer}>
  //                 <TextInput
  //                   style={styles.quantityInput}
  //                   value={material.quantity.toString()}
  //                   onChangeText={text =>
  //                     updateMaterialQuantity(material.id, parseInt(text) || 1)
  //                   }
  //                   keyboardType="numeric"
  //                 />
  //                 <Text style={styles.unitText}>{material.unit}</Text>
  //               </View>

  //               <TouchableOpacity
  //                 style={styles.removeButton}
  //                 onPress={() => removeMaterial(material.id)}>
  //                 <Icon name="close" size={20} color={Colors.error} />
  //               </TouchableOpacity>
  //             </View>
  //           ))}
  //         </View>
  //       )}

  //       {formData.materials.length === 0 && (
  //         <View style={styles.emptyMaterials}>
  //           <Icon name="build" size={48} color={Colors.textLight} />
  //           <Text style={styles.emptyMaterialsTitle}>
  //             No materials added yet
  //           </Text>
  //           <Text style={styles.emptyMaterialsSubtitle}>
  //             Select materials from the list above
  //           </Text>
  //         </View>
  //       )}
  //     </View>
  //   </ScrollView>
  // );

  const renderReviewItem = (label, value) => (
    <View style={styles.reviewItem}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={styles.reviewValue}>{value}</Text>
    </View>
  );

  const getPriorityBadgeStyle = priority => {
    switch (priority) {
      case 'high':
        return {backgroundColor: Colors.error, color: Colors.white};
      case 'medium':
        return {backgroundColor: Colors.warning, color: Colors.white};
      case 'low':
        return {backgroundColor: Colors.success, color: Colors.white};
      default:
        return {backgroundColor: Colors.textSecondary, color: Colors.white};
    }
  };

  const renderStep4 = () => (
    <ScrollView
      style={styles.stepContainer}
      showsVerticalScrollIndicator={false}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Review & Create Job</Text>
        <Text style={styles.stepSubtitle}>
          Review all details before creating the job
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Icon name="work" size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Job Summary</Text>
        </View>

        {renderReviewItem(
          'Job Type',
          formData.jobType
            .replace('-', ' ')
            .replace(/\b\w/g, l => l.toUpperCase()),
        )}
        {renderReviewItem('Title', formData.title)}
        {renderReviewItem('Customer', formData.customer)}
        {formData.contractor &&
          renderReviewItem(
            'Contractor',
            contractors.find(c => c.id === formData.contractor)?.name || '',
          )}

        <View style={styles.reviewRow}>
          <View style={styles.reviewColumn}>
            <Text style={styles.reviewLabel}>Priority</Text>
            <View
              style={[
                styles.priorityBadge,
                getPriorityBadgeStyle(formData.priority),
              ]}>
              <Text
                style={[
                  styles.priorityBadgeText,
                  {color: getPriorityBadgeStyle(formData.priority).color},
                ]}>
                {formData.priority.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.reviewColumn}>
            {renderReviewItem(
              'Due Date',
              new Date(formData.dueDate).toLocaleDateString(),
            )}
          </View>
          <View style={styles.reviewColumn}>
            {renderReviewItem('Est. Hours', `${formData.estimatedHours}h`)}
          </View>
        </View>

        {(formData.estimatedCost || formData.estimate) && (
          <View style={styles.reviewRow}>
            {formData.estimatedCost && (
              <View style={styles.reviewColumn}>
                {renderReviewItem('Cost', `$${formData.estimatedCost}`)}
              </View>
            )}
            {formData.estimate && (
              <View style={styles.reviewColumn}>
                {renderReviewItem('Estimate', `$${formData.estimate}`)}
              </View>
            )}
          </View>
        )}

        <View style={styles.descriptionSection}>
          <Text style={styles.reviewLabel}>Description</Text>
          <Text style={styles.descriptionText}>{formData.description}</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Icon name="place" size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Address & Contact</Text>
        </View>

        <Text style={styles.reviewLabel}>Job Location</Text>
        <Text style={styles.addressText}>{formData.address}</Text>
        {(formData.city || formData.zipCode) && (
          <Text style={styles.addressText}>
            {formData.city}
            {formData.city && formData.zipCode ? ', ' : ''}
            {formData.zipCode}
          </Text>
        )}

        {(formData.locationPhone || formData.locationEmail) && (
          <View style={styles.contactInfo}>
            {formData.locationPhone && (
              <View style={styles.contactItem}>
                <Icon name="phone" size={16} color={Colors.textSecondary} />
                <Text style={styles.contactText}>{formData.locationPhone}</Text>
              </View>
            )}
            {formData.locationEmail && (
              <View style={styles.contactItem}>
                <Icon name="email" size={16} color={Colors.textSecondary} />
                <Text style={styles.contactText}>{formData.locationEmail}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Icon name="group" size={20} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Assigned Team</Text>
        </View>

        {formData.leadLabor.length > 0 && (
          <View style={styles.teamSection}>
            <Text style={styles.reviewLabel}>Lead Labor</Text>
            <View style={styles.teamBadges}>
              {formData.leadLabor.map(id => (
                <View
                  key={id}
                  style={[styles.teamBadge, {backgroundColor: Colors.primary}]}>
                  <Text style={styles.teamBadgeText}>
                    {leadLaborOptions.find(p => p.id === id)?.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {formData.labor.length > 0 && (
          <View style={styles.teamSection}>
            <Text style={styles.reviewLabel}>Labor</Text>
            <View style={styles.teamBadges}>
              {formData.labor.map(id => (
                <View
                  key={id}
                  style={[
                    styles.teamBadge,
                    {backgroundColor: Colors.textSecondary},
                  ]}>
                  <Text style={styles.teamBadgeText}>
                    {laborOptions.find(p => p.id === id)?.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {formData.materials.length > 0 && (
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon name="build" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Materials</Text>
          </View>

          {formData.materials.map(material => (
            <View key={material.id} style={styles.reviewMaterialItem}>
              <Text style={styles.materialReviewName}>{material.name}</Text>
              <Text style={styles.materialReviewQuantity}>
                {material.quantity} {material.unit}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <View style={styles.footerContent}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.prevButton} onPress={handlePrev}>
            <Text style={styles.prevButtonText}>Previous</Text>
          </TouchableOpacity>
        )}

        {currentStep < 4 ? (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
            <Icon name="arrow-forward" size={20} color={Colors.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.createButton} onPress={handleSubmit}>
            <Icon name="check" size={20} color={Colors.white} />
            <Text style={styles.createButtonText}>Create Job</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      {renderHeader()}
      {renderProgressBar()}
      {renderStepIndicator()}

      <View style={styles.content}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {/* {currentStep === 4 && renderStep4()} */}
        {currentStep === 4 && renderStep4()}
      </View>

      {renderFooter()}
    </KeyboardAvoidingView>
  );
};

// Embedded Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    marginBottom: 20,
  },

  // Header
  header: {
    backgroundColor: Colors.white,
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  headerSpacer: {
    width: 40,
  },

  // Progress Bar
  progressContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },

  // Step Indicator
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  stepIndicator: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  activeStepCircle: {
    backgroundColor: Colors.primary,
  },
  inactiveStepCircle: {
    backgroundColor: Colors.border,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeStepNumber: {
    color: Colors.white,
  },
  inactiveStepNumber: {
    color: Colors.textSecondary,
  },
  // stepTitle: {
  //   fontSize: 12,
  //   fontWeight: '600',
  //   color: Colors.text,
  //   textAlign: 'center',
  // },
  stepDescription: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },

  // Content
  content: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Job Type Cards
  jobTypeContainer: {
    gap: Spacing.md,
  },
  jobTypeCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  selectedJobTypeCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  jobTypeCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  jobTypeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobTypeTextContent: {
    flex: 1,
  },
  jobTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  jobTypeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  // Section Cards
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },

  // Input Fields
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: Spacing.md,
  },

  // Row Layout
  rowContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfWidth: {
    flex: 1,
  },

  // Priority Selector
  priorityContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  selectedPriorityOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  selectedPriorityText: {
    color: Colors.white,
  },

  // Checkbox
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  checkboxLabel: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },

  // Billing Section
  billingSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },

  // Dropdown
  dropdownContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.white,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedDropdownOption: {
    backgroundColor: Colors.primaryLight,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: Colors.text,
  },
  selectedDropdownOptionText: {
    color: Colors.primary,
    fontWeight: '500',
  },

  // Labor Section
  laborSection: {
    marginBottom: Spacing.lg,
  },
  laborSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  laborSectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  laborOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckbox: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  laborOptionText: {
    fontSize: 16,
    color: Colors.text,
  },

  // Materials
  materialsDropdown: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.white,
    marginBottom: Spacing.md,
  },
  materialOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  materialOptionText: {
    fontSize: 16,
    color: Colors.text,
  },
  selectedMaterials: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  selectedMaterialsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  materialInfo: {
    flex: 1,
  },
  materialName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  quantityInput: {
    width: 60,
    height: 32,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    textAlign: 'center',
    fontSize: 14,
    color: Colors.text,
  },
  unitText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  removeButton: {
    padding: Spacing.sm,
  },
  emptyMaterials: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyMaterialsTitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  emptyMaterialsSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },

  // Review
  reviewItem: {
    marginBottom: Spacing.md,
  },
  reviewLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  reviewValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  reviewRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginVertical: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  reviewColumn: {
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
  priorityBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  descriptionSection: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  descriptionText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginTop: Spacing.xs,
  },
  addressText: {
    fontSize: 16,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  contactInfo: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  contactText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  teamSection: {
    marginBottom: Spacing.md,
  },
  teamBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  teamBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  teamBadgeText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '500',
  },
  reviewMaterialItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  materialReviewName: {
    fontSize: 16,
    color: Colors.text,
  },
  materialReviewQuantity: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  // Footer
  footer: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  footerContent: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  prevButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  prevButtonText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  nextButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
  },
  createButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  createButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
  },
});

export default CreateJobScreen;
