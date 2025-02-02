const Product = require("../../models/product");
const ProductService = require("../../services/product");
const FileUpload = require("../../models/upload_file");
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
    // Extract page, limit, and search query from query parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 20; // Default to 20 if not provided
    const search = req.query.search || ""; // Default to an empty string if not provided

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Build a search filter (case-insensitive)
    const searchFilter = {
      ...search ? { name: { $regex: search, $options: "i" } } : {}, // Match name field with case-insensitive regex
      image_url: { $ne: "https://example.com/default_image.png", $ne: "" }, // Exclude default and empty image URLs
    };

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

const deleteProductById = async (req, res) => {
  try {
    const product_id = await Product.deleteOne(req.body.product_id);
    if (product_id) {
      res.status(200).json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, category, color, description, total_stock, price, image_url } = req.body;

    if (!name || !category || !color || !description || !price || !image_url) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let stock = Number(total_stock);
    if (isNaN(stock) || stock < 0) {
      stock = 0;
    }

    const product_code = await ProductService.generateProductCode();
    const product_id = await ProductService.generateProductId();

    // Create the new product
    const product = new Product({
      product_code,
      product_id,
      name,
      category,
      color,
      description,
      total_stock: stock,
      price,
      image_url,
    });

    const newProduct = await product.save();

    // Check if "Chưa phân loại" file upload exists
    let fileUpload = await FileUpload.findOne({ file_name: "Chưa phân loại" });

    if (fileUpload) {
      // Append the new product_id to chunk_lists
      fileUpload.chunk_lists.push(newProduct._id);
      fileUpload.update_date = new Date();
      await fileUpload.save();
    } else {
      // Create a new "Chưa phân loại" file upload with this product
      await FileUpload.create({
        file_name: "Chưa phân loại",
        file_type: "product",
        create_date: new Date(),
        update_date: new Date(),
        chunk_lists: [newProduct._id],
      });
    }

    res.status(200).json(newProduct);
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


const updateProductById = async (req, res) => {
  try {
    const { product_id, update_data } = req.body;
    console.log("update_data", update_data);
    let product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({
        status: "ERR",
        message: "Product not found",
      });
    }
    if (update_data) {
      Object.keys(update_data).forEach((key) => {
        if (update_data[key] !== null && update_data[key] !== "") {
          product[key] = update_data[key];
        }
      });
      await product.save();
    }
    return res.status(200).json({
      status: "OK",
      message: "Product information updated successfully",
      data: product,
    });
  } catch (e) {
    console.error("Error updating product profile:", e);
    return res.status(500).json({
      status: "ERR",
      message: "An error occurred while updating the product profile",
      details: e.message,
    });
  }
};


module.exports = {
  getProductById,
  getAllProducts,
  saveChunking,
  deleteProductById,
  createProduct,
  updateProductById,
};
