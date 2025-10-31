import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import axios from 'axios';
import API_URL from "../config/api";

// Pantalla de registro de usuario.
// Notas importantes:
// - El backend espera username en lugar de email para el login automático.
// - Tras el registro intentamos hacer login automáticamente usando { username, password }.
export default function Register({ navigation, onRegister }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [numero, setNumero] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPass, setRepeatPass] = useState("");
  const [dni, setDni] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !name || !numero || !password || !repeatPass || !dni) {
      setError("Por favor completá todos los campos");
      return;
    }
    if (password !== repeatPass) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Registro del usuario
      const registerRes = await axios.post(`${API_URL}/api/usuarios`, {
        username,
        email,
        name,
        numberPhone: numero,
        password,
        dni
      });

      if (registerRes.status === 201) {
        // Registrar ok, ahora iniciar sesión automáticamente usando username (el backend espera username)
        const { data: loginData } = await axios.post(`${API_URL}/api/login`, {
          username,
          password
        });

        if (loginData && loginData.user) {
          onRegister({ ...loginData.user, token: loginData.token }, navigation);
        } else {
          setError((loginData && loginData.message) || "Registro correcto, pero no se pudo iniciar sesión automáticamente");
        }
      } else {
        // Si axios devolvió 2xx distinto a 201 (raro), leer mensaje de respuesta
        setError((registerRes.data && registerRes.data.message) || "Error al registrar usuario");
      }
    } catch (e) {
      console.error(e);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/icon.png")} style={styles.logo} />
      <Text style={styles.title}>InfoBarrio</Text>
      <Text style={styles.subtitle}>Crear cuenta</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Número de teléfono"
        value={numero}
        onChangeText={setNumero}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Repetir Contraseña"
        value={repeatPass}
        onChangeText={setRepeatPass}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="DNI"
        value={dni}
        onChangeText={setDni}
        keyboardType="numeric"
      />
      {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Cargando...' : 'Continuar'}</Text>
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
});
