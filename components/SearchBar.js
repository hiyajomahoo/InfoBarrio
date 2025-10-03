import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Buscar...",
}) {
  return (
    <View style={styles.searchBar}>
      <FontAwesome
        name="search"
        size={18}
        color="#888"
        style={{ marginLeft: 8 }}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 8,
    marginHorizontal: 10,
    marginTop: 16,
    height: 36,
  },
  input: { flex: 1, marginLeft: 8, fontSize: 16, color: "#333" },
});
