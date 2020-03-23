import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  FlatList
} from "react-native";

import GoalItem from "./components/GoalItem";
import GoalInput from "./components/GoalInput";
import { Camera } from "expo-camera";
import CameraView from "./components/Camera";
import Header from "./components/Header";

export default function App() {
  // set up a container to manage our saved goals
  const [courseGoals, setCourseGoals] = useState([]);

  // need to add a state to monitor is we are currently in add obs state
  const [isAddMode, setIsAddMode] = useState(false);

  // function goalInputHnadler(enteredText) {
  //   setEnteredGoal(enteredText);
  // }

  // observation container
  const [obsParams, setObservations] = useState([]);

  const addObservationHandler = (obsTitle, obsData) => {
    setObservations(currentObservations => [
      ...obsParams,
      { id: Math.random().toString(), value: { obsTitle, obsData } }
    ]);
    setIsAddMode(false);
  };

  const addGoalHandler = goalTitle => {
    //want to add our entered goal to a list of goals
    //console.log(enteredGoal);

    // to use flat list we need a complex item with a key and a value
    setCourseGoals(currentGoals => [
      ...courseGoals,
      { key: Math.random().toString(), value: goalTitle }
    ]);
  };

  const removeObsHandler = observationID => {
    setObservations(currentObservations => {
      return currentObservations.filter(
        observation => observation.id !== observationID
      );
    });
  };

  const addModeHandler = () => {
    setIsAddMode(true);
  };

  // add function to cancel the add modal
  const cancelObsAddHandler = () => {
    setIsAddMode(false);
  };

  //camer stuff
  const takePitureHandler = () => {};

  // const [isCameraMode, setIsCameraMode] = useState(false);

  // const addCameraModeHandler = () => {
  //   setIsCameraMode(true);
  // };

  // const cancelCameraHandler = () => {
  //   setIsCameraMode(false);
  // };

  return (
    <View style={styles.screen}>
      <Header title="YERC" />
      
      <Button title="Add Observation" onPress={addModeHandler} />
      {/* // now onAddGoal will be recieved as a prop inside GoalInput */}
      {/* <GoalInput onAddGoal={addGoalHandler} /> */}

      <Button title="Take picture" />
      {/* //onCancel={cancelCameraHandler}  */}

      <GoalInput
        visible={isAddMode}
        onAddGoal={addObservationHandler}
        onCancel={cancelObsAddHandler}
      />

      {/* renderItem takes a function that will be called on each item of your data 
      and returns a view*/}
      <FlatList
        // data={courseGoals}
        // renderItem={itemData => <GoalItem title={itemData.item.value} />}
        keyExtractor={(item, index) => item.id}
        data={obsParams}
        renderItem={itemData => (
          <GoalItem
            id={itemData.item.id}
            onDelete={removeObsHandler}
            title={itemData.item.value}
          />
        )}
      />
      {/* this view will be used to display saved goals */}
      {/* map function takes a function that will execute on every element of an array */}
      {/* {courseGoals.map(goal => () */}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    //padding: 10
  }
});
