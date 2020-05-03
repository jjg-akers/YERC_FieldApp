import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { GestureHandler, Icon } from "expo";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
//const { Swipeable } = GestureHandler;
//const { Swipeable } = GestureHandler;
import { Swipeable } from "react-native-gesture-handler";
import { getOrientationAsync } from "expo/build/ScreenOrientation/ScreenOrientation";

export const Separator = () => <View style={styles.separator} />;

const LeftActions = ({ progress, dragX, onPressEdit, onPressSubmit, id }) => {
  const scale = dragX.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  return (
    <View style={styles.leftActionContainer}>
      <TouchableOpacity onPress={onPressEdit.bind(this, id)}>
        <View style={[styles.leftAction, styles.border]}>
          <Animated.Text
            style={[styles.actionText, { transform: [{ scale }] }]}
          >
            <Ionicons size={40} color="black" name="md-create" />
          </Animated.Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressSubmit.bind(this, id)}>
        <View style={styles.leftAction}>
          <Animated.Text
            style={[styles.actionText, { transform: [{ scale }] }]}
          >
            <Ionicons size={40} color="black" name="md-cloud-upload" />
          </Animated.Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const RightActions = ({ progress, dragX, onPressDelete, id }) => {
  const scale = dragX.interpolate({
    inputRange: [-100, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  return (
    <TouchableOpacity onPress={onPressDelete.bind(this, id)}>
      <View style={styles.rightAction}>
        <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>
          <Ionicons
            size={50}
            //onPress={() => alert("Delete")}
            color="#dc3545"
            name="md-trash"
            // name={
            //   Platform.OS === 'ios'
            //     ? `ios-trash-outline`
            //     : 'md-trash'
            // }
          />
          {/* <Ionicons
                name="md-close"
                size={50}
                color="red"
                onPress={props.onCancel}
              /> */}
        </Animated.Text>
      </View>
    </TouchableOpacity>
  );
};

const GoalItem = (props) => {
  //console.log("in goalitem");
  //const date = new Date().toString;
  return (
    // .bind sets a default argument
    //onPress={props.onDelete.bind(this, props.id)

    // <TouchableOpacity onPress={props.onOpen.bind(this, props.id)}>
    <Swipeable
      //renderLeftActions={LeftActions}
      renderLeftActions={(progress, dragX) => (
        <LeftActions
          progress={progress}
          dragX={dragX}
          onPressEdit={props.onSwipeFromLeft}
          onPressSubmit={props.onSwipeFromLeftSubmit}
          id={props.id}
        />
      )}
      //onSwipeableLeftOpen={props.onSwipeFromLeft}
      renderRightActions={(progress, dragX) => (
        <RightActions
          progress={progress}
          dragX={dragX}
          onPressDelete={props.onRightPress}
          id={props.id}
        />
      )}
    >
      <View style={styles.listItem}>
        <View style={styles.listItemText}>
          <Text>Site: {props.title.title}</Text>
        </View>
        <View style={styles.listItemText}>
          <Text>Date: {props.title.time}</Text>
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    //paddingHorizontal: 70,
    paddingVertical: 10,
    marginVertical: 10,
    backgroundColor: "#ccc",
    borderColor: "black",
    borderWidth: 1,
    // alignItems: 'flex-start',
    // justifyContent: "flex-start",
    //width: '100%',
  },
  listItemText: {
    minWidth: '80%',
    // padding: 10,
    marginVertical: 3,
    paddingHorizontal: 10,
    // alignItems: 'flex-start',
    // justifyContent: "flex-start",
    // borderColor: "black",
    // borderWidth: 1,
  },
  leftActionContainer: {
    //flex: 1,
    backgroundColor: "white",
    //backgroundColor: "#388e3c",
    flexDirection: "row",
    marginVertical: 10,
    width: 160,
    justifyContent: "center",
    //alignItems: "center",
  },
  leftAction: {
    flex: 1,
  },
  border: {
    borderRightColor: "grey",
    borderRightWidth: 0.5,
  },
  rightAction: {
    backgroundColor: "white",
    //backgroundColor: "#dd2c00",
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
    marginVertical: 10,
  },

  actionText: {
    color: "#fff",
    fontWeight: "600",
    padding: 20,
  },
});

export default GoalItem;
