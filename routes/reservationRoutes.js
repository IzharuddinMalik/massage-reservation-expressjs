const express = require("express");
const Reservation = require("../models/Reservation");
const auth = require("../middleware/auth");

const router = express.Router();

// Function to generate random receipt number
const generateReceiptNumber = () => {
    const timestamp = Date.now().toString().slice(-6); // Ambil 6 digit terakhir dari timestamp
    const randomLetters = Math.random().toString(36).substring(2, 5).toUpperCase(); // 3 huruf random
    const randomNumber = Math.floor(100 + Math.random() * 900); // 3 digit angka acak
    return `RCPT-${randomLetters}${timestamp}${randomNumber}`;
};

{/* Create Reservation */}
router.post("/reservation", auth, async (req, res) => {
    try {
        const {
            customer,
            contactNumber,
            date,
            cost,
            injuryType,
            therapist,
            codePromo
        } = req.body;
    
        // Cari idReservation terakhir dan tambahkan 1
        const lastReservation = await Reservation.findOne().sort({ idReservation: -1 });
        const newIdReservation = lastReservation ? lastReservation.idReservation + 1 : 1;
    
        const newReservation = new Reservation({
            idReservation: newIdReservation,
            noreceipt: generateReceiptNumber(),
            customer,
            contactNumber,
            date,
            cost,
            injuryType,
            therapist,
            codePromo,
            createdAt: Date.now()
        });

        await newReservation.save();
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.get("/reservations", auth, async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: "Server error", error});
    }
});

router.get("/reservation/:id", auth, async (req, res) => {
    try {
        const reservation = await Reservation.findOne({ idReservation: req.params.id });
        if (!reservation) return res.status(404).json({ message: "Reservation not found"});

        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ message: "Server error", error});
    }
});

router.put("/reservation/:id", auth, async (req, res) => {
    try {
        const updateReservation = await Reservation.findOneAndUpdate(
            { idReservation: req.params.id },
            req.body,
            { new: true }
        );

        if (!updateReservation) return res.status(404).json({ message: "Reservation not found"});

        res.status(200).json(updateReservation);
    } catch (error) {
        res.status(500).json({ message: "Server error", error});
    }
});

router.delete("/reservation/:id", auth, async (req, res) => {
    try {
        const deleteReservation = await Reservation.findOneAndDelete({ idReservation: req.params.id });

        if (!deleteReservation) return res.status(404).json({ message: "Delete Reservation not found"});

        res.status(200).json(deleteReservation);
    } catch (error) {
        res.status(500).json({ message: "Server error", error});
    }
});

module.exports = router;