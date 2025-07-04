import {
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {BaseStyle} from '../constants/Style';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from '../utils';
import {style, spacings} from '../constants/Fonts';
import {
  blackColor,
  blueColor,
  grayColor,
  lightGrayColor,
  whiteColor,
} from '../constants/Color';
import CustomTextInput from '../components/CustomTextInput';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {
  GOOGLE_ICON,
  LOGIN_BACK_IMAGE,
  LOGIN_IMAGE,
  MAIN_LOGO_IMAGE,
} from '../assests/images';
import {
  CREATE_AN_ACCOUNT,
  DONT_HAVE_ACCOUNT,
  FORGOT_PASSWORD,
  LET_CONNECT_WITH_US,
  LOGIN,
  SIGN_IN,
  SIGN_UP,
} from '../constants/Constants';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {
  flex,
  alignItemsCenter,
  alignJustifyCenter,
  resizeModeContain,
  flexDirectionRow,
  justifyContentSpaceBetween,
  textAlign,
} = BaseStyle;

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onPressForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleLogin = async () => {
    let isValid = true;

    // Reset previous errors
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    }

    if (isValid) {
      await AsyncStorage.setItem('isLoggedIn', 'true');
      console.log('Login success:', email, password);
      navigation.navigate('MainTabNavigator');
      // Alert.alert("Login Successful", `Welcome back, ${email}`);
    }
  };

  return (
    <View style={[flex, styles.container]}>
      <ImageBackground
        source={LOGIN_BACK_IMAGE}
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} // covers full screen
        resizeMode="cover">
        <Image
          source={MAIN_LOGO_IMAGE}
          style={{
            width: '100%',
            height: Platform.OS === 'android' ? hp(4.5) : hp(4.5),
            resizeMode: 'contain',
          }}
        />
        <View style={[styles.box]}>
          <Text
            style={[
              styles.title,
              {fontSize: style.fontSizeLarge.fontSize},
              textAlign,
            ]}>
            {SIGN_IN}
          </Text>
          <Text style={[styles.desc, textAlign]}>{LET_CONNECT_WITH_US}</Text>
          <CustomTextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={text => {
              const updatedText = text.charAt(0).toLowerCase() + text.slice(1);
              setEmail(updatedText);
              if (emailError) {
                setEmailError('');
              }
            }}
            label="Email"
            required={true}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          <CustomTextInput
            placeholder="Enter your Password"
            value={password}
            secureTextEntry={!isPasswordVisible}
            onChangeText={text => {
              setPassword(text);
              if (passwordError) {
                setPasswordError('');
              }
            }}
            label="Password"
            rightIcon={
              <TouchableOpacity
                onPress={() => setPasswordVisible(!isPasswordVisible)}>
                <MaterialCommunityIcons
                  name={isPasswordVisible ? 'eye' : 'eye-off'}
                  size={20}
                  color={grayColor}
                />
              </TouchableOpacity>
            }
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
          {/* <View
            style={[
              {
                width: '100%',
                height: hp(3),
                alignItems: 'flex-end',
                marginTop: spacings.large,
              },
            ]}>
            <Text
              style={[styles.title, {fontSize: style.fontSizeMedium.fontSize}]}
              onPress={onPressForgotPassword}>
              {FORGOT_PASSWORD}
            </Text>
          </View> */}
          <View style={{marginTop: Platform.OS === 'android' ? hp(5) : hp(3)}}>
            <CustomButton title={LOGIN} onPress={handleLogin} />
          </View>
          <View style={[flexDirectionRow, alignJustifyCenter]}>
            <Text
              style={[
                styles.title,
                {fontSize: style.fontSizeNormal.fontSize, fontWeight: 0},
                textAlign,
              ]}>
              {DONT_HAVE_ACCOUNT}{' '}
            </Text>
            <Text
              style={[
                styles.title,
                {
                  fontSize: style.fontSizeNormal.fontSize,
                  fontWeight: 0,
                  color: blueColor,
                },
                textAlign,
              ]}
              onPress={() => console.log('Clikded')}>
              {CREATE_AN_ACCOUNT}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {},
  logoBox: {
    width: wp(100),
    height: '30%',
  },
  title: {
    fontSize: style.fontSizeLarge3x.fontSize,
    fontWeight: style.fontWeightMedium.fontWeight,
    color: blackColor,
    marginBottom: 10,
  },
  desc: {
    fontSize: style.fontSizeSmall1x.fontSize,
    fontWeight: style.fontWeightThin.fontWeight,
    color: blackColor,
  },
  box: {
    width: wp(100),
    height: '60%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 60,
    padding: spacings.xxxxLarge,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});
