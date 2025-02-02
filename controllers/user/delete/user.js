const User = require("../../../models/user"); // Assuming the User model is imported

const deleteUserById = async (req, res) => {
  const id  = req.body.user_id;
  try {
    const user = await User.findByIdAndDelete(id);
    if (user) {
      res.status(200).json({
        status: "SUCCESS",
        message: "User deleted successfully",
      });
    } else {
      res.status(404).json({
        status: "ERROR",
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

module.exports = {
  deleteUserById,
};
