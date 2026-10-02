const mongoose = require("mongoose");

const doctorRecommendationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    fee: { type: Number, required: true },
    score: { type: Number, default: 0 }
}, { _id: false });

const triageCaseSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        symptoms: [{ type: String }],
        severity: { type: String, required: true },
        confidence: { type: Number, required: true },
        urgency: { type: String, required: true },
        recommendation: { type: String, required: true },
        disclaimer: { type: String, required: true },
        
        // Enhanced AI analysis fields (optional for backward compatibility)
        description: { type: String, default: "" },
        possibleConditions: [{ type: String }],
        suggestedDepartment: { type: String, default: "" },
        recommendedDoctors: [doctorRecommendationSchema],
        isEmergency: { type: Boolean, default: false },
        hasExternalAI: { type: Boolean, default: false }
    },
    { timestamps: true }
);

triageCaseSchema.index({ user: 1, createdAt: -1 });
triageCaseSchema.index({ urgency: 1 });
triageCaseSchema.index({ isEmergency: 1 });

module.exports = mongoose.model("TriageCase", triageCaseSchema);
