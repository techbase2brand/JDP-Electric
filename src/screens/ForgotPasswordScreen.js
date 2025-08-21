// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
//   ImageBackground,
//   Image,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import OTPTextInput from 'react-native-otp-textinput';
// import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
// import CustomButton from '../components/CustomButton';
// import CustomTextInput from '../components/CustomTextInput';
// import {BaseStyle} from '../constants/Style';
// import {widthPercentageToDP as wp, heightPercentageToDP as hp} from '../utils';
// import {style, spacings} from '../constants/Fonts';
// import {
//   blackColor,
//   blueColor,
//   grayColor,
//   lightOrangeColor,
//   mediumGray,
//   redColor,
//   whiteColor,
// } from '../constants/Color';
// import SuccessModal from '../components/modal/SuccessModal';
// import {
//   EMAIL_NOT_RECEIVED,
//   ENTER_FOUR_DIGIT_CODE,
//   ENTER_FOUR_DIGIT_CODE_THAT_YOU_RECEIVED,
//   ENTER_YOU_EMAIL,
//   FORGOT_PASSWORD,
//   PASSWORD,
//   RESEND_CODE,
//   RESET_PASSWORD,
//   SET_THE_NEW_PASSWORD,
// } from '../constants/Constants';
// import {FORGOT_PASSWORD_ELLIPSE_IMAGE} from '../assests/images';
// const {
//   flex,
//   alignItemsCenter,
//   flexDirectionRow,
//   alignJustifyCenter,
//   positionAbsolute,
//   borderRadius5,
//   borderWidth1,
//   textAlign,
// } = BaseStyle;

// const ForgotPasswordScreen = ({navigation}) => {
//   const [email, setEmail] = useState('');
//   const [emailError, setEmailError] = useState('');
//   const [otp, setOtp] = useState('');
//   const [otpError, setOtpError] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [confirmPasswordError, setConfirmPasswordError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [currentStep, setCurrentStep] = useState('email');
//   const [successModalVisible, setSuccessModalVisible] = useState(false);
//   const [countdown, setCountdown] = useState(0); // Countdown state
//   const [isResendEnabled, setIsResendEnabled] = useState(true);
//   const [loadingEmail, setLoadingEmail] = useState(false);
//   const [loadingOtp, setLoadingOtp] = useState(false);
//   const [loadingPassword, setLoadingPassword] = useState(false);

//   // Timer effect
//   useEffect(() => {
//     let timer;
//     if (countdown > 0) {
//       timer = setInterval(() => {
//         setCountdown(prevCountdown => prevCountdown - 1);
//       }, 1000);
//     } else {
//       clearInterval(timer);
//       setIsResendEnabled(true); // Enable resend button after timer ends
//     }

//     return () => clearInterval(timer); // Cleanup interval
//   }, [countdown]);

//   const handleOTPChange = otp => {
//     setOtp(otp);
//     // setIsOtpComplete(otp.length === 6);
//   };

//   const toggleShowPassword = () => {
//     setShowPassword(!showPassword);
//   };

//   const toggleShowConfirmPassword = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   // Handle PressResend
//   const handlePressResend = async () => {
//     if (countdown === 0) {
//       setIsResendEnabled(false);
//       await handleResendOTP();
//     }
//   };

//   // Handle ResendOTP
//   const handleResendOTP = async () => {
//     setOtpError('');

//     if (!email) {
//       setOtpError('Email is required to resend OTP');
//       return;
//     }
//   };

//   // Handle Email Submit
//   const handleEmailSubmit = async () => {
//     setEmailError('');
//     setLoadingEmail(true);

//     if (!email) {
//       setEmailError('Email is required');
//       setLoadingEmail(false);
//       return;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       setEmailError('Please enter a valid email address');
//       setLoadingEmail(false);
//       return;
//     }

//     setCurrentStep('otp');
//   };

//   // Handle OTP Submit
//   const handleOTPSubmit = async () => {
//     setOtpError('');
//     setLoadingOtp(true);

//     if (!otp) {
//       setOtpError('OTP is required');
//       setLoadingOtp(false);
//       return;
//     }

