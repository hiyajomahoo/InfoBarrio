import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Publicacion from "../components/botonPublicacion.js";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import API_URL from "../config/api";
import { useFocusEffect } from "@react-navigation/native";

export default function Home({ navigation }) {

  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
    const fetchAll = async () => {
      setLoading(true);
      const endpoints = [
        `${API_URL}/api/post`,
      ];
      let got = false;
      for (const url of endpoints) {
        try {
          const res = await axios.get(url);
          if (!res || !res.data) continue;
          const data = res.data;
          let arr = [];
          if (Array.isArray(data)) arr = data;
          else if (Array.isArray(data.posts)) arr = data.posts;
          else if (data.rows && Array.isArray(data.rows)) arr = data.rows;
          if (arr.length) {
            // normalize minimal fields
            const norm = arr.map((p) => ({
              id: p.id ?? p.post_id ?? Math.random().toString(),
              title: p.title ?? p.titulo ?? "Sin título",
              description: p.description ?? p.descripcion ?? "",
              time: p.created_at ? new Date(p.created_at).toLocaleDateString() : (p.time ?? ""),
              raw: p,
            }));
            setPosts(norm);
            setFilteredPosts(norm);
            got = true;
            break;
          }
        } catch (e) {
          // try next endpoint
        }
      }
      if (!got) {
        setPosts([]);
        setFilteredPosts([]);
      }
      setLoading(false);
    };

    fetchAll();
  })
  return unsubscribe
  }, []);

  // filter posts when search changes
  useEffect(() => {
    if (!search) {
      setFilteredPosts(posts);
      return;
    }
    const q = search.trim().toLowerCase();
    const filtered = posts.filter((p) => {
      const t = (p.title || "").toLowerCase();
      const d = (p.description || "").toLowerCase();
      return t.includes(q) || d.includes(q);
    });
    setFilteredPosts(filtered);
  }, [search, posts]);

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
        <TextInput
          placeholder="Buscar..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
      </View>

      <View style={{ flex: 1, paddingTop: 12 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#2979FF" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={filteredPosts}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <Publicacion
                item={{ title: item.title, description: item.description, time: item.time }}
                onPress={() => navigation.navigate("Publicacion", { post: item.raw })}
              />
            )}
            ListEmptyComponent={<Text style={{ alignSelf: 'center', marginTop: 20 }}>No hay publicaciones</Text>}
          />
        )}
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
