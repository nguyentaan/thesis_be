const express = require("express");
const router = express.Router();
const authController1 = require("../controllers/auth/login");
const authController2 = require("../controllers/auth/register");
const authController4 = require("../controllers/auth/refresh_token");

const { authUserMiddleWare } = require("../middleware/checkToken.js");

router.post("/login", authController1.Login);

router.post("/register", authController2.CreateUser);

router.post("/google", authController1.GoogleSignIn);

router.post("/refresh-token", authController4.NewRefreshToken);

module.exports = router; // Change this line to use CommonJS syntax
