import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  AsyncStorage,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import Card from "../components/Card";
import Colors from "../constants/colors";
import Input from "../components/Input";
import Header from "../components/Header";
import { CommonActions } from "@react-navigation/native";

const LoginScreen = (props) => {
  const { navigation } = props;
  const [userData, setUserData] = useState([]);

  //console.log('at start of login screen');

  const [loggedIn, setLoggedIn] = useState(false);

  // save email to memory
  const saveUserID = async (userInfo) => {
    //console.log("in saveuserID, email: ", userID);
    try {
      await AsyncStorage.setItem(userInfo.id, JSON.stringify(userInfo));
    } catch (error) {
      console.log("error: ", error.message);

      // if there was an error, do not let them log in
    }
    // if no errors, let the user log in
    setLoggedIn(true);
  };

  const [userEmail, setUserEmail] = useState();

  const removeUser = () => {
    setUserEmail(null);
    setLoggedIn(false);
    //deleteUserID();
  };

  // entered email gets sent from login screen to here
  const showProfileHandler = (email) => {
    setUserEmail(email);
    //saveUserID(email);
    login();
  };

  // check user id
  //console.log(getUserID());

  const login = async (email) => {
    //console.log("in log in func: ", email);
    //let userID = "";
    // see if this use has info
    try {
      let userInfo = await AsyncStorage.getItem(email);
      
      if (userInfo) {
        let data = JSON.parse(userInfo);
        //console.log("userinfo: ", data);

        setUserEmail(data.id);
        setUserData(data);
      } else {
        // user was not in system
        console.log("nothing in userInfo");
        //setUserData(null);

        let userInfo = {
          id: email,
          email: email,
          Role: "Admin",
          Observations: [],
        };

        //console.log("else user info: ", userInfo);

        // save a new user
        setUserData(userInfo);
        saveUserID(userInfo);
      }
      //return userID;
      setLoggedIn(true);

    } catch (error) {
      //error retrieving data
      console.log("Error getting data: ", error.message);
    }
  };

  const [enteredValue, setEnteredValue] = useState("");
  const [confirmedEmail, setConfirmedEmail] = useState(false);

  // store entered email
  const [email, setEmail] = useState("");

  const resetInputHandler = () => {
    setEnteredValue("");
    setConfirmedEmail(false);
  };

  // Function to validate correct email formate
  const validate = (email) => {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return expression.test(String(email).toLowerCase());
  };

  //Function to control if user can log in
  const validateInputHandler = () => {
    let val = validate(enteredValue);
    //console.log("in validate: ", val);

    //if (enteredValue !== "jjg.akers@gmail.com") {
    if (!val) {
      Alert.alert(
        "Invalid Email Address!",
        "Address must be in the form: email@example.com",
        [{ text: "Okay", style: "destructive", onPress: resetInputHandler }]
      );
      // break out of function if not valid
      return;
    }
    // if email is ok
    setConfirmedEmail(true);
    setEnteredValue("");
    setEmail(enteredValue);
    Keyboard.dismiss();
    //props.onConfirmedEmail(enteredValue);

    login(enteredValue);

    //navigation.navigate('Profile', {item: userData});
  };

  const emailInputHandler = (inputText) => {
    // vlidate entered email

    // use regex in replace function
    //setEnteredValue(inputText.replace());
    setEnteredValue(inputText);
  };

  if (loggedIn) {
    ///console.log("in if loggenin: ", userData.id);
    if (userData.id) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Profile", params: { user: userData } }],
        //params: {user: userData},
      });

      // navigation.dispatch(
      //   CommonActions.reset({
      //     index: 0,
      //     actions: [NavigationAction.navigate("Profile", { user: userData })]
      //   })
      // );
      //navigation.navigate("Profile", { user: userData });
    }
  }

  //const image = { uri: "https://reactjs.org/logo-og.png" };
  const image = require("../yerc_whitegreen.png");

  return (
    // <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS == "ios" ? "padding" : "padding"}>

    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.screen}>
        <Header title="YERC" />
        {/* <Text style={styles.title}>Login</Text> */}
        {/* <ImageBackground source={image} style={styles.image}> */}

        <Card style={styles.inputContainer}>
          <Text>Enter Email</Text>
          <Input
            style={styles.input}
            blurOnSubmit
            autoCapitalize="none"
            autoCorrect={false}
            autoCompleteType="email"
            keyboardType="email-address"
            onChangeText={emailInputHandler}
            value={enteredValue}
          />
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button
                title="Login"
                onPress={validateInputHandler}
                color={Colors.accent}
              />
            </View>
            {/* <View style={styles.button}>
                <Button
                  title="Sign Up"
                  onPress={() => {}}
                  color={Colors.primary}
                />
              </View> */}
          </View>
        </Card>

        <Image style={styles.backgroundImage} source={image}></Image>

        {/* <Text style={styles.text}>Inside</Text> */}
        {/* </ImageBackground> */}
      </View>
    </TouchableWithoutFeedback>
    // </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 0,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
  },
  inputContainer: {
    width: 275,
    marginVertical: 20,
    maxWidth: "80%",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  button: {
    width: 100,
    fontWeight: "bold",
  },
  input: {
    width: "70%",
    textAlign: "center",
  },
  // image: {
  //   flex: 1,
  //   width: "80%",
  //   height: "80%",
  //   borderRadius: 10,
  //   borderColor: 'black',
  //   borderWidth: 1,
  //   //resizeMode: 'cover',
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  text: {
    color: "grey",
    fontSize: 30,
    fontWeight: "bold",
  },
  backgroundImage: {
    //position: 'absolute',
    width: "90%",
    height: "100%",
    //top: 150,
    resizeMode: "contain",
    flex: 0.4,
    //padding: -30,
    //margin: 50,
    //arginHorizontal:
    //     top: 0,
    //     left: 0,
    //     bottom: 0,
    //     right: 0,
    //     opacity: 0.3
  },
});

export default LoginScreen;
