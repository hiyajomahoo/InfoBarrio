import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";

import Login from "./Pantallas/Login";
import Register from "./Pantallas/Register";
import Home from "./Pantallas/Home";
import Recientes from "./Pantallas/Recientes";
import NuevaPublicacion from "./Pantallas/NuevaPublicacion";
import Publicacion from "./Pantallas/Publicacion";
import Perfil from "./Pantallas/perfil";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs({ userData, onLogout, navigation }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#eaf0ff",
          borderTopWidth: 1,
          borderColor: "#ddd",
        },
      }}
    >
      <Tab.Screen
        name="Perfil"
        children={() => (
          <Perfil
            userData={userData}
            onLogout={onLogout}
            navigation={navigation}
          />
        )}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user-circle" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Buscar"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="search" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Crear"
        component={NuevaPublicacion}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="plus" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Inicio"
        component={Recientes}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="star" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});

  // Función para iniciar sesión
  const handleLogin = (data, navigation) => {
    setUserData(data);
    setIsLoggedIn(true);
    navigation.replace("Tabs"); // <-- Elimina los parámetros extra
  };

  // Función para cerrar sesión
  const handleLogout = (navigation) => {
    setUserData({});
    setIsLoggedIn(false);
    navigation.replace("Login");
  };

  // Función para registrar usuario (simulada)
  const handleRegister = (data, navigation) => {
    setUserData(data);
    setIsLoggedIn(true);
    navigation.replace("Tabs"); // <-- Elimina los parámetros extra
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Login"
          children={({ navigation }) => (
            <Login onLogin={handleLogin} navigation={navigation} />
          )}
        />
        <Stack.Screen
          name="Register"
          children={({ navigation }) => (
            <Register onRegister={handleRegister} navigation={navigation} />
          )}
        />
        <Stack.Screen
          name="Tabs"
          children={({ navigation }) => (
            <Tabs
              userData={userData}
              onLogout={handleLogout}
              navigation={navigation}
            />
          )}
        />
        <Stack.Screen name="Publicacion" component={Publicacion} options={{headerShown: true}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
