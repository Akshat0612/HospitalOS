const { success, fail } = require("../utils/apiResponse");

const DOCTORS = [
    { id: "d1", name: "Dr. Sharma", specialization: "Cardiologist" },
    { id: "d2", name: "Dr. Mehta", specialization: "Neurologist" },
    { id: "d3", name: "Dr. Singh", specialization: "Orthopedic" },
    { id: "d4", name: "Dr. Verma", specialization: "Dermatologist" },
    { id: "d5", name: "Dr. Patel", specialization: "Pediatrician" },
    { id: "d6", name: "Dr. Gupta", specialization: "Oncologist" },
    { id: "d7", name: "Dr. Kumar", specialization: "General Surgeon" },
    { id: "d8", name: "Dr. Reddy", specialization: "ENT Specialist" },
    { id: "d9", name: "Dr. Iyer", specialization: "Ophthalmologist" },
    { id: "d10", name: "Dr. Nair", specialization: "Psychiatrist" },
    { id: "d11", name: "Dr. Joshi", specialization: "Gynecologist" },
    { id: "d12", name: "Dr. Rao", specialization: "Urologist" },
    { id: "d13", name: "Dr. Desai", specialization: "Gastroenterologist" },
    { id: "d14", name: "Dr. Malhotra", specialization: "Pulmonologist" },
    { id: "d15", name: "Dr. Banerjee", specialization: "Nephrologist" },
    { id: "d16", name: "Dr. Choudhary", specialization: "Endocrinologist" },
    { id: "d17", name: "Dr. Saxena", specialization: "Rheumatologist" },
    { id: "d18", name: "Dr. Khanna", specialization: "Plastic Surgeon" },
    { id: "d19", name: "Dr. Agarwal", specialization: "Dentist" },
    { id: "d20", name: "Dr. Bhatia", specialization: "Physiotherapist" },
    { id: "d21", name: "Dr. Menon", specialization: "Radiologist" },
    { id: "d22", name: "Dr. Yadav", specialization: "Pathologist" },
    { id: "d23", name: "Dr. Pandey", specialization: "Anesthesiologist" },
    { id: "d24", name: "Dr. Ghosh", specialization: "Hematologist" },
    { id: "d25", name: "Dr. Kapoor", specialization: "General Physician" },
    { id: "d26", name: "Dr. Jain", specialization: "Infectious Disease Specialist" },
    { id: "d27", name: "Dr. Arora", specialization: "Vascular Surgeon" },
    { id: "d28", name: "Dr. Prasad", specialization: "Geriatrician" },
    { id: "d29", name: "Dr. Kaur", specialization: "Sports Medicine Specialist" },
    { id: "d30", name: "Dr. Mishra", specialization: "Allergist & Immunologist" }
];

exports.listDoctors = async (req, res, next) => {
    try {
        const q = (req.query.q || "").toLowerCase().trim();
        const sort = req.query.sort === "name" ? "name" : "specialization";
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));

        let list = DOCTORS.map((d) => ({ ...d }));

        if (q) {
            list = list.filter(
                (d) =>
                    d.name.toLowerCase().includes(q) ||
                    d.specialization.toLowerCase().includes(q)
            );
        }

        list.sort((a, b) => a[sort].localeCompare(b[sort], undefined, { sensitivity: "base" }));

        const total = list.length;
        const start = (page - 1) * limit;
        const paginated = list.slice(start, start + limit);

        return success(res, "Doctors retrieved", {
            doctors: paginated,
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

exports.getSlots = async (req, res, next) => {
    try {
        const { date } = req.query;
        const doctorName = req.query.doctor;

        if (!date || !doctorName) {
            return fail(res, "Query parameters date and doctor are required", null, 400);
        }

        const Appointment = require("../models/Appointment");

        const booked = await Appointment.find({
            doctor: doctorName,
            date,
            status: { $nin: ["cancelled"] }
        })
            .select("time")
            .lean();

        const taken = new Set(booked.map((a) => a.time));

        const slots = [];
        for (let h = 9; h <= 16; h++) {
            const label = `${String(h).padStart(2, "0")}:00`;
            slots.push({
                time: label,
                available: !taken.has(label)
            });
        }

        return success(res, "Slots computed", { date, doctor: doctorName, slots });
    } catch (err) {
        next(err);
    }
};
