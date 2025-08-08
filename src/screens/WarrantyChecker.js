// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   TextInput,
//   Alert,
// } from 'react-native';



// export default function WarrantyChecker({ onNavigate, navigation }) {
//   const [serialNumber, setSerialNumber] = useState('');
//   const [modelNumber, setModelNumber] = useState('');
//   const [warrantyResult, setWarrantyResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const checkWarranty = async () => {
//     if (!serialNumber.trim()) {
//       Alert.alert('Error', 'Please enter a serial number');
//       return;
//     }

//     setLoading(true);
    
//     // Simulate API call
//     setTimeout(() => {
//       // Mock warranty data
//       const mockResult = {
//         isValid: Math.random() > 0.3, // 70% chance of valid warranty
//         product: 'Circuit Breaker Panel - 200A',
//         manufacturer: 'Square D',
//         model: modelNumber || 'QO200',
//         serialNumber: serialNumber,
//         purchaseDate: '2022-03-15',
//         warrantyPeriod: '5 years',
//         expiryDate: '2027-03-15',
//         status: Math.random() > 0.3 ? 'Active' : 'Expired',
//         coverage: 'Full replacement and repair coverage',
//         claimInstructions: 'Contact manufacturer at 1-800-SQUARE-D',
//       };
      
//       setWarrantyResult(mockResult);
//       setLoading(false);
//     }, 2000);
//   };

//   const resetSearch = () => {
//     setSerialNumber('');
//     setModelNumber('');
//     setWarrantyResult(null);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.backButton}>← Back</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Warranty Checker</Text>
//         <View style={styles.headerRight} />
//       </View>

//       <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
//         {/* Search Form */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Check Product Warranty</Text>
          
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Serial Number *</Text>
//             <TextInput
//               style={styles.input}
//               value={serialNumber}
//               onChangeText={setSerialNumber}
//               placeholder="Enter serial number"
//               placeholderTextColor="#9CA3AF"
//               autoCapitalize="characters"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Model Number (Optional)</Text>
//             <TextInput
//               style={styles.input}
//               value={modelNumber}
//               onChangeText={setModelNumber}
//               placeholder="Enter model number"
//               placeholderTextColor="#9CA3AF"
//               autoCapitalize="characters"
//             />
//           </View>

//           <TouchableOpacity
//             style={[styles.checkButton, loading && styles.disabledButton]}
//             onPress={checkWarranty}
//             disabled={loading}
//           >
//             <Text style={styles.checkButtonText}>
//               {loading ? 'Checking...' : '🔍 Check Warranty'}
//             </Text>
//           </TouchableOpacity>

//           {warrantyResult && (
//             <TouchableOpacity style={styles.resetButton} onPress={resetSearch}>
//               <Text style={styles.resetButtonText}>New Search</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Warranty Result */}
//         {warrantyResult && (
//           <View style={styles.section}>
//             <View style={styles.resultHeader}>
//               <Text style={styles.sectionTitle}>Warranty Information</Text>
//               <View style={[
//                 styles.statusBadge,
//                 { backgroundColor: warrantyResult.isValid ? '#10B981' : '#EF4444' }
//               ]}>
//                 <Text style={styles.statusText}>
//                   {warrantyResult.isValid ? 'VALID' : 'INVALID/EXPIRED'}
//                 </Text>
//               </View>
//             </View>

//             <View style={styles.resultContent}>
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>Product:</Text>
//                 <Text style={styles.infoValue}>{warrantyResult.product}</Text>
//               </View>
              
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>Manufacturer:</Text>
//                 <Text style={styles.infoValue}>{warrantyResult.manufacturer}</Text>
//               </View>
              
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>Model:</Text>
//                 <Text style={styles.infoValue}>{warrantyResult.model}</Text>
//               </View>
              
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>Serial Number:</Text>
//                 <Text style={styles.infoValue}>{warrantyResult.serialNumber}</Text>
//               </View>
              
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>Purchase Date:</Text>
//                 <Text style={styles.infoValue}>
//                   {new Date(warrantyResult.purchaseDate).toLocaleDateString()}
//                 </Text>
//               </View>
              
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>Warranty Period:</Text>
//                 <Text style={styles.infoValue}>{warrantyResult.warrantyPeriod}</Text>
//               </View>
              
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>Expiry Date:</Text>
//                 <Text style={[
//                   styles.infoValue,
//                   { color: warrantyResult.isValid ? '#10B981' : '#EF4444' }
//                 ]}>
//                   {new Date(warrantyResult.expiryDate).toLocaleDateString()}
//                 </Text>
//               </View>
              
