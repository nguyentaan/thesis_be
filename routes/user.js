const express = require("express");
const router = express.Router();
const updateController = require("../controllers/user/update/user.js");
const getController = require("../controllers/user/get/user.js");

// const { authCheckToken } = require("../middleware/checkToken.js");
const {
  authUserMiddleware,
  authAdminMiddleware,
} = require("../middleware/auth");

// router.get("/", authCheckToken, productController.getAllProduct);
router.post("/keyword/add", userController.UpdateSearchHistory);
router.delete("/keyword/remove", userController.RemoveSearchHistoryItem);
router.delete("/keyword/remove-all", userController.ClearAllSearchHistory);
router.put("/profile/update", updateController.UpdateUserProfile);

router.get(
  "/profile/list",
  //  authAdminMiddleware,
  getController.getAllUser
);

module.exports = router; // Change this line to use CommonJS syntax
