const Review = require("../../models/review");
const Product = require("../../models/product");

const writeReview = async (req, res) => {
  try {
    const { productId, rating, reviewText, userId } = req.body;

    if (!productId || !rating || !reviewText || !userId) {
      return res.status(400).json({
        message: "Product ID, rating, review text, and user ID are required",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newReview = new Review({
      product: productId,
      rating,
      review: reviewText,
      user: userId,
    });

    const savedReview = await newReview.save();

    product.reviews.push(savedReview._id);
    product.review_count += 1;
    product.rating_count += 1;

    // Update total_rating and calculate new avg_rating
    product.total_rating += rating; // Add the new review's rating
    product.avg_rating = product.total_rating / product.rating_count;

    await product.save();

    return res.status(201).json({
      message: "Review added successfully",
      review: savedReview,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// Controller to get reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Fetch reviews for the product
    const reviews = await Review.find({ product: productId }).populate(
      "user",
      "name"
    );

    if (!reviews.length) {
      return res
        .status(404)
        .json({ message: "No reviews found for this product" });
    }

    return res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

module.exports = { writeReview, getProductReviews };
