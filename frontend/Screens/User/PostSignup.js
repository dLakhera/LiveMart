import React, { useContext, useState, useRef } from "react";
import { View, Text, StyleSheet, Button, Dimensions } from "react-native";
// import { Picker } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import { Picker } from "@react-native-community/picker";
import Error from "../../Shared/Error";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import { useFocusEffect } from "@react-navigation/native";
import { MapContainer, getRegionLatLong } from "./MapContainer";
import AuthGlobal from "../../Context/store/AuthGlobal";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
const { width, height } = Dimensions.get("window");
const PostSignup = (props) => {
	const context = useContext(AuthGlobal);
	const [userProfile, setUserProfile] = useState("");
	const [phone, setPhone] = useState();
	const [password, setPassword] = useState();
	const [selectedRole, setSelectedRole] = useState();
	const [error, setError] = useState("");
	const [token, setToken] = useState("");
	const isMountedVal = useRef(1);

	useFocusEffect(
		React.useCallback(() => {
			isMountedVal.current = 1;
			if (
				context.stateUser.isAuthenticated === false ||
				context.stateUser.isAuthenticated === null
			) {
				// props.navigation.navigate("Login")
				props.navigation.reset({
					index: 0,
					routes: [{ name: "Login" }],
				});
			}
			console.log(context.stateUser);
			if (context.stateUser.userProfile && context.stateUser.userProfile.phoneNo && context.stateUser.userProfile.role && context.stateUser.userProfile.password == "true" && context.stateUser.userProfile.Address)
				// props.navigation.navigate("Home");
				props.navigation.reset({
					index: 0,
					routes: [{ name: "Home" }],
				});
			// console.log(JSON.stringify(userProfile));
			setUserProfile(context.stateUser.userProfile);
			setToken(context.stateUser.token);
			return (() => {
				isMountedVal.current = 0;
			})
		}, [context.stateUser.isAuthenticated])
	);
	function validatePhoneNumber(phoneno) {
		const re = /^[6-9]\d{9}$/;
		return re.test(String(phoneno).toLowerCase());
	}
	const handleSubmit = () => {
		var regionLatLong = getRegionLatLong();
		console.log("userProfile", userProfile);

		setError("");
		var user = {};
		console.log("phone", phone);
		if (!userProfile.phoneNo) user.phoneNo = phone;
		if (!userProfile.role) {
			user.role = selectedRole;
		}
		if (userProfile.password === "false") {
			user.password = password;
		}
		if (!userProfile.Address) {
			user.Address = {
				latitude: regionLatLong.latitude,
				longitude: regionLatLong.longitude
			}
			console.log(user, regionLatLong);
		}

		console.log("User", user);

		try {
			// console.log("token " + token);
			// console.log(user);
			axios
				.put(
					baseURL + "users",
					{
						user: user,
						Address: {
							latitude: regionLatLong.latitude,
							longitude: regionLatLong.longitude
						}
					},
					{
						headers: {
							Authorization: "Bearer " + token,
						},
					}
				)
				.then((response) => {
					if (response.status == 200)
						props.navigation.reset({
							index: 0,
							routes: [{ name: "Home" }],
						});
					// props.navigation.navigate("Home");
					else setError(response.status);
				});
		} catch (err) {
			console.log(err);
			setError(err.message);
		}

	};

	return (
		<KeyboardAwareScrollView
			viewIsInsideTabBar={true}
			extraHeight={200}
			enableOnAndroid={true}
		>
			<FormContainer title={"Post SignUp"}>
				{userProfile.password === "false" ? (
					<Input
						placeholder={"Enter Password"}
						name={"password"}
						id={"password"}
						secureTextEntry={true}
						value={password}
						onChangeText={(text) => setPassword(text)}
					/>
				) : null}

				{!userProfile.phoneNo ? (
					<Input
						placeholder={"Phone Number"}
						name={"phone"}
						id={"phone"}
						value={phone}
						keyboardType={"numeric"}
						onChangeText={(text) => setPhone(text)}
					/>
				) : null}

				{!userProfile.role ? (
					<View>
						<Picker
							selectedValue={selectedRole}
							style={{ height: 50, width: 150 }}
							onValueChange={(itemValue, itemIndex) =>
								setSelectedRole(itemValue)
							}
						>
							<Picker.Item label="Customer" value="Customer" />
							<Picker.Item label="Retailer" value="Retailer" />
							<Picker.Item label="Wholeasaler" value="Wholeasaler" />
						</Picker>
					</View>
				) : null}

				{!userProfile.Address ? (
					<View style={{ height: 0.45 * height, width: 0.9 * width }}>
						<MapContainer />
					</View>
				) : null}

				<EasyButton large primary onPress={() => handleSubmit()}>
					<Text style={{ color: "white" }}>Continue</Text>
				</EasyButton>
				<View style={styles.buttonGroup}>
					{error ? <Error message={error} /> : null}
				</View>
			</FormContainer>
		</KeyboardAwareScrollView>
	);
};

const styles = StyleSheet.create({
	buttonGroup: {
		width: "80%",
		alignItems: "center",
	},
	middleText: {
		marginBottom: 20,
		alignSelf: "center",
	},
});

export default PostSignup;
