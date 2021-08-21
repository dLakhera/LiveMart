var express = require("express");
var router = express.Router();
var User = require("../Models/User");
var cors = require("./cors");
const SellerOrders = require("../Models/SellerOrders");
const Item = require("../Models/Item");
var authenticate = require("../Controller/authenticate");
const Cart = require("../Models/Cart");
const { update } = require("../Models/User");
var pingUser = require('../Controller/pingUser')
const { sendNotifications } = require("../Controller/sendNotification")
router.use(express.json());
router.use(
	express.urlencoded({
		extended: true,
	})
);

router.options("*", cors.corsWithOptions, (req, res) => {
	res.sendStatus(200);
});
router.get(
	"/",
	cors.corsWithOptions,
	authenticate.verifyUser,
	function (req, res, next) {
		SellerOrders.find({ Customer: req.user._id }).populate({ path: "Items", populate: { path: "Item", model: 'Items' } }).then(
			(orders) => {
				// console.log(orders);
				res.send(orders);
			}
		);
	}
);
router.put('/', cors.corsWithOptions,
	authenticate.verifyUser,
	function (req, res, next) {
		console.log("*******", req.body)
		let message = "Your Order No. " + req.body.orderID + "has a update. Your Order is " + (req.body.statusCode == 1 ? "shipped" : "delivered");
		SellerOrders.findOne({ _id: req.body.orderID/* , Seller: req.user._id */ }).then(sellerOrder => {

			if (sellerOrder.statusCode < req.body.statusCode)
				sellerOrder.statusCode = req.body.statusCode;
			if (req.body.deliveredBy) {
				sellerOrder.deliveredBy = req.body.deliveredBy
				sellerOrder.deliveryNo = req.body.deliveredByNo
				if (req.body.statusCode == 1) {
					message += "\n " + req.body.deliveredBy + " is bringing your Order. Contact Him on " + req.body.deliveredByNo;
				}
			}
			sellerOrder.save().then(() => {
				User.findById(sellerOrder.Customer).then(customer => {
					if (customer.notifToken)
						sendNotifications(customer.notifToken, "Order Update", message);
				})
				pingUser.ping(sellerOrder.Customer, message)
				return res.sendStatus(200);
			}, err => next(err)).catch(err => next(err))
		});


	});
router.get(
	"/seller",
	cors.corsWithOptions,
	authenticate.verifyUser,
	function (req, res, next) {
		SellerOrders.find({ Seller: req.user._id }).populate({ path: "Items", populate: { path: "Item", model: 'Items' } }).then(
			(orders) => {
				// console.log(JSON.stringify(orders));
				res.send(orders);
			}
		);
	}
);
const updateQuantity = (Sellers, itemID) => {
	Item.findById(itemID).then(item => {
		if (item) {
			for (var j = 0; j < Sellers.length; j++) {
				for (var k = 0; k < item.Sellers.length; i++) {
					if (item.Sellers[k].Seller == Sellers[j].Seller) {
						item.Sellers[k].Quantity -= Sellers[j].Quantity_to_buy
						item.TotalQuantity -= Sellers[j].Quantity_to_buy;
						break;
					}
				}
			}
			item.save().then(item => console.log("Item Saved", item));
		} else console.log("Couldnt find user ", req.body.orderItems.Items[i].Item.id)

	})
}
router.delete('/:orderID', cors.corsWithOptions,
	authenticate.verifyUser, async (req, res, next) => {
		console.log(req.body)
		SellerOrders.findByIdAndDelete(req.params.orderID).then(() => {
			return res.sendStatus(200);
		}, err => next(err)).catch(err => next(err));
	})
