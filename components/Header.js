import React from "react";
import { Text, View, StyleSheet } from "react-native";

import Colors from "../constants/colors";

const Header = props => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}> {props.title}</Text>
        </View>
    );

};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 90,
        paddingTop: 36,
        backgroundColor: Colors.header,
        alignItems: 'center',
        justifyContent: 'center',
        color: 'blue',
        opacity: .85,
    },
    headerTitle: {
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
        opacity: 1,

    }
});

export default Header;
