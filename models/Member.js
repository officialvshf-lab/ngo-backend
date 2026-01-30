const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema(
  {
    /* ================= BASIC DETAILS ================= */
    fullName: { type: String, required: true, trim: true },
    fatherName: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true
    },

    /* ================= CONTACT ================= */
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
      trim: true
    },

    address: String,
    city: String,
    pincode: String,
    state: String,

    /* ================= MEMBERSHIP ================= */
    membershipType: {
      type: String,
      enum: [
        "General Member",
        "District Member",
        "State Member",
        "National Member"
      ],
      required: true
    },

    amount: { type: Number, required: true },

    /* ================= FILES ================= */
    photo: { type: String, required: true },
    idProof: { type: String, required: true },

    /* ================= PAYMENT ================= */
    paymentId: {
      type: String,
      required: true,
      index: true
    },

    paymentMode: {
      type: String,
      default: "RAZORPAY"
    },

    paymentVerified: {
      type: Boolean,
      default: true
    },

    /* ================= ADMIN APPROVAL ================= */
    approvalStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true
    },

    approvalNote: {
      type: String,
      default: "Pending admin verification"
    },

    approvedAt: {
      type: Date,
      default: null
    },

    approvedBy: {
      type: String,
      default: null
    },

    /* ================= DOCUMENTS ================= */
    idCardGenerated: {
      type: Boolean,
      default: false
    },

    idCardPath: {
      type: String,
      default: null
    },

    nyuktiPatraPath: {
      type: String,
      default: null
    },

    /* ================= SYSTEM ================= */
    memberId: {
      type: String,
      unique: true,
      sparse: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", MemberSchema);
