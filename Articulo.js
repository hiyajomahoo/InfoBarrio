import { Text, TouchableOpacity, StyleSheet, View, Image} from "react-native"

export default function Articulo({titulo = "Lorem Ipsum", descripcion = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin, lectus et gravida euismod, tortor.", imagen = require("./assets/default.png")}) {
    return (
        <>
            <TouchableOpacity style={styles.articulo}>
                <Image source={imagen} style={styles.imagen} />
                <View style={styles.contenedor}>
                    <Text style={styles.textoTitulo}>{titulo}</Text>
                    <Text style={styles.descTitulo}>{descripcion}</Text>
                </View>
            </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    articulo: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    contenedor: {
       flex: 1,
       height: 50,
       flexDirection: "column", 
       justifyContent: "space-around"
    },
    textoTitulo: {
        fontWeight: "black",
        fontSize: 20,
    },
    descTitulo: {
        fontWeight: "light",
        fontSize: 10,
    },
    imagen: {
        width: 100,
        height: 100,
        marginLeft: 5,
        marginRight: 15
    }
})