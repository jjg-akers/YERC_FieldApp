import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  AsyncStorage,
} from "react-native";

import Card from "../components/Card";
import Colors from "../constants/colors";
import Input from "../components/Input";

const EditScreen = (props) => {
  console.log("in edit screen");

  const { route, navigation } = props;
  const observationData = route.params.obsInfo;
  var allObservations = route.params.allObs;

  //console.log('route info: ', allObservations);

  //console.log('data:', observationData);

  const [enteredJar, setEnteredJar] = useState(observationData.obsData.jarNum);
  
  const [enteredComments, setEnteredComments] = useState(
    observationData.obsData.comments
  );

  // const [enteredTitle, setEnteredTitle] = useState(
  //   observationData.obsData.title
  // );
  const [enteredLocation, setEnteredLocation] = useState(
    observationData.obsData.location.toString()
  );

  const [enteredSiteID, setEnteredSiteID] = useState(
    observationData.obsData.title
  );

  const [enteredTime, setEnteredTime] = useState(observationData.obsData.time);

  const siteIDInputHnadler = (enteredText) => {
    setEnteredSiteID(enteredText);
  }

  const tempInputHnadler = (enteredText) => {
    setEnteredJar(enteredText);
  };

  const titleInputHnadler = (enteredText) => {
    setEnteredTitle(enteredText);
  };

  const commentsInputHnadler = (enteredText) => {
    setEnteredComments(enteredText);
  };

  const updateSavedObs = async () => {
    console.log("in updateSavedObs");

    //console.log("obs params in update: ", obsParams);
    let newObsData = {
      location: observationData.obsData.location,
      comments: enteredComments,
      jarNum: enteredJar,
      time: enteredTime,
      title: enteredSiteID,
    };

    route.params.allObs.forEach((element) => {
      if (element.id === observationData.id) {
        element.obsData = newObsData;
      }
    });

    //console.log(JSON.stringify(allObservations[0]));

    let obsToStore = {
      Observations: route.params.allObs,
    };

    //AsyncStorage.setItem('dateTime', JSON.stringify(obsToStore), () => {
    //console.log(props.userData.email);

    // let userInfo = await AsyncStorage.getItem(props.userData.id);
    //console.log("user info: ", userInfo);
    try {
      console.log("in try");
      await AsyncStorage.mergeItem(
        route.params.userID,
        JSON.stringify(obsToStore), () => {
            AsyncStorage.getItem(route.params.userID, (err, result) => {
            //console.log("result of merge: ", result);
          });
        }
      );
    } catch (error) {
      console.log("error merging edits", error);
    }
  };

  const saveObsHandler = () => {
    console.log("in saveobs handler");
    // let data = obsParams.filter((observation) => {
    //   return observation.id === observationID;
    // });
    // save data to memory,
    // navigate back to other screen
    updateSavedObs();

    console.log("after update");

    navigation.navigate('Profile', {newObs: route.params.allObs});
  };

  const cancelHandler = () => {
    navigation.navigate('Profile');
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.screen}>
        {/* <Text style={styles.title}>Login</Text> */}

        <Card style={styles.inputContainer}>
          <View style={styles.subContainer}>
            <Text>Location: </Text>
            <Input
              style={styles.input}
              blurOnSubmit
              autoCapitalize="none"
              autoCorrect={false}
              //autoCompleteType="email"
              //keyboardType="email-address"
              //onChangeText={emailInputHandler}
              value={enteredLocation}
            />
          </View>
          <View style={styles.subContainer}>
            <Text>Site ID: </Text>
            <Input
              style={styles.input}
              blurOnSubmit
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={siteIDInputHnadler}
              //autoCompleteType="email"
              //keyboardType="email-address"
              //onChangeText={emailInputHandler}
              value={enteredSiteID}
            />
          </View>

          {/* <View style={styles.subContainer}>
            <Text>Title: </Text>
            <Input
              //defaultValue={defaultVal}
              placeholder="Title"
              //{props.data.obsData.temp}
              style={styles.input}
              onChangeText={titleInputHnadler}
              // set the value of the component to the current state, which will change on every text input:
              value={enteredTitle}
            />
          </View> */}
          <View style={styles.subContainer}>
            <Text>Jar: </Text>

            <Input
              //defaultValue={defaultTemp}
              //placeholder='Temp'
              placeholder="Comments"
              style={styles.input}
              onChangeText={tempInputHnadler}
              value={enteredJar}
            />
          </View>
          <View style={styles.subContainer}>
            <Text>Comments: </Text>

            <Input
              //defaultValue={defaultTemp}
              //placeholder='Temp'
              placeholder="Comments"
              style={styles.input}
              onChangeText={commentsInputHnadler}
              value={enteredComments}
            />
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button
                title="Save"
                onPress={saveObsHandler}
                color={Colors.accent}
              />
            </View>
            <View style={styles.button}>
              <Button
                title="Cancel"
                onPress={cancelHandler}
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
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: "column",
    width: "90%",
    //alignItems: "center",
    //justifyContent: "flex-start",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 35,
    paddingTop: 25,
  },
  button: {
    width: 100,
  },
  input: {
    width: "70%",
    marginLeft: 10,
    textAlign: "left",
  },
  subContainer: {
    //flex: 1,
    width: "90%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "baseline",
    //textAlign: 'left'
  },
});

export default EditScreen;
