import { Text, TouchableOpacity, StyleSheet} from "react-native"

export default function BotonNav({texto = "Texto Predeterminado"}) {
    return (
        <>
            <TouchableOpacity style={styles.boton}>
                <Text style={styles.texto}> {texto} </Text>
            </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    boton: {
        padding: 5,
        backgroundColor: '#4787ff',
        borderRadius: 10,
        width: 70,
        height: 40,
        marginRight: 5,
    },
    texto: {
        textAlign: "center",
        color: 'white'
    }
})