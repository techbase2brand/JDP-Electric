// import React, {useRef, useState} from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Platform,
// } from 'react-native';
// import {
//   ELECTRICIAN_1_IMAGE,
//   ELECTRICIAN_2_IMAGE,
//   ELECTRICIAN_3_IMAGE,
// } from '../assests/images';
// import {BaseStyle} from '../constants/Style';
// import {widthPercentageToDP as wp, heightPercentageToDP as hp} from '../utils';
// import {style, spacings} from '../constants/Fonts';
// import {
//   blackColor,
//   blueColor,
//   grayColor,
//   greenColor,
//   redColor,
//   whiteColor,
// } from '../constants/Color';
// import Octicons from 'react-native-vector-icons/dist/Octicons';
// const {flex, alignJustifyCenter, textAlign} = BaseStyle;

// const slides = [
//   {
//     id: '1',
//     title: 'Qualified Electricians',
//     description: 'Exchange blueprints, progress, and insights without delay.',
//     image: ELECTRICIAN_1_IMAGE,
//   },
//   {
//     id: '2',
//     title: 'Dedication -Customer Service',
//     description: 'Stay on top of every phase from prototype to product launch.',
//     image: ELECTRICIAN_2_IMAGE,
//   },
//   {
//     id: '3',
//     title: 'Journey Men-Experience & Skill',
//     description:
//       'Collaborate smarter, resolve issues faster, and build better tech together.',
//     image: ELECTRICIAN_3_IMAGE,
//   },
// ];

// const OnBoardingScreen = ({navigation}) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const flatListRef = useRef();

//   const handleNext = () => {
//     if (currentIndex < slides.length - 1) {
//       flatListRef.current.scrollToIndex({index: currentIndex + 1});
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       navigation.navigate('Login');
//     }
//   };

//   const handleSkip = () => {
//     navigation.navigate('Login');
//   };

//   const renderSlide = ({item}) => (
//     <View>
//       <View
//         style={{
//           display: 'flex',
//           flexDirection: 'row',
//           gap: 4,
//           justifyContent: 'center',
//           alignItems: 'center',
//           paddingHorizontal:30,
//         }}>
//         {[1, 2, 3].map((item, index) => (
//           <View
//             key={index}
//             style={{
//               color: currentIndex == index ? greenColor : 'red',
//               width:currentIndex == index ? wp(8) :wp(2),
//               height: hp(1),
//               backgroundColor: blueColor,
//               borderRadius: 5,
//             }} // 1 ka color green, baaki black
//           ></View>
//         ))}
//       </View>

//       <View style={styles.textContainer}>
//         <Text style={[styles.title, textAlign]}>{item.title}</Text>
//         <Text style={[styles.description, textAlign]}>{item.description}</Text>
//       </View>
//     </View>
//   );
//   return (
//     <View style={[styles.container, flex]}>
//       <View style={[styles.logoBox]}>
//         <Image
//           source={slides[currentIndex].image}
//           style={{
//             width: '100%',
//             height: hp(66),
//             resizeMode: 'cover',
//             borderBottomLeftRadius: 30,
//             borderBottomRightRadius: 30,
//             backgroundColor: whiteColor,
//           }}
//         />
//       </View>
//       <View style={[styles.box]}>
//         <FlatList
//           data={slides}
//           ref={flatListRef}
//           keyExtractor={item => item.id}
//           horizontal
//           pagingEnabled
//           scrollEnabled={false}
//           showsHorizontalScrollIndicator={false}
//           renderItem={renderSlide}
//           extraData={currentIndex}
//         />
//         <View style={styles.bottomButtons}>
//           <TouchableOpacity onPress={handleSkip}>
//             <Text style={styles.skip}>Skip</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={handleNext}
//             style={[
//               {
//                 width: wp(10),
//                 height: wp(10),
//                 backgroundColor: blueColor,
//                 borderRadius: 5,
//               },
//               alignJustifyCenter,
//             ]}>
//             <Octicons name={'arrow-right'} size={20} color={whiteColor} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default OnBoardingScreen;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: whiteColor,
//   },
//   logoBox: {
//     width: wp(100),
//     height: hp(80),
//     overflow: 'hidden',
//     backgroundColor: whiteColor,
//   },
//   box: {
//     width: wp(100),
//     height: hp(27),
//     backgroundColor: whiteColor,
//     paddingHorizontal: spacings.xxxxLarge,
//     position: 'absolute',
//     bottom: 0,
//   },
//   textContainer: {
//     alignItems: 'center',
//     marginVertical: spacings.xxxxLarge,
//     width: wp(80),
//     marginHorizontal:20,
//   },
//   title: {
//     fontSize: 15,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//     color: '#000',
//   },
//   description: {
//     fontSize: 12,
//     color: '#555',
//     textAlign: 'center',
//   },
//   bottomButtons: {
//     position: 'absolute',
//     bottom: Platform.OS === 'android' ? hp(2) : hp(7),
//     width: wp(100),
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 30,
//   },
//   skip: {
//     fontSize: 16,
//     color: blackColor,
//   },
// });

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  ELECTRICIAN_1_IMAGE,
  ELECTRICIAN_2_IMAGE,
  ELECTRICIAN_3_IMAGE,
} from '../assests/images';

