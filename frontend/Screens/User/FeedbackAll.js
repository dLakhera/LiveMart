import React, { useContext, useState, useEffect } from "react";
import { Card, CardItem, View, Text, Thumbnail } from 'native-base'
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AsyncStorage from "@react-native-community/async-storage";
import TrafficLight from "../../Shared/StyledComponents/TrafficLight";
import { ScrollView } from "react-native";
function ItemView(props) {
    // console.log(props)
    return (
        <View>
            <Card>
                <CardItem>
                    <Thumbnail
                        source={{
                            uri: props.x.ItemID.image
                                ? props.x.ItemID.image
                                : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
                        }}
                    />
                    <Text>  {props.x.ItemID.Name} </Text>
                </CardItem>
                <CardItem>
                    <Text> Seller: {props.x.AddressedFromName} </Text>
                </CardItem>
                <CardItem>
                    <Text>Query: {props.x.Query} </Text>
                    {props.x.Replied ? <TrafficLight available></TrafficLight> : <TrafficLight unavailable></TrafficLight>}
                </CardItem>

                {props.x.Replied ?
                    (<CardItem>
                        <Text>Seller's Reply: {props.x.Reply} </Text>
                    </CardItem>)
                    : null
                }
            </Card>
        </View>
    );
}

const FeedbackAll = () => {

    const [feedbacks, setAllFeedbacks] = useState([]);

    useEffect(() => {
        AsyncStorage.getItem("jwt")
            .then(res => {
                axios.get(`${baseURL}feedback/from`, {
                    headers: {
                        authorization: "Bearer " + res
                    }
                })
                    .then(response => {
                        setAllFeedbacks(response.data);
                    }).catch(err => {
                        console.log(err);
                    })
            })
    }, [])

    return (
        <ScrollView>
            {feedbacks ? feedbacks.map((x) => {
                return (<ItemView key={x._id} x={x} />)
            }) : null}
        </ScrollView>
    );

}
export default FeedbackAll;