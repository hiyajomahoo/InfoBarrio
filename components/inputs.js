import { TextInput, StyleSheet, View, Text} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useState } from 'react';

export function InputArea({ placeholder, value, onChangeText, keyboardType = "default" }) {
    const [mostrarPassword, setShowPassword] = useState(false)
    const togglePassword = () => {
        setShowPassword(!mostrarPassword);
    }

    return (
        <View style={styles.contenedorTexto}>
            <Text style={{color: "white"}}>{placeholder}</Text>
            <TextInput
                placeholder={placeholder}
                keyboardType={keyboardType}
                autoCapitalize="none"
                secureTextEntry={ keyboardType == "password" ? !mostrarPassword : false}
                style={styles.Input}
                value={value}
                onChangeText={onChangeText}
            />        
            {keyboardType == "password" ?
            (   
                <FontAwesome size={20} name='eye' color="white" onPress={togglePassword}/>
            ) :
            (null) 
            }

        </View>
    );
}

const styles = StyleSheet.create({
    Input: {
        borderColor: 'white',
        borderWidth: 2,
        width: 200,
        height: 50,
        margin: 10,
        padding: 10,
        borderRadius: 5,
        backgroundColor:'gray',
    },

    contenedorTexto: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
    }
});