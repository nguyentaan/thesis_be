const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const RefreshTokenModel = require("../../models/refresh_token"); // Adjust path as needed

dotenv.config();

const GenerateAccessToken = async (payload) => {
  const access_token = jwt.sign(
    {
      userId: payload.userId,
      ...payload,
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: process.env.TOKEN_LIFE }
  );

  return access_token;
};

const GenerateRefreshToken = async (payload) => {
  const refresh_token = jwt.sign(
    {
      userId: payload.userId,
      ...payload,
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: process.env.REFRESH_TOKEN_LIFE }
  );

  const expiresAt = new Date(
    Date.now() + parseInt(process.env.REFRESH_TOKEN_LIFE) * 1000
  );

  await RefreshTokenModel.create({
    userId: payload.id,
    token: refresh_token,
    expiresAt: expiresAt,
  });

  return refresh_token;
};

module.exports = {
  GenerateAccessToken,
  GenerateRefreshToken,
};
