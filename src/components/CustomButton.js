import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import {blueColor, orangeColor, whiteColor} from '../constants/Color';
import {spacings, style} from '../constants/Fonts';

const CustomButton = ({
  title,
  onPress,
  style,
  textStyle,
  loading,
  disabled = false,
}) => {
  return (
    <Pressable
      style={[styles.button, style, disabled && styles.disabledButton]}
      onPress={() => {
        console.log(`${title} button pressed`);
        if (!disabled && !loading) {
          onPress();
        }
      }}
      activeOpacity={0.8}
      disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator size="small" color={whiteColor} />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3B82F6',
    padding: spacings.xLarge,
    borderRadius: 50,
    marginBottom: spacings.Large1x,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: whiteColor,
    fontSize: style.fontSizeNormal1x.fontSize,
    fontWeight: style.fontWeightMedium.fontWeight,
  },
  disabledButton: {
    backgroundColor: '#D1D4D6',
  },
});

export default CustomButton;
