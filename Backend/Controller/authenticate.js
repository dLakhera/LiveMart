var passport = require('passport');
var User = require('../Models/User');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20');
var config = require('../config.js');
// used to serialize the user for the session
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

exports.getToken = function (user) {
    return jwt.sign(user, config.jwtKey, { expiresIn: 10 * 60 });
};
exports.getOTPToken = function (user) {
    var token = jwt.sign(user, config.jwtOTPKey);
    // console.log("SIGNING WITH TOKEN " + token + "using " + config.jwtOTPKey);
    return token
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken;
opts.secretOrKey = config.jwtKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        // console.log("JWT payload: ", jwt_payload);
        User.findOne({ _id: jwt_payload._id }, (err, user) => {
            if (err) {
                // console.log("HI + " + JSON.stringify(err));
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }
));

exports.verifyUser = //passport.authenticate('jwt', { session: false });
        /* function */ (req, res, next) => {

        let { authorization } = req.headers;
        if (!authorization) {
            // console.log("NO AUTH",req.headers)
            return res.status(401).send({ error: "you must be logged in" })
        }
        // const token = authorization.replace("Bearer ", "");
        const token = authorization.split(' ')[1];
        jwt.verify(token, config.jwtOTPKey, async (err, payload) => {
            if (err) {
                // console.log("INVALID TOKEN + " + JSON.stringify(err));
                // console.log("TOKEN: {" + token + "} With Key: {" + config.jwtOTPKey + "}");
                return res.status(401).send({ error: "you must be logged in 2" })
            }
            const userId = payload._id;
            const user = await User.findById(userId)
            if (user) {
                req.user = user;
                req.token = token;
                next();
            } else {
                // console.log(payload);
                // console.log("UserNotFound")
                res.status(401).send({ error: "No such User Found" })
            }
        })
    }

exports.verifyUserWithoutOtp = /* passport.authenticate('jwt', { session: false }); */ (req, res, next) => {
    let { authorization } = req.headers;
    if (!authorization) {
        console.log("you must be logged in")
        return res.status(401).send({ error: "you must be logged in" })
    }
    const token = authorization.split(' ')[1];
    //authorization.replace("Bearer ", "");
    console.log("Verifing token: {" + token + "}");
    jwt.verify(token, config.jwtKey, async (err, payload) => {
        if (err) {
            console.log("you must be logged in 2" + JSON.stringify(err));
            return res.status(401).send({ error: "you must be logged in 2" })
        }
        const userId = payload._id;
        const user = await User.findById(userId)
        if (user) {
            // console.log("USER FOund")
            req.user = user;
            next();
        } else {
            console.log("NO USER FOUND WITH ID " + userId);
            res.status(401).send({ error: "No such User Found" })
        }
    })
}

exports.facebookPassport = passport.use(new FacebookStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.baseUrl + config.facebook.callbackURL,
    profileFields: ["email", "name"]
}, (accessToken, refreshToken, profile, done) => {
    // console.log(JSON.stringify(profile))
    User.findOne({ email: profile.emails[0].value }, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (user) {
            user.facebookId = profile.id;
            user.save((err, user) => {
                if (err)
                    return done(err, false);
                else
                    return done(null, user);
            });
            // return done(null, user);
        }
        else {
            user = new User({});
            user.facebookId = profile.id;
            user.Name = profile.name.givenName + " " + profile.name.familyName;
            user.email = profile.emails[0].value;
            user.save((err, user) => {
                if (err)
                    return done(err, false);
                else
                    return done(null, user);
            })
        }
    });
}
));

exports.googlePassport = passport.use(new GoogleStrategy({
    clientID: config.google.clientId,
    clientSecret: config.google.clientSecret,
    callbackURL: config.baseUrl + config.google.callbackURL
}, (accessToken, refreshToken, profile, done) => {
    process.nextTick(function () {
        User.findOne({ email: profile.emails[0].value }, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                user.googleId = profile.id;
                user.save((err, user) => {
                    if (err)
                        return done(err, false);
                    else
                        return done(null, user);
                });
                // return done(null, user);
            }
            else {
                user = new User({});
                user.firstname = profile.name.givenName
                user.googleId = profile.id;
                user.lastname = profile.name.familyName;
                user.email = profile.emails[0].value;
                user.save((err, user) => {
                    if (err)
                        return done(err, false);
                    else
                        return done(null, user);
                })
            }
        });
    })
}
));


