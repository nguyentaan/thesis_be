const express = require("express");
const router = express.Router();
const productController = require("../controllers/product/productController");

const { authCheckToken } = require("../middleware/checkToken.js");

// router.get("/", authCheckToken, productController.getAllProduct);
router.get("/", productController.getAllProduct);

router.get("/:id", authCheckToken, productController.getProductById);

module.exports = router; // Change this line to use CommonJS syntax
