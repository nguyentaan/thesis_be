const Product = require("../../models/product");
const ProductService = require("../../services/product");

// Get Product by ID
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

// Get All Products with Pagination
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 20; // Default to 20 items per page
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .select("-reviews") // Exclude reviews array for performance optimization
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments();

    res.json({
      products,
      total: totalProducts,
      page,
      limit,
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
