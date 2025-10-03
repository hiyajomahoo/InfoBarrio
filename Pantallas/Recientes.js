import React from "react";
import { View, Text, TextInput, StyleSheet, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const anuncios = [
  {
    id: "1",
    title: "Mesa de comedor 6 puestos en buen estado",
    price: "$45.000",
    location: "San Vte. Florito",
  },
  {
    id: "2",
    title: "Vendo PS4 + 2 joysticks + 5 juegos",
    price: "$250.000",
    location: "San Vte. Florito",
  },
  {
    id: "3",
    title: "Curso de repostería básica en centro cultural",
    price: "$20.000 por cupo",
    location: "San Vte. Florito",
  },
];

const trabajos = [
  {
    id: "1",
    title: "Creación de páginas web...",
    color: "#8D5EFF",
    desc: "Solicita tu página web hoy mismo.",
  },
  {
    id: "2",
    title: "Creación de páginas web...",
    color: "#2DCDA7",
    desc: "Solicita tu página web hoy mismo.",
  },
  {
    id: "3",
    title: "Creación de páginas web...",
    color: "#B97A56",
    desc: "Solicita tu página web hoy mismo.",
  },
  {
    id: "4",
    title: "Creación de páginas web...",
    color: "#4A90E2",
    desc: "Solicita tu página web hoy mismo.",
  },
];

function AnuncioItem({ item }) {
  return (
    <View style={styles.anuncioItem}>
      <FontAwesome
        name="image"
        size={24}
        color="#888"
        style={{ marginBottom: 4 }}
      />
      <Text style={styles.anuncioTitle}>{item.title}</Text>
      <Text style={styles.anuncioPrice}>{item.price}</Text>
      <Text style={styles.anuncioLoc}>{item.location}</Text>
    </View>
  );
}

function TrabajoItem({ item }) {
  return (
    <View style={[styles.trabajoItem, { borderLeftColor: item.color }]}>
      <FontAwesome
        name="code"
        size={18}
        color={item.color}
        style={{ marginRight: 8 }}
      />
      <View>
        <Text style={styles.trabajoTitle}>{item.title}</Text>
        <Text style={styles.trabajoDesc}>{item.desc}</Text>
      </View>
    </View>
  );
}

export default function Recientes() {
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
      <View style={styles.columns}>
        <View style={styles.column}>
          <Text style={styles.columnHeader}>Anuncios Recientes</Text>
          <FlatList
            data={anuncios}
            renderItem={({ item }) => <AnuncioItem item={item} />}
            keyExtractor={(item) => item.id}
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.columnHeader}>Trabajos Recientes</Text>
          <FlatList
            data={trabajos}
            renderItem={({ item }) => <TrabajoItem item={item} />}
            keyExtractor={(item) => item.id}
          />
        </View>
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
  columns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    flex: 1,
    paddingHorizontal: 10,
  },
  column: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 12,
    marginHorizontal: 5,
    padding: 10,
  },
  columnHeader: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    alignSelf: "center",
  },
  anuncioItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  anuncioTitle: { fontWeight: "bold", fontSize: 13, textAlign: "center" },
  anuncioPrice: { color: "#555", fontSize: 12, textAlign: "center" },
  anuncioLoc: { color: "#888", fontSize: 11, textAlign: "center" },
  trabajoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  trabajoTitle: { fontWeight: "bold", fontSize: 13 },
  trabajoDesc: { color: "#555", fontSize: 12 },
});
