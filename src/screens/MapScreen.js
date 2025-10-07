// import React, {useRef, useEffect, useState} from 'react';
// import {
//   View,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   Alert,
//   PermissionsAndroid,
//   Platform,
//   Linking,
// } from 'react-native';
// import MapView, {Marker, Polyline, Circle} from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import Geolocation from '@react-native-community/geolocation';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {heightPercentageToDP, widthPercentageToDP} from '../utils';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBXNyT9zcGdvhAUCUEYTm6e_qPw26AOPgI';
// const COLORS = {
//   primary: '#3B82F6',
//   primaryDark: '#1E40AF',
//   primaryLight: '#93C5FD',
//   success: '#10B981',
//   warning: '#F59E0B',
//   danger: '#EF4444',
//   white: '#FFFFFF',
//   gray50: '#F9FAFB',
//   gray100: '#F3F4F6',
//   gray200: '#E5E7EB',
//   gray300: '#D1D5DB',
//   gray400: '#9CA3AF',
//   gray500: '#6B7280',
//   gray600: '#4B5563',
//   gray700: '#374151',
//   gray800: '#1F2937',
//   gray900: '#111827',
//   blue50: '#EFF6FF',
//   blue100: '#DBEAFE',
//   green50: '#ECFDF5',
//   green100: '#D1FAE5',
//   yellow50: '#FFFBEB',
//   yellow100: '#FEF3C7',
//   red50: '#FEF2F2',
//   red100: '#FEE2E2',
// };
// // haversine distance calculator (in meters)
// const getDistance = (lat1, lon1, lat2, lon2) => {
//   const toRad = x => (x * Math.PI) / 180;
//   const R = 6371e3; // metres
//   const φ1 = toRad(lat1);
//   const φ2 = toRad(lat2);
//   const Δφ = toRad(lat2 - lat1);
//   const Δλ = toRad(lon2 - lon1);

//   const a =
//     Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//     Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return R * c; // distance in meters
// };

// const MapScreen = ({route, navigation}) => {
//   // const {title, jobId, description, customer, location} = route.params;
//   const mapRef = useRef(null);
//   const job = route?.params?.job;
//   console.log('jbmappp>>>>', job);

//   const startCoordinates = {latitude: 29.7604, longitude: -95.3698};
//   const destinationCoordinates = {latitude: 29.757, longitude: -95.37};

//   const [alertShown, setAlertShown] = useState(false);

//   useEffect(() => {
//     const requestLocationPermission = async () => {
//       if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         );
//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//           Alert.alert('Permission denied', 'Location permission is required');
//           return;
//         }
//       }
//       watchUserLocation();
//     };

//     const watchUserLocation = () => {
//       Geolocation.watchPosition(
//         pos => {
//           const {latitude, longitude} = pos.coords;
//           const distance = getDistance(
//             latitude,
//             longitude,
//             destinationCoordinates.latitude,
//             destinationCoordinates.longitude,
//           );
//           if (distance <= 100 && !alertShown) {
//             setAlertShown(true);
//             Alert.alert('Alert', 'User is within 500 meters of destination!');
//           }
//         },
//         error => console.log(error),
//         {enableHighAccuracy: true, distanceFilter: 10, interval: 5000},
//       );
//     };

//     requestLocationPermission();
//   }, [alertShown]);

//   const handleCall = phoneNumber => {
//     Linking.openURL(`tel:${phoneNumber}`);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerRow}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={28} color="#000" />
//         </TouchableOpacity>
//       </View>

//       <MapView
//         ref={mapRef}
//         style={styles.map}
//         showsUserLocation={true}
//         initialRegion={{
//           ...startCoordinates,
//           latitudeDelta: 0.05,
//           longitudeDelta: 0.05,
//         }}>
//         <Marker coordinate={startCoordinates} title="Start" />
//         <Marker coordinate={destinationCoordinates} title="Destination" />

//         {/* 100 meter geofence circle */}
//         <Circle
//           center={destinationCoordinates}
//           radius={100}
//           strokeWidth={2}
//           strokeColor="rgba(0,0,255,0.5)"
//           fillColor="rgba(0,0,255,0.1)"
//         />
//         <MapViewDirections
//           origin={startCoordinates}
//           destination={destinationCoordinates}
//           apikey={GOOGLE_MAPS_APIKEY}
//           strokeWidth={4}
//           strokeColor="red"
//           onReady={result => {
//             mapRef?.current?.fitToCoordinates(result.coordinates, {
//               edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
//             });
//           }}
//         />
//       </MapView>