//     if (otp.length !== 4 || !/^\d{4}$/.test(otp)) {
//       setOtpError('Please enter a valid 4-digit OTP');
//       setLoadingOtp(false);
//       return;
//     }
//     setCurrentStep('password');
//   };

//   // Handle Password Submit
//   const handlePasswordSubmit = async () => {
//     setPasswordError('');
//     setConfirmPasswordError('');
//     setLoadingPassword(true);

//     if (!password && !confirmPassword) {
//       setPasswordError('Password is required');
//       setConfirmPasswordError('Confirm Password is required');
//       setLoadingPassword(false);
//       return;
//     }

//     if (!password) {
//       setPasswordError('Password is required');
//       setLoadingPassword(false);
//       return;
//     }

//     if (password.length < 8) {
//       setPasswordError('Password must be at least 8 characters long');
//       setLoadingPassword(false);
//       return;
//     }

//     if (!confirmPassword) {
//       setConfirmPasswordError('Confirm Password is required');
//       setLoadingPassword(false);
//       return;
//     }

//     if (password !== confirmPassword) {
//       setConfirmPasswordError('Passwords do not match');
//       setLoadingPassword(false);
//       return;
//     }
//     setSuccessModalVisible(true);
//   };

//   return (
//     <KeyboardAvoidingView
//       style={[flex]}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//       <View
//         style={{
//           position: 'absolute',
//           top: 0,
//           width: wp(100),
//           height: hp(25),
//           zIndex: 999,
//         }}
//         pointerEvents="none">
//         <Image
//           source={FORGOT_PASSWORD_ELLIPSE_IMAGE}
//           style={{
//             width: '100%',
//             height: '100%',
//             resizeMode: 'cover',
//           }}
//         />
//       </View>
//       <View style={[styles.container, {backgroundColor: whiteColor}]}>
//         <View
//           style={{
//             position: 'absolute',
//             top: 0,
//             width: wp(100),
//             height: hp(25),
//             zIndex: 999,
//           }}
//           pointerEvents="none">
//           <Image
//             source={FORGOT_PASSWORD_ELLIPSE_IMAGE}
//             style={{
//               width: '100%',
//               height: '100%',
//               resizeMode: 'cover',
//             }}
//           />
//         </View>
//         <View
//           style={[
//             {width: '100%', height: hp(5)},
//             flexDirectionRow,
//             alignItemsCenter,
//           ]}>
//           <TouchableOpacity
//             style={[styles.backIcon, alignItemsCenter]}
//             onPress={() => {
//               if (currentStep === 'email') {
//                 navigation.goBack();
//               } else if (currentStep === 'otp') {
//                 setCurrentStep('email');
//               } else if (currentStep === 'password') {
//                 setCurrentStep('otp');
//               }
//             }}>
//             <Ionicons name={'arrow-back'} size={33} color={blackColor} />
//           </TouchableOpacity>
//         </View>

//         {currentStep === 'email' && (
//           <View style={styles.box}>
//             <Text style={[styles.text, textAlign]}>{FORGOT_PASSWORD}</Text>
//             <Text style={[styles.destext, textAlign]}>{ENTER_YOU_EMAIL}</Text>
//             <CustomTextInput
//               label={'Email'}
//               placeholder={'Enter your email'}
//               value={email}
//               onChangeText={text => {
//                 const updatedText =
//                   text.charAt(0).toLowerCase() + text.slice(1);
//                 setEmail(updatedText);
//                 if (emailError) {
//                   setEmailError('');
//                 }
//               }}
//               keyboardType="email-address"
//               required={true}
//             />
//             {emailError && <Text style={styles.error}>{emailError}</Text>}
//             <View style={{marginVertical: hp(5)}}>
//               <CustomButton
//                 title="Send OTP"
//                 onPress={handleEmailSubmit}
//                 loading={loadingEmail}
//                 disabled={loadingEmail}
//               />
//             </View>
//           </View>
//         )}

