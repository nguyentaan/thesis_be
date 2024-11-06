const express = require("express");
const router = express.Router();
const updateController = require("../controllers/user/update/user.js");
const getController = require("../controllers/user/get/user.js");

// const { authCheckToken } = require("../middleware/checkToken.js");
const { authUserMiddleware, authAdminMiddleware } = require("../middleware/auth");

router.put("/keyword/add", authUserMiddleware, updateController.UpdateSearchHistory);
router.put("/profile/update", authUserMiddleware, updateController.UpdateUserProfile);

router.get("/profile/list",
    //  authAdminMiddleware,
      getController.getAllUser);

module.exports = router; // Change this line to use CommonJS syntax
