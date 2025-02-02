const express = require("express");
const router = express.Router();
const updateController = require("../controllers/user/update/user.js");
const getController = require("../controllers/user/get/user.js");
const deleteController = require("../controllers/user/delete/user.js");

// const { authCheckToken } = require("../middleware/checkToken.js");
const {
  authUserMiddleware,
  authAdminMiddleware,
} = require("../middleware/auth");

router.post("/users/remove-one", deleteController.deleteUserById);
// router.get("/", authCheckToken, productController.getAllProduct);
router.post("/keyword/add", updateController.UpdateSearchHistory);
router.delete("/keyword/remove", updateController.RemoveSearchHistoryItem);
router.delete("/keyword/remove-all", updateController.ClearAllSearchHistory);
router.put("/profile/update", updateController.UpdateUserProfile);

router.get(
  "/profile/list",
  //  authAdminMiddleware,
  getController.getAllUser
);


router.get(
  "/profile/id/:id",
  //  authAdminMiddleware,
  getController.getOneUser
);

module.exports = router; // Change this line to use CommonJS syntax
