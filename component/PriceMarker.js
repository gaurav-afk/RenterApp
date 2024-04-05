import { StyleSheet, View, Text } from 'react-native';

export default PriceMarker = ({ price }) => {
    return (
        <View style={styles.priceTag}>
            <Text style={styles.price}>${price}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    priceTag: {
        padding: 5,
        backgroundColor: 'orange',
        borderRadius: 10
    },
    price: {
        fontWeight: '500',
        color: 'white',
        fontSize: 12
    }
});