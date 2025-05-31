import { StyleSheet, Text, View } from 'react-native';
import Articulo from './Articulo'

export default function App() {
  return (
    <View style={styles.container}>
      <Articulo/>
      <Articulo/>
      <Articulo/>
      <Articulo/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "column",
  },
});
