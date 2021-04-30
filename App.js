import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import firebase from 'firebase';
const firebaseConfig = {
  apiKey: "AIzaSyALpnC5QufmuuGxA_V69n_9EPm-EeIPbIA",
  authDomain: "instagram-clone-adef1.firebaseapp.com",
  projectId: "instagram-clone-adef1",
  storageBucket: "instagram-clone-adef1.appspot.com",
  messagingSenderId: "428738267323",
  appId: "1:428738267323:web:78aa0c58f80dc3b1ac819e",
  measurementId: "G-XM8M2XGNGW"
};

if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig);
}

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'

const store = createStore(rootReducer, applyMiddleware(thunk));



import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LandingScreen from './components/Auth/Landing'
import RegisterScreen from './components/Auth/Register'
import LoginScreen from './components/Auth/Login'
import MainScreen from './components/Main'
import AddScreen from './components/main/Add'
import SaveScreen from './components/main/Save'
import CommentScreen from './components/main/Comment'


const Stack = createStackNavigator();
export class App extends Component{
  constructor(props){
    super(props);

    this.state = {
      loaded: false,
    }
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged((user)=> {
      if(!user){
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      }
      else{
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    });
  }

  render(){

    const { loggedIn, loaded } = this.state;

    if(!loaded){
      return (
        <View style={{flex: 1, justifyContent: 'center'}}> 
          <Text>Loading</Text>
        </View>
      );
    }

    if(!loggedIn){
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Register" component={RegisterScreen}/>
            <Stack.Screen name="Login" component={LoginScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="Add" component={AddScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation}/>
            <Stack.Screen name="Comment" component={CommentScreen} navigation={this.props.navigation}/>
          </Stack.Navigator>
        </NavigationContainer>
        
      </Provider>
    );

  }
}



export default App;