//         {currentStep === 'otp' && (
//           <View style={styles.box}>
//             <Text style={[styles.text, textAlign]}>
//               {ENTER_FOUR_DIGIT_CODE}
//             </Text>
//             <Text style={[styles.destext, textAlign]}>
//               {ENTER_FOUR_DIGIT_CODE_THAT_YOU_RECEIVED}({email})
//             </Text>
//             <View style={[{width: '100%', height: hp(15)}, alignJustifyCenter]}>
//               <OTPTextInput
//                 handleTextChange={handleOTPChange}
//                 inputCount={4}
//                 tintColor={blackColor}
//                 offTintColor={mediumGray}
//                 textInputStyle={[styles.otpInput, {color: blackColor}]}
//               />
//               {otpError && <Text style={styles.error}>{otpError}</Text>}
//             </View>

//             {countdown > 0 ? (
//               <Text style={[styles.footerText, textAlign]}>
//                 {' '}
//                 Resend OTP in {countdown}s
//               </Text>
//             ) : (
//               <Text style={[styles.footerText, textAlign]}>
//                 {EMAIL_NOT_RECEIVED}
//                 <Text
//                   style={styles.loginText}
//                   onPress={handlePressResend}
//                   disabled={!isResendEnabled}>
//                   {RESEND_CODE}
//                 </Text>
//               </Text>
//             )}
//             <View style={{marginVertical: hp(5)}}>
//               <CustomButton
//                 title="Continue"
//                 onPress={handleOTPSubmit}
//                 loading={loadingOtp}
//                 disabled={loadingOtp}
//               />
//             </View>
//           </View>
//         )}

//         {currentStep === 'password' && (
//           <View style={styles.box}>
//             <Text style={[styles.text, textAlign]}>{RESET_PASSWORD}</Text>
//             <Text style={[styles.destext, textAlign]}>
//               {SET_THE_NEW_PASSWORD}
//             </Text>
//             <CustomTextInput
//               label={PASSWORD}
//               placeholder={PASSWORD}
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry={!showPassword}
//               required={true}
//               rightIcon={
//                 <MaterialCommunityIcons
//                   name={showPassword ? 'eye' : 'eye-off'}
//                   size={20}
//                   color={grayColor}
//                   onPress={toggleShowPassword}
//                 />
//               }
//             />
//             {passwordError && <Text style={styles.error}>{passwordError}</Text>}
//             <CustomTextInput
//               label="Confirm Password"
//               placeholder="Confirm Password"
//               value={confirmPassword}
//               onChangeText={text => {
//                 setConfirmPassword(text);
//                 if (passwordError) {
//                   setPasswordError('');
//                 }
//               }}
//               secureTextEntry={!showConfirmPassword}
//               required={true}
//               rightIcon={
//                 <MaterialCommunityIcons
//                   name={showConfirmPassword ? 'eye' : 'eye-off'}
//                   size={20}
//                   color={grayColor}
//                   onPress={toggleShowConfirmPassword}
//                 />
//               }
//             />
//             {confirmPasswordError && (
//               <Text style={styles.error}>{confirmPasswordError}</Text>
//             )}
//             <View style={{marginVertical: hp(5)}}>
//               <CustomButton
//                 title="Continue"
//                 onPress={handlePasswordSubmit}
//                 loading={loadingPassword}
//                 disabled={loadingPassword}
//               />
//             </View>
//           </View>
//         )}

//         {successModalVisible && (
//           <SuccessModal
//             visible={successModalVisible}
//             onClose={() => setSuccessModalVisible(false)}
//             headingText={'Password Changed!'}
//             text={'You can now use your new password to login to your account.'}
//             buttonText={'Okay'}
//             onPressContinue={() => {
//               setSuccessModalVisible(false), navigation.goBack();
//             }}
//           />
//         )}
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// export default ForgotPasswordScreen;

