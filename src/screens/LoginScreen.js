// import {
//   Image,
//   ImageBackground,
//   Platform,
//   Pressable,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useState} from 'react';
// import {BaseStyle} from '../constants/Style';
// import {widthPercentageToDP as wp, heightPercentageToDP as hp} from '../utils';
// import {style, spacings} from '../constants/Fonts';
// import {
//   blackColor,
//   blueColor,
//   grayColor,
//   lightGrayColor,
//   whiteColor,
// } from '../constants/Color';
// import CustomTextInput from '../components/CustomTextInput';
// import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
// import {
//   GOOGLE_ICON,
//   LOGIN_BACK_IMAGE,
//   LOGIN_IMAGE,
//   MAIN_LOGO_IMAGE,
// } from '../assests/images';
// import {
//   CREATE_AN_ACCOUNT,
//   DONT_HAVE_ACCOUNT,
//   FORGOT_PASSWORD,
//   LET_CONNECT_WITH_US,
//   LOGIN,
//   SIGN_IN,
//   SIGN_UP,
// } from '../constants/Constants';
// import CustomButton from '../components/CustomButton';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const {
//   flex,
//   alignItemsCenter,
//   alignJustifyCenter,
//   resizeModeContain,
//   flexDirectionRow,
//   justifyContentSpaceBetween,
//   textAlign,
// } = BaseStyle;

// const LoginScreen = ({navigation}) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [emailError, setEmailError] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [isPasswordVisible, setPasswordVisible] = useState(false);

//   const validateEmail = email => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const onPressForgotPassword = () => {
//     navigation.navigate('ForgotPassword');
//   };

//   const handleLogin = async () => {
//     let isValid = true;

//     // Reset previous errors
//     setEmailError('');
//     setPasswordError('');

//     if (!email.trim()) {
//       setEmailError('Email is required');
//       isValid = false;
//     } else if (!validateEmail(email)) {
//       setEmailError('Please enter a valid email');
//       isValid = false;
//     }

//     if (!password.trim()) {
//       setPasswordError('Password is required');
//       isValid = false;
//     }

//     if (isValid) {
//       await AsyncStorage.setItem('isLoggedIn', 'true');
//       console.log('Login success:', email, password);
//       navigation.navigate('MainTabNavigator');
//       // Alert.alert("Login Successful", `Welcome back, ${email}`);
//     }
//   };

//   return (
//     <View style={[flex, styles.container]}>
//       <ImageBackground
//         source={LOGIN_BACK_IMAGE}
//         style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} // covers full screen
//         resizeMode="cover">
//         <Image
//           source={MAIN_LOGO_IMAGE}
//           style={{
//             width: '100%',
//             height: Platform.OS === 'android' ? hp(4.5) : hp(4.5),
//             resizeMode: 'contain',
//           }}
//         />
//         <View style={[styles.box]}>
//           <Text
//             style={[
//               styles.title,
//               {fontSize: style.fontSizeLarge.fontSize},
//               textAlign,
//             ]}>
//             {SIGN_IN}
//           </Text>
//           <Text style={[styles.desc, textAlign]}>{LET_CONNECT_WITH_US}</Text>
//           <CustomTextInput
//             placeholder="Enter your email"
//             value={email}
//             onChangeText={text => {
//               const updatedText = text.charAt(0).toLowerCase() + text.slice(1);
//               setEmail(updatedText);
//               if (emailError) {
//                 setEmailError('');
//               }
//             }}
//             label="Email"
//             required={true}
//           />
//           {emailError ? (
//             <Text style={styles.errorText}>{emailError}</Text>
//           ) : null}

//           <CustomTextInput
//             placeholder="Enter your Password"
//             value={password}
//             secureTextEntry={!isPasswordVisible}
//             onChangeText={text => {
//               setPassword(text);
//               if (passwordError) {
//                 setPasswordError('');
//               }
//             }}
//             label="Password"
//             rightIcon={
//               <TouchableOpacity
//                 onPress={() => setPasswordVisible(!isPasswordVisible)}>
//                 <MaterialCommunityIcons
//                   name={isPasswordVisible ? 'eye' : 'eye-off'}
//                   size={20}
//                   color={grayColor}
//                 />
//               </TouchableOpacity>
//             }
//           />
//           {passwordError ? (
//             <Text style={styles.errorText}>{passwordError}</Text>
//           ) : null}
//           {/* <View
//             style={[
//               {
//                 width: '100%',
//                 height: hp(3),
//                 alignItems: 'flex-end',
//                 marginTop: spacings.large,
//               },
//             ]}>
//             <Text
//               style={[styles.title, {fontSize: style.fontSizeMedium.fontSize}]}
//               onPress={onPressForgotPassword}>
//               {FORGOT_PASSWORD}
//             </Text>
//           </View> */}
//           <View style={{marginTop: Platform.OS === 'android' ? hp(5) : hp(3)}}>
//             <CustomButton title={LOGIN} onPress={handleLogin} />
//           </View>
//           <View style={[flexDirectionRow, alignJustifyCenter]}>
//             <Text
//               style={[
//                 styles.title,
//                 {fontSize: style.fontSizeNormal.fontSize, fontWeight: 0},
//                 textAlign,
//               ]}>
//               {DONT_HAVE_ACCOUNT}{' '}
//             </Text>
//             <Text
//               style={[
//                 styles.title,
//                 {
//                   fontSize: style.fontSizeNormal.fontSize,
//                   fontWeight: 0,
//                   color: blueColor,
//                 },
//                 textAlign,
//               ]}
//               onPress={() => console.log('Clikded')}>
//               {CREATE_AN_ACCOUNT}
//             </Text>
//           </View>
//         </View>
//       </ImageBackground>
//     </View>
//   );
// };

