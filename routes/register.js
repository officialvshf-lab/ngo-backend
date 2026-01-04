const express = require("express");
const multer = require("multer");
const path = require("path");
const Member = require("../models/Member");

const router = express.Router();

/* ======================================================
   MULTER CONFIGURATION
====================================================== */

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "photo") {
      cb(null, "uploads/photos");
    } else if (file.fieldname === "idProof") {
      cb(null, "uploads/idproofs");
    } else if (file.fieldname === "paymentScreenshot") {
      cb(null, "uploads/payments");
    } else {
      cb(new Error("Invalid file field"), null);
    }
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  }
});

// File filter (images + pdf)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = [
//     "image/jpeg",
//     "image/png",
//     "image/jpg",
//     "application/pdf"
//   ];

//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type"), false);
//   }
// };


const fileFilter = (req, file, cb) => {
  // allow images + pdf
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images (jpg, png, webp) or PDF allowed."
      ),
      false
    );
  }
};


const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

/* ======================================================
   REGISTER API
====================================================== */

router.post(
  "/",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
    { name: "paymentScreenshot", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      /* ========= REQUIRED FILE CHECK ========= */
      if (
        !req.files ||
        !req.files.photo ||
        !req.files.idProof ||
        !req.files.paymentScreenshot
      ) {
        return res.status(400).json({
          success: false,
          message: "Photo, ID Proof and Payment Screenshot are required"
        });
      }

      /* ========= CREATE MEMBER ========= */
      const member = new Member({
        fullName: req.body.fullName,
        fatherName: req.body.fatherName,
        dob: req.body.dob,
        gender: req.body.gender,
        mobile: req.body.mobile,
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        pincode: req.body.pincode,
        state: req.body.state,
        membershipType: req.body.membershipType,
        amount: req.body.amount,

        // ✅ IMPORTANT: SAVE FULL RELATIVE PATH
        photo: `/uploads/photos/${req.files.photo[0].filename}`,
        idProof: `/uploads/idproofs/${req.files.idProof[0].filename}`,
        paymentScreenshot: `/uploads/payments/${req.files.paymentScreenshot[0].filename}`,

        paymentStatus: "pending"
      });

      await member.save();

      return res.status(201).json({
        success: true,
        message: "Registration successful. Payment pending verification."
      });

    } catch (error) {
      console.error("Register Error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error during registration"
      });
    }
  }
);

module.exports = router;
