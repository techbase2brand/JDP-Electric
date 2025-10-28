import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BaseStyle} from '../constants/Style';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from '../utils';
import {style, spacings} from '../constants/Fonts';
import {
  blackColor,
  blueColor,
  greenColor,
  lightBlueColor,
  lightShadeBlue,
  orangeColor,
  whiteColor,
  yellowColor,
} from '../constants/Color';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {
  flex,
  alignItemsCenter,
  alignJustifyCenter,
  resizeModeContain,
  flexDirectionRow,
  justifyContentSpaceBetween,
  justifyContentCenter,
  textAlign,
} = BaseStyle;

const JobDetailsScreen = ({navigation, route}) => {
  const {id, status} = route.params;
  const [currentTime, setCurrentTime] = useState(getFormattedTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getFormattedTime());
    }, 1000); // Update every 1 second

    return () => clearInterval(interval); // Cleanup
  }, []);

  function getFormattedTime() {
    return new Date().toLocaleTimeString([], {hour12: false});
  }

  const itemsUsed = [
    {id: '01', item: 'Bolts', qty: '10PC'},
    {id: '02', item: 'Wire', qty: '50M'},
    {id: '03', item: 'Pipe', qty: '90PC'},
  ];

  const teamMembers = [
    {id: '01', name: 'Scott (Lead Manager)', isLead: true},
    {id: '02', name: 'Alan'},
    {id: '03', name: 'Dina'},
    {id: '04', name: 'Scott'},
  ];

  const renderItemUsed = ({item, index}) => (
    <View
      style={[
        styles.tableRow,
        {backgroundColor: index % 2 === 0 ? whiteColor : '#F4FBFF'},
      ]}>
      <Text style={styles.rowText}>{item.id}</Text>
      <Text style={styles.rowText}>{item.item}</Text>
      <Text style={styles.rowText}>{item.qty}</Text>
    </View>
  );

  const renderTeamMember = ({item, index}) => (
    <View
      style={[
        styles.tableRow,
        {backgroundColor: index % 2 === 0 ? whiteColor : '#F4FBFF'},
      ]}>
      <Text style={styles.rowText}>{item.id}</Text>
      <Text style={styles.rowText}>
        {item?.isLead && <Icon name="flag" size={14} color="red" />} {item.name}
      </Text>
    </View>
  );

  return (
    <View style={[flex, styles.container]}>
      <View
        style={[
          styles.headerContainer,
          justifyContentSpaceBetween,
          flexDirectionRow,
          alignItemsCenter,
        ]}>
        <View style={[flexDirectionRow, alignItemsCenter]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-sharp" size={24} color={blackColor} />
          </TouchableOpacity>
          <Text style={[styles.headerText, {marginLeft: spacings.large}]}>
            #{id}
          </Text>
        </View>
        <View style={[flexDirectionRow, alignItemsCenter]}>
          <TouchableOpacity>
            <Ionicons name="stop-circle" size={24} color={blueColor} />
          </TouchableOpacity>
          <Text style={[styles.headerText, {marginLeft: spacings.small}]}>
            {currentTime}
          </Text>
        </View>
      </View>
      <View style={[styles.desContainer, flexDirectionRow]}>
        <View style={[{width: '75%', padding: spacings.large}]}>
          <Text style={[{fontSize: style.fontSizeNormal.fontSize}]}>
            #65 Halsey Road, Encounter Bay, South Australia +61(08) 8298 0185
            Australia 5211
          </Text>
        </View>
        <View
          style={[
            {
              width: '25%',
              paddingHorizontal: spacings.large,
              height: hp(3),
              backgroundColor: yellowColor,
              borderBottomLeftRadius: 10,
            },
            alignJustifyCenter,
          ]}>
          <Text
            style={[
              {fontSize: style.fontSizeNormal.fontSize, color: whiteColor},
            ]}>
            {status}
          </Text>
        </View>
      </View>
      <Text style={[styles.headerText, {marginLeft: spacings.large}]}>
        Items Used
      </Text>
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>Sr No.</Text>
        <Text style={styles.headerText}>Items</Text>
        <Text style={styles.headerText}>Qty</Text>
      </View>
      <View style={{height: itemsUsed.length * 40}}>
        <FlatList
          data={itemsUsed}
          renderItem={renderItemUsed}
          keyExtractor={item => item.id}
          scrollEnabled={false} // scrolling disable taaki parent scroll le
        />
      </View>
      <View style={{margin: 10, marginHorizontal: 20}}>
        <CustomButton title={'⊕ Order More Items'} />
      </View>
      <Text style={[styles.headerText, {marginLeft: spacings.large}]}>
        Team
      </Text>
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>Sr No.</Text>
        <Text style={styles.headerText}>Name</Text>
      </View>
      <FlatList
        data={teamMembers}
        renderItem={renderTeamMember}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default JobDetailsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: whiteColor,
    // padding: spacings.large
  },
  headerContainer: {
    width: '100%',
    height: hp(5),
    padding: spacings.large,
  },
  headerText: {
    fontSize: style.fontSizeMedium.fontSize,
    fontWeight: style.fontWeightMedium.fontWeight,
  },
  desContainer: {
    backgroundColor: '#f4fffb',
    // width: "95%",
    // height: hp(10),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: lightShadeBlue,
    margin: 10,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F4FBFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    // borderBottomWidth: 0.5,
    // borderColor: '#e0e0e0',
  },
});
