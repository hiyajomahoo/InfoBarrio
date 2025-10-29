import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

export default function Perfil() {
  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
          style={styles.avatar}
        />
        <View style={styles.headerText}>
          <Text style={styles.name}>Patricio Baute</Text>
          <Text style={styles.description}>
            Startup dedicada a desarrollar herramientas de inteligencia
            artificial enfocadas en mejorar la productividad y creatividad de
            los programadores.
          </Text>
        </View>
      </View>

      <View style={styles.itemList}>
        {[1, 2, 3].map((i) => (
          <TouchableOpacity key={i} style={styles.itemCard}>
            <View style={styles.itemIconBox}>
              <FontAwesome name="shapes" size={32} color="#888" />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Title</Text>
              <Text style={styles.itemDescription}>
                Descripción duis aute irure dolor in reprehenderit in voluptate
                velit.
              </Text>
              <Text style={styles.itemTime}>Hoy · 23 min</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#aaa" />
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  headerText: { flex: 1 },
  name: { fontSize: 18, fontWeight: "bold", color: "#222", marginBottom: 5 },
  description: { fontSize: 13, color: "#555" },

  itemList: { flex: 1 },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  itemIconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  itemDescription: { fontSize: 13, color: "#555", marginVertical: 4 },
  itemTime: { fontSize: 12, color: "#999" },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
  },
  addButton: {
    backgroundColor: "#2979FF",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});
