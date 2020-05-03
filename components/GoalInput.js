import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Modal,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Picker,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import CameraView from "./Camera";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

const getTimeStamp = () => {
  let d = new Date();
  let Str =
    d.getFullYear() +
    "-" +
    ("00" + (d.getMonth() + 1)).slice(-2) +
    "-" +
    ("00" + d.getDate()).slice(-2) +
    " " +
    ("00" + d.getHours()).slice(-2) +
    ":" +
    ("00" + d.getMinutes()).slice(-2) +
    ":" +
    ("00" + d.getSeconds()).slice(-2);

  //console.log("date: ", Str);
  return Str;
};

const siteInfo = [
  {
    id: "gar1",
    sitename: "Gardiner River",
    latitude: "45.02905",
    longitude: "-110.70039",
    amphoraid: null,
  },
  {
    id: "yel1",
    sitename: "Yellowstone River - Gardiner Airport",
    latitude: "45.0445",
    longitude: "-110.73794",
    amphoraid: null,
  },
  {
    id: "lan1",
    sitename: "Landslide Creek",
    latitude: "45.04554",
    longitude: "-110.74589",
    amphoraid: null,
  },
  {
    id: "yel2",
    sitename: "Yellowstone River - Corwin Springs Fishing Access",
    latitude: "45.10781",
    longitude: "-110.79016",
    amphoraid: null,
  },
  {
    id: "mul1",
    sitename: "Mulherin Creek",
    latitude: "45.12792",
    longitude: "-110.80634",
    amphoraid: null,
  },
  {
    id: "ced1",
    sitename: "Cedar Creek",
    latitude: "45.14327",
    longitude: "-110.81286",
    amphoraid: null,
  },
  {
    id: "joe1",
    sitename: "Joe Brown Creek",
    latitude: "45.16534",
    longitude: "-110.83945",
    amphoraid: null,
  },
  {
    id: "sph1",
    sitename: "Sphinx Creek",
    latitude: "45.17118",
    longitude: "-110.87528",
    amphoraid: null,
  },
  {
    id: "tom1",
    sitename: "Tom Miner Creek",
    latitude: "45.198197",
    longitude: "-110.9086",
    amphoraid: null,
  },
  {
    id: "yel3",
    sitename: "Yellowstone River - Tom Miner Bridge",
    latitude: "45.2045",
    longitude: "-110.902",
    amphoraid: null,
  },
  {
    id: "big1",
    sitename: "Lower Big Creek ",
    latitude: "45.29916",
    longitude: "-110.8315",
    amphoraid: "f55e5e1b-8cd2-4740-8b82-1ec1332aded9",
  },
  {
    id: "big2",
    sitename: "Upper Big Creek",
    latitude: "45.30552",
    longitude: "-110.86668",
    amphoraid: "c57ee8e0-9273-4c1e-a83e-8fdc1b01c2ce",
  },
  {
    id: "dry1",
    sitename: "Dry Creek Pre-Diversion",
    latitude: "45.31766",
    longitude: "-110.82704",
    amphoraid: null,
  },
  {
    id: "yel4",
    sitename: "Yellowstone River - Reedfly Farm",
    latitude: "45.32877",
    longitude: "-110.77301",
    amphoraid: null,
  },
  {
    id: "emi1",
    sitename: "Emigrant Gulch",
    latitude: "45.32059",
    longitude: "-110.70985",
    amphoraid: null,
  },
  {
    id: "fri1",
    sitename: "Fridley Creek, South Fork",
    latitude: "45.34184",
    longitude: "-110.75401",
    amphoraid: null,
  },
  {
    id: "yel5",
    sitename: "Yellowstone River - Grey Owl Fishing Access",
    latitude: "45.398",
    longitude: "-110.704",
    amphoraid: null,
  },
  {
    id: "eig1",
    sitename: "Eight Mile Creek",
    latitude: "45.40911",
    longitude: "-110.69962",
    amphoraid: null,
  },
  {
    id: "mil1",
    sitename: "Mill Creek, lower",
    latitude: "45.413",
    longitude: "-110.649",
    amphoraid: null,
  },
  {
    id: "yel6",
    sitename: "Yellowstone River - Dan Bailey Fishing Access",
    latitude: "45.421",
    longitude: "-110.637",
    amphoraid: null,
  },
  {
    id: "yel7",
    sitename: "Yellowstone River - Mallards Rest Fishing Access",
    latitude: "45.483",
    longitude: "-110.62",
    amphoraid: null,
  },
  {
    id: "pin1",
    sitename: "Pine Creek, lower",
    latitude: "45.50474",
    longitude: "-110.56789",
    amphoraid: null,
  },
  {
    id: "mil2",
    sitename: "Mill Creek, upper",
    latitude: "45.29237",
    longitude: "-110.55551",
    amphoraid: null,
  },
  {
    id: "pin2",
    sitename: "Pine Creek, upper",
    latitude: "45.49973",
    longitude: "-110.5217",
    amphoraid: null,
  },
  {
    id: "yel8",
    sitename: "Yellowstone River - Pine Creek Fishing Access",
    latitude: "45.512",
    longitude: "-110.583",
    amphoraid: null,
  },
  {
    id: "yel9",
    sitename: "Yellowstone River - Carters Bridge Fishing Access",
    latitude: "45.597",
    longitude: "-110.566",
    amphoraid: null,
  },
];

