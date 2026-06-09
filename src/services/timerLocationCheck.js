import {Alert, Platform, PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const LOCATION_REQUIRED_TITLE = 'Location Required';
const LOCATION_REQUIRED_MESSAGE =
  'Turn on Location Services and allow location access for this app. The work timer only runs while location is on.';

export async function requestTimerLocationPermission() {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: LOCATION_REQUIRED_TITLE,
          message: LOCATION_REQUIRED_MESSAGE,
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  }

  try {
    Geolocation.requestAuthorization?.('whenInUse');
  } catch {}
  return true;
}

const getCoordsOnce = options =>
  new Promise(resolve => {
    Geolocation.getCurrentPosition(
      pos =>
        resolve({
          latitude: pos?.coords?.latitude,
          longitude: pos?.coords?.longitude,
        }),
      () => resolve(null),
      options,
    );
  });

/**
 * Returns true only when permission is granted and a GPS fix is available.
 */
export async function ensureLocationAvailableForTimer({
  showAlert = true,
} = {}) {
  const hasPermission = await requestTimerLocationPermission();
  if (!hasPermission) {
    if (showAlert) {
      Alert.alert(LOCATION_REQUIRED_TITLE, LOCATION_REQUIRED_MESSAGE);
    }
    return false;
  }

  const quick = await getCoordsOnce({
    enableHighAccuracy: false,
    timeout: 12000,
    maximumAge: 3000,
  });
  if (quick?.latitude && quick?.longitude) {
    return true;
  }

  const precise = await getCoordsOnce({
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 0,
  });
  if (precise?.latitude && precise?.longitude) {
    return true;
  }

  if (showAlert) {
    Alert.alert(LOCATION_REQUIRED_TITLE, LOCATION_REQUIRED_MESSAGE);
  }
  return false;
}
