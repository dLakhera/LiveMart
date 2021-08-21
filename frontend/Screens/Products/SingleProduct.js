import React, { useState, useEffect, useContext, Component } from 'react'
import { Image, View, StyleSheet, Text, ScrollView, Dimensions } from 'react-native';
import { Left, Right, Body, Container, H1, ListItem, Card, CardItem } from 'native-base';
import getLocation from '../../Shared/getLocation'


//review
import { Rating } from 'react-native-ratings';
import Input from "../../Shared/Form/Input";
import EasyButton from "../../Shared/StyledComponents/EasyButton";

import Toast from 'react-native-toast-message';
import TrafficLight from '../../Shared/StyledComponents/TrafficLight'
import { connect } from 'react-redux';
import * as actions from '../../Redux/Actions/cartActions';
import AuthGlobal from '../../Context/store/AuthGlobal';
import axios from "axios";
import baseURL from '../../assets/common/baseUrl';
import Filter from './Filter';
var { width } = Dimensions.get("window");


const filterData = [
    { title: 'All', value: 0 },
    { title: '5 kms', value: 5 },
    { title: '10 kms', value: 10 },
    { title: '20 kms', value: 20 },
    { title: '60 kms', value: 60 }
]

const SingleProduct = (props) => {
    const context = useContext(AuthGlobal);

    const [item, setItem] = useState(props.route.params.item);
    const [rating, setRating] = useState((props.route.params.item.rating / props.route.params.item.numReviews));
    const [review, setReview] = useState("");
    const [availability, setAvailability] = useState(null);
    const [availabilityText, setAvailabilityText] = useState("")
    const [rated, setRated] = useState();
    const [reviews, setReviews] = useState()
    const [region, setRegion] = useState({})
    const [sellers, setSellers] = useState(props.route.params.item.Sellers)
    const [filterDistance, setFilterDistance] = useState();

    useEffect(() => {
        axios.get(baseURL + "reviews/" + item.id, {
            headers: {
                authorization: `Bearer ` + context.stateUser.token,
            },
        }).then((response) => {
            if (response.data.Reviews.length)
                setReviews(response.data.Reviews);
            if (response.data.myRating) {
                setRated(response.data.myRating);
            }
        });


        if (props.route.params.item.TotalQuantity == 0) {
            setAvailability(<TrafficLight unavailable></TrafficLight>);
            setAvailabilityText("Unvailable!\n\n\n Next Available On: ")
        } else if (props.route.params.item.TotalQuantity <= 5) {
            setAvailability(<TrafficLight limited></TrafficLight>);
            setAvailabilityText("Limited Stock")
        } else {
            setAvailability(<TrafficLight available></TrafficLight>);
            setAvailabilityText("Available")
        }

        getLocation().then((data) => {
            setRegion(data);
            getDistanceBwt(data);
        })

        /*  setSellers( //to be added on filter click
             sellers.sort(function (a, b) {
                 return a.distance > b.distance;
             })
         ); */

        return () => {
            setAvailability(null);
            setAvailabilityText("");
            setRated();
            setReviews();
            setRegion();
        }
    }, [])

    const FindDist = (url, i) => {
        axios.get(url)
            .then(data => {
                data = data.data;
                var tempSellers = sellers;
                tempSellers[i].distance = data.rows[0].elements[0].distance.value / 1000;
                setSellers(tempSellers);
            }).catch(err => {
                console.log(err);
            });
    }

    const getDistanceBwt = (data) => {
        for (var i = 0; i < sellers.length; i++) {
            var url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${data.latitude},${data.longitude}&destinations=${sellers[i].Address.latitude},${sellers[i].Address.longitude}&key=AIzaSyCSJg197HNnhk43JQCdkan-AXbtojffOnU`
            FindDist(url, i);
        }
    }

    /* sellers.sort(function(a,b){
        return a.distance>b.distance;
    }) */

    // const getDistanceBwt = (regionSeller) => {
    //     regionSeller.sort(async function(a,b){
    //         var regionA = a.address;
    //         var regionB = b.address;
    //         var distA = 0, distB = 0;
    //         var url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${region.latitude},${region.longitude}&destinations=${regionA.lat},${regionA.long}&key=AIzaSyCSJg197HNnhk43JQCdkan-AXbtojffOnU`
    //         await axios.get(url)
    //             .then(data=>{
    //                 distA = data.rows[0].elemets[0].distance.value;
    //             }).catch(err=>{
    //                 consolde.log(err);
    //             });
    //         var url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${region.latitude},${region.longitude}&destinations=${regionB.lat},${regionB.long}&key=AIzaSyCSJg197HNnhk43JQCdkan-AXbtojffOnU`
    //         await axios.get(url)
    //             .then(data=>{
    //                 distB = data.rows[0].elemets[0].distance.value;
    //             }).catch(err=>{
    //                 consolde.log(err);
    //             });
    //     return distA > distB;
    //     });
    //     // var url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${region.latitude},${region.longitude}&destinations=${regionSeller.lat},${regionSeller.long}&key=AIzaSyCSJg197HNnhk43JQCdkan-AXbtojffOnU`
    //     return regionSeller;
    // }

    const handleSendReview = () => {
        axios.post(baseURL + 'reviews/submit',
            {
                Rating: rating,
                Review: review,
                itemID: item.id
            }, {
            headers: {
                authorization: `Bearer ` + context.stateUser.token,
            },
        }).then(() => {
            Toast.show({
                topOffset: 60,
                type: "success",
                text1: `Reveiw Posted`,
                text2: ""
            })
        });
    }
    const ratingCompleted = (rating) => {
        setRating(rating)
    }
    return (
        <Container style={styles.container}>
            <ScrollView style={{ padding: 5 }}>
                <View>
                    <Image
                        source={{
                            uri: item.image ? item.image
                                : 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png'
                        }}
                        resizeMode="contain"
                        style={styles.image}
                    />
                </View>
                <View style={styles.contentContainer}>
                    <H1 style={styles.contentHeader}>{item.Name}</H1>
                    <Text style={styles.contentText}>{item.brand}</Text>
                    <Text style={styles.Name}>Rating: {Math.round(item.rating / item.numReviews * 10) / 10}</Text>
                </View>
                <View style={styles.availabilityContainer}>
                    <View style={styles.availability}>
                        {availability}
                        <Text style={{ marginRight: 10 }}>
                            Availability: {availabilityText}
                        </Text>
                    </View>
                    {item.description && item.description != 'undefined' ? (<Text note>{item.description}</Text>
                    ) : null}
                </View>

                {rated ? null : (
                    <>
                        <View style={styles.availabilityContainer}>

                            <Rating
                                showRating
                                readonly={rated ? true : false}
                                startingValue={rating}
                                defaultRating={rating}
                                onFinishRating={ratingCompleted}
                                style={{ paddingVertical: 10 }}
                            />
                        </View>
                        <View style={styles.availabilityContainer}>

                            <Input placeholder='Review'
                                onChangeText={(text) => setReview(text)}
                                name={"review"}
                                id={"review"}
                            />
                        </View>
                        <View style={styles.availabilityContainer}>
                            <EasyButton primary style={{ innerHeight: 5 }} onPress={() => handleSendReview()}>
                                <Text style={{ color: "black" }}>Submit Reveiw</Text>
                            </EasyButton>

                        </View>
                    </>
                )}
                <Filter data={filterData}
                    onValueChange={(id) => {
                        sellers.sort(function (a, b) {
                            return a.distance > b.distance;
                        })
                        setFilterDistance(filterData[id].value);
                    }} />

                <View /*style={styles.item} */>
                    {sellers.map((x) => {
                        if (!filterDistance || x.distance <= filterDistance)
                            return (
                                <ListItem key={x._id}>
                                    <Left>
                                        <Text style={styles.Name}>{x.SellerName} {x.distance ? Math.round(x.distance * 10) / 10 : null}{x.distance?km:null}</Text>
                                        <Text> * {x.Quantity}  </Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.price}>₹ {x.Price}</Text>
                                        {(!props.route.params.admin) ? (
                                            <Right>
                                                <EasyButton
                                                    primary
                                                    medium
                                                    onPress={() => {
                                                        axios.post(baseURL + 'cart',
                                                            {
                                                                Item: item.id,
                                                                seller: { Quantity_to_buy: 1, seller: x.Seller, price: x.Price, Name: x.SellerName }
                                                            }, {
                                                            headers: {
                                                                authorization: `Bearer ` + context.stateUser.token,
                                                            },
                                                        }).then(() => {
                                                            axios.get(baseURL + 'cart',
                                                                {
                                                                    headers: {
                                                                        authorization: `Bearer ` + context.stateUser.token,
                                                                    }
                                                                }).then(res => {
                                                                    props.addItemToCart(res.data);
                                                                    Toast.show({
                                                                        topOffset: 60,
                                                                        type: "success",
                                                                        text1: `${item.Name} added to Cart`,
                                                                        text2: "Go to your cart to complete order"
                                                                    })
                                                                }).catch((error) => alert(error));

                                                        })
                                                    }}
                                                >
                                                    <Text style={{ color: 'white' }}>Add</Text>
                                                </EasyButton>
                                            </Right>
                                        ) : null}
                                    </Right>
                                </ListItem>
                            )
                    })}
                </View>


                {reviews ? (
                    <View>
                        <View>
                            <H1 style={styles.contentHeader}>Reviews: </H1>
                        </View>
                        {reviews.map((x) => {
                            return (
                                <ListItem key={x._id}>
                                    <Card>
                                        <CardItem>
                                            <Left>
                                                <Text>Review By: {x.userName}</Text>
                                            </Left>
                                            <Right>
                                                <Text>Rating : {Math.round(x.Rating * 10) / 10}</Text>
                                            </Right>
                                        </CardItem>
                                        <CardItem><Text>Review : {x.review}</Text></CardItem>
                                    </Card>
                                </ListItem>
                            )
                        })}

                    </View>


                ) : null}
            </ScrollView>

        </Container>
    )

}

const mapToDispatchToProps = (dispatch) => {
    return {
        addItemToCart: (cart) =>
            dispatch(actions.updateCart(cart))
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: '100%'
    },
    imageContainer: {
        backgroundColor: 'white',
        padding: 0,
        margin: 0
    },
    image: {
        width: '100%',
        height: 250
    },
    Name: {
        fontSize: 16,
        flexWrap: "wrap",
        width: width * 0.4
    },
    contentContainer: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentHeader: {
        fontWeight: 'bold',
        margin: 20
    },
    contentText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20
    },
    price: {
        color: 'red',
        fontSize: 17,
        flexWrap: "wrap",
        width: width * 0.2
    },
    availabilityContainer: {
        alignItems: "center"
    },
    availability: {
        flexDirection: 'row',
    },
    Button: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default connect(null, mapToDispatchToProps)(SingleProduct);