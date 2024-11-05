const express = require("express");
const router = express.Router();
const userController = require("../controllers/user/user.js");

// const { authCheckToken } = require("../middleware/checkToken.js");

// router.get("/", authCheckToken, productController.getAllProduct);
router.put("/keyword/add", userController.UpdateSearchHistory);

module.exports = router; // Change this line to use CommonJS syntax