// const styles = StyleSheet.create({
//   container: {
//     padding: spacings.large,
//     backgroundColor: whiteColor,
//   },
//   box: {
//     width: '100%',
//     height: hp(100),
//     padding: spacings.large,
//   },
//   backIcon: {
//     width: wp(10),
//     height: hp(5),
//   },
//   text: {
//     fontSize: 25,
//     fontWeight: '600',
//     color: blackColor,
//   },
//   destext: {
//     color: grayColor,
//     paddingVertical: spacings.small2x,
//     fontSize: 14,
//   },
//   otpInput: {
//     borderWidth: 1,
//     fontSize: 20,
//     color: blackColor,
//     borderRadius: 5,
//     width: '14%',
//   },
//   error: {
//     color: 'red',
//     fontSize: 12,
//     marginTop: 4,
//   },
//   footerText: {
//     marginTop: spacings.Large1x,
//     color: blackColor,
//     fontSize: style.fontSizeNormal.fontSize,
//   },
//   loginText: {
//     fontSize: style.fontSizeNormal.fontSize,
//     color: blueColor,
//     fontWeight: style.fontWeightThin1x.fontWeight,
//   },
// });
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {MAIN_LOGO_IMAGE} from '../assests/images';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from '../utils';


// Embedded Colors
const Colors = {
  primary: '#3B82F6',
  primaryLight: '#EBF4FF',
  white: '#FFFFFF',
  backgroundLight: '#F8FAFC',
  text: '#1E293B',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  border: '#E2E8F0',
  success: '#10B981',
  successLight: '#D1FAE5',
};

// Embedded Spacing and Dimensions
const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const BorderRadius = {
  md: 8,
  lg: 12,
  xl: 16,
};

// Embedded Toast Functions
const showErrorToast = (title, message) => {
  Alert.alert(title, message);
};

const showSuccessToast = (title, message) => {
  Alert.alert(title, message);
};

const ForgotPasswordScreen = ({onSubmit, onBack, loading, navigation}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  }, []);

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    if (!email.trim()) {
      showErrorToast('Validation Error', 'Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      showErrorToast('Validation Error', 'Please enter a valid email address');
      return;
    }

    // setIsSubmitted(true);
    showSuccessToast(
      'Reset Link Sent',
      'If an account exists with this email, you will receive password reset instructions.',
    );
    // onSubmit(email);
    navigation.navigate('ResetPasswordScreen');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color={Colors.text} />
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => (
    <View style={styles.content}>
      <View style={styles.iconContainer}>
        <Image
          source={MAIN_LOGO_IMAGE}
          style={{
            width: '100%',
            height: Platform.OS === 'android' ? hp(7) : hp(7),
            resizeMode: 'contain',
          }}
        />
      </View>

      <Text style={styles.title}>
        {isSubmitted ? 'Check Your Email' : 'Reset Password?'}
      </Text>

      <Text style={styles.subtitle}>
       
      Enter your email to receive a reset code
      </Text>

      {!isSubmitted && (
        <>
          {/* <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!loading}
            />
          </View> */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, {marginBottom: 10}]}>Email</Text>
            <View style={styles.inputContainer}>
              <Icon
                name="email"
                size={20}
                color="#9CA3AF"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}>
            <Text style={styles.submitButtonText}>
              {loading ? 'Sending...' : 'Send Reset Code'}
            </Text>
            {/* <Icon name="send" size={20} cols.white} /> */}
          </TouchableOpacity>
           <TouchableOpacity style={[styles.submitButton, {marginTop:10, backgroundColor:"#ffff"}]} onPress={()=>navigation.goBack()}>
            <Text style={[styles.primaryButtonText,{color:"#000"}]}>Back to Login</Text>
          </TouchableOpacity>
        </>
      )}

      {isSubmitted && (
        <View style={styles.submittedActions}>
          <TouchableOpacity style={styles.primaryButton} onPress={onBack}>
            <Text style={styles.primaryButtonText}>Back to Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setIsSubmitted(false)}>
            <Text style={styles.secondaryButtonText}>Try Different Email</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        Remember your password?{' '}
        <Text style={styles.footerLink} onPress={onBack}>
          Back to Login
        </Text>
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {renderHeader()}
      {renderContent()}
      {/* {!isSubmitted && renderFooter()} */}
    </KeyboardAvoidingView>
  );
};

// Embedded Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    // paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 60,
    // backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    width: '100%',
    gap: Spacing.sm,
  },
  disabledButton: {
    backgroundColor: Colors.textSecondary,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  submittedActions: {
    width: '100%',
    gap: Spacing.md,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  footerLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;
