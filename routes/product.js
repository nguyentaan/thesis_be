const express = require("express");
const router = express.Router();
const productController = require("../controllers/product/productController");


const { authCheckToken } = require("../middleware/checkToken.js");

// router.get("/", authCheckToken, productController.getAllProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.get("/category", productController.getAllCategories);
router.get("/index_name/getAll", productController.getAllUniqueIndexName);
router.get("/category/:category", productController.getProductsByCategory);
router.post(
    "/chunking",
    productController.saveChunking
);

router.post(
    "/create",
    productController.createProduct
);

router.post(
    "/delete",
    productController.deleteProductById
);

router.put(
    "/update",
    productController.updateProductById
);

module.exports = router;

