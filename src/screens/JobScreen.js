// import React, { useEffect, useState } from 'react'
// import { FlatList, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import { BaseStyle } from '../constants/Style';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
// import { style, spacings } from '../constants/Fonts';
// import { blackColor, greenColor, orangeColor, whiteColor, yellowColor } from '../constants/Color';
// import Header from '../components/Header';

// const { flex, alignItemsCenter, alignJustifyCenter, resizeModeContain, flexDirectionRow, justifyContentSpaceBetween, justifyContentCenter, textAlign } = BaseStyle;

// const JobScreen = ({ navigation }) => {
//   const [selectedTab, setSelectedTab] = useState('All');
//   const [currentTime, setCurrentTime] = useState(getFormattedTime());

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentTime(getFormattedTime());
//     }, 1000); // Update every 1 second

//     return () => clearInterval(interval); // Cleanup
//   }, []);

//   function getFormattedTime() {
//     return new Date().toLocaleTimeString([], { hour12: false });
//   }
//   const jobData = [
//     { id: '1001', siteName: 'Alberta. 110...', status: 'Pending' },
//     { id: '1002', siteName: 'Alberta. 110...', status: 'Complete' },
//     { id: '1003', siteName: 'Alberta. 110...', status: 'Ongoing', time: '11:02:08' },
//     { id: '1004', siteName: 'Alberta. 110...', status: 'Pending' },
//     { id: '1005', siteName: 'Alberta. 110...', status: 'Complete' },
//     { id: '1006', siteName: 'Alberta. 110...', status: 'Complete' },
//     { id: '1007', siteName: 'Alberta. 110...', status: 'Complete' },
//     { id: '1008', siteName: 'Alberta. 110...', status: 'Complete' },
//     { id: '1009', siteName: 'Alberta. 110...', status: 'Pending' },
//     { id: '10010', siteName: 'Alberta. 110...', status: 'Complete' },
//   ];

//   const renderJobItem = ({ item, index }) => {
//     const isOngoing = item.status === 'Ongoing';
//     // Background color logic
//     let backgroundColor = '';
//     if (isOngoing) {
//       backgroundColor = yellowColor;
//     } else {
//       backgroundColor = index % 2 === 0 ? whiteColor : '#F4FBFF';
//     }
//     return (
//       <Pressable
//         style={[styles.row, { backgroundColor }]}
//         onPress={() => navigation.navigate("JobDetailsScreen", {
//           id: item.id,
//           status: item.status,
//           // time: item?.time
//         })}>
//         <Text style={[flex, justifyContentCenter, { paddingLeft: spacings.xxxLarge }]}>#{item.id}</Text>
//         <Text style={[flex, justifyContentCenter]}>{item.siteName}</Text>
//         <View style={[flex, justifyContentCenter]}>
//           {isOngoing ? (
//             <Text style={styles.ongoingText}>
//               {/* Ongoing {item.time} */}
//               Ongoing {currentTime}
//             </Text>
//           ) : (
//             <View style={[
//               styles.statusBadge,
//               item.status === 'Pending' && styles.pending,
//               item.status === 'Complete' && styles.complete,
//             ]}>
//               <Text style={styles.statusText}>{item.status}</Text>
//             </View>
//           )}
//         </View>
//       </Pressable>
//     );
//   };

//   const filteredJobs = jobData.filter(item =>
//     selectedTab === 'All' ? true : item.status === selectedTab
//   );

//   return (
//     <View style={[flex, { backgroundColor: whiteColor }]}>
//       <Header showProfile={false} scanner={true} />
//       <View style={[styles.container]}>
//         {/* <View style={[styles.tabContainer, flexDirectionRow, justifyContentSpaceBetween]}> */}
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={[styles.tabContainer, flexDirectionRow, justifyContentSpaceBetween, { paddingHorizontal: 10 }]}
//         >
//           {['All', 'Complete', 'Ongoing', 'Pending'].map(tab => (
//             <TouchableOpacity
//               key={tab}
//               style={[
//                 styles.tab,
//                 selectedTab === tab && styles.activeTab
//               ]}
//               onPress={() => setSelectedTab(tab)}
//             >
//               <Text
//                 style={[
//                   styles.tabText,
//                   selectedTab === tab && styles.activeTabText
//                 ]}
//               >
//                 {tab} Jobs
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         <View style={[flexDirectionRow, alignItemsCenter, styles.headerRow]}>
//           <Text style={[flex, justifyContentCenter, { paddingHorizontal: spacings.xxxLarge }]}>ID No.</Text>
//           <Text style={[flex, justifyContentCenter]}>Site Name</Text>
//           <Text style={[flex, justifyContentCenter]}>Status</Text>
//         </View>
//         {/* Job List */}
//         <FlatList
//           data={filteredJobs}
//           renderItem={renderJobItem}
//           keyExtractor={(item, index) => item.id + index}
//           style={{ height: hp(60.5) }}
//           showsVerticalScrollIndicator={false}
//         />
//       </View>

