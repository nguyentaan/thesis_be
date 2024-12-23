const express = require("express");
const router = express.Router();
const {
  createOrderFromCart,
  getOrdersByUserId,
  cancelOrder,
} = require("../controllers/order/orderController");

router.post("/create/:userId", createOrderFromCart);
router.get("/:userId", getOrdersByUserId);
router.put("/:userId/:orderId/cancel", cancelOrder);

module.exports = router;
