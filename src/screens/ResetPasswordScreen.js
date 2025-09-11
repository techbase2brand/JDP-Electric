// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   StatusBar,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   Image,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {MAIN_LOGO_IMAGE} from '../assests/images';
// import {widthPercentageToDP as wp, heightPercentageToDP as hp} from '../utils';

// // Embedded Colors
// const Colors = {
//   primary: '#3B82F6',
//   primaryLight: '#EBF4FF',
//   white: '#FFFFFF',
//   backgroundLight: '#F8FAFC',
//   text: '#1E293B',
//   textSecondary: '#64748B',
//   textLight: '#94A3B8',
//   border: '#E2E8F0',
//   success: '#10B981',
//   successLight: '#D1FAE5',
//   error: '#EF4444',
// };

// // Embedded Spacing and Dimensions
// const Spacing = {
//   xs: 4,
//   sm: 8,
//   md: 16,
//   lg: 24,
//   xl: 32,
//   xxl: 48,
// };

// const BorderRadius = {
//   md: 8,
//   lg: 12,
//   xl: 16,
// };

// // Embedded Toast Functions
// const showErrorToast = (title, message) => {
//   Alert.alert(title, message);
// };

// const showSuccessToast = (title, message) => {
//   Alert.alert(title, message);
// };

// const ResetPasswordScreen = ({onSubmit, onBack, loading, navigation}) => {
//   const [code, setCode] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   useEffect(() => {
//     StatusBar.setBarStyle('dark-content');
//   }, []);

// const validateForm = () => {
//   // ✅ Verification Code (must be 6 digits, only numbers)
//   if (!/^\d{6}$/.test(code)) {
//     showErrorToast("Validation Error", "Please enter a valid 6-digit code");
//     return false;
//   }

//   // ✅ New Password check
//   if (!newPassword.trim()) {
//     showErrorToast("Validation Error", "Please enter your new password");
//     return false;
//   }

//   if (newPassword.length < 8) {
//     showErrorToast(
//       "Validation Error",
//       "Password must be at least 8 characters"
//     );
//     return false;
//   }

//   const hasLetter = /[a-zA-Z]/.test(newPassword);
//   const hasNumber = /\d/.test(newPassword);

//   if (!hasLetter || !hasNumber) {
//     showErrorToast(
//       "Validation Error",
//       "Password must include both letters and numbers"
//     );
//     return false;
//   }

//   // ✅ Confirm Password check
//   if (newPassword !== confirmPassword) {
//     showErrorToast("Validation Error", "Passwords do not match");
//     return false;
//   }

//   return true;
// };

//   const handleSubmit = () => {
//     if (!validateForm()) return;

//     showSuccessToast(
//       'Password Updated',
//       'Your password has been successfully reset',
//     );
//     // onSubmit(code, newPassword);
//     navigation.navigate("Login")
//   };

//   const renderHeader = () => (
//     <View style={styles.header}>
//       <TouchableOpacity
//         style={styles.backButton}
//         onPress={() => navigation.goBack()}>
//         <Icon name="arrow-back" size={24} color={Colors.text} />
//       </TouchableOpacity>
//     </View>
//   );

//   const renderContent = () => (
//     <View style={styles.content}>
//       <View style={styles.iconContainer}>
//         <Image
//           source={MAIN_LOGO_IMAGE}
//           style={{
//             width: '100%',
//             height: Platform.OS === 'android' ? hp(7) : hp(7),
//             resizeMode: 'contain',
//           }}
//         />
//       </View>

//       <Text style={styles.title}>Reset Password</Text>
//       <Text style={styles.subtitle}>
//         Enter the verification code sent to your email and create a new
//         password.
//       </Text>

