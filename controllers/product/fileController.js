const FileUpload = require("../../models/upload_file");
const Product = require("../../models/product");

const getUploadFileById = async (req, res) => {
  try {
    const fileUpload = await FileUpload.findById(req.params.id);
    if (!fileUpload) {
      return res.status(404).json({ message: "fileUpload not found" });
    }
    res.json(fileUpload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getAllUploadFile = async (req, res) => {
  try {
    // Fetch the products with pagination (no field is excluded)
    const fileUploads = await FileUpload.find();
    // Send the response
    res.json({
      fileUploads, // The current page products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllChunklistFromSelectedFiles = async (req, res) => {
  const input = req.body.payload;
  console.log("Input:", input);
  try {
    if (!Array.isArray(input)) {
      return res.status(400).json({ message: "Input must be an array." });
    }
    // Process the input to fetch products
    const result = await Promise.all(
      input.map(async (group) => {
        const { type, chunk_list } = group;
        console.log("Type:.....", type);
        console.log("Chunk_list:....", chunk_list);
        // Find produCts with the given chunk_list
        const products = await Product.find({ _id: { $in: chunk_list } });
        return {
          type,
          products,
        };
      })
    );
    console.log("Result:", result);
    // Send the response
    res.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUploadFileById,
  getAllUploadFile,
  getAllChunklistFromSelectedFiles
};