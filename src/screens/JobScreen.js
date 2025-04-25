import React, { useEffect, useState } from 'react'
import { FlatList, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { BaseStyle } from '../constants/Style';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { style, spacings } from '../constants/Fonts';
import { blackColor, greenColor, orangeColor, whiteColor, yellowColor } from '../constants/Color';
import Header from '../components/Header';

const { flex, alignItemsCenter, alignJustifyCenter, resizeModeContain, flexDirectionRow, justifyContentSpaceBetween, justifyContentCenter, textAlign } = BaseStyle;

const JobScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('All');
  const [currentTime, setCurrentTime] = useState(getFormattedTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getFormattedTime());
    }, 1000); // Update every 1 second

    return () => clearInterval(interval); // Cleanup
  }, []);

  function getFormattedTime() {
    return new Date().toLocaleTimeString([], { hour12: false });
  }
  const jobData = [
    { id: '1001', siteName: 'Alberta. 110...', status: 'Pending' },
    { id: '1002', siteName: 'Alberta. 110...', status: 'Complete' },
    { id: '1003', siteName: 'Alberta. 110...', status: 'Ongoing', time: '11:02:08' },
    { id: '1004', siteName: 'Alberta. 110...', status: 'Pending' },
    { id: '1005', siteName: 'Alberta. 110...', status: 'Complete' },
    { id: '1006', siteName: 'Alberta. 110...', status: 'Complete' },
    { id: '1007', siteName: 'Alberta. 110...', status: 'Complete' },
    { id: '1008', siteName: 'Alberta. 110...', status: 'Complete' },
    { id: '1009', siteName: 'Alberta. 110...', status: 'Pending' },
    { id: '10010', siteName: 'Alberta. 110...', status: 'Complete' },
  ];

  const renderJobItem = ({ item, index }) => {
    const isOngoing = item.status === 'Ongoing';
    // Background color logic
    let backgroundColor = '';
    if (isOngoing) {
      backgroundColor = yellowColor;
    } else {
      backgroundColor = index % 2 === 0 ? whiteColor : '#F4FBFF';
    }
    return (
      <Pressable
        style={[styles.row, { backgroundColor }]}
        onPress={() => navigation.navigate("JobDetailsScreen", {
          id: item.id,
          status: item.status,
          // time: item?.time
        })}>
        <Text style={[flex, justifyContentCenter, { paddingLeft: spacings.xxxLarge }]}>#{item.id}</Text>
        <Text style={[flex, justifyContentCenter]}>{item.siteName}</Text>
        <View style={[flex, justifyContentCenter]}>
          {isOngoing ? (
            <Text style={styles.ongoingText}>
              {/* Ongoing {item.time} */}
              Ongoing {currentTime}
            </Text>
          ) : (
            <View style={[
              styles.statusBadge,
              item.status === 'Pending' && styles.pending,
              item.status === 'Complete' && styles.complete,
            ]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  const filteredJobs = jobData.filter(item =>
    selectedTab === 'All' ? true : item.status === selectedTab
  );

  return (
    <View style={[flex, { backgroundColor: whiteColor }]}>
      <Header showProfile={false} scanner={true} />
      <View style={[styles.container]}>
        {/* <View style={[styles.tabContainer, flexDirectionRow, justifyContentSpaceBetween]}> */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.tabContainer, flexDirectionRow, justifyContentSpaceBetween, { paddingHorizontal: 10 }]}
        >
          {['All', 'Complete', 'Ongoing', 'Pending'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                selectedTab === tab && styles.activeTab
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTabText
                ]}
              >
                {tab} Jobs
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[flexDirectionRow, alignItemsCenter, styles.headerRow]}>
          <Text style={[flex, justifyContentCenter, { paddingHorizontal: spacings.xxxLarge }]}>ID No.</Text>
          <Text style={[flex, justifyContentCenter]}>Site Name</Text>
          <Text style={[flex, justifyContentCenter]}>Status</Text>
        </View>
        {/* Job List */}
        <FlatList
          data={filteredJobs}
          renderItem={renderJobItem}
          keyExtractor={(item, index) => item.id + index}
          style={{ height: hp(60.5) }}
          showsVerticalScrollIndicator={false}
        />
      </View>

    </View>
  )
}

export default JobScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: whiteColor,
    paddingVertical: spacings.large
  },
  tabContainer: {
    marginBottom: spacings.xLarge,
    paddingHorizontal: spacings.large,
  },
  tab: {
    paddingHorizontal: spacings.xLarge,
    paddingVertical: spacings.medium,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: blackColor,
    marginRight: spacings.xLarge
  },
  activeTab: {
    backgroundColor: blackColor
  },
  tabText: {
    color: blackColor
  },
  activeTabText: {
    color: whiteColor
  },
  row: {
    flexDirection: 'row',
    paddingVertical: spacings.large,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  headerRow: {
    width: wp(100),
    height: hp(4.5),
    backgroundColor: '#F4FBFF',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: spacings.xLarge,
    borderRadius: 10,
    alignSelf: 'flex-start'
  },
  pending: {
    backgroundColor: orangeColor
  },
  complete: {
    backgroundColor: greenColor
  },
  statusText: {
    color: whiteColor,
    fontSize: style.fontSizeNormal.fontSize
  },
  ongoingRow: {
    backgroundColor: yellowColor
  },
  ongoingText: {
    color: blackColor,
    fontSize: style.fontSizeNormal.fontSize,
  }
})