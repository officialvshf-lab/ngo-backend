const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

/* ================= ADMIN LOGIN ================= */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // 🔐 Hardcoded admin credentials (safe for now)
  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      message: "Invalid admin credentials"
    });
  }

  // 🔑 Generate JWT token
  const token = jwt.sign(
    { role: "admin", email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    success: true,
    token
  });
});

module.exports = router;
