// import React, {useRef} from 'react';
// import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
// import MapView, {Marker, Polyline} from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import {heightPercentageToDP, widthPercentageToDP} from '../utils';

// const GOOGLE_MAPS_APIKEY = 'AIzaSyBXNyT9zcGdvhAUCUEYTm6e_qPw26AOPgI';

// const MapScreen = ({route, navigation}) => {
//   const {title, jobId, description} = route.params;
//   const mapRef = useRef(null);
//   const startCoordinates = {latitude: 29.7604, longitude: -95.3698};
//   const destinationCoordinates = {latitude: 29.757, longitude: -95.37};
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
//         initialRegion={{
//           ...startCoordinates,
//           latitudeDelta: 0.05,
//           longitudeDelta: 0.05,
//         }}>
//         <Marker coordinate={startCoordinates} title="Start" />
//         <Marker coordinate={destinationCoordinates} title="Destination" />

//         <MapViewDirections
//           origin={startCoordinates}
//           destination={destinationCoordinates}
//           apikey={GOOGLE_MAPS_APIKEY}
//           strokeWidth={4}
//           strokeColor="red"
//           onReady={result => {
//             mapRef.current?.fitToCoordinates(result.coordinates, {
//               edgePadding: {
//                 top: 50,
//                 right: 50,
//                 bottom: 50,
//                 left: 50,
//               },
//             });
//           }}
//         />
//       </MapView>
//       <View
//         style={{
//           zIndex: 99999,
//           borderRadius: 20,
//           height: heightPercentageToDP(30),
//           width: widthPercentageToDP(100),
//           backgroundColor: '#ffff',
//           alignItems: 'center',
//           paddingVertical: '10',
//           shadowColor: '#000',
//           shadowOffset: {width: 0, height: 2},
//           shadowOpacity: 0.1,
//           shadowRadius: 8,
//           elevation: 4,
//         }}>
//         <Text style={{fontWeight: '700'}}>{jobId}</Text>
//         <Text style={{fontWeight: '500', marginVertical: 4}}>{title}</Text>
//         <Text style={{textAlign: 'center', fontSize: 12}}>{description}</Text>
//       </View>
//     </View>
//   );
// };

// export default MapScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     position: 'relative',
//   },
//   headerRow: {
//     position: 'absolute',
//     top: 10,
//     left: 10,
//     zIndex: 99999,
//   },
//   map: {
//     flex: 1,
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
} from 'react-native';
import MapView, {Marker, Polyline, Circle} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {heightPercentageToDP, widthPercentageToDP} from '../utils';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBXNyT9zcGdvhAUCUEYTm6e_qPw26AOPgI';

// haversine distance calculator (in meters)
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
  const {title, jobId, description} = route.params;
  const mapRef = useRef(null);

  const startCoordinates = {latitude: 29.7604, longitude: -95.3698};
  const destinationCoordinates = {latitude: 29.757, longitude: -95.37};

  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission denied', 'Location permission is required');
          return;
        }
      }
      watchUserLocation();
    };

    const watchUserLocation = () => {
      Geolocation.watchPosition(
        pos => {
          const {latitude, longitude} = pos.coords;
          const distance = getDistance(
            latitude,
            longitude,
            destinationCoordinates.latitude,
            destinationCoordinates.longitude,
          );

          if (distance <= 500 && !alertShown) {
            setAlertShown(true);
            Alert.alert('Alert', 'User is within 500 meters of destination!');
          }
        },
        error => console.log(error),
        {enableHighAccuracy: true, distanceFilter: 10, interval: 5000},
      );
    };

    requestLocationPermission();
  }, [alertShown]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
      </View>

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

        {/* 500 meter geofence circle */}
        <Circle
          center={destinationCoordinates}
          radius={100}
          strokeWidth={2}
          strokeColor="rgba(0,0,255,0.5)"
          fillColor="rgba(0,0,255,0.1)"
        />

        <MapViewDirections
          origin={startCoordinates}
          destination={destinationCoordinates}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={4}
          strokeColor="red"
          onReady={result => {
            mapRef.current?.fitToCoordinates(result.coordinates, {
              edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
            });
          }}
        />
      </MapView>

      <View style={styles.bottomCard}>
        <Text style={{fontWeight: '700'}}>{jobId}</Text>
        <Text style={{fontWeight: '500', marginVertical: 4}}>{title}</Text>
        <Text style={{textAlign: 'center', fontSize: 12}}>{description}</Text>
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
  },
});
