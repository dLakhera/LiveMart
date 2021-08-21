var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Notification = new Schema({
    Heading: String,
    Content: String,
    ImageUrl: String
}, {
    timestamp: true
});

module.exports = mongoose.model('Notification', Notification);