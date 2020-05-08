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
import DrawerNavigator from "../navigation/DrawerNavigator";

const ProfileScreen = (props) => {
  console.log("start of profile");
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
      </TouchableOpacity>
    ),
  });

  // Function to completely remove user and data from phone (essetially reset app)
  const deleteUserID = async () => {
    console.log("deleting user: ", user.id);
    try {
      await AsyncStorage.removeItem(user.id);
    } catch (error) {
      console.log("error deleting: ", error);
    }

    // after removing data from phone storage, navigate back to login screen
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  //const [currentLocation, setLocation] = useState(null);

  // set up a container to manage our saved goals
  //const [courseGoals, setCourseGoals] = useState([]);

  // need to add a state to monitor is we are currently in add obs state
  const [isAddMode, setIsAddMode] = useState(false);

  // create trigger to store new observation in memory
  const [newObs, setNewObs] = useState(false);

  // observation container
  const [obsParams, setObservations] = useState([]);

  // Handle opening settings modal
  const settingsHandler = () => {
    setIsSettingsMode(true);
  };

  const addObservationHandler = async (values) => {
    let newID = Math.random().toString();

    setObservations((currentObservation) => [
      ...obsParams,
      { id: newID, obsData: values },
    ]);

    let newObs = { id: newID, obsData: values };
    updateSavedObs(newObs);

    //console.log("obsParams after: ", obsParams);

    setIsAddMode(false);
  };

  const updateSavedObs = async (newOb) => {
    //console.log("in updateSavedObs");

    //console.log("obs params in update: ", obsParams);
    let allObs = [...obsParams, newOb];
    let obsToStore = {
      Observations: allObs,
    };

    try {
      await AsyncStorage.mergeItem(
        user.id,
        JSON.stringify(obsToStore),
        // async () => {
        //   await AsyncStorage.getItem(user.id, (err, result) => {
        //     console.log("result of merge: ", result);
        //   });
        // }
      );
    } catch (error) {
      //console.log("error merging: ", error);
    }
  };

  // check if new obs
  // if (newObs) {
  //   //console.log("in if newobs");
  //   // call update func
  //   updateSavedObs();
  //   setNewObs(false);
  // }

  // remove an observation and resave memory
  const removeObsHandler = async (observationID) => {
    // remove from flat list
    let filteredObs = obsParams.filter(function (value, index, arr) {
      return value.id !== observationID;
    });

    // console.log("obsparams before: ", obsParams);
    setObservations([...filteredObs]);

    console.log("filtered obs: ", filteredObs);
    // console.log("obsParams after: ", obsParams);
    //console.log("in setObservations");

    let obsToStore = {
      Observations: filteredObs,
    };
    try {
      await AsyncStorage.mergeItem(
        user.id,
        JSON.stringify(obsToStore),
        // async () => {
        //   await AsyncStorage.getItem(user.id, (err, result) => {
        //     console.log("in remove, result of merge: ", result);
        //   });
        // }
      );
    } catch (error) {
      //console.log("error merging: ", error);
    }

    //updateSavedObs(filteredObs);
  };

  //const [editData, setEditData] = useState("");

  //const [isEditMode, setIsEditMode] = useState(false);
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

  // const [isLoading, setLoading] = useState(true);
  // const [respObj, setRespObj] = useState("");

  // submit to db
  const putRequest = async (
    dateTime,
    jarNum,
    observer,
    observationID,
    comments,
    obsSiteID
  ) => {
    try {
      let response = await fetch(
        "http://epiic-fa01-dev.azurewebsites.net/api/dataobject",
        {
          method: "PUT",
          body: JSON.stringify({
            //siteid: "yerc",
            siteid: obsSiteID,
            t: dateTime,
            dobtype: "WQSample",
            name: "jar",
            value: jarNum,
            status: "new",
            observer: observer,
            //latlong: latLong,
            comments: comments,
          }),
        }
      ).then((response) => {
        if (response.status <= 200 && response.status < 300) {
          response.json().then((responseJSON) => {
            if (responseJSON.statuscode !== 200) {
              //console.log("bad response");
              console.log("bad request: ", responseJSON.statuscode);
              alert("Could not complete request:\n\n" + responseJSON.msg);
            } else {
              //console.log("in reponse 200");
              //setLoading(false);
              //setRespObj(responseJSON);
              removeObsHandler(observationID);
              //alert("Submission Successful!");
            }
          });
        } else {
          //console.log("bad response");
          console.log(
            "ERROR, response status: ",
            response.status,
            response.headers
          );
          alert("Unable to submit!\nPlease try again later");
        }
      });

      // let responseJson = await response.json();
      // return responseJson.msg;
    } catch (error) {
      console.error(error);
    }
  };

  const submitEditObsHandler = (observationID) => {
    // get correct observation:
    let currentData = obsParams.filter((observation) => {
      return observation.id === observationID;
    });

    let observer = user.id;
    let jarnum = currentData[0].obsData.jarNum;
    let datetime = currentData[0].obsData.time;
    let comments = currentData[0].obsData.comments;
    let obsSiteID = currentData[0].obsData.title;
    //console.log(currentData[0]);
    // call submit function
    // datetime, jarnum, observer
    putRequest(datetime, jarnum, observer, observationID, comments, obsSiteID);
  };

  const addModeHandler = () => {
    setIsAddMode(true);
    //getLocation();
  };

  // const cancelEditMode = () => {
  //   setIsEditMode(false);
  // };

  // add function to cancel the add modal
  const cancelObsAddHandler = () => {
    setIsAddMode(false);
    //setEditData("");
  };

  const logoutHandler = () => {
    props.removeEmail();
  };

  // set up something to track is this is initialization
  const [isInitialize, setInitialize] = useState(true);

  if (isInitialize) {
    console.log("in initialize");

    if (user.Observations) {
      // console.log("in if user.observations");
      // console.log("user obs: ", user.Observations);
      setObservations(user.Observations);
    }

    setInitialize(false);
    // set obs from memory
  }

  const setSettingsLow = () => {
    setIsSettingsMode(false);
  };

  // const submitAllAsyc = (dateTime, jarNum, observer, comments, obsID) => {
  //   return new Promise((resolve, reject) => {
  //     fetch("http://epiic-fa01-dev.azurewebsites.net/api/dataobject", {
  //       method: "PUT",
  //       body: JSON.stringify({
  //         siteid: "yerc",
  //         t: dateTime,
  //         dobtype: "WQSample",
  //         name: "jar",
  //         value: jarNum,
  //         status: "new",
  //         observer: observer,
  //         //latlong: latLong,
  //         comments: comments,
  //       }),
  //     })
  //       .then((resp) => resp.json())
  //       .then((data) => {
  //         console.log("data: ", data);
  //         if (data.statuscode !== 200) {
  //           console.log("error submitting: ", data);
  //           reject(new Error("something went wrong"));
  //         } else {
  //           // // remove from flat list
  //           // let filteredObs = obsParams.filter(function (value, index, arr) {
  //           //   return value.id !== obsID;
  //           // });

  //           // // // console.log("obsparams before: ", obsParams);
  //           // setObservations([...filteredObs]);
  //           resolve(data);

  //           //console.log("filtered obs: ", filteredObs);
  //           // console.log("obsParams after: ", obsParams);
  //           //console.log("in setObservations");

  //           // let obsToStore = {
  //           //   Observations: filteredObs,
  //           // };
  //           // await removeObsHandler(obsID);
  //           //console.log(" no error submitting: ", data);
  //         }
  //       })
  //       .catch((error) => alert("error: ", error));
  //   });
  // };

  // const submitAllObservations = async () => {
  //   //console.log('submit all');
  //   // for each observation, call submit func
  //   let toSubmit = obsParams;
  //   toSubmit.forEach(async (el) => {
  //     resp = submitAllAsyc(
  //       el.obsData.time,
  //       el.obsData.jarNum,
  //       user.id,
  //       el.obsData.comments,
  //       el.id
  //     );
  //     await resp.then((data) => {
  //       //updateSavedObs("");

  //       // remove from flat list
  //       let filteredObs = obsParams.filter(function (value, index, arr) {
  //         return value.id !== el.id;
  //       });

  //       // // console.log("obsparams before: ", obsParams);
  //       setObservations([...filteredObs]);
  //       // if (data.statuscode != "200") {
  //       //   console.log("error submitting: ", data);
  //       // } else {
  //       //   removeObsHandler(el.id);
  //       // }
  //       console.log("end of loop");
  //     });
  //   });
  // };

  // const submitAllHandler = () => {
  //   Alert.alert("Confirm", "This will submit all observations", [
  //     { text: "Okay", style: "destructive", onPress: submitAllObservations },
  //   ]);
  // };

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
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteUserID}>
              <View style={styles.logout}>
                <Text> Log out </Text>
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

      {/* <TouchableOpacity style={[styles.btns, styles.sumbmitAll]}>
        <View>
          <Button title="Submit All" onPress={submitAllHandler} />
        </View>
      </TouchableOpacity> */}

      <GoalInput
        visible={isAddMode}
        onAddGoal={addObservationHandler}
        onCancel={cancelObsAddHandler}
        id={user.id}
      />

      {/* renderItem takes a function that will be called on each item of your data 
    and returns a view*/}
      <FlatList
        style={styles.list}
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
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    //padding: 10,
    //margin: 0,
    alignItems: "center",
    //width: '80%',
    //borderColor: "black",
    borderWidth: 1,
  },
  // sumbmitAll: {
  //   // position: "absolute",
  //   // bottom: 30,
  // },
  btns: {
    marginVertical: 10,
    width: "80%",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
  },
  settingsScreen: {
    //backgroundColor: "rgba(0,0,0,0.5)",
    //flex: .5,
    margin: 0,
    paddingHorizontal: 1,
    paddingBottom: 10,
    marginBottom: 10,
    position: "absolute",
    width: "100%",
    height: 100,
    bottom: 0,
  },
  settingsContainer: {
    backgroundColor: "white",
    //flex: 1, // lets you conrol how much space the container will take up
    flexDirection: "row",
    justifyContent: "center",

    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "black",
    //marginBottom: 10,
    paddingBottom: 30,
    paddingTop: 20,
    //borderColor: "black",
    //borderWidth: 1,
    //marginTop: 80,
    //marginHorizontal: 40,
    //marginBottom: 20,
    //padding: 10,
    // shadowColor: "black",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowRadius: 6,
    // shadowOpacity: 0.26,
    // backgroundColor: "white",
    // elevation: 5,
    // borderRadius: 20,
  },
  logout: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    width: 100,
    height: 50,
    backgroundColor: "#ff8f8f",
  },
});

export default ProfileScreen;