//       <View style={styles.bottomCard}>
//         {/* <Text style={{fontWeight: '700'}}>{"jobId"}</Text> */}
//         <Text style={{fontWeight: '700', marginVertical: 4}}>
//           {job?.job?.job_title || job?.job_title}
//         </Text>
//         <Text style={{textAlign: 'center', fontSize: 12}}>
//           {job?.job?.description || job?.description}
//         </Text>
//         <Text
//           style={{
//             alignSelf: 'flex-start',
//             fontSize: 18,
//             fontWeight: '700',
//             marginVertical: 6,
//             marginTop: 40,
//           }}>
//           {'Customer Detail:'}
//         </Text>
//         <Text
//           style={{
//             alignSelf: 'flex-start',
//             fontSize: 14,
//             marginVertical: 6,
//           }}>
//           Customer Name:{' '}
//           {job?.job?.customer?.customer_name || job?.customer?.customer_name}
//         </Text>
//         <Text
//           style={{
//             alignSelf: 'flex-start',
//             fontSize: 14,
//             marginVertical: 6,
//           }}>
//           Customer Address: {job?.job?.address || job?.address}
//         </Text>
//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={() =>
//             handleCall(job?.job?.customer?.phone || job?.customer?.phone)
//           }>
//           <Ionicons name="call" size={20} color={COLORS.white} />
//           <Text style={{color: COLORS.white, fontWeight: '800'}}>Call</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default MapScreen;

// const styles = StyleSheet.create({
//   container: {flex: 1, position: 'relative'},
//   headerRow: {position: 'absolute', top: 10, left: 10, zIndex: 99999},
//   map: {flex: 1},
//   bottomCard: {
//     zIndex: 99999,
//     borderRadius: 20,
//     height: heightPercentageToDP(30),
//     width: widthPercentageToDP(100),
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     paddingVertical: 10,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//     paddingHorizontal: 16,
//   },
//   actionButton: {
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'absolute',
//     top: 80,
//     right: 10,
//     paddingTop: 16,
//     paddingBottom: 8,
//     backgroundColor: COLORS.success,
//     gap: 4,
//     borderRadius: 10,
//     width: widthPercentageToDP(20),
//   },
// });

// import React, {useRef, useEffect, useState} from 'react';
// import {
//   View,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   Alert,
//   PermissionsAndroid,
//   Platform,
//   Linking,
// } from 'react-native';
// import MapView, {Marker, Circle} from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import Geolocation from '@react-native-community/geolocation';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {heightPercentageToDP, widthPercentageToDP} from '../utils';

// const MapScreen = ({route, navigation}) => {
//   const job = route?.params?.job;
//   const mapRef = useRef(null);

//   const [startCoordinates, setStartCoordinates] = useState(null);
//   const [destinationCoordinates, setDestinationCoordinates] = useState(null);
//       console.log("datdfdsfa>>",destinationCoordinates,startCoordinates);

//   // ✅ Step 1: Get current location
//   const getCurrentLocation = async () => {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       );
//       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//         Alert.alert('Permission denied', 'Location permission is required');
//         return;
//       }
//     }

//     Geolocation.getCurrentPosition(
//       pos => {
//         setStartCoordinates({
//           latitude: pos.coords.latitude,
//           longitude: pos.coords.longitude,
//         });
//       },
//       error => {
//         console.log(error);
//         Alert.alert('Error', 'Unable to fetch current location');
//       },
//       {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
//     );
//   };

//   // ✅ Step 2: Convert job.address → lat/lng using Google Geocoding API
//   const getDestinationCoords = async address => {
//     console.log("addressaddress>>",address);

//     try {
//       const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
//         address,
//       )}&key=${GOOGLE_MAPS_APIKEY}`;
//       const response = await fetch(url);
//       const data = await response.json();
//       console.log("data>>",data);

//       if (data.results?.length > 0) {
//         const {lat, lng} = data.results[0].geometry.location;
//       console.log("data>>",{lat, lng});
//         setDestinationCoordinates({latitude: lat, longitude: lng});
//       } else {
//         Alert.alert('Error', 'Unable to find destination coordinates');
//       }
//     } catch (e) {
//       console.log('Geocode error:', e);
//     }
//   };

//   useEffect(() => {
//     getCurrentLocation();
//     // if (job?.job?.address || job?.address) {
//       getDestinationCoords("ISBT 43 chandigrah");
//     // }
//   }, []);

