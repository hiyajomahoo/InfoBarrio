import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import API_URL from "../config/api";

export default function Perfil({ userData, route }) {
  const viewingUserId = route?.params?.userId || null;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // If viewing a different user's profile, fetch public profile
    if (viewingUserId) {
      fetch(`${API_URL}/api/usuarios/${viewingUserId}`)
        .then((res) => res.json())
        .then((data) => setUser(data.user))
        .catch((err) => {
          console.error(err);
          setUser(null);
        })
        .finally(() => setLoading(false));
      // check follow status if logged
      if (userData?.token) {
        fetch(`${API_URL}/api/follows/followers/${viewingUserId}`)
          .then((r) => r.json())
          .then((rows) => {
            if (Array.isArray(rows)) {
              const found = rows.find((f) => Number(f.follower_id) === Number(userData.id));
              setIsFollowing(!!found);
            }
          })
          .catch(() => {});
      }
      return;
    }

    // otherwise, show current user (requires auth)
    if (!userData?.token) {
      setLoading(false);
      return;
    }
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

  const toggleFollow = async () => {
    if (!userData || !userData.token) {
      Alert.alert('Necesitas iniciar sesión', 'Iniciá sesión para seguir usuarios');
      return;
    }
    if (!user || !user.id) return;
    setFollowLoading(true);
    const prev = isFollowing;
    setIsFollowing(!prev); // optimistic
    try {
      if (!prev) {
        const res = await fetch(`${API_URL}/api/follows`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userData.token}` },
          body: JSON.stringify({ followed_id: user.id }),
        });
        if (!res.ok) {
          setIsFollowing(prev);
          Alert.alert('Error', 'No se pudo seguir al usuario');
        }
      } else {
        const res = await fetch(`${API_URL}/api/follows/${user.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${userData.token}` },
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
  };

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
        {/* Aquí podrías listar publicaciones del usuario o acciones */}
        {[1, 2, 3].map((i) => (
          <TouchableOpacity key={i} style={styles.itemCard}>
            <View style={styles.itemIconBox}>
              <FontAwesome name="shapes" size={32} color="#888" />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Ejemplo</Text>
              <Text style={styles.itemDescription}>Publicación de ejemplo.</Text>
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
