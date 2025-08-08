import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View colors={['#2563eb', '#7c3aed']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.lastUpdated}>Last updated: January 15, 2024</Text>
          
          <Text style={styles.introText}>
            JDP Electrics ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
          </Text>

          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          
          <Text style={styles.subTitle}>Personal Information</Text>
          <Text style={styles.paragraph}>
            We may collect personal information that you provide directly to us, including:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• Name and contact information</Text>
            <Text style={styles.bulletPoint}>• Email address and phone number</Text>
            <Text style={styles.bulletPoint}>• Employment information</Text>
            <Text style={styles.bulletPoint}>• Profile information and preferences</Text>
          </View>

          <Text style={styles.subTitle}>Usage Information</Text>
          <Text style={styles.paragraph}>
            We automatically collect certain information about your use of our app, including:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• Device information and identifiers</Text>
            <Text style={styles.bulletPoint}>• App usage patterns and preferences</Text>
            <Text style={styles.bulletPoint}>• Location data (with your permission)</Text>
            <Text style={styles.bulletPoint}>• Log files and analytics data</Text>
          </View>

          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use the information we collect to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• Provide and maintain our services</Text>
            <Text style={styles.bulletPoint}>• Process transactions and manage your account</Text>
            <Text style={styles.bulletPoint}>• Send you technical notices and support messages</Text>
            <Text style={styles.bulletPoint}>• Improve our app and develop new features</Text>
            <Text style={styles.bulletPoint}>• Ensure security and prevent fraud</Text>
          </View>

          <Text style={styles.sectionTitle}>3. Information Sharing</Text>
          <Text style={styles.paragraph}>
            We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• With your explicit consent</Text>
            <Text style={styles.bulletPoint}>• To comply with legal obligations</Text>
            <Text style={styles.bulletPoint}>• To protect our rights and safety</Text>
            <Text style={styles.bulletPoint}>• With trusted service providers who assist us</Text>
          </View>

          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
          </Text>

          <Text style={styles.sectionTitle}>5. Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
          </Text>

          <Text style={styles.sectionTitle}>6. Your Rights</Text>
          <Text style={styles.paragraph}>
            Depending on your location, you may have the following rights regarding your personal information:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• Access to your personal information</Text>
            <Text style={styles.bulletPoint}>• Correction of inaccurate information</Text>
            <Text style={styles.bulletPoint}>• Deletion of your personal information</Text>
            <Text style={styles.bulletPoint}>• Restriction of processing</Text>
            <Text style={styles.bulletPoint}>• Data portability</Text>
          </View>

          <Text style={styles.sectionTitle}>7. Location Information</Text>
          <Text style={styles.paragraph}>
            Our app may request access to your device's location to provide location-based services such as job site navigation. You can control location permissions through your device settings.
          </Text>

          <Text style={styles.sectionTitle}>8. Children's Privacy</Text>
          <Text style={styles.paragraph}>
            Our app is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
          </Text>

          <Text style={styles.sectionTitle}>9. Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy within the app and updating the "Last updated" date.
          </Text>

          <Text style={styles.sectionTitle}>10. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this Privacy Policy, please contact us:
          </Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactText}>Email: privacy@jdpelectric.com</Text>
            <Text style={styles.contactText}>Phone: +1 (555) 123-4567</Text>
            <Text style={styles.contactText}>Address: 1234 Business Blvd, Houston, TX 77001</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
    padding:10
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 24,
    textAlign: 'center',
  },
  introText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'justify',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 24,
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'justify',
  },
  bulletList: {
    marginLeft: 16,
    marginBottom: 16,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 8,
  },
  contactInfo: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 4,
  },
});

export default PrivacyPolicyScreen;

