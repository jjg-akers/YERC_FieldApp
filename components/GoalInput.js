import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Modal,
  Image
} from "react-native";
import CameraView from "./Camera";


const GoalInput = props => {
  const [enteredGoal, setEnteredGoal] = useState("");
  // another way to write the above funtion is as a const equal to an arrow func:

  const [enteredOther, setEnteredOther] = useState("");

  const goalInputHnadler = enteredText => {
    setEnteredGoal(enteredText);
  };
  const otherInputHnadler = enteredText => {
    setEnteredOther(enteredText);
  };

  const addObsHandler = () => {
    props.onAddGoal(enteredGoal, enteredOther);

    setEnteredGoal("");
    setEnteredOther("");
  };

  const submitObsHandler = () => {
    //props.onAddGoal(enteredGoal, enteredOther);
    // testing post request
    // async function getMoviesFromApi() {
    try {
      const formData = new FormData();
      formData.append("email", "jjg.akers@gmail.com");
      formData.append("latitude", "99999");
      formData.append("longitude", "111111");
      formData.append("watertemp", "123");
      formData.append("comments", "From react-native app");

      let response = fetch(
        "http://rivernet-mobile.azurewebsites.net/observation",
        {
          method: "POST",
          body: formData
          //   headers: {
          //     Accept: "application/json",
          //     "Content-Type": "applicatoin/json"
          //   },
          //   body: JSON.stringify({
          //     email: "jjg.akers@gmail.com",
          //     latitude: "99999",
          //     longitue: "111111",
          //     watertemp: "123"
          //   })
        }
      );

      //let responseJson = response.json();
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const [isCameraMode, setIsCameraMode] = useState(false);

  const addCameraModeHandler = () => {
    setIsCameraMode(true);
  };

  const cancelCameraHandler = () => {
    setIsCameraMode(false);
  };

  return (
    <Modal visible={props.visible} animationType="slide">
      <View style={styles.inputContainer}>
        {/* onchange text takes a function that will execute everything text is updated */}
        {/* <Text>{Date().toString}</Text> */}
        <TextInput
          placeholder="Temp"
          style={styles.input}
          onChangeText={goalInputHnadler}
          // set the value of the component to the current state, which will change on every text input:
          value={enteredGoal}
        />
        <TextInput
          placeholder="something else"
          style={styles.input}
          onChangeText={otherInputHnadler}
          value={enteredOther}
        />
        <View style={styles.photoContainer}>
          <View style={styles.photoButton}>
            <Button title="Add Photo" onPress={addCameraModeHandler} />
          </View>
          <CameraView cameraVisible={isCameraMode} onCancel={cancelCameraHandler} />


          <Image
            style={styles.img}
            source={require("../yerc_whitegreen.png")}
          />
        </View>
        <View style={styles.btnContainer}>
          <View style={styles.button}>
            <Button title="CANCEL" color="red" onPress={props.onCancel} />
          </View>
          <View style={styles.button}>
            <Button title="SAVE" onPress={addObsHandler} />
          </View>
          <View style={styles.button}>
            <Button title="SUBMIT" onPress={submitObsHandler} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1, // lets you conrol how much space the container will take up
    // flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1
  },
  input: {
    width: "80%",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    padding: 10,
    marginBottom: 10
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%"
  },
  button: {
    borderWidth: 1,
    borderColor: "black",
    width: "30%"
  },
  photoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    padding: 20
    // borderBottomWidth: 1,
    // borderBottomColor: 'black'
  },
  img: {
    width: 50,
    height: 50,
    borderColor: "black",
    borderWidth: 1,
    resizeMode: 'contain'
  },
  photoButton: {
    borderColor: 'black',
    borderWidth: 1,
    height: 50,
  }
});

export default GoalInput;
