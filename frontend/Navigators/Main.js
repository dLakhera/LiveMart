import React from "react";
// Stacks
import { createStackNavigator } from '@react-navigation/stack'
import TabNavigator from "./TabNavigator";
// import AdminNavigator from "./AdminNavigator";

import Login from '../Screens/User/Login'
import Register from '../Screens/User/Register'
import UserProfile from '../Screens/User/UserProfile'
import OtpScreen from "../Screens/User/Otp"
import PostSignup from '../Screens/User/PostSignup';

const Stack = createStackNavigator();

const Main = () => {

  return (
    <Stack.Navigator>
      
       <Stack.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login
        }
        options={{
          headerShown: false
        }}
      />
     <Stack.Screen
        name="OtpScreen"
        component={OtpScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="PostSignUp"
        component={PostSignup}
        options={{
          headerShown: false
        }}
      />
      
      <Stack.Screen
        name="Home"
        component={TabNavigator}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};

export default Main;