const GoalInput = (props) => {
  //console.log("start of goal input");
  //const [isEditMode, setIsEditMode] = useState(false);

  let defaultVal = "";
  let defaultTemp = "";
  //const [editValue, setEditValue] = useState('')
  if (props.data) {
    //setIsEditMode(true);
    //console.log("edit data in goalinput: ", props.data.obsData.title);
    defaultVal = props.data.obsData.title;
    defaultTemp = props.data.obsData.temp;
    //setEditValue(props.data.obsData.title);
  }

  const [enteredJar, setEnteredJar] = useState("");
  // another way to write the above funtion is as a const equal to an arrow func:

  const [enteredComments, setEnteredComments] = useState("");

  // function to pull phone location
  const [currentLocationLat, setLocationLat] = useState("Loading...");
  //const [currentLocationLong, setLocationLong] = useState("Loading...");
  const [siteID, setSiteID] = useState("");

  const [locationIsSet, setLocationIsSet] = useState(false);

  const [isLoading, setLoading] = useState(true);

  const [respObj, setRespObj] = useState("");

  const goalInputHnadler = (enteredText) => {
    setEnteredJar(enteredText);
  };

  const commentsInputHnadler = (enteredText) => {
    setEnteredComments(enteredText);
  };

  const addObsHandler = () => {
    setLocationIsSet(false);
    let values = {
      title: siteID,
      location: currentLocationLat,
      jarNum: enteredJar,
      comments: enteredComments,
      time: getTimeStamp(),
    };

    if (props.data) {
      values["id"] = props.data.id;
    }
    //props.onAddGoal(enteredGoal, enteredOther, Date().toString());
    defaultVal = "";
    defaultTemp = "";
    props.onAddGoal(values);
  };

  // const [isCameraMode, setIsCameraMode] = useState(false);

  // const addCameraModeHandler = () => {
  //   setIsCameraMode(true);
  // };

  // const cancelCameraHandler = () => {
  //   setIsCameraMode(false);
  // };

  const cancelObservationHandler = () => {
    //console.log("in cancel");

    setLoading(true);
    props.onCancel();
    setLocationIsSet(false);

    defaultTemp = "";
    defaultVal = "";
  };

  const putRequest = async (dateTime, jarNum, observer) => {
    try {
      let response = await fetch(
        "http://epiic-fa01-dev.azurewebsites.net/api/dataobject",
        {
          method: "PUT",
          body: JSON.stringify({
            siteid: "yerc",
            t: dateTime,
            dobtype: "WQSample",
            name: "jar",
            value: jarNum,
            status: "new",
            observer: observer,
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
              Alert.alert(
                "somethig",
                "Submission Sucessful!",
                [{ text: "Okay", style: "destructive", onPress: cancelObservationHandler}]
              );
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

      // return responseJson.msg;
    } catch (error) {
      console.error(error);
    }
  };

  // POST REQUEST EXAMPLE
  // const postRequest = () => {
  //   console.log("in post request");
  //   //props.onAddGoal(enteredGoal, enteredOther);
  //   // testing post request
  //   // async function getMoviesFromApi() {
  //   try {
  //     const formData = new FormData();
  //     formData.append("email", "jjg.akers@gmail.com");
  //     formData.append("latitude", "99999");
  //     formData.append("longitude", "111111");
  //     formData.append("watertemp", "123");
  //     formData.append("comments", "From react-native app");

  //     let response = fetch(
  //       //"http://rivernet-mobile.azurewebsites.net/observation",
  //       {
  //         method: "POST",
  //         body: formData,
  //         //   headers: {
  //         //     Accept: "application/json",
  //         //     "Content-Type": "applicatoin/json"
  //         //   },
  //         //   body: JSON.stringify({
  //         //     email: "jjg.akers@gmail.com",
  //         //     latitude: "99999",
  //         //     longitue: "111111",
  //         //     watertemp: "123"
  //         //   })
  //       }
  //     );

  //     //let responseJson = response.json();
  //     console.log(response);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const submitObservationHanler = () => {
    // validate fields
    // send jarnumber, user, datetime
    let jarNum = enteredJar;
    let observer = props.id;
    let datetime = getTimeStamp();

    putRequest(datetime, jarNum, observer);
    //cancelObservationHandler();
  };

  //const locationRef = useRef("loading");
  //locationRef.current = location.coords.latitude;

  const getLocation = async () => {
    let { status } = await Location.getPermissionsAsync();

    //console.log('perm: ', status);
    let lat = "";
    let long = "";

    if (status !== "granted") {
      //console.log('perm: ', perm);
      // if locatin permission hasn't been granted yet, get permission
      let locperm = await Location.requestPermissionsAsync();
      //console.log(" in not granted, location perm: ", locperm.status);

      if (locperm.status === "granted") {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        // setLocationLat(location.coords.latitude);
        // setLocationLong(location.coords.longitude);
        lat = location.coords.latitude;
        long = location.coords.longitude;
        setLocationLat(lat + ", " + long);

        //setSiteID(lat + ", " + long);

        setLocationIsSet(true);
        //console.log("in locperm status granted, location: ", location.coords);
      } else {
        //console.log("location perm denied: ", locperm.status);
        setLocationLat("Unavailable");
        //setLocationIsSet(true);
      }
    } else {
      //console.log("in perm already granted");
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      // setLocationLat(location.coords.latitude);
      // setLocationLong(location.coords.longitude);
      //locationRef.current = location.coords.latitude;
      lat = location.coords.latitude;
      long = location.coords.longitude;
      setLocationLat(lat + ", " + long);

      //setSiteID(lat + ", " + long);

      //console.log("perm already granted location: ", currentLocationLat);
      setLocationIsSet(true);
    }

    //let siteIDFound = false;
    siteInfo.forEach((site) => {
      if (
        Math.abs(site.latitude - lat) <= 0.05 &&
        Math.abs(site.longitude - long) <= 0.05
      ) {
        //console.log("site lat: ", site.id);
        //console.log("diff: ", Math.abs(site.latitude - currentLocationLat));
        //siteIDFound = true;
        setSiteID(site.id);
        //console.log("sitename: ", site.id);
      }

    });
    //array1.forEach(element => console.log(element));
  };

  if (props.visible && !locationIsSet && !props.data) {
    //console.log('in props visible');
    getLocation();
  }

  //--- if site id unavailable, offer dropdown ----
  const [lang, setlang] = useState("js");

  return (
    <Modal visible={props.visible} animationType="slide" transparent={true}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.inputScreen}>
          <View style={styles.inputContainer}>
            {/* <View style={styles.location}>
            <Text>Location: {currentLocationLat}</Text>
          </View> */}
            <View style={styles.pickerContainer}>
              <View>
                <Text>Site ID:</Text>
              </View>
              <Picker
                style={styles.twoPickers}
                itemStyle={styles.twoPickerItems}
                selectedValue={siteID}
                onValueChange={(itemValue) => {
                  setSiteID(itemValue);
                }}
              >
                {siteInfo.map((value, index) => {
                  return (
                    <Picker.Item
                      key={index}
                      label={value.id}
                      value={value.id}
                    />
                  );
                })}
              </Picker>
            </View>

            {/* <Text>Site ID: {siteID}</Text> */}

            {/* onchange text takes a function that will execute everything text is updated */}
            {/* <Text>{Date().toString}</Text> */}
            <View style={styles.jarContainer}>
              <Text>Jar Number: </Text>
              <TextInput
                defaultValue={defaultVal}
                placeholder="Jar Number"
                keyboardType="numeric"
                //{props.data.obsData.temp}
                style={styles.input}
                onChangeText={goalInputHnadler}
                // set the value of the component to the current state, which will change on every text input:
                //value={defaultVal}
              />
            </View>
            <View style={styles.commentContainer}>
              <TextInput
                defaultValue={defaultTemp}
                //placeholder='Temp'
                multiline={true}
                placeholder="Comments"
                style={[styles.input, { borderBottomColor: "transparent" }]}
                onChangeText={commentsInputHnadler}
                //value={enteredTemp}
              />
            </View>

            {/* <View style={styles.photoContainer}>
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
          </View> */}

            <View style={styles.btnContainer}>
              <View style={styles.button}>
                <Button
                  title="CANCEL"
                  color="red"
                  onPress={cancelObservationHandler}
                />
              </View>
              <View style={styles.button}>
                <Button
                  title="SAVE"
                  fontWeight="bold"
                  onPress={addObsHandler}
                />
              </View>
            </View>

            <View style={styles.btnContainer}>
              <View style={styles.button}>
                <Button title="SUBMIT" onPress={submitObservationHanler} />
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
    // </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputScreen: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  inputContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",

    //flex: .5, // lets you conrol how much space the container will take up
    // flexDirection: "row",
    //justifyContent: "center",
    alignItems: "center",
    //borderColor: "black",
    //borderWidth: 1,
    //marginTop: 80,
    marginHorizontal: 20,
    marginTop: 100,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    backgroundColor: "white",
    elevation: 5,
    padding: 20,
    borderRadius: 20,
  },
  pickerContainer: {
    flexDirection: "row",
    borderColor: "grey",
    borderWidth: 1,
    alignItems: "center",
    width: "80%",
    padding: 5,
    borderRadius: 10,
    marginVertical: 10,
  },
  jarContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    width: "80%",
    //alignContent: 'center',
    //justifyContent: "center",
    marginBottom: 10,
    padding: 10,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 10,
  },
  commentContainer: {
    backgroundColor: "white",
    //flex: 1,
    borderColor: "grey",
    borderWidth: 1,
    width: "80%",
    minHeight: 100,
    borderRadius: 10,
    padding: 10,
  },
  input: {
    width: "80%",
    //borderBottomColor: "black",
    //borderBottomWidth: 1,
    //padding: 10,
    //marginBottom: 10,
  },
  location: {
    //flexDirection: "row",
    width: "80%",
    //borderBottomColor: "black",
    //borderBottomWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginVertical: 10,
  },
  button: {
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 1,
    shadowOpacity: 0.26,
    backgroundColor: "#e6e6e6",
    elevation: 5,
    //padding: 20,
    borderRadius: 10,
    fontSize: 5,
    borderWidth: 1.5,
    borderColor: "#757575",
    width: "40%",
    //fontWeight: 'bold',
  },
  photoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    padding: 20,
    // borderBottomWidth: 1,
    // borderBottomColor: 'black'
  },
  img: {
    width: 50,
    height: 50,
    borderColor: "black",
    borderWidth: 1,
    resizeMode: "contain",
  },
  photoButton: {
    borderColor: "black",
    borderWidth: 1,
    height: 50,
  },
  twoPickers: {
    justifyContent: "center",
    width: "80%",
    height: 30,
    //backgroundColor: "#e6e6e6",
    //margin: 0,
    // padding: 0,
    //borderColor: "black",
    //borderWidth: 1,
    // borderColor: "black",
    // borderWidth: 1,
  },
  twoPickerItems: {
    transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }],
    height: 80,
    color: "black",
    //borderColor: "black",
    //borderWidth: 1,
    padding: 0,
    margin: 0,
    textDecorationLine: "none",
    //textDecorationStyle: 'none',
    //fontSize: 10,
  },
});

export default GoalInput;
