import React, { useState } from 'react'
import { View, Image, TextInput, Button, StyleSheet } from 'react-native'
import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

export default function Save(props) {
    // console.log(props.route.params.image);
    const [caption, setCaption] = useState("");

    const uploadImage = async () => {
        const uri = props.route.params.image;
        const response = await fetch(uri);
        const blob = await response.blob();
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;

        const task = firebase.storage()
                            .ref()
                            .child(childPath)
                            .put(blob);

        const taskProgess = snapshot => {
            console.log(`Transferred: ${snapshot.bytesTransferred}`);
        }
        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
                console.log(snapshot);
            })
        }
        const taskError = (snapshot) =>{
            console.error(snapshot);
        }

        task.on("state_changed", taskProgess, taskError, taskCompleted);
    }

    const savePostData = (downloadURL) => {
        firebase.firestore().collection('posts')
                            .doc(firebase.auth().currentUser.uid)
                            .collection("userPosts")
                            .add({
                                downloadURL, caption, 
                                creation: firebase.firestore.FieldValue.serverTimestamp()
                            })
                            .then((function(){
                                props.navigation.popToTop();
                            }))
    }

    return (
        <View style={styles.container}>
           <Image source={{uri: props.route.params.image}} />
           <TextInput 
                style={styles.input}
                placeholder="Write a caption..."
                onChangeText={(caption) => {setCaption(caption)}}
           />
           <Button 
                title="Save"
                onPress={() => uploadImage()}
           />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    input: {
        width: "100%",
        padding: 10,
        marginVertical: 2,
        backgroundColor: '#dcdcdc',
        borderRadius: 4,
    },
});
