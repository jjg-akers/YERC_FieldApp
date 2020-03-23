import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Modal, Image } from "react-native";
import { Camera } from "expo-camera";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons
} from "@expo/vector-icons";
//import Icon from 'react-native-vector-icons/dist/FontAwesome';

const CameraView = props => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  // save photo uri
  const [photoPath, setPhotoPath] = useState("../yerc_whitegreen.png");

  const something = "../yerc_whitegreen.png";

  const imageTakenHandler = photo => {
    //setPhotoURI(photo);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  takePicture = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <Modal visible={props.cameraVisible} animationType="slide">
      <View style={{ flex: 1 }}>
        <Camera
          style={{ flex: 1 }}
          type={type}
          ref={ref => {
            this.camera = ref;
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 30
            }}
          >
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                alignItems: "center",
                backgroundColor: "transparent"
              }}
              onPress={() => console.log("image picker")}
            >
              <Ionicons
                name="ios-photos"
                style={{ color: "#fff", fontSize: 40 }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                alignItems: "center",
                backgroundColor: "transparent"
              }}
              onPress={() => {
                console.log("take a picture");
                this.takePicture();
              }}
              //onPress={()=>this.takePicture()}
            >
              <FontAwesome
                name="camera"
                style={{ color: "#fff", fontSize: 40 }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                alignItems: "center"
              }}
              onPress={() => {
                console.log("flip camera");
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <Ionicons
                name="md-close"
                size={50}
                color="red"
                onPress={props.onCancel}
              />
              {/* <Ionicons
                name="md-checkmark-circle"
                size={40}
                color="red"
                //onPress={() => deleteObs(item.id)}
              /> */}
              {/* <MaterialCommunityIcons
                name="camera-switch"
                style={{ color: "#fff", fontSize: 40 }}
              /> */}
            </TouchableOpacity>
          </View>
        </Camera>
        {/* <Image
          source={require('../yerc_whitegreen.png' )}
          style={{
            width: 40,
            height: 40,
            // flex: 1,
            resizeMode: 'cover'
          }}
        /> */}
        {/* //require('../yerc_whitegreen.png') */}
      </View>
    </Modal>
  );
};

export default CameraView;
