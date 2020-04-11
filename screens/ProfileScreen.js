import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  FlatList,
  AsyncStorage,
  Alert,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import GoalItem from "../components/GoalItem";
import GoalInput from "../components/GoalInput";

import { Camera } from "expo-camera";
import CameraView from "../components/Camera";
import Card from "../components/Card";
import Colors from "../constants/colors";
import Input from "../components/Input";
import Settings from "../components/Settings";
import ListItem, { Separator } from "../components/ListItem";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

const ProfileScreen = (props) => {
  const deleteUserID = async () => {
    console.log("deleting user");
    try {
      await AsyncStorage.removeItem("jjg.akers@gmail.com");
    } catch (error) {
      console.log("error deleting: ", error);
    }
  };

  const { route, navigation } = props;
  //console.log('route: ', route);
  const { user } = route.params;

  const [isSettingsMode, setIsSettingsMode] = useState(false);

  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity onPress={settingsHandler}>
        <Ionicons
          size={30}
          color="#fff"
          name="md-settings"
          style={{ paddingRight: 30 }}
        />
        {/* <Button
      onPress={() => alert("Button Pressed")}
      title="Info"
      color="#fff"
    /> */}
      </TouchableOpacity>
    ),
  });

  //console.log('at profile screen: ', user);

  const [currentLocation, setLocation] = useState(null);

  // set up a container to manage our saved goals
  const [courseGoals, setCourseGoals] = useState([]);

  // need to add a state to monitor is we are currently in add obs state
  const [isAddMode, setIsAddMode] = useState(false);

  // create trigger to store new observation in memory
  const [newObs, setNewObs] = useState(false);

  // observation container

  const [obsParams, setObservations] = useState([]);

  const settingsHandler = () => {
    setIsSettingsMode(true);
  };

  //console.log('obs params: ', obsParams);

  // const updateObsHandler = observationID => {

  //   // update an observation
  //   obsParams[observationID]
  //   setObservations(currentObservations => {
  //     return currentObservations.filter(
  //       observation => observation.id !== observationID
  //     );
  //   });
  // };

  const addObservationHandler = async (values) => {
    if (values.id) {
      //console.log(obsParams[id])
      let obs = obsParams.filter((observation) => {
        return observation.id === values.id;
      });
      //console.log("obs before id: ", obs[0]);
      obs[0].obsData = values;
      //console.log("obs after id: ", obs[0]);

      setIsEditMode(false);
      setIsAddMode(false);
      //.obsData = values;
    } else {
      console.log("in else: ");
      //console.log("valuse: ", values);

      //var newObsID = Math.random().toString();
      setObservations((currentObservation) => [
        ...obsParams,
        { id: Math.random().toString(), obsData: values },
      ]);

      //console.log("current obsParams: ", obsParams);

      setIsAddMode(false);

      setNewObs(true);
    }
  };

  const updateSavedObs = async () => {
    console.log("in updateSavedObs");

    //console.log("obs params in update: ", obsParams);
    let obsToStore = {
      Observations: obsParams,
    };

    console.log("user id in update saved obs", user.id);
    //AsyncStorage.setItem('dateTime', JSON.stringify(obsToStore), () => {
    //console.log(props.userData.email);

    // let userInfo = await AsyncStorage.getItem(props.userData.id);
    //console.log("user info: ", userInfo);
    try {
      await AsyncStorage.mergeItem(
        user.id,
        JSON.stringify(obsToStore),
        async () => {
          await AsyncStorage.getItem(user.id, (err, result) => {
            console.log("result of merge: ", result);
          });
        }
      );
    } catch (error) {
      console.log("error merging: ", error);
    }
  };

  // check if new obs
  if (newObs) {
    //console.log("in if newObs");
    // call update func
    updateSavedObs();
    setNewObs(false);
  }

  //updateSavedObs();

  const addGoalHandler = (goalTitle) => {
    //want to add our entered goal to a list of goals
    //console.log(enteredGoal);

    // to use flat list we need a complex item with a key and a value
    setCourseGoals((currentGoals) => [
      ...courseGoals,
      { key: Math.random().toString(), value: goalTitle },
    ]);
  };

  const removeObsHandler = (observationID) => {
    //console.log('obs id: ', observationID);
    // remove the observation from memory
    // const deleteUserID = async () => {
    //   console.log("deleting user");
    //   try {
    //     await AsyncStorage.removeItem("jjg.akers@gmail.com");
    //   } catch (error) {
    //     console.log("error deleting: ", error);
    //   }
    // };
    ///console.log("obs params before fileter: ", obsParams);
    // remove from flat list
    let filteredObs = obsParams.filter(function (value, index, arr) {
      return value.id !== observationID;
    });

    //console.log("filtered obse: ", filteredObs);
    // async () => {

    // setObservations('');
    // }
    //console.log("obsparams after setting empti: ", obsParams);

    // useEffect(() => {
    setObservations(filteredObs);

    console.log("in setObservations");
    // });
    // setObservations(currentObservations => {
    //   return currentObservations.filter(
    //     observation => observation.id !== observationID
    //   );
    // });

    //console.log("obsparams after removing: ", obsParams);

    // update saved obs
    updateSavedObs();
  };

  const [editData, setEditData] = useState("");

  const [isEditMode, setIsEditMode] = useState(false);
  // Handler to open an already saved observation

  const openEditObsHandler = (observationID) => {
    // navigate to edit screen
    //alert("opening editscreen");
    let currentData = obsParams.filter((observation) => {
      return observation.id === observationID;
    });

    //console.log('currentData: ', currentData[0]);

    navigation.navigate("EditScreen", {
      obsInfo: currentData[0],
      userID: user.id,
      allObs: obsParams,
    });
  };

  const [isLoading, setLoading] = useState(true);
  const [respObj, setRespObj] = useState("");

  const putRequest = async () => {
    try {
      let response = await fetch(
        "http://epiic-fa01-dev.azurewebsites.net/api/dataobject",
        {
          method: "PUT",
          // headers: {
          //   Accept: 'application/json',
          //   'Content-Type': 'application/json',
          // },
          //{"siteid": "big1", "deviceid": "20449344", "t": "2019-11-22 07:24:37", "dobtype": "WaterQuantity", "name": "depth", "value": -1.2336, "status": "new", "observer": "csvfile"}
          body: JSON.stringify({
            siteid: "yerc",
            t: "2020-03-22 07:24:37",
            dobtype: "Test",
            name: "example1",
            value: -1.2336,
            status: "new",
            observer: "test from app",
          }),
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          setLoading(false);
          setRespObj(responseJson);
        });

      // let responseJson = await response.json();
      // return responseJson.msg;
    } catch (error) {
      console.error(error);
    }
  };

  const submitEditObsHandler = () => {
    console.log("in submitEditObs Handler");
    // call submit function
    putRequest();

    if (!isLoading) {
      console.log(respObj);
    }
  };

  // const submitObservationHanler = () => {
  //   putRequest();

  //   //props.onSubmit();

  //   //reset flags
  //   setLocationIsSet(false);
  //   //setIsEditMode(false);
  // };

  const addModeHandler = () => {
    setIsAddMode(true);
    //getLocation();
  };

  const cancelEditMode = () => {
    setIsEditMode(false);
  };

  // add function to cancel the add modal
  const cancelObsAddHandler = () => {
    setIsAddMode(false);
    setEditData("");
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

  // const storageHandler = () => {
  //   let UID123_object = {
  //     name: 'Chris',
  //     age: 30,
  //     traits: { hair: 'brown', eyes: 'brown' },
  //   };
  //   // You only need to define what will be added or updated
  //   let UID123_delta = {
  //     age: 31,
  //     traits: { eyes: 'blue', shoe_size: 10 },
  //   };

  //   AsyncStorage.setItem('UID123', JSON.stringify(UID123_object), () => {
  //     AsyncStorage.mergeItem('UID123', JSON.stringify(UID123_delta), () => {
  //       AsyncStorage.getItem('UID123', (err, result) => {
  //         console.log(result);
  //       });
  //     });
  //   });

  //   // Console log result:
  //   // => {'name':'Chris','age':31,'traits':
  //   //    {'shoe_size':10,'hair':'brown','eyes':'blue'}}

  // };
  const logoutHandler = () => {
    props.removeEmail();
  };

  // set up something to track is this is initialization
  const [isInitialize, setInitialize] = useState(true);

  if (isInitialize) {
    console.log("in initialize");

    if (user.Observations) {
      console.log("in user observations");
      //console.log('something in obs: ', props.userData.Observations);

      // need to get observations into obsparams
      //console.log('Observations: ', props.userData.Observations);
      //console.log('user observations: ', user.Observations);

      setObservations(user.Observations);
    } else {
      console.log("nothing in obs");
    }

    // if (user.Observations !== null) {

    //   console.log('in user observations');
    //   //console.log('something in obs: ', props.userData.Observations);

    //   // need to get observations into obsparams
    //   //console.log('Observations: ', props.userData.Observations);
    //   console.log('user observations: ', user.Observations);

    //   setObservations(user.Observations);
    //   //console.log('params after: ', obsParams);
    //   // setObservations( () => [
    //   //   ...obsParams, props.userData.Observations.values()
    //   // ]);

    //   // add old obs to page
    //   // props.userData.Observations.forEach(element => {
    //   //   console.log("elemetn: ", element);
    //   //   setObservations(() => [
    //   //     ...obsParams,
    //   //     { id: Math.random().toString(), obsData: element.obsData }
    //   //   ]);
    //   // });
    // } else {
    //   console.log("nothing in obs");
    // }
    setInitialize(false);
    // set obs from memory
  }

  const setSettingsLow = () => {
    setIsSettingsMode(false);
  };

  // submit to db

  return (
    <View style={styles.screen}>
      {/* <Settings visible={isSettingsMode} /> */}

      <Modal
        visible={isSettingsMode}
        animationType="slide"
        transparent={true}
        //onRequestClose={this.closeModal}
      >
        <View style={styles.settingsScreen}>
          <View style={styles.settingsContainer}>
            <TouchableOpacity onPress={setSettingsLow}>
              <Ionicons
                size={30}
                color="red"
                name="md-close-circle"
                style={{ paddingRight: 30 }}
              />
              {/* <Button
      onPress={() => alert("Button Pressed")}
      title="Info"
      color="#fff"
    /> */}
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.logout}>
                <Button title="Log out" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.btns}>
        <View>
          <Button title="Add Observation" onPress={addModeHandler} />
          {/* // now onAddGoal will be recieved as a prop inside GoalInput */}
          {/* <GoalInput onAddGoal={addGoalHandler} /> */}
        </View>
      </TouchableOpacity>

      <GoalInput
        visible={isAddMode}
        onAddGoal={addObservationHandler}
        onCancel={cancelObsAddHandler}
        data={editData}
        //onSubmit={submitObsHandler}
        //location={currentLocation}
        //onDelete={removeObsHandler}
      />

      {/* renderItem takes a function that will be called on each item of your data 
    and returns a view*/}
      <FlatList
        // data={courseGoals}
        // renderItem={itemData => <GoalItem title={itemData.item.value} />}
        keyExtractor={(item, index) => item.id}
        data={obsParams}
        renderItem={(itemData) => (
          <GoalItem
            onSwipeFromLeft={openEditObsHandler}
            onSwipeFromLeftSubmit={submitEditObsHandler}
            //onRightPress={() => alert("pressed Delete!")}
            onRightPress={removeObsHandler}
            id={itemData.item.id}
            title={itemData.item.obsData}
          />
        )}
      />
      {/* this view will be used to display saved goals */}
      {/* map function takes a function that will execute on every element of an array */}
      {/* {courseGoals.map(goal => () */}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  btns: {
    marginVertical: 10,
    width: "80%",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
  },
  settingsScreen: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    margin: 0,
    padding: 0,
  },
  settingsContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1, // lets you conrol how much space the container will take up
    // flexDirection: "row",
    //justifyContent: "center",
    alignItems: "center",
    //borderColor: "black",
    //borderWidth: 1,
    //marginTop: 80,
    marginHorizontal: 40,
    marginVertical: 200,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    backgroundColor: "white",
    elevation: 5,
    padding: 10,
    borderRadius: 20,
  },
  logout: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    width: "60%",
  },
});

const quotes = [
  { id: "0", text: "It’s just a flesh wound." },
  { id: "1", text: "That is my least vulnerable spot." },
];

export default ProfileScreen;
