import React, { useEffect, useReducer, userEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-community/async-storage";

import authReducer from "../reducers/Auth.reducer";
import { setCurrentUser } from "../actions/Auth.actions";
import AuthGlobal from "./AuthGlobal";

const Auth = (props) => {
  const [stateUser, dispatch] = useReducer(authReducer, {
    isAuthenticated: null,
    userProfile: {},
    token: null,
  });
  const [showChild, setShowChild] = useState(false);

  useEffect(() => {
    setShowChild(true);
    if (AsyncStorage.jwt) {
      if (setShowChild) {
        getUserProfile(AsyncStorage.jwt);
      }
    }
    return () => setShowChild(false);
  }, []);

  if (!showChild) {
    return null;
  } else {
    return (
      <AuthGlobal.Provider
        value={{
          stateUser,
          dispatch,
        }}
      >
        {props.children}
      </AuthGlobal.Provider>
    );
  }
};

export default Auth;
