const Appointment = require("../models/Appointment");
const Billing = require("../models/Billing");
const { success } = require("../utils/apiResponse");

exports.summary = async (req, res, next) => {
    try {
        const [revenueAgg, apptByStatus, serviceAgg, apptLast7] = await Promise.all([
            Billing.aggregate([
                { $match: { paymentStatus: "paid" } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } }
            ]),
            Appointment.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]),
            Billing.aggregate([
                { $unwind: "$services" },
                { $group: { _id: "$services", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]),
            Appointment.countDocuments({
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            })
        ]);

        return success(res, "Operational summary", {
            revenuePaidInr: revenueAgg[0]?.total || 0,
            appointmentsByStatus: apptByStatus,
            topServices: serviceAgg,
            appointmentsCreatedLast7Days: apptLast7
        });
    } catch (err) {
        next(err);
    }
};
