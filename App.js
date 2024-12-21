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
import AdminScreen from './screen/AdminScreen'; // Admin screen

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack Navigator
const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
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
  const [isAdmin, setIsAdmin] = useState(false); // Track if admin is logged in

  const handleLogin = (role) => {
    // Set login state based on the role
    if (role === 'admin') {
      setIsAdmin(true);
    }
    setIsLoggedIn(true);
  };

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        isAdmin ? (
          // If logged in as admin, show the admin screen
          <Stack.Navigator>
            <Stack.Screen
              name="Admin"
              component={AdminScreen}
             
            />
          </Stack.Navigator>
        ) : (
          // If logged in as a regular user, show the main app with tabs
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
        )
      ) : (
        // Show the Login screen if the user is not logged in
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            initialParams={{
              onLogin: (role) => handleLogin(role), // Pass role ('admin' or 'user')
            }}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;
