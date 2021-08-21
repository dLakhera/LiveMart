import React from 'react';
import { StyleSheet,Dimensions } from 'react-native'
import { TextInput } from 'react-native-paper';

const {width,height}= Dimensions.get("window");
const Input = (props) => {
    return (
        <TextInput
        style={styles.input}
        placeholder={props.placeholder}
        name={props.name}
        id={props.id}
        value={props.value}
        autoCorrect={props.autoCorrect}
        onChangeText={props.onChangeText}
        onFocus={props.onFocus}
        secureTextEntry={props.secureTextEntry}
        keyboardType={props.keyboardType}
        >
        </TextInput>
    );
}

const styles = StyleSheet.create({
  input: {
    // fontFamily: "roboto-regular",
    color: "#1D0054",
    height: 55,
    width: width/2,
    borderWidth: 2,
    borderColor: "#1D0054",//"rgba(151,203,151,1)",
    //borderStyle: "dotted",
    borderRadius: 10,
    textAlign: "center",
    //backgroundColor: "rgba(255,255,255,1)",
    marginTop:10
  },
});

export default Input;