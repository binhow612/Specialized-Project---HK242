const express = require("express");
const router = express.Router();
const pool = require("../../persistence/database/connection");

// Lấy thông tin người dùng
router.get("/profile/:id", async (req, res) => {
  try {
    const { userId, role } = req.user;
    const requestedId = req.params.id;

    if (role === 'Admin' || userId === parseInt(requestedId)) {
      const [user] = await pool.execute("SELECT * FROM User WHERE id = ?", [requestedId]);
      return res.status(200).json(user[0]);
    }

    return res.status(403).json({ error: "Bạn không có quyền truy cập thông tin này" });

  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
});

module.exports = router;

// Cập nhật thông tin người dùng
router.patch("/profile/:id", async (req, res) => {
  try {
    const { userId , role } = req.user;
    const requestId = req.params.id;
    if (role === 'Admin' || userId === parseInt(requestId)) {
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

      values.push(requestId); // Thêm id vào cuối để cho WHERE

      const sql = `UPDATE User SET ${updates.join(", ")} WHERE id = ?`;

      await pool.execute(sql, values);
      return res.status(200).json({ message: "User updated successfully" });
      }

    return res.status(403).json({ error: "Bạn không có quyền chỉnh sửa thông tin này" })

  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
});


// Xóa người dùng
router.patch("/delete/:id", async (req, res) => {
  try {
    const { role } = req.user;
    if (role === 'Admin') {
      await pool.execute("UPDATE User SET isDeleted = 1 WHERE id = ?", [req.params.id]);
      return res.status(200).json({ message: "User deleted successfully" });
    }

    return res.status(403).json({ error: "Bạn không có quyền chỉnh sửa thông tin này" })
  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
});


// Admin lấy danh sách toàn bộ người dùng
router.get("/", async (req, res) => {
  try {
    const { role } = req.user;
    if (role === 'Admin') {
      const [users] = await pool.execute("SELECT * FROM User");
      return res.status(200).json(users);
    }

    return res.status(403).json({ error: "Bạn không có quyền truy cập thông tin này" });
    
  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
});
