import React, {useRef} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {heightPercentageToDP, widthPercentageToDP} from '../utils';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBXNyT9zcGdvhAUCUEYTm6e_qPw26AOPgI';

const MapScreen = ({route, navigation}) => {
  const { title, JobId} = route.params;
  const mapRef = useRef(null);
const startCoordinates= {latitude: 29.7604, longitude: -95.3698}
   const   destinationCoordinates= {latitude: 29.757, longitude: -95.37}
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 120,
          left: 70,
          zIndex: 99999,
          borderRadius: 20,
          height: heightPercentageToDP(10),
          width: widthPercentageToDP(60),
          backgroundColor: '#ffff',
          alignItems: 'center',
          paddingVertical: '10',
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}>
        <Text>{title}</Text>
        <Text>{JobId}</Text>
      </View>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          ...startCoordinates,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}>
        <Marker coordinate={startCoordinates} title="Start" />
        <Marker coordinate={destinationCoordinates} title="Destination" />

        <MapViewDirections
          origin={startCoordinates}
          destination={destinationCoordinates}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={4}
          strokeColor="red"
          onReady={result => {
            mapRef.current?.fitToCoordinates(result.coordinates, {
              edgePadding: {
                top: 50,
                right: 50,
                bottom: 50,
                left: 50,
              },
            });
          }}
        />
      </MapView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  headerRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 99999,
  },
  map: {
    flex: 1,
  },
});
