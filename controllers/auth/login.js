const User = require("../../models/user");
const AuthService = require("../../services/auth/login");
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(CLIENT_ID);

const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
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
    const { refresh_token, ...newReponse } = response;
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
    console.error("Error logging:", e);
    console.error("Stack trace:", e.stack);

    return res.status(404).json({
      message: e,
      details: e.message,
    });
  }
};

const google_signin = async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID,
    });
    const { name, email, picture } = ticket.getPayload();
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        password: "",
        avatar: picture,
      });
      await user.save();
    }
    res.status(200).json({
      status: "OK",
      message: "Login successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error logging in with Google:", error);
    return res.status(500).json({
      status: "ERR",
      message: "An error occurred during Google sign-in",
    });
  }
};

module.exports = {
  Login: Login,
  GoogleSignIn: google_signin,
};
