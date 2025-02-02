const User = require("../../models/user");
const Product = require("../../models/product");
const FileUpload = require("../../models/upload_file");
const Order = require("../../models/Order");

const DashboardData = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const fileUploadCount = await FileUpload.countDocuments({ file_name: { $ne: "Chưa phân loại" } });
    const orderCount = await Order.countDocuments();
    const embeddedProducts = await Product.countDocuments({ embedding: { $ne: null } });
    const uncategorizedFile = await FileUpload.findOne({ file_name: "Chưa phân loại" }, "chunk_lists");
    const uncategorizedProducts = uncategorizedFile ? uncategorizedFile.chunk_lists.length : 0;
    return res.status(200).json({
      status: "OK",
      message: "Fetching data dashboard successfully.",
      data: {
        userCount,
        productCount,
        fileUploadCount,
        orderCount,
        embeddedProducts,
        uncategorizedProducts
      }
    });
  } catch (e) {
    console.error("Error fetching dashboard data:", e);
    return res.status(500).json({
      status: "ERR",
      message: "An error occurred during DashboardData",
    });
  }
};

module.exports = {
  DashboardData,
};
