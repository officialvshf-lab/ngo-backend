const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema(
  {
    /* ================= BASIC DETAILS ================= */
    fullName: {
      type: String,
      required: true,
      trim: true
    },

    fatherName: {
      type: String,
      required: true,
      trim: true
    },

    dob: {
      type: Date,
      required: true
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true
    },

    /* ================= CONTACT DETAILS ================= */
    mobile: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, "Invalid mobile number"],
      index: true
    },

    email: {
      type: String,
      required: true,
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
        "General Member",
        "District Member",
        "State Member",
        "National Member"
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
      required: true
    },

    idProof: {
      type: String,
      required: true
    },

    /* ================= PAYMENT ================= */
    paymentId: {
      type: String,
      required: true,
      index: true
    },

    paymentStatus: {
      type: String,
      enum: ["PAID"],
      default: "PAID",
      index: true
    },

    paymentMode: {
      type: String,
      default: "RAZORPAY"
    },

    paymentNote: {
      type: String,
      default: "Registration fee is non-refundable"
    },

    /* ================= SYSTEM ================= */
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
      type: String,
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Member", MemberSchema);
