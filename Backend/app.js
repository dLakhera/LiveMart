var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("passport");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var feedbackRouter = require("./routes/feedback");
const OTP = require("./routes/otp");
var itemRouter = require("./routes/Item");
var categoryRouter = require("./routes/Category");
var orderRouter = require("./routes/orders");
var cartRouter = require("./routes/Cart")
var reviewRouter = require("./routes/Reviews")
var config = require("./config");

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("connected to mongo yeahh");
});

mongoose.connection.on("error", (err) => {
  console.log("this is error", err);
});
var app = express();
// Secure traffic only
/* app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
}); */
/* app.all('*',(req,res,next)=>{
  console.log(req);
  return next();
}) */
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/otp", OTP);
app.use("/products", itemRouter);
app.use("/categories", categoryRouter);
app.use("/orders", orderRouter);
app.use("/cart", cartRouter);
app.use("/feedback", feedbackRouter);
app.use("/reviews", reviewRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
