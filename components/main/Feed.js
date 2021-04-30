import React, { useState, useEffect } from 'react'
import { View, Text, Image, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native'
import * as Animatable from 'react-native-animatable'
import Icon from 'react-native-vector-icons/AntDesign'

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'

const AnimatedIcon = Animatable.createAnimatableComponent(Icon)

function Feed(props) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {

            props.feed.sort(function (x, y) {
                return x.creation - y.creation;
            });

            setPosts(props.feed);
            console.log(posts);
        }
    }, [props.usersFollowingLoaded, props.feed])

    const onLikePress = (uid, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})
    }
    const onDislikePress = (uid, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()
    }

    return (
        <View style={styles.container}>
            <View style={styles.conatinerGallery}>
                <FlatList
                    numColumns={1}
                    showsVerticalScrollIndicator={false}
                    horizontal={false}
                    data={posts}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.containerImage}>
                                <Text style={styles.username}>{item.user.name}</Text>
                                <View style={styles.imageContainer}>
                                    <Image
                                        style={styles.image}
                                        source={{ uri: item.downloadURL }}
                                    />
                                </View>
                                <View style={styles.photoDescriptionContainer}>
                                    {item.currentUserLike ?
                                        (
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                onPress={() => onDislikePress(item.user.uid, item.id)}
                                            >
                                                <AnimatedIcon
                                                    name="heart"
                                                    color="#e92f3c"
                                                    size={20}
                                                    style={styles.icon}
                                                />
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                onPress={() => onLikePress(item.user.uid, item.id)}
                                            >
                                                <AnimatedIcon
                                                    name="hearto"
                                                    color="#515151"
                                                    size={20}
                                                    style={styles.icon}
                                                />
                                            </TouchableOpacity>
                                        )}
                                    <View style={styles.textContainer}>
                                        <Text
                                            style={[styles.comments, styles.text]}
                                            onPress={() => props.navigation.navigate('Comment',
                                                {
                                                    postId: item.id,
                                                    uid: item.user.uid
                                                }
                                            )}>
                                            Read Comments...
                                    </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                />
            </View>

        </View >
    )
}


const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,
})


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    containerInfo: {
        margin: 20
    },
    conatinerGallery: {
        flex: 1,
    },
    containerImage: {
        flex: 1
    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1,
    },
    username: {
        fontSize: 16,
        fontWeight: "bold",
        padding: 10
    },
    comments: {
        color: "#a9a9a9",
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'column',
        height: '100%',
        width: '100%',
    },
    photoDescriptionContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    textContainer: {
        flexDirection: 'row',
        textAlign: 'left',
        paddingTop: 0
    },
    text: {
        textAlign: 'center',
        fontSize: 13,
        backgroundColor: 'transparent',
        color: '#515151'
    },
    icon: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#000'
    },
    card: {
        // height: 345,
        width: '100%',
        justifyContent: 'center',
        backgroundColor: '#fff',
        // borderRadius: 5,
        // shadowColor:'#000',
        // shadowOffset: {
        //   width: 0,
        //   height: 2
        // },
        // shadowRadius: 6,
        // shadowOpacity: 0.3,
        // elevation: 2
    },
})

export default connect(mapStateToProps, null)(Feed)