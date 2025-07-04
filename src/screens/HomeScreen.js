import React, {useState} from 'react';
import {
  FlatList,
  Image,
  Platform,
  Pressable,
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
  darkYellowColor,
  grayColor,
  lightGrayColor,
  pinkColor,
  simpleBlueColor,
  whiteColor,
} from '../constants/Color';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import JobsComponent from '../components/JobsComponent';

const {
  flex,
  alignItemsCenter,
  alignJustifyCenter,
  resizeModeContain,
  flexDirectionRow,
  justifyContentSpaceBetween,
  textAlign,
} = BaseStyle;

const HomeScreen = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const carousalData = [
    {
      image:
        'https://media.istockphoto.com/id/969234244/photo/woman-setting-up-for-party.jpg?s=612x612&w=0&k=20&c=mV12VC4FKrq5gulXjPbkjvOEOaqOFCkECQJYScPKids=',
    },
    {
      image:
        'https://media.istockphoto.com/id/1497057589/photo/creative-entrepreneur-having-an-idea-and-holding-a-light-bulb.jpg?b=1&s=612x612&w=0&k=20&c=tPJcfeImyE3-ecBiQV6TyI1PBUnMfg7qTux6TcqA_hs=',
    },
    {
      image:
        'https://as1.ftcdn.net/jpg/03/88/20/98/1000_F_388209813_cXAsdSN74mPz0QKlQvATgSMO09vjZiS1.jpg',
    },
  ];

  const dashboardCards = [
    {
      id: '1',
      title: 'Total Hours',
      subtitle: 'This Week',
      value: '40',
      bgColor: blueColor,
      icon: <Feather name="clock" size={24} color={whiteColor} />,
    },
    {
      id: '2',
      title: 'Ongoing Jobs',
      subtitle: '',
      value: '30',
      bgColor: darkYellowColor,
      icon:<MaterialIcons
      name="directions-walk"
      size={30}
      color={whiteColor}
      style={{transform: [{scaleX: -1}]}}
    />
      // icon: <Ionicons name="briefcase" size={24} color={whiteColor} />,
    },
    {
      id: '3',
      title: 'Pending Jobs',
      subtitle: '',
      value: '10',
      bgColor: pinkColor,
      icon: (
        <MaterialCommunityIcons
          name="clock-time-eight-outline"
          size={24}
          color={whiteColor}
        />
      ),
    },
    {
      id: '4',
      title: 'Completed Jobs',
      subtitle: '',
      value: '5',
      bgColor: simpleBlueColor,
      icon: (
        <View
          style={{
            flexDirection: 'row',
            gap: 5,
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <Ionicons name="briefcase" size={24} color={whiteColor} />
        </View>
      ),
    },
  ];

  const carousalRenderItem = ({item}) => (
    <View
      style={[
        alignJustifyCenter,
        {marginTop: spacings.xxLarge, marginBottom: spacings.Large1x},
      ]}>
      <Image source={{uri: item.image}} style={styles.image} />
    </View>
  );

  const renderItem = ({item}) => (
    <View style={[styles.card, {backgroundColor: item.bgColor}]}>
      <View>
        <Text style={styles.title}>{item.title} </Text>
        <Text style={[styles.title, {fontWeight: 0}]}>{item.subtitle}</Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.value}>{item.value}</Text>
        <View style={styles.icon}>{item.icon}</View>
      </View>
    </View>
  );

  return (
    <View style={[flex, {backgroundColor: whiteColor}]}>
      <Header showProfile={true} />
      <View style={[styles.container]}>
        {/* Carousel Component */}
        {/* FlatList for Dashboard Cards */}
        <FlatList
          data={dashboardCards}
          renderItem={renderItem}
          keyExtractor={item => item?.id}
          numColumns={2}
          scrollEnabled={false}
        />
      </View>
        <JobsComponent/>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: whiteColor,
    padding: spacings.large,
  },
  card: {
    width: wp(45),
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: wp(4),
    height: hp(13),
    margin: 5,
  },
  title: {
    color: whiteColor,
    fontSize: style.fontSizeNormal2x.fontSize,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: style.fontSizeMedium.fontSize,
    fontWeight: 'normal',
  },
  value: {
    fontSize: wp(7),
    fontWeight: 'bold',
    color: whiteColor,
  },
  icon: {
    // position: 'absolute',
    // bottom: wp(3),
    // right: wp(3),
  },
  image: {
    width: wp(92),
    height: hp(20),
    borderRadius: 10,
    resizeMode: 'cover',
    marginRight: spacings.xxLarge,
  },
});
