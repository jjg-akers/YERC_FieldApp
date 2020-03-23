import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const GoalItem = props => {
  //const date = new Date().toString;
  return (
    // props.onDelet, this calls the function on delete that was passed
    // to the component as a prop

    // .bind sets a default argument
    <TouchableOpacity onPress={props.onDelete.bind(this, props.id)} >
      <View style={styles.listItem}>
        <Text>{Date().toString()}</Text>
        <Text>Data1: {props.title.obsTitle}</Text>
        <Text>Data2: {props.title.obsData}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItem: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#ccc",
    borderColor: "black",
    borderWidth: 1
  }
});

export default GoalItem;
