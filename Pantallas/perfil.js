/*
  Pantalla: Perfil
  - Muestra información de un usuario y sus publicaciones.
  - Si `route.params.userId` está presente, muestra el perfil de ese usuario,
    si no, intenta obtener el perfil del usuario autenticado mediante `/api/me`.
  - Permite seguir/dejar de seguir y muestra la lista de publicaciones del usuario.
*/
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert, FlatList } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import API_URL from "../config/api";
import Publicacion from "../components/botonPublicacion";
import { useFocusEffect } from '@react-navigation/native';

export default function Perfil({ userData, route, navigation }) {
  const viewingUserId = route?.params?.userId || null;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Normaliza arrays de posts recibidos de distintas respuestas del backend
  const normalizePosts = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.map((item) => ({
      id: item.id ?? item.post_id ?? Math.random().toString(),
      title: item.title ?? item.titulo ?? 'Sin título',
      description: item.description ?? item.descripcion ?? item.body ?? '',
      time: item.createdAt ?? item.created_at ?? item.fecha ?? '',
      raw: item,
      image: (item.photos && item.photos[0]) || item.image || null,
    }));
  }

  const fetchProfileAndPosts = async () => {
    setLoading(true);
    setPostsLoading(true);
    try {
      // Obtener datos de usuario: si viewingUserId existe, pedir /usuarios/:id, si no, pedir /me con token
      let fetchedUser = null;
      if (viewingUserId) {
        const res = await fetch(`${API_URL}/api/usuarios/${viewingUserId}`);
        const data = await res.json();
        fetchedUser = data.user || data || null;
      } else {
        const res = await fetch(`${API_URL}/api/me`, { headers: { Authorization: `Bearer ${userData?.token}` } });
        const data = await res.json();
        fetchedUser = data.user || data || null;
      }
      setUser(fetchedUser);

      // Posts del usuario (usar el id obtenido si es necesario)
      const ownerId = viewingUserId ?? fetchedUser?.id;
      if (ownerId) {
        const res2 = await fetch(`${API_URL}/api/post/user/${ownerId}`);
        const data2 = await res2.json();
        let arr = [];
        if (Array.isArray(data2)) arr = data2;
        else if (data2 && Array.isArray(data2.posts)) arr = data2.posts;
        else if (data2 && Array.isArray(data2.rows)) arr = data2.rows;
        else if (data2) arr = [data2];
        setPosts(normalizePosts(arr));
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error('Error cargando perfil y posts', err);
      setUser(null);
      setPosts([]);
    } finally {
      setLoading(false);
      setPostsLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchProfileAndPosts();
    }, [viewingUserId, userData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfileAndPosts();
  }

  // Toggle follow/unfollow con manejo optimista de UI
  const toggleFollow = async () => {
    if (!userData || !userData.token) {
      Alert.alert('Necesitas iniciar sesión', 'Iniciá sesión para seguir usuarios');
      return;
    }
    const targetId = viewingUserId ?? user?.id;
    if (!targetId) return;
    setFollowLoading(true);
    const prev = isFollowing;
    setIsFollowing(!prev);
    try {
      if (!prev) {
        const res = await fetch(`${API_URL}/api/follows`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userData.token}` },
          body: JSON.stringify({ followed_id: targetId })
        });
        if (!res.ok) {
          setIsFollowing(prev);
          Alert.alert('Error', 'No se pudo seguir al usuario');
        }
      } else {
        const res = await fetch(`${API_URL}/api/follows/${targetId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${userData.token}` }
        });
        if (!res.ok) {
          setIsFollowing(prev);
          Alert.alert('Error', 'No se pudo dejar de seguir al usuario');
        }
      }
    } catch (e) {
      setIsFollowing(prev);
      Alert.alert('Error', 'No se pudo actualizar seguimiento');
    } finally {
      setFollowLoading(false);
    }
  }

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
        {postsLoading ? (
          <ActivityIndicator size="large" color="#2979FF" style={{ marginTop: 20 }} />
        ) : (
            <FlatList
            data={posts}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <Publicacion
                item={item}
                onPress={() => navigation.navigate("Publicacion", { postId: item.id })}
              />
            )}
            refreshing={refreshing}
            onRefresh={onRefresh}
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