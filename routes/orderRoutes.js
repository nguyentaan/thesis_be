const express = require("express");
const router = express.Router();
const { createOrderFromCart, getOrdersByUserId } = require(
  "../controllers/order/orderController"
);

router.post("/create/:userId", createOrderFromCart);
router.get("/:userId", getOrdersByUserId);

module.exports = router;
