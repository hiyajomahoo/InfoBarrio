import { StyleSheet, Text, View } from 'react-native';

export default function Inicio( { navigation } ) {
    return (
        <View style={styles.container}>
            <Text>HOLAAAAA</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'gray',
    }
})