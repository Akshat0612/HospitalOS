const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, trim: true, default: "Patient" },
        email: { type: String, unique: true, required: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["patient", "staff"],
            default: "patient"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
