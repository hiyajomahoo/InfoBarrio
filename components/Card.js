import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function Card({
  title,
  description,
  image,
  price,
  time,
  iconColor = "#aaa",
}) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={image} style={styles.image} />
        ) : (
          <FontAwesome name="image" size={40} color={iconColor} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {price && <Text style={styles.price}>{price}</Text>}
        <Text style={styles.desc}>{description}</Text>
        {time && (
          <View style={styles.footer}>
            <FontAwesome name="clock-o" size={14} color="#888" />
            <Text style={styles.time}>{time}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    marginVertical: 8,
    borderRadius: 12,
    padding: 12,
    elevation: 1,
  },
  imageContainer: {
    width: 50,
    height: 50,
    backgroundColor: "#eee",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  image: { width: 50, height: 50, borderRadius: 8 },
  title: { fontWeight: "bold", fontSize: 16 },
  price: { color: "#2979FF", fontWeight: "bold", fontSize: 14 },
  desc: { color: "#555", fontSize: 13, marginVertical: 2 },
  footer: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  time: { marginLeft: 4, color: "#888", fontSize: 12 },
});
