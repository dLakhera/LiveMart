import React, { useState, useCallback } from "react";
import { View, FlatList, Text, AsyncStorage, StyleSheet, Dimensions } from "react-native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import { useFocusEffect } from "@react-navigation/native";
import OrderCard from "../../Shared/OrderCard";
var { width } = Dimensions.get('window');

const Orders = (props) => {
  const [orderList, setOrderList] = useState();

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("jwt").then((res) => {
        getOrders(res);
      });
      return () => {
        setOrderList();
      };
    }, [])
  );

  const getOrders = (res) => {
    axios
      .get(`${baseURL}orders/seller`, {
        headers: {
          authorization: "Bearer " + res,
        },
      })
      .then((x) => {
        setOrderList(x.data);
        console.log("OrdersReceived: ", JSON.stringify(x.data))
      })
      .catch((error) => console.log(error));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orderList}
        renderItem={({ item }) => (
          <OrderCard navigation={props.navigation} key={item._id} Order={item} editMode={true} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    alignContent:"center",
    justifyContent:"center",
    marginLeft:15,
    width: width,
  },
})
export default Orders;
