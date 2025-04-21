import { Image, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { BaseStyle } from '../constants/Style';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { style, spacings } from '../constants/Fonts';
import { blackColor, blueColor, grayColor, lightGrayColor, whiteColor } from '../constants/Color';
import CustomTextInput from '../components/CustomTextInput';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { GOOGLE_ICON, LOGIN_IMAGE } from '../assests/images';
import { DONT_HAVE_ACCOUNT, FORGOT_PASSWORD, LET_CONNECT_WITH_US, LOGIN, SIGN_UP } from '../constants/Constants';
import CustomButton from '../components/CustomButton';

const { flex, alignItemsCenter, alignJustifyCenter, resizeModeContain, flexDirectionRow, justifyContentSpaceBetween, textAlign } = BaseStyle;

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    return (
        <View style={[flex, styles.container]}>
            <View style={[styles.logoBox]}>
                <Image source={LOGIN_IMAGE} style={{ width: "100%", height: Platform.OS === "android" ? hp(76.6) : hp(73), resizeMode: "contain" }} />
            </View>
            <View style={[styles.box]}>
                <Text style={[styles.title, { fontSize: style.fontSizeLargeXX.fontSize }, textAlign]}>{LET_CONNECT_WITH_US}</Text>
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
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

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
                        <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
                            <MaterialCommunityIcons name={isPasswordVisible ? "eye" : "eye-off"} size={20} color={grayColor} />
                        </TouchableOpacity>
                    }
                />
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                <View style={[{ width: "100%", height: hp(3), alignItems: "flex-end", marginTop: spacings.large }]}>
                    <Text style={[styles.title, { fontSize: style.fontSizeMedium.fontSize }]}
                    // onPress={()=>navigation.navigate("ForgotPassword")}
                    >{FORGOT_PASSWORD}</Text>
                </View>
                <View style={{ marginTop: Platform.OS === "android" ? hp(5) : hp(3) }}>
                    <CustomButton title={LOGIN}
                    // onPress={()=>navigation.navigate("MainTabNavigator")}
                    />
                </View>
                <View style={[flexDirectionRow, alignJustifyCenter]}>
                    <Text style={[styles.title, { fontSize: style.fontSizeNormal.fontSize, fontWeight: 0 }, textAlign]}>{DONT_HAVE_ACCOUNT}</Text>
                    <Text style={[styles.title, { fontSize: style.fontSizeNormal.fontSize, fontWeight: 0, color: blueColor }, textAlign]}
                        onPress={() => console.log("Clikded")}
                    >
                        {SIGN_UP}
                    </Text>
                </View>
                <View style={[flexDirectionRow, alignJustifyCenter]}>
                    <View style={{ width: "40%", height: 1.5, backgroundColor: lightGrayColor }}></View>
                    <Text style={[styles.title, { fontSize: style.fontSizeNormal.fontSize, fontWeight: 0, padding: 10 }, textAlign]}>or</Text>
                    <View style={{ width: "40%", height: 1.5, backgroundColor: lightGrayColor }}></View>
                </View>
                <View style={[flexDirectionRow, alignJustifyCenter, { marginTop: 10 }]}>
                    <Pressable style={[styles.socialButton, alignJustifyCenter]}>
                        <Image source={GOOGLE_ICON} resizeMode='conatin' style={{ width: wp(8), height: wp(8) }} />
                    </Pressable>
                    <Pressable style={[styles.socialButton, { marginLeft: 30 }, alignJustifyCenter]}>
                        <MaterialCommunityIcons name={"apple"} size={wp(10)} color={blackColor} />
                    </Pressable>
                </View>

            </View>
        </View>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: whiteColor
    },
    logoBox: {
        width: wp(100),
        height: "30%",
        // backgroundColor: "red"
    },
    title: {
        fontSize: style.fontSizeLarge3x.fontSize,
        fontWeight: style.fontWeightMedium.fontWeight,
        color: blackColor,
    },
    box: {
        width: wp(100),
        height: "70%",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: whiteColor,
        padding: spacings.xxxxLarge
    },
    socialButton: {
        width: wp(17),
        height: wp(17),
        borderRadius: 100,
        borderWidth: 1,
        borderColor: grayColor
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        // marginTop: 5,
    },
})