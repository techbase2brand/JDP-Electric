import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import {
  ELECTRICIAN_1_IMAGE,
  ELECTRICIAN_2_IMAGE,
  ELECTRICIAN_3_IMAGE,
} from '../assests/images';
import {BaseStyle} from '../constants/Style';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from '../utils';
import {style, spacings} from '../constants/Fonts';
import {
  blackColor,
  blueColor,
  grayColor,
  greenColor,
  redColor,
  whiteColor,
} from '../constants/Color';
import Octicons from 'react-native-vector-icons/dist/Octicons';
const {flex, alignJustifyCenter, textAlign} = BaseStyle;

const slides = [
  {
    id: '1',
    title: 'Qualified Electricians',
    description: 'Exchange blueprints, progress, and insights without delay.',
    image: ELECTRICIAN_1_IMAGE,
  },
  {
    id: '2',
    title: 'Dedication -Customer Service',
    description: 'Stay on top of every phase from prototype to product launch.',
    image: ELECTRICIAN_2_IMAGE,
  },
  {
    id: '3',
    title: 'Journey Men-Experience & Skill',
    description:
      'Collaborate smarter, resolve issues faster, and build better tech together.',
    image: ELECTRICIAN_3_IMAGE,
  },
];

const OnBoardingScreen = ({navigation}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({index: currentIndex + 1});
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('Login');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  const renderSlide = ({item}) => (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 4,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal:30,
        }}>
        {[1, 2, 3].map((item, index) => (
          <View
            key={index}
            style={{
              color: currentIndex == index ? greenColor : 'red',
              width:currentIndex == index ? wp(8) :wp(2),
              height: hp(1),
              backgroundColor: blueColor,
              borderRadius: 5,
            }} // 1 ka color green, baaki black
          ></View>
        ))}
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.title, textAlign]}>{item.title}</Text>
        <Text style={[styles.description, textAlign]}>{item.description}</Text>
      </View>
    </View>
  );
  return (
    <View style={[styles.container, flex]}>
      <View style={[styles.logoBox]}>
        <Image
          source={slides[currentIndex].image}
          style={{
            width: '100%',
            height: hp(66),
            resizeMode: 'cover',
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            backgroundColor: whiteColor,
          }}
        />
      </View>
      <View style={[styles.box]}>
        <FlatList
          data={slides}
          ref={flatListRef}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          renderItem={renderSlide}
          extraData={currentIndex}
        />
        <View style={styles.bottomButtons}>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skip}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            style={[
              {
                width: wp(10),
                height: wp(10),
                backgroundColor: blueColor,
                borderRadius: 5,
              },
              alignJustifyCenter,
            ]}>
            <Octicons name={'arrow-right'} size={20} color={whiteColor} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: whiteColor,
  },
  logoBox: {
    width: wp(100),
    height: hp(80),
    overflow: 'hidden',
    backgroundColor: whiteColor,
  },
  box: {
    width: wp(100),
    height: hp(27),
    backgroundColor: whiteColor,
    paddingHorizontal: spacings.xxxxLarge,
    position: 'absolute',
    bottom: 0,
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: spacings.xxxxLarge,
    width: wp(80),
    marginHorizontal:20,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000',
  },
  description: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  bottomButtons: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? hp(2) : hp(7),
    width: wp(100),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  skip: {
    fontSize: 16,
    color: blackColor,
  },
});
