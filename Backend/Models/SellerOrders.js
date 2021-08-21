var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var SellerOrder = new Schema({
    Seller: mongoose.Schema.ObjectId,
    Customer: mongoose.Schema.ObjectId,
    orderType:String,
    SellerName:String,
    CustomerName:String,
    Address: {
        type:String,
        required:true
    },
    phoneNo:String,
    TotalPrice:Number,
    statusCode:{
        type:Number,
        default:0
    },
    deliveredBy: String,
    deliveryNo :String,
    pickUpDate:{
        type:Date,
        default: Date.now()
    },
    Items: [{
        Price:Number,
        Item: mongoose.Schema.ObjectId,
        QuantityBought: Number
    }],
},{
    timestamps:true
});


module.exports = mongoose.model("SellerOrder", SellerOrder);
