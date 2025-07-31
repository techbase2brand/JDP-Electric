import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';



export default function WarrantyChecker({ onNavigate, navigation }) {
  const [serialNumber, setSerialNumber] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [warrantyResult, setWarrantyResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkWarranty = async () => {
    if (!serialNumber.trim()) {
      Alert.alert('Error', 'Please enter a serial number');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock warranty data
      const mockResult = {
        isValid: Math.random() > 0.3, // 70% chance of valid warranty
        product: 'Circuit Breaker Panel - 200A',
        manufacturer: 'Square D',
        model: modelNumber || 'QO200',
        serialNumber: serialNumber,
        purchaseDate: '2022-03-15',
        warrantyPeriod: '5 years',
        expiryDate: '2027-03-15',
        status: Math.random() > 0.3 ? 'Active' : 'Expired',
        coverage: 'Full replacement and repair coverage',
        claimInstructions: 'Contact manufacturer at 1-800-SQUARE-D',
      };
      
      setWarrantyResult(mockResult);
      setLoading(false);
    }, 2000);
  };

  const resetSearch = () => {
    setSerialNumber('');
    setModelNumber('');
    setWarrantyResult(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Warranty Checker</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Search Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Check Product Warranty</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Serial Number *</Text>
            <TextInput
              style={styles.input}
              value={serialNumber}
              onChangeText={setSerialNumber}
              placeholder="Enter serial number"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Model Number (Optional)</Text>
            <TextInput
              style={styles.input}
              value={modelNumber}
              onChangeText={setModelNumber}
              placeholder="Enter model number"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
            />
          </View>

          <TouchableOpacity
            style={[styles.checkButton, loading && styles.disabledButton]}
            onPress={checkWarranty}
            disabled={loading}
          >
            <Text style={styles.checkButtonText}>
              {loading ? 'Checking...' : '🔍 Check Warranty'}
            </Text>
          </TouchableOpacity>

          {warrantyResult && (
            <TouchableOpacity style={styles.resetButton} onPress={resetSearch}>
              <Text style={styles.resetButtonText}>New Search</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Warranty Result */}
        {warrantyResult && (
          <View style={styles.section}>
            <View style={styles.resultHeader}>
              <Text style={styles.sectionTitle}>Warranty Information</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: warrantyResult.isValid ? '#10B981' : '#EF4444' }
              ]}>
                <Text style={styles.statusText}>
                  {warrantyResult.isValid ? 'VALID' : 'INVALID/EXPIRED'}
                </Text>
              </View>
            </View>

            <View style={styles.resultContent}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Product:</Text>
                <Text style={styles.infoValue}>{warrantyResult.product}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Manufacturer:</Text>
                <Text style={styles.infoValue}>{warrantyResult.manufacturer}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Model:</Text>
                <Text style={styles.infoValue}>{warrantyResult.model}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Serial Number:</Text>
                <Text style={styles.infoValue}>{warrantyResult.serialNumber}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Purchase Date:</Text>
                <Text style={styles.infoValue}>
                  {new Date(warrantyResult.purchaseDate).toLocaleDateString()}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Warranty Period:</Text>
                <Text style={styles.infoValue}>{warrantyResult.warrantyPeriod}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Expiry Date:</Text>
                <Text style={[
                  styles.infoValue,
                  { color: warrantyResult.isValid ? '#10B981' : '#EF4444' }
                ]}>
                  {new Date(warrantyResult.expiryDate).toLocaleDateString()}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status:</Text>
                <Text style={[
                  styles.infoValue,
                  { color: warrantyResult.isValid ? '#10B981' : '#EF4444', fontWeight: 'bold' }
                ]}>
                  {warrantyResult.status}
                </Text>
              </View>
            </View>

            {warrantyResult.isValid && (
              <View style={styles.coverageSection}>
                <Text style={styles.coverageTitle}>Coverage Details</Text>
                <Text style={styles.coverageText}>{warrantyResult.coverage}</Text>
                
                <Text style={styles.claimTitle}>Claim Instructions</Text>
                <Text style={styles.claimText}>{warrantyResult.claimInstructions}</Text>
              </View>
            )}
          </View>
        )}

        {/* Quick Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips for Warranty Checks</Text>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipText}>
              Serial numbers are usually found on product labels or nameplates
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>📋</Text>
            <Text style={styles.tipText}>
              Keep purchase receipts and installation records for warranty claims
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>⚠️</Text>
            <Text style={styles.tipText}>
              Some warranties may be voided by improper installation or modifications
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>📞</Text>
            <Text style={styles.tipText}>
              Contact manufacturer directly for complex warranty claims
            </Text>
          </View>
        </View>

        {/* Common Manufacturers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Manufacturers</Text>
          
          <View style={styles.manufacturerGrid}>
            <TouchableOpacity style={styles.manufacturerCard}>
              <Text style={styles.manufacturerName}>Square D</Text>
              <Text style={styles.manufacturerContact}>1-800-SQUARE-D</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.manufacturerCard}>
              <Text style={styles.manufacturerName}>Eaton</Text>
              <Text style={styles.manufacturerContact}>1-800-356-6348</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.manufacturerCard}>
              <Text style={styles.manufacturerName}>GE</Text>
              <Text style={styles.manufacturerContact}>1-800-626-2000</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.manufacturerCard}>
              <Text style={styles.manufacturerName}>Siemens</Text>
              <Text style={styles.manufacturerContact}>1-800-333-7889</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#1E40AF',
  },
  backButton: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: '#1F2937',
  },
  checkButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  checkButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resetButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resultContent: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    flex: 2,
    textAlign: 'right',
  },
  coverageSection: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
  },
  coverageTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  coverageText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  claimTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  claimText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    lineHeight: 20,
  },
  manufacturerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  manufacturerCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  manufacturerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  manufacturerContact: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
});