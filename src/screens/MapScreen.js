const GOOGLE_MAPS_APIKEY = 'AIzaSyBXNyT9zcGdvhAUCUEYTm6e_qPw26AOPgI';

import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';
import MapView, {Marker, Circle} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {heightPercentageToDP, widthPercentageToDP} from '../utils';

// haversine distance
const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = x => (x * Math.PI) / 180;
  const R = 6371e3; // metres
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in meters
};

const MapScreen = ({route, navigation}) => {
  const job = route?.params?.job;
  const mapRef = useRef(null);

  const [startCoordinates, setStartCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [alertShown, setAlertShown] = useState(false);
  console.log('destinationCoordinates>>', job);

  // Current location fetch
  const getCurrentLocation = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }
    }

    Geolocation.getCurrentPosition(
      pos => {
        setStartCoordinates({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      error => {
        console.log(error);
        Alert.alert('Error', 'Unable to fetch current location');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  // ✅ Destination address → lat/lng
  const getDestinationCoords = async address => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address,
      )}&key=${GOOGLE_MAPS_APIKEY}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.results?.length > 0) {
        const {lat, lng} = data.results[0].geometry.location;
        setDestinationCoordinates({latitude: lat, longitude: lng});
      } else {
        Alert.alert('Error', 'Unable to find destination coordinates');
      }
    } catch (e) {
      console.log('Geocode error:', e);
    }
  };

  // ✅ Watch user location for geofence
  const watchUserLocation = () => {
    Geolocation.watchPosition(
      pos => {
        if (destinationCoordinates) {
          const {latitude, longitude} = pos.coords;
          const distance = getDistance(
            latitude,
            longitude,
            destinationCoordinates.latitude,
            destinationCoordinates.longitude,
          );

          // Example: 100 meters
          if (distance <= 100 && !alertShown) {
            setAlertShown(true);
            Alert.alert(
              'Geofence Alert 🚨',
              'You are within 100 meters of destination!',
            );
            // navigation.navigate('JobDetail', {job});
          }
        }
      },
      error => console.log(error),
      {enableHighAccuracy: true, distanceFilter: 10, interval: 5000},
    );
  };

  useEffect(() => {
    getCurrentLocation();
    if (job?.job?.address || job?.address) {
      getDestinationCoords(job?.job?.address || job?.address);
    }
  }, []);

  useEffect(() => {
    if (destinationCoordinates) {
      watchUserLocation();
    }
  }, [destinationCoordinates]);

  const handleCall = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`);
  };
  const openMaps = async address => {
    
    try {
      const query = encodeURIComponent(address.trim());

      // Platform-specific preferred URL schemes
      const iosUrl = `maps://?q=${query}`; // opens Apple Maps
      const androidGeo = `geo:0,0?q=${query}`; // opens Google Maps or any map app supporting geo:
      const googleMapsWeb = `https://www.google.com/maps/search/?api=1&query=${query}`; // fallback web

      // Try platform-specific preferred first
      let urlToOpen = googleMapsWeb;

      if (Platform.OS === 'ios') {
        // prefer Apple Maps scheme; if not available, fallback to google maps web
        const canOpenIos = await Linking.canOpenURL(iosUrl);
        urlToOpen = canOpenIos ? iosUrl : googleMapsWeb;
      } else {
        // Android: try geo: scheme first
        const canOpenGeo = await Linking.canOpenURL(androidGeo);
        urlToOpen = canOpenGeo ? androidGeo : googleMapsWeb;
      }

      const supported = await Linking.canOpenURL(urlToOpen);
      if (!supported) {
        // As a last fallback, try web Google Maps
        if (
          urlToOpen !== googleMapsWeb &&
          (await Linking.canOpenURL(googleMapsWeb))
        ) {
          await Linking.openURL(googleMapsWeb);
        } else {
          Alert.alert(
            'No map app',
            'No app available to open maps on this device.',
          );
        }
        return;
      }

      await Linking.openURL(urlToOpen);
    } catch (err) {
      console.warn('Failed to open map url:', err);
      Alert.alert('Error', 'Unable to open map app.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {startCoordinates && destinationCoordinates ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          showsUserLocation={true}
          initialRegion={{
            ...startCoordinates,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}>
          <Marker coordinate={startCoordinates} title="Start" />
          <Marker coordinate={destinationCoordinates} title="Destination" />

          {/* ✅ Geofence Circle */}
          <Circle
            center={destinationCoordinates}
            radius={100}
            strokeWidth={2}
            strokeColor="rgba(0,0,255,0.5)"
            fillColor="rgba(0,0,255,0.1)"
          />

          {/* ✅ Route by road */}
          <MapViewDirections
            origin={startCoordinates}
            destination={destinationCoordinates}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="red"
            onReady={result => {
              mapRef?.current?.fitToCoordinates(result.coordinates, {
                edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
              });
            }}
          />
        </MapView>
      ) : (
        <Text style={{textAlign: 'center', marginTop: 50}}>Loading map...</Text>
      )}

      <View style={styles.bottomCard}>
        <Text style={{fontWeight: '700', marginVertical: 0}} numberOfLines={1}>
          {job?.job?.job_title || job?.job_title}
        </Text>
        {/* <Text style={{textAlign: 'center', fontSize: 12}}>
          {job?.job?.description || job?.description}
        </Text> */}
        <Text
          style={{
            alignSelf: 'flex-start',
            fontSize: 18,
            fontWeight: '700',
            marginTop: 20,
          }}>
          Customer Detail:
        </Text>
        <Text
          style={{
            alignSelf: 'flex-start',
            fontSize: 14,
            fontWeight: '700',
            marginVertical: 6,
          }}>
          Customer Name:{' '}
          <Text style={{fontWeight: '400'}}>
            {job?.job?.customer?.customer_name ||
              job?.job?.contractor?.contractor_name}
          </Text>
        </Text>
        <Text
          style={{
            alignSelf: 'flex-start',
            fontSize: 14,
            fontWeight: '700',
            marginVertical: 6,
          }}>
          Customer Address:{' '}
          <Text style={{fontWeight: '400'}}>
            {job?.job?.address || job?.address}
          </Text>
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
            width: widthPercentageToDP(90),
          }}>
          <TouchableOpacity
            onPress={()=>openMaps(job?.job?.address)}
            style={[styles.actionButton,{backgroundColor: '#0b69ff',}]}
            activeOpacity={0.7}>
            <Text style={[styles.label]}>{'Redirect to Map'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              handleCall(
                job?.job?.contractor?.phone || job?.job?.customer?.phone,
              )
            }>
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={{color: '#fff', fontWeight: '800'}}>Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {flex: 1, position: 'relative'},
  button: {
    backgroundColor: '#0b69ff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    width:"40%"
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerRow: {position: 'absolute', top: 10, left: 10, zIndex: 99999},
  map: {flex: 1},
  bottomCard: {
    zIndex: 99999,
    borderRadius: 20,
    height: heightPercentageToDP(25),
    width: widthPercentageToDP(100),
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    paddingHorizontal: 16,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'absolute',
    // top: 50,
    // right: 10,
    backgroundColor: '#10B981',
    gap: 4,
    borderRadius: 10,
    width: widthPercentageToDP(42),
    paddingVertical: 8,
  },
});
