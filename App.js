import { StyleSheet, Text, View } from 'react-native';
import BotonNav from './btnNav'

export default function App() {
  return (
    <View style={styles.container}>
      <BotonNav texto="Hola"/>
      <BotonNav texto="Chau"/>
      <BotonNav texto="Qué"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "row",
  },
});
