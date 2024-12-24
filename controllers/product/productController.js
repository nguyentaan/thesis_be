const Product = require("../../models/product");
const ProductService = require("../../services/product");

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

    // Fetch the products with pagination (no field is excluded)
    const products = await Product.find()
      .select({ "description._id": 0 }) // Exclude `_id` in description
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

const saveChunking = async (req, res) => {
  try {
    const jsonChunkingData = req.body.chunking_list;
    const file_name = req.body.file_name;
    const file_type = req.body.file_type;
    const results = await ProductService.createFileAndChunkListProduct(jsonChunkingData, file_name[0], file_type);
    return res.status(200).json({
      status: "success",
      message: "Chunking data received successfully",
      data: results,
    });
  } catch (e) {
    console.error("Error in startChunking:", e);
    console.error('Stack trace:', e.stack);
    return res.status(500).json({
      status: "fail",
      message: e.message,
    });
  }
};


module.exports = {
  getProductById,
  getAllProduct,
  saveChunking
};