const express = require("express");

const AuthenticateRouter = require("./authenticate");
const ProductRouter = require("./product");
const UserRouter = require("./user");

const router = express.Router();

// Register routers
router.use("/auth", AuthenticateRouter);
router.use("/products", ProductRouter);
router.use("/users", UserRouter);

module.exports = router;
