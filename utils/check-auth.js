const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/config");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
          return res.status(401).json({
            resultcode: 1,
            message: "Invalid/Expired token",
          });
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json({
        resultcode: 1,
        message: "Authentication token must be Bearer [token]",
      });
    }
  } else {
    return res.status(403).json({
      resultcode: 1,
      message: "Authorization header must be provided",
    });
  }
};