const {width} = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Smart Job Management',
    description:
      'Efficiently manage and track all your electrical jobs in one place. View assignments, update status, and stay organized with our intelligent system.',
    color: '#8B5CF6',
    image: ELECTRICIAN_1_IMAGE,
  },
  {
    id: 2,
    title: 'Precise Time Tracking',
    description:
      'Track your work hours with precision using GPS-enabled timers. Start, pause, and complete job timers with automatic location verification.',
    color: '#10B981',
    image: ELECTRICIAN_2_IMAGE,
  },
  {
    id: 3,
    title: 'Team Collaboration',
    description:
      'Collaborate seamlessly with your team members, share job updates, and communicate effectively through integrated messaging.',
    color: '#06B6D4',
    image: ELECTRICIAN_3_IMAGE,
  },
  // {
  //   id: 4,
  //   title: 'Real-time Reports',
  //   description: 'Generate comprehensive reports instantly. Track performance, analyze productivity, and make data-driven decisions.',
  //   color: '#F59E0B',
  // },
  // {
  //   id: 5,
  //   title: 'Mobile Workforce',
  //   description: 'Access everything you need from anywhere. Complete job management, time tracking, and reporting on the go.',
  //   color: '#EF4444',
  // },
];

const OnBoardingScreen = ({navigation}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  const currentData = onboardingData[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setCurrentIndex(Math.max(0, currentIndex - 1))}>
          {/* <Text style={styles.backText}>Back</Text> */}
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Indicators */}
      <View style={styles.progressContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              {
                backgroundColor:
                  index === currentIndex ? currentData.color : '#E5E7EB',
                width: index === currentIndex ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Image
          source={currentData?.image}
          style={{
            width: '100%',
            height: '50%',
            resizeMode: 'cover',
          }}
        />
        {/* <View style={[styles.illustration, { backgroundColor: currentData.color + '40' }]}>
          <View style={[styles.circle, { backgroundColor: currentData.color }]} />
        </View> */}

        <Text style={styles.title}>{currentData.title}</Text>
        <Text style={styles.description}>{currentData.description}</Text>
      </View>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <LinearGradient
          colors={[currentData.color, currentData.color + 'CC']}
          style={styles.nextButton}>
          <TouchableOpacity onPress={handleNext} style={styles.nextButtonInner}>
            <Text style={styles.nextButtonText}>
              {currentIndex === onboardingData.length - 1
                ? 'Get Started ⚡'
                : 'Next'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backText: {
    fontSize: 16,
    color: '#6B7280',
  },
  skipText: {
    fontSize: 16,
    color: '#6B7280',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    gap: 8,
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
    transition: 'all 0.3s ease',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  illustration: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginVertical: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  nextButtonInner: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OnBoardingScreen;
