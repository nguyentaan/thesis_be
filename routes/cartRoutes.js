const express = require("express");
const { addToCart, getCart, updateCart, clearCart, removeItemFromCart, increaseQuantity, decreaseQuantity } = require("../controllers/product/cartController");
const router = express.Router();

router.post("/", addToCart);
router.get("/:userId", getCart);
router.delete("/remove/:userId/:productId", removeItemFromCart);
router.post("/increase", increaseQuantity);
router.post("/decrease", decreaseQuantity);

module.exports = router;