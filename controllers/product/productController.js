const Product = require("../../models/product");
const ProductService = require("../../services/product");

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProduct = async (req, res) => {
  try {
    // Extract page, limit, and search query from query parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 20; // Default to 20 if not provided
    const search = req.query.search || ""; // Default to an empty string if not provided

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Build a search filter (case-insensitive)
    const searchFilter = search
      ? { name: { $regex: search, $options: "i" } } // Match name field with case-insensitive regex
      : {};

    // Fetch the products with pagination and exclude the "embedding" field
    const products = await Product.find(searchFilter) // Apply the search filter
      .select("-embedding") // Exclude the "embedding" field
      .skip(skip) // Skip the documents for previous pages
      .limit(limit); // Limit the number of documents returned

    // Count total products matching the search query
    const totalProducts = await Product.countDocuments(searchFilter);

    // Send the response
    res.json({
      products, // The current page products
      total: totalProducts, // Total number of matching products
      page, // Current page
      limit, // Items per page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Save Chunking Data
const saveChunking = async (req, res) => {
  try {
    const {
      chunking_list: chunkingList,
      file_name: fileName,
      file_type: fileType,
    } = req.body;
    if (!chunkingList || !fileName || !fileType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const results = await ProductService.createFileAndChunkListProduct(
      chunkingList,
      fileName[0],
      fileType
    );

    return res.status(200).json({
      status: "success",
      message: "Chunking data saved successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error in saveChunking:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

module.exports = {
  getProductById,
  getAllProducts,
  saveChunking,
};
