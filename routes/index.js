const express = require("express");

const AuthenticateRouter = require("./authenticate");
const ProductRouter = require("./product");
const OrderRouter = require('./orderRoutes');
const UserRouter = require("./user");


const router = express.Router();

const routes = (app) => {
  app.use("/users", UserRouter);
  app.use("/auth", AuthenticateRouter);
  app.use("/products", ProductRouter);
  app.use("/orders", OrderRouter);
//   app.use("/knowledge_base", KnowledgeBaseRouter);
//   app.use("/document", DocumentRouter);
//   app.use("/document_type", DocumentTypeRouter);
};

module.exports = router;
