// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   StyleSheet,
//   StatusBar,
// } from 'react-native';

// const ReportsScreen = () => {
//   const [selectedPeriod, setSelectedPeriod] = useState('This Week');
  
//   const periods = ['This Week', 'This Month', 'Last Month', 'This Year'];

//   const metrics = [
//     {
//       title: 'Total Jobs',
//       value: '156',
//       change: '+12%',
//       isPositive: true,
//       icon: '📋',
//       color: '#155DFC',
//     },
//     {
//       title: 'Completed Jobs',
//       value: '142',
//       change: '+8%',
//       isPositive: true,
//       icon: '✅',
//       color: '#00A63E',
//     },
//     {
//       title: 'Revenue',
//       value: '$24,500',
//       change: '+15%',
//       isPositive: true,
//       icon: '💰',
//       color: '#F59E0B',
//     },
//     {
//       title: 'Avg Response Time',
//       value: '2.4h',
//       change: '-0.5h',
//       isPositive: true,
//       icon: '⏱️',
//       color: '#8B5CF6',
//     },
//   ];

//   const teamPerformance = [
//     {
//       name: 'David Thompson',
//       jobsCompleted: 18,
//       rating: 4.9,
//       efficiency: 95,
//     },
//     {
//       name: 'Sarah Johnson',
//       jobsCompleted: 15,
//       rating: 4.8,
//       efficiency: 92,
//     },
//     {
//       name: 'Mike Rodriguez',
//       jobsCompleted: 12,
//       rating: 4.7,
//       efficiency: 88,
//     },
//     {
//       name: 'Lisa Chen',
//       jobsCompleted: 14,
//       rating: 4.8,
//       efficiency: 90,
//     },
//   ];

//   const recentActivity = [
//     {
//       action: 'Job JOB-156 completed',
//       technician: 'David Thompson',
//       time: '2 hours ago',
//       status: 'completed',
//     },
//     {
//       action: 'New job JOB-157 assigned',
//       technician: 'Sarah Johnson',
//       time: '3 hours ago',
//       status: 'assigned',
//     },
//     {
//       action: 'Job JOB-155 started',
//       technician: 'Mike Rodriguez',
//       time: '4 hours ago',
//       status: 'started',
//     },
//     {
//       action: 'Job JOB-154 completed',
//       technician: 'Lisa Chen',
//       time: '5 hours ago',
//       status: 'completed',
//     },
//   ];

//   const renderPeriodButton = (period: string) => (
//     <TouchableOpacity
//       key={period}
//       style={[
//         styles.periodButton,
//         selectedPeriod === period && styles.activePeriodButton,
//       ]}
//       onPress={() => setSelectedPeriod(period)}
//     >
//       <Text
//         style={[
//           styles.periodText,
//           selectedPeriod === period && styles.activePeriodText,
//         ]}
//       >
//         {period}
//       </Text>
//     </TouchableOpacity>
//   );

//   const renderMetricCard = (metric: any, index: number) => (
//     <View key={index} style={[styles.metricCard, { borderLeftColor: metric.color }]}>
//       <View style={styles.metricHeader}>
//         <Text style={styles.metricIcon}>{metric.icon}</Text>
//         <View style={[
//           styles.changeIndicator,
//           { backgroundColor: metric.isPositive ? '#F0FDF4' : '#FEF2F2' }
//         ]}>
//           <Text style={[
//             styles.changeText,
//             { color: metric.isPositive ? '#00A63E' : '#DC2626' }
//           ]}>
//             {metric.change}
//           </Text>
//         </View>
//       </View>
//       <Text style={styles.metricTitle}>{metric.title}</Text>
//       <Text style={[styles.metricValue, { color: metric.color }]}>{metric.value}</Text>
//     </View>
//   );

//   const renderTeamMember = (member: any, index: number) => (
//     <View key={index} style={styles.teamMemberCard}>
//       <View style={styles.teamMemberHeader}>
//         <View style={styles.teamMemberInfo}>
//           <Text style={styles.teamMemberName}>{member.name}</Text>
//           <Text style={styles.teamMemberJobs}>{member.jobsCompleted} jobs completed</Text>
//         </View>
//         <View style={styles.ratingContainer}>
//           <Text style={styles.ratingText}>⭐ {member.rating}</Text>
//         </View>
//       </View>
//       <View style={styles.efficiencyContainer}>
//         <Text style={styles.efficiencyLabel}>Efficiency</Text>
//         <View style={styles.efficiencyBar}>
//           <View style={[
//             styles.efficiencyFill,
//             { width: `${member.efficiency}%` }
//           ]} />
//         </View>
//         <Text style={styles.efficiencyText}>{member.efficiency}%</Text>
//       </View>
//     </View>
//   );

//   const renderActivityItem = (item: any, index: number) => (
//     <View key={index} style={styles.activityItem}>
//       <View style={[
//         styles.activityIndicator,
//         {
//           backgroundColor: item.status === 'completed' ? '#00A63E' :
//                           item.status === 'started' ? '#155DFC' : '#F59E0B'
//         }
//       ]} />
//       <View style={styles.activityContent}>
//         <Text style={styles.activityAction}>{item.action}</Text>
//         <Text style={styles.activityDetails}>{item.technician} • {item.time}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Reports & Analytics</Text>
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {/* Period Selection */}
//         <View style={styles.periodSelector}>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             <View style={styles.periodButtons}>
//               {periods.map(renderPeriodButton)}
//             </View>
//           </ScrollView>
//         </View>

