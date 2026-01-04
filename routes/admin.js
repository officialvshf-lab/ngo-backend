const express = require("express");
const jwt = require("jsonwebtoken");
const Member = require("../models/Member");
const generateIdCard = require("../utils/generateIdCard");
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

/* ================= GET MEMBERS ================= */
router.get("/members", adminAuth, async (req, res) => {
  const status = req.query.status;
  const query = status ? { paymentStatus: status } : {};
  const members = await Member.find(query).sort({ createdAt: -1 });
  res.json(members);
});

/* ================= APPROVE MEMBER ================= */
// router.post("/approve/:id", adminAuth, async (req, res) => {
//   try {
//     const member = await Member.findById(req.params.id);
//     if (!member) return res.status(404).json({ message: "Member not found" });

//     // ✅ APPROVE FIRST
//     member.paymentStatus = "approved";
//     await member.save();

//     // ✅ GENERATE ID CARD (CLOUDINARY)
//     try {
//       const idCardUrl = await generateIdCard(member);
//       member.idCardPath = idCardUrl;
//       await member.save();
//       console.log("🪪 ID Card uploaded:", idCardUrl);
//     } catch (e) {
//       console.error("⚠️ ID Card failed:", e.message);
//     }

//     res.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });



router.post("/approve/:id", adminAuth, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // ✅ APPROVE IMMEDIATELY (FAST RESPONSE)
    member.paymentStatus = "approved";
    await member.save();

    // 🔥 BACKGROUND PROCESS (NO BLOCKING)
    processAfterApproval(member).catch(err => {
      console.error("Background approval error:", err);
    });

    // ✅ INSTANT RESPONSE TO ADMIN
    res.json({
      success: true,
      message: "Approved. ID card & email processing in background."
    });

  } catch (err) {
    console.error("Approve route error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



/* ================= REJECT ================= */
router.post("/reject/:id", adminAuth, async (req, res) => {
  await Member.findByIdAndUpdate(req.params.id, {
    paymentStatus: "rejected"
  });

  res.json({ success: true, message: "Member rejected" });
});

module.exports = router;
