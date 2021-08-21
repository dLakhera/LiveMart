import React, { useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Text, Left, Right, ListItem, Thumbnail, Body, Card, CardItem } from "native-base";
var { height, width } = Dimensions.get("window");

const CartItem = (props) => {
	const data = props.item.item
	return (
		<ListItem style={styles.listItem} key={data._id} avatar>
			<Left>
			</Left>
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
					<CardItem>
						<Left>
							<Text>Sellers: </Text>
						</Left>
					</CardItem>
					{data.Sellers.map((x) => {
						return (
							<>

								<CardItem>
									<Left>
										<Text>{x.Name}</Text>
									</Left>

									<Right>
										<Text> ₹ {x.Price} X {x.Quantity_to_buy} </Text>
									</Right>
								</CardItem>
							</>
						)
					})}


				</Card>
			</Body>
		</ListItem>
	);
};

const styles = StyleSheet.create({
	listItem: {
		alignItems: 'center',
		backgroundColor: 'white',
		justifyContent: 'center',
		marginBottom:5
	},
	card: {
		width: 0.8 * width
	},
	body: {
		width: width,
		alignItems: 'center',
		flexDirection: 'row'
	}
})

export default CartItem;
