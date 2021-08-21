import { View, Card, CardItem, Container } from 'native-base';
import React from 'react';
import { ScrollView, Dimensions, StyleSheet, Text } from 'react-native';
import Toast from "react-native-toast-message";
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Input from '../../Shared/Form/Input';
import EasyButton from '../../Shared/StyledComponents/EasyButton';
import baseURL from '../../assets/common/baseUrl'
var { width, heigth } = Dimensions.get("window");

class Feedback extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            comment: "",
            token: "",
            show: Boolean(true),
            ItemID: props.route.params.item.id,
            SellerID: props.route.params.Seller,
            reply:""
        }
        this.setComment = this.setComment.bind(this);
        this.setToken = this.setToken.bind(this);
        this.sendComment = this.sendComment.bind(this);
        this.setShow = this.setShow.bind(this);
    }

    componentDidMount() {
        AsyncStorage.getItem("jwt")
            .then(res => {
                this.setToken(res);
                axios
                    .post(`${baseURL}feedback`, { AddressedToID: this.state.SellerID }, {
                        headers: {
                            authorization: "Bearer " + res,
                        },
                    })
                    .then(response => {
                        var feedbacks = response.data
                        if (feedbacks.length) {
                            this.setComment(feedbacks.Query)
                            this.setReply(feedbacks.Reply)
                            this.setShow();
                        }
                    }).catch(err => console.log(err))
            })
    }

    setShow = () => {
        this.setState({
            show: !this.state.show
        });
    }

    setComment = (text) => {
        this.setState({
            comment: text
        })
    }

    setToken = (text) => {
        this.setState({
            token: text
        })
    }
    
    setReply = (text) => {
        this.setState({
            reply: text
        })
    }

    sendComment = () => {
        let commentBody = {
            dateOfComment: Date.now(),
            AddressedToID: this.state.SellerID,   // somehow get retailer id here
            ItemID: this.state.ItemID,  // somehow get item ID about which the feedbeck is, here
            Query: this.state.comment   // this we have picked up from input
        }
        axios.post(`${baseURL}feedback/submit`, commentBody, {
            headers: {
                authorization: "Bearer " + this.state.token,
            }
        })
            .then((response) => {

                switch (response.status) {
                    case 200:
                    case 201:
                        Toast.show({
                            topOffset: 60,
                            type: "success",
                            text1: "Comment successfully posted",
                            text2: "Expect a reply soon",
                        });
                        this.setShow();
                        break;
                    default:
                        Toast.show({
                            topOffset: 60,
                            type: "error",
                            text1: "Something went wrong",
                            text2: "Please try again",
                        });
                        break;
                }
            })
            .catch(err => {
                console.log(err);
            })

    }


    render() {
        return (
            <Container style={styles.container}>

                {
                    this.state.show ? (<View>
                        <Input
                            placeholder={"Comment here..."}
                            name={"Comment"}
                            id={"Comment"}
                            value={this.state.comment}
                            onChangeText={(text) => this.setComment(text)}
                        />
                        <EasyButton large primary title="Send" onPress={() => this.sendComment()} >
                            <Text style={{ color: "white" }}>Submit Feedback</Text>
                        </EasyButton>
                    </View>
                    ) : (
                        <Card>
                            <CardItem header>
                                <Text>Query: {this.state.comment}</Text>
                            </CardItem>
                            <CardItem header>
                                <Text>Reply: {this.state.reply}</Text>
                            </CardItem>
                        </Card>

                    )
                }
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
});

export default Feedback;