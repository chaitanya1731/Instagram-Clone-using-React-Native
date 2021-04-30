import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, Button, TextInput } from 'react-native'

import firebase from 'firebase'
require('firebase/firestore')

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

function Comment(props) {
    const [comments, setComments] = useState([]);
    const [postId, setPostId] = useState("");
    const [text, setText] = useState("");

    useEffect(() => {

        const matchUserToComment = (comments) => {
            for(let i=0; i<comments.length; i++){
                if(comments[i].hasOwnProperty('user')){
                    continue;
                }
                const user = props.users.find(x => x.uid === comments[i].creator);
                if(user == undefined){
                    props.fetchUsersData(comments[i].creator, false);
                }
                else {
                    comments[i].user = user
                }
            }
            setComments(comments)
        }

        if (props.route.params.postId !== postId) {
            firebase.firestore()
                .collection('posts')
                .doc(props.route.params.uid)
                .collection('userPosts')
                .doc(props.route.params.postId)
                .collection('comments')
                .get()
                .then((snapshot) => {
                    let comments = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    matchUserToComment(comments);
                })
            setPostId(props.route.params.postId);
        }
        else{
            matchUserToComment(comments);
        }


    }, [props.route.params.postId, props.users])

    const onCommentSend = () => {
        if(!isEmpty(text)){
            firebase.firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .doc(props.route.params.postId)
            .collection('comments')
            .add({
                creator: firebase.auth().currentUser.uid,
                text
            })
        }
        props.navigation.navigate('Feed');
    }
    function isEmpty(str) {
        return (!str || str.length === 0 );
    }

    return (
        <View style={styles.container}>
            <View style={styles.viewContainer}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={comments}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            {item.user !== undefined ?
                            <Text style={styles.username}>
                                {item.user.name}:
                            </Text>
                            : null}
                            <Text>{item.text}</Text>
                        </View>
                    )}
                />
            </View>

            <View style={styles.viewContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Add Comment..."
                    onChangeText={(text) => setText(text)}
                />
                <View style={styles.button}>
                <Button
                    title="Add Comment"
                    onPress={() => onCommentSend()}
                />
                </View>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    viewContainer:{
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
    buttonContainer: {
        flexDirection: 'column',
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: '100%'
    },
    username: {
        fontWeight: 'bold'
    }
});


const mapStateToProps = (store) => ({
    users: store.usersState.users
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comment);
