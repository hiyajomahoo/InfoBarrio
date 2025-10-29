import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import Publicacion from "../components/botonPublicacion.js";
import { FontAwesome } from "@expo/vector-icons";

const DATA = [
  {
    id: "1",
    title: "Title",
    description:
      "Description duis aute irure dolor in reprehenderit in voluptate velit.",
    time: "23 min",
  }
];

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>InfoBarrio</Text>
      <View style={styles.searchBar}>
        <FontAwesome
          name="search"
          size={18}
          color="#888"
          style={{ marginLeft: 8 }}
        />
        <TextInput placeholder="Buscar..." style={styles.searchInput} />
      </View>
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Ofertas Servicios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Búsqueda Servicios</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.feedListContainer}>
        <Publicacion item={DATA[0]} onPress={() => navigation.navigate("Publicacion")}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 16,
    height: 36,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: "#333" },
  filterRow: { flexDirection: "row", justifyContent: "center", marginTop: 16 },
  filterBtn: {
    backgroundColor: "#ddd",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginHorizontal: 8,
  },
  filterText: { color: "#333", fontWeight: "500", fontSize: 14 },
});
