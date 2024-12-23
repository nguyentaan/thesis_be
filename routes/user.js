const express = require("express");
const router = express.Router();
const userController = require("../controllers/user/user.js");

// const { authCheckToken } = require("../middleware/checkToken.js");

// router.get("/", authCheckToken, productController.getAllProduct);
router.post("/keyword/add", userController.UpdateSearchHistory);
router.delete("/keyword/remove", userController.RemoveSearchHistoryItem);
router.delete("/keyword/remove-all", userController.ClearAllSearchHistory);

module.exports = router; // Change this line to use CommonJS syntax
