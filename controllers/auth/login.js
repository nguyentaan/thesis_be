const AuthService = require("../../services/auth/login");
const admin = require("../../services/auth/firebaseAdmin");
const User = require("../../models/user");
const OTPService = require("../../services/otp");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);

    if (!email || !password) {
      return res.status(400).json({
        status: "ERR",
        message: "Email and password are required",
      });
    } else if (!isCheckEmail) {
      return res.status(400).json({
        status: "ERR",
        message: "Please provide a valid email",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "ERR",
        message: "User not found. Please register first.",
      });
    }

    // Generate OTP and send via email
    const otp = OTPService.generateOTP();
    OTPService.storeOTP(email, otp);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your sign-in",
      text: `Your OTP code is: ${otp}`,
    });

    return res.status(200).json({
      status: "OK",
      message: "OTP sent to email. Please verify to complete login.",
    });
  } catch (e) {
    console.error('Error logging in:', e);
    return res.status(500).json({
      status: "ERR",
      message: "An error occurred during login",
    });
  }
};

const verifyOTP = async (req, res) => {
  const { email, password, otp } = req.body;
  try {
    console.log("Run verification");
    
    // Verify the OTP using the OTPService
    const { success, message } = await OTPService.verifyOTP(email, otp);
    
    // Check if OTP verification was successful
    if (!success) {
      return res.status(401).json({
        status: "ERR",
        message: message,
      });
    }

    console.log("Run Login");
    
    // Proceed with the login process
    const response = await AuthService.loginUser({ email, password });
    const { refresh_token, ...newResponse } = response;

    console.log("Run Return Tokens");
    
    // Set the refresh token in the cookie
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false, // Change to true if using HTTPS
      sameSite: "strict",
      path: "/",
    });

    // Return the response with user data and refresh token
    return res.status(200).json({
      ...newResponse,
      refresh_token,
    });

  } catch (e) {
    console.error('Error verifying OTP:', e);
    return res.status(500).json({
      status: "ERR",
      message: "An error occurred during OTP verification",
    });
  }
};

const google_Signing = async (req, res) => {
  const { token } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email, name, picture } = decodedToken;
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
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
    console.error('Error logging in with Google:', error);
    return res.status(500).json({
      status: "ERR",
      message: "An error occurred during Google sign-in",
    });
  }
};

module.exports = {
  Login: Login,
  GoogleSignIn: google_Signing,
  VerifyOTP: verifyOTP,
};
