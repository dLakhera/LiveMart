import React from 'react'
import {
    StyleSheet,
    View,
    Dimensions,
    Image,
    Text,
    Button
} from 'react-native'
import Toast from 'react-native-toast-message'
import EasyButton from "../../Shared/StyledComponents/EasyButton"
import { connect } from 'react-redux'
import * as actions from '../../Redux/Actions/cartActions';
import axios from 'axios'
import baseURL from '../../assets/common/baseUrl'

var { width } = Dimensions.get("window");

const ProductCard = (props) => {
    // console.log(props);

    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                resizeMode="contain"
                source={{
                    uri: props.image ?
                        props.image : 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png'
                }}
            />
            <View style={styles.card} />
            <Text style={styles.title}>
                {props.Name.length > 15 ? props.Name.substring(0, 15 - 3)
                    + '...' : props.Name
                }
            </Text>
            <Text style={styles.price}>₹ {props.price}</Text>

        {/*     { props.TotalQuantity > 0 ? (
                <View style={{ marginBottom: 60 }}>
                    <EasyButton
                        primary
                        medium
                        onPress={() => {
                            var item= props
                            axios.post(baseURL + 'cart',
                                {
                                    Item: item.id,
                                    seller: { Quantity_to_buy: 1, seller: x._id, price: x.Price, Name: x.SellerName }
                                }, {
                                headers: {
                                    authorization: `Bearer ` + context.stateUser.token,
                                },
                            }).then(() => {
                                axios.get(baseURL + 'cart',
                                    {
                                        headers: {
                                            authorization: `Bearer ` + context.stateUser.token,
                                        }
                                    }).then(res => {
                                        console.log(res.data)
                                        props.addItemToCart(res.data);
                                        Toast.show({
                                            topOffset: 60,
                                            type: "success",
                                            text1: `${item.Name} added to Cart`,
                                            text2: "Go to your cart to complete order"
                                        })
                                    }).catch((error) => alert(error));
                            })

                        }}
                    >
                        <Text style={{ color: "white" }}>Add</Text>
                    </EasyButton>
                </View>
            ) : <Text style={{ marginTop: 20 }}>Currently Unavailable</Text>} */}
        </View>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        addItemToCart: (cart) =>
            dispatch(actions.updateCart(cart))
    }
}
const styles = StyleSheet.create({
    container: {
        width: width / 2 - 20,
        height: width / 1.7,
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 5,
        marginLeft: 10,
        alignItems: 'center',
        elevation: 8,
        backgroundColor: 'white'
    },
    image: {
        width: width / 2 - 20 - 10,
        height: width / 2 - 20 - 30,
        backgroundColor: 'transparent',
        position: 'absolute',
    },
    card: {
        height: width / 2 - 20 - 90,
        backgroundColor: 'transparent',
        width: width / 2 - 20 - 10
    },
    title: {
        fontWeight: "bold",
        fontSize: 14,
        textAlign: 'center',
        top:50
    },
    price: {
        fontSize: 30,
        color: 'orange',
        top:60
    }
})

export default connect(null, mapDispatchToProps)(ProductCard);