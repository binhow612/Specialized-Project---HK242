require("dotenv").config();

module.exports = {
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  },
  server: {
    hostname: process.env.HOSTNAME,
    port: process.env.PORT || 3000
  }
};