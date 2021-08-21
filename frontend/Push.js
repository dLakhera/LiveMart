import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
// import {Notifications} from 'expo'
import {Platform } from 'react-native';
import baseURL from './assets/common/baseUrl';
import axios from 'axios';
import { useRef } from 'react/cjs/react.development';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});


export default setupNotif = (authToken) => {
    // const notificationListener = useRef();
    // const responseListener = useRef();
    registerForPushNotificationsAsync().then(token => {
        axios.post(`${baseURL}users/notifToken`, { token: token }, { headers: { authorization: "Bearer " + authToken } }).then(res => {
            console.log(res);
        })
    }).catch(err => {
        console.log(err);
    });
/* 
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          console.log(notification);
      });
  
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response);
      }); */
    //   schedulePushNotification
}
/* 
async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Order Update",
            body: 'Your Order has been Delivered',
        },
        trigger: { seconds: 2 },
    });
} */

async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}