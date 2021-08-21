const express = require("express");
const router = express.Router();
const cors = require("./cors");
const authenticate = require("./../Controller/authenticate");
const Category = require("../Models/Category");
router.use(express.json());
router.use(
	express.urlencoded({
		extended: true,
	})
);

router.options("*", cors.corsWithOptions, (req, res) => {
	res.sendStatus(200);
});
router.get("/", cors.corsWithOptions, (req, res, next) => {
	Category.find({}).then((categories) => {
		if (!categories) {
			return res.status(404);
		}
		return res.send(categories);
	});
});
router.get(
	`/`,
	cors.corsWithOptions,
	authenticate.verifyUser,
	(req, res, next) => {
		try {
			Category.find({}).then((categoryList) => {
				if (!categoryList) {
					res.status(500).json({ success: false });
				}
				res.status(200).send(categoryList);
			});
		} catch (err) {
			next(err);
		}
	}
);

router.get(
	"/:id",
	cors.corsWithOptions,
	authenticate.verifyUser,
	(req, res, next) => {
		try {
			Category.findById(req.params.id).then((category) => {
				if (!category) {
					res
						.status(500)
						.json({ message: "The category with the given ID was not found." });
				}
				res.status(200).send(category);
			});
		} catch (err) {
			next(err);
		}
	}
);

router.post(
	"/",
	cors.corsWithOptions,
	authenticate.verifyUser,
	(req, res, next) => {
		Category.create({
			Name: req.body.name,
			icon: req.body.icon,
			color: req.body.color,
		}).then((category) => {
			category.save().then((category) => {
				return res.Status(200).send(category);
			});
		}).catch(err => next(err))
	})

router.put("/:id", async (req, res) => {
	try {
		Category.findByIdAndUpdate(
			req.params.id,
			{
				name: req.body.name,
				icon: req.body.icon || category.icon,
				color: req.body.color,
			},
			{ new: true }
		).then((category) => {
			if (!category)
				return res.status(400).send("the category cannot be created!");
			res.send(category);
		});
	} catch (err) {
		next(err);
	}
});

router.delete("/:id", (req, res) => {
	Category.findByIdAndRemove(req.params.id)
		.then((category) => {
			if (category) {
				return res
					.status(200)
					.json({ success: true, message: "the category is deleted!" });
			} else {
				return res
					.status(404)
					.json({ success: false, message: "category not found!" });
			}
		})
		.catch((err) => {
			return res.status(500).json({ success: false, error: err });
		});
});

module.exports = router;
