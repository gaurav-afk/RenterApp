import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert(`Permission to access location was denied`)
        return
      }

      let location = await Location.getCurrentPositionAsync()
      console.log("now in ", JSON.stringify(location))
      return location.coords

    } catch (err) {
      console.log("error when getting location", err)
    }
  }

// export const locationSubscription = await Location.watchPositionAsync(
//     {
//       accuracy: Location.Accuracy.High,
//       distanceInterval: 0, // Receive updates only when the location has changed
//     },
//     (newLocation) => {
//       setLocation(newLocation);
//     }
//   );

//   return () => {
//     locationSubscription.remove(); // Stop listening for updates when the component unmounts
//   };
// });

  export const coordinatesToAddress = async (coords) => {
    try {
      const postalAddresses = await Location.reverseGeocodeAsync(coords, {})
      console.log("address is ", postalAddresses)

      const output = `${postalAddresses.streetNumber} ${postalAddresses.street}, ${postalAddresses.city}, ${postalAddresses.region}`
      console.log("output is ", output)
      return postalAddresses[0]
    }
    catch (err) {
      console.log(err)
    }
  }

  export const addressToCoordinates = async (address) => {
    try {
      console.log("converting address to coor ", address)
      const geocodedLocation = await Location.geocodeAsync(address)

      console.log("address ", address, " is converted to ", geocodedLocation)
      return geocodedLocation[0]
    } catch (err) {
      console.log(err)
    }
  }

  export const checkCoorAndAddressInSameCity = async (coord1, coord2) => {
    console.log("coord1 and 2 are ", coord1, coord2)
    const [parsedAddress1, parsedAddress2] = await Promise.all([coordinatesToAddress(coord1), coordinatesToAddress(coord2)])

    console.log("parsed addr 1 is ", parsedAddress1)
    console.log("parsed addr 2 is ", parsedAddress2)
    if (parsedAddress1?.city === undefined || parsedAddress1?.city === null) {
      return false
    }
    if (parsedAddress1.city === parsedAddress2.city) {
      console.log("both in ", parsedAddress1.city)
      return true
    }
  }