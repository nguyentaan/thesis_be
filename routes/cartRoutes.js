const express = require("express");
const {
  addToCart,
  getCart,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
} = require("../controllers/product/cartController");
const router = express.Router();

router.post("/", addToCart);
router.get("/:userId", getCart);
router.delete("/remove", removeItem);
router.put("/increase", increaseQuantity);
router.put("/decrease", decreaseQuantity);

module.exports = router;
