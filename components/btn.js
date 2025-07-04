import { Text, TouchableOpacity, StyleSheet } from 'react-native';

function Btn({ title, onPress }) {
    return (
        <TouchableOpacity style={styles.boton} onPress={onPress}>
            <Text style={{ color: 'white' }}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    boton: {
        padding: 10,
        backgroundColor: 'gray',
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
        borderRadius: 5,
    },
});

export default Btn;
