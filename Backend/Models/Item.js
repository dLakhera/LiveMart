var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Items = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    Seller: {
      type: Number, //0 for Retailer, 1 for WholeSaler
      required: true,
    },
    TotalQuantity: {
      type: Number,
      default: 0,
    },
    Category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: String,
    brand: String,
    NextAvailDate: Date,
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 1,
    },
    image: {
      type: String,
      default: "",
    },
    price: Number,
    images: [
      {
        type: String,
      },
    ],
    Sellers: [
      {
        Price: Number,
        Quantity: Number,
        SellerName: String,
        Address: {
          longitude: Number,
          latitude: Number
        },
        Seller: {
          type: mongoose.Schema.ObjectId
        },
      },
    ],
  },
  {
    timestamp: true,
  }
);

Items.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  const { _id: id, ...result } = object;
  return { ...result, id };
});

module.exports = mongoose.model("Items", Items);