//               <View style={styles.infoRow}>
//                 <Text style={styles.infoLabel}>Status:</Text>
//                 <Text style={[
//                   styles.infoValue,
//                   { color: warrantyResult.isValid ? '#10B981' : '#EF4444', fontWeight: 'bold' }
//                 ]}>
//                   {warrantyResult.status}
//                 </Text>
//               </View>
//             </View>

//             {warrantyResult.isValid && (
//               <View style={styles.coverageSection}>
//                 <Text style={styles.coverageTitle}>Coverage Details</Text>
//                 <Text style={styles.coverageText}>{warrantyResult.coverage}</Text>
                
//                 <Text style={styles.claimTitle}>Claim Instructions</Text>
//                 <Text style={styles.claimText}>{warrantyResult.claimInstructions}</Text>
//               </View>
//             )}
//           </View>
//         )}

//         {/* Quick Tips */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Tips for Warranty Checks</Text>
          
//           <View style={styles.tipItem}>
//             <Text style={styles.tipIcon}>💡</Text>
//             <Text style={styles.tipText}>
//               Serial numbers are usually found on product labels or nameplates
//             </Text>
//           </View>
          
//           <View style={styles.tipItem}>
//             <Text style={styles.tipIcon}>📋</Text>
//             <Text style={styles.tipText}>
//               Keep purchase receipts and installation records for warranty claims
//             </Text>
//           </View>
          
//           <View style={styles.tipItem}>
//             <Text style={styles.tipIcon}>⚠️</Text>
//             <Text style={styles.tipText}>
//               Some warranties may be voided by improper installation or modifications
//             </Text>
//           </View>
          
//           <View style={styles.tipItem}>
//             <Text style={styles.tipIcon}>📞</Text>
//             <Text style={styles.tipText}>
//               Contact manufacturer directly for complex warranty claims
//             </Text>
//           </View>
//         </View>

//         {/* Common Manufacturers */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Common Manufacturers</Text>
          
//           <View style={styles.manufacturerGrid}>
//             <TouchableOpacity style={styles.manufacturerCard}>
//               <Text style={styles.manufacturerName}>Square D</Text>
//               <Text style={styles.manufacturerContact}>1-800-SQUARE-D</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity style={styles.manufacturerCard}>
//               <Text style={styles.manufacturerName}>Eaton</Text>
//               <Text style={styles.manufacturerContact}>1-800-356-6348</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity style={styles.manufacturerCard}>
//               <Text style={styles.manufacturerName}>GE</Text>
//               <Text style={styles.manufacturerContact}>1-800-626-2000</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity style={styles.manufacturerCard}>
//               <Text style={styles.manufacturerName}>Siemens</Text>
//               <Text style={styles.manufacturerContact}>1-800-333-7889</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8FAFC',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingTop: 50,
//     paddingBottom: 16,
//     backgroundColor: '#1E40AF',
//   },
//   backButton: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     fontWeight: '500',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   headerRight: {
//     width: 40,
//   },
//   content: {
//     flex: 1,
//   },
//   contentContainer: {
//     padding: 16,
//   },
//   section: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 16,
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 10,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     fontSize: 16,
//     backgroundColor: '#F9FAFB',
//     color: '#1F2937',
//   },
//   checkButton: {
//     backgroundColor: '#3B82F6',
//     borderRadius: 12,
//     paddingVertical: 16,
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   disabledButton: {
//     backgroundColor: '#9CA3AF',
//   },
//   checkButtonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   resetButton: {
//     backgroundColor: '#F3F4F6',
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
//   resetButtonText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#3B82F6',
//   },
//   resultHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   resultContent: {
//     marginBottom: 16,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },
//   infoLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#6B7280',
//     flex: 1,
//   },
//   infoValue: {
//     fontSize: 14,
//     color: '#1F2937',
//     flex: 2,
//     textAlign: 'right',
//   },
//   coverageSection: {
//     backgroundColor: '#F0FDF4',
//     borderRadius: 8,
//     padding: 12,
//   },
//   coverageTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 8,
//   },
//   coverageText: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 12,
//     lineHeight: 20,
//   },
//   claimTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 8,
//   },
//   claimText: {
//     fontSize: 14,
//     color: '#6B7280',
//     lineHeight: 20,
//   },
//   tipItem: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },
//   tipIcon: {
//     fontSize: 16,
//     marginRight: 12,
//     marginTop: 2,
//   },
//   tipText: {
//     fontSize: 14,
//     color: '#6B7280',
//     flex: 1,
//     lineHeight: 20,
//   },
//   manufacturerGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   manufacturerCard: {
//     width: '48%',
//     backgroundColor: '#F9FAFB',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 8,
//     alignItems: 'center',
//   },
//   manufacturerName: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   manufacturerContact: {
//     fontSize: 12,
//     color: '#3B82F6',
//     fontWeight: '500',
//   },
// });


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

// Embedded Colors and Constants
const Colors = {
  primary: '#3B82F6', primaryLight: '#EBF4FF', white: '#FFFFFF', backgroundLight: '#F8FAFC',
  text: '#1E293B', textSecondary: '#64748B', textLight: '#94A3B8', border: '#E2E8F0',
  success: '#10B981', successLight: '#D1FAE5', warning: '#F59E0B', error: '#EF4444',
};

const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
const BorderRadius = { md: 8, lg: 12 };
const Shadows = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
};



