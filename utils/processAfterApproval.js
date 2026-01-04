const generateIdCardPdf = require("./generateIdCardPdf");
const sendEmail = require("./sendEmail");

module.exports = async function processAfterApproval(member) {
  try {
    console.log("🟡 Processing approval for:", member._id);

    /* ================= ID CARD ================= */
    let idCardUrl;

    try {
      idCardUrl = await generateIdCardPdf(member); // 👈 STRING URL
    } catch (err) {
      console.error("❌ ID CARD ERROR:", err);
      return; // ⛔ stop here, no crash
    }

    // ✅ FIXED CHECK (STRING BASED)
    if (!idCardUrl || typeof idCardUrl !== "string") {
      console.error("❌ ID card result invalid");
      return;
    }

    // ✅ SAVE URL
    member.idCardPath = idCardUrl;
    await member.save();

    console.log("✅ ID Card saved:", idCardUrl);

    /* ================= EMAIL ================= */
    try {
      await sendEmail({
        to: member.email,
        subject: "Your NGO Membership ID Card",
        html: `
          <h3>Welcome ${member.fullName}</h3>
          <p>Your membership has been approved.</p>
          <p>You can download your ID Card here:</p>
          <a href="${idCardUrl}" target="_blank">Download ID Card (PDF)</a>
        `
      });

      console.log("📧 Email sent to:", member.email);
    } catch (mailErr) {
      console.error("⚠️ Email failed:", mailErr.message);
    }

  } catch (err) {
    console.error("❌ processAfterApproval failed:", err);
  }
};
