import jwt_decode from "jwt-decode"
import AsyncStorage from "@react-native-community/async-storage"
import Toast from "react-native-toast-message"
import baseURL from "../../assets/common/baseUrl"

export const SET_CURRENT_USER = "SET_CURRENT_USER";


export const getUserProfile = (toke, func) => {
    fetch(`${baseURL}users/profile`, {
        method: "GET",
        headers: {
            authorization: 'bearer ' + token
        },
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
    })
        .then((res) => res.json())
        .then((data) => {
            dispatch(setCurrentUser(data.token, data.user));
            func(data.user);
        });
}

export const logoutUser = (dispatch) => {
    AsyncStorage.removeItem("jwt");
    dispatch(setCurrentUser({}))
}

export const setCurrentUser = (token, userProfile) => {
    return {
        type: SET_CURRENT_USER,
        payload: token,
        userProfile: userProfile
    }
}