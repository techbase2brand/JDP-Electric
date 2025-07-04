import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const jobsData = {
  today: [
    { id: '1', jobId: 'F-209, Bangkok', type: 'Contract' },
    { id: '2', jobId: 'F-209, Bangkok', type: 'Service' },
    { id: '3', jobId: 'F-209, Bangkok', type: 'Contract' },
  ],
  all: [
    { id: '4', jobId: 'F-209, Bangkok', type: 'Service' },
    { id: '5', jobId: 'F-209, Bangkok', type: 'Contract' },
    { id: '6', jobId: 'F-209, Bangkok', type: 'Service' },
    { id: '7', jobId: 'F-209, Bangkok', type: 'Service' },
    { id: '8', jobId: 'F-209, Bangkok', type: 'Contract' },
    { id: '9', jobId: 'F-209, Bangkok', type: 'Service' },
  ],
};

export default function JobsComponent() {
  const [activeTab, setActiveTab] = useState('today');

  const renderJobItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.jobId}>{item.jobId}</Text>
      <Text style={styles.jobType}>{item.type}</Text>
      <TouchableOpacity style={styles.viewBtn}>
        <Text style={styles.viewText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        {['Today Jobs', 'All Jobs']?.map(tab => {
          const key = tab === 'Today Jobs' ? 'today' : 'all';
          const isActive = activeTab === key;
          return (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(key)} style={styles.tab}>
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab}
              </Text>
              {/* <View style={styles.underline} /> */}
               {/* <View style={styles.underline} />} */}
              {isActive && <View style={styles.underline} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Table Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Job Id</Text>
        <Text style={styles.headerText}>Job Type</Text>
        <Text style={styles.headerText}>Task</Text>
      </View>

      {/* Jobs List */}
      <FlatList
        data={jobsData[activeTab]}
        keyExtractor={item => item.id}
        renderItem={renderJobItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  tabs: { flexDirection: 'row', borderBottomColor: '#ccc' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  tabText: { fontSize: 16, color: '#000' },
  activeTabText: { fontWeight: 'bold' },
  underline: {
    marginTop: 6,
    height: 2,
    width: '80%',
    backgroundColor: '#007aff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginTop: 10,
  },
  headerText: { fontWeight: '500', fontSize: 14 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  jobId: { width: '30%', fontSize: 14 },
  jobType: {
    width: '30%',
    fontSize: 14,
    // color: '#007aff',
    // textDecorationLine: 'underline',
  },
  viewBtn: {
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  viewText: { fontSize: 14 },
});
