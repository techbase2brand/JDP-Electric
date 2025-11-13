// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   StyleSheet,
//   StatusBar,
//   TextInput,
//   Alert,
//   Linking,
// } from 'react-native';

// const SupportScreen = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');

//   const categories = ['All', 'Getting Started', 'Jobs', 'Reports', 'Billing', 'Technical'];

//   const faqItems = [
//     {
//       category: 'Getting Started',
//       question: 'How do I create my first job?',
//       answer: 'Navigate to the Create Job screen, fill in the required information including job title, client, and location, then tap Create Job.',
//     },
//     {
//       category: 'Jobs',
//       question: 'How do I assign a technician to a job?',
//       answer: 'When creating or editing a job, scroll to the Assignment section and select from the available technicians or choose Auto Assign.',
//     },
//     {
//       category: 'Jobs',
//       question: 'Can I change job priority after creation?',
//       answer: 'Yes, you can edit job details including priority by tapping on the job card and selecting Edit.',
//     },
//     {
//       category: 'Reports',
//       question: 'How do I export reports?',
//       answer: 'Go to the Reports screen, scroll to the Export Reports section, and choose either PDF or Excel format.',
//     },
//     {
//       category: 'Technical',
//       question: 'What if the app is running slowly?',
//       answer: 'Try closing and reopening the app. If issues persist, check your internet connection or contact support.',
//     },
//     {
//       category: 'Billing',
//       question: 'How do I generate invoices?',
//       answer: 'Use the Generate Invoice quick action from the dashboard or access it through the job details page.',
//     },
//   ];

//   const contactOptions = [
//     {
//       title: 'Live Chat',
//       description: 'Chat with our support team',
//       icon: '💬',
//       action: () => Alert.alert('Live Chat', 'Live chat feature will be available soon!'),
//     },
//     {
//       title: 'Email Support',
//       description: 'support@jobmanager.com',
//       icon: '📧',
//       action: () => Linking.openURL('mailto:support@jobmanager.com'),
//     },
//     {
//       title: 'Phone Support',
//       description: '1-800-JOB-HELP',
//       icon: '📞',
//       action: () => Linking.openURL('tel:+18005624357'),
//     },
//     {
//       title: 'Video Call',
//       description: 'Schedule a screen share',
//       icon: '📹',
//       action: () => Alert.alert('Video Call', 'Video support scheduling will be available soon!'),
//     },
//   ];

//   const quickLinks = [
//     {
//       title: 'User Guide',
//       description: 'Complete guide to using the app',
//       icon: '📚',
//     },
//     {
//       title: 'Video Tutorials',
//       description: 'Step-by-step video guides',
//       icon: '🎬',
//     },
//     {
//       title: 'API Documentation',
//       description: 'For developers and integrations',
//       icon: '🔧',
//     },
//     {
//       title: 'System Status',
//       description: 'Check current system status',
//       icon: '🟢',
//     },
//   ];

//   const getFilteredFAQs = () => {
//     let filtered = faqItems;

//     if (selectedCategory !== 'All') {
//       filtered = filtered.filter(item => item.category === selectedCategory);
//     }

//     if (searchQuery) {
//       filtered = filtered.filter(item =>
//         item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.answer.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     return filtered;
//   };

//   const renderCategoryButton = (category) => (
//     <TouchableOpacity
//       key={category}
//       style={[
//         styles.categoryButton,
//         selectedCategory === category && styles.activeCategoryButton,
//       ]}
//       onPress={() => setSelectedCategory(category)}
//     >
//       <Text style={[
//         styles.categoryText,
//         selectedCategory === category && styles.activeCategoryText,
//       ]}>
//         {category}
//       </Text>
//     </TouchableOpacity>
//   );

