const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Lấy thông tin người dùng
router.get("/:id", async (req, res) => {
  try {
    const [user] = await pool.execute("SELECT * FROM users WHERE id = ?", [req.params.id]);
    res.status(200).json(user[0]);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;

// Cập nhật thông tin người dùng
router.put("/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    await pool.execute("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, req.params.id]);
    res.status(201).json({ message: "Cập nhật thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Xóa người dùng
router.delete("/:id", async (req, res) => {
  try {
    await pool.execute("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Admin lấy danh sách toàn bộ người dùng
router.get("/", async (req, res) => {
  try {
    const [users] = await pool.execute("SELECT * FROM users");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
});
