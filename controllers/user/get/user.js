const User = require("../../../models/user"); // Assuming the User model is imported

const getAllUser = async (req, res) => {
  try {
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

const getOneUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id)
      .select("-password")
      .populate("order_lists");
    
    if (!user) {
      return res.status(404).json({
        status: "ERROR",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "SUCCESS",
      data: user,
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
  getOneUser,
};