//       <View style={styles.inputGroup}>
//         <Text style={styles.inputLabel}>Verification Code</Text>
//         <TextInput
//           style={styles.textInput}
//           value={code}
//           onChangeText={setCode}
//           placeholder="Enter 6-digit code"
//           keyboardType="numeric"
//           maxLength={6}
//           autoCapitalize="none"
//           editable={!loading}
//         />
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.inputLabel}>New Password</Text>
//         <View style={styles.passwordContainer}>
//           <TextInput
//             style={styles.passwordInput}
//             value={newPassword}
//             onChangeText={setNewPassword}
//             placeholder="Enter new password"
//             secureTextEntry={!showNewPassword}
//             editable={!loading}
//           />
//           <TouchableOpacity
//             style={styles.eyeButton}
//             onPress={() => setShowNewPassword(!showNewPassword)}>
//             <Icon
//               name={showNewPassword ? 'visibility' : 'visibility-off'}
//               size={20}
//               color={Colors.textSecondary}
//             />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={styles.inputGroup}>
//         <Text style={styles.inputLabel}>Confirm New Password</Text>
//         <View style={styles.passwordContainer}>
//           <TextInput
//             style={styles.passwordInput}
//             value={confirmPassword}
//             onChangeText={setConfirmPassword}
//             placeholder="Confirm new password"
//             secureTextEntry={!showConfirmPassword}
//             editable={!loading}
//           />
//           <TouchableOpacity
//             style={styles.eyeButton}
//             onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
//             <Icon
//               name={showConfirmPassword ? 'visibility' : 'visibility-off'}
//               size={20}
//               color={Colors.textSecondary}
//             />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={styles.passwordRequirements}>
//         <Text style={styles.requirementsTitle}>Password Requirements:</Text>
//         <Text style={styles.requirementItem}>• At least 8 characters long</Text>
//         <Text style={styles.requirementItem}>
//           • Include letters and numbers
//         </Text>
//         {/* <Text style={styles.requirementItem}>• Avoid common passwords</Text> */}
//       </View>

//       <TouchableOpacity
//         style={[styles.submitButton, loading && styles.disabledButton]}
//         onPress={handleSubmit}
//         disabled={loading}>
//         <Text style={styles.submitButtonText}>
//           {loading ? 'Updating Password...' : 'Update Password'}
//         </Text>
//         {/* <Icon name="check" size={20} color={Colors.white} /> */}
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={[styles.submitButton, {marginTop: 10, backgroundColor: '#ffff'}]}
//         onPress={() => navigation.goBack()}>
//         <Text style={[styles.primaryButtonText, {color: Colors.primary}]}>
//           Back to Login
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const renderFooter = () => (
//     <View style={styles.footer}>
//       <Text style={styles.footerText}>
//         Didn't receive the code?{' '}
//         <Text style={styles.footerLink} onPress={onBack}>
//           Request New Code
//         </Text>
//       </Text>
//     </View>
//   );

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//       <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

//       {renderHeader()}
//       {renderContent()}
//       {/* {renderFooter()} */}
//     </KeyboardAvoidingView>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.white,
//   },
//   header: {
//     // paddingTop: Spacing.xxl,
//     paddingHorizontal: Spacing.lg,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: Colors.backgroundLight,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: Spacing.xl,
//     paddingTop: 10,
//     alignItems: 'center',
//   },
//   iconContainer: {
//     width: 160,
//     height: 160,
//     borderRadius: 60,
//     justifyContent: 'center',
//     alignItems: 'center',
//     // marginBottom: Spacing.xl,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: Colors.text,
//     marginBottom: Spacing.md,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     textAlign: 'center',
//     lineHeight: 24,
//     marginBottom: Spacing.xl,
//   },
//   inputGroup: {
//     width: '100%',
//     marginBottom: 10,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: Colors.text,
//     marginBottom: Spacing.sm,
//   },
//   textInput: {
//     paddingVertical: Spacing.md,
//     fontSize: 16,
//     color: Colors.text,
//     textAlign: 'center',
//     letterSpacing: 2,
//     backgroundColor: '#F9FAFB',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',

//   },
//   passwordContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: BorderRadius.md,
//     backgroundColor: '#F9FAFB',
//   },
//   passwordInput: {
//     flex: 1,
//     paddingHorizontal: Spacing.md,
//     paddingVertical: Spacing.md,
//     fontSize: 16,
//     color: Colors.text,
//   },
//   eyeButton: {
//     padding: Spacing.md,
//   },
//   passwordRequirements: {
//     width: '100%',
//     backgroundColor: Colors.backgroundLight,
//     borderRadius: BorderRadius.md,
//     padding: Spacing.md,
//     marginBottom: Spacing.lg,
//   },
//   requirementsTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: Colors.text,
//     marginBottom: Spacing.sm,
//   },
//   requirementItem: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     marginBottom: Spacing.xs,
//   },
//   submitButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: Colors.primary,
//     borderRadius: BorderRadius.md,
//     paddingVertical: Spacing.md,
//     paddingHorizontal: Spacing.xl,
//     width: '100%',
//     gap: Spacing.sm,
//   },
//   disabledButton: {
//     backgroundColor: Colors.textSecondary,
//   },
//   submitButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.white,
//   },
//   footer: {
//     paddingHorizontal: Spacing.xl,
//     paddingBottom: Spacing.xl,
//     alignItems: 'center',
//   },
//   footerText: {
//     fontSize: 14,
//     color: Colors.textSecondary,
//     textAlign: 'center',
//   },
//   footerLink: {
//     color: Colors.primary,
//     fontWeight: '600',
//   },
// });
// Embedded Styles

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
import {
  resendForgotPasswordOtp,
  resetForgotPassword,
  verifyForgotPasswordOtp,
} from '../config/apiConfig';

// 👉 Import APIs
// import {
//   verifyForgotPasswordOtp,
//   resendForgotPasswordOtp,
//   resetForgotPassword,
// } from '../api/authApi';

// Colors
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
  error: '#EF4444',
};
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
const showErrorToast = (title, message) => Alert.alert(title, message);
const showSuccessToast = (title, message) => Alert.alert(title, message);

