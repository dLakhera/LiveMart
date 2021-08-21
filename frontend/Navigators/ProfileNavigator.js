

import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"
import ProductContainer from "../Screens/Products/ProductContainer";
import SingleProduct from "../Screens/Products/SingleProduct"
import UserProfile from '../Screens/User/UserProfile';
import FeedbackProduct from '../Screens/User/Feedback.js'
import FeedbackAPP from './../Screens/User/FeedbackAPP'
import FeedbackAll from './../Screens/User/FeedbackAll'
const Stack = createStackNavigator()

function MyStack() {
    return (

        <Stack.Navigator>

            <Stack.Screen
                name="User Profile"
                component={UserProfile}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Image source={require("../assets/UserIcon.png")} />
                    ),
                }}
            />
            <Stack.Screen
                name='Product Feedback'
                component={FeedbackProduct}
                options={{
                    title: 'Feedback'
                }}
            />
            <Stack.Screen
                name='FeedbackApp'
                component={FeedbackAPP}
                options={{
                    title: 'Feedback'
                }}
            />
            <Stack.Screen
                name='FeedbackAll'
                component={FeedbackAll}
                options={{
                    title: 'Feedback'
                }}
            />
        </Stack.Navigator>
    )
}

export default function ProfileNavigator() {
    return <MyStack />;
}