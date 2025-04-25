import React from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { blackColor, grayColor, lightBlueColor, whiteColor } from '../constants/Color';
import { heightPercentageToDP } from '../utils';
import { spacings } from '../constants/Fonts';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

const Header = ({ title, onBack, showProfile, scanner }) => {
    const navigation = useNavigation();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigation.goBack();
        }
    };

    return (
        <View style={styles.headerContainer}>
            {/* Top Row */}
            <View style={styles.topRow}>
                {showProfile ? (
                    <>
                        <View style={{ flexDirection: "row" }}>

                            <Image
                                source={{
                                    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrTFrhr_-pYR74jUgOy7IerAoHAX3zPIZZcg&s',
                                }}
                                style={styles.avatar}
                            />
                            <View>
                                <Text style={styles.name}>John Smith</Text>
                                <Text style={styles.role}>Electrical</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.notificationIcon}>
                            <Ionicons name="notifications-outline" size={24} color={whiteColor} />
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <View style={{ flex: 1 }}>
                            <View style={styles.searchWrapper}>
                                <TextInput
                                    placeholder="Search..."
                                    placeholderTextColor={grayColor}
                                    style={styles.textInput}
                                />
                                <Ionicons name="search" size={20} color={grayColor} style={{ marginLeft: 10 }} />
                            </View>
                        </View>
                        {scanner ? <TouchableOpacity style={[styles.notificationIcon, { marginTop: !showProfile ? 10 : 0 }]}>
                            <MaterialCommunityIcons name="line-scan" size={34} color={whiteColor} />
                        </TouchableOpacity>
                            : <TouchableOpacity style={[styles.notificationIcon, { marginTop: !showProfile ? 10 : 0 }]}>
                                <Ionicons name="notifications-outline" size={24} color={whiteColor} />
                            </TouchableOpacity>}
                    </>
                )}
            </View>

            {/* Search Bar if profile is shown */}
            {showProfile && (
                <View style={styles.searchWrapper}>
                    <TextInput
                        placeholder="Search..."
                        placeholderTextColor={grayColor}
                        style={styles.textInput}
                    />
                    <Ionicons name="search" size={20} color={grayColor} style={{ marginLeft: 10 }} />
                </View>
            )}
        </View>
    );
};

const styles = {
    headerContainer: {
        padding: 16,
        backgroundColor: lightBlueColor,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    name: {
        color: whiteColor,
        fontWeight: 'bold',
        fontSize: 16,
    },
    role: {
        color: whiteColor,
        fontSize: 12,
    },
    notificationIcon: {
        padding: 12,
        // marginTop:10,
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderRadius: 25,
        marginTop: 12,
        paddingHorizontal: 10,
        height: heightPercentageToDP(5.5),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    textInput: {
        flex: 1,
        color: blackColor,
        paddingHorizontal: 10,
        fontSize: 14,
    },
};

export default Header;
