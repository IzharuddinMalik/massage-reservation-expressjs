require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const promoRoutes = require("./routes/promosRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/admin", reservationRoutes);
app.use("/api/admin", promoRoutes);
app.use("/api/admin", dashboardRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
