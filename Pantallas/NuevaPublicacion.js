import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import API_URL from "../config/api";

const tipos = ["Venta", "Compra", "Alquiler", "Servicio"];

export default function NuevaPublicacion({ navigation, userData }) {
  const [tipo, setTipo] = useState("Venta");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  const [mapRegion, setMapRegion] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permiso denegado",
            "Necesitamos permiso para acceder a tu ubicación para centrar el mapa"
          );
          setMapRegion({
            latitude: -34.6037,
            longitude: -58.3816,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
          return;
        }

        let userLocation = await Location.getCurrentPositionAsync({});
        setMapRegion({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch (err) {
        console.log("Error obteniendo ubicación:", err);
      }
    })();
  }, []);

  const handlePublish = async () => {
    if (!titulo || titulo.trim().length === 0) {
      Alert.alert("Campo requerido", "El título es obligatorio");
      return;
    }
    /* if (!selectedLocation) {
      Alert.alert("Ubicación requerida", "Debes seleccionar la ubicación desde el mapa");
      return;
    } */
    if (!userData || !userData.token) {
      Alert.alert("Necesitas iniciar sesión", "Iniciá sesión para crear una publicación");
      navigation.navigate("Login");
      return;
    }

    const typeMap = { Venta: 1, Compra: 2, Alquiler: 3, Servicio: 4 };
    const post = {
      user_id: userData.id,
      post_type_id: typeMap[tipo] || 1,
      title: titulo.trim(),
      description: descripcion.trim(),
      price: precio.trim(),
      status: "Disponible",
    };

    try {
  const res = await fetch(`${API_URL}/api/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify(post),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        Alert.alert("Éxito", "Publicación creada correctamente");
        navigation.navigate("Recientes");
      } else {
        Alert.alert("Error", data.message || "No se pudo crear la publicación");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Error de conexión con el servidor");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Nueva Publicación</Text>
      <Text style={styles.label}>Tipo de publicación *</Text>
      <View style={styles.tipoRow}>
        {tipos.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tipoBtn, tipo === t && styles.tipoBtnActive]}
            onPress={() => setTipo(t)}
          >
            <Text style={tipo === t ? styles.tipoTextActive : styles.tipoText}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Título *</Text>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
      />
      <Text style={styles.label}>Fotos *</Text>
      <View style={styles.fotosRow}>
        <TouchableOpacity style={styles.fotoBtn}>
          <Text style={{ fontSize: 32, color: "#aaa" }}>+</Text>
        </TouchableOpacity>
        <Image
          source={require("../assets/icon.png")}
          style={styles.fotoPreview}
        />
        <Image
          source={require("../assets/splash-icon.png")}
          style={styles.fotoPreview}
        />
      </View>
      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Describe los detalles..."
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />
      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.label}>Precio</Text>
          <TextInput
            style={styles.input}
            placeholder="$"
            value={precio}
            onChangeText={setPrecio}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Mapa para seleccionar ubicación */}
      <TouchableOpacity style={styles.button} onPress={handlePublish}>
        <Text style={styles.buttonText}>Publicar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  label: { fontSize: 14, color: "#333", marginBottom: 4, marginTop: 10 },
  tipoRow: { flexDirection: "row", marginBottom: 10 },
  tipoBtn: {
    backgroundColor: "#eee",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
  },
  tipoBtnActive: { backgroundColor: "#2979FF" },
  tipoText: { color: "#333", fontWeight: "500", fontSize: 14 },
  tipoTextActive: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  input: {
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  fotosRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  fotoBtn: {
    width: 70,
    height: 70,
    backgroundColor: "#eee",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  fotoPreview: {
    width: 70,
    height: 70,
    backgroundColor: "#ccc",
    borderRadius: 12,
    marginRight: 10,
  },
  textArea: {
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    height: 100,
    marginBottom: 10,
    textAlignVertical: "top",
  },
  row: { flexDirection: "row", marginBottom: 10 },
  button: {
    backgroundColor: "#2979FF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  mapContainer: {
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: "#eee",
  },
  map: { flex: 1 },
});
