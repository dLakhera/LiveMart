var express = require("express");
var router = express.Router();
var OTP = require("../Models/otp");

var authenticate = require("../Controller/authenticate");
var cors = require("./cors");
const config = require("../config");
var mongoose = require("mongoose");
var pingUser = require("../Controller/pingUser");
router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);

router.options("*", cors.corsWithOptions, (req, res) => {
  res.sendStatus(200);
});

function sendOtp(PhoneNo, email, otp) {
  pingUser.sendMail(email, "OTP FOR YOUR LOGIN IS: " + otp);
  // pingUser.sendSMS(PhoneNo, "OTP FOR YOUR LOGIN IS: " + otp);
}

router.get(
  "/send",
  cors.corsWithOptions,
  authenticate.verifyUserWithoutOtp,
  (req, res) => {
    OTP.remove({ user: mongoose.Schema.Types.ObjectId(req.user._id) });
    var otp = (Math.floor(Math.random() * 10000) + 10000)
      .toString()
      .substring(1);
    const otpvar = new OTP({
      user: req.user._id,
      otp: otp,
    });
    otpvar.save().then((otpvar) => {
      sendOtp(req.user.phoneNo, req.user.email, otp);
    });
  }
);
router.post(
  "/verify",
  cors.corsWithOptions,
  authenticate.verifyUserWithoutOtp,
  (req, res) => {
    try {
      OTP.find({ user: mongoose.Types.ObjectId(req.user._id) })
        .sort({ sessionActivity: "-1" })
        .then((otpvar) => {
          console.log("OTP", otpvar[0]);
          if (!otpvar) {
            console.log("NO OTP FOUND");
            return res.status(422).send({ error: "OTP Expired" });
          }
          // console.log("REQBODY", req.body);
          if (req.body.otp == otpvar[0].otp) {
            res.status(200);
            OTP.remove({ user: mongoose.Types.ObjectId(req.user._id) });
            var token = authenticate.getOTPToken({ _id: req.user._id });
            var user = req.user;
            if (user.password) {
              delete user.password;
              user.password = true;
            } else {
              user.password = false;
            }
            return res.send({ token: token, user: user });
            res.setHeader("Content-Type", "application/json");
            res.json({ success: true, status: "Valid OTP", token: token });
          } else {
            res.status(401);
            res.setHeader("Content-Type", "application/json");
            res.json({ success: false, status: "OTP INVALID" });
          }
        });
    } catch (err) {
      console.log("error " + JSON.stringify(err));
      return res.status(422).send({ error: "err" });
    }
  }
);
module.exports = router;