//     </View>
//   )
// }

// export default JobScreen

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: whiteColor,
//     paddingVertical: spacings.large
//   },
//   tabContainer: {
//     marginBottom: spacings.xLarge,
//     paddingHorizontal: spacings.large,
//   },
//   tab: {
//     paddingHorizontal: spacings.xLarge,
//     paddingVertical: spacings.medium,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: blackColor,
//     marginRight: spacings.xLarge
//   },
//   activeTab: {
//     backgroundColor: blackColor
//   },
//   tabText: {
//     color: blackColor
//   },
//   activeTabText: {
//     color: whiteColor
//   },
//   row: {
//     flexDirection: 'row',
//     paddingVertical: spacings.large,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee'
//   },
//   headerRow: {
//     width: wp(100),
//     height: hp(4.5),
//     backgroundColor: '#F4FBFF',
//   },
//   statusBadge: {
//     paddingVertical: 4,
//     paddingHorizontal: spacings.xLarge,
//     borderRadius: 10,
//     alignSelf: 'flex-start'
//   },
//   pending: {
//     backgroundColor: orangeColor
//   },
//   complete: {
//     backgroundColor: greenColor
//   },
//   statusText: {
//     color: whiteColor,
//     fontSize: style.fontSizeNormal.fontSize
//   },
//   ongoingRow: {
//     backgroundColor: yellowColor
//   },
//   ongoingText: {
//     color: blackColor,
//     fontSize: style.fontSizeNormal.fontSize,
//   }
// })

import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {tabColor} from '../constants/Color';

