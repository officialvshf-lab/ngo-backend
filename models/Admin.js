const express = require("express");
const jwt = require("jsonwebtoken");
const Member = require("../models/Member");

const router = express.Router();

/* ================= INLINE ADMIN AUTH ================= */
const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* ================= GET PENDING MEMBERS ================= */
router.get("/members", adminAuth, async (req, res) => {
  const members = await Member.find({ paymentStatus: "pending" })
    .sort({ createdAt: -1 });

  res.json(members);
});

/* ================= APPROVE MEMBER ================= */
router.post("/approve/:id", adminAuth, async (req, res) => {
  await Member.findByIdAndUpdate(req.params.id, {
    paymentStatus: "approved"
  });

  res.json({ message: "Member approved" });
});

/* ================= REJECT MEMBER ================= */
router.post("/reject/:id", adminAuth, async (req, res) => {
  await Member.findByIdAndUpdate(req.params.id, {
    paymentStatus: "rejected"
  });

  res.json({ message: "Member rejected" });
});

module.exports = router;
