const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const cloudinary = require("./cloudinary");
const axios = require("axios");

module.exports = async function generateIdCardPdf(member) {
  return new Promise(async (resolve, reject) => {
    try {
      const dir = path.join(__dirname, "../temp");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      const pdfPath = path.join(dir, `ID-${member._id}.pdf`);
      const doc = new PDFDocument({ size: [350, 220], margin: 10 });

      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);

      /* ================= HEADER ================= */
      doc
        .rect(0, 0, 350, 50)
        .fill("#ff6600");

      doc
        .fillColor("#fff")
        .fontSize(16)
        .text("NGO MEMBERSHIP ID CARD", 20, 18);

      /* ================= PHOTO ================= */
      const photoRes = await axios.get(member.photo, {
        responseType: "arraybuffer"
      });

      doc.image(photoRes.data, 20, 70, {
        width: 70,
        height: 90
      });

      /* ================= DETAILS ================= */
      doc
        .fillColor("#000")
        .fontSize(10)
        .text(`Name: ${member.fullName}`, 110, 75)
        .text(`Father: ${member.fatherName}`, 110, 92)
        .text(`Membership: ${member.membershipType}`, 110, 109)
        .text(`Mobile: ${member.mobile}`, 110, 126)
        .text(`State: ${member.state}`, 110, 143)
        .text(`ID: ${member._id}`, 110, 160);

      doc.end();

      stream.on("finish", async () => {
        /* ============ UPLOAD TO CLOUDINARY (PDF) ============ */
        const upload = await cloudinary.uploader.upload(pdfPath, {
          resource_type: "raw",
          folder: "ngo_id_cards",
          public_id: `ID_${member._id}`
        });

        fs.unlinkSync(pdfPath); // cleanup

        resolve(upload.secure_url); // PDF URL
      });

    } catch (err) {
      reject(err);
    }
  });
};
