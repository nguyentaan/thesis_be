const express = require("express");
const router = express.Router();
const authController1 = require("../controllers/auth/login");
const authController2 = require("../controllers/auth/register");
const authController4 = require("../controllers/auth/refresh_token");
const authController5 = require("../controllers/auth/dashboard");


router.post("/login", authController1.Login);

router.post("/normal-login", authController1.LoginWithoutOTP);

router.post("/google-signin", authController1.GoogleSignIn);

router.post("/register", authController2.CreateUser);

router.post("/verify-otp", authController1.VerifyOTP);      

router.post("/refresh-token", authController4.NewRefreshToken);

router.get("/dashboard", authController5.DashboardData);

module.exports = router; // Change this line to use CommonJS syntax