const JobsScreen = ({navigation}) => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'In Progress', 'Scheduled', 'Completed', 'Cancelled'];

  // const jobs = [
  //   {
  //     id: 'JOB-001',
  //     title: 'Electrical Panel Upgrade',
  //     description: 'Upgrade main electrical panel from 100A to 200A service',
  //     status: 'In Progress',
  //     priority: 'HIGH',
  //     technician: 'David Thompson',
  //     time: '08:00 (8h est.)',
  //     location: '1234 Oak Street, Houston, TX 77001',
  //     client: 'Residential Client',
  //     statusColor: '#193CB8',
  //     priorityColor: '#9F0712',
  //     date: 'Today',
  //   },
  //   {
  //     id: 'JOB-002',
  //     title: 'Commercial Lighting Installation',
  //     description: 'Install LED lighting system in conference rooms',
  //     status: 'Scheduled',
  //     priority: 'MEDIUM',
  //     technician: 'Sarah Johnson',
  //     time: '14:00 (6h est.)',
  //     location: '1500 Corporate Blvd, Houston, TX 77002',
  //     client: 'TechCorp Office',
  //     statusColor: '#016630',
  //     priorityColor: '#894B00',
  //     date: 'Today',
  //   },
  //   {
  //     id: 'JOB-003',
  //     title: 'Emergency Generator Maintenance',
  //     description: 'Routine maintenance and testing of backup generator',
  //     status: 'Scheduled',
  //     priority: 'HIGH',
  //     technician: 'Mike Rodriguez',
  //     time: '09:00 (4h est.)',
  //     location: '2000 Medical Center Dr, Houston, TX 77030',
  //     client: 'Metro Hospital',
  //     statusColor: '#016630',
  //     priorityColor: '#9F0712',
  //     date: 'Jan 26',
  //   },
  //   {
  //     id: 'JOB-004',
  //     title: 'HVAC System Repair',
  //     description: 'Fix heating system in office building lobby',
  //     status: 'Completed',
  //     priority: 'MEDIUM',
  //     technician: 'Lisa Chen',
  //     time: 'Completed',
  //     location: '500 Main Street, Houston, TX 77002',
  //     client: 'Downtown Plaza',
  //     statusColor: '#00A63E',
  //     priorityColor: '#894B00',
  //     date: 'Yesterday',
  //   },
  //   {
  //     id: 'JOB-005',
  //     title: 'Security System Installation',
  //     description: 'Install new security cameras and access control',
  //     status: 'In Progress',
  //     priority: 'LOW',
  //     technician: 'John Smith',
  //     time: '10:00 (3h est.)',
  //     location: '800 Commerce St, Houston, TX 77002',
  //     client: 'SecureBuilding Inc',
  //     statusColor: '#193CB8',
  //     priorityColor: '#6B7280',
  //     date: 'Today',
  //   },
  // ];

  const jobs = [
  {
    id: 'JOB-001',
    title: 'Electrical Panel Upgrade',
    description: 'Upgrade main electrical panel from 100A to 200A service',
    status: 'In Progress',
    priority: 'HIGH',
    technician: 'David Thompson',
    time: '08:00 (8h est.)',
    location: '1234 Oak Street, Houston, TX 77001',
    client: 'Residential Client',
    statusColor: '#193CB8',
    priorityColor: '#9F0712',
    date: 'Today',
    startCoordinates: { latitude: 29.7604, longitude: -95.3698 }, // Houston downtown
    destinationCoordinates: { latitude: 29.7704, longitude: -95.3598 }, // ~1.5 km away
  },
  {
    id: 'JOB-002',
    title: 'Commercial Lighting Installation',
    description: 'Install LED lighting system in conference rooms',
    status: 'Scheduled',
    priority: 'MEDIUM',
    technician: 'Sarah Johnson',
    time: '14:00 (6h est.)',
    location: '1500 Corporate Blvd, Houston, TX 77002',
    client: 'TechCorp Office',
    statusColor: '#016630',
    priorityColor: '#894B00',
    date: 'Today',
    startCoordinates: { latitude: 29.7604, longitude: -95.3698 },
    destinationCoordinates: { latitude: 29.7584, longitude: -95.3610 }, // ~1 km
  },
  {
    id: 'JOB-003',
    title: 'Emergency Generator Maintenance',
    description: 'Routine maintenance and testing of backup generator',
    status: 'Scheduled',
    priority: 'HIGH',
    technician: 'Mike Rodriguez',
    time: '09:00 (4h est.)',
    location: '2000 Medical Center Dr, Houston, TX 77030',
    client: 'Metro Hospital',
    statusColor: '#016630',
    priorityColor: '#9F0712',
    date: 'Jan 26',
    startCoordinates: { latitude: 29.7604, longitude: -95.3698 },
    destinationCoordinates: { latitude: 29.7130, longitude: -95.3990 }, // ~6.5 km
  },
  {
    id: 'JOB-004',
    title: 'HVAC System Repair',
    description: 'Fix heating system in office building lobby',
    status: 'Completed',
    priority: 'MEDIUM',
    technician: 'Lisa Chen',
    time: 'Completed',
    location: '500 Main Street, Houston, TX 77002',
    client: 'Downtown Plaza',
    statusColor: '#00A63E',
    priorityColor: '#894B00',
    date: 'Yesterday',
    startCoordinates: { latitude: 29.7604, longitude: -95.3698 },
    destinationCoordinates: { latitude: 29.7570, longitude: -95.3700 }, // ~0.5 km
  },
  {
    id: 'JOB-005',
    title: 'Security System Installation',
    description: 'Install new security cameras and access control',
    status: 'In Progress',
    priority: 'LOW',
    technician: 'John Smith',
    time: '10:00 (3h est.)',
    location: '800 Commerce St, Houston, TX 77002',
    client: 'SecureBuilding Inc',
    statusColor: '#193CB8',
    priorityColor: '#6B7280',
    date: 'Today',
    startCoordinates: { latitude: 29.7604, longitude: -95.3698 },
    destinationCoordinates: { latitude: 29.7595, longitude: -95.3662 }, // ~0.4 km
  },
];

  const getFilteredJobs = () => {
    if (selectedFilter === 'All') return jobs;
    return jobs.filter(job => job.status === selectedFilter);
  };

  const renderFilterButton = ({item}) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === item && styles.activeFilterButton,
      ]}
      onPress={() => setSelectedFilter(item)}>
      <Text
        style={[
          styles.filterText,
          selectedFilter === item && styles.activeFilterText,
        ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderJobCard = ({item}) => (
    <TouchableOpacity style={styles.jobCard}  >
      <View style={styles.jobHeader}>
        <View style={styles.jobHeaderLeft}>
          <Text style={styles.jobId}>{item.id}</Text>
          <View style={[styles.statusBadge, {backgroundColor: '#E3F2FD'}]}>
            <Text style={[styles.statusText, {color: item.statusColor}]}>
              {item.status}
            </Text>
          </View>
          <View style={[styles.priorityBadge, {backgroundColor: '#ECEEF2'}]}>
            <Text style={[styles.priorityText, {color: item.priorityColor}]}>
              {item.priority}
            </Text>
          </View>
        </View>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>

      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.jobDescription}>{item.description}</Text>

      <View style={styles.jobDetails}>
        <View style={styles.jobDetailRow}>
          <Text style={styles.jobDetailIcon}>
            {' '}
            <Feather name="user" size={18} color={tabColor} />
          </Text>
          <Text style={styles.jobDetailText}>{item.technician}</Text>
        </View>
        <View style={styles.jobDetailRow}>
          <Text style={styles.jobDetailIcon}>
            {' '}
            <FontAwesome name="hospital-o" size={18} color={tabColor} />
          </Text>
          <Text style={styles.jobDetailText}>{item.client}</Text>
        </View>
        <View style={styles.jobDetailRow}>
          <Text style={styles.jobDetailIcon}>
            <Ionicons name="timer-outline" size={18} color={tabColor} />
          </Text>
          <Text style={styles.jobDetailText}>{item.time}</Text>
        </View>
        <View style={styles.jobDetailRow}>
          <Text style={styles.jobDetailIcon}>
            <Feather name="map-pin" size={18} color={tabColor} />
          </Text>
          <Text style={styles.jobDetailText}>{item.location}</Text>
        </View>
      </View>

      <View style={styles.jobActions}>
        <TouchableOpacity style={styles.actionButton}  onPress={() => navigation.navigate('JobDetail', {job: item})}>
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
        {item.status === 'Scheduled' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryActionButton]}>
            <Text
              style={[styles.actionButtonText, styles.primaryActionButtonText]}>
              Start Job
            </Text>
          </TouchableOpacity>
        )}
        {item.status === 'In Progress' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.successActionButton]}>
            <Text
              style={[styles.actionButtonText, styles.successActionButtonText]}>
              Complete Job
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jobs</Text>
        <View style={styles.headerStats}>
          <Text style={styles.statsText}>{getFilteredJobs().length} jobs</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={filters}
          renderItem={renderFilterButton}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {/* Jobs List */}
      <FlatList
        data={getFilteredJobs()}
        renderItem={renderJobCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.jobsList}
        showsVerticalScrollIndicator={false}
      />
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
  headerStats: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statsText: {
    fontSize: 12,
    color: '#155DFC',
    fontWeight: '500',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersList: {
    paddingHorizontal: 20,
  },
  filterButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  activeFilterButton: {
    backgroundColor: '#155DFC',
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  jobsList: {
    padding: 20,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  jobId: {
    fontSize: 13,
    fontWeight: '600',
    color: '#101828',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#101828',
    marginBottom: 6,
  },
  jobDescription: {
    fontSize: 14,
    color: '#4A5565',
    marginBottom: 16,
    lineHeight: 20,
  },
  jobDetails: {
    gap: 8,
    marginBottom: 16,
  },
  jobDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  jobDetailIcon: {
    fontSize: 14,
  },
  jobDetailText: {
    fontSize: 13,
    color: '#4A5565',
    flex: 1,
  },
  jobActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryActionButton: {
    backgroundColor: '#155DFC',
  },
  successActionButton: {
    backgroundColor: '#00A63E',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  primaryActionButtonText: {
    color: '#FFFFFF',
  },
  successActionButtonText: {
    color: '#FFFFFF',
  },
});

export default JobsScreen;
