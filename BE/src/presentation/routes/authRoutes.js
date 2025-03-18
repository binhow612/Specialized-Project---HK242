const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../../persistence/database/connection");
const securityConfig = require("../../config/securityConfig");
const eventLogger = require("../../middleware/eventLogger");

const router = express.Router();

// Đăng ký
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password, phoneNumber, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, securityConfig.bcryptSaltRounds);

    await pool.execute(
      "INSERT INTO User (first_name, last_name, email, password, phoneNumber, role) VALUES (?, ?, ?, ?, ?, ?)",
      [first_name, last_name, email, hashedPassword, phoneNumber, role]
    );
    eventLogger(`New user registered: ${email}`);
    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await pool.execute("SELECT * FROM User WHERE email = ?", [email]);

    if (users.length === 0) return res.status(401).json({ error: "Email không tồn tại" });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ error: "Sai mật khẩu" });

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      securityConfig.jwt.secret, 
      { expiresIn: securityConfig.jwt.expiresIn }
    );
    eventLogger(`User logs in: ${user.id}`)
    res.status(200).json({ Token: token, userId: user.id, userRole: user.role });
  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
});

module.exports = router;
