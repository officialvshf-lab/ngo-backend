require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const paymentRoutes = require("./routes/payment");

const connectDB = require("./config/db");

const app = express();

/* DB */
connectDB();

/* Middlewares */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Static uploads */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* Routes */
app.use("/api/register", require("./routes/register"));
app.use("/api/admin", require("./routes/adminLogin"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/payment", paymentRoutes);

/* Test */
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

/* Start */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});


process.on("unhandledRejection", (reason, promise) => {
  console.error("🚨 UNHANDLED PROMISE REJECTION");
  console.error(reason);
});
