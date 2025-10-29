import { StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { FontAwesome } from "@expo/vector-icons";


function Publicacion({ item, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.feedItem}>
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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

export default Publicacion;