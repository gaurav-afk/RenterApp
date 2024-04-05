import { StyleSheet, Text, View, Image } from 'react-native';

export default ReservationItem = ({reservation}) => {
    return (
        <View style={styles.listItem}>

            <Text style={styles.title}>{reservation.vehicle.name} </Text>
            <Image source={{ uri: reservation.vehicle.photoUrl }} style={{ width: 260, height: 160 }} />
            <Text style={styles.text}>License Plate: {reservation.vehicle.licensePlate} </Text>
            <Text style={styles.text}>Car Owner: {reservation.owner.name} </Text>
            <Image source={{ uri: reservation.owner.profilePicUrl }} style={{ width: 50, height: 50, borderRadius: 50 }} />
            <Text style={styles.text}>Booking Date: {new Date(reservation.booking.bookingDate.seconds * 1000).toUTCString()}</Text>
            <Text style={styles.text}>Booking Status: {reservation.booking.bookingStatus}</Text>
            <Text style={styles.text}>Pickup location: {reservation.vehicle.location}</Text>
            <Text style={styles.text}>Price: ${reservation.vehicle.price}</Text>
            {   reservation.booking.bookingStatus === "Confirmed" &&
                <Text style={styles.text}>Confirmation Code: {reservation.booking.bookingConfirmationCode ?? ""} </Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    listItem: {
        height: 'auto',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
        marginVertical: 10,
        backgroundColor: '#C6EBC5',
        padding: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 15,
        textAlign: 'left',
        color: 'black',
        fontWeight: '600',
    },
});