//   const renderFAQItem = (item, index) => (
//     <TouchableOpacity key={index} style={styles.faqItem}>
//       <View style={styles.faqHeader}>
//         <Text style={styles.faqQuestion}>{item.question}</Text>
//         <Text style={styles.faqIcon}>❓</Text>
//       </View>
//       <Text style={styles.faqAnswer}>{item.answer}</Text>
//       <View style={styles.faqCategory}>
//         <Text style={styles.faqCategoryText}>{item.category}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderContactOption = (option, index) => (
//     <TouchableOpacity key={index} style={styles.contactOption} onPress={option.action}>
//       <View style={styles.contactIcon}>
//         <Text style={styles.contactIconText}>{option.icon}</Text>
//       </View>
//       <View style={styles.contactContent}>
//         <Text style={styles.contactTitle}>{option.title}</Text>
//         <Text style={styles.contactDescription}>{option.description}</Text>
//       </View>
//       <Text style={styles.contactArrow}>→</Text>
//     </TouchableOpacity>
//   );

//   const renderQuickLink = (link, index) => (
//     <TouchableOpacity key={index} style={styles.quickLink}>
//       <Text style={styles.quickLinkIcon}>{link.icon}</Text>
//       <View style={styles.quickLinkContent}>
//         <Text style={styles.quickLinkTitle}>{link.title}</Text>
//         <Text style={styles.quickLinkDescription}>{link.description}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Support Center</Text>
//         <TouchableOpacity style={styles.emergencyButton}>
//           <Text style={styles.emergencyText}>🚨 Emergency</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {/* Search */}
//         <View style={styles.searchSection}>
//           <View style={styles.searchContainer}>
//             <Text style={styles.searchIcon}>🔍</Text>
//             <TextInput
//               style={styles.searchInput}
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//               placeholder="Search for help..."
//               placeholderTextColor="#9CA3AF"
//             />
//           </View>
//         </View>

//         {/* Contact Options */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>📞 Contact Support</Text>
//           <View style={styles.contactGrid}>
//             {contactOptions.map(renderContactOption)}
//           </View>
//         </View>

//         {/* FAQ Categories */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>❓ Frequently Asked Questions</Text>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             <View style={styles.categoryContainer}>
//               {categories.map(renderCategoryButton)}
//             </View>
//           </ScrollView>

//           {/* FAQ Items */}
//           <View style={styles.faqContainer}>
//             {getFilteredFAQs().map(renderFAQItem)}
//           </View>
//         </View>

//         {/* Quick Links */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>📚 Quick Links</Text>
//           <View style={styles.quickLinksGrid}>
//             {quickLinks.map(renderQuickLink)}
//           </View>
//         </View>

//         {/* System Information */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>ℹ️ System Information</Text>
//           <View style={styles.systemInfo}>
//             <View style={styles.systemInfoRow}>
//               <Text style={styles.systemInfoLabel}>App Version:</Text>
//               <Text style={styles.systemInfoValue}>1.2.3</Text>
//             </View>
//             <View style={styles.systemInfoRow}>
//               <Text style={styles.systemInfoLabel}>Last Updated:</Text>
//               <Text style={styles.systemInfoValue}>July 29, 2024</Text>
//             </View>
//             <View style={styles.systemInfoRow}>
//               <Text style={styles.systemInfoLabel}>System Status:</Text>
//               <Text style={[styles.systemInfoValue, { color: '#00A63E' }]}>🟢 All Systems Operational</Text>
//             </View>
//           </View>
//         </View>

