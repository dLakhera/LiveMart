var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var otpschema = new Schema({
    otp: String,
    user: Schema.Types.ObjectId,
    sessionActivity: { type: Date, expires: '600s', default: Date.now }, // Expire after 15 s
});
module.exports = mongoose.model('otpschema', otpschema);
