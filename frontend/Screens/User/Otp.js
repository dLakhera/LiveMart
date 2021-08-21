import React, { useContext, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import axios from "axios";
import * as actions from '../../Redux/Actions/cartActions';
import { connect } from 'react-redux';
import baseURL from "../../assets/common/baseUrl";
import AsyncStorage from "@react-native-community/async-storage";

import sendNotif from '../../Push'

import AuthGlobal from "../../Context/store/AuthGlobal";
import { setCurrentUser } from "../../Context/actions/Auth.actions";

const OtpScreen = (props) => {
  const context = useContext(AuthGlobal);
  const { route } = props;
  const token = route.params.token;
  const [otp, setOTP] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    // console.log("Sending OTP: " + otp);
    axios
      .post(
        baseURL + "otp/verify",
        {
          otp: otp,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        // console.log(JSON.stringify(res));

        switch (res.status) {
          case 401: {
            setError("INVALID OTP");
            break;
          }
          case 200: {
            // console.log("Response: " + res.data);
            AsyncStorage.setItem("jwt", res.data.token);
            context.dispatch(setCurrentUser(res.data.token, res.data.user));
            // console.log(context.stateUser);
            setupNotif(res.data.token)
            axios.get(baseURL + 'cart',
              {
                headers: {
                  authorization: `Bearer ` + res.data.token,
                }
              }).then(res => {
                // console.log(res.data)
                // dispatch(actions.updateCart(res.data));
                props.getCart(res.data)
                props.navigation.navigate("PostSignUp");
              }).catch((error) => alert(error));

            break;
          }
          default:
            setError("ERROR");
        }
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);

        console.log(err);
      });
  };
  const handleResend = () => {
    console.log("RESEND OTP");
    axios.get(baseURL + "otp/send", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  };

  return (
    <FormContainer title={"OTP Verification"}>
      <Input
        placeholder={"Enter OTP"}
        secureTextEntry={true}
        name={"otp"}
        id={"otp"}
        keyboardType={"numeric"} // This prop help to open numeric keyboard
        onChangeText={(text) => setOTP(text)}
      />
      <View style={styles.buttonGroup}>
        <EasyButton style={{ innerHeight: 5 }} onPress={() => handleResend()}>
          <Text style={{ color: "black" }}>Resend OTP</Text>
        </EasyButton>
      </View>
      <View style={styles.buttonGroup}>
        {error ? <Error message={error} /> : null}
        <EasyButton large primary onPress={() => handleSubmit()}>
          <Text style={{ color: "black" }}>Verify OTP</Text>
        </EasyButton>
      </View>
    </FormContainer>
  );
};

const mapToDispatchToProps = (dispatch) => {
  return {
    getCart: (cart) => {
      dispatch(actions.updateCart(cart));
    }
  }
}

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

export default connect(null, mapToDispatchToProps)(OtpScreen);
