import React from 'react'
import { Text, View, Button, StyleSheet } from 'react-native'

export default function Landing({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <View styles={styles.button}>
                    <Button
                        title="Register"
                        onPress={() => navigation.navigate("Register")} />
                </View>

                <View styles={styles.button}>
                    <Button
                        title="Login"
                        onPress={() => navigation.navigate("Login")} />
                </View>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        flexDirection: 'column',
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        height: 30
    },
    button: {
        width: 100
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
