import React, { useEffect, useState, useContext } from 'react'
import { Text, View, Button, Dimensions } from 'react-native'
import { Item, Picker, Toast } from 'native-base'
import FormContainer from '../../../Shared/Form/FormContainer'
import Input from '../../../Shared/Form/Input'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AuthGlobal from "../../../Context/store/AuthGlobal"
import Geocoder from 'react-native-geocoding'
// import Geolocation from 'react-native-community/geolocation'
import getLocation from '../../../Shared/getLocation'
import { connect } from 'react-redux'

var { width } = Dimensions.get('window');

const Checkout = (props) => {
    const context = useContext(AuthGlobal)

    const [flatno, setFlatAdd] = useState("");
    const [orderItems, setOrderItems] = useState();
    const [address, setAddress] = useState("");
    const [address2, setAddress2] = useState("");
    const [zip, setZip] = useState("");
    const [phone, setPhone] = useState("");
    const [user, setUser] = useState();
    useEffect(() => {
        setOrderItems(props.cartItems)
        if (context.stateUser.isAuthenticated) {
            setUser(context.stateUser.userProfile._id)
        } else {
            props.navigation.navigate("Cart")
            Toast.show({
                topOffset: 60,
                type: "error",
                text1: "Please Login to Checkout",
                text2: ""
            });
        }

        let lat, long;
        getLocation().then(data => {
            lat = data.latitude
            long = data.longitude
            let Address1 = "", Address2 = "";
            Geocoder.init("AIzaSyCSJg197HNnhk43JQCdkan-AXbtojffOnU");
            console.log("Requesting......");
            Geocoder.from(lat, long)
                .then(json => {
                    json.results[0].address_components.forEach((value, index) => {
                        if (value && value != undefined && value != 'undefined') {
                            if (index < 3)
                                Address1 += value.long_name + (index != 2 ? ", " : "");
                            else if(index<9)
                                Address2 += ", " + value.long_name;
                        }
                        // setAddress(json.results[0].formatted_address);
                    })
                    setZip(json.results[0].address_components[9].long_name)
                    setAddress(Address1);
                    setAddress2(Address2);
                }).catch((err) => {
                    console.log(err);
                });
        });


        return () => {
            setOrderItems();
        }
    }, [])

    const checkOut = () => {
        let order = {
            dateOrdered: Date.now(),
            orderItems,
            phone,
            address: flatno + ", " + address + " " + address2 + " " + zip,
            status: "3",
            user,
        }
        props.navigation.navigate("OrderMode", { order: order })
    }

    // const getAddress = () => {
    //     axios.get("http://ip-api.com/json")
    //         .then(json => {
    //             console.log(json);
    //         }).catch(err => {
    //             console.log(err);
    //         })
    // }

    return (
        <>
            <KeyboardAwareScrollView
                viewIsInsideTabBar={true}
                extraHeight={200}
                enableOnAndroid={true}
            >
                <FormContainer title={"Shipping Address"}>
                    <Input
                        placeholder={"Phone"}
                        name={"phone"}
                        value={phone}
                        keyboardType={"numeric"}
                        onChangeText={(text) => setPhone(text)}
                    />
                    <Input
                        placeholder={"Flat number/Room number"}
                        name={"FlatNumber"}
                        value={flatno}
                        onChangeText={(text) => setFlatAdd(text)}
                    />
                    <Input
                        placeholder={"Shipping Address 1"}
                        name={"ShippingAddress1"}
                        value={address}
                        onChangeText={(text) => setAddress(text)}
                    />
                    <Input
                        placeholder={"Shipping Address 2"}
                        name={"ShippingAddress2"}
                        value={address2}
                        onChangeText={(text) => setAddress2(text)}
                    />
                    <Input
                        placeholder={"Zip Code"}
                        name={"zip"}
                        value={zip}
                        keyboardType={"numeric"}
                        onChangeText={(text) => setZip(text)}
                    />
                    <View style={{ width: '80%', marginTop: 10, alignItems: "center" }}>
                        <Button title="Confirm" onPress={() => checkOut()} />
                    </View>
                </FormContainer>
            </KeyboardAwareScrollView>
        </>
    )
}

const mapStateToProps = (state) => {
    const { cartItems } = state;
    return {
        cartItems: cartItems,
    }
}

export default connect(mapStateToProps)(Checkout)