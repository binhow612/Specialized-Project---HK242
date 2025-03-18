// Ghi lại tất cả request đến server (để debug, theo dõi hoạt động API).
// Hữu ích khi muốn biết user nào truy cập API nào.

const logger = require("../config/logConfig");

const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
};

module.exports = requestLogger;
