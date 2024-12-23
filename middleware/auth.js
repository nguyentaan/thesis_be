const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authUserMiddleware = (req, res, next) => {
  const tokenHeader = req.headers.authorization;

  if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication failed: Missing or invalid token",
      status: "ERROR",
    });
  }

  // Extract the token
  const token = tokenHeader.split(" ")[1];

  jwt.verify(token, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) {
      return res.status(401).json({
        message: "Authentication failed: Token verification failed",
        status: "ERROR",
      });
    }

    if (user?.isAdmin === true || user?.isAdmin === false) {
      next();
    } else {
      return res.status(403).json({
        message: "Unauthorized: Insufficient permissions",
        status: "ERROR",
      });
    }
  });
};

const authAdminMiddleware = (req, res, next) => {
  const tokenHeader = req.headers.authorization;

  if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication failed: Missing or invalid token",
      status: "ERROR",
    });
  }

  // Extract the token
  const token = tokenHeader.split(" ")[1];

  jwt.verify(token, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) {
      return res.status(401).json({
        message: "Authentication failed: Token verification failed",
        status: "ERROR",
      });
    }

    if (user?.isAdmin === true) {
      next();
    } else {
      return res.status(403).json({
        message: "Unauthorized: Admin access only",
        status: "ERROR",
      });
    }
  });
};

module.exports = {
  authUserMiddleware,
  authAdminMiddleware,
};
