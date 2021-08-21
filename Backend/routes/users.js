var express = require("express");
var router = express.Router();
var User = require("../Models/User");

var passport = require("passport");
var authenticate = require("../Controller/authenticate");
var cors = require("./cors");
const config = require("../config");
const { token } = require("morgan");

router.use(express.json());
router.use(
	express.urlencoded({
		extended: true,
	})
);

router.options("*", cors.corsWithOptions, (req, res) => {
	res.sendStatus(200);
});

/* GET users listing. */
router.get("/", function (req, res, next) {
	User.find({}).then((users) => {
		res.send(users);
	});
});

router.put(
	"/",
	cors.corsWithOptions,
	authenticate.verifyUser,
	(req, res, next) => {
		console.log(req.body);
		try {
			User.findById(req.user._id).then((user) => {
				if (!user.role) {
					user.role = req.body.user.role;
				}
				if (!user.password) {
					user.password = req.body.user.password;
				}
				if (!user.phoneNo) {
					user.phoneNo = req.body.user.phoneNo;
				}
				user.Address = req.body.Address;
				user.save().then((user) => {
					if (user) {

						console.log("Saved", user);
						return res.sendStatus(200);
					} else {
						console.log("COULDN'T SAVE");
						return res.sendStatus(500)
					}
				});
			});
		} catch (err) {
			console.log("ERROR");
			next(err);
		}
	}
);
router.post("/notifToken", cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	User.findById(req.user._id).then(user => {
		user.notifToken = req.body.token;
		user.save((user) => {
			console.log(user)
			if (user)
				return res.sendStatus(200);
		}, err => next(err))
		.catch(err => next(err))
	}, err => next(err))
		.catch(err => next(err))
})
router.get(
	"/profile",
	cors.corsWithOptions,
	authenticate.verifyUser,
	(req, res, next) => {
		var user = req.user;
		if (user.password) {
			delete user.password;
			user.password = true;
		} else {
			user.password = false;
		}

		return res.send({ token: req.token, user: user });
	}
);

router.post("/signup", cors.corsWithOptions, async (req, res) => {
	try {
		console.log(req.body.user);
		User.create(req.body.user).then((user) => {
			authenticate.getToken({ _id: user._id });
			const token = authenticate.getToken({ _id: user._id });
			res.send({ token });
		});
	} catch (err) {
		console.log(JSON.stringify(err));
		return res.status(422).send(err.message);
	}
});

router.post("/signin", cors.corsWithOptions, async (req, res) => {
	// console.log(req.body.user);
	const email = req.body.user.email;
	const password = req.body.user.password;
	if (!email || !password) {
		return res.status(422).send({ error: "must provide email or password" });
	}
	const user = await User.findOne({ email });
	if (!user) {
		return res.status(422).send({ error: "must provide email or password" });
	}
	try {
		await user.comparePassword(password);
		const token = authenticate.getToken({ _id: user._id });
		res.send({ token });
	} catch (err) {
		return res.status(422).send({ error: "must provide email or password" });
	}
});

router.get(
	"/auth/google",
	passport.authenticate("google", {
		successRedirect: config.baseUrl + "/",
		failureRedirect: config.baseUrl + "/error?index=4",
		scope: ["profile", "email"],
	})
);

router.get("/auth/google/callback", (req, res, next) => {
	passport.authenticate(
		"google",
		{ successRedirect: "/profile", failureRedirect: "/error/?index=4" },
		(err, user, info) => {
			if (err) return next(err);

			if (!user) {
				res.statusCode = 401;
				res.setHeader("Content-Type", "application/json");
				res.json({
					index: 4,
					success: false,
					status: "Login Unsuccessful!",
					err: info,
				});
			}
			req.logIn(user, (err) => {
				if (err) {
					return next(err);
				} else {
					var token = authenticate.getToken({ _id: req.user._id });
					res.cookie("jwt", token);
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.redirect(config.appBaseUrl + "?token=" + token);
				}
			});
		}
	)(req, res);
});

router.get(
	"/auth/facebook",
	passport.authenticate("facebook", {
		successRedirect: config.baseUrl + "/",
		failureRedirect: config.baseUrl + "/error?index=4",
		scope: ["email"],
	})
);

router.get("/auth/facebook/callback", (req, res, next) => {
	passport.authenticate(
		"facebook",
		{
			successRedirect: config.baseUrl + "/",
			failureRedirect: config.baseUrl + "/error?index=4",
		},
		(err, user, info) => {
			if (err) return next(err);
			if (!user) {
				res.statusCode = 401;
				res.setHeader("Content-Type", "application/json");
				return res.json({
					index: 2,
					success: false,
					status: "Login Unsuccessful!",
					err: info,
				});
			}
			req.logIn(user, (err) => {
				if (err) {
					return next(err);
				} else {
					var token = authenticate.getToken({ _id: req.user._id });
					res.cookie("jwt", token);
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					//res.json({ success: true, status: 'Login Successful!', token: token });
					console.log("CALLBACL TOKEN PRINT" + token);
					res.redirect(config.appBaseUrl + "?token=" + token);
					return;
				}
			});
		}
	)(req, res);
});
router.get("/checkJWTtoken", cors.corsWithOptions, (req, res) => {
	passport.authenticate("jwt", { session: false }, (err, user, info) => {
		if (err) return next(err);

		if (!user) {
			res.statusCode = 401;
			res.setHeader("Content-Type", "application/json");
			return res.json({ status: "JWT invalid!", success: false, err: info });
		} else {
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");
			return res.json({ status: "JWT valid!", success: true, user: user });
		}
	})(req, res);
});

router.get(`/get/count`, async (req, res) => {
	User.countDocuments((count) => {
		if (!count) {
			res.status(500).json({ success: false });
		}
		res.send({
			userCount: Count,
		});
	});
});
module.exports = router;
