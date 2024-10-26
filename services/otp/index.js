// services/auth/otpService.js
const NodeCache = require("node-cache");

const otpCache = new NodeCache({ stdTTL: 300 });

const MAX_ATTEMPTS = 5;

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const storeOTP = (email, otp) => {
  otpCache.set(email, { otp, attempts: 0 });
};

const verifyOTP = (email, otp) => {
  const storedData = otpCache.get(email);
  if (!storedData) {
    return {
      success: false,
      message: "OTP has expired or does not exist.",
    };
  }

  storedData.attempts += 1;

  if (storedData.attempts > MAX_ATTEMPTS) {
    return {
      success: false,
      message: "Maximum attempts exceeded. Please request a new OTP.",
    };
  }

  if (storedData.otp === otp) {
    otpCache.del(email);
    return {
      success: true,
      message: "OTP verified successfully.",
    };
  } else {
    return {
      success: false,
      message: `Incorrect OTP. You have ${MAX_ATTEMPTS - storedData.attempts} attempts left.`,
    };
  }
};

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
};
