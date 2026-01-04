const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema(
  {
    /* ================= BASIC DETAILS ================= */
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true
    },

    fatherName: {
      type: String,
      required: [true, "Father/Spouse name is required"],
      trim: true
    },

    dob: {
      type: Date,
      required: [true, "Date of birth is required"]
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true
    },

    /* ================= CONTACT DETAILS ================= */
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^[6-9]\d{9}$/, "Invalid mobile number"],
      index: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"]
    },

    address: {
      type: String,
      required: true
    },

    city: {
      type: String,
      required: true
    },

    pincode: {
      type: String,
      required: true,
      match: [/^\d{6}$/, "Invalid pincode"]
    },

    state: {
      type: String,
      required: true
    },

    /* ================= MEMBERSHIP ================= */
    membershipType: {
      type: String,
      required: true,
      enum: [
        "District President",
        "State Member",
        "General Member"
      ]
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    /* ================= FILES ================= */
    photo: {
      type: String,
      required: [true, "Photo is required"]
    },

    idProof: {
      type: String,
      required: [true, "ID Proof is required"]
    },

    paymentScreenshot: {
      type: String,
      required: [true, "Payment screenshot is required"]
    },

    /* ================= PAYMENT STATUS ================= */
    paymentStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true
    },

    paymentVerifiedBy: {
      type: String,
      default: null
    },

    paymentVerifiedAt: {
      type: Date,
      default: null
    },

    /* ================= AUTO GENERATED ================= */
    memberId: {
      type: String,
      unique: true,
      sparse: true
    },

    idCardGenerated: {
      type: Boolean,
      default: false
    },

    donationReceiptGenerated: {
      type: Boolean,
      default: false
    },
idCardPath: {
  type: String
},
    /* ================= SYSTEM ================= */
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true // createdAt & updatedAt auto
  }
);

module.exports = mongoose.model("Member", MemberSchema);
