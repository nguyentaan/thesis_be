const User = require("../../models/user");

const bcrypt = require("bcrypt");
const { GenerateAccessToken, GenerateRefreshToken } = require("../jwt");

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;

    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "User is not exist",
        });
      }
      const comparePassword = bcrypt.compareSync(password, checkUser.password);
      if (!comparePassword) {
        resolve({
          status: "ERR",
          message: "The password or user is incorrect",
        });
      }

      const access_token = await GenerateAccessToken({
        id: checkUser._id,
        isAdmin: checkUser.isAdmin,
      });

      const refresh_token = await GenerateRefreshToken({
        id: checkUser._id,
        email: checkUser.email,
        isAdmin: checkUser.isAdmin,
      });

      resolve({
        status: "OK",
        message: "LOGIN SUCCESS",
        data: checkUser,
        access_token,
        refresh_token,
      });
    } catch (e) {
      return {
        status: "ERR",
        message: e.message || "An error occurred",
      };
    }
  });
};


module.exports = {
  loginUser: loginUser,
};