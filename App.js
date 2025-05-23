import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Boton from './componentes/Boton'

export default function App() {
  return (
    <>
      <Boton></Boton>
      <Boton text='Hola'></Boton>
      <Boton text='Boton con funcion' press={() => console.log("Holaaa")}></Boton>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
