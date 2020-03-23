import React from "react";
import { View, StyleSheet, Text, TextInput, Button } from "react-native";
import Card from "../components/Card";

const LoginScreen = props => {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Login</Text>
      <Card style={styles.inputContainer}>
        <Text>Enter Email</Text>
        <TextInput />
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button title="Login" onPress={() => {}} color="#c717fc" />
          </View>
          <View style={styles.button}>
            <Button title="Sign Up" onPress={() => {}} color="#f7287b" />
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: "center"
  },
  title: {
    fontSize: 20,
    marginVertical: 10
  },
  inputContainer: {
    width: 300,
    maxWidth: "80%",
    alignItems: "center"
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 15
  },
  button: {
      width: 100,

  }
});

export default LoginScreen;
