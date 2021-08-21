import React from "react";
import { StyleSheet } from "react-native";
import { Badge, Text } from "native-base";

import { connect } from "react-redux";

const CartIcon = (props) => {
  return (
    <>
      {props.cartItems && props.cartItems.Items && props.cartItems.Items.length ? (
        <Badge style={styles.badge}>
          <Text style={styles.text}>{props.cartItems.Items.length}</Text>
        </Badge>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => {
  const { cartItems } = state;
  return {
    cartItems: cartItems,
  };
};

const styles = StyleSheet.create({
  badge: {
    width: 25,
    position: "absolute",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    top: -5,
    right: -10,
  },
  text: {
    fontSize: 12,
    width: 100,
    fontWeight: "bold",
  },
});

export default connect(mapStateToProps)(CartIcon);