//         {/* Feedback */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>💡 Send Feedback</Text>
//           <TouchableOpacity style={styles.feedbackButton}>
//             <Text style={styles.feedbackButtonText}>Share Your Thoughts</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8FAFC',
//   },
//   header: {
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#101828',
//   },
//   emergencyButton: {
//     backgroundColor: '#FEE2E2',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#FECACA',
//   },
//   emergencyText: {
//     fontSize: 12,
//     color: '#DC2626',
//     fontWeight: '500',
//   },
//   content: {
//     flex: 1,
//   },
//   searchSection: {
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   searchContainer: {
//     backgroundColor: '#F9FAFB',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   searchIcon: {
//     fontSize: 16,
//     marginRight: 12,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#111827',
//   },
//   section: {
//     backgroundColor: '#FFFFFF',
//     margin: 16,
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#101828',
//     marginBottom: 16,
//   },
//   contactGrid: {
//     gap: 12,
//   },
//   contactOption: {
//     backgroundColor: '#F8FAFC',
//     borderRadius: 8,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   contactIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#EFF6FF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   contactIconText: {
//     fontSize: 18,
//   },
//   contactContent: {
//     flex: 1,
//   },
//   contactTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#101828',
//     marginBottom: 2,
//   },
//   contactDescription: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   contactArrow: {
//     fontSize: 16,
//     color: '#9CA3AF',
//   },
//   categoryContainer: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 16,
//   },
//   categoryButton: {
//     backgroundColor: '#F3F4F6',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   activeCategoryButton: {
//     backgroundColor: '#155DFC',
//   },
//   categoryText: {
//     fontSize: 14,
//     color: '#6B7280',
//     fontWeight: '500',
//   },
//   activeCategoryText: {
//     color: '#FFFFFF',
//   },
//   faqContainer: {
//     gap: 12,
//   },
//   faqItem: {
//     backgroundColor: '#F8FAFC',
//     borderRadius: 8,
//     padding: 16,
//   },
//   faqHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 8,
//   },
//   faqQuestion: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#101828',
//     flex: 1,
//   },
//   faqIcon: {
//     fontSize: 16,
//     marginLeft: 8,
//   },
//   faqAnswer: {
//     fontSize: 14,
//     color: '#4B5563',
//     lineHeight: 20,
//     marginBottom: 8,
//   },
//   faqCategory: {
//     alignSelf: 'flex-start',
//   },
//   faqCategoryText: {
//     fontSize: 12,
//     color: '#6B7280',
//     backgroundColor: '#E5E7EB',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   quickLinksGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//   },
//   quickLink: {
//     width: '48%',
//     backgroundColor: '#F8FAFC',
//     borderRadius: 8,
//     padding: 16,
//     alignItems: 'center',
//   },
//   quickLinkIcon: {
//     fontSize: 24,
//     marginBottom: 8,
//   },
//   quickLinkContent: {
//     alignItems: 'center',
//   },
//   quickLinkTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#101828',
//     marginBottom: 4,
//     textAlign: 'center',
//   },
//   quickLinkDescription: {
//     fontSize: 12,
//     color: '#6B7280',
//     textAlign: 'center',
//   },
//   systemInfo: {
//     gap: 12,
//   },
//   systemInfoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   systemInfoLabel: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   systemInfoValue: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#101828',
//   },
//   feedbackButton: {
//     backgroundColor: '#155DFC',
//     paddingVertical: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   feedbackButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
// });

// export default SupportScreen;

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

// Embedded Colors and Constants
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
  warning: '#F59E0B',
  error: '#EF4444',
};

const Spacing = {xs: 4, sm: 8, md: 16, lg: 24, xl: 32};
const BorderRadius = {md: 8, lg: 12};
const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
};

