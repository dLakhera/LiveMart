import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card, CardItem, Thumbnail } from 'native-base';

import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import axios from 'axios'
import baseURL from "../../assets/common/baseUrl";

const FeedbackItem = (props) => {

    const [reply, setReply] = useState("")
    const [show, setShow] = useState(true);
   
    return (

        <Card>

            <CardItem>
                <Thumbnail
                    source={{
                        uri: props.feedback.ItemID.image
                            ? props.feedback.ItemID.image
                            : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
                    }}
                />
                <Text> {props.feedback.ItemID.Name}</Text>
            </CardItem>
            <CardItem>
                <Text>Query: {props.feedback.Query}</Text></CardItem>
            <CardItem>
                <Text>Customer: {props.feedback.AddressedFromID}</Text>
            </CardItem>
            <CardItem>
                {show ? (<>
                    <Input
                        placeholder={"Your response"}
                        name={"reply"}
                        id={"reply"}
                        value={reply}
                        onChangeText={(text) => setReply(text)}
                    />
                    <EasyButton large primary onPress={() => {
                        axios.put(baseURL + 'feedback/reply', { reply: reply, feedbackID: props.feedback._id }, { headers: { authorization: "Bearer " + props.token } }).then(res => {
                            setShow(false);
                        }
                        )

                    }}>
                        <Text style={{ color: "white" }}>Reply</Text>
                    </EasyButton>
                </>
                ) : <Text>Reply: {reply}</Text>}
            </CardItem>
        </Card>

    )
}
export default FeedbackItem;