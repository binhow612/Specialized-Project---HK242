// securityLogger.js - Ghi log các sự kiện bảo mật


const logger = require("../config/logConfig");

const securityLogger = (message) => {
  logger.warn(`SECURITY WARNING: ${message}`);
};

module.exports = securityLogger;