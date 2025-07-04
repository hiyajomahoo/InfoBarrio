import { View, Text } from 'react-native';

export default function Home({ user }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>¡Bienvenido, {user.name}!</Text>
        </View>
    );
}
