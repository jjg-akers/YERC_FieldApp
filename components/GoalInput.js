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
  //const [isEditMode, setIsEditMode] = useState(false);

  let defaultVal = "";
  //const [editValue, setEditValue] = useState('')
  if (props.data) {
    //setIsEditMode(true);
    console.log("edit data in goalinput: ", props.data.obsData.title);
    defaultVal = props.data.obsData.title;
    //setEditValue(props.data.obsData.title);
  }

  const [enteredGoal, setEnteredGoal] = useState(defaultVal);
  // another way to write the above funtion is as a const equal to an arrow func:

  const [enteredTemp, setEnteredTemp] = useState("");

  const goalInputHnadler = enteredText => {
    setEnteredGoal(enteredText);
  };
  const tempInputHnadler = enteredText => {
    setEnteredTemp(enteredText);
  };

  const addObsHandler = () => {
    let values = {
      title: enteredGoal,
      temp: enteredTemp,
      time: Date().toString()
    };

    if (props.data) {
      values["id"] = props.data.id;
    }
    //props.onAddGoal(enteredGoal, enteredOther, Date().toString());
    props.onAddGoal(values);

    setEnteredGoal("");
    setEnteredTemp("");
  };

  const [isCameraMode, setIsCameraMode] = useState(false);

  const addCameraModeHandler = () => {
    setIsCameraMode(true);
  };

  const cancelCameraHandler = () => {
    setIsCameraMode(false);
  };

  const cancelObservationHandler = () => {
    //setEnteredGoal('');
    props.onCancel();
    //setIsEditMode(false);
  };
  
  // const deleteHandler = () => {
  //   props.onDelete();
  // }

  const submitObservationHanler = () => {
    props.onSubmit();

  };

  return (
    <Modal visible={props.visible} animationType="slide">
      <View style={styles.inputContainer}>
        {/* onchange text takes a function that will execute everything text is updated */}
        {/* <Text>{Date().toString}</Text> */}
        <TextInput
          defaultValue={defaultVal}
          placeholder="Title"
          //{props.data.obsData.temp}
          style={styles.input}
          onChangeText={goalInputHnadler}
          // set the value of the component to the current state, which will change on every text input:
          //value={defaultVal}
        />
        <TextInput
          placeholder="Comments"
          style={styles.input}
          onChangeText={tempInputHnadler}
          value={enteredTemp}
        />
        <View style={styles.photoContainer}>
          <View style={styles.photoButton}>
            <Button title="Add Photo" onPress={addCameraModeHandler} />
          </View>
          <CameraView
            cameraVisible={isCameraMode}
            onCancel={cancelCameraHandler}
          />

          <Image
            style={styles.img}
            source={require("../yerc_whitegreen.png")}
          />
        </View>
        <View style={styles.btnContainer}>
          <View style={styles.button}>
            <Button
              title="CANCEL"
              color="red"
              onPress={cancelObservationHandler}
            />
          </View>
          <View style={styles.button}>
            <Button title="SAVE" onPress={addObsHandler} />
          </View>
        </View>

        <View style={styles.btnContainer}>
          <View style={styles.button}>
            <Button title="SUBMIT" onPress={submitObservationHanler} />
          </View>
          <View style={styles.button}>
            <Button title="DELETE" />
            {/* onPress={props.onDelete.bind(this, props.id)} */}
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
    width: "80%",
    marginVertical: 10,
    
  },
  button: {
    fontSize: 5,
    borderWidth: 1,
    borderColor: "black",
    width: "40%"
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
    resizeMode: "contain"
  },
  photoButton: {
    borderColor: "black",
    borderWidth: 1,
    height: 50
  }
});

export default GoalInput;
