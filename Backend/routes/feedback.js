var express = require("express");
var router = express.Router();
var Feedback = require('../Models/Feedback')

var authenticate = require("../Controller/authenticate");
var cors = require("./cors");

router.use(express.json());
router.use(
    express.urlencoded({
        extended: true,
    })
);

router.post("/", cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Feedback.findOne({ AddressedFromID: req.user._id, AddressedToID: req.body.AddressedToID })
        .then(response => {
            // console.log(JSON.stringify(response));
            return res.status(200).send(response);
        })
        .catch((err) => {
            // console.log(err);
            next(err);
            return res.status(500);
        });
});

router.put("/reply", cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    // console.log(req.body)
    Feedback.findById(req.body.feedbackID)
        .then(feedback => {
            feedback.Reply = req.body.reply;
            feedback.Replied = true;
            feedback.save().then(() => {
                return res.sendStatus(200);
            }, err => next(err))
                .catch(err => next(err))
        }, err => next(err))
        .catch((err) => {
            next(err);
        });
});

router.get("/from", cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Feedback.find({ AddressedFromID: req.user._id }).populate({ path: "ItemID", Model: "Items" })
        .then(response => {
            // console.log(JSON.stringify(response));
            return res.status(200).send(response);
        })
        .catch((err) => {
            next(err);
            return res.status(500);
        });
}
);

router.get("/to", cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    // console.log("user", req.user._id);
    Feedback.find({ AddressedToID: req.user._id, Replied: false }).populate({ path: "ItemID", Model: "Items" })
        .then(feedbacks => {
            if (feedbacks) {
                console.log(JSON.stringify(feedbacks));
                return res.status(200).send(feedbacks);
            } else
                return res.sendStatus(404);
        })
        .catch((err) => {
            console.log(err);
            next(err);
            return res.status(500);
        });
}
);

router.post("/submit", cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Feedback.create({
        AddressedFromID: req.user._id,
        AddressedToID: req.body.AddressedToID,
        ItemID: req.body.ItemID,
        Query: req.body.Query,
        AddressedFromName: req.user.Name
    })
        .then(feedback => {
            feedback.save()
                .then(() => {
                    return res.sendStatus(200);
                })
                .catch(err => {
                    console.log("Error while posting comment: ", err);
                    next(err);
                });
        })
})


module.exports = router;
