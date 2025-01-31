const express = require("express");
const router = express.Router();
const productController = require("../controllers/product/productController");


const { authCheckToken } = require("../middleware/checkToken.js");

// router.get("/", authCheckToken, productController.getAllProduct);
router.get("/", productController.getAllProducts);
router.get("/category", productController.getAllCategories);
router.get("/category/:category", productController.getProductsByCategory);
router.get("/:id", authCheckToken, productController.getProductById);
router.post(
    "/chunking",
    productController.saveChunking
);

module.exports = router;

