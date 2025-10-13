// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   StatusBar,
//   Alert,
//   ScrollView,
//   Image,
//   Platform,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {MAIN_LOGO_IMAGE} from '../assests/images';
// import {widthPercentageToDP as wp, heightPercentageToDP as hp} from '../utils';
// import {useDispatch} from 'react-redux';
// import {setUser} from '../redux/userSlice';
// const demoAccounts = [
//   {
//     title: 'Lead Labor',
//     email: 'lead@jdpelectric.com',
//     password: 'password123',
//     role: 'Lead Labor',
//     name: 'Sarah Johnson',
//   },
//   {
//     title: 'Labor',
//     email: 'tech@jdpelectric.com',
//     password: 'password123',
//     role: 'Labor',
//     name: 'Mike Wilson',
//   },
// ];
// const LoginScreen = ({navigation}) => {
//   const dispatch = useDispatch();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   // const { login, demoAccounts } = useAuth();
//   const [emailError, setEmailError] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [loginError, setLoginError] = useState('');

//   const validateEmail = email => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const onPressForgotPassword = () => {
//     navigation.navigate('ForgotPassword');
//   };

//   const handleLogin = async () => {
//     console.log('Login success:');

//     let isValid = true;
//     console.log('Login success888:');

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
//       dispatch(setUser(email));
//       // await AsyncStorage.setItem('isLoggedIn', 'true');
//       // console.log('Login success:', email, password);
//       navigation.navigate('MainTabNavigator');
//       // Alert.alert("Login Successful", `Welcome back, ${email}`);
//     }
//   };
//   const fillDemoAccount = account => {
//     setEmail(account.email);
//     setPassword(account.password);
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor="#f8fafc" barStyle="dark-content" />
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Logo Section */}
//         <View style={styles.logoSection}>
//           <Image
//             source={MAIN_LOGO_IMAGE}
//             style={{
//               width: '100%',
//               height: Platform.OS === 'android' ? hp(5.5) : hp(5.5),
//               resizeMode: 'contain',
//             }}
//           />
//           {/* <Text style={styles.companyName}>JDP Electrics</Text> */}
//           <Text style={styles.subtitle}>Mobile Workforce Management</Text>
//         </View>

//         {/* Form Section */}
//         <View style={styles.formSection}>
//           {/* Email Input */}
//           <Text style={styles.label}>Email</Text>
//           <View style={styles.inputContainer}>
//             <Icon
//               name="email"
//               size={20}
//               color="#9CA3AF"
//               style={styles.inputIcon}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="your.email@jdpelectric.com"
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//           </View>
//           {emailError ? (
//             <Text style={styles.errorText}>{emailError}</Text>
//           ) : null}

//           {/* Password Input */}
//           <Text style={styles.label}>Password</Text>
//           <View style={styles.inputContainer}>
//             <Icon
//               name="lock"
//               size={20}
//               color="#9CA3AF"
//               style={styles.inputIcon}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Enter your password"
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry={!showPassword}
//             />
//             <TouchableOpacity
//               onPress={() => setShowPassword(!showPassword)}
//               style={styles.eyeIcon}>
//               <Icon
//                 name={showPassword ? 'visibility' : 'visibility-off'}
//                 size={20}
//                 color="#9CA3AF"
//               />
//             </TouchableOpacity>
//           </View>
//           {passwordError ? (
//             <Text style={styles.errorText}>{passwordError}</Text>
//           ) : null}
//           {loginError ? (
//             <Text style={styles.errorTextCenter}>{loginError}</Text>
//           ) : null}

//           {/* Sign In Button */}
//           <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
//             <Text style={styles.signInButtonText}>Sign In</Text>
//           </TouchableOpacity>

