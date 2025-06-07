import { StyleSheet, Text, View } from 'react-native';
import Articulo from '../Articulo'

export default function Inicio( { navigation } ) {
    return (
        <View style={styles.container}>
            <Articulo/>
            <Articulo/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    }
})