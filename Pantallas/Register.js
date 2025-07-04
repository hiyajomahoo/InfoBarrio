import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Header from '../components/header';
import Btn from '../components/btn';
import { InputEmail, InputNumber, InputPassword, InputName } from '../components/inputs';

import { useState } from 'react';

export default function Register({ onRegister }) {
const [email, setEmail] = useState('');
const [name, setName] = useState('');
const [numero, setNumero] = useState('');
const [password, setPassword] = useState('');

return (
    <View style={styles.container}>
        <Header />
        <View style={styles.cont}>
            <Text style={{ color: 'white' }}>Crear Cuenta</Text>
            <InputName placeholder="Nombre" value={name} onChangeText={setName} />
            <InputEmail placeholder="Correo electrónico" value={email} onChangeText={setEmail} />
            <InputNumber placeholder="Número de teléfono" value={numero} onChangeText={setNumero} />
            <InputPassword placeholder="Contraseña" value={password} onChangeText={setPassword} />
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