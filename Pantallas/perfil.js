import { View, Text } from 'react-native';

export default function Perfil({ user }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>Nombre: {user.name}!</Text>
            <Text style={{ fontSize: 20 }}>Correo: {user.email}!</Text>
            <Text style={{ fontSize: 20 }}>Número: {user.numero}!</Text>
        </View>
    );
}
