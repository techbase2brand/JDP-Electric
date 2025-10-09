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
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {heightPercentageToDP, widthPercentageToDP} from '../utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {
  createCustomer,
  createJob,
  getAllLabor,
  getContractors,
  getCustomers,
} from '../config/apiConfig';

const {width: screenWidth} = Dimensions.get('window');

const customers = [
  {id: '1', name: 'John Smith'},
  {id: '2', name: 'Emily Johnson'},
  {id: '3', name: 'Michael Brown'},
  {id: '4', name: 'Olivia Davis'},
  {id: '5', name: 'William Miller'},
];

const CreateJobScreen = ({navigation, onCreateJob}) => {
  const scrollRef = useRef(null);
  const fieldPositions = useRef({});
  const isFetchingMoreRef = useRef(false);

  const token = useSelector(state => state.user.token);
  const user = useSelector(state => state.user.user);

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

  // const handleSelect = member => {
  //   const isSelected = formData.assignedTo.includes(member?.users?.full_name);

  //   if (isSelected) {
  //     updateFormData(
  //       'assignedTo',
  //       formData.assignedTo.filter(name => name !== member?.users?.full_name),
  //     );
  //   } else {
  //     updateFormData('assignedTo', [
  //       ...formData.assignedTo,
  //       member?.users?.full_name,
  //     ]);
  //   }
  // };
  const handleSelect = member => {
    const laborId = member?.id; // <- API se aata id use karein
    const isSelected = formData.assignedTo.includes(laborId);

    if (isSelected) {
      updateFormData(
        'assignedTo',
        formData.assignedTo.filter(id => id !== laborId),
      );
    } else {
      updateFormData('assignedTo', [...formData.assignedTo, laborId]);
    }
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customerName: '',
    // contractorName: '',
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
    estimatedCost: '',
    notes: '',
  });
  console.log('form data :::', formData);

  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState([]); // API se data
  const [filtered, setFiltered] = useState([]); // According Search
  const [contractorsFiltered, setContractorsFiltered] = useState([]); // According Search
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showContractorDropdown, setShowContractorDropdown] = useState(false);
  const [labors, setLabors] = useState([]);
  const [laborPage, setLaborPage] = useState(1);
  const [laborHasMore, setLaborHasMore] = useState(true);
  const [laborLoading, setLaborLoading] = useState(false);
  const [contractors, setContractors] = useState([]);
  const [contractorFiltered, setContractorFiltered] = useState([]);
  const [contractorSearch, setContractorSearch] = useState('');
  const [contractorPage, setContractorPage] = useState(1);
  const [contractorHasMore, setContractorHasMore] = useState(true);
  const [selected, setSelected] = useState('customer'); // ✅ Customer default
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedContractorId, setSelectedContractorId] = useState(null);
  console.log('selectedselected>>', selected);

  //  Load from AsyncStorage on mount
  // useEffect(() => {
  //   loadCustomers();
  // }, []);

  // const loadCustomers = async () => {
  //   try {
  //     const data = await AsyncStorage.getItem('customers');
  //     if (data) {
  //       setCustomers(JSON.parse(data));
  //     }
  //   } catch (e) {
  //     console.log('Error loading customers:', e);
  //   }
  // };

  // const saveCustomers = async newList => {
  //   try {
  //     await AsyncStorage.setItem('customers', JSON.stringify(newList));
  //     setCustomers(newList);
  //   } catch (e) {
  //     console.log('Error saving customers:', e);
  //   }
  // };

  // const handleChange = text => {
  //   setSearch(text);
  //   setFormData({...formData, customerName: text});
  //   if (validationErrors.customerName) {
  //     setValidationErrors(prev => ({...prev, customerName: ''}));
  //   }
  //   if (text.length > 0) {
  //     const matches = customers.filter(c =>
  //       c.toLowerCase().includes(text.toLowerCase()),
  //     );
  //     setFiltered(matches);
  //     setShowDropdown(true);
  //   } else {
  //     setShowDropdown(false);
  //   }
  // };

  // const handleSelectName = name => {
  //   setSearch(name);
  //   setFormData({...formData, customerName: name});
  //   setShowDropdown(false);
  // };
  useEffect(() => {
    fetchCustomers();
    // fetchContractors();
  }, []);
  // ✅ Customers
  const fetchCustomers = async (pageNo = 1) => {
    // page 1 ko kabhi block mat karo; baaki pages ke liye guards
    const limit = 10;
    if (!token) return;
    if (pageNo > 1 && (loading || isFetchingMoreRef.current || !hasMore))
      return;

    try {
      isFetchingMoreRef.current = true;
      setLoading(true);

      const res = await getCustomers(pageNo, limit, token);
      console.log('customer::', res);

      const newItems = res?.data?.customers || [];
      const pg = res?.data?.pagination; // { page, limit, total, totalPages }

      // ---- build next list (append on page>1) ----
      let nextList;
      if (pageNo === 1) {
        nextList = newItems;
      } else {
        // ensure unique by id to avoid duplicates when API repeats boundary items
        const prevById = new Map(customers.map(c => [c.id, c]));
        newItems.forEach(item => prevById.set(item.id, item));
        nextList = Array.from(prevById.values());
      }

      // ---- commit state ----
      setCustomers(nextList);

      // search-based filtered update (same function you use to filter on type)
      const q = (search || '').trim().toLowerCase();
      if (q) {
        setFiltered(
          nextList.filter(c =>
            (c?.customer_name || '').toLowerCase().includes(q),
          ),
        );
      } else {
        setFiltered(nextList);
      }

      // ---- hasMore logic ----
      if (pg?.totalPages && pg?.page) {
        setHasMore(pg.page < pg.totalPages);
      } else {
        setHasMore(newItems.length === limit); // fallback
      }

      setPage(pageNo);
    } catch (err) {
      console.log('Error fetching customers:', err);
      // 500 aaya to loop band kar do
      setHasMore(false);
    } finally {
      setLoading(false);
      isFetchingMoreRef.current = false;
    }
  };

  // const fetchCustomers = async (pageNo = 1) => {
  //   if (!token) return;
  //   try {
  //     setLoading(true);
  //     const res = await getCustomers(pageNo, 10, token);
  //     console.log('Customers', res);

  //     if (pageNo === 1) {
  //       setCustomers(res?.data?.customers);
  //       setFiltered(res?.data?.customers);
  //     } else {
  //       setCustomers(prev => [...prev, ...res?.data?.customers]);
  //     }
  //     setHasMore(res?.data?.customers?.length > 0);
  //     setLoading(false);
  //   } catch (err) {
  //     setLoading(false);
  //     console.error(err);
  //   }
  // };

  // ✅ Search text change
  const handleChange = text => {
    setSearch(text);
    setFormData({...formData, customerName: text});

    if (validationErrors.customerName) {
      setValidationErrors(prev => ({...prev, customerName: ''}));
    }

    if (text.length > 0) {
      const matches = customers.filter(
        c => c?.customer_name?.toLowerCase()?.includes(text?.toLowerCase()), // 👈 frontend filter
      );
      setFiltered(matches);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  // ✅ Select customer
  // replace your handleSelectName
  const handleSelectName = name => {
    setSearch(name);
    const chosen = customers.find(c => c?.customer_name === name);
    setSelectedCustomerId(chosen?.id || null);
    setFormData(prev => ({...prev, customerName: name}));
    setShowDropdown(false);
  };

  // const handleSelectName = name => {
  //   setSearch(name);
  //   setFormData({...formData, customerName: name});
  //   setShowDropdown(false);
  // };
  //  Contractors
  const fetchContractors = async (pageNo = 1) => {
    if (!token || loading || !contractorHasMore) return;
    try {
      setLoading(true);
      const res = await getContractors(pageNo, 10, token);
      console.log('Contractors:', res.data.contractors);
      console.log('pageno', pageNo);

      if (pageNo === 1) {
        setContractors(res?.data?.contractors || []);
        // setContractorFiltered(res?.data?.contractors || []);
      } else {
        setContractors(prev => [...prev, ...res?.data?.contractors]);
      }

      setContractorHasMore(res?.data?.contractors?.length > 0);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setContractorHasMore(false);
      console.error(err);
    }
  };

  // ✅ Select Contractors
  const handleContractorChange = text => {
    setContractorSearch(text);
    setFormData({...formData, contractorName: text});

    if (validationErrors.contractorName) {
      setValidationErrors(prev => ({...prev, contractorName: ''}));
    }

    if (text.length > 0) {
      const matches = contractors.filter(c =>
        c?.contractor_name?.toLowerCase()?.includes(text?.toLowerCase()),
      );
      setContractorFiltered(matches);
      setShowContractorDropdown(true);
    } else {
      setShowContractorDropdown(false);
    }
  };
  const handleSelectContractor = name => {
    setContractorSearch(name);
    setFormData({...formData, contractorName: name});
    setShowContractorDropdown(false);
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

  // ✅ Initial load
  useEffect(() => {
    fetchLabors(1);
  }, []);
  // ✅ Fetch labors
  const fetchLabors = async (pageNo = 1) => {
    if (!token) return;
    try {
      setLaborLoading(true);
      const res = await getAllLabor(pageNo, 10, token);
      console.log('labpur::', res);

      if (pageNo === 1) {
        setLabors(res?.data?.data);
      } else {
        setLabors(prev => [...prev, ...res?.data?.data]);
      }

      setLaborHasMore(res?.data?.data?.length > 0);
      setLaborLoading(false);
    } catch (err) {
      setLaborLoading(false);
      console.error(err);
    }
  };

  // ✅ Select labor
  // const handleSelectLabor = name => {
  //   setSelectedLabor(name);
  //   setFormData({...formData, laborName: name});
  //   setShowLaborDropdown(false);
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
        // if (!formData.city.trim()) errors.city = 'City is required';
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

  const nextStep = async () => {
    if (validateStep(currentStep)) {
      try {
        if (currentStep === 1) {
          await handleAddCustomer(); // ✅ API call
        }
      } catch (err) {
        console.log('❌ handleAddCustomer error:', err);
        // yaha chaho to user ko alert bhi dikha sakte ho
      } finally {
        // ✅ Step change hamesha hoga
        setCurrentStep(prev => Math.min(prev + 1, 3));
      }
    }
  };

  console.log('nextStepnextStep', currentStep);

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
  const handleAddCustomer = async () => {
    try {
      // 1. Check if customer exists in current list
      const existing = customers.find(
        c =>
          c.customer_name?.toLowerCase() ===
          formData.customerName?.trim().toLowerCase(),
      );

      if (existing) {
        console.log('✅ Customer already exists:', existing);
        // agar customer mil gaya to directly state update kar do (id bhi rakh lo)
        setSelectedCustomerId(existing.id);
        return existing;
      }

      // 2. Agar exist nahi karta to create karo
      const payload = {
        customer_name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone,
        address: formData.customerAddress,
      };
      console.log('Creating new customer payload::', payload);

      const res = await createCustomer(payload, token);
      console.log('✅ Customer Created:', res);

      // naya add hone ke baad list refresh karo
      fetchCustomers(1);

      return res;
    } catch (err) {
      console.log('❌ Error in handleAddCustomer:', err);
    }
  };

  const buildJobPayload = () => {
    // lead labor IDs: agar current user lead hai to use include karo
    const leadIds =
      user?.management_type === 'lead_labor' ? [user?.leadLabor?.[0]?.id] : [];

    // API example me arrays stringified hain — backend ke hisaab se rakh rahe:
    const assigned_lead_labor_ids = JSON.stringify(leadIds);
    const assigned_labor_ids = JSON.stringify(formData.assignedTo || []);
    const assigned_material_ids = JSON.stringify([]); // UI me material select nahi tha

    // bill-to fields
    const billTo = formData.sameAsCustomer
      ? {
          bill_to_address: formData.customerAddress?.trim(),
          bill_to_city_zip: formData.city?.trim(),
          bill_to_phone: formData.customerPhone?.trim(),
          bill_to_email: formData.customerEmail?.trim(),
        }
      : {
          bill_to_address: formData.billingAddress?.trim(),
          bill_to_city_zip: formData.billingCity?.trim(),
          bill_to_phone: formData.billingPhone?.trim(),
          bill_to_email: formData.billingEmail?.trim(),
        };

    return {
      job_title: formData.title?.trim(),
      job_type: 'service_based', // as per your example
      customer_id: selectedCustomerId, // <- required
      // contractor_id: selectedContractorId, // <- optional if needed
      description: formData.description?.trim(),
      priority: formData.priority,
      address: formData.customerAddress?.trim(),
      city_zip: formData.city?.trim(), // aapke form me zip nahi hai, city pass kar rahe
      phone: formData.customerPhone?.trim(),
      email: formData.customerEmail?.trim(),
      ...billTo,
      same_as_address: !!formData.sameAsCustomer,
      due_date: formData.dueDate, // "YYYY-MM-DD"
      estimated_hours: Number(formData.estimatedHours) || 0,
      estimated_cost: Number(formData.estimatedCost) || 0, // UI me field nahi; chahe to 0 rakho ya add a field
      assigned_lead_labor_ids,
      assigned_labor_ids,
      assigned_material_ids,
      status: 'active',
    };
  };

  const submitJob = async () => {
    if (!validateStep(3)) return;
    if (!token) {
      Alert.alert('Auth required', 'Please login again.');
      return;
    }
    if (!selectedCustomerId) {
      Alert.alert(
        'Missing customer',
        'Please select a customer from the list.',
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = buildJobPayload();
      console.log('CreateJob payload =>', payload);
      const res = await createJob(payload, token);
      console.log('resres', res);

      // success UI
      Alert.alert('Success', 'Job created successfully!', [
        {text: 'OK', onPress: () => navigation.navigate('JobStack')},
      ]);
    } catch (err) {
      const msg = err?.message || 'Failed to create job. Please try again.';
      Alert.alert(
        'Error',
        typeof msg === 'string' ? msg : 'Something went wrong',
      );
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
          {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              margin: 10,
            }}>
            {renderOption('Customer', 'customer')}
            {renderOption('Contractor', 'contractor')}
          </View> */}
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
            <Text style={styles.sectionTitle}>
              {selected == 'customer' ? 'Customer' : 'Contractor'} Information
            </Text>
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
              // onBlur={handleAddIfNotExist}
              onFocus={() => {
                setPage(1);
                setHasMore(true);
                setFiltered(customers);
                setShowDropdown(true);
              }}
            />
            {/* <TouchableOpacity
                style={[
                  styles.inputContainer,
                  validationErrors.customerName && styles.inputContainerError,
                  {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  },
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  setFiltered(customers); // ✅ All customers dikhao
                  setShowDropdown(!showDropdown); // ✅ Toggle dropdown
                }}>
                <Text style={{color: search ? '#000' : '#999'}}>
                  {search || 'Select Customer'}
                </Text>

                <Icon
                  name={
                    showDropdown ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
                  }
                  size={24}
                />
              </TouchableOpacity> */}

            {/* Validation Error */}
            {validationErrors.customerName && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {validationErrors.customerName}
                </Text>
              </View>
            )}

            {/* {showDropdown && filtered.length > 0 && (
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
            )} */}
            {showDropdown && filtered.length > 0 && (
              <View style={styles.dropdownWrapper}>
                <FlatList
                  data={filtered}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={styles.customerItem}
                      onPress={() => handleSelectName(item.customer_name)}>
                      <Text style={styles.customerText}>
                        {item.customer_name}
                      </Text>
                    </TouchableOpacity>
                  )}
                  onEndReached={() => {
                    if (hasMore && !loading && !isFetchingMoreRef.current) {
                      const nextPage = page + 1;
                      setPage(nextPage);
                      fetchCustomers(nextPage);
                    }
                  }}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={
                    loading ? (
                      <ActivityIndicator size="small" color="gray" />
                    ) : null
                  }
                />
              </View>
            )}
          </View>

          {/* Contactor  Information */}
          {/* {selected == 'contractor' && (
            <View
              style={styles.formGroup}
              ref={ref => (fieldPositions.current['contractorName'] = ref)}>
              <Text style={styles.formLabel}>Contractor Name *</Text>

              <TextInput
              style={[
                styles.inputContainer,
                validationErrors.contractorName && styles.inputContainerError,
              ]}
              placeholder="Enter Contractor"
              value={contractorSearch}
              onChangeText={handleContractorChange}
              onFocus={() => {
                setContractorFiltered(contractors); // ✅ All contractors dikhao
                setShowContractorDropdown(true);
              }}
            />
              <TouchableOpacity
                style={[
                  styles.inputContainer,
                  validationErrors.contractorName && styles.inputContainerError,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  },
                ]}
                onPress={() => {
                  setContractorFiltered(contractors);
                  setShowContractorDropdown(prev => !prev); // toggle dropdown
                }}>
                <Text style={{color: contractorSearch ? '#000' : '#999'}}>
                  {contractorSearch || 'Select Contractor'}
                </Text>
                <Icon
                  name={
                    showContractorDropdown
                      ? 'keyboard-arrow-up'
                      : 'keyboard-arrow-down'
                  }
                  size={24}
                />
              </TouchableOpacity>

              {validationErrors.contractorName && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    {validationErrors.contractorName}
                  </Text>
                </View>
              )}

              {showContractorDropdown && contractorFiltered?.length > 0 && (
                <View style={styles.dropdownWrapper}>
                  <FlatList
                    data={contractorFiltered}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        style={styles.customerItem}
                        onPress={() =>
                          handleSelectContractor(item.contractor_name)
                        }>
                        <Text style={styles.customerText}>
                          {item.contractor_name}
                        </Text>
                      </TouchableOpacity>
                    )}
                    onEndReached={() => {
                      if (contractorHasMore && !loading) {
                        const nextPage = contractorPage + 1;
                        setContractorPage(nextPage);
                        fetchContractors(nextPage);
                      }
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                      loading ? (
                        <ActivityIndicator size="small" color="gray" />
                      ) : null
                    }
                  />
                </View>
              )}
            </View>
          )} */}

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
            <Text style={styles.formLabel}>City </Text>
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
            {/* {validationErrors.city && (
              <View style={styles.errorContainer}>
                <Icon name="error" size={16} color="#ef4444" />
                <Text style={styles.errorText}>{validationErrors.city}</Text>
              </View>
            )} */}
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
          {/* <View style={styles.dateTimeRow}>
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
          </View> */}
          {/* Scheduled Time */}
          {/* <View style={[styles.dateTimeItem, {marginVertical: 10}]}>
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
          </View> */}
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
              <Text style={styles.memberName1}>{user?.full_name}</Text>
              <Text style={styles.memberRole1}>
                {user?.management_type == 'lead_labor' && 'Lead Labor'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={toggleDropdown}>
            <Text style={styles.headerText}>
              {formData.assignedTo.length > 0
                ? labors
                    .filter(labor => formData.assignedTo.includes(labor.id)) // sirf selected IDs
                    .map(labor => labor.users?.full_name) // names nikalo
                    .join(', ') // string me dikhao
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
                data={labors}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => {
                  const isSelected = formData.assignedTo.includes(item?.id);
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
                        <Text style={styles.memberName1}>
                          {item?.users?.full_name}
                        </Text>
                        <Text style={styles.memberRole1}>
                          {item?.users?.role}
                        </Text>
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
    // const assignedMembers = labors?.filter(member =>
    //   formData.assignedTo.includes(member.users?.full_name),
    // );
    const assignedMembers = labors?.filter(m =>
      formData.assignedTo.includes(m.id),
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
                  <Text style={styles.memberSummaryName}>
                    {member?.users?.full_name}
                  </Text>
                  <Text style={styles.memberSummaryRole}>
                    {member?.users?.role}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.timeSummary}>
              <Text style={styles.reviewLabel}>Estimated Time</Text>
              <Text style={styles.reviewValue}>
                {formData.estimatedHours} hours
              </Text>
            </View>
            {/* <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Estimated Cost</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.formInput}
                  value={(formData.estimatedCost ?? '').toString()}
                  onChangeText={t =>
                    updateFormData('estimatedCost', parseFloat(t) || 0)
                  }
                  placeholder="1500"
                  keyboardType="numeric"
                />
              </View>
            </View> */}

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

  // const renderOption = (label, value) => (
  //   <TouchableOpacity
  //     style={styles.optionRow}
  //     onPress={() => setSelected(value)}>
  //     <MaterialCommunityIcons
  //       name={selected === value ? 'checkbox-marked' : 'checkbox-blank-outline'}
  //       size={24}
  //       color={selected === value ? '#007AFF' : '#888'}
  //     />
  //     <Text style={styles.label}>{label}</Text>
  //   </TouchableOpacity>
  // );
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
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  label: {
    fontSize: 16,
    marginLeft: 6,
  },
});

export default CreateJobScreen;
