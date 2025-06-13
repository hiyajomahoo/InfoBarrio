import { TextInput, StyleSheet} from 'react-native';

export function InputEmail({ placeholder }) {
    return (
        <TextInput
            placeholder={placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.Input}
        />
    );
}

export function InputNumber({ placeholder }) {
    return (
        <TextInput
            placeholder={placeholder}
            keyboardType="numeric"
            style={styles.Input}
        />
    );
}

export function InputPassword({ placeholder }) {
    return (
        <TextInput
            placeholder={placeholder}
            secureTextEntry={true}
            autoCapitalize="none"
            style={styles.Input}
        />
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
    }
});