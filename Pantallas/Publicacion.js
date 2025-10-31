import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { FontAwesome } from '@expo/vector-icons';
import * as Location from "expo-location";
import API_URL from "../config/api";

const PublicationScreen = ({ route, navigation, userData }) => {
  const [location, setLocation] = useState(null);
  const [favorited, setFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [ratingLoading, setRatingLoading] = useState(false);
  // Support passing a `publication` object or a `postId` param.
  const [publication, setPublication] = useState(route?.params?.publication ?? null);
  const [loadingPublication, setLoadingPublication] = useState(!route?.params?.publication && !!(route?.params?.postId || route?.params?.id));

  // When publication changes (or is provided later), set map center if it has a location.
  useEffect(() => {
    (async () => {
      // Si la publicación trae una ubicación (seleccionada en NuevaPublicacion), usarla
      if (publication && publication.location) {
        setLocation({
          latitude: publication.location.latitude,
          longitude: publication.location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        return;
      }

      // Solicitar permisos de ubicación para centrar el mapa en la posición del usuario
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Necesitamos permiso para acceder a tu ubicación"
        );
        return;
      }

      // Obtener ubicación actual
      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, [publication]);

  // If a postId was provided, fetch the publication from the backend
  useEffect(() => {
    const postId = route?.params?.postId ?? route?.params?.id;
    if (!postId) return;
    // If we already have a publication object, skip fetching
    if (publication) return;

    let mounted = true;
    (async () => {
      setLoadingPublication(true);
      try {
        const res = await fetch(`${API_URL}/api/post/${postId}`);
        if (!res.ok) throw new Error('Network response not ok');
        const data = await res.json();
        // backend returns object (controller returns respuesta[0])
        if (mounted) setPublication(data);
      } catch (e) {
        console.error('Error cargando publicación por id', e);
        Alert.alert('Error', 'No se pudo cargar la publicación');
      } finally {
        if (mounted) setLoadingPublication(false);
      }
    })();

    return () => { mounted = false };
  }, [route?.params?.postId, route?.params?.id]);

  useEffect(() => {
    // comprobar si está en favoritos
    (async () => {
      if (!userData || !userData.token || !publication?.id) return;
      try {
        const res = await fetch(`${API_URL}/api/favorites`, {
          headers: { Authorization: `Bearer ${userData.token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          const found = data.find((r) => Number(r.post_id) === Number(publication.id));
          setFavorited(!!found);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, [userData, publication]);

  useEffect(() => {
    // comprobar si seguimos al autor
    (async () => {
      if (!userData || !userData.token || !publication.user_id) return;
      try {
  const res = await fetch(`${API_URL}/api/follows/followers/${publication.user_id}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const found = data.find((f) => Number(f.follower_id) === Number(userData.id));
          setIsFollowing(!!found);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, [userData, publication]);

  const toggleFavorite = async () => {
    if (!userData || !userData.token) {
      Alert.alert('Necesitas iniciar sesión', 'Iniciá sesión para guardar favoritos');
      return;
    }
    setFavLoading(true);
    const previous = favorited;
    // optimistic
    setFavorited(!previous);
    try {
      if (!previous) {
        const res = await fetch(`${API_URL}/api/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userData.token}` },
          body: JSON.stringify({ post_id: publication.id })
        });
        if (!res.ok) {
          setFavorited(previous);
          Alert.alert('Error', 'No se pudo guardar en favoritos');
        }
      } else {
        const res = await fetch(`${API_URL}/api/favorites/${publication.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${userData.token}` }
        });
        if (!res.ok) {
          setFavorited(previous);
          Alert.alert('Error', 'No se pudo quitar de favoritos');
        }
      }
    } catch (e) {
      setFavorited(previous);
      Alert.alert('Error', 'No se pudo actualizar favorito');
    } finally {
      setFavLoading(false);
    }
  };

  const toggleFollow = async () => {
    if (!userData || !userData.token) {
      Alert.alert('Necesitas iniciar sesión', 'Iniciá sesión para seguir usuarios');
      return;
    }
    if (!publication.user_id) return;
    setFollowLoading(true);
    const prev = isFollowing;
    setIsFollowing(!prev); // optimistic
    try {
      if (!prev) {
        const res = await fetch(`${API_URL}/api/follows`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userData.token}` },
          body: JSON.stringify({ followed_id: publication.user_id })
        });
        if (!res.ok) {
          setIsFollowing(prev);
          Alert.alert('Error', 'No se pudo seguir al usuario');
        }
      } else {
        const res = await fetch(`${API_URL}/api/follows/${publication.user_id}`, {
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
  };

  const submitRating = async () => {
    if (!userData || !userData.token) {
      Alert.alert('Necesitas iniciar sesión', 'Iniciá sesión para enviar una calificación');
      return;
    }
    if (!publication.user_id) {
      Alert.alert('Error', 'Publicación sin autor');
      return;
    }
    if (stars < 1 || stars > 5) {
      Alert.alert('Error', 'Elegí una cantidad de estrellas entre 1 y 5');
      return;
    }
    setRatingLoading(true);
    try {
  const res = await fetch(`${API_URL}/api/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userData.token}` },
        body: JSON.stringify({ rated_id: publication.user_id, stars, comment })
      });
      if (res.ok) {
        Alert.alert('Listo', 'Gracias por tu calificación');
        setStars(0);
        setComment('');
      } else {
        const err = await res.json().catch(() => ({}));
        Alert.alert('Error', err.message || 'No se pudo enviar la calificación');
      }
    } catch (e) {
      Alert.alert('Error', 'No se pudo enviar la calificación');
    } finally {
      setRatingLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={
            publication.photos && publication.photos.length > 0
              ? { uri: publication.photos[0] }
              : require("../assets/splash-icon.png")
          }
          style={styles.image}
        />

        <Text style={styles.title}>{publication.titulo || "Titulo de Publicacion"}</Text>
        <Text style={styles.price}>{publication.precio ? `$${publication.precio}` : ""}</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Contactar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { marginLeft: 12, backgroundColor: favorited ? '#ff6b6b' : '#eee' }]} onPress={toggleFavorite} disabled={favLoading}>
            <FontAwesome name={favorited ? 'heart' : 'heart-o'} size={18} color={favorited ? '#fff' : '#333'} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { marginLeft: 12, backgroundColor: isFollowing ? '#2DCDA7' : '#eee' }]} onPress={toggleFollow} disabled={followLoading}>
            <Text style={[styles.buttonText, { color: isFollowing ? '#fff' : '#333' }]}>{isFollowing ? 'Siguiendo' : 'Seguir'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>{publication.descripcion || ""}</Text>

        {publication.ubicacion ? (
          <Text style={{ color: "#666", marginBottom: 8 }}>
            Ubicación: {publication.ubicacion}
          </Text>
        ) : null}

        {/* Mapa */}
        <View style={styles.mapPlaceholder}>
          {location ? (
              <MapView
                style={styles.map}
                initialRegion={location}
                showsUserLocation={true}
              >
                <Marker
                  coordinate={
                    publication && publication.location
                      ? { latitude: publication.location.latitude, longitude: publication.location.longitude }
                      : { latitude: -34.66, longitude: -58.365 }
                  }
                  title={publication.titulo || "Ubicación"}
                  description={publication.ubicacion || ""}
                />
              </MapView>
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Cargando mapa...
            </Text>
          )}
        </View>
        {/* Rating UI */}
        <View style={{ marginTop: 8, backgroundColor: '#fff', padding: 10, borderRadius: 8 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Calificar al usuario</Text>
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            {[1,2,3,4,5].map((n) => (
              <TouchableOpacity key={n} onPress={() => setStars(n)} style={{ marginRight: 6 }}>
                <FontAwesome name={n <= stars ? 'star' : 'star-o'} size={22} color="#f1c40f" />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput placeholder="Comentario (opcional)" value={comment} onChangeText={setComment} style={{ borderColor: '#eee', borderWidth: 1, borderRadius: 8, padding: 8, height: 80, textAlignVertical: 'top' }} multiline />
          <TouchableOpacity style={[styles.button, { marginTop: 8 }]} onPress={submitRating} disabled={ratingLoading}>
            {ratingLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Enviar calificación</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  image: {
    width: "100%",
    height: 180,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#2979FF",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  description: {
    color: "#444",
    fontSize: 15,
    marginBottom: 16,
  },
  mapPlaceholder: {
    height: 300,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  map: {
    flex: 1,
    width: "100%",
  },
});

export default PublicationScreen;
