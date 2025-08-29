import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const PublicationScreen = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      // Solicitar permisos de ubicación
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tu ubicación');
        return;
      }

      // Obtener ubicación actual
      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image 
          source={require('../assets/splash-icon.png')}
          style={styles.image}
        />

        <Text style={styles.title}>Titulo de Publicacion</Text>
        <Text style={styles.price}>$10.000</Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Contactar</Text>
        </TouchableOpacity>

        <Text style={styles.description}>
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Consectetur adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae pellentesque sem placerat in id.
        </Text>

        {/* Mapa */}
        <View style={styles.mapPlaceholder}>
          {location ? (
            <MapView
              style={styles.map}
              initialRegion={location}
              showsUserLocation={true} // Muestra el punto azul de usuario
            >
              {/* Marker fijo de la publicación */}
              <Marker
                coordinate={{ latitude: -34.660, longitude: -58.365 }}
                title="Avellaneda"
                description="Av. Mitre 1000"
              />
            </MapView>
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>Cargando mapa...</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, 
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#ccc',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  mapPlaceholder: {
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  map: {
    flex: 1,
    width: '100%',
  },
});

export default PublicationScreen;
