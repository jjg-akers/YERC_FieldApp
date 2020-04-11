import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "../screens/LoginScreen";
import Profile from "../screens/ProfileScreen";
import EditScreen from "../screens/EditScreen";
import { Button } from "react-native";

const Stack = createStackNavigator();

function MainStackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#24753a",
          },
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTintColor: "black",
          headerBackTitle: null,
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: "Login Screen",
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Profile"
          component={Profile}
          options={({ route }) => ({
            title: route.params.user.id,
            headerLeft: null,
            // headerRight: () => (
            //   <TouchableOpacity onPress={() => alert("Button Pressed")}>
            //     <Ionicons size={30} color="#fff" name="md-settings" style={{paddingRight: 30}}/>
 
            //   </TouchableOpacity>
            // ),
          })}

          // {{ title: "Profile Screen" }}
        />

        <Stack.Screen
          name="EditScreen"
          component={EditScreen}
          options={{ title: "Edit Observation" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainStackNavigator;
