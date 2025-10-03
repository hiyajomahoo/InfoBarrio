import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function Perfil({ userData, onLogout, navigation }) {
  const [password, setPassword] = useState("********");
  const [fechaNacimiento, setFechaNacimiento] = useState("29/09/2006");
  const [dni, setDni] = useState("57.555.666");

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn}>
        <FontAwesome name="arrow-left" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.header}>Perfil</Text>
      <View style={styles.avatarContainer}>
        <Image source={require("../assets/icon.png")} style={styles.avatar} />
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={userData.name || ""}
          editable={false}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={userData.email || ""}
          editable={false}
        />
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text style={styles.label}>Fecha De Nacimiento</Text>
        <TextInput
          style={styles.input}
          value={fechaNacimiento}
          onChangeText={setFechaNacimiento}
        />
        <Text style={styles.label}>D.N.I</Text>
        <TextInput
          style={styles.input}
          value={dni}
          onChangeText={setDni}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.containerT}>
        <Text style={styles.data}>Nombre: {userData.name}</Text>
        <Text style={styles.data}>Correo: {userData.email}</Text>
        <Text style={styles.data}>Número: {userData.numero}</Text>
      </View>
      <Button
        title="Cerrar sesión"
        onPress={() => onLogout(navigation)}
        color="#d9534f"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#252525",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    borderWidth: 1,
    borderColor: "red",
  },
  backBtn: { position: "absolute", top: 30, left: 20, zIndex: 2 },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  avatarContainer: { alignItems: "center", marginBottom: 20 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#2979FF",
  },
  editAvatar: {
    position: "absolute",
    bottom: 0,
    right: 15,
    backgroundColor: "#2979FF",
    borderRadius: 16,
    padding: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  form: { marginTop: 10 },
  label: { fontSize: 14, color: "#333", marginBottom: 4, marginTop: 10 },
  input: {
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#292C6D",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  data: {
    color: "white",
    textAlign: "left",
  },
  containerT: {
    backgroundColor: "#252525",
    alignItems: "left",
    justifyContent: "center",
  },
  btnCloseUser: {
    backgroundColor: "red",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
