const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// Lấy danh sách xe
router.get("/", async (req, res) => {
  try {
    const [cars] = await pool.execute("SELECT * FROM cars");
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Đăng tin xe mới
router.post("/", async (req, res) => {
  try {
    const { sellerId, brand, model, year, price, mileage, description } = req.body;

    const [result] = await pool.execute(
      "INSERT INTO cars (sellerId, brand, model, year, price, mileage, description) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [sellerId, brand, model, year, price, mileage, description]
    );

    res.status(201).json({ message: "Đăng tin thành công", carId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;