router.post("/",
	cors.corsWithOptions,
	authenticate.verifyUser, async (req, res, next) => {
		// console.log(JSON.stringify(req.body.orderItems))
		var sellerOrders = {};

		var Items = [];
		for (var i = 0; i < req.body.orderItems.Items.length; i++) {
			updateQuantity(req.body.orderItems.Items[i].Sellers, req.body.orderItems.Items[i].Item.id)
			/* Item.findById(req.body.orderItems.Items[i].Item.id).then(item => {
				if (item) {
					for (var j = 0; j < req.body.orderItems.Items[i].Sellers.length; j++) {
						for (var k = 0; k < item.Sellers.length; i++) {
							if (item.Sellers[k].Seller == req.body.orderItems.Items[i].Sellers[j].Seller) {
								item.Sellers[k].Quantity -= req.body.orderItems.Items[i].Sellers[j].Quantity_to_buy
								item.TotalQuantity -= req.body.orderItems.Items[i].Sellers[j].Quantity_to_buy;
								break;
							}
						}
					}
					item.save().then(item => console.log("Item Saved", item));
				} else console.log("Couldnt find user ", req.body.orderItems.Items[i].Item.id)

			}) */
		}
		for (var i = 0; i < req.body.orderItems.Items.length; i++) {

			Item.findById(req.body.orderItems.Items[i].Item.id).then(item => {
				if (item) {
					for (var j = 0; j < req.body.orderItems.Items[i].Sellers.length; j++) {
						for (var k = 0; k < item.Sellers.length; i++) {
							if (item.Sellers[k].Seller == req.body.orderItems.Items[i].Sellers[j].Seller) {
								item.Sellers[k].Quantity -= req.body.orderItems.Items[i].Sellers[j].Quantity_to_buy
								item.TotalQuantity -= req.body.orderItems.Items[i].Sellers[j].Quantity_to_buy;
								break;
							}
						}
					}
					item.save().then(item => console.log("Item Saved", item));
				} else console.log("Couldnt find user ", req.body.orderItems.Items[i].Item.id)

			})
			for (var j = 0; j < req.body.orderItems.Items[i].Sellers.length; j++) {
				delete req.body.orderItems.Items[i].Sellers[j]._id

				if (sellerOrders[req.body.orderItems.Items[i].Sellers[j].Seller]) {
					if (sellerOrders[req.body.orderItems.Items[i].Sellers[j].Seller].TotalPrice == undefined)
						sellerOrders[req.body.orderItems.Items[i].Sellers[j].Seller].TotalPrice = 0;

					// console.error("\n\nError Before " + i + " : " + j, sellerOrders[req.body.orderItems.Items[i].Sellers[j].Seller].TotalPrice);

					sellerOrders[req.body.orderItems.Items[i].Sellers[j].Seller].TotalPrice += (Number)(req.body.orderItems.Items[i].Sellers[j].Quantity_to_buy) * req.body.orderItems.Items[i].Sellers[j].Price
					// console.error("\n\nError After " + i + " : " + j, sellerOrders[req.body.orderItems.Items[i].Sellers[j].Seller].TotalPrice);
					sellerOrders[req.body.orderItems.Items[i].Sellers[j].Seller].Items.push({
						Item: req.body.orderItems.Items[i].Item.id,
						Price: req.body.orderItems.Items[i].Sellers[j].Price,
						QuantityBought: req.body.orderItems.Items[i].Sellers[j].Quantity_to_buy
					})
				}
				else {
					sellerOrders[req.body.orderItems.Items[i].Sellers[j].Seller] = {
						Seller: req.body.orderItems.Items[i].Sellers[j].Seller,
						Customer: req.user._id,
						Address: req.body.address,
						phoneNo: req.body.phone,
						TotalPrice: req.body.orderItems.Items[i].Sellers[j].Quantity_to_buy * req.body.orderItems.Items[i].Sellers[j].Price,
						Items: [{
							Item: req.body.orderItems.Items[i].Item.id,
							Price: req.body.orderItems.Items[i].Sellers[j].Price,
							QuantityBought: req.body.orderItems.Items[i].Sellers[j].Quantity_to_buy
						}],
					};
				}
			}
			var item = {
				Item: req.body.orderItems.Items[i].Item.id,
				Sellers: req.body.orderItems.Items[i].Sellers
			}
			Items.push(item);
		}

		Object.keys(sellerOrders).forEach(key => {
			sellerOrders[key].CustomerName = req.user.Name;
			sellerOrders[key].orderType = req.body.orderType.toLowerCase()
			User.findById(key).then(seller => {
				sellerOrders[key].SellerName = seller.Name
				SellerOrders.create(sellerOrders[key]).then(order => {
					SellerOrders.create(sellerOrders[key]).then(order => {
						console.log("NICE");
					})
				}).catch(err => next(err))
			});
			Cart.findOneAndDelete({ CustomerID: req.user._id }).then(() => {
				return res.sendStatus(200);
			});
		})
	})
module.exports = router;
