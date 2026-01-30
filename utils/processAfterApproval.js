const generateIdCardPdf = require("./generateIdCardPdf");
const generateNyuktiPatraPdf = require("./generateNyuktiPatraPdf");
const sendEmail = require("./sendEmail");




module.exports = async function processAfterApproval(member) {
  try {
    console.log("🟡 Processing approval for:", member._id);

    /* ================= GENERATE IMAGES ================= */
    const idCardUrl = await generateIdCardPdf(member);   // 🖼 PNG
    const nyuktiPatraUrl = await generateNyuktiPatraPdf(member); // 🖼 PNG

    if (!idCardUrl || !nyuktiPatraUrl) {
      console.error("❌ Image generation failed");
      return;
    }

    /* ================= SAVE ================= */
    member.idCardPath = idCardUrl;
    member.nyuktiPatraPath = nyuktiPatraUrl;
    member.idCardGenerated = true;
    member.approvalStatus = "APPROVED";
    member.approvedAt = new Date();

    await member.save();

    console.log("✅ Images saved in DB");

    /* ================= EMAIL (NO ATTACHMENTS) ================= */
    await sendEmail({
      to: member.email,
      subject: "Membership Approved – ID Card & Nyukti Patra",
      html: `
        <p>प्रिय ${member.fullName},</p>

        <p>
          आपका <b>${member.membershipType}</b> पद हेतु पंजीकरण
          <b>स्वीकृत</b> कर लिया गया है।
        </p>

        <p><b>🪪 Membership ID Card</b></p>
        <a href="${idCardUrl}" target="_blank">View / Download ID Card</a>

        <br/><br/>

        <p><b>📜 Nyukti Patra</b></p>
        <a href="${nyuktiPatraUrl}" target="_blank">View / Download Nyukti Patra</a>

        <br/><br/>
        <p>जय सनातन 🙏</p>
        <p><b>Vishwa Sanatan Hindu Foundation</b></p>
      `
    });

    console.log("📧 Email sent with IMAGE links");

  } catch (err) {
    console.error("❌ processAfterApproval failed:", err);
  }
};
