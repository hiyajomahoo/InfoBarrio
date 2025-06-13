import { StyleSheet, Text, View} from 'react-native';

function Header(){
    return(
        <View style={styles.Header}>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>Bienvenido</Text>
            <Text style={{color: 'white'}}>Crea una cuenta para continuar</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    Header: {
        width: '100%',
        backgroundColor: '#162b4e',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 20,
        marginBottom: 20,
    },
});

export default Header;