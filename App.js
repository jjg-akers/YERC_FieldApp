import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  FlatList,
  AsyncStorage
} from "react-native";

import GoalItem from "./components/GoalItem";
import GoalInput from "./components/GoalInput";
import { Camera } from "expo-camera";
import CameraView from "./components/Camera";
import Header from "./components/Header";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";

const getUserID = async () => {
  //let userID = "";
  try {
    let userID = await AsyncStorage.getItem("userID");
    console.log("userID: ", userID);
    return userID;
  } catch (error) {
    //error retrieving data
    console.log("Error getting data: ", error.message);
  }
  //return userID;
};

// save email to memory
const saveUserID = async userID => {
  console.log("in saveuserID, email: ", userID);

  let userInfo = {
    id: userID,
    email: userID,
    Role: "Admin",
    Observations: null
  };

  try {
    await AsyncStorage.setItem(userID, JSON.stringify(userInfo));
  } catch (error) {
    // error retiriving data
    console.log("error: ", error.message);
  }
};

const deleteUserID = async () => {
  console.log("deleting user");
  try {
    await AsyncStorage.removeItem("jjg.akers@gmail.com");
  } catch (error) {
    console.log("error deleting: ", error);
  }
};

export default function App() {
  
  
  console.log("at start of App");
  // to manage which screen to display, use application logic

  const[loggedIn, setLoggedIn] = useState(false);

  const [userEmail, setUserEmail] = useState();

  const removeUser = () => {
    setUserEmail(null);
    setLoggedIn(false);
    //deleteUserID();
  };

  // entered email gets sent from login screen to here
  const showProfileHandler = email => {
    
    setUserEmail(email);
    //saveUserID(email);
    login();
  };

  // check user id
  //console.log(getUserID());

  const [userData, setUserData] = useState("");

  const login = async (email) => {
    //console.log("in log in func: ", email);
    //let userID = "";
    // see if this use has info
    try {
      let userInfo = await AsyncStorage.getItem(email);
      if (userInfo) {
        //console.log("in if userInfo");
        let data = JSON.parse(userInfo);
        //console.log("userinfo: ", data);
        //console.log("user id: ", data.id);
        setUserEmail(data.id);
        setUserData(data);
        setLoggedIn(true);
        //content = <ProfileScreen removeEmail={removeUser} />;
      } else {
        // user was not in system
        console.log("nothing in userInfo");

        // save a new user
        saveUserID(email);
        setLoggedIn(true);
      }
      //return userID;
    } catch (error) {
      //error retrieving data
      console.log("Error getting data: ", error.message);
    }
    //return userID;
  };

  // let userID = getUserID();
  // if (userID){
  //   console.log("ID: ", userID);
  // } else {
  //   console.log("nothing");
  // };

  //login();
  // pass the showprofile handler to the login screen as a prop so that it can be updated
  //let content = <LoginScreen onConfirmedEmail={showProfileHandler} />;

  let content = <LoginScreen onConfirmedEmail={login} />;

  //check if content is initialized (truish)
  if (loggedIn) {
    //console.log("in if userEmail");
    content = (
      <ProfileScreen
        removeEmail={removeUser}
        userData={userData}
        //initialize={true}
      />
    );
  } 
  
  // else {
  //   console.log("in else login");
  //   //login();
  // }

  return (

    <View style={styles.screen}>

      <Header title="YERC" />

      {content}

      {/* renderItem takes a function that will be called on each item of your data 
      and returns a view*/}

      {/* this view will be used to display saved goals */}
      {/* map function takes a function that will execute on every element of an array */}
      {/* {courseGoals.map(goal => () */}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
    //padding: 10
  }
});
