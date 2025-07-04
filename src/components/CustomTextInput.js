import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { spacings } from '../constants/Fonts';
import { blackColor, blueColor, grayColor, lightShadeBlue, mediumGray, redColor, whiteColor } from '../constants/Color';

const CustomTextInput = ({ placeholder, style, rightIcon, label, required, leftIcon, ...props }) => {
  return (
    <View style={{ marginTop: spacings.ExtraLarge2x }}>
      <Text style={[styles.label]}>{label}{required && <Text style={styles.asterisk}> *</Text>}</Text>
      <View style={[styles.inputContainer, style]}>
        {leftIcon && <View style={{marginRight:8}}>{leftIcon}</View>}
        <TextInput
          placeholder={placeholder}
          style={styles.input}
          placeholderTextColor={mediumGray}
          scrollEnabled={true}
          {...props}
        />
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    position:"absolute",
    bottom:24,
    left:24,
    fontSize: 10,
    color: blackColor, // Default color
    marginBottom: 10,
    zIndex:99,
    paddingHorizontal:10,
    paddingVertical:5,
    borderRadius:7,
    borderWidth:1,
    borderColor:"#15151533",
    backgroundColor:"#F1F1F1",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor:"#15151533",
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical:2,
    backgroundColor:whiteColor
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 9,
  },
  iconContainer: {
    marginLeft: 5,
  },
  asterisk: {
    color: 'red',
  },
});

export default CustomTextInput;
