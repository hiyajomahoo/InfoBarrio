import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Header from '../components/header';
import Btn from '../components/btn';
import { InputArea } from '../components/inputs';

import { useState } from 'react';

export default function Register({ onRegister }) {
const [email, setEmail] = useState('');
const [name, setName] = useState('');
const [numero, setNumero] = useState('');
const [password, setPassword] = useState('');


return (
    <View style={styles.container}>
        <Header/>
        <View style={styles.prueba}>
        <View style={styles.cont}>
            <InputArea placeholder="Nombre" value={name} onChangeText={setName} />
            <InputArea placeholder="Correo electrónico" value={email} onChangeText={setEmail} keyboardType ="email-address"/>
            <InputArea placeholder="Número de teléfono" value={numero} onChangeText={setNumero} keyboardType="numeric"/>
            <InputArea placeholder="Contraseña" value={password} onChangeText={setPassword} keyboardType="password"/>
            <Btn
                title="Continuar"
                onPress={() => {
                    if (email && name && password) {
                        onRegister({ email, name, numero });
                    } else {
                        alert('Por favor completá todos los campos');
                    }
                }}
            />
            <StatusBar style="auto" />
        </View>
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
    alignItems: 'flex-start',
    },
    prueba: {
        flex: 1,
        alignItems: "center"
    }
});