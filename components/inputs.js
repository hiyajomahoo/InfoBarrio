import { TextInput, StyleSheet} from 'react-native';

export function InputEmail({ placeholder, value, onChangeText }) {
    return (
        <TextInput
            placeholder={placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.Input}
            value={value}
            onChangeText={onChangeText}
        />
    );
}

export function InputName({ placeholder, value, onChangeText }) {
    return (
        <TextInput
            placeholder={placeholder}
            keyboardType="default"
            autoCapitalize="none"
            style={styles.Input}
            value={value}
            onChangeText={onChangeText}
        />
    );
}

export function InputNumber({ placeholder, value, onChangeText }) {
    return (
        <TextInput
            placeholder={placeholder}
            keyboardType="numeric"
            style={styles.Input}
            value={value}
            onChangeText={onChangeText}
        />
    );
}

export function InputPassword({ placeholder, value, onChangeText }) {
    return (
        <TextInput
            placeholder={placeholder}
            secureTextEntry={true}
            autoCapitalize="none"
            style={styles.Input}
            value={value}
            onChangeText={onChangeText}
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