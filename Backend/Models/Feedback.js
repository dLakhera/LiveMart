var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Feedback = new Schema({
    AddressedToID: mongoose.Schema.ObjectId,
    AddressedFromID: mongoose.Schema.ObjectId,
    AddressedFromName: String,
    ItemID: {
        type: mongoose.Schema.ObjectId,
        ref: "Items",
        required: true,
    },
    Query: {
        type: String,
        required: true
    },
    Reply: String,
    Replied: {
        type: Boolean,
        default: false
    }
}, {
    timestamp: true
});

module.exports = mongoose.model('Feedback', Feedback);