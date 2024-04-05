import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import BottomSheet from '../component/BottomSheet';
import * as Location from 'expo-location';
import { getCurrentLocation, addressToCoordinates, checkCoorAndAddressInSameCity } from "../helper/locationHelper"
import { db } from "../firebaseConfig"
import { getDocs, collection, query } from "firebase/firestore"
import PriceMarker from '../component/PriceMarker';
import { useFocusEffect } from '@react-navigation/native';

const MapScreen = () => {
  const [carList, setCarList] = useState([])
  const [currentLocation, setCurrentLocation] = useState({longitude: 0, latitude: 0})
  const [selectedCar, setSelectedCar] = useState(null);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);

  const showBottomSheet = (licensePlate) => {
    console.log("show bottom sheet id is ", licensePlate)
    setBottomSheetVisible(!isBottomSheetVisible);
    setSelectedCar(carList.find(car => car.licensePlate === licensePlate));
  };

  const getSwipePosition = (yAxis) => {
    if (yAxis > 120) {
      setBottomSheetVisible(false);
    }
  }

  useFocusEffect(useCallback(() => {
    (async () => {
      console.log("refreshing location on map appears")
      const location = await getCurrentLocation()
      setCurrentLocation(location)
    })()
  }, []))

  useEffect(() => {
    let locationSubscription
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert(`Permission to access location was denied`)
          return
        }
        
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 1000,
          },
          (newLocation) => {
            console.log("new location is ", newLocation)
            setCurrentLocation(newLocation.coords)
          }
        );
      }
      catch(err) {
        console.log("error when setting location subscription ", err)
      }
    })()

    return () => {
      console.log("removing location subscription")
      locationSubscription?.remove()
    }
  }, [])

  useEffect(() => {
    (async () => {
      try {
        console.log("current location is ", currentLocation)
        const querySnapshot = await getDocs(query(collection(db, "Vehicles")))
        const getVehiclesPromises = querySnapshot.docs.map(async (document) => {
          let car = { "licensePlate": document.id, ...document.data() }
          console.log("car before is ", car)
          const carCoord = await addressToCoordinates(car.location)
          car = { ...car, ...carCoord }
          console.log("car is ", car)

          if (await checkCoorAndAddressInSameCity(carCoord, currentLocation)) {
            console.log("is in same city ", car)
            return car
          }
          console.log("not in same city ", car)
          return null
        })

        let result = await Promise.all(getVehiclesPromises)
        console.log("before filtering ", result)
        result = result.filter((car) => car !== null)
        console.log("after filtering ", result)
        console.log("remove non serializable values ", JSON.parse(JSON.stringify(result)))
        console.log("setting current location ", currentLocation)
        setCarList(JSON.parse(JSON.stringify(result)))
      }
      catch (err) {
        console.log("error when setting car list ", err)
      }
    })()
  }, [currentLocation])

  return (

    <View style={styles.container} >

      <MapView style={styles.map} region={{ latitude: currentLocation.latitude, longitude: currentLocation.longitude, latitudeDelta: 0.1, longitudeDelta: 0.1 }}>
        { carList.length > 0 &&
        carList.map(car => (
          <TouchableOpacity key={car.licensePlate} onPress={() => showBottomSheet(car.licensePlate)}>
            <Marker
              key={car.licensePlate}
              coordinate={{ latitude: car.latitude, longitude: car.longitude }}
              title={`Car ${car.licensePlate}`}
            >
              <View>
                <PriceMarker price={car.price} />
              </View>
            </Marker>
          </TouchableOpacity>
        ))}
      </MapView>
      {isBottomSheetVisible && <BottomSheet car={selectedCar} getSwipePosition={getSwipePosition} />}

    </View>

  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapScreen;