import {
    UPDATE_CART,
    CLEAR_CART

} from '../constants';

const cartItems = (state = [], action) => {
    switch (action.type) {
        case UPDATE_CART:
            return action.payload
        case CLEAR_CART:
            return state = []
    }
    return state;


}

export default cartItems;