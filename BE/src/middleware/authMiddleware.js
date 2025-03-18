const jwt = require("jsonwebtoken");
const securityConfig = require("../config/securityConfig");
const securityLogger = require("./securityLogger");

const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    securityLogger("Unauthorized access attempt!");
    return res.status(401).json({ error: "Không có token, quyền truy cập bị từ chối!" });
  }

  try {
    const decoded = jwt.verify(token, securityConfig.jwt.secret);
    req.user = decoded;  // Gán thông tin user từ JWT vào req.user
    next();
  } catch (error) {
    securityLogger("Invalid token detected!");
    res.status(403).json({ error: "Token không hợp lệ!" });
  }
};

module.exports = authenticateUser;
