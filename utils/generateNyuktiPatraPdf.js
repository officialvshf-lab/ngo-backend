const { createCanvas, loadImage } = require("canvas");
const cloudinary = require("./cloudinary");
const fs = require("fs");
const path = require("path");

module.exports = async function generateNyuktiPatra(member) {
  try {
    const width = 600;
    const height = 842;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const today = new Date();
const formattedDate = today.toLocaleDateString('en-GB'); 

    /* ================= BACKGROUND ================= */
    ctx.fillStyle = "#ffffff";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, 842, 842);

    /* ================= HEADER ================= */
    ctx.fillStyle = "#ff6a00";
    // ctx.fillRect(0, 0, canvas.width, 110);
    ctx.fillRect(0, 0, 600, 100);

    /* ================= LOGO ================= */
    try {
      const logoPath = path.join(__dirname, "../assets/logo1.png");
      if (fs.existsSync(logoPath)) {
        const logo = await loadImage(logoPath);
        ctx.drawImage(logo, -20, -10, 170, 120);
      }
    } catch (e) {
      console.warn("⚠️ Logo not loaded:", e.message);
    }

    /* ================= HEADER TEXT ================= */
    // ctx.fillStyle = "#ffffff";
    // ctx.font = "bold 26px Arial";
    // ctx.fillText("Vishwa Sanatan Hindu Foundation", 150, 55);

    // ctx.font = "bold 12px Arial";
    // ctx.fillText("REG NO. U88900UP2025NPL224277", 520, 70);


    ctx.fillStyle = "#fff";
ctx.font = "bold 26px Arial";
ctx.fillText("Vishwa Sanatan Hindu Foundation", 130, 38);

ctx.font = "bold 12px Arial";
ctx.fillText("REG NO.U88900UP2025NPL224277", 356, 58);

ctx.font = "bold 12px Arial";
ctx.fillText("12A - AALCV0804BE2025101", 392, 75);

ctx.font = "bold 12px Arial";
ctx.fillText("80G - AALCV0804BF2025101", 392, 89);

    /* ================= BODY ================= */
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";

    ctx.fillText(`Date:  ${formattedDate}`, 30, 150);
    ctx.fillText(`Name: ${member.fullName}`, 30, 175);
    ctx.fillText(`Post: ${member.membershipType}`, 30, 205);
    ctx.fillText(`Contact: ${member.mobile}`, 30, 235);


    ctx.fillText("Subject: Nyukti Patr", 30, 300);
ctx.fillText("Respected Sir/Madam:", 30, 330);



ctx.fillText("We are pleased to inform you that you are being appointed to the position of", 30, 370);
ctx.fillText(`${member.membershipType} in Vishwa Sanatan Hindu Foundation with immediate effect.`, 30, 395);


ctx.fillText("Considering your qualifications, experience, and dedication to social service,", 30, 430);

ctx.fillText("organization is confident that you will discharge your responsibilities effectively.", 30, 455);

ctx.fillText("with honesty, dedication, and loyalty, and actively contribute to achieving", 30, 480);

ctx.fillText("the objectives of the organization:", 30, 520);

ctx.fillText("Terms and Conditions of Appointment:", 30, 545);
ctx.fillText("* You shall perform your duties with complete honesty and dedication.", 30, 570);
ctx.fillText("* Your work & conduct must comply with the organization’s rules & guidelines.", 30, 595);
ctx.fillText("* This is a voluntary, unpaid, honorary position with no salary or remuneration.", 30, 620);
ctx.fillText("You must maintain discipline and decorum at all times.", 30, 645);
ctx.fillText("* You shall maintain discipline, dignity, and decorum at all times.", 30, 670);
ctx.fillText("organization may terminate your appointment at any time without prior notice.", 30, 710);


ctx.fillText("We hope that you will work with full dedication", 30, 735);


ctx.fillText("Sincerely", 30, 760);



    // ctx.fillText("सधन्यवाद", 40, 430);
    // ctx.fillText("अध्यक्ष", 40, 460);


    ctx.fillStyle = "#ff6a00";
ctx.fillRect(0, 795, 600, 50);


ctx.fillStyle = "rgb(255, 255, 255)";
ctx.font = "12px Arial";

ctx.fillText("Address: Dist. Bulandsher, Tehsil Syana, Post Bugrasi, Vill. Ravani Kateri, 9910307602 / 9315529789", 30, 815);
ctx.fillText("Email: officialvshf@gmail.com, www.vishwasanatanhindu.in", 150, 835); 

    /* ================= FOOTER ================= */
    // ctx.fillStyle = "#ff6a00";
    // ctx.fillRect(0, canvas.height - 60, canvas.width, 60);

    // ctx.fillStyle = "#ffffff";
    // ctx.font = "12px Arial";
    // ctx.fillText(
    //   "www.vishwasanatanhindu.in | officialvshf@gmail.com",
    //   40,
    //   canvas.height - 25
    // );

    /* ================= BUFFER ================= */
    const buffer = canvas.toBuffer("image/png");

    /* ================= CLOUDINARY UPLOAD ================= */
    const upload = await cloudinary.uploader.upload(
      `data:image/png;base64,${buffer.toString("base64")}`,
      {
        folder: "ngo/nyukti-patra",
        public_id: `nyukti_${member._id}`,
        overwrite: true
      }
    );

    return upload.secure_url;

  } catch (err) {
    console.error("❌ Nyukti Patra generation failed:", err);
    throw err;
  }
};
