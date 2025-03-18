module.exports = {
    port: process.env.PORT || 5000,
    corsOptions: {
      origin: ["http://localhost:8080", "https://yourfrontend.com"], // Chỉ cho phép frontend từ http://localhost:8080 (khi dev) và https://yourfrontend.com (khi deploy) truy cập API
      methods: ["GET", "POST", "PUT", "PATCH"],
      credentials: true
    },
    rateLimit: { // ANTI DDOS
      windowMs: 15 * 60 * 1000, // 15 phút
      max: 100 // Giới hạn 100 request mỗi 15 phút
    }
  };
  