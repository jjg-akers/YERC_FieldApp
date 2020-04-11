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
        backgroundColor: '#24753a',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'blue',
    },
    headerTitle: {
        color: 'black',
        fontSize: 24,

    }
});

export default Header;
