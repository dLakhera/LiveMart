import { StatusBar } from "expo-status-bar";
import { registerRootComponent } from 'expo';

import React from "react";
import { LogBox, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";

// Redux
import { Provider } from "react-redux";
import store from "./Redux/store";

// Context API
import Auth from "./Context/store/Auth";

// Navigatiors
import Main from "./Navigators/Main";

// Screens
import Header from "./Shared/Header";
// import setupNotif from './Push'
LogBox.ignoreAllLogs(true);

export default function App() {

  // setupNotif();
  return (
    <Auth>
      <Provider store={store}>
        <NavigationContainer>
          <Header />
          <Main />
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </NavigationContainer>
      </Provider>
    </Auth>
  );
}

registerRootComponent(App);
