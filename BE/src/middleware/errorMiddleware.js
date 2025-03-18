const logger = require("../config/logConfig");

const errorHandler = (err, req, res, next) => {
  logger.error(`ERROR: ${err.message} - ${req.method} ${req.originalUrl}`);
  res.status(err.status || 500).json({ error: err.message || "Lỗi máy chủ nội bộ!" });
};

module.exports = errorHandler;
