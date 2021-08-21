var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Review = new Schema({
    Item: mongoose.Schema.ObjectId,
    user: mongoose.Schema.ObjectId,
    userName: String,
    Rating: Number,
    review: String
});
module.exports = mongoose.model('Review', Review);
