const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    product_code: { type: Number, required: true, unique: true }, // Unique product identifier
    name: { type: String, required: true }, // Product name
    category: { type: String, required: true }, // Product category
    color: { type: String, required: true }, // Product color
    product_id: { type: String, required: true, unique: true }, // Unique product ID
    description: { type: String, required: true }, // Product description
    index_name: { type: String, required: false }, // Optional index name
    total_stock: { type: Number, required: true }, // Total stock available
    sold_count: { type: Number, default: 0 }, // Number of items sold
    review_count: { type: Number, default: 0 }, // Total number of reviews
    rating_count: { type: Number, default: 0 }, // Total number of ratings
    avg_rating: { type: Number, default: 0 }, // Average product rating
    total_rating: { type: Number, default: 0 }, // Sum of all ratings
    price: { type: Number, required: true }, // Product price
    image_url: { type: String, required: true }, // Image URL for the product
    images: { type: [String], default: [] }, // Array of additional image URLs
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], // Reference to reviews
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the model
const Product = model("Product", productSchema);

module.exports = Product;
