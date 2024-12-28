// services/auth/userService.js
const User = require("../../models/user");
const bcrypt = require("bcrypt");
const { GenerateAccessToken, GenerateRefreshToken } = require("../jwt");

const loginUser = async (userLogin) => {
  const { email, password } = userLogin;

  try {
    // Check if the user exists by email
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return {
        status: "ERR",
        message: "User does not exist",
      };
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = bcrypt.compareSync(password, checkUser.password);
    if (!isPasswordValid) {
      return {
        status: "ERR",
        message: "The password or user is incorrect",
      };
    }

    // Generate access and refresh tokens
    const access_token = await GenerateAccessToken({
      userId: checkUser._id,
      isAdmin: checkUser.isAdmin,
    });

    const refresh_token = await GenerateRefreshToken({
      userId: checkUser._id,
      email: checkUser.email,
      isAdmin: checkUser.isAdmin,
    });


    return {
      status: "OK",
      message: "LOGIN SUCCESS",
      data: checkUser,
      access_token,
      refresh_token,
    };

  } catch (e) {
    console.error("Error logging in user:", e);
    return {
      status: "ERR",
      message: e.message || "An error occurred",
    };
  }
};

module.exports = {
  loginUser,
};
