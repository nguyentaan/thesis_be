const express = require("express");

const AuthenticateRouter = require("./authenticate");
const ProductRouter = require("./product");

const router = express.Router();

// Register routers
router.use("/auth", AuthenticateRouter);
router.use("/products", ProductRouter);

module.exports = router;
