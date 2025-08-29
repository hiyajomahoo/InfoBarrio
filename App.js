import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome'

import Register from './Pantallas/Register';
import Home from './Pantallas/Home';
import Perfil from './Pantallas/perfil';
import PublicationScreen from './Pantallas/Publicacion'; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs({ user, onLogout }) {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      
      <Tab.Screen 
        name="Home" 
        options={{ tabBarIcon: ({ color, size }) => <FontAwesome name="home" size={size} color={color} /> }}
      >
        {() => <Home user={user} />}
      </Tab.Screen>

      <Tab.Screen 
        name="Publicaciones"
        options={{ tabBarIcon: ({ color, size }) => <FontAwesome name="list" size={size} color={color} /> }}
      >
        {() => <PublicationScreen />}
      </Tab.Screen>

      <Tab.Screen 
        name="Perfil" 
        options={{ tabBarIcon: ({ color, size }) => <FontAwesome name="user" size={size} color={color} /> }}
      >
        {() => <Perfil user={user} onLogout={onLogout} />}
      </Tab.Screen>

    </Tab.Navigator>
  );
}


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Register">
            {props => (
              <Register
                {...props}
                onRegister={(data) => {
                  setUserData(data);
                  setIsLoggedIn(true);
                }}
              />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Tabs">
            {() => 
            <Tabs 
              user={userData} onLogout={() => {
                setUserData({});
                setIsLoggedIn(false);
              }} 
            />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