//   const handleCall = phoneNumber => {
//     Linking.openURL(`tel:${phoneNumber}`);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerRow}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={28} color="#000" />
//         </TouchableOpacity>
//       </View>

//       {startCoordinates && destinationCoordinates ? (
//         <MapView
//           ref={mapRef}
//           style={styles.map}
//           showsUserLocation={true}
//           initialRegion={{
//             ...startCoordinates,
//             latitudeDelta: 0.05,
//             longitudeDelta: 0.05,
//           }}>
//           <Marker coordinate={startCoordinates} title="Start" />
//           <Marker coordinate={destinationCoordinates} title="Destination" />

//           <Circle
//             center={destinationCoordinates}
//             radius={100}
//             strokeWidth={2}
//             strokeColor="rgba(0,0,255,0.5)"
//             fillColor="rgba(0,0,255,0.1)"
//           />

//           <MapViewDirections
//             origin={startCoordinates}
//             destination={destinationCoordinates}
//             apikey={GOOGLE_MAPS_APIKEY}
//             strokeWidth={4}
//             strokeColor="red"
//             onReady={result => {
//               mapRef?.current?.fitToCoordinates(result.coordinates, {
//                 edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
//               });
//             }}
//           />
//         </MapView>
//       ) : (
//         <Text style={{textAlign: 'center', marginTop: 50}}>
//           Loading map...
//         </Text>
//       )}

//       <View style={styles.bottomCard}>
//         <Text style={{fontWeight: '700', marginVertical: 4}}>
//           {job?.job?.job_title || job?.job_title}
//         </Text>
//         <Text style={{textAlign: 'center', fontSize: 12}}>
//           {job?.job?.description || job?.description}
//         </Text>
//         <Text style={{alignSelf: 'flex-start', fontSize: 18, fontWeight: '700', marginTop: 20}}>
//           Customer Detail:
//         </Text>
//         <Text style={{alignSelf: 'flex-start', fontSize: 14, marginVertical: 6}}>
//           Customer Name: {job?.job?.customer?.customer_name || job?.customer?.customer_name}
//         </Text>
//         <Text style={{alignSelf: 'flex-start', fontSize: 14, marginVertical: 6}}>
//           Customer Address: {job?.job?.address || job?.address}
//         </Text>
//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={() => handleCall(job?.job?.customer?.phone || job?.customer?.phone)}>
//           <Ionicons name="call" size={20} color="#fff" />
//           <Text style={{color: '#fff', fontWeight: '800'}}>Call</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default MapScreen;

// const styles = StyleSheet.create({
//   container: {flex: 1, position: 'relative'},
//   headerRow: {position: 'absolute', top: 10, left: 10, zIndex: 99999},
//   map: {flex: 1},
//   bottomCard: {
//     zIndex: 99999,
//     borderRadius: 20,
//     height: heightPercentageToDP(30),
//     width: widthPercentageToDP(100),
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     paddingVertical: 10,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//     paddingHorizontal: 16,
//   },
//   actionButton: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'absolute',
//     top: 80,
//     right: 10,
//     backgroundColor: '#10B981',
//     gap: 4,
//     borderRadius: 10,
//     width: widthPercentageToDP(20),
//     paddingVertical: 8,
//   },
// });
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
        <Text style={{fontWeight: '700', marginVertical: 4}}>
          {job?.job?.job_title || job?.job_title}
        </Text>
        <Text style={{textAlign: 'center', fontSize: 12}}>
          {job?.job?.description || job?.description}
        </Text>
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
          style={{alignSelf: 'flex-start', fontSize: 14, marginVertical: 6}}>
          Customer Name:{' '}
          {job?.job?.customer?.customer_name || job?.customer?.customer_name}
        </Text>
        <Text
          style={{alignSelf: 'flex-start', fontSize: 14, marginVertical: 6}}>
          Customer Address: {job?.job?.address || job?.address}
        </Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            handleCall(job?.job?.customer?.phone || job?.customer?.phone)
          }>
          <Ionicons name="call" size={20} color="#fff" />
          <Text style={{color: '#fff', fontWeight: '800'}}>Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {flex: 1, position: 'relative'},
  headerRow: {position: 'absolute', top: 10, left: 10, zIndex: 99999},
  map: {flex: 1},
  bottomCard: {
    zIndex: 99999,
    borderRadius: 20,
    height: heightPercentageToDP(30),
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
    position: 'absolute',
    top: 80,
    right: 10,
    backgroundColor: '#10B981',
    gap: 4,
    borderRadius: 10,
    width: widthPercentageToDP(20),
    paddingVertical: 8,
  },
});
