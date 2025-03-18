// import thư viện
const express = require('express');
const cors = require("cors");

// import các Config/Middleware file
const serverConfig = require("./src/config/serverConfig");
const envConfig = require("./src/config/envConfig");
const authenticateUser = require("./src/middleware/authMiddleware");
const errorHandler = require("./src/middleware/errorMiddleware");
const requestLogger = require("./src/middleware/loggingMiddleware");
const securityLogger = require("./src/middleware/securityLogger");
const eventLogger = require("./src/middleware/eventLogger");

// lấy các biến cần sử dụng
const app = express();
const port = envConfig.server.port;
const hostname = envConfig.server.hostname;

// thêm các middleware cần thiết
app.use(express.json());
app.use(cors(serverConfig.corsOptions)); // Cấu hình CORS
app.use(express.json()); // Hỗ trợ JSON payload
app.use(requestLogger); // Ghi log request
app.use(authenticateUser); // Xác thực JWT cho các route cần bảo mật


// Import các route
const userRoutes = require("./src/presentation/routes/userRoutes");
const carRoutes = require("./src/presentation/routes/carRoutes");
const authRoutes = require("./src/presentation/routes/authRoutes");

// Import các API
app.use("/api/users", userRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/auth", authRoutes);

// Middleware xử lý lỗi
app.use(errorHandler);

app.listen(port, hostname, () => {
  eventLogger(`Server is listening at http://${hostname}:${port}`);
  console.log(`Server is listening at http://${hostname}:${port}`);
});