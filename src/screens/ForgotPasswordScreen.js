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
import {sendForgotPasswordOtp} from '../config/apiConfig';

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

const ForgotPasswordScreen = ({onSubmit, onBack, navigation}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  }, []);

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // const handleSubmit = () => {
  //   if (!email.trim()) {
  //     showErrorToast('Validation Error', 'Please enter your email address');
  //     return;
  //   }

  //   if (!validateEmail(email)) {
  //     showErrorToast('Validation Error', 'Please enter a valid email address');
  //     return;
  //   }

  //   // setIsSubmitted(true);
  //   showSuccessToast(
  //     'Reset Link Sent',
  //     'If an account exists with this email, you will receive password reset instructions.',
  //   );
  //   // onSubmit(email);
  //   navigation.navigate('ResetPasswordScreen');
  // };
  const handleSubmit = async () => {
    if (!email.trim()) {
      showErrorToast('Validation Error', 'Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      showErrorToast('Validation Error', 'Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);

      // 🔥 API call
      const res = await sendForgotPasswordOtp(email);

      // ✅ Success
      showSuccessToast('Success', res.message || 'OTP sent successfully!');
      navigation.navigate('ResetPasswordScreen', {email}); // email bhi bhej rahe hain next screen par
    } catch (error) {
      // ❌ Error
      showErrorToast('Error', error.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
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
          <TouchableOpacity
            style={[
              styles.submitButton,
              {marginTop: 10, backgroundColor: '#ffff'},
            ]}
            onPress={() => navigation.goBack()}>
            <Text style={[styles.primaryButtonText, {color: '#000'}]}>
              Back to Login
            </Text>
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
