const express = require("express");
const router = express.Router();
const cors = require("./cors");
const authenticate = require("./../Controller/authenticate");
const Cart = require("../Models/Cart");

var mongoose = require('mongoose');
router.use(express.json());
router.use(
	express.urlencoded({
		extended: true,
	})
);

router.options("*", cors.corsWithOptions, (req, res) => {
	res.status(200).send(cart);

});

router.get(
	`/`,
	cors.corsWithOptions,
	authenticate.verifyUser,
	(req, res, next) => {
		try {
			Cart.findOne({ CustomerID: req.user._id }).populate({ path: "Items", populate: { path: "Item", model: 'Items' } }
			).then((cart) => {
				// console.log("After Populating", cart);
				res.status(200).send(cart);
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
		// console.log(JSON.stringify(req.body));
		try {
			const item = {
				Item: req.body.Item,
				Sellers: [],
			}
			const seller = {
				Seller: req.body.seller.seller,
				Price: req.body.seller.price,
				Name: req.body.seller.Name
				// Quantity_to_buy:req.body.seller.Quantity_to_buy
			}
			Cart.findOne({ CustomerID: req.user._id }).then(cart => {
				var NOTADDED = true;
				var NOTADDED2 = true;
				if (cart) {
					// console.log(cart);
					if (cart.Items) {
						for (var i = 0; i < cart.Items.length; i++) {
							if (cart.Items[i].Item == req.body.Item) {
								NOTADDED = false;
								// console.log(cart.Items[i]);
								for (var j = 0; j < cart.Items[i].Sellers.length; j++) {
									if (cart.Items[i].Sellers[j].Seller == (req.body.seller.seller)) {
										NOTADDED2 = false;
										cart.TotalPrice += req.body.seller.Quantity_to_buy * req.body.seller.price;
										cart.Items[i].Sellers[j].Quantity_to_buy += req.body.seller.Quantity_to_buy
										cart.save();
										return res.status(200).send(cart);
									}
								}
								if (NOTADDED2) {
									seller.Quantity_to_buy = req.body.seller.Quantity_to_buy
									cart.Items[i].Sellers.push(seller)
									cart.TotalPrice += req.body.seller.Quantity_to_buy * req.body.seller.price;
									cart.save();
									return res.status(200).send(cart);
								}
							}
						}
						if (NOTADDED) {
							seller.Quantity_to_buy = req.body.seller.Quantity_to_buy
							item.Sellers.push(seller)
							cart.Items.push(item);
							cart.TotalPrice += req.body.seller.Quantity_to_buy * req.body.seller.price;
							// console.log(cart);

							cart.save();
							return res.status(200).send(cart);
						}
					}
				} else {
					// console.log("CREATOMG");
					Cart.create({
						CustomerID: req.user._id,
						TotalPrice: req.body.seller.Quantity_to_buy * req.body.seller.price
					}).then(cart => {
						// console.log(cart);

						seller.Quantity_to_buy = req.body.seller.Quantity_to_buy
						item.Sellers.push(seller)
						cart.Items.push(item);
						// console.log(cart);
						cart.save();
						return res.status(200).send(cart);

					})
				}

			})
		} catch (err) {
			next(err)
		}
	});

router.delete("/", cors.corsWithOptions,
	authenticate.verifyUser,
	(req, res, next) => {
		Cart.findOneAndDelete({ CustomerID: req.user._id }).then(() => { return res.sendStatus(200) })
	});

router.delete("/:itemID", cors.corsWithOptions,
	authenticate.verifyUser,
	(req, res, next) => {
		var item = req.params.itemID;
		// console.log(req.body)
		Cart.findOne({ CustomerID: req.user._id }).populate({ path: "Items", populate: { path: "Item", model: 'Items' } }).then(cart => {
			// console.log(cart.Items[1]);
			var flag=true;
			for (var i = 0; i<cart.Items.length; i++) {
				// console.log(cart.Items[i]);
				if (cart.Items[i].Item._id == item) {
					flag=false;
					var items= cart.Items;
					// console.log(items);
					var deletedItem = items.splice(i, 1)[0];
					// console.log(items);
					cart.Items = items;
					// console.log("deleted",deletedItem)
					for(i = 0 ;i<deletedItem.Sellers.length;i++)
						cart.TotalPrice -= deletedItem.Sellers[i].Quantity_to_buy * deletedItem.Sellers[i].Price
					cart.save().then(() => {
						return res.send(cart);
					})
				}
			}
			if(flag)
				return res.sendStatus(404);

		})
	});

module.exports = router;
