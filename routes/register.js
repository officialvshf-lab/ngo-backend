const express = require("express");
const multer = require("multer");
const Member = require("../models/Member");
const cloudinary = require("../utils/cloudinary");

const router = express.Router();

/* ======================================================
   MULTER CONFIG (MEMORY STORAGE FOR CLOUDINARY)
====================================================== */

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
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
        !req.files?.photo ||
        !req.files?.idProof ||
        !req.files?.paymentScreenshot
      ) {
        return res.status(400).json({
          success: false,
          message: "Photo, ID Proof and Payment Screenshot are required"
        });
      }

      /* ========= DUPLICATE PROTECTION ========= */
      const existing = await Member.findOne({
        mobile: req.body.mobile
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "This mobile number is already registered"
        });
      }

      /* ========= CLOUDINARY UPLOAD HELPER ========= */
      const uploadToCloudinary = async (file, folder) => {
        return await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          {
            folder,
            resource_type: "auto"
          }
        );
      };

      /* ========= UPLOAD FILES ========= */
      const photoUpload = await uploadToCloudinary(
        req.files.photo[0],
        "ngo/photos"
      );

      const idProofUpload = await uploadToCloudinary(
        req.files.idProof[0],
        "ngo/idproofs"
      );

      const paymentUpload = await uploadToCloudinary(
        req.files.paymentScreenshot[0],
        "ngo/payments"
      );

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

        // ✅ CLOUDINARY URLs
        photo: photoUpload.secure_url,
        idProof: idProofUpload.secure_url,
        paymentScreenshot: paymentUpload.secure_url,

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
