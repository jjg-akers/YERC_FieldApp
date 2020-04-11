import React from "react";
import { View, StyleSheet, TouchableOpacity, Button, Modal } from "react-native";

const Settings = (props) => {
  return (
    <Modal visible={props.visible} animationType="slide">
    <TouchableOpacity style={styles.logout}>
      <View>
        <Button title="Log out"  />
      </View>
    </TouchableOpacity>
    </Modal>
  );
};

//onPress={deleteUserID}

const styles = StyleSheet.create({
  logout: {
    marginVertical: 10,
    width: "80%",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
  },
  card: {
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
    borderRadius: 10,
  },
});

export default Settings;