const WarrantyChecker = () => {
  const navigation = useNavigation();
  const [serialNumber, setSerialNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  }, []);

  const checkWarranty = async () => {
    if (!serialNumber.trim()) {
      Alert.alert('Error', 'Please enter a serial number');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Mock warranty result
      const mockResult = {
        productName: 'Professional Circuit Breaker Panel',
        serialNumber: serialNumber.toUpperCase(),
        purchaseDate: '2023-03-15',
        warrantyStatus: 'active',
        expiryDate: '2026-03-15',
        coverageType: 'Full Coverage',
        manufacturer: 'ElectriCorp Manufacturing',
      };

      setResult(mockResult);
    } catch (error) {
      Alert.alert('Error', 'Failed to check warranty. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return Colors.success;
      case 'expiring': return Colors.warning;
      case 'expired': return Colors.error;
      default: return Colors.textSecondary;
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color={Colors.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Warranty Checker</Text>
      <View style={styles.placeholder} />
    </View>
  );

  const renderSearchForm = () => (
    <View style={styles.searchSection}>
      <Text style={styles.sectionTitle}>Check Product Warranty</Text>
      <Text style={styles.sectionDescription}>
        Enter the serial number found on your electrical equipment to check warranty status.
      </Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Serial Number</Text>
        <TextInput
          style={styles.textInput}
          value={serialNumber}
          onChangeText={setSerialNumber}
          placeholder="Enter serial number (e.g., ABC123456789)"
          autoCapitalize="characters"
          maxLength={20}
        />
      </View>
      
      <TouchableOpacity
        style={[styles.checkButton, loading && styles.disabledButton]}
        onPress={checkWarranty}
        disabled={loading}
      >
        <Icon name="search" size={20} color={Colors.white} />
        <Text style={styles.checkButtonText}>
          {loading ? 'Checking...' : 'Check Warranty'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderResult = () => {
    if (!result) return null;

    return (
      <View style={styles.resultSection}>
        <View style={styles.resultHeader}>
          <Icon 
            name={result.warrantyStatus === 'active' ? 'verified' : 'warning'} 
            size={32} 
            color={getStatusColor(result.warrantyStatus)} 
          />
          <Text style={styles.resultTitle}>Warranty Information</Text>
        </View>
        
        <View style={styles.resultCard}>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Product</Text>
            <Text style={styles.resultValue}>{result.productName}</Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Serial Number</Text>
            <Text style={styles.resultValue}>{result.serialNumber}</Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Manufacturer</Text>
            <Text style={styles.resultValue}>{result.manufacturer}</Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Purchase Date</Text>
            <Text style={styles.resultValue}>{result.purchaseDate}</Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Coverage Type</Text>
            <Text style={styles.resultValue}>{result.coverageType}</Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Warranty Status</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(result.warrantyStatus) }]} />
              <Text style={[styles.statusText, { color: getStatusColor(result.warrantyStatus) }]}>
                {result.warrantyStatus.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Expires</Text>
            <Text style={styles.resultValue}>{result.expiryDate}</Text>
          </View>
        </View>
        
        {result.warrantyStatus === 'active' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.claimButton}>
              <Icon name="report-problem" size={20} color={Colors.white} />
              <Text style={styles.claimButtonText}>File Warranty Claim</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.contactButton}>
              <Icon name="phone" size={20} color={Colors.primary} />
              <Text style={styles.contactButtonText}>Contact Manufacturer</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderTips = () => (
    <View style={styles.tipsSection}>
      <Text style={styles.sectionTitle}>Tips</Text>
      <View style={styles.tipsList}>
        <View style={styles.tipItem}>
          <Icon name="info" size={16} color={Colors.primary} />
          <Text style={styles.tipText}>Serial numbers are usually found on product labels or nameplates</Text>
        </View>
        <View style={styles.tipItem}>
          <Icon name="camera-alt" size={16} color={Colors.primary} />
          <Text style={styles.tipText}>Take photos of serial numbers for easy reference</Text>
        </View>
        <View style={styles.tipItem}>
          <Icon name="schedule" size={16} color={Colors.primary} />
          <Text style={styles.tipText}>Check warranty status before major repairs or installations</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      {renderHeader()}
      
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {renderSearchForm()}
        {renderResult()}
        {renderTips()}
      </ScrollView>
    </View>
  );
};

// Embedded Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundLight },
  header: {
    backgroundColor: Colors.white, paddingTop: Spacing.lg, paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.backgroundLight, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  placeholder: { width: 40 },
  scrollContainer: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.xl },
  searchSection: { backgroundColor: Colors.white, marginHorizontal: Spacing.md, marginVertical: Spacing.sm, borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadows.sm },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginBottom: Spacing.sm },
  sectionDescription: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20, marginBottom: Spacing.md },
  inputGroup: { marginBottom: Spacing.md },
  inputLabel: { fontSize: 14, fontWeight: '500', color: Colors.text, marginBottom: Spacing.xs },
  textInput: { borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, fontSize: 16, color: Colors.text, backgroundColor: Colors.white },
  checkButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, borderRadius: BorderRadius.md, paddingVertical: Spacing.md, gap: Spacing.sm },
  disabledButton: { backgroundColor: Colors.textSecondary },
  checkButtonText: { fontSize: 16, fontWeight: '600', color: Colors.white },
  resultSection: { backgroundColor: Colors.white, marginHorizontal: Spacing.md, marginVertical: Spacing.sm, borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadows.sm },
  resultHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md, gap: Spacing.sm },
  resultTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  resultCard: { backgroundColor: Colors.backgroundLight, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.md },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  resultLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  resultValue: { fontSize: 14, color: Colors.text, fontWeight: '500', textAlign: 'right', flex: 1, marginLeft: Spacing.md },
  statusContainer: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 14, fontWeight: '600' },
  actionButtons: { gap: Spacing.sm },
  claimButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, borderRadius: BorderRadius.md, paddingVertical: Spacing.md, gap: Spacing.sm },
  claimButtonText: { fontSize: 16, fontWeight: '600', color: Colors.white },
  contactButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.primary, borderRadius: BorderRadius.md, paddingVertical: Spacing.md, gap: Spacing.sm },
  contactButtonText: { fontSize: 16, fontWeight: '600', color: Colors.primary },
  tipsSection: { backgroundColor: Colors.white, marginHorizontal: Spacing.md, marginVertical: Spacing.sm, borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadows.sm },
  tipsList: { gap: Spacing.md },
  tipItem: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  tipText: { flex: 1, fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
});

export default WarrantyChecker;