const SupportScreen = () => {
  const navigation = useNavigation();
  const [expandedFAQ, setExpandedFAQ] = useState(null);
const openEmail = () => {
  const email = 'paul@jdpelectric.us';
  const subject = 'Support Request';
  const body = 'Hello, I need help with...';

  const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  Linking.canOpenURL(url)
    .then(supported => {
      if (!supported) {
        Alert.alert('Error', 'No email client installed');
      } else {
        return Linking.openURL(url);
      }
    })
    .catch(err => Alert.alert('Error', err.message));
};
  const supportOptions = [
    {
      id: '1',
      title: 'Call Support',
      description: 'Speak with a support representative',
      icon: 'phone',
      color: Colors.success,
        action: () => {
      Linking.openURL('tel:+1334444477').catch(err =>
        Alert.alert('Error', 'Unable to open dialer')
      );
    },
    },
    {
      id: '2',
      title: 'Email Support',
      description: 'Send an email to our support team',
      icon: 'email',
      color: Colors.warning,
      action: openEmail,
    },
    // {
    //   id: '3',
    //   title: 'User Guide',
    //   description: 'View the complete user manual',
    //   icon: 'book',
    //   color: Colors.error,
    //   action: () => Alert.alert('User Guide', 'Opening user guide...'),
    // },
  ];

  const faqs = [
    {
      id: '1',
      question: 'How do I start a timer for a job?',
      answer:
        'Navigate to the job details and tap the "Start Timer" button. The timer will automatically track your work time.',
    },
    {
      id: '2',
      question: 'Can I work offline?',
      answer:
        'Yes, the app works offline. Your data will sync when you reconnect to the internet.',
    },
    {
      id: '3',
      question: 'How do I order materials?',
      answer:
        'Go to the "Order Products" section, browse or search for materials, and add them to your cart.',
    },
    {
      id: '4',
      question: 'How do I report a problem with the app?',
      answer:
        'Use the "Report Issue" button in the profile section or contact support directly through this screen.',
    },
  ];

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color={Colors.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Support Center</Text>
      <View style={styles.placeholder} />
    </View>
  );

  const renderSupportOptions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Get Help</Text>
      <View style={styles.optionsGrid}>
        {supportOptions?.map(option => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionCard}
            onPress={option.action}>
            <View
              style={[
                styles.optionIcon,
                {backgroundColor: `${option.color}20`},
              ]}>
              <Icon name={option.icon} size={32} color={option.color} />
            </View>
            <Text style={styles.optionTitle}>{option.title}</Text>
            <Text style={styles.optionDescription}>{option.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderFAQ = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
      <View style={styles.faqList}>
        {faqs?.map(faq => (
          <TouchableOpacity
            key={faq.id}
            style={styles.faqItem}
            onPress={() =>
              setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
            }>
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Icon
                name={
                  expandedFAQ === faq.id
                    ? 'keyboard-arrow-up'
                    : 'keyboard-arrow-down'
                }
                size={24}
                color={Colors.textSecondary}
              />
            </View>
            {expandedFAQ === faq.id && (
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderEmergencyContact = () => (
    <View style={styles.emergencySection}>
      <View style={styles.emergencyHeader}>
        <Icon name="warning" size={24} color={Colors.error} />
        <Text style={styles.emergencyTitle}>Emergency Support</Text>
      </View>
      <Text style={styles.emergencyDescription}>
        For urgent technical issues or safety concerns, call our 24/7 emergency
        line:
      </Text>
      <TouchableOpacity
        style={styles.emergencyButton}
        onPress={() =>
          Alert.alert('Emergency', 'Calling emergency support...')
        }>
        <Icon name="phone" size={20} color={Colors.white} />
        <Text style={styles.emergencyButtonText}>(555) 911-HELP</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      {renderHeader()}

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}>
        {renderSupportOptions()}
        {renderFAQ()}
        {/* {renderEmergencyContact()} */}
      </ScrollView>
    </View>
  );
};

// Embedded Styles
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.backgroundLight, paddingBottom:0},
  header: {
    backgroundColor: Colors.white,
    paddingTop: Spacing.lg,
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
  headerTitle: {fontSize: 20, fontWeight: 'bold', color: Colors.text},
  placeholder: {width: 40},
  scrollContainer: {flex: 1},
  scrollContent: {paddingBottom: Spacing.xl},
  section: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  optionsGrid: {flexDirection: 'row', justifyContent:"space-between", gap: 2},
  optionCard: {
    width: '50%',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
  },
  optionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  faqList: {gap: Spacing.sm},
  faqItem: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {flex: 1, fontSize: 16, fontWeight: '500', color: Colors.text},
  faqAnswer: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  emergencySection: {
    backgroundColor: Colors.errorLight,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.error,
    marginLeft: Spacing.sm,
  },
  emergencyDescription: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  emergencyButtonText: {fontSize: 16, fontWeight: '600', color: Colors.white},
});

export default SupportScreen;
