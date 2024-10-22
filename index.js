const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const multer = require("multer");
const productController = require("./controllers/productController");

require("dotenv").config();

app.use(bodyParser.json());
app.use(cors());

mongoose.set("strictQuery", true);

mongoose
  .connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err);
  });

// app.get("/api/products/:id", productController.getProductById);
app.get("/api/products", productController.getAllProduct);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
