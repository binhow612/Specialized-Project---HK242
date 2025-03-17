const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Lấy thông tin người dùng
router.get("/:id", async (req, res) => {
  try {
    const [user] = await pool.execute("SELECT * FROM User WHERE id = ?", [req.params.id]);
    res.status(200).json(user[0]);
  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
});

module.exports = router;

// Cập nhật thông tin người dùng
router.patch("/:id", async (req, res) => {
  try {
    const fields = req.body;
    
    // Nếu không có trường nào được gửi, trả về lỗi
    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ error: "No data provided for update" });
    }

    // Tạo dynamic query
    const updates = [];
    const values = [];
    
    for (const [key, value] of Object.entries(fields)) {
      updates.push(`${key} = ?`);
      values.push(value);
    }

    values.push(req.params.id); // Thêm id vào cuối để cho WHERE

    const sql = `UPDATE User SET ${updates.join(", ")} WHERE id = ?`;

    await pool.execute(sql, values);
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
});


// Xóa người dùng
// router.delete("/:id", async (req, res) => {
//   try {
//     await pool.execute("DELETE FROM User WHERE id = ?", [req.params.id]);
//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: `${error}` });
//   }
// });


// Admin lấy danh sách toàn bộ người dùng
router.get("/", async (req, res) => {
  try {
    const [users] = await pool.execute("SELECT * FROM User");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
});
