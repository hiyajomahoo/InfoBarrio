/*
  Pantalla: Publicacion (detalle)
  - Muestra los detalles de una publicación concreta.
  - Soporta recibir la publicación por `route.params.publication` o bien
    un `postId` para buscarla desde la API.
  - Permite marcar favorito, seguir autor y enviar calificaciones.
*/
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
  const [publication, setPublication] = useState(
    route?.params?.publication ?? route?.params?.post ?? null
  );
  const [loadingPublication, setLoadingPublication] = useState(
    !route?.params?.publication && !!(route?.params?.postId || route?.params?.id || route?.params?.post)
  );
  
  // Helper para leer múltiples nombres de campo posibles
  const getField = (obj, ...keys) => {
    if (!obj) return undefined;
    for (const k of keys) {
      if (obj[k] !== undefined && obj[k] !== null) return obj[k];
    }
    return undefined;
  };

  useEffect(() => {
    (async () => {
      // Si la publicación trae una ubicación (seleccionada en NuevaPublicacion), usarla
      const pubLocation = getField(publication, 'location', 'ubicacion_obj', 'coords');
      if (publication && pubLocation && pubLocation.latitude && pubLocation.longitude) {
        setLocation({
          latitude: pubLocation.latitude,
          longitude: pubLocation.longitude,
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

  useEffect(() => {
    const postId = route?.params?.postId ?? route?.params?.id ?? route?.params?.postId;
    if (!postId) return;
    // Si ya tenemos un objeto publication, evitar refetch
    if (publication) return;

    let mounted = true;
    (async () => {
      setLoadingPublication(true);
      try {
        const res = await fetch(`${API_URL}/api/post/${postId}`);
        if (!res.ok) throw new Error('Network response not ok');
        const data = await res.json();
        // el backend puede devolver arreglo u objeto; normalizar a un solo objeto
        let pub = data;
        if (Array.isArray(data) && data.length) pub = data[0];
        if (mounted) setPublication(pub);
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
      if (!userData || !userData.token || !getField(publication, 'id', 'post_id')) return;
      try {
        const res = await fetch(`${API_URL}/api/favorites`, {
          headers: { Authorization: `Bearer ${userData.token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          const pId = Number(getField(publication, 'id', 'post_id'))
          const found = data.find((r) => Number(r.post_id) === pId);
          setFavorited(!!found);
        }
      } catch (e) {
        // ignorar errores de esta comprobación
      }
    })();
  }, [userData, publication]);

  useEffect(() => {
    // comprobar si seguimos al autor
    (async () => {
      if (!userData || !userData.token || !getField(publication, 'user_id', 'userId', 'author_id')) return;
      try {
        const targetId = getField(publication, 'user_id', 'userId', 'author_id')
        const res = await fetch(`${API_URL}/api/follows/followers/${targetId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const found = data.find((f) => Number(f.follower_id) === Number(userData.id));
          setIsFollowing(!!found);
        }
      } catch (e) {
        // ignorar errores de esta comprobación
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
    setFavorited(!previous);
    try {
      if (!previous) {
        const res = await fetch(`${API_URL}/api/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userData.token}` },
          body: JSON.stringify({ post_id: getField(publication, 'id', 'post_id') })
        });
        if (!res.ok) {
          setFavorited(previous);
          Alert.alert('Error', 'No se pudo guardar en favoritos');
        }
      } else {
        const res = await fetch(`${API_URL}/api/favorites/${getField(publication, 'id', 'post_id')}`, {
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
    const targetId = getField(publication, 'user_id', 'userId', 'author_id')
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
  };

  const submitRating = async () => {
    if (!userData || !userData.token) {
      Alert.alert('Necesitas iniciar sesión', 'Iniciá sesión para enviar una calificación');
      return;
    }
    if (!getField(publication, 'user_id', 'userId', 'author_id')) {
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
        body: JSON.stringify({ rated_id: getField(publication, 'user_id', 'userId', 'author_id'), stars, comment })
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
        {(() => {
          const pub = publication || {};
          return (
            <>
              <Image
                source={
                  pub.photos && pub.photos.length > 0
                    ? { uri: pub.photos[0] }
                    : require("../assets/splash-icon.png")
                }
                style={styles.image}
              />

              <Text style={styles.title}>{getField(pub, 'title', 'titulo') || "Titulo de Publicacion"}</Text>
              <Text style={styles.price}>{getField(pub, 'price', 'precio') ? `$${getField(pub, 'price', 'precio')}` : ""}</Text>
            </>
          )
        })()}

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

        {(() => {
          const pub = publication || {};
          return (
            <>
              <Text style={styles.description}>{getField(pub, 'description', 'descripcion') || ""}</Text>

              {getField(pub, 'ubicacion') ? (
                <Text style={{ color: "#666", marginBottom: 8 }}>
                  Ubicación: {getField(pub, 'ubicacion')}
                </Text>
              ) : null}
            </>
          )
        })()}

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
                      (publication && publication.location)
                        ? { latitude: publication.location.latitude, longitude: publication.location.longitude }
                        : { latitude: -34.66, longitude: -58.365 }
                    }
                    title={getField(publication, 'title', 'titulo') || "Ubicación"}
                    description={getField(publication, 'ubicacion') || ""}
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