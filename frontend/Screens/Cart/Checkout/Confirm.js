import React from "react";
import { View, StyleSheet, Dimensions, ScrollView, Button } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Text, Left, Right, ListItem, Thumbnail, Body, Card, CardItem } from "native-base";
import { connect } from "react-redux";
import * as actions from "../../../Redux/Actions/cartActions";

import Toast from "react-native-toast-message";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";

var { width, height } = Dimensions.get("window");

const Confirm = (props) => {

  const confirmOrder = () => {
    const order = props.route.params.order.order;
    AsyncStorage.getItem("jwt").then((res) => {
      axios
        .post(`${baseURL}orders`, order, {
          headers: { Authorization: `Bearer ${res}` },
        })
        .then((response) => {
          if (response.status == 200 || response.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Order Completed",
              text2: "",
            });
            setTimeout(() => {
              props.clearCart();
              props.navigation.navigate("Cart")
            }, 500);
          }
        })
        .catch((error) => {
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        });
    });
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Confirm Order</Text>
        {props.route.params ? (
          <View style={{ borderWidth: 1, borderColor: "orange" }}>
            <Text style={styles.title}>Shipping to:</Text>
            <View style={{ padding: 8 }}>
              <Text>Address: {props.route.params.order.order.address}</Text>
              <Text>Order Mode: {props.route.params.order.order.orderType}</Text>
            </View>
            <Text style={styles.title}>Items:</Text>
            {props.route.params.order.order.orderItems.Items.map((data) => {
              return (
                <ListItem style={styles.listItem} key={data._id} avatar>
                  <Body style={styles.body}>
                    <Card style={styles.card}>
                      <CardItem>
                        <Thumbnail
                          source={{
                            uri: data.Item.image
                              ? data.Item.image
                              : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
                          }}
                        />
                        <Text style={{ fontWeight: "bold" }}>   {data.Item.Name}</Text>
                      </CardItem>

                      {/* <CardItem header>	
                      </CardItem> */}

                      <CardItem>
                        <Left>
                          <Text>Sellers: </Text>
                        </Left>
                      </CardItem>
                      <CardItem>
                        <Left>
                          <Text>{data.Sellers[0].Name}</Text>
                        </Left>
                        <Right>
                          <Text> ₹ {data.Sellers[0].Price} X {data.Sellers[0].Quantity_to_buy} </Text>
                        </Right>
                      </CardItem>

                    </Card>
                  </Body>
                </ListItem>

              );
            })}
          </View>
        ) : null}
        <View style={{ alignItems: "center", margin: 20 }}>
          <Button title={"Place order"} onPress={confirmOrder} />
        </View>
      </View>
    </ScrollView>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => dispatch(actions.clearCart()),
  };
};

const styles = StyleSheet.create({
  container: {
    // height: height,
    // padding: 8,
    alignContent: "center",
    backgroundColor: "white",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 50,
  },
  title: {
    alignSelf: "center",
    // marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  listItem: {
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
    width: width * 0.9,
  },
  card: {
    width: 0.8 * width,
    alignItems: "center",
    justifyContent: "center",
    marginLeft:-30
  },
  body: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    // height: height
  }
});

export default connect(null, mapDispatchToProps)(Confirm);
