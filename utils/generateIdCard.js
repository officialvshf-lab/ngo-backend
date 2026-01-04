const { createCanvas, loadImage } = require("canvas");
const path = require("path");
const fs = require("fs");

const generateIdCard = async (member) => {
  const width = 600;
  const height = 350;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#f4f4f4";
  ctx.fillRect(0, 0, width, height);

  // Border
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, width, height);

  // NGO Name
  ctx.fillStyle = "#000";
  ctx.font = "bold 24px Arial";
  ctx.fillText("NGO MEMBERSHIP ID CARD", 140, 40);

  // Photo
  const photoPath = path.join(
    __dirname,
    "..",
    member.photo.replace("/uploads", "uploads")
  );

  const photo = await loadImage(photoPath);
  ctx.drawImage(photo, 30, 70, 120, 150);

  // Member details
  ctx.font = "16px Arial";
  ctx.fillText(`Name: ${member.fullName}`, 180, 90);
  ctx.fillText(`Father: ${member.fatherName}`, 180, 120);
  ctx.fillText(`Gender: ${member.gender}`, 180, 150);
  ctx.fillText(`Mobile: ${member.mobile}`, 180, 180);
  ctx.fillText(`Member Type: ${member.membershipType}`, 180, 210);

  // ID Number
  ctx.font = "bold 16px Arial";
  ctx.fillText(`ID: ${member._id}`, 180, 250);

  // Save file
  const fileName = `idcard-${member._id}.png`;
  const outputPath = path.join(__dirname, "..", "uploads", "idcards", fileName);

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputPath, buffer);

  return `/uploads/idcards/${fileName}`;
};

module.exports = generateIdCard;
