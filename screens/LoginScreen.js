import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  AsyncStorage
} from "react-native";

import Card from "../components/Card";
import Colors from "../constants/colors";
import Input from "../components/Input";

const LoginScreen = props => {
  const [enteredValue, setEnteredValue] = useState("");
  const [confirmedEmail, setConfirmedEmail] = useState(false);

  // store entered email
  const [email, setEmail] = useState("");

  const resetInputHandler = () => {
    setEnteredValue("");
    setConfirmedEmail(false);
  };

  const validateInputHandler = () => {
    if (enteredValue !== "jjg.akers@gmail.com") {
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
    //props.onConfirmedEmail(email);
    props.onConfirmedEmail(enteredValue);
    //props.onConfirmedEmail(email);

    // save username to memory:
    //saveUserID(enteredValue);

    // AsyncStorage.setItem('dateTime', JSON.stringify(obsToStore), () => {
    //   //AsyncStorage.mergeItem('UID123', JSON.stringify(UID123_delta), () => {
    //     AsyncStorage.getItem('dateTime', (err, result) => {
    //       console.log(result);
    //     });
    // });
    
  // };

  // const saveUserID = async userID => {
  //   console.log("in saveuserID");
  //   try {
  //     await AsyncStorage.setItem('userID', JSON.stringify(userID));
  //   } catch (erro) {
  //     // error retiriving data
  //     console.log("error: ", error.message);
  //   }
  };

  const emailInputHandler = inputText => {
    // vlidate entered email

    // use regex in replace function
    //setEnteredValue(inputText.replace());
    setEnteredValue(inputText);
  };



  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.screen}>
        <Text style={styles.title}>Login</Text>

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
            <View style={styles.button}>
              <Button
                title="Sign Up"
                onPress={() => {}}
                color={Colors.primary}
              />
            </View>
          </View>
        </Card>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: "center"
  },
  title: {
    fontSize: 20,
    marginVertical: 10
  },
  inputContainer: {
    width: 300,
    maxWidth: "80%",
    alignItems: "center"
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 15
  },
  button: {
    width: 100
  },
  input: {
    width: "70%",
    textAlign: "center"
  }
});

export default LoginScreen;
