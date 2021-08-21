var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// var Order = require('./Order').schema;
var CustomerOrder = new Schema({
    Customer: mongoose.Schema.ObjectId,
    Order: {
        TotalPrice: Number,
        Items: [{
            Item: mongoose.Schema.ObjectId,
            Sellers: [{
                Seller: mongoose.Schema.ObjectId,
                Quantity_to_buy: Number,
                Price: Number,
                Name: String,
            }]
        }],
        statusCode: {
            type: Number,
            default: 0
        },
        orderType: String,
        Address: {
            type: String,
            required: true
        },
        ExpectedDelivery: Date,
        phone: String
    }
},
    {
        timestamps: true
    });


module.exports = mongoose.model("CustomerOrder", CustomerOrder);