// export default LoginScreen;

// const styles = StyleSheet.create({
//   container: {},
//   logoBox: {
//     width: wp(100),
//     height: '30%',
//   },
//   title: {
//     fontSize: style.fontSizeLarge3x.fontSize,
//     fontWeight: style.fontWeightMedium.fontWeight,
//     color: blackColor,
//     marginBottom: 10,
//   },
//   desc: {
//     fontSize: style.fontSizeSmall1x.fontSize,
//     fontWeight: style.fontWeightThin.fontWeight,
//     color: blackColor,
//   },
//   box: {
//     width: wp(100),
//     height: '60%',
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     marginTop: 60,
//     padding: spacings.xxxxLarge,
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 12,
//   },
// });


import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  MAIN_LOGO_IMAGE,
} from '../assests/images';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from '../utils';
import {useDispatch} from 'react-redux';
import {setUser} from '../redux/userSlice';
const demoAccounts = [
    {
      title: 'Lead Labor',
      email: 'lead@jdpelectric.com',
      password: 'password123',
      role: 'Lead Labor',
      name: 'Sarah Johnson',
    },
    {
      title: 'Labor',
      email: 'tech@jdpelectric.com',
      password: 'password123',
      role: 'Labor',
      name: 'Mike Wilson',
    },
  ];
const LoginScreen = ({ navigation }) => {
    const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // const { login, demoAccounts } = useAuth();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');


   const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onPressForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleLogin = async () => {
      console.log('Login success:',);

    let isValid = true;
 console.log('Login success888:',);

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
      dispatch(setUser(email));
      // await AsyncStorage.setItem('isLoggedIn', 'true');
      // console.log('Login success:', email, password);
      navigation.navigate('MainTabNavigator');
      // Alert.alert("Login Successful", `Welcome back, ${email}`);
    }
  };
  const fillDemoAccount = (account) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#f8fafc" barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Image
          source={MAIN_LOGO_IMAGE}
          style={{
            width: '100%',
            height: Platform.OS === 'android' ? hp(5.5) : hp(5.5),
            resizeMode: 'contain',
          }}
        />
          {/* <Text style={styles.companyName}>JDP Electrics</Text> */}
          <Text style={styles.subtitle}>Mobile Workforce Management</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Email Input */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Icon name="email" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="your.email@jdpelectric.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          {/* Password Input */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Icon
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          {loginError ? <Text style={styles.errorTextCenter}>{loginError}</Text> : null}


          {/* Sign In Button */}
          <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPasswordContainer}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Demo Accounts Section */}
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>Demo Accounts:</Text>
          {demoAccounts.map((account, index) => (
            <TouchableOpacity
              key={index}
              style={styles.demoAccount}
              onPress={() => fillDemoAccount(account)}
            >
              <View style={styles.demoAccountContent}>
                <Text style={styles.demoAccountTitle}>{account.title}</Text>
                <Text style={styles.demoAccountEmail}>{account.email}</Text>
              </View>
              <Icon name="person" size={24} color="#6B7280" />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2563eb',
    letterSpacing: 2,
    marginBottom: 8,
  },
  companyName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop:20
  },
  formSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#374151',
  },
  eyeIcon: {
    padding: 4,
  },
  signInButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: '#3B82F6',
    fontSize: 16,
  },
  demoSection: {
    marginBottom: 40,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  demoAccount: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.05,
    // shadowRadius: 4,
    // elevation: 2,
  },
  demoAccountContent: {
    flex: 1,
  },
  demoAccountTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  demoAccountEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  errorText: {
  color: '#dc2626', // red-600
  fontSize: 14,
  marginTop: 4,
  marginLeft: 4,
},

errorTextCenter: {
  color: '#dc2626',
  fontSize: 14,
  marginTop: 12,
  textAlign: 'center',
}
});

export default LoginScreen;

