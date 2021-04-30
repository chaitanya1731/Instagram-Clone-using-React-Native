import React, { useState } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native'

import firebase from 'firebase'
require('firebase/firestore')

export default function Search(props) {

    const [users, setUsers] = useState([])
    const fetchUsers = (search) => {
        firebase.firestore()
            .collection('users')
            .where('name', '>=', search)
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data };
                });
                setUsers(users);
            })
    }


    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
            <View style={styles.container}>
                <View style={styles.viewContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder='Search'
                        onChangeText={(search) => fetchUsers(search)}
                    />
                    <FlatList
                        numColumns={1}
                        horizontal={false}
                        data={users}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => props.navigation.navigate("Profile", { uid: item.id })}>
                                <View style={styles.listItem}>
                                    <Text>{item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />

                </View>
            </View>
        </TouchableWithoutFeedback>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    viewContainer: {
        width: "90%",
        margin: 10,
        padding: 8
    },
    listItem: {
        padding: 10,
        marginVertical: 2,
        backgroundColor: "#dcdcdc",
        borderRadius: 4,
    },
    input: {
        width: "100%",
        padding: 10,
        marginVertical: 2,
        backgroundColor: '#dcdcdc',
        borderRadius: 4,
    },
});
