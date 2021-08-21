import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

import Orders from "../Screens/Admin/Order"
import Products from "../Screens/Admin/Products"
import ProductForm from "../Screens/Admin/ProductForm"
import Categories from "../Screens/Admin/Categories"
import Feedback from '../Screens/Admin/Feedback'
import SingleProduct from '../Screens/Products/SingleProduct.js'
const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Products"
                component={Products}
                options={{
                    title: "Products"
                }}
            />
            <Stack.Screen name="Categories" component={Categories} />
            <Stack.Screen name="Orders" component={Orders} />
            <Stack.Screen name="ProductForm" component={ProductForm} />
            <Stack.Screen name="Product Detail" component={SingleProduct} />
            <Stack.Screen name="Feedback" component={Feedback} />
        </Stack.Navigator>
    )
}
export default function AdminNavigator() {
    return <MyStack />
}