import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Card, CardItem } from 'native-base';

import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import { Picker } from "@react-native-community/picker";
import AsyncStorage from "@react-native-community/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { getUserProfile } from "../../Context/actions/Auth.actions";
import FeedbackItem from "./FeedbackItem";

import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import { MaterialIcons } from "@expo/vector-icons";

const Feedback = () => {

    const [feedbacks, setFeedbacks] = useState([]);
    const [token, setToken] = useState("");
    const isMountedVal = useRef(1);

    useEffect(() => {
        isMountedVal.current = 1;
        AsyncStorage.getItem("jwt")
            .then(res => {
                setToken(res);
                axios
                    .get(`${baseURL}feedback/to`, {
                        headers:
                            { authorization: "Bearer " + res }
                    })
                    .then((response) => {
                        setFeedbacks(response.data);
                        // console.log(response.data)
                        // console.log("FEEDBACKS GOT: " + feedbacks.length)
                    })
            })
        return (() => {
            // setToken();
            isMountedVal.current = 0;
        })
    }, [isMountedVal]);
    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >
            <View style={styles.container}>
                {
                    (feedbacks && feedbacks.length) ?
                        feedbacks.map((x) => {
                            return (
                                <FeedbackItem feedback={x} token={token} />
                            )
                        })
                        : <Text>NO PENDING QUERIES</Text>
                }
            </View>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
});

export default Feedback;
