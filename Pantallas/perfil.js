import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import API_URL from "../config/api";
import { FlatList } from "react-native-gesture-handler";

export default function Perfil({ userData, route, navigation }) {
  const viewingUserId = route?.params?.userId || null;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${userData.token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => {
        console.error(err);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [userData, viewingUserId]);

  // Cargar publicaciones del perfil (si viewingUserId está presente, mostrar las de ese usuario)
  useEffect(() => {
    const ownerId = viewingUserId ?? user?.id;
    if (!ownerId) return;
    setPostsLoading(true);
    fetch(`${API_URL}/api/post/user/${ownerId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
        else if (data && Array.isArray(data.posts)) setPosts(data.posts);
        else setPosts([]);
      })
      .catch((err) => {
        console.error('Error cargando posts de usuario', err);
        setPosts([]);
      })
      .finally(() => setPostsLoading(false));
  }, [viewingUserId, user]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={{ padding: 20 }}>No hay información de usuario. Iniciá sesión.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Image
          source={{ uri: user.profile_photo || "https://randomuser.me/api/portraits/women/44.jpg" }}
          style={styles.avatar}
        />
        <View style={styles.headerText}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.description}>{user.bio || "Sin biografía"}</Text>
        </View>
        {viewingUserId && userData?.id !== user.id ? (
          <TouchableOpacity style={[styles.followBtn, isFollowing ? styles.following : null]} onPress={toggleFollow} disabled={followLoading}>
            <Text style={{ color: isFollowing ? '#fff' : '#2979FF', fontWeight: 'bold' }}>{isFollowing ? 'Siguiendo' : 'Seguir'}</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.itemList}>
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
  followBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2979FF',
    backgroundColor: '#fff',
  },
  following: {
    backgroundColor: '#2979FF',
    borderColor: '#2979FF',
  },
});
