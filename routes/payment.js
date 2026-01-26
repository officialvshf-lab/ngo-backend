const express = require("express");
const crypto = require("crypto");
const razorpay = require("../utils/razorpay");
const Payment = require("../models/Payment"); // ✅ ADD

const router = express.Router();

router.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR"
  });

  res.json(order);
});

router.post("/verify", async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount
  } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expected === razorpay_signature) {

    // ✅ PAYMENT SAVE
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      amount,
      status: "SUCCESS"
    });

    return res.json({ success: true });
  }

  // ❌ FAILED PAYMENT SAVE (optional but good)
  await Payment.create({
    razorpay_order_id,  
    razorpay_payment_id,
    amount,
    status: "FAILED"
  });

  res.status(400).json({ success: false });
});

module.exports = router;
