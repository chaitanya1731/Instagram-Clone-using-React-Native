import React, { Component } from 'react'
import { View, Button, TextInput, StyleSheet } from 'react-native'
import firebase from 'firebase';


export class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            name: ""
        }

        this.onSignUp = this.onSignUp.bind(this);
    }

    onSignUp = () => {
        const { name, email, password } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((result) => {
                firebase.firestore().collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .set({
                        name, email
                    })
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
                    placeholder="name"
                    onChangeText={(name) => this.setState({ name })}
                />
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
                            title="Sign Up"
                            onPress={() => this.onSignUp()}
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

export default Register
