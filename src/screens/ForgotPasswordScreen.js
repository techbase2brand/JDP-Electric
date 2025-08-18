import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OTPTextInput from 'react-native-otp-textinput';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import {BaseStyle} from '../constants/Style';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from '../utils';
import {style, spacings} from '../constants/Fonts';
import {
  blackColor,
  blueColor,
  grayColor,
  lightOrangeColor,
  mediumGray,
  redColor,
  whiteColor,
} from '../constants/Color';
import SuccessModal from '../components/modal/SuccessModal';
import {
  EMAIL_NOT_RECEIVED,
  ENTER_FOUR_DIGIT_CODE,
  ENTER_FOUR_DIGIT_CODE_THAT_YOU_RECEIVED,
  ENTER_YOU_EMAIL,
  FORGOT_PASSWORD,
  PASSWORD,
  RESEND_CODE,
  RESET_PASSWORD,
  SET_THE_NEW_PASSWORD,
} from '../constants/Constants';
import {FORGOT_PASSWORD_ELLIPSE_IMAGE} from '../assests/images';
const {
  flex,
  alignItemsCenter,
  flexDirectionRow,
  alignJustifyCenter,
  positionAbsolute,
  borderRadius5,
  borderWidth1,
  textAlign,
} = BaseStyle;

const ForgotPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState('email');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(0); // Countdown state
  const [isResendEnabled, setIsResendEnabled] = useState(true);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    } else {
      clearInterval(timer);
      setIsResendEnabled(true); // Enable resend button after timer ends
    }

    return () => clearInterval(timer); // Cleanup interval
  }, [countdown]);

  const handleOTPChange = otp => {
    setOtp(otp);
    // setIsOtpComplete(otp.length === 6);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle PressResend
  const handlePressResend = async () => {
    if (countdown === 0) {
      setIsResendEnabled(false);
      await handleResendOTP();
    }
  };

  // Handle ResendOTP
  const handleResendOTP = async () => {
    setOtpError('');

    if (!email) {
      setOtpError('Email is required to resend OTP');
      return;
    }
  };

  // Handle Email Submit
  const handleEmailSubmit = async () => {
    setEmailError('');
    setLoadingEmail(true);

    if (!email) {
      setEmailError('Email is required');
      setLoadingEmail(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      setLoadingEmail(false);
      return;
    }

    setCurrentStep('otp');
  };

  // Handle OTP Submit
  const handleOTPSubmit = async () => {
    setOtpError('');
    setLoadingOtp(true);

    if (!otp) {
      setOtpError('OTP is required');
      setLoadingOtp(false);
      return;
    }

    if (otp.length !== 4 || !/^\d{4}$/.test(otp)) {
      setOtpError('Please enter a valid 4-digit OTP');
      setLoadingOtp(false);
      return;
    }
    setCurrentStep('password');
  };

  // Handle Password Submit
  const handlePasswordSubmit = async () => {
    setPasswordError('');
    setConfirmPasswordError('');
    setLoadingPassword(true);

    if (!password && !confirmPassword) {
      setPasswordError('Password is required');
      setConfirmPasswordError('Confirm Password is required');
      setLoadingPassword(false);
      return;
    }

    if (!password) {
      setPasswordError('Password is required');
      setLoadingPassword(false);
      return;
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      setLoadingPassword(false);
      return;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Confirm Password is required');
      setLoadingPassword(false);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      setLoadingPassword(false);
      return;
    }
    setSuccessModalVisible(true);
  };

  return (
    <KeyboardAvoidingView
      style={[flex]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          width: wp(100),
          height: hp(25),
          zIndex: 999,
        }}
        pointerEvents="none">
        <Image
          source={FORGOT_PASSWORD_ELLIPSE_IMAGE}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
          }}
        />
      </View>
      <View style={[styles.container, {backgroundColor: whiteColor}]}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            width: wp(100),
            height: hp(25),
            zIndex: 999,
          }}
          pointerEvents="none">
          <Image
            source={FORGOT_PASSWORD_ELLIPSE_IMAGE}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
            }}
          />
        </View>
        <View
          style={[
            {width: '100%', height: hp(5)},
            flexDirectionRow,
            alignItemsCenter,
          ]}>
          <TouchableOpacity
            style={[styles.backIcon, alignItemsCenter]}
            onPress={() => {
              if (currentStep === 'email') {
                navigation.goBack();
              } else if (currentStep === 'otp') {
                setCurrentStep('email');
              } else if (currentStep === 'password') {
                setCurrentStep('otp');
              }
            }}>
            <Ionicons name={'arrow-back'} size={33} color={blackColor} />
          </TouchableOpacity>
        </View>

        {currentStep === 'email' && (
          <View style={styles.box}>
            <Text style={[styles.text, textAlign]}>{FORGOT_PASSWORD}</Text>
            <Text style={[styles.destext, textAlign]}>{ENTER_YOU_EMAIL}</Text>
            <CustomTextInput
              label={'Email'}
              placeholder={'Enter your email'}
              value={email}
              onChangeText={text => {
                const updatedText =
                  text.charAt(0).toLowerCase() + text.slice(1);
                setEmail(updatedText);
                if (emailError) {
                  setEmailError('');
                }
              }}
              keyboardType="email-address"
              required={true}
            />
            {emailError && <Text style={styles.error}>{emailError}</Text>}
            <View style={{marginVertical: hp(5)}}>
              <CustomButton
                title="Send OTP"
                onPress={handleEmailSubmit}
                loading={loadingEmail}
                disabled={loadingEmail}
              />
            </View>
          </View>
        )}

        {currentStep === 'otp' && (
          <View style={styles.box}>
            <Text style={[styles.text, textAlign]}>
              {ENTER_FOUR_DIGIT_CODE}
            </Text>
            <Text style={[styles.destext, textAlign]}>
              {ENTER_FOUR_DIGIT_CODE_THAT_YOU_RECEIVED}({email})
            </Text>
            <View style={[{width: '100%', height: hp(15)}, alignJustifyCenter]}>
              <OTPTextInput
                handleTextChange={handleOTPChange}
                inputCount={4}
                tintColor={blackColor}
                offTintColor={mediumGray}
                textInputStyle={[styles.otpInput, {color: blackColor}]}
              />
              {otpError && <Text style={styles.error}>{otpError}</Text>}
            </View>

            {countdown > 0 ? (
              <Text style={[styles.footerText, textAlign]}>
                {' '}
                Resend OTP in {countdown}s
              </Text>
            ) : (
              <Text style={[styles.footerText, textAlign]}>
                {EMAIL_NOT_RECEIVED}
                <Text
                  style={styles.loginText}
                  onPress={handlePressResend}
                  disabled={!isResendEnabled}>
                  {RESEND_CODE}
                </Text>
              </Text>
            )}
            <View style={{marginVertical: hp(5)}}>
              <CustomButton
                title="Continue"
                onPress={handleOTPSubmit}
                loading={loadingOtp}
                disabled={loadingOtp}
              />
            </View>
          </View>
        )}

        {currentStep === 'password' && (
          <View style={styles.box}>
            <Text style={[styles.text, textAlign]}>{RESET_PASSWORD}</Text>
            <Text style={[styles.destext, textAlign]}>
              {SET_THE_NEW_PASSWORD}
            </Text>
            <CustomTextInput
              label={PASSWORD}
              placeholder={PASSWORD}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              required={true}
              rightIcon={
                <MaterialCommunityIcons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color={grayColor}
                  onPress={toggleShowPassword}
                />
              }
            />
            {passwordError && <Text style={styles.error}>{passwordError}</Text>}
            <CustomTextInput
              label="Confirm Password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={text => {
                setConfirmPassword(text);
                if (passwordError) {
                  setPasswordError('');
                }
              }}
              secureTextEntry={!showConfirmPassword}
              required={true}
              rightIcon={
                <MaterialCommunityIcons
                  name={showConfirmPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color={grayColor}
                  onPress={toggleShowConfirmPassword}
                />
              }
            />
            {confirmPasswordError && (
              <Text style={styles.error}>{confirmPasswordError}</Text>
            )}
            <View style={{marginVertical: hp(5)}}>
              <CustomButton
                title="Continue"
                onPress={handlePasswordSubmit}
                loading={loadingPassword}
                disabled={loadingPassword}
              />
            </View>
          </View>
        )}

        {successModalVisible && (
          <SuccessModal
            visible={successModalVisible}
            onClose={() => setSuccessModalVisible(false)}
            headingText={'Password Changed!'}
            text={'You can now use your new password to login to your account.'}
            buttonText={'Okay'}
            onPressContinue={() => {
              setSuccessModalVisible(false), navigation.goBack();
            }}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    padding: spacings.large,
    backgroundColor: whiteColor,
  },
  box: {
    width: '100%',
    height: hp(100),
    padding: spacings.large,
  },
  backIcon: {
    width: wp(10),
    height: hp(5),
  },
  text: {
    fontSize: 25,
    fontWeight: '600',
    color: blackColor,
  },
  destext: {
    color: grayColor,
    paddingVertical: spacings.small2x,
    fontSize: 14,
  },
  otpInput: {
    borderWidth: 1,
    fontSize: 20,
    color: blackColor,
    borderRadius: 5,
    width: '14%',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  footerText: {
    marginTop: spacings.Large1x,
    color: blackColor,
    fontSize: style.fontSizeNormal.fontSize,
  },
  loginText: {
    fontSize: style.fontSizeNormal.fontSize,
    color: blueColor,
    fontWeight: style.fontWeightThin1x.fontWeight,
  },
});
