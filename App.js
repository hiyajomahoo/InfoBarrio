import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,} from 'react-native';
import Header from './components/Header';
import Btn from './components/btn';

export default function App() {
  return (  
    <View style={styles.container}>
      <Header/>
      <View style={styles.cont}>
        <Text style={{color: 'white'}}>Crear Cuenta</Text>
        <StatusBar style="auto"/>
        <Btn title='Continuar'/>
      </View>
      
    </View>    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cont: {
    flex: 1,
    width: '100%',
    backgroundColor: '#252525',
    alignItems: 'center',
  },
});