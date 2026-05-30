import {AppState, PixelRatio, Text, TextInput} from 'react-native';

/**
 * Extra guard for libraries that pass allowFontScaling explicitly.
 * Main fix: scripts/patch-react-native-font-scaling.js + Android/iOS native lock.
 */
const applyNoFontScaling = Component => {
  if (!Component) {
    return;
  }
  Component.defaultProps = Component.defaultProps || {};
  Component.defaultProps.allowFontScaling = false;
  Component.defaultProps.maxFontSizeMultiplier = 1;
};

applyNoFontScaling(Text);
applyNoFontScaling(TextInput);

if (__DEV__) {
  AppState.addEventListener('change', state => {
    if (state === 'active') {
      console.log(
        '[FontScale] system fontScale =',
        PixelRatio.getFontScale(),
      );
    }
  });
}
