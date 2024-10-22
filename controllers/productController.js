const Product = require("../models/ProductModel");

const getProductById = async (req,res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({message: "Product not found"});
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getAllProduct = async (req, res) => {
  try {
    // Extract page and limit from query parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 20; // Default to 20 if not provided

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch the products with pagination
    const products = await Product.find()
      .skip(skip) // Skip the documents for previous pages
      .limit(limit); // Limit the number of documents returned

    // Count total products to return with response (optional)
    const totalProducts = await Product.countDocuments();

    // Send the response
    res.json({
      products, // The current page products
      total: totalProducts, // Total number of products
      page, // Current page
      limit, // Items per page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getProductById,
  getAllProduct,
};