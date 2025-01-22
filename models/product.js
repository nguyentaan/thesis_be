const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    product_code: { type: String, required: false }, // Added for `product_code`
    product_id: { type: Number, required: true }, // Matches the `product_id` field
    name: { type: String, required: true }, // Product name
    category: { type: String, required: true }, // Product category
    color: { type: String, required: true }, // Product color
    description: { type: String, required: true }, // Corrected from `string` to `String`
    index_name: { type: String, required: false }, // Matches `index_name`
    total_stock: { type: Number, default: 0 }, // Matches `total_stock`
    sold_count: { type: Number, default: 0 }, // Matches `sold_count`
    review_count: { type: Number, default: 0 }, // Matches `review_count`
    rating_count: { type: Number, default: 0 }, // Matches `rating_count`
    avg_rating: { type: Number, default: 0 }, // Matches `avg_rating`
    total_rating: { type: Number, default: 0 }, // Matches `total_rating`
    price: { type: Number, required: true }, // Matches `price`
    image_url: { type: String, required: true }, // Matches `image_url`
    embedding: { type: [Number], required: false }, // Matches `embedding` as an array of numbers
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], // Matches `reviews` as an array of references
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt`
);

// Create the model
const Product = model("Product", productSchema);

module.exports = Product;