const ResetPasswordScreen = ({navigation, route}) => {
  const email = route.params?.email || ''; // Email passed from ForgotPasswordScreen

  const [code, setCode] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // Timer state for Resend OTP
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  }, []);

  // Timer logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // ✅ Handle OTP Verify
  const handleOtpVerify = async () => {
    if (!/^\d{6}$/.test(code)) {
      return showErrorToast('Validation Error', 'Enter valid 6-digit OTP');
    }
    try {
      setLoading(true);
      const res = await verifyForgotPasswordOtp(email, code);
      showSuccessToast('Success', 'OTP Verified Successfully');
      setIsOtpVerified(true);
    } catch (err) {
      showErrorToast('Error', err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Resend OTP
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const res = await resendForgotPasswordOtp(email);
      showSuccessToast('Success', 'OTP resent to your email');
      setTimer(30); // reset timer
    } catch (err) {
      showErrorToast('Error', err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Reset Password
  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      return showErrorToast(
        'Validation Error',
        'Password must be at least 8 characters',
      );
    }
    if (newPassword !== confirmPassword) {
      return showErrorToast('Validation Error', 'Passwords do not match');
    }

    try {
      setLoading(true);
      await resetForgotPassword(email, newPassword, confirmPassword);
      showSuccessToast('Success', 'Password reset successful');
      navigation.navigate('Login');
    } catch (err) {
      showErrorToast('Error', err.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Logo */}
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

      {/* Step 1: OTP Section */}
      {!isOtpVerified ? (
        <View style={styles.content}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to your email {email}.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Verification Code</Text>
            <TextInput
              style={styles.textInput}
              value={code}
              onChangeText={setCode}
              placeholder="Enter 6-digit code"
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          {/* Resend OTP */}
          <Text
            style={[
              styles.resendLink,
              {color: timer > 0 ? Colors.textSecondary : Colors.primary},
            ]}
            onPress={timer === 0 ? handleResendOtp : null}>
            {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
          </Text>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleOtpVerify}
            disabled={loading}>
            <Text style={styles.submitButtonText}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Step 2: Reset Password Section
        <View style={styles.content}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your new password and confirm it.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>New Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}>
                <Icon
                  name={showNewPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm password"
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Icon
                  name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleResetPassword}
            disabled={loading}>
            <Text style={styles.submitButtonText}>
              {loading ? 'Updating...' : 'Update Password'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},
  header: {padding: 16},
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 80,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {marginBottom: 16},
  inputLabel: {fontSize: 14, fontWeight: '500', marginBottom: 6},
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  passwordInput: {flex: 1, fontSize: 16, paddingVertical: 12},
  submitButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {color: Colors.white, fontSize: 16, fontWeight: '600'},
  resendLink: {fontSize: 14, fontWeight: '600', marginBottom: 10},
});

export default ResetPasswordScreen;
