
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

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
};

// Embedded Spacing and Dimensions
const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const BorderRadius = {
  md: 8,
  lg: 12,
};

const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
};


const ReportsScreen= () => {
  const navigation = useNavigation();

  const reports = [
    {
      id: '1',
      title: 'Timesheet Report',
      description: 'View detailed time tracking and work hours',
      type: 'timesheet',
      icon: 'schedule',
      color: Colors.primary,
    },
    {
      id: '2',
      title: 'Productivity Report',
      description: 'Analyze productivity metrics and efficiency',
      type: 'productivity',
      icon: 'trending-up',
      color: Colors.success,
    },
    {
      id: '3',
      title: 'Job Summary',
      description: 'Overview of completed and ongoing jobs',
      type: 'job-summary',
      icon: 'work',
      color: Colors.warning,
    },
    {
      id: '4',
      title: 'Expense Report',
      description: 'Track materials and job-related expenses',
      type: 'expense',
      icon: 'receipt',
      color: Colors.error,
    },
  ];

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  }, []);

  const handleReportPress = (report) => {
    console.log(`Opening ${report.type} report`);
    // Navigate to specific report screen
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color={Colors.text} />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Reports</Text>
      
      <TouchableOpacity style={styles.exportButton}>
        <Icon name="file-download" size={24} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderReportCard = (report) => (
    <TouchableOpacity
      key={report.id}
      style={styles.reportCard}
      onPress={() => handleReportPress(report)}
    >
      <View style={[styles.reportIcon, { backgroundColor: `${report.color}20` }]}>
        <Icon name={report.icon} size={32} color={report.color} />
      </View>
      
      <View style={styles.reportContent}>
        <Text style={styles.reportTitle}>{report.title}</Text>
        <Text style={styles.reportDescription}>{report.description}</Text>
      </View>
      
      <Icon name="chevron-right" size={24} color={Colors.textLight} />
    </TouchableOpacity>
  );

  const renderQuickStats = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.sectionTitle}>This Week</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Icon name="schedule" size={24} color={Colors.primary} />
          <Text style={styles.statNumber}>42h</Text>
          <Text style={styles.statLabel}>Hours Worked</Text>
        </View>
        
        <View style={styles.statCard}>
          <Icon name="check-circle" size={24} color={Colors.success} />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Jobs Completed</Text>
        </View>
        
        <View style={styles.statCard}>
          <Icon name="attach-money" size={24} color={Colors.warning} />
          <Text style={styles.statNumber}>$2.1K</Text>
          <Text style={styles.statLabel}>Materials Cost</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      
      {renderHeader()}
      
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderQuickStats()}
        
        <View style={styles.reportsSection}>
          <Text style={styles.sectionTitle}>Available Reports</Text>
          
          <View style={styles.reportsList}>
            {reports.map(renderReportCard)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Embedded Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  statsContainer: {
    backgroundColor: Colors.white,
    // marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap:4
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    marginHorizontal: 0,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  reportsSection: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  reportsList: {
    gap: Spacing.sm,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  reportIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportContent: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  reportDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});

export default ReportsScreen;