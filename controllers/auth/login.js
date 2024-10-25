const AuthService = require("../../services/auth/login");

const Login = async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!email || !password) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is email",
      });
    }
    const response = await AuthService.loginUser(req.body);
    const {
      refresh_token,
      ...newReponse
    } = response;
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });
    return res.status(200).json({
      ...newReponse,
      refresh_token,
    });
  } catch (e) {
    console.error('Error logging:', e);
    console.error('Stack trace:', e.stack);

    return res.status(404).json({
      message: e,
      details: e.message,
    });
  }
};

module.exports = {
  Login: Login,
};