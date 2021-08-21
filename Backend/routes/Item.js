var express = require("express");
var router = express.Router();
var User = require("../Models/User");
var Items = require("../Models/Item");

var authenticate = require("../Controller/authenticate");
var cors = require("./cors");
const multer = require("multer");
const FILE_TYPE_MAP = {
	"image/png": "png",
	"image/jpeg": "jpeg",
	"image/jpg": "jpg",
};

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const isValid = FILE_TYPE_MAP[file.mimetype];
		let uploadError = new Error("invalid image type");

		if (isValid) {
			uploadError = null;
		}
		cb(uploadError, "public/uploads");
	},
	filename: function (req, file, cb) {
		const fileName = file.originalname.split(" ").join("-");
		const extension = FILE_TYPE_MAP[file.mimetype];
		cb(null, `${fileName}-${Date.now()}.${extension}`);
	},
});
const uploadOptions = multer({ storage: storage });

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
router.get(
	"/",
	cors.corsWithOptions,
	authenticate.verifyUser,
	function (req, res, next) {
		var num = req.user.role == "Customer" ? 0 : 1;
		let filter = { Seller: num };
		if (req.query.categories) {
			filter = { Seller: num, category: req.query.categories.split(",") };
		}

		Items.find(filter)
			.populate("Category")
			.then((items) => {
				res.send(items);
			});
	}
);
router.get(
	"/role",
	cors.corsWithOptions,
	authenticate.verifyUser,
	function (req, res, next) {
		var num = req.user.role == "Retailer" ? 0 : 1;
		let filter = { Seller: num };
		if (req.query.categories) {
			filter = { Seller: num, category: req.query.categories.split(",") };
		}

		Items.find(filter)
			.populate("Category")
			.then((items) => {
				res.send(items);
			});
	}
);
router.get(`/:id`, cors.corsWithOptions,
	authenticate.verifyUser, (req, res, next) => {
		Items.findById(req.params.id)
			.populate("Category")
			.then((product) => {
				if (!product) {
					res.status(500).json({ success: false });
				}
				res.send(product);
			});
	});
router.get(
	//Gives options to choose from while adding new Item
	"/ToAdd",
	cors.corsWithOptions,
	authenticate.verifyUser,
	function (req, res, next) {
		var num = req.user.role == "Retailer" ? 0 : 1;
		try {
			Items.find({ Seller: num }).populate("Category")
				.then((items) => {
					res.send(items);
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
	uploadOptions.single("image"),
	(req, res, next) => {
		// console.log(req.body);
		try {
			var seller = {
				SellerName: req.user.Name,
				Price: req.body.price,
				Quantity: req.body.countInStock,
				Seller: req.user._id,
				Address: req.user.Address
			};
			const file = req.file;
			if (!file) return res.status(400).send("No image in the request");

			const fileName = file.filename;
			const basePath = `${req.protocol}://${req.get("host")}/uploads/`;
			Items.create({
				brand: req.body.brand,
				TotalQuantity: req.body.countInStock,
				Name: req.body.name,
				description: req.body.description,
				rating: req.body.rating,
				numReviews: req.body.numReviews,
				isFeatured: req.body.isFeatured,
				price: req.body.price,
				Seller: req.user.role == "Retailer" ? 0 : 1,
				Category: req.body.category,
				image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
			}).then((item) => {
				item.Sellers.push(seller);
				item.save();
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.send(item);
			});
		} catch (err) {
			console.log(err);
			return res.status(500);
		}
	}
);



router.post("/update", cors.corsWithOptions,
	authenticate.verifyUser,
	uploadOptions.single("image"), (req, res, next) => {
		// console.log(req.body);


		Items.findById(req.body.itemID).then((item) => {
			// console.log(item)
			if ((req.user.role == "Retailer" ? 0 : 1) != item.Seller) {
				return res.sendStatus(401);
			}
			item.brand = req.body.brand;
			item.Name = req.body.name;
			item.description = req.body.description;
			item.isFeatured = req.body.isFeatured
			if (item.price > req.body.price)
				item.price = req.body.price
			item.Seller = req.user.role == "Retailer" ? 0 : 1
			item.Category = req.body.category
			const file = req.file;
			if (file) {
				const fileName = file.filename;
				const basePath = `${req.protocol}://${req.get("host")}/uploads/`;
				item.image = `${basePath}${fileName}`
			}
			let flag = true;
			for (var i = 0; i < item.Sellers.length; i++) {
				if (item.Sellers[i].Seller.toString() == req.user._id.toString() && flag) {
					flag = false;
					item.TotalQuantity += req.body.countInStock - item.Sellers[i].Quantity;
					item.Sellers[i].Price = req.body.price;
					item.Sellers[i].Quantity = req.body.countInStock
					item.save().then(() => {
						return res.sendStatus(200)
					}, err => next(err)).catch(err => next(err))

				}
			}
			if (flag) {
				item.Sellers.push({
					Price: req.body.price, Quantity: req.body.countInStock,
					SellerName: req.user.Name,
					Seller: req.user._id,
					Address: req.user.Address
				})
				item.save().then(() => {
					return res.sendStatus(200)
				}, err => next(err)).catch(err => next(err))
			}
		}, err => next(err))
			.catch(err => next(err))

	})
router.get(
	`/get/featured/:count`,
	authenticate.verifyUser,
	(req, res, next) => {
		var num = req.user.role == "Retailer" ? 0 : 1;
		const count = req.params.count ? req.params.count : 0;
		Items.find({ Seller: num, isFeatured: true })
			.limit(+count)
			.then((products) => {
				if (!products) {
					res.status(500).json({ success: false });
				}
				res.send(products);
			});
	}
);

router.put(
	"/images/:id",
	uploadOptions.array("images", 10),
	authenticate.verifyUser,
	(req, res, next) => {
		const files = req.files;
		let imagesPaths = [];
		const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
		if (files) {
			files.map((file) => {
				imagesPaths.push(`${basePath}${file.filename}`);
			});
		}

		Items.findByIdAndUpdate(
			req.params.id,
			{
				images: imagesPaths,
			},
			{ new: true }
		).then((product) => {
			if (!product)
				return res.status(500).send("the gallery cannot be updated!");

			res.send(product);
		});
	}
);

module.exports = router;
