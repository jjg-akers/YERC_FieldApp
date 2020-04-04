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

import GoalItem from "../components/GoalItem";
import GoalInput from "../components/GoalInput";
import { Camera } from "expo-camera";
import CameraView from "../components/Camera";
import Card from "../components/Card";
import Colors from "../constants/colors";
import Input from "../components/Input";
import ListItem, { Separator } from "../components/ListItem";

const ProfileScreen = props => {
  // set up a container to manage our saved goals
  const [courseGoals, setCourseGoals] = useState([]);

  // need to add a state to monitor is we are currently in add obs state
  const [isAddMode, setIsAddMode] = useState(false);

  // create trigger to store new observation in memory
  const [newObs, setNewObs] = useState(false);

  // observation container

  const [obsParams, setObservations] = useState([]);

  // const updateObsHandler = observationID => {

  //   // update an observation
  //   obsParams[observationID]
  //   setObservations(currentObservations => {
  //     return currentObservations.filter(
  //       observation => observation.id !== observationID
  //     );
  //   });
  // };

  const addObservationHandler = async values => {
    if (values.id) {
      //console.log(obsParams[id])
      let obs = obsParams.filter(observation => {
        return observation.id === values.id;
      });
      console.log("obs before id: ", obs[0]);
      obs[0].obsData = values;
      console.log("obs after id: ", obs[0]);

      setIsEditMode(false);
      setIsAddMode(false);
      //.obsData = values;
    } else {
      //console.log("valuse: ", values);

      //var newObsID = Math.random().toString();
      setObservations(currentObservation => [
        ...obsParams,
        { id: Math.random().toString(), obsData: values }
      ]);

      //console.log("current obsParams: ", obsParams);

      setIsAddMode(false);

      setNewObs(true);
    }
  };

  const updateSavedObs = async () => {
    console.log("in updateSavedObs");

    console.log("obs params in update: ", obsParams);
    let obsToStore = {
      Observations: obsParams
    };
    //AsyncStorage.setItem('dateTime', JSON.stringify(obsToStore), () => {
    //console.log(props.userData.email);

    // let userInfo = await AsyncStorage.getItem(props.userData.id);
    //console.log("user info: ", userInfo);

    await AsyncStorage.mergeItem(
      props.userData.id,
      JSON.stringify(obsToStore),
      async () => {
        await AsyncStorage.getItem(props.userData.id, (err, result) => {
          console.log("result of merge: ", result);
        });
      }
    );
  };

  // check if new obs
  if (newObs) {
    //console.log("in if newObs");
    // call update func
    updateSavedObs();
    setNewObs(false);
  }

  //updateSavedObs();

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
    console.log("obs params before fileter: ", obsParams);
    // remove from flat list
    let filteredObs = obsParams.filter(function(value, index, arr) {
      return value.id !== observationID;
    });

    console.log("filtered obse: ", filteredObs);
    // async () => {

    // setObservations('');
    // }
    console.log("obsparams after setting empti: ", obsParams);

    // useEffect(() => {
    setObservations(filteredObs);
    // });
    // setObservations(currentObservations => {
    //   return currentObservations.filter(
    //     observation => observation.id !== observationID
    //   );
    // });

    console.log("obsparams after removing: ", obsParams);

    // update saved obs
    updateSavedObs();
  };

  const [editData, setEditData] = useState("");

  const [isEditMode, setIsEditMode] = useState(false);
  // Handler to open an already saved observation
  const openEditObsHandler = observationID => {
    setIsAddMode(true);
    setIsEditMode(true);
    let data = obsParams.filter(observation => {
      return observation.id === observationID;
    });
    console.log("data: ", data);

    setEditData(data[0]);
    // send data to autofill fields
  };

  const addModeHandler = () => {
    setIsAddMode(true);
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

    if (props.userData.Observations !== null) {
      //console.log('something in obs: ', props.userData.Observations);

      // need to get observations into obsparams
      //console.log('Observations: ', props.userData.Observations);

      setObservations(props.userData.Observations);
      //console.log('params after: ', obsParams);
      // setObservations( () => [
      //   ...obsParams, props.userData.Observations.values()
      // ]);

      // add old obs to page
      // props.userData.Observations.forEach(element => {
      //   console.log("elemetn: ", element);
      //   setObservations(() => [
      //     ...obsParams,
      //     { id: Math.random().toString(), obsData: element.obsData }
      //   ]);
      // });
    } else {
      console.log("nothing in obs");
    }
    setInitialize(false);
    // set obs from memory
  }


  // submit to db
  const submitObsHandler = () => {

    console.log('in submit handler')
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
        //"http://rivernet-mobile.azurewebsites.net/observation",
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

  return (
    <View style={styles.screen}>
      <Button title="Add Observation" onPress={addModeHandler}  />
      {/* // now onAddGoal will be recieved as a prop inside GoalInput */}
      {/* <GoalInput onAddGoal={addGoalHandler} /> */}

      <Button title="Log out" onPress={logoutHandler} />
      {/* //onCancel={cancelCameraHandler}  */}

      {/* <GoalInput
        visible={isEditMode}
        onCancel={cancelEditMode}
        data={editData[0]}

        /> */}

      <GoalInput
        visible={isAddMode}
        onAddGoal={addObservationHandler}
        onCancel={cancelObsAddHandler}
        data={editData}
        onSubmit={submitObsHandler}
        //onDelete={removeObsHandler}
      />

      {/* _______________------- */}
      {/* <FlatList
        data={quotes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListItem
            {...item}
            onSwipeFromLeft={() => alert("swiped from left!")}
            onRightPress={() => alert("pressed right!")}
          />
        )}
        ItemSeparatorComponent={() => <Separator />}
      /> */}

      {/* ------------------------- */}

      {/* renderItem takes a function that will be called on each item of your data 
    and returns a view*/}
      <FlatList
        // data={courseGoals}
        // renderItem={itemData => <GoalItem title={itemData.item.value} />}
        keyExtractor={(item, index) => item.id}
        data={obsParams}
        renderItem={itemData => (
          <GoalItem
            onSwipeFromLeft={openEditObsHandler}
            onSwipeFromLeftSubmit={() => alert("submmit!")}
            //onRightPress={() => alert("pressed Delete!")}
            onRightPress={removeObsHandler}
            id={itemData.item.id}
            //onOpen={openEditObsHandler}
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
    flex: 1
    //padding: 10
  }
});

const quotes = [
  { id: "0", text: "It’s just a flesh wound." },
  { id: "1", text: "That is my least vulnerable spot." }
];

export default ProfileScreen;
