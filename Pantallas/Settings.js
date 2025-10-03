import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

function SettingItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <FontAwesome
        name={icon}
        size={22}
        color="#555"
        style={{ marginRight: 12 }}
      />
      <Text style={styles.itemText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function Settings({ navigation, onLogout }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Configuración</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.box}>
          <SettingItem icon="user" label="Editar Perfil" />
          <SettingItem icon="shield" label="Seguridad" />
          <SettingItem icon="bell" label="Notificaciones" />
          <SettingItem icon="lock" label="Privacidad" />
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Soporte y Ayuda</Text>
        <View style={styles.box}>
          <SettingItem icon="question-circle" label="Soporte" />
          <SettingItem icon="info-circle" label="Terms and Policies" />
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Favoritos</Text>
        <View style={styles.box}>
          <SettingItem icon="bookmark" label="Publicaciones" />
        </View>
      </View>
      <View style={styles.box}>
        <SettingItem icon="flag" label="Reportar un problema" />
        <SettingItem icon="trash" label="Eliminar Cuenta" />
        <SettingItem
          icon="sign-out"
          label="Cerrar Sesion"
          onPress={() => onLogout(navigation)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 20,
  },
  section: { marginBottom: 18 },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 6,
    color: "#333",
  },
  box: {
    backgroundColor: "#f4f4f8",
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  itemText: { fontSize: 15, color: "#222" },
});
