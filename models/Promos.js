const mongoose = require("mongoose");

const PromosSchema = new mongoose.Schema({
    idPromo: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    discount: { type: Number, required: true },
    isActive: { type: Boolean, required: true },
    codePromo: { type: String, required: true },
    createdAt: { type: Number, default: Date.now },
});

module.exports = mongoose.model("Promos", PromosSchema);