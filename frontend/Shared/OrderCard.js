import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Alert } from "react-native";
import { Picker, Text, Left, Right, ListItem, Thumbnail, Body, Card, CardItem } from "native-base";


import TrafficLight from "./StyledComponents/TrafficLight";
import EasyButton from "./StyledComponents/EasyButton";
import Toast from "react-native-toast-message";

import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import baseURL from "../assets/common/baseUrl";
import CartItem from "./../Screens/Cart/CartItem"
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Input from "./Form/Input";
var { width } = Dimensions.get('window');
const codes = [
	{ name: "pending", code: "0" },
	{ name: "shipped", code: "1" },
	{ name: "delivered", code: "2" },
];

const OrderCard = (props) => {
	const [orderStatus, setOrderStatus] = useState();
	const [statusText, setStatusText] = useState();
	const [statusChange, setStatusChange] = useState(props.Order.statusCode);
	const [token, setToken] = useState();
	const [items, setItems] = useState(props.Order.Items)
	const [Name, setName] = useState()
	const [Phone, setPhone] = useState()

	useEffect(() => {
		AsyncStorage.getItem("jwt")
			.then((res) => {
				setToken(res);
			})
			.catch((error) => console.log(error));

		if (props.Order.statusCode == "0") {
			setOrderStatus(<TrafficLight unavailable></TrafficLight>);
			setStatusText("pending");
		} else if (props.Order.statusCode == "1") {
			setOrderStatus(<TrafficLight limited></TrafficLight>);
			setStatusText("shipped");
		} else {
			setOrderStatus(<TrafficLight available></TrafficLight>);
			setStatusText("delivered");
		}

		return () => {
			console.log("Order:", props.Order)
			setOrderStatus();
			setStatusText();
		};
	}, []);

	const CancelOrder = () => {
		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		axios.delete(baseURL + "orders/" + props.Order._id, config);
	}
	const updateOrder = () => {
		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		const orderUpdate = {
			orderID: props.Order._id,
			statusCode: statusChange,

		};
		if (Name) {
			orderUpdate.deliveredBy = Name
			orderUpdate.deliveredByNo = Phone
		}
		axios
			.put(`${baseURL}orders/`, orderUpdate, config)
			.then((res) => {
				if (res.status == 200 || res.status == 201) {
					Toast.show({
						topOffset: 60,
						type: "success",
						text1: "Order Edited",
						text2: "",
					});
					if (Name)
						props.Order.deliveredBy = Name;
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
	};

	return (
		<View style={styles.container}>
			<View>
				<Text>Order Number: #{props.Order._id}</Text>
			</View>
			<View style={{ marginTop: 10 }}>
				<Text>
					Status: {statusText}  {orderStatus}
				</Text>
				{props.Order ? (
					<View /* style={{ borderWidth: 1, borderColor: "orange" }} */>
						<Text style={styles.title}>Shipping to:</Text>
						<View style={{ padding: 8 }}>
							<Text>Address: {props.Order.Address}</Text>
							<Text>Order Mode: {props.Order.orderType}</Text>
						</View>
						<CardItem>
							{!props.editMode ?
								<Text>Seller: {props.Order.SellerName}</Text>
								: <Text>Customer: {props.Order.CustomerName}</Text>
							}
						</CardItem>
						{props.Order.deliveredBy ?
							(
								<>
									<CardItem>
										<Text>Delivery Guy: {props.Order.deliveredBy}</Text>
									</CardItem>
									<CardItem>
										<Text>Contact: {props.Order.deliveryNo}</Text>
									</CardItem>
								</>
							)

							: null}


						<Text style={styles.title}>Items:</Text>
						{items.map((data) => {
							return (
								<>
									{data ? (
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
														<Text style={{ fontWeight: "bold" }}>  {data.Item.Name}</Text>
													</CardItem>

													<CardItem>
														<Left>
															<Text>₹ {data.Price} X {data.QuantityBought}</Text>
														</Left>
														<Text>₹ {data.Price * data.QuantityBought}</Text>
														<Right>
															<EasyButton small onPress={() => props.navigation.navigate("Product Feedback", { item: data._id, Seller: props.Order.Seller })}>
																<MaterialIcons name="feedback" size={24} color="black" />
															</EasyButton>
														</Right>
													</CardItem>

												</Card>
											</Body>
										</ListItem>
									) : null}
								</>
							);
						})}
					</View>
				) : null}
				<Text>Date Ordered: {props.Order.createdAt.split("T")[0]}</Text>

				<View style={styles.priceContainer}>
					{(!props.editMode && (props.Order.orderType == "offline" || (props.Order.orderType == "online" && props.Order.statusCode == 0))) ? (
						<EasyButton large danger onPress={() => {
							Alert.alert(
								"Cancel Order",
								"Are you sure you want to cancel?",
								[
									{
										text: "No",
										onPress: () => console.log("Cancel Pressed"),
										style: "cancel"
									},
									{ text: "Yes", onPress: () => CancelOrder() }
								]
							);
						}}>
							<Text>Cancel Order</Text>
						</EasyButton>
					) : null}
					<Text>Price: </Text>
					<Text style={styles.Price}>₹ {props.Order.TotalPrice}</Text>
				</View>
				{props.editMode ?
					(
						<>
							{
								props.Order.orderType == "online" ? (
									<View>

										<Picker
											mode="dropdown"
											iosIcon={<Ionicons color={"#007aff"} name="ios-arrow-down" />}
											selectedValue={statusChange}
											placeholder="Change Status"
											placeholderIconColor={{ color: "#007aff" }}
											onValueChange={(e) => { setStatusChange(e) }}
										>
											{codes.map((c) => {
												return (
													<Picker.Item key={c.code} label={c.name} value={c.code} />
												);
											})}
										</Picker>
										{!props.Order.deliveredBy ? (<>
											<Input
												placeholder={"Enter Delivery Guy Name"}
												name={"Name"}
												id={"name"}
												value={Name}
												onChangeText={(text) => setName(text)}
											/>
											<Input
												placeholder={"Phone Number"}
												name={"phone"}
												id={"phone"}
												keyboardType={"numeric"}
												onChangeText={(text) => setPhone(text)}
											/>
										</>) : null}
										<EasyButton secondary large onPress={() => updateOrder()}>
											<Text style={{ color: "white" }}>Update</Text>
										</EasyButton>
									</View>

								) : (<>
									<Text>Comming On {props.Order.pickUpDate}</Text>
								</>)
							}
						</>
					) : null
				}
			</View>
		</View >
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 30,
		width: 0.9 * width,
		borderRadius: 20,
		borderWidth: 1,
		borderColor:"orange"
	},
	title: {
		backgroundColor: "#62B1F6",
		padding: 5,
	},
	priceContainer: {
		marginTop: 10,
		alignSelf: "flex-end",
		flexDirection: "row",
	},
	price: {
		color: "white",
		fontWeight: "bold",
	},
});

export default OrderCard;
