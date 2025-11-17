/*
  App.js
  - Entrada principal de la app React Native.
  - Configura la navegación (stack + tabs) y mantiene el estado
    global mínimo: si el usuario está autenticado y sus datos.
  - Guarda/restaura `userData` usando AsyncStorage para persistencia local.
*/
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";

// Import de pantallas (screens) principales
import Login from "./Pantallas/Login";
import Register from "./Pantallas/Register";
import Home from "./Pantallas/Home";
import Recientes from "./Pantallas/Recientes";
import NuevaPublicacion from "./Pantallas/NuevaPublicacion";
import Publicacion from "./Pantallas/Publicacion";
import Perfil from "./Pantallas/perfil";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/*
  Tabs: definición de las pestañas inferiores (Bottom Tab Navigator).
  Recibe `userData` y `onLogout` para pasarlos a las pantallas que los necesiten.
*/
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
      {/* Perfil: pasa userData y la función de logout */}
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

      {/* Buscar: pantalla principal de búsqueda (Home) */}
      <Tab.Screen
        name="Buscar"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="search" size={24} color={color} />
          ),
        }}
      />

      {/* Crear: nueva publicación */}
      <Tab.Screen
        name="Crear"
        children={() => (
          <NuevaPublicacion userData={userData} navigation={navigation} />
        )}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="plus" size={24} color={color} />
          ),
        }}
      />

      {/* Inicio / Recientes */}
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

/*
  App: componente raíz que mantiene el estado de autenticación.
  - `isLoggedIn`: booleano local para saber si el usuario está autenticado.
  - `userData`: objeto con la información del usuario.
  - Funciones handleLogin, handleLogout y handleRegister manejan el
    almacenamiento en AsyncStorage y la navegación.
*/
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // Restaurar sesión desde AsyncStorage al montar la app
    (async () => {
      try {
        const AsyncStorage = await import('@react-native-async-storage/async-storage');
        const raw = await AsyncStorage.default.getItem('userData');
        if (raw) {
          const parsed = JSON.parse(raw);
          setUserData(parsed);
          setIsLoggedIn(true);
        }
      } catch (e) {
        // Si falla la restauración, simplemente no iniciamos sesión automáticamente
      }
    })();
  }, []);

  // Iniciar sesión: guarda userData y navega a las Tabs
  const handleLogin = (data, navigation) => {
    setUserData(data);
    setIsLoggedIn(true);
    (async () => {
      try {
        const AsyncStorage = await import('@react-native-async-storage/async-storage');
        await AsyncStorage.default.setItem('userData', JSON.stringify(data));
      } catch (e) {}
    })();
    navigation.replace("Tabs");
  };

  // Cerrar sesión: limpia estado y AsyncStorage
  const handleLogout = (navigation) => {
    setUserData({});
    setIsLoggedIn(false);
    (async () => {
      try {
        const AsyncStorage = await import('@react-native-async-storage/async-storage');
        await AsyncStorage.default.removeItem('userData');
      } catch (e) {}
    })();
    navigation.replace("Login");
  };

  // Registro: comportamiento similar a login (simulado)
  const handleRegister = (data, navigation) => {
    setUserData(data);
    setIsLoggedIn(true);
    (async () => {
      try {
        const AsyncStorage = await import('@react-native-async-storage/async-storage');
        await AsyncStorage.default.setItem('userData', JSON.stringify(data));
      } catch (e) {}
    })();
    navigation.replace("Tabs");
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
        <Stack.Screen name="Publicacion">
          {({ navigation, route }) => (
            <Publicacion
              route={route}
              navigation={navigation}
              userData={userData}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
