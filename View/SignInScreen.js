import { useState } from "react"
import { StyleSheet, Text, TextInput, Pressable, View, ImageBackground } from "react-native"
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";

const SignInScreen = () => {
    const [username, setUserName] = useState()
    const [password, setPassword] = useState()

    const signIn = async () => {
        try {
            const docRef = doc(db, "Renters", username)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                console.log("is renter")
                await signInWithEmailAndPassword(auth, username, password)
                console.log("signin success: ", auth.currentUser)
            }
            else {
                console.log("not a renter")
                alert("Invalid credentials")
            }

        }
        catch (err) {
            console.log("sign in error: ", err)
            alert("Sign in failed")
        }
    }

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{
                    // uri: 'https://i.pinimg.com/originals/76/49/ba/7649ba7c0d31bf9667faa7e123df34ef.jpg' 
                    // uri: 'https://www.wsupercars.com/thumbnails-phone/Lamborghini/2024-Lamborghini-Revuelto-007.jpg' 
                    uri: 'https://www.wsupercars.com/wallpapers-phone/Aston-Martin/2024-Aston-Martin-Vantage-GT3-001-2800p.jpg' 
                    // uri: 'https://www.wsupercars.com/thumbnails-phone/Aston-Martin/2024-Aston-Martin-Vantage-GT3-001.jpg' 
                    // uri: 'https://www.wsupercars.com/thumbnails-phone/Bugatti/2019-Bugatti-Divo-004.jpg'
                }}
                style={styles.backgroundImage}
            >
                <View style={styles.overlay} />

                <View style={styles.content}>
                    <Text style={styles.appTitle}>Renter App</Text>
                    <Text style={styles.textFieldHeading}>Username: </Text>
                    <TextInput
                        style={styles.textField}
                        placeholder="Enter User Name"
                        value={username}
                        onChangeText={setUserName}
                    />

                    <Text style={styles.textFieldHeading}>Password: </Text>
                    <TextInput
                        style={styles.textField}
                        placeholder="Enter Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />

                    <Pressable onPress={signIn} style={styles.signInButton}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </Pressable>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
    },
    overlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    textFieldHeading: {
        fontSize: 18,
        alignSelf: 'center',
        color: 'white',
        marginHorizontal: 10,
        paddingTop: 10
    },
    textField: {
        borderWidth: 2,
        borderColor: 'white',
        color: 'white',
        padding: 10,
        width: '80%',
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
    },
    signInButton: {
        width: '70%',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'orange',
        padding: 15,
        borderRadius: 10,
        marginTop: 15,
        marginBottom: 80
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: 'white'
    },
    appTitle: {
        fontSize: 50,
        fontWeight: "bold",
        justifyContent: "center",
        color: "white"
      }
});

export default SignInScreen