import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import your screens
import HomeScreen from './screen/HomeScreen'; 
import CleaningService from './screen/CleaningService';
import RepairingService from './screen/RepairingService';
import PlumbingService from './screen/PlumbingService';
import PaintingService from './screen/PaintingService';
import BookingScreen from './screen/BookingScreen';
import ProfileScreen from './screen/ProfileScreen';
import PaymentScreen from './screen/PaymentScreen';
import LoginScreen from './screen/LoginScreen';
import DateTimePickerScreen from './screen/DateTimePickerScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Homemain" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Cleaning Service" component={CleaningService} />
      <Stack.Screen name="Repairing Service" component={RepairingService} />
      <Stack.Screen name="Plumbing Service" component={PlumbingService} />
      <Stack.Screen name="Painting Service" component={PaintingService} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Booking Screen" component={DateTimePickerScreen} />
    </Stack.Navigator>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if user is logged in

  const handleLogin = () => {
    // After successful login, set isLoggedIn to true
    setIsLoggedIn(true);
  };

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        // Show the main app (tabs) if the user is logged in
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Booking') {
                iconName = focused ? 'calendar' : 'calendar-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Home" component={HomeStackNavigator} options={{ headerShown: false }} />
          <Tab.Screen name="Booking" component={BookingScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      ) : (
        // Show the Login screen if the user is not logged in
        <Stack.Navigator>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            initialParams={{ onLogin: handleLogin }} 
            options={{ headerShown: false }} 
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;
