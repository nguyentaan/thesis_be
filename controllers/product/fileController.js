const FileUpload = require("../../models/upload_file");

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
    const fileUploads = await FileUpload.find()
    // Send the response
    res.json({
      fileUploads, // The current page products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUploadFileById,
  getAllUploadFile,
};