const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");

const Member = require("../models/Member");
const generateIdCard = require("../utils/generateIdCard");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

/* ======================================================
   INLINE ADMIN AUTH (NO MIDDLEWARE FOLDER)
====================================================== */
const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* ======================================================
   GET MEMBERS (pending / approved / rejected / all)
====================================================== */
router.get("/members", adminAuth, async (req, res) => {
  try {
    const status = req.query.status;
    const query = status ? { paymentStatus: status } : {};

    const members = await Member.find(query).sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch members" });
  }
});

/* ======================================================
   APPROVE → AUTO ID CARD → AUTO EMAIL
====================================================== */
router.post("/approve/:id", adminAuth, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    /* ===== Generate ID Card ===== */
    const idCardPath = await generateIdCard(member);

    /* ===== Update Member ===== */
    member.paymentStatus = "approved";
    member.idCardPath = idCardPath;
    await member.save();

    /* ===== Send Email to Member ===== */
    try {
      await sendEmail({
        to: member.email,
        subject: "Membership Approved – Vishwa Sanatan Hindu Foundation",
        html: `
          <h2>Congratulations ${member.fullName} 🎉</h2>
          <p>Your membership has been <b>approved</b>.</p>
          <p><b>Membership Type:</b> ${member.membershipType}</p>
          <p><b>Amount:</b> ₹${member.amount}</p>
          <p>Your ID Card is attached with this email.</p>
          <br />
          <p>Regards,<br/>
          <b>Vishwa Sanatan Hindu Foundation</b></p>
        `,
        attachments: [
          {
            filename: "ID-Card.png",
            path: path.join(
              __dirname,
              "..",
              member.idCardPath.replace("/uploads", "uploads")
            )
          }
        ]
      });
    } catch (mailErr) {
      console.error("❌ Email failed:", mailErr.message);
      // Email fail hone par bhi approval nahi rokenge
    }

    res.json({
      success: true,
      message: "Member approved, ID card generated & email sent"
    });

  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ message: "Approval failed" });
  }
});

/* ======================================================
   REJECT MEMBER
====================================================== */
router.post("/reject/:id", adminAuth, async (req, res) => {
  try {
    await Member.findByIdAndUpdate(req.params.id, {
      paymentStatus: "rejected"
    });

    res.json({ success: true, message: "Member rejected" });
  } catch (err) {
    res.status(500).json({ message: "Reject failed" });
  }
});

module.exports = router;