//         {/* Key Metrics */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>📊 Key Metrics</Text>
//           <View style={styles.metricsGrid}>
//             {metrics.map(renderMetricCard)}
//           </View>
//         </View>

//         {/* Chart Placeholder */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>📈 Performance Trends</Text>
//           <View style={styles.chartContainer}>
//             <View style={styles.chartPlaceholder}>
//               <Text style={styles.chartText}>📈</Text>
//               <Text style={styles.chartLabel}>Jobs Completed Over Time</Text>
//               <View style={styles.chartBars}>
//                 <View style={[styles.chartBar, { height: 40 }]} />
//                 <View style={[styles.chartBar, { height: 60 }]} />
//                 <View style={[styles.chartBar, { height: 35 }]} />
//                 <View style={[styles.chartBar, { height: 80 }]} />
//                 <View style={[styles.chartBar, { height: 55 }]} />
//                 <View style={[styles.chartBar, { height: 70 }]} />
//                 <View style={[styles.chartBar, { height: 90 }]} />
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Team Performance */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>👥 Team Performance</Text>
//           {teamPerformance.map(renderTeamMember)}
//         </View>

//         {/* Recent Activity */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>🕒 Recent Activity</Text>
//           <View style={styles.activityList}>
//             {recentActivity.map(renderActivityItem)}
//           </View>
//         </View>

//         {/* Export Options */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>📤 Export Reports</Text>
//           <View style={styles.exportButtons}>
//             <TouchableOpacity style={styles.exportButton}>
//               <Text style={styles.exportButtonText}>📄 Export PDF</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.exportButton}>
//               <Text style={styles.exportButtonText}>📊 Export Excel</Text>
//             </TouchableOpacity>
//           </View>
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
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#101828',
//   },
//   content: {
//     flex: 1,
//   },
//   periodSelector: {
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   periodButtons: {
//     flexDirection: 'row',
//     paddingHorizontal: 20,
//     gap: 12,
//   },
//   periodButton: {
//     backgroundColor: '#F3F4F6',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   activePeriodButton: {
//     backgroundColor: '#155DFC',
//   },
//   periodText: {
//     fontSize: 14,
//     color: '#6B7280',
//     fontWeight: '500',
//   },
//   activePeriodText: {
//     color: '#FFFFFF',
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
//   metricsGrid: {
//     gap: 16,
//   },
//   metricCard: {
//     backgroundColor: '#F8FAFC',
//     borderRadius: 8,
//     padding: 16,
//     borderLeftWidth: 4,
//   },
//   metricHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   metricIcon: {
//     fontSize: 20,
//   },
//   changeIndicator: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   changeText: {
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   metricTitle: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 4,
//   },
//   metricValue: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   chartContainer: {
//     backgroundColor: '#F8FAFC',
//     borderRadius: 8,
//     padding: 20,
//   },
//   chartPlaceholder: {
//     alignItems: 'center',
//   },
//   chartText: {
//     fontSize: 32,
//     marginBottom: 8,
//   },
//   chartLabel: {
//     fontSize: 16,
//     color: '#6B7280',
//     marginBottom: 20,
//   },
//   chartBars: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     gap: 8,
//     height: 100,
//   },
//   chartBar: {
//     width: 20,
//     backgroundColor: '#155DFC',
//     borderRadius: 4,
//   },
//   teamMemberCard: {
//     backgroundColor: '#F8FAFC',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 12,
//   },
//   teamMemberHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   teamMemberInfo: {
//     flex: 1,
//   },
//   teamMemberName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#101828',
//     marginBottom: 4,
//   },
//   teamMemberJobs: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   ratingContainer: {
//     backgroundColor: '#FEF3C7',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   ratingText: {
//     fontSize: 12,
//     color: '#92400E',
//     fontWeight: '500',
//   },
//   efficiencyContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   efficiencyLabel: {
//     fontSize: 14,
//     color: '#6B7280',
//     minWidth: 60,
//   },
//   efficiencyBar: {
//     flex: 1,
//     height: 8,
//     backgroundColor: '#E5E7EB',
//     borderRadius: 4,
//     overflow: 'hidden',
//   },
//   efficiencyFill: {
//     height: '100%',
//     backgroundColor: '#00A63E',
//   },
//   efficiencyText: {
//     fontSize: 14,
//     color: '#101828',
//     fontWeight: '500',
//     minWidth: 40,
//   },
//   activityList: {
//     gap: 16,
//   },
//   activityItem: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     gap: 12,
//   },
//   activityIndicator: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginTop: 6,
//   },
//   activityContent: {
//     flex: 1,
//   },
//   activityAction: {
//     fontSize: 14,
//     color: '#101828',
//     marginBottom: 4,
//   },
//   activityDetails: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   exportButtons: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   exportButton: {
//     flex: 1,
//     backgroundColor: '#155DFC',
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   exportButtonText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: '500',
//   },
// });

// export default ReportsScreen;
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