import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PanResponder, Image } from 'react-native';
import { useState, useRef } from 'react';
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { db, auth } from "../firebaseConfig"



const BottomSheet = ({ car, getSwipePosition }) => {
const [gesturePosition, setGesturePosition] = useState({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        // Gesture has started. Show some visual feedback so the user knows what is happening!
        console.log('Gesture started');
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.moveX, gestureState.moveY.
        // The accumulated gesture distance since becoming responder is
        // gestureState.dx, gestureState.dy.
        console.log(`gestureState.dy: ${gestureState.dy}`);
        if(gestureState.dy>0){
        setGesturePosition({ x: gestureState.dx, y: gestureState.dy });
        getSwipePosition(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // User has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
       
        console.log('Gesture released');
      },
    })
  ).current;

  const generateRandomFutureDate = () => {
    const today = new Date();
    const maxDaysToAdd = 120; 
  
    const randomDaysToAdd = Math.floor(Math.random() * maxDaysToAdd);
  
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + randomDaysToAdd);
  
    return futureDate;
  }


  const makeReservation = async () => {
    const bookingDate = generateRandomFutureDate();
    console.log("booking date is ", bookingDate)

    try {
        const batch = writeBatch(db)
        const vehicleId = car.licensePlate
        console.log("vehicle id is ", vehicleId)
        const renterDocRef = doc(db, "Renters", auth.currentUser.email)
        const vehicleDocRef = doc(db, "Vehicles", vehicleId)
        const vehicleDoc = await getDoc(vehicleDocRef)
        const bookingDocRef = doc(collection(db, "Bookings"))
        const ownerRef = vehicleDoc.data().owner
        // const vehicleImg = vehicleDoc.data().photoUrl;
        console.log("auth email ", auth.currentUser.email)
        // console.log("vehicleImg :", vehicleImg)
        const bookingObj = {
          bookingDate: bookingDate,
          bookingStatus: "Pending",
          renter: renterDocRef,
          vehicle: vehicleDocRef,
        }
        
        batch.set(bookingDocRef, bookingObj)
        batch.set(doc(collection(renterDocRef, "reservations")), {"booking": bookingDocRef})
        batch.set(doc(collection(ownerRef,"bookings")), {"bookingId": bookingDocRef})

        console.log("before commit")
        await batch.commit()
        console.log("batch commited")
        alert("Please wait for confirmation from the car owner")
    }
    catch(err) {
        console.log("cannot save listing: ", err)
    }
 
    console.log(`Booking date: ${bookingDate}`);
    console.log('Book button pressed');
  };

  return (
    <View  {...panResponder.panHandlers} style={[styles.container, {transform: [{translateY: gesturePosition.y}]}]} >
        <View style={styles.dragIndicator} />
        {car && <Text style={styles.text}>{car.name}</Text>}
        {car && <Text style={styles.text}>Price: ${car.price}</Text>}
        {car && <Text style={styles.text}>Seats: {car.capacity}</Text>}
        {car && <Text style={styles.text}>Doors: {car.doors}</Text>}
        <Text style={styles.LocationText}>Pick Up Location: {car.location}</Text>
        <Image source={{ uri: car.photoUrl }} style={styles.carImg} />
        <TouchableOpacity onPress={makeReservation} style={styles.bookButton}>
          <Text style={styles.buttonText}>Book Now</Text>
        </TouchableOpacity>
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dragIndicator: {
    borderBottomColor: 'grey',
    borderBottomWidth: 3,
    width: '15%',
    alignSelf: 'center',
    borderRadius: 20,
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookButton: {
    marginTop: 20,
    width: "70%",
    height: 50,
    backgroundColor: 'green',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white'
  },
  LocationText: {
    fontSize: 14,
    fontWeight: '300',
  },
  carImg: {
    height: 200,
    width: "90%"
  }
});

export default BottomSheet;
