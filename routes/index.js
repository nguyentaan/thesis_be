// const UserRouter = require("./user");
const AuthenticateRouter = require("./authenticate");
const ProductRouter = require("./product");

// const DocumentRouter = require("./document");
// const DocumentTypeRouter = require("./document_type");
// const KnowledgeBaseRouter = require("./knowledge_base");

const routes = (app) => {
//   app.use("/user", UserRouter);
  app.use("/auth", AuthenticateRouter);
  app.use("/products", ProductRouter);
//   app.use("/knowledge_base", KnowledgeBaseRouter);
//   app.use("/document", DocumentRouter);
//   app.use("/document_type", DocumentTypeRouter);
};

module.exports = routes;