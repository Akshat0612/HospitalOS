const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    method: { type: String, enum: ["cash", "card", "upi", "netbanking", "insurance", "wallet"], required: true },
    paidAt: { type: Date, default: Date.now },
    reference: { type: String, default: "" }
}, { _id: true });

const appointmentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        doctor: { type: String, required: true, trim: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        status: {
            type: String,
            enum: ["pending_payment", "booked", "confirmed", "completed", "cancelled", "refunded", "requested", "Scheduled"],
            default: "pending_payment"
        },
        
        // Billing linkage
        billId: { type: mongoose.Schema.Types.ObjectId, ref: "Billing", default: null },
        consultationFee: { type: Number, default: 0 },
        
        // Payment tracking
        totalAmount: { type: Number, default: 0 },
        amountPaid: { type: Number, default: 0 },
        paymentStatus: { type: String, enum: ["unpaid", "partial", "paid", "refunded"], default: "unpaid" },
        paymentHistory: [paymentSchema],
        
        // Cancellation & refund
        cancelledAt: { type: Date, default: null },
        cancellationReason: { type: String, default: "" },
        refundAmount: { type: Number, default: 0 },
        refundStatus: { type: String, enum: ["", "processing", "completed", "denied"], default: "" },
        
        // For refund calculation
        paidAt: { type: Date, default: null },
        fullyPaidAt: { type: Date, default: null }
    },
    { timestamps: true }
);

appointmentSchema.index({ user: 1, status: 1, createdAt: -1 });
appointmentSchema.index({ doctor: 1, date: 1, time: 1, status: 1 });
appointmentSchema.index({ billId: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
