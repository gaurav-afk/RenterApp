import React, { useState, useEffect } from 'react';
import { StyleSheet, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from './View/MapScreen';
import BookingsScreen from './View/BookingsScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import SignInScreen from './View/SignInScreen';
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "./firebaseConfig"


const Tab = createBottomTabNavigator();

const App = () => {
  const [currentUser, setCurrentUser] = useState()

  const logout = async () => {
    try {
        if (auth.currentUser === null) {
            console.log("no user has logged in")
        }
        else {                
            await signOut(auth)
            console.log("sign out success")
        }
        setCurrentUser(null)
    } catch (err) {
        console.log(err)
    }
}

  useEffect(() => {
    const unsubscribeToUserDataChanges = onAuthStateChanged(auth, (user) => {
      console.log("user is ", user)
      if (user) {
        setCurrentUser(user)
      } else {
        setCurrentUser(null);
      }
    });

    return unsubscribeToUserDataChanges
  })

  return (
    currentUser ? (
      <NavigationContainer>
        <Tab.Navigator initialRouteName="Map"         screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Map') {
                iconName = 'map-marker';
              } else if (route.name === 'Bookings') {
                iconName = 'bookmark'
              }
              return <Icon name={iconName} size={size} color={color} />;
            },
            headerRight: () => (
              <Button
                onPress={logout}
                title="Logout"
              />
            ),
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          }}>
          <Tab.Screen name="Map" component={MapScreen}/>
          <Tab.Screen name="Bookings" component={BookingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    )
    :
    <SignInScreen />

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;