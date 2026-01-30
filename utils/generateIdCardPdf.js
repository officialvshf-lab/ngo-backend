const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const cloudinary = require("./cloudinary");

module.exports = async function generateIdCardPdf(member) {
  try {
    /* ================= CANVAS SETUP ================= */
    const width = 600;
    const height = 380;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");


    const today = new Date();

// Format date (DD-MM-YYYY)
const formatDate = (date) => {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const issueDate = formatDate(today);

// Add 1 year for validity
const validityDate = new Date(today);
validityDate.setFullYear(validityDate.getFullYear() + 1);
const validTill = formatDate(validityDate);

    /* ================= BACKGROUND ================= */
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    /* ================= HEADER ================= */
    ctx.fillStyle = "#ff6a00";
    ctx.fillRect(0, 0, width, 100);

    /* ================= LOGO ================= */
    try {
      const logoPath = path.join(__dirname, "../assets/logo1.png");
      if (fs.existsSync(logoPath)) {
        const logo = await loadImage(logoPath);
        ctx.drawImage(logo, 0, -8, 170, 120);
      }
    } catch (e) {
      console.warn("⚠️ Logo not loaded");
    }

    /* ================= HEADER TEXT ================= */
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px Arial";
    ctx.fillText("Vishwa Sanatan Hindu Foundation", 160, 58);

    ctx.font = "bold 12px Arial";
    ctx.fillText("REG NO. U88900UP2025NPL224277", 220, 22);

    /* ================= MEMBER TEXT ================= */
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";

    ctx.fillText(`Name: ${member.fullName}`, 30, 140);
    ctx.fillText(`Mobile: ${member.mobile}`, 30, 170);
    ctx.fillText(`Membership: ${member.membershipType}`, 30, 200);
    ctx.fillText(`State: ${member.state}`, 30, 230);
    ctx.fillText(`Issue Date: ${issueDate}`, 30, 260);
    ctx.fillText(`Valid Till: ${validTill}`, 30, 290);

    /* ================= PHOTO BOX ================= */
    ctx.strokeStyle = "#000";
    ctx.strokeRect(410, 125, 160, 180);

    /* ================= MEMBER PHOTO ================= */
    if (member.photo) {
      try {
        const photo = await loadImage(member.photo);
        ctx.drawImage(photo, 410, 125, 160, 180);
      } catch (err) {
        console.warn("⚠️ Member photo load failed");
      }
    }

    /* ================= FOOTER ================= */
    ctx.fillStyle = "#ff6a00";
    ctx.fillRect(0, 330, width, 50);

    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Arial";
    ctx.fillText(
      `Address: District Bulandsher, Tehsil Syana, Post Bugrasi, Village Ravani Kateri,`,
      50,
      350
    );

    ctx.fillText(
      "Email: officialvshf@gmail.com, www.vishwasanatanhindu.in, 9910307602 / 9315529789",
      50,
      372
    );

    /* ================= SAVE TEMP IMAGE ================= */
    const tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const fileName = `idcard-${member._id}.png`;
    const tempPath = path.join(tempDir, fileName);

    fs.writeFileSync(tempPath, canvas.toBuffer("image/png"));

    /* ================= UPLOAD TO CLOUDINARY ================= */
    const upload = await cloudinary.uploader.upload(tempPath, {
      folder: "ngo-id-cards",
      resource_type: "image",
      public_id: `ID_${member._id}`,
      overwrite: true
    });

    fs.unlinkSync(tempPath); // cleanup

    return upload.secure_url; // ✅ FINAL ID CARD URL

  } catch (err) {
    console.error("❌ generateIdCardPdf failed:", err);
    return null; // never crash approval
  }
};
