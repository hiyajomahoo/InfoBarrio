import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { API_URL } from "../config/api";

export default function Login({ onLogin, navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Por favor completá todos los campos");
      return;
    }
    setLoading(true);
    setError("");
    
    try {
      console.log('URL de la API:', API_URL);
  console.log('Intentando login con username:', username);
      
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      });
      
      const data = await response.json();
      console.log('Status:', response.status);
      console.log('Respuesta del servidor:', data);
      
      if (response.ok && data.user) {
        onLogin({ ...data.user, token: data.token }, navigation);
      } else {
        setError(data.message || "Credenciales incorrectas");
      }
    } catch (e) {
      console.log('Error completo:', e);
      if (e.response) {
        // El servidor respondió con un status code fuera del rango 2xx
        console.log('Datos del error:', e.response.data);
        console.log('Status del error:', e.response.status);
        setError(e.response.data.message || "Error en la autenticación");
      } else if (e.request) {
        // La petición fue hecha pero no se recibió respuesta
        console.log('Error de conexión - no hay respuesta');
        setError("No se pudo conectar con el servidor");
      } else {
        // Algo falló al configurar la petición
        console.log('Error de configuración:', e.message);
        setError("Error al procesar la solicitud");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/icon.png")} style={styles.logo} />
      <Text style={styles.title}>InfoBarrio</Text>
      <Text style={styles.subtitle}>Inicio de sesion</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
      <TouchableOpacity style={styles.link}>
        <Text style={styles.linkText}>Olvidé mi contraseña</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Cargando...' : 'Iniciar sesion'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.linkText}>Crear cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: { width: 120, height: 120, marginBottom: 10 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 14, color: "#333", marginBottom: 10 },
  input: {
    width: "100%",
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#2979FF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: { marginTop: 8 },
  linkText: { color: "#2979FF", fontSize: 14 },
});
