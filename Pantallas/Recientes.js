import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import API_URL from "../config/api";
import Publicacion from "../components/botonPublicacion.js";
import { useFocusEffect } from '@react-navigation/native';


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
      <View style={{ flex: 1 }}>
        <Text style={styles.trabajoTitle}>{item.title}</Text>
        <Text style={styles.trabajoDesc}>{item.desc}</Text>
      </View>
    </View>
  );
}

export default function Recientes({ userData, navigation }) {
  const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [refreshing, setRefreshing] = useState(false);
  
    const fetchNewest = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${API_URL}/api/post/getNewestPost`);
        const data = res && res.data ? res.data : [];
        let arr = [];
        if (Array.isArray(data)) arr = data;
        else if (data.posts && Array.isArray(data.posts)) arr = data.posts;
        else if (data.rows && Array.isArray(data.rows)) arr = data.rows;
        else if (data) arr = [data];

        const normalized = arr.map((item) => ({
          id: item.id ?? item.post_id ?? Math.random().toString(),
          title: item.title ?? item.titulo ?? 'Sin título',
          description: item.description ?? item.descripcion ?? item.body ?? '',
          time: item.createdAt ?? item.created_at ?? item.fecha ?? '',
          raw: item,
          image: (item.photos && item.photos[0]) || item.image || null,
        }));

        setPosts(normalized);
      } catch (err) {
        console.log("Error fetching newest posts", err.message || err);
        setError("No se pudieron cargar las publicaciones recientes");
        setPosts([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    useFocusEffect(
      useCallback(() => {
        fetchNewest();
      }, [])
    );

    const onRefresh = () => {
      setRefreshing(true);
      fetchNewest();
    }
  
    const renderItem = ({ item }) => {
      return (
        <Publicacion
          item={{ title: item.title, description: item.description, time: item.time, image: item.image }}
          onPress={() => navigation.navigate("Publicacion", { publication: item.raw ?? item })}
        />
      );
    };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>InfoBarrio</Text>
      <View style={styles.searchBar}>
        <FontAwesome name="search" size={18} color="#888" style={{ marginLeft: 8 }} />
        <TextInput placeholder="Buscar..." style={styles.searchInput} />
      </View>
      <View style={styles.columns}>
        <View style={styles.column}>
          <Text style={styles.columnHeader}>Anuncios Recientes</Text>
          <View>
            {loading ? (
              <ActivityIndicator size="large" color="#2979FF" style={{ marginTop: 20 }} />
            ) : error ? (
              <Text style={{ color: "red", alignSelf: "center", marginTop: 16 }}>{error}</Text>
            ) : (
              <FlatList
                data={posts}
                keyExtractor={(item, index) => String(item.id ?? item._id ?? index)}
                renderItem={renderItem}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ListEmptyComponent={<Text style={{ alignSelf: "center", marginTop: 16 }}>No hay publicaciones</Text>}
              />
            )}
          </View>
        </View>
        <View style={styles.column}>
          <Text style={styles.columnHeader}>Trabajos Recientes</Text>
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
  heartBtn: { position: 'absolute', top: 8, right: 8 },
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