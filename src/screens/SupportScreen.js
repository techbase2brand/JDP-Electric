import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TextInput,
  Alert,
  Linking,
} from 'react-native';

const SupportScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Getting Started', 'Jobs', 'Reports', 'Billing', 'Technical'];

  const faqItems = [
    {
      category: 'Getting Started',
      question: 'How do I create my first job?',
      answer: 'Navigate to the Create Job screen, fill in the required information including job title, client, and location, then tap Create Job.',
    },
    {
      category: 'Jobs',
      question: 'How do I assign a technician to a job?',
      answer: 'When creating or editing a job, scroll to the Assignment section and select from the available technicians or choose Auto Assign.',
    },
    {
      category: 'Jobs',
      question: 'Can I change job priority after creation?',
      answer: 'Yes, you can edit job details including priority by tapping on the job card and selecting Edit.',
    },
    {
      category: 'Reports',
      question: 'How do I export reports?',
      answer: 'Go to the Reports screen, scroll to the Export Reports section, and choose either PDF or Excel format.',
    },
    {
      category: 'Technical',
      question: 'What if the app is running slowly?',
      answer: 'Try closing and reopening the app. If issues persist, check your internet connection or contact support.',
    },
    {
      category: 'Billing',
      question: 'How do I generate invoices?',
      answer: 'Use the Generate Invoice quick action from the dashboard or access it through the job details page.',
    },
  ];

  const contactOptions = [
    {
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: '💬',
      action: () => Alert.alert('Live Chat', 'Live chat feature will be available soon!'),
    },
    {
      title: 'Email Support',
      description: 'support@jobmanager.com',
      icon: '📧',
      action: () => Linking.openURL('mailto:support@jobmanager.com'),
    },
    {
      title: 'Phone Support',
      description: '1-800-JOB-HELP',
      icon: '📞',
      action: () => Linking.openURL('tel:+18005624357'),
    },
    {
      title: 'Video Call',
      description: 'Schedule a screen share',
      icon: '📹',
      action: () => Alert.alert('Video Call', 'Video support scheduling will be available soon!'),
    },
  ];

  const quickLinks = [
    {
      title: 'User Guide',
      description: 'Complete guide to using the app',
      icon: '📚',
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      icon: '🎬',
    },
    {
      title: 'API Documentation',
      description: 'For developers and integrations',
      icon: '🔧',
    },
    {
      title: 'System Status',
      description: 'Check current system status',
      icon: '🟢',
    },
  ];

  const getFilteredFAQs = () => {
    let filtered = faqItems;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.activeCategoryButton,
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === category && styles.activeCategoryText,
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  const renderFAQItem = (item, index) => (
    <TouchableOpacity key={index} style={styles.faqItem}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Text style={styles.faqIcon}>❓</Text>
      </View>
      <Text style={styles.faqAnswer}>{item.answer}</Text>
      <View style={styles.faqCategory}>
        <Text style={styles.faqCategoryText}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderContactOption = (option, index) => (
    <TouchableOpacity key={index} style={styles.contactOption} onPress={option.action}>
      <View style={styles.contactIcon}>
        <Text style={styles.contactIconText}>{option.icon}</Text>
      </View>
      <View style={styles.contactContent}>
        <Text style={styles.contactTitle}>{option.title}</Text>
        <Text style={styles.contactDescription}>{option.description}</Text>
      </View>
      <Text style={styles.contactArrow}>→</Text>
    </TouchableOpacity>
  );

  const renderQuickLink = (link, index) => (
    <TouchableOpacity key={index} style={styles.quickLink}>
      <Text style={styles.quickLinkIcon}>{link.icon}</Text>
      <View style={styles.quickLinkContent}>
        <Text style={styles.quickLinkTitle}>{link.title}</Text>
        <Text style={styles.quickLinkDescription}>{link.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Support Center</Text>
        <TouchableOpacity style={styles.emergencyButton}>
          <Text style={styles.emergencyText}>🚨 Emergency</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search for help..."
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 Contact Support</Text>
          <View style={styles.contactGrid}>
            {contactOptions.map(renderContactOption)}
          </View>
        </View>

        {/* FAQ Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❓ Frequently Asked Questions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryContainer}>
              {categories.map(renderCategoryButton)}
            </View>
          </ScrollView>
          
          {/* FAQ Items */}
          <View style={styles.faqContainer}>
            {getFilteredFAQs().map(renderFAQItem)}
          </View>
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Quick Links</Text>
          <View style={styles.quickLinksGrid}>
            {quickLinks.map(renderQuickLink)}
          </View>
        </View>

        {/* System Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ System Information</Text>
          <View style={styles.systemInfo}>
            <View style={styles.systemInfoRow}>
              <Text style={styles.systemInfoLabel}>App Version:</Text>
              <Text style={styles.systemInfoValue}>1.2.3</Text>
            </View>
            <View style={styles.systemInfoRow}>
              <Text style={styles.systemInfoLabel}>Last Updated:</Text>
              <Text style={styles.systemInfoValue}>July 29, 2024</Text>
            </View>
            <View style={styles.systemInfoRow}>
              <Text style={styles.systemInfoLabel}>System Status:</Text>
              <Text style={[styles.systemInfoValue, { color: '#00A63E' }]}>🟢 All Systems Operational</Text>
            </View>
          </View>
        </View>

        {/* Feedback */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Send Feedback</Text>
          <TouchableOpacity style={styles.feedbackButton}>
            <Text style={styles.feedbackButtonText}>Share Your Thoughts</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#101828',
  },
  emergencyButton: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  emergencyText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
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
    color: '#101828',
    marginBottom: 16,
  },
  contactGrid: {
    gap: 12,
  },
  contactOption: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactIconText: {
    fontSize: 18,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#101828',
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  contactArrow: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeCategoryButton: {
    backgroundColor: '#155DFC',
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  faqContainer: {
    gap: 12,
  },
  faqItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#101828',
    flex: 1,
  },
  faqIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  faqCategory: {
    alignSelf: 'flex-start',
  },
  faqCategoryText: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quickLinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickLink: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  quickLinkIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickLinkContent: {
    alignItems: 'center',
  },
  quickLinkTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#101828',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickLinkDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  systemInfo: {
    gap: 12,
  },
  systemInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  systemInfoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  systemInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#101828',
  },
  feedbackButton: {
    backgroundColor: '#155DFC',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  feedbackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default SupportScreen;