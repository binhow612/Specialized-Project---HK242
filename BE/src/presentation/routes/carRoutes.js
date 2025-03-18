const express = require("express");
const pool = require("../../persistence/database/connection");
const eventLogger = require("../../middleware/eventLogger")
const router = express.Router();

// Lấy danh sách xe theo trạng thái (đã bán/đang bán)
router.get("/:status?", async (req, res) => {
  try {
    let { status } = req.params;
    if (!status)
      status = 'Available';

    const isDeleted = 0;
    const query = `
    SELECT 
        l.*, 
        u.first_name, u.last_name, u.email, u.phoneNumber,
        c.brand, c.model, c.year, c.transmission, c.driveSystem, c.price, c.mileage, c.origin
    FROM 
        ListingDetail AS l
    INNER JOIN 
        User AS u ON l.userId = u.id
    INNER JOIN 
        CarDetail AS c ON l.carId = c.id
    WHERE 
        l.status = ? AND u.isDeleted = ?;
    `;

    const [cars] = await pool.execute(query, [status, isDeleted]);
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
});


// Lấy thông tin xe = id của ListingDetail
router.get("/car/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;
    // console.log(id);
    const isDeleted = 0;
    const query = `
    SELECT 
        l.*, 
        u.first_name, u.last_name, u.email, u.phoneNumber,
        c.brand, c.model, c.year, c.transmission, c.driveSystem, c.price, c.mileage, c.origin
    FROM 
        ListingDetail AS l
    INNER JOIN 
        User AS u ON l.userId = u.id
    INNER JOIN 
        CarDetail AS c ON l.carId = c.id
    WHERE 
        l.id = ? AND u.isDeleted = ?;
    `;
    const [car] = await pool.execute(query, [listingId, isDeleted]);
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({error: `${error}`});
  }
});


// Sửa thông tin về CarDetail (trong bảng CarDetail)
router.patch("/:carId", async (req, res) => {
  const { carId } = req.params;
  const fields = req.body;

  if (!Object.keys(fields).length) {
      return res.status(400).json({ error: 'No data provided for update' });
  }
  try {
    const updates = [];
        const values = [];
        for (const [key, value] of Object.entries(fields)) {
            updates.push(`${key} = ?`);
            values.push(value);
        }
        values.push(carId);

        const sql = `UPDATE CarDetail SET ${updates.join(', ')} WHERE id = ?`;
        await pool.execute(sql, values);

        res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({error: `${error}`});
  }
});


// Đăng tin xe mới
router.post("/", async (req, res) => {
  try {
    const { sellerId, brand, model, year, price, mileage, description } = req.body;

    const [result] = await pool.execute(
      "INSERT INTO CarDetail (sellerId, brand, model, year, price, mileage, description) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [sellerId, brand, model, year, price, mileage, description]
    );

    res.status(201).json({ message: "Đăng tin thành công", carId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
});

module.exports = router;
