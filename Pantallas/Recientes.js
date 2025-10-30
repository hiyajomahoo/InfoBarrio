import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import API_URL from "../config/api";

const anunciosMock = [
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

const trabajosMock = [
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

function AnuncioItem({ item, favorited, onToggleFavorite }) {
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
      <TouchableOpacity style={styles.heartBtn} onPress={() => onToggleFavorite(item.id)}>
        <FontAwesome name={favorited ? 'heart' : 'heart-o'} size={18} color={favorited ? '#e74c3c' : '#777'} />
      </TouchableOpacity>
    </View>
  );
}

function TrabajoItem({ item, favorited, onToggleFavorite }) {
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
      <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => onToggleFavorite(item.id)}>
        <FontAwesome name={favorited ? 'heart' : 'heart-o'} size={18} color={favorited ? '#e74c3c' : '#777'} />
      </TouchableOpacity>
    </View>
  );
}

export default function Recientes({ userData }) {
  const [anuncios, setAnuncios] = useState([]);
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
  fetch(`${API_URL}/api/post`)
      .then((res) => res.json())
      .then((data) => {
        setAnuncios(data.filter((p) => p.post_type_id === 1));
        setTrabajos(data.filter((p) => p.post_type_id === 4 || p.post_type_id === 5));
        // after loading posts, if user logged in, load favorites
        if (userData && userData.token) {
          fetch(`${API_URL}/api/favorites`, {
            headers: { Authorization: `Bearer ${userData.token}` },
          })
            .then((r) => r.json())
            .then((favData) => {
              if (Array.isArray(favData)) {
                const set = new Set(favData.map((f) => Number(f.post_id)));
                setFavorites(set);
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        setAnuncios([]);
        setTrabajos([]);
      })
      .finally(() => setLoading(false));
  }, [userData]);

  const toggleFavorite = async (postId) => {
    if (!userData || !userData.token) {
      Alert.alert("Necesitas iniciar sesión", "Iniciá sesión para guardar favoritos");
      return;
    }
    if (favLoading) return;
    setFavLoading(true);
    const isFav = favorites.has(Number(postId));
    // optimistic update
    const previous = new Set(favorites);
    const next = new Set(favorites);
    if (!isFav) next.add(Number(postId)); else next.delete(Number(postId));
    setFavorites(next);
    try {
      if (!isFav) {
        const res = await fetch(`${API_URL}/api/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${userData.token}` },
          body: JSON.stringify({ post_id: postId }),
        });
        if (!res.ok) {
          setFavorites(previous);
          Alert.alert("Error", "No se pudo guardar en favoritos");
        }
      } else {
        const res = await fetch(`${API_URL}/api/favorites/${postId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${userData.token}` },
        });
        if (!res.ok) {
          setFavorites(previous);
          Alert.alert("Error", "No se pudo quitar de favoritos");
        }
      }
    } catch (e) {
      setFavorites(previous);
      Alert.alert("Error", "No se pudo actualizar favorito");
    } finally {
      setFavLoading(false);
    }
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
          {loading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={anuncios}
              renderItem={({ item }) => (
                <AnuncioItem item={item} favorited={favorites.has(Number(item.id))} onToggleFavorite={toggleFavorite} />
              )}
              keyExtractor={(item) => String(item.id)}
            />
          )}
        </View>
        <View style={styles.column}>
          <Text style={styles.columnHeader}>Trabajos Recientes</Text>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={trabajos}
              renderItem={({ item }) => (
                <TrabajoItem item={item} favorited={favorites.has(Number(item.id))} onToggleFavorite={toggleFavorite} />
              )}
              keyExtractor={(item) => String(item.id)}
            />
          )}
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
