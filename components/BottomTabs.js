import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function BottomTabs({ navigation, activeTab }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
        <FontAwesome
          name="user-circle"
          size={28}
          color={activeTab === "Perfil" ? "#2979FF" : "#aaa"}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <FontAwesome
          name="search"
          size={28}
          color={activeTab === "Home" ? "#2979FF" : "#aaa"}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("NuevaPublicacion")}>
        <View style={styles.plusBtn}>
          <FontAwesome name="plus" size={24} color="#333" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Recientes")}>
        <FontAwesome
          name="star"
          size={28}
          color={activeTab === "Recientes" ? "#2979FF" : "#aaa"}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
        <FontAwesome
          name="cog"
          size={28}
          color={activeTab === "Settings" ? "#2979FF" : "#aaa"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#eaf0ff",
    paddingVertical: 10,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  plusBtn: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: "#2979FF",
    alignItems: "center",
    justifyContent: "center",
  },
});
