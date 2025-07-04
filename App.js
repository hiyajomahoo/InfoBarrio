import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Register from './Pantallas/Register';
import Home from './Pantallas/Home';
import Perfil from './Pantallas/perfil';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs({ user, onLogout }) {
  return (
    <Tab.Navigator>
      
      <Tab.Screen name="Home">
        {() => <Home user={user} />}
      </Tab.Screen>

      <Tab.Screen name="Perfil">
          { () => 
            <Perfil
              user={user}
              onLogout={onLogout}
            />
          }
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