//           {/* Forgot Password */}
//           <TouchableOpacity
//             onPress={() => navigation.navigate('ForgotPassword')}
//             style={styles.forgotPasswordContainer}>
//             <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Demo Accounts Section */}
//         <View style={styles.demoSection}>
//           <Text style={styles.demoTitle}>Demo Accounts:</Text>
//           {demoAccounts.map((account, index) => (
//             <TouchableOpacity
//               key={index}
//               style={styles.demoAccount}
//               onPress={() => fillDemoAccount(account)}>
//               <View style={styles.demoAccountContent}>
//                 <Text style={styles.demoAccountTitle}>{account.title}</Text>
//                 <Text style={styles.demoAccountEmail}>{account.email}</Text>
//               </View>
//               <Icon name="person" size={24} color="#6B7280" />
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8fafc',
//     paddingHorizontal: 8,
//   },
//   logoSection: {
//     alignItems: 'center',
//     paddingTop: 60,
//     paddingBottom: 40,
//   },
//   logoText: {
//     fontSize: 48,
//     fontWeight: 'bold',
//     color: '#2563eb',
//     letterSpacing: 2,
//     marginBottom: 8,
//   },
//   companyName: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: '#1F2937',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#6B7280',
//     marginTop: 20,
//   },
//   formSection: {
//     backgroundColor: '#ffffff',
//     borderRadius: 16,
//     padding: 24,
//     marginBottom: 24,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#374151',
//     marginBottom: 8,
//     marginTop: 16,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F9FAFB',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   inputIcon: {
//     marginRight: 12,
//   },
//   input: {
//     flex: 1,
//     paddingVertical: 16,
//     fontSize: 16,
//     color: '#374151',
//   },
//   eyeIcon: {
//     padding: 4,
//   },
//   signInButton: {
//     backgroundColor: '#3B82F6',
//     borderRadius: 8,
//     paddingVertical: 16,
//     alignItems: 'center',
//     marginTop: 24,
//   },
//   signInButtonText: {
//     color: '#ffffff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   forgotPasswordContainer: {
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   forgotPasswordText: {
//     color: '#3B82F6',
//     fontSize: 16,
//   },
//   demoSection: {
//     marginBottom: 40,
//   },
//   demoTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#6B7280',
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   demoAccount: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     // shadowColor: '#000',
//     // shadowOffset: {
//     //   width: 0,
//     //   height: 1,
//     // },
//     // shadowOpacity: 0.05,
//     // shadowRadius: 4,
//     // elevation: 2,
//   },
//   demoAccountContent: {
//     flex: 1,
//   },
//   demoAccountTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#374151',
//     marginBottom: 4,
//   },
//   demoAccountEmail: {
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   errorText: {
//     color: '#dc2626', // red-600
//     fontSize: 14,
//     marginTop: 4,
//     marginLeft: 4,
//   },

//   errorTextCenter: {
//     color: '#dc2626',
//     fontSize: 14,
//     marginTop: 12,
//     textAlign: 'center',
//   },
// });

// export default LoginScreen;

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MAIN_LOGO_IMAGE} from '../assests/images';
import {heightPercentageToDP as hp} from '../utils';
import {useDispatch} from 'react-redux';
import {setUser} from '../redux/userSlice';
import {api, LOGIN_URL} from '../config/apiConfig';

const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  console.log('loginErrorloginError>>', loginError, email, password);

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setLoginError('');
    setEmailError('');
    setPasswordError('');
    let isValid = true;
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

    if (!isValid) return;

    // try {
    //   setLoading(true);

    //   const response = await api.post(LOGIN_URL, {email, password});
    //   console.log('response>>>', response.data.data);

    //   if (response?.data?.data?.token) {
    //     const {token, user} = response?.data?.data;

    //     // Dispatch data in redux
    //     dispatch(setUser({user: user || {}, token}));

    //     // AsyncStorage me save karo
    //     // await AsyncStorage.setItem('authToken', token);

    //    navigation.navigate('MainTabNavigator');
    //   }
    // }
    try {
      setLoading(true);
      const response = await api.post(LOGIN_URL, {
        email: email.trim().toLowerCase(),
        password,
        login_by: 'app',
      });
      console.log('response>>>', response.data.data);
      const {token, user, permissions} = response?.data?.data || {};

      if (token) {
        // Redux State
        dispatch(setUser({user: user, permissions: permissions, token}));
        // Navigate
        navigation.navigate('MainTabNavigator');
      } else {
        setLoginError('Invalid credentials');
      }
    } catch (error) {
      console.log('Login Error:', error);

      console.error('Login Error:', error);
      if (error.response?.data?.message) {
        setLoginError(error.response.data.message);
      } else {
        setLoginError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#f8fafc" barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View style={styles.logoSection}>
          <Image
            source={MAIN_LOGO_IMAGE}
            style={{
              width: '100%',
              height: hp(5.5),
              resizeMode: 'contain',
            }}
          />
          <Text style={styles.subtitle}>Mobile Workforce Management</Text>
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Icon
              name="email"
              size={20}
              color="#9CA3AF"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          <Text style={[styles.label, {marginTop: 16}]}>Password</Text>
          <View style={styles.inputContainer}>
            <Icon
              name="lock"
              size={20}
              color="#9CA3AF"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}>
              <Icon
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
          {loginError ? (
            <Text style={styles.errorTextCenter}>{loginError}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.signInButton}
            onPress={handleLogin}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 8},
  logoSection: {alignItems: 'center', paddingTop: 100, paddingBottom: 40},
  subtitle: {fontSize: 16, color: '#6B7280', marginTop: 20},
  formSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    marginTop: 80,
  },
  label: {fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    // marginVertical:10
  },
  inputIcon: {marginRight: 12},
  input: {flex: 1, paddingVertical: 16, fontSize: 16, color: '#374151'},
  eyeIcon: {padding: 4},
  signInButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  signInButtonText: {color: '#fff', fontSize: 18, fontWeight: '600'},
  errorText: {color: '#dc2626', fontSize: 14, marginTop: 4, marginLeft: 0},
  errorTextCenter: {
    color: '#dc2626',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: '#3B82F6',
    fontSize: 16,
  },
});

export default LoginScreen;
