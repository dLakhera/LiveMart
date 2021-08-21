

const config = require("../config");
var messagebird = require("messagebird")(config.messagebird_API_KEY);
var nodemailer = require("nodemailer");
var mongoose = require("mongoose");
var User = require('../Models/User');
module.exports.ping = (userID, message) => {

    User.findById(userID).then(user => {
        this.sendMail(user.email, message);
        this.sendSMS(user.phoneNo, message);
    })
}
module.exports.sendMail = (email, message) => {
    const transporter = nodemailer.createTransport({
        port: 465, // true for 465, false for other ports
        host: "smtp.gmail.com",
        auth: {
            user: config.GMAIL.email,
            pass: config.GMAIL.password,
        },
        secure: true,
    });
    const mailData = {
        from: config.GMAIL.email, // sender address
        to: email, // list of receivers
        subject: "LiveMart",
        text: message
    };
    transporter.sendMail(mailData, function (err, info) {
        if (err) console.log(err);
        else console.log(info);
    });
};
module.exports.sendSMS = (PhoneNo, message) => {
    var params = {
        originator: "LIVEMART",
        recipients: [PhoneNo],
        body: message
    };

    messagebird.messages.create(params, function (err, info) {
        if (err) console.log(err);
        else console.log(info);
    });
}
