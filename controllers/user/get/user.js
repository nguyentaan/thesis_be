const User = require("../../../models/user"); // Assuming the User model is imported

const getAllUser = async (req, res) => {
  try {
    // if (orderListLength !== undefined) {
    //   filter["$order_lists"] = { $gte: [{ $size: "$order_lists" }, orderListLength] }; 
    // }

    // Query the database with the constructed filter
    const users = await User.find()
      .select("-password") // Exclude password from the result
      .populate("order_lists"); // Populate order_lists if they reference another model

    res.status(200).json({
      status: "SUCCESS",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

module.exports = {
  getAllUser,
};
