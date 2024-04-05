import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';
import { collection, getDoc, getDocs, query } from 'firebase/firestore';
import { db, auth } from "../firebaseConfig"
import ReservationItem from './ReservationItem';
import { useFocusEffect } from "@react-navigation/native"

const BookingList = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(db, `/Renters/${auth.currentUser.email}/reservations`)));

      const getReservationPromises = querySnapshot.docs.map(async (document) => {
        console.log("getting booking id ", document.data().bookingId)

        const bookingRef = document.data().booking
        const bookingDoc = await getDoc(bookingRef)
        console.log("bookingdoc ", bookingDoc.data())
        if(bookingDoc.data() === undefined) {
          return null
        }

        const vehicleRef = bookingDoc.data().vehicle
        console.log("vehicle ref ", vehicleRef)
        const vehicleDoc = await getDoc(vehicleRef)

        const ownerRef = vehicleDoc.data().owner
        const ownerDoc = await getDoc(ownerRef)

        console.log("renter doc is ", ownerDoc.data())
        console.log("booking doc is ", bookingDoc.data())
        console.log("vehicle doc is ", vehicleDoc.data())
        console.log("booking ", { "id": bookingDoc.id, ...bookingDoc.data(), ...vehicleDoc.data() })
        console.log("before serial ", { "booking": { "id": bookingDoc.id, ...bookingDoc.data() }, "vehicle": { "licensePlate": vehicleDoc.id, ...vehicleDoc.data() }, "owner": { "id": ownerDoc.id, ...ownerDoc.data() } })
        // stringify and then parse the object to remove the non-serializable fields, which should not be passed through navigation
        console.log("after serial ", JSON.parse(JSON.stringify({ "booking": { "id": bookingDoc.id, ...bookingDoc.data() }, "vehicle": { "licensePlate": vehicleDoc.id, ...vehicleDoc.data() }, "renter": { "id": ownerDoc.id, ...ownerDoc.data() } })))
        return { "booking": { "id": bookingDoc.id, ...bookingDoc.data() }, "vehicle": { "licensePlate": vehicleDoc.id, ...vehicleDoc.data() }, "owner": { "id": ownerDoc.id, ...ownerDoc.data() } }
      })

      let result = await Promise.all(getReservationPromises)
      result = result.filter((reservation) => reservation !== null)
      console.log("reservations are ", result)

      setReservations(result)
      setIsLoading(false)

    } catch (err) {
      console.log("cannot fetch fav, ", err.message)
      setIsLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    console.log("in renter app, focusing on booking list")
    fetchReservations()
  }, []))

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator color="blue" size="large" animating={true} />
      ) : (
        reservations.length > 0 ?
        <FlatList
          style={styles.bookingsList}
          data={reservations}
          key={(item) => item.id}
          renderItem={({ item }) => <ReservationItem reservation={item}/>}
        />
        :
        <Text>No reservation currently</Text>
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1
  },
  bookingsList: {
    alignContent: "stretch",
    width: "100%",
  },
  separator: {
    height: 1.8,
    backgroundColor: '#CED0CE',
    width: '90%',
    alignSelf: 'center'
  },
});

export default BookingList;
