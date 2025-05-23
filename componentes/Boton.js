import { StyleSheet, TouchableOpacity, Text } from 'react-native';
export default function Boton({ press, text = "Default"}) { 
    return(
        <>
        <TouchableOpacity>
            <Text onPress={press}>{text}</Text>
        </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: '',
        justifyContent: 'center',
    },
})