const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 }
}, { _id: false });

const billingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        
        // Appointment linkage
        appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", default: null },
        appointmentDate: { type: String, default: "" },
        appointmentTime: { type: String, default: "" },
        
        invoiceNumber: {
            type: String,
            unique: true,
            required: true
        },

        // Patient Details
        patientName: { type: String, required: true, trim: true },
        patientAge: { type: Number, min: 0, max: 150 },
        patientGender: { type: String, enum: ["male", "female", "other", ""], default: "" },
        patientPhone: { type: String, trim: true },
        patientEmail: { type: String, trim: true, lowercase: true },

        // Doctor Details with Fee
        doctor: {
            name: { type: String, required: true },
            specialization: { type: String, default: "" },
            consultationFee: { type: Number, required: true, min: 0 }
        },

        // Itemized Services
        items: [itemSchema],

        // Financial Summary
        subtotal: { type: Number, required: true, min: 0 },
        taxRate: { type: Number, default: 18 }, // GST %
        taxAmount: { type: Number, required: true, min: 0 },
        discountPercent: { type: Number, default: 0, min: 0, max: 100 },
        discountAmount: { type: Number, default: 0, min: 0 },
        totalAmount: { type: Number, required: true, min: 0 },

        // Payment
        paymentStatus: {
            type: String,
            enum: ["draft", "pending", "partial", "paid", "cancelled", "refunded"],
            default: "pending"
        },
        paymentMethod: {
            type: String,
            enum: ["", "cash", "card", "upi", "netbanking", "insurance", "wallet"],
            default: ""
        },
        amountPaid: { type: Number, default: 0, min: 0 },
        balanceDue: { type: Number, default: 0, min: 0 },
        paidAt: { type: Date, default: null },

        // Bill Settings
        notes: { type: String, trim: true, maxlength: 500 },
        billDate: { type: Date, default: Date.now },
        dueDate: { type: Date }
    },
    { timestamps: true }
);

billingSchema.index({ user: 1, billDate: -1 });
billingSchema.index({ invoiceNumber: 1 });
billingSchema.index({ paymentStatus: 1 });
billingSchema.index({ appointmentId: 1 });

module.exports = mongoose.model("Billing", billingSchema);
