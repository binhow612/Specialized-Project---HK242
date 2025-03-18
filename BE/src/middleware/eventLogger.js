// eventLogger.js - Ghi log các sự kiện quan trọng trong hệ thống


const eventLogger = (message) => {
    logger.info(`EVENT: ${message}`);
  };
  
  module.exports = eventLogger;