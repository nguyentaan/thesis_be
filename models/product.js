const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  sizes: [
    {
      size_name: { type: String, required: true },
      stock: { type: Number, required: true },
    },
  ],
  category: { type: String, required: true },
  price: { type: String, required: true },
  color: { type: String, required: true },
  sku: { type: String, required: false },
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
  sold_count: { type: Number, default: 0 }, // Number of items sold
  review_count: { type: Number, default: 0 }, // Number of reviews for this product
  rating_count: { type: Number, default: 0 }, // Number of ratings given (e.g., count of reviews with ratings)
  avg_rating: { type: Number, default: 0 },
  total_rating: { type: Number, default: 0 }, // Sum of all ratings
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], // Reference to reviews
});

// Create the model
const Product = model("Product", productSchema);

module.exports = Product;
