const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
    idReservation: { type: Number, required: true, unique: true },
    noreceipt: { type: String, required: true },
    customer: { type: String, required: true },
    contactNumber: { type: String, required: true },
    date: { type: String, required: true },
    cost: { type: Number, required: true },
    injuryType: { type: String, required: true },
    therapist: { type: String, required: true },
    codePromo: { type: String, required: false },
    createdAt: { type: Number, default: Date.now },
});

module.exports = mongoose.model("Reservation", ReservationSchema);