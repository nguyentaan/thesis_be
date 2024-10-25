const jwt = require('jsonwebtoken')
const dotenv = require("dotenv");
dotenv.config();

const authCheckToken =  (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
            console.error(err.toString());
            return res.status(401).json({"error": true, "message": 'Unauthorized access.', err });
        }
        console.log(`decoded>>${decoded}`);
        req.decoded = decoded;
        next();
    });
  } else {
    return res.status(403).send({
        "error": true,
        "message": 'No token provided.'
    });
  }
}

module.exports = {
  authCheckToken: authCheckToken,
};
