import { View, Text, StyleSheet } from 'react-native';
import Btn from '../components/btn';


export default function Perfil({ user, onLogout }) {
    return (
        <View style={styles.container}>
            <View style={styles.containerT}>    
                <Text style={styles.data}>Nombre: {user.name}</Text>
                <Text style={styles.data}>Correo: {user.email}</Text>
                <Text style={styles.data}>Número: {user.numero}</Text>
            </View>
            <Btn
                title="Cerrar Sesion"
                onPress={onLogout}
                style={styles.btnCloseUser}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#252525',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        borderWidth: 1,
        borderColor: 'red',
    },
    data: {
        color: 'white',
        textAlign: 'left',
    },
    containerT: {
        backgroundColor: '#252525',
        alignItems: 'left',
        justifyContent: 'center',
    },

    btnCloseUser:{
        backgroundColor:'red',
    }
});
