const express = require("express");
const Reservation = require("../models/Reservation");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/stats", auth, async (req, res) => {
    try {
        const totalReservations = await Reservation.countDocuments();
        const totalRevenue = await Reservation.aggregate([
            { $group: { _id: null, total: { $sum: "$cost"}}}
        ]);

        res.status(200).json({
            totalReservations,
            totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error});
    }
});

router.get("/revenue/monthly", auth, async (req, res) => {
    try {
        const monthlyRevenue = await Reservation.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: { $toDate: "$date" } } }, // Format YYYY-MM
                    totalRevenue: { $sum: "$cost" },
                    totalReservations: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } } // Urutkan berdasarkan bulan
        ]);
  
        res.json(monthlyRevenue);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.get("/injury/stats", auth, async (req, res) => {
    try {
        const injuryStats = await Reservation.aggregate([
            {
                $group: {
                    _id: "$injuryType", // Kelompokkan berdasarkan jenis cedera
                    totalCases: { $sum: 1 } // Hitung jumlahnya
                }
            },
            { $sort: { totalCases: -1 } } // Urutkan dari jumlah terbanyak
        ]);
  
        res.json(injuryStats);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.get("/therapist/stats", auth, async (req, res) => {
    try {
        const therapistStats = await Reservation.aggregate([
            {
                $group: {
                    _id: "$therapist", // Kelompokkan berdasarkan therapist
                    totalCases: { $sum: 1 } // Hitung jumlahnya
                }
            },
            { $sort: { totalCases: -1 } } // Urutkan dari jumlah terbanyak
        ]);
  
        res.json(therapistStats);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;