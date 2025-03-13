const dotenv = require('dotenv');
const cors = require("cors");
const express = require('express')

dotenv.config();

const app = express()
const port = process.env.PORT || 3000

// thêm các middleware cần thiết
app.use(express.json());
app.use(cors());

// Import các route
const userRoutes = require("./src/routes/userRoutes");
const carRoutes = require("./src/routes/carRoutes");
const authRoutes = require("./src/routes/authRoutes");

// Import các API
app.use("/api/users", userRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});