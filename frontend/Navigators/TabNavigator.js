import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AdminNavigator from "./AdminNavigator";
import HomeNavigator from "./HomeNavigator";
import CartNavigator from "./CartNavigator";
import UserProfile from "./../Screens/User/UserProfile";
const { width, height } = Dimensions.get('window');
import CartIcon from "../Shared/CartIcon";
import AuthGlobal from "../Context/store/AuthGlobal";
import { useEffect } from "react/cjs/react.development";
import ProfileNavigator from "./ProfileNavigator";
const MyStack = (props) => {
  const context = useContext(AuthGlobal);
  const Tab = createBottomTabNavigator();
  useEffect(() => {
    if (
      context.stateUser.isAuthenticated === false ||
      context.stateUser.isAuthenticated === null
    ) {
      props.navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  }, [context.stateUser.isAuthenticated]);

  return (
    <Tab.Navigator
      initialRouteName={(context.stateUser.userProfile && context.stateUser.userProfile.role && context.stateUser.userProfile.role != "Customer") ? "Home" : "Admin"}
      tabBarOptions={{
        keyboardHidesTabBar: true,
        showLabel: false,
        // activeTintColor: "#e91e63",
        activeBackgroundColor: "#E2E2E2",
        inactiveBackgroundColor: "#D5D5D5",
      }}
    >
      {context.stateUser.userProfile && context.stateUser.userProfile.role && context.stateUser.userProfile.role != "Wholeasaler" ? (
        <>
          <Tab.Screen
            name="Home"
            component={HomeNavigator}
            options={{
              tabBarIcon: ({ color }) => (
                <Image style={styles.icon} source={require("../assets/HomeIcon.png")} />
              ),
            }}
          />
          <Tab.Screen
            name="Cart"
            component={CartNavigator}
            options={{
              tabBarIcon: ({ color }) => (
                <View>
                  <Image style={styles.icon} source={require("../assets/CartIcon.png")} />
                  <CartIcon />

                </View>
              ),
            }}
          />
        </>
      ) : null}
      {context.stateUser.userProfile && context.stateUser.userProfile.role && context.stateUser.userProfile.role != "Customer" ? (
        <Tab.Screen
          name="Admin"
          component={AdminNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <Image style={styles.icon} source={require("../assets/seller.png")} />
            ),
          }}
        />
      ) : null}
      <Tab.Screen
        name="User Profile"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Image style={styles.icon} source={require("../assets/UserIcon.png")} />
          ),
        }}
      />

    </Tab.Navigator>
  );
}
export default function TabNavigator(props) {
  return <MyStack navigation={props.navigation} />;
}

const styles = StyleSheet.create({
  icon: {
    height: height * 0.05,
    // aspectRatio: 1,
    resizeMode: 'contain',
  }
})