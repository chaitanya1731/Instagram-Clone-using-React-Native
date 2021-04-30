import React, { Component } from 'react'
import { View, Button, TextInput, StyleSheet } from 'react-native'
import firebase from 'firebase';

export class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: ""
        }

        this.onSignIn = this.onSignIn.bind(this);
    }

    onSignIn = () => {
        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="email"
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                />

                <View style={styles.buttonContainer}>
                    <View style={styles.button}>
                        <Button
                            title="Sign In"
                            onPress={() => this.onSignIn()}
                        />
                    </View>

                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        width: "80%",
        padding: 8,
        margin: 5,
        backgroundColor: '#dcdcdc',
        borderRadius: 4,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        flexDirection: 'column',
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: '100%'
    }
})

export default Login
