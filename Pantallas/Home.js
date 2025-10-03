import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const DATA = [
  {
    id: "1",
    title: "Title",
    description:
      "Description duis aute irure dolor in reprehenderit in voluptate velit.",
    time: "23 min",
  },
  {
    id: "2",
    title: "Title",
    description:
      "Description duis aute irure dolor in reprehenderit in voluptate velit.",
    time: "23 min",
  },
  {
    id: "3",
    title: "Title",
    description:
      "Description duis aute irure dolor in reprehenderit in voluptate velit.",
    time: "23 min",
  },
  {
    id: "4",
    title: "Title",
    description:
      "Description duis aute irure dolor in reprehenderit in voluptate velit.",
    time: "23 min",
  },
];

function FeedItem({ item }) {
  return (
    <View style={styles.feedItem}>
      <View style={styles.feedImagePlaceholder}>
        <FontAwesome name="picture-o" size={40} color="#aaa" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.feedTitle}>{item.title}</Text>
        <Text style={styles.feedDesc}>{item.description}</Text>
        <View style={styles.feedFooter}>
          <FontAwesome name="clock-o" size={14} color="#888" />
          <Text style={styles.feedTime}>Today • {item.time}</Text>
        </View>
      </View>
      <FontAwesome name="chevron-right" size={20} color="#888" />
    </View>
  );
}

export default function Home() {
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
        <FlatList
          data={DATA}
          renderItem={({ item }) => <FeedItem item={item} />}
          keyExtractor={(item) => item.id}
        />
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
  feedListContainer: { flex: 1, backgroundColor: "#eee", marginTop: 16 },
  feedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    padding: 12,
  },
  feedImagePlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  feedTitle: { fontWeight: "bold", fontSize: 16 },
  feedDesc: { color: "#555", fontSize: 13, marginVertical: 2 },
  feedFooter: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  feedTime: { marginLeft: 4, color: "#888", fontSize: 12 },
});
