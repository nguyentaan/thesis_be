const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  size: {
    type: [{ title: String, content: String }],
    required: true,
  },
  category: { type: String, required: true },
  price: { type: String, required: true },
  color: { type: String, required: true },
  sku: { type: String, required: true },
  description: {
    type: [
      {
        title: String,
        content: String,
      },
    ],
    required: true,
  },
  images: { type: [String], required: true },
});

// Create the model
const Product = model("Product", productSchema);

module.exports = Product;
