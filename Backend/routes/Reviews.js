var express = require("express");
var router = express.Router();
var Reviews = require('../Models/Reviews')
var Item = require('../Models/Item')

var authenticate = require("../Controller/authenticate");
var cors = require("./cors");

router.use(express.json());
router.use(
    express.urlencoded({
        extended: true,
    })
);

router.get("/:itemID", cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Reviews.find({Item:req.params.itemID}).then(reviews => {
        if (reviews) {
            for (var i = 0; i < reviews.length; i++)
                if (reviews[i].user.toString() == req.user._id.toString()) {
                    console.log("FOUND USER")
                    return res.send({ Reviews: reviews, myRating: reviews[i] })
                }
        }
        return res.send({ Reviews: reviews });
    })
});

router.post("/submit", cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log(req.body);
    Reviews.create({
        user: req.user._id,
        Item: req.body.itemID,
        userName: req.user.Name,
        Rating: req.body.Rating,
        review: req.body.Review
    }).then(review => {
        Item.findById(review.Item).then(item => {
            if (item) {
                item.numReviews++;
                item.rating += review.Rating;
                item.save().then(() => {
                    return res.sendStatus(200);
                })
            } else {
                console.log(review.Item)
            }
        })
    })
})


module.exports = router;
