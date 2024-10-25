const express = require("express");
const router = express.Router();
const productController = require("../controllers/product/productController");

const {
    authCheckToken,
} = require("../middleware/checkToken,js");

router.get(
    "/",
    authCheckToken,
    productController.getAllProduct
);

router.get(
    "/:id",
    authCheckToken,
    productController.getProductById
);

