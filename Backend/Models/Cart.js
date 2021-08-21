var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Cart = new Schema({
    CustomerID: mongoose.Types.ObjectId,
    TotalPrice: Number,
    Items: [{
        Item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Items",
            required: true,
        },  
        Sellers: [{
            Seller: mongoose.Types.ObjectId,
            Name:String,
            Price:Number,
            Quantity_to_buy: Number
        }]
    }]
}, {
    timestamp: true
});

module.exports = mongoose.model('Cart', Cart);