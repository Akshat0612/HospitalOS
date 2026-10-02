const Appointment = require("../models/Appointment");
const Billing = require("../models/Billing");
const { success, fail } = require("../utils/apiResponse");

// Doctor fee tiers for consultation lookup
const doctorFeeTiers = {
    "Dr. Sharma": 800, "Dr. Mehta": 750, "Dr. Gupta": 900, "Dr. Khanna": 1000,
    "Dr. Singh": 600, "Dr. Verma": 550, "Dr. Joshi": 600, "Dr. Rao": 650,
    "Dr. Desai": 600, "Dr. Malhotra": 550, "Dr. Banerjee": 600, "Dr. Iyer": 500,
    "Dr. Reddy": 500, "Dr. Patel": 400, "Dr. Kumar": 500, "Dr. Nair": 450,
    "Dr. Choudhary": 500, "Dr. Saxena": 500, "Dr. Agarwal": 350, "Dr. Bhatia": 400,
    "Dr. Menon": 450, "Dr. Yadav": 400, "Dr. Pandey": 450, "Dr. Ghosh": 500,
    "Dr. Kapoor": 400, "Dr. Jain": 550, "Dr. Arora": 750, "Dr. Prasad": 500,
    "Dr. Kaur": 600, "Dr. Mishra": 500
};

const NEXT = {
    staff: {
        pending_payment: ["cancelled"],
        booked: ["confirmed", "cancelled"],
        confirmed: ["completed", "cancelled"],
        completed: [],
        cancelled: [],
        refunded: []
    },
    patient: {
        pending_payment: ["cancelled"],
        booked: ["cancelled"],
        confirmed: ["cancelled"],
        completed: [],
        cancelled: [],
        refunded: []
    }
};

function normalizeAppointmentStatus(s) {
    if (s === "Scheduled") return "requested";
    return s;
}

function canTransition(role, currentRaw, nextStatus) {
    const current = normalizeAppointmentStatus(currentRaw);
    const bucket = role === "staff" ? NEXT.staff : NEXT.patient;
    const allowed = bucket[current] || [];
    return allowed.includes(nextStatus);
}

exports.createAppointment = async (req, res, next) => {
    try {
        const { doctor, date, time } = req.body;
        
        // Get consultation fee for the doctor
        const consultationFee = doctorFeeTiers[doctor] || 500;
        const gstRate = 18;
        const totalWithTax = Math.round(consultationFee * (1 + gstRate / 100));

        const clash = await Appointment.findOne({
            doctor,
            date,
            time,
            status: { $nin: ["cancelled", "refunded"] }
        });

        if (clash) {
            return fail(
                res,
                "This time slot is already booked for the selected doctor. Please choose another time.",
                null,
                409
            );
        }

        const appointment = await Appointment.create({
            user: req.user.id,
            doctor,
            date,
            time,
            status: "pending_payment",
            consultationFee,
            totalAmount: totalWithTax,
            amountPaid: 0,
            paymentStatus: "unpaid"
        });

        return success(res, "Appointment created. Please complete payment.", { 
            appointment,
            redirectToBilling: true,
            consultationFee,
            totalWithTax
        }, 201);
    } catch (err) {
        next(err);
    }
};

exports.getAppointments = async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const limit = Math.min(req.query.limit || 20, 100);
        const statusFilter = req.query.status;

        const filter = {};
        if (statusFilter) {
            filter.status = statusFilter;
        }

        const staffViewAll = req.user.role === "staff" && req.query.view === "all";

        if (!staffViewAll) {
            filter.user = req.user.id;
        }

        const skip = (page - 1) * limit;

        const [appointments, total] = await Promise.all([
            Appointment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Appointment.countDocuments(filter)
        ]);

        const normalized = appointments.map((a) => ({
            ...a,
            status: normalizeAppointmentStatus(a.status)
        }));

        return success(res, "Appointments retrieved", {
            appointments: normalized,
            pagination: {
                page,
                limit,
                total,
                pages: Math.max(1, Math.ceil(total / limit))
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return fail(res, "Appointment not found", null, 404);
        }

        const owns = appointment.user.toString() === req.user.id.toString();
        const staff = req.user.role === "staff";

        if (!owns && !staff) {
            return fail(res, "Not authorized to update this appointment", null, 403);
        }

        if (normalizeAppointmentStatus(appointment.status) === status) {
            return success(res, "Status unchanged", { appointment });
        }

        if (!canTransition(req.user.role, appointment.status, status)) {
            return fail(
                res,
                `Invalid status transition from "${appointment.status}" to "${status}" for your role.`,
                null,
                409
            );
        }

        appointment.status = status;
        await appointment.save();

        return success(res, "Status updated", { appointment });
    } catch (err) {
        next(err);
    }
};

// Cancel appointment with refund logic
exports.cancelAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return fail(res, "Appointment not found", null, 404);
        }

        const owns = appointment.user.toString() === req.user.id.toString();
        const staff = req.user.role === "staff";

        if (!owns && !staff) {
            return fail(res, "Not authorized to cancel this appointment", null, 403);
        }

        // Check if already cancelled or refunded
        if (["cancelled", "refunded"].includes(appointment.status)) {
            return fail(res, "Appointment is already cancelled/refunded", null, 400);
        }

        const appointmentDate = new Date(appointment.date);
        const today = new Date();
        const daysUntilAppointment = Math.ceil((appointmentDate - today) / (1000 * 60 * 60 * 24));
        
        let refundAmount = 0;
        let refundStatus = "";
        let finalStatus = "cancelled";

        // Refund logic based on payment status and days until appointment
        if (appointment.paymentStatus === "unpaid" || appointment.amountPaid === 0) {
            // No payment made - simple cancellation
            refundAmount = 0;
            refundStatus = "";
        } else if (daysUntilAppointment >= 7) {
            // 7+ days before appointment - 70% refund
            refundAmount = Math.round(appointment.amountPaid * 0.70);
            refundStatus = "processing";
            finalStatus = "refunded";
        } else {
            // Less than 7 days - no refund
            refundAmount = 0;
            refundStatus = "denied";
        }

        // Update appointment
        appointment.status = finalStatus;
        appointment.cancelledAt = new Date();
        appointment.cancellationReason = reason || "User cancelled";
        appointment.refundAmount = refundAmount;
        appointment.refundStatus = refundStatus;
        await appointment.save();

        // Sync with billing if bill exists
        if (appointment.billId) {
            const bill = await Billing.findById(appointment.billId);
            if (bill) {
                bill.paymentStatus = finalStatus === "refunded" ? "refunded" : "cancelled";
                if (refundAmount > 0) {
                    bill.notes = (bill.notes || "") + ` | Refund processed: ₹${refundAmount} (70% of ₹${appointment.amountPaid})`;
                }
                await bill.save();
            }
        }

        return success(res, 
            finalStatus === "refunded" 
                ? `Appointment cancelled. Refund of ₹${refundAmount} will be processed within 5-7 business days.` 
                : "Appointment cancelled successfully.",
            { 
                appointment,
                refundDetails: {
                    amountPaid: appointment.amountPaid,
                    refundAmount,
                    refundStatus,
                    daysUntilAppointment,
                    eligibleForRefund: daysUntilAppointment >= 7 && appointment.amountPaid > 0
                }
            }
        );
    } catch (err) {
        next(err);
    }
};

// Link bill to appointment (called from billing controller)
exports.linkBillToAppointment = async (req, res, next) => {
    try {
        const { appointmentId, billId } = req.body;
        
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return fail(res, "Appointment not found", null, 404);
        }

        appointment.billId = billId;
        await appointment.save();

        return success(res, "Bill linked to appointment", { appointment });
    } catch (err) {
        next(err);
    }
};

// Update appointment payment status (called when bill is paid)
exports.updatePaymentStatus = async (req, res, next) => {
    try {
        const { appointmentId, amountPaid, paymentStatus, paymentMethod } = req.body;
        
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return fail(res, "Appointment not found", null, 404);
        }

        const owns = appointment.user.toString() === req.user.id.toString();
        const staff = req.user.role === "staff";
        
        if (!owns && !staff) {
            return fail(res, "Not authorized", null, 403);
        }

        // Update payment history
        if (amountPaid > 0) {
            appointment.paymentHistory.push({
                amount: amountPaid,
                method: paymentMethod || "online",
                paidAt: new Date()
            });
        }

        appointment.amountPaid = (appointment.amountPaid || 0) + amountPaid;
        appointment.paymentStatus = paymentStatus;
        
        // If fully paid, update status to "booked"
        if (paymentStatus === "paid" && appointment.status === "pending_payment") {
            appointment.status = "booked";
            appointment.fullyPaidAt = new Date();
        }
        
        // Track first payment
        if (!appointment.paidAt && amountPaid > 0) {
            appointment.paidAt = new Date();
        }

        await appointment.save();

        return success(res, "Payment status updated", { appointment });
    } catch (err) {
        next(err);
    }
};
