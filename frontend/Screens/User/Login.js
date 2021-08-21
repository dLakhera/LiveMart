import React, { useEffect, useContext, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Button,
	TouchableOpacity,
	Image,
	Linking,
} from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import Toast from "react-native-toast-message";

// Context
// import AuthGlobal from "../../Context/store/AuthGlobal";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";

const Login = (props) => {
	// const context = useContext(AuthGlobal);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	/*console.log("CHECKING CONTEXT", context);
	 useEffect(() => {
		if (context.stateUser.isAuthenticated === true) {
			props.navigation.navigate("Home");
		}
	}, [context.stateUser.isAuthenticated]);
 */
	const handleSubmit = () => {
		const user = {
			email,
			password,
		};

		if (email === "" || password === "") {
			setError("Please fill in your credentials");
		} else {
			console.log(baseURL);
			axios({
				method: "POST",
				url: baseURL + "users/signin",
				data: { user: user },
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Headers": "*",
				},
			})
				.then((res) => {
					const token = res.data.token;
					if (res.status == 200) {
						// console.log(res);
						Toast.show({
							topOffset: 60,
							type: "success",
							text1: "Login Succeeded",
							text2: "Enter OTP",
						});
						askForOtp(token);
						setTimeout(() => {
							props.navigation.navigate("OtpScreen", {
								token: token,
							});
						}, 500);
					}
				})
				.catch((error) => {
					console.log(error);
					Toast.show({
						topOffset: 60,
						type: "error",
						text1: "Incorrect Credentials",
						text2: "Try Again",
					});
				});
		}
	};
	const askForOtp = (token) => {
		console.log("Requesting OTP");

		axios.get(baseURL + "otp/send", {
			headers: {
				authorization: "Bearer " + token,
			},
		});
	};
	function extractUrlValue(key, url) {
		if (typeof url === "undefined") url = window.location.href;
		var match = url.match("[?&]" + key + "=([^&]+)");
		return match ? match[1] : null;
	}
	const handleOpenURL = ({ url }) => {
		// console.log("URL: " + url);
		var token = extractUrlValue("token", url);
		token = token.split("#")[0];
		// console.log("token: " + token);
		askForOtp(token);

		props.navigation.navigate("OtpScreen", {
			token: token,
		});
		Linking.removeEventListener("url", handleOpenURL);
	};
	return (
		<FormContainer title={"Login"}>
			<Input
				placeholder={"Enter Email"}
				name={"email"}
				id={"email"}
				value={email}
				onChangeText={(text) => setEmail(text.toLowerCase())}
			/>
			<Input
				placeholder={"Enter Password"}
				name={"password"}
				id={"password"}
				secureTextEntry={true}
				value={password}
				onChangeText={(text) => setPassword(text)}
			/>
			<View style={styles.buttonGroup}>
				{error ? <Error message={error} /> : null}
				<EasyButton large primary onPress={() => handleSubmit()}>
					<Text style={{ color: "white" }}>Login</Text>
				</EasyButton>
			</View>
			<View>
				<TouchableOpacity
					style={{ margin: 5 }}
					onPress={() => {
						Linking.openURL(baseURL + "users/auth/google");
						Linking.addEventListener("url", handleOpenURL);
					}}
				>
					<Image
						source={require("./../../assets/GAuthButton.png")}
						style={{ width: 200, height: 50 }}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={{ margin: 5 }}
					onPress={() => {
						Linking.openURL(baseURL + "users/auth/facebook");
						Linking.addEventListener("url", handleOpenURL);
					}}
				>
					<Image
						source={require("./../../assets/loginFB.png")}
						style={{ width: 200, height: 50 }}
					/>
				</TouchableOpacity>
			</View>
			<View style={[{ marginTop: 40 }, styles.buttonGroup]}>
				<Text style={styles.middleText}>Don't have an account yet?</Text>
				<EasyButton
					large
					secondary
					onPress={() => props.navigation.navigate("Register")}
				>
					<Text style={{ color: "white" }}>Register</Text>
				</EasyButton>
			</View>
		</FormContainer>
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

export default Login;
