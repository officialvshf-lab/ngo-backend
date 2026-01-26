const express = require("express");
const jwt = require("jsonwebtoken");
const Member = require("../models/Member");
const processAfterApproval = require("../utils/processAfterApproval");

const router = express.Router();

/* ================= ADMIN AUTH ================= */
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

/* ======================================================
   GET MEMBERS (PENDING / APPROVED / REJECTED / ALL)
====================================================== */
router.get("/members", adminAuth, async (req, res) => {
  try {
    const status = req.query.status;

    // ✅ IMPORTANT FIX: approvalStatus + UPPERCASE
    const query = status
      ? { approvalStatus: status.toUpperCase() }
      : {};

    const members = await Member.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      members
    });
  } catch (err) {
    console.error("Admin members error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   APPROVE MEMBER
====================================================== */
router.post("/approve/:id", adminAuth, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // ✅ UPDATE STATUS
    member.approvalStatus = "APPROVED";
    member.approvedAt = new Date();
    member.approvedBy = "ADMIN";
    await member.save();

    // 🔥 BACKGROUND TASK (ID CARD + EMAIL)
    processAfterApproval(member).catch((err) =>
      console.error("Background process error:", err)
    );

    res.json({
      success: true,
      message: "Member approved successfully"
    });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   REJECT MEMBER
====================================================== */
router.post("/reject/:id", adminAuth, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    member.approvalStatus = "REJECTED";
    member.approvedAt = new Date();
    member.approvedBy = "ADMIN";
    await member.save();

    res.json({
      success: true,
      message: "Member rejected"
    });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
