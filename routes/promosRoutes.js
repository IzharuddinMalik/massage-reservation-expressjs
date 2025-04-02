const express = require("express");
const Promos = require("../models/Promos");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/promos", auth, async (req, res) => {
    try {
        const {
            name,
            discount,
            isActive,
            codePromo
        } = req.body;

        // Cari idReservation terakhir dan tambahkan 1
        const lastPromos = await Promos.findOne().sort({ idPromo: -1 });
        const newIdPromos = lastPromos ? lastPromos.idPromo + 1 : 1;

        const newPromos = new Promos({
            idPromo: newIdPromos,
            name,
            discount,
            isActive,
            codePromo
        });

        await newPromos.save();
        res.status(201).json(newPromos);
    } catch (error) {
        res.status(500).json({ message: "Server error", error});
    }
});

router.get("/promos", auth, async (req, res) => {
    try {
        const promos = await Promos.find();
        res.status(200).json(promos);
    } catch (error) {
        res.status(500).json({ message: "Server error", error});
    }
});

router.get("/promos/:id", auth, async (req, res) => {
    try {
        const promo = await Promos.findOne({ idPromo: req.params.id });
        if (!promo) return res.status(404).json({ message: "Promo not found"});

        res.status(200).json(promo);
    } catch (error) {
        res.status(500).json({ message: "Server error", error});
    }
});

router.put("/promos/:id", auth, async (req, res) => {
    try {
        const updatePromo = await Promos.findOneAndUpdate(
            { idPromo: req.params.id },
            req.body,
            { new: true }
        );

        if (!updatePromo) return res.status(404).json({ message: "Promo not found"});

        res.status(200).json(updatePromo);
    } catch (error) {
        res.status(500).json({ message: "Server error", error});
    }
});

router.delete("/promos/:id", auth, async (req, res) => {
    try {
        const deletePromo = await Promos.findOneAndDelete({ idPromo: req.params.id });
        if (!deletePromo) return res.status(404).json({ message: "Promo not found" });

        res.status(200).json(deletePromo);
    } catch (error) {
        res.status(500).json({ message: "Server error", error});
    }
});

module.exports = router;