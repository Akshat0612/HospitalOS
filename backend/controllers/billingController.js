const PDFDocument = require("pdfkit");
const Billing = require("../models/Billing");
const { success, fail } = require("../utils/apiResponse");

// Doctor-specific consultation fees (tiered pricing)
const doctorFeeTiers = {
    // Senior consultants - higher fees
    "Dr. Sharma": { fee: 800, tier: "senior" },      // Cardiologist
    "Dr. Mehta": { fee: 750, tier: "senior" },       // Neurologist
    "Dr. Gupta": { fee: 900, tier: "senior" },       // Oncologist
    "Dr. Khanna": { fee: 1000, tier: "senior" },     // Plastic Surgeon
    
    // Specialists - medium fees
    "Dr. Singh": { fee: 600, tier: "specialist" },     // Orthopedic
    "Dr. Verma": { fee: 550, tier: "specialist" },     // Dermatologist
    "Dr. Joshi": { fee: 600, tier: "specialist" },     // Gynecologist
    "Dr. Rao": { fee: 650, tier: "specialist" },       // Urologist
    "Dr. Desai": { fee: 600, tier: "specialist" },    // Gastroenterologist
    "Dr. Malhotra": { fee: 550, tier: "specialist" }, // Pulmonologist
    "Dr. Banerjee": { fee: 600, tier: "specialist" },  // Nephrologist
    "Dr. Iyer": { fee: 500, tier: "specialist" },     // Ophthalmologist
    "Dr. Reddy": { fee: 500, tier: "specialist" },     // ENT
    
    // General/Standard - lower fees
    "Dr. Patel": { fee: 400, tier: "standard" },      // Pediatrician
    "Dr. Kumar": { fee: 500, tier: "standard" },      // General Surgeon
    "Dr. Nair": { fee: 450, tier: "standard" },       // Psychiatrist
    "Dr. Choudhary": { fee: 500, tier: "standard" },    // Endocrinologist
    "Dr. Saxena": { fee: 500, tier: "standard" },     // Rheumatologist
    "Dr. Agarwal": { fee: 350, tier: "standard" },    // Dentist
    "Dr. Bhatia": { fee: 400, tier: "standard" },     // Physiotherapist
    "Dr. Menon": { fee: 450, tier: "standard" },       // Radiologist
    "Dr. Yadav": { fee: 400, tier: "standard" },       // Pathologist
    "Dr. Pandey": { fee: 450, tier: "standard" },      // Anesthesiologist
    "Dr. Ghosh": { fee: 500, tier: "standard" },        // Hematologist
    "Dr. Kapoor": { fee: 400, tier: "standard" },      // General Physician
    "Dr. Jain": { fee: 550, tier: "specialist" },      // Infectious Disease
    "Dr. Arora": { fee: 750, tier: "specialist" },     // Vascular Surgeon
    "Dr. Prasad": { fee: 500, tier: "standard" },      // Geriatrician
    "Dr. Kaur": { fee: 600, tier: "specialist" },    // Sports Medicine
    "Dr. Mishra": { fee: 500, tier: "specialist" }     // Allergist
};

// Common procedures with standard rates
const procedureRates = {
    "Blood Test": 250,
    "X-Ray": 800,
    "CT Scan": 3500,
    "MRI": 8000,
    "Ultrasound": 1200,
    "ECG": 400,
    "Echo": 1800,
    "Endoscopy": 4500,
    "Biopsy": 2500,
    "Stitching": 800,
    "Dressing": 300,
    "Injection": 150,
    "IV Drip": 600,
    "Oxygen": 400,
    "Nebulization": 350,
    "Physiotherapy Session": 600,
    "Vaccination": 400,
    "Dental Cleaning": 800,
    "Tooth Extraction": 1200,
    "Root Canal": 3500,
    "Vision Test": 300,
    "Hearing Test": 500,
    "Medicine": 0 // Variable, set per bill
};

function getDoctorFee(doctorName) {
    return doctorFeeTiers[doctorName]?.fee || 500; // Default ₹500
}

function getDoctorTier(doctorName) {
    return doctorFeeTiers[doctorName]?.tier || "standard";
}

function generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(1000 + Math.random() * 9000);
    return `HC${year}${month}-${random}`;
}

function calculateBill(items, doctorFee, taxRate = 18, discountPercent = 0) {
    // Add consultation as first item
    const allItems = [
        {
            name: "Consultation Fee",
            description: "Doctor consultation charges",
            quantity: 1,
            unitPrice: doctorFee,
            total: doctorFee
        },
        ...items
    ];

    const subtotal = allItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const taxAmount = Math.round((subtotal * taxRate) / 100);
    const discountAmount = Math.round((subtotal * discountPercent) / 100);
    const totalAmount = subtotal + taxAmount - discountAmount;

    return {
        items: allItems,
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount,
        balanceDue: totalAmount
    };
}

exports.createBill = async (req, res, next) => {
    try {
        const {
            patientName,
            patientAge,
            patientGender,
            patientPhone,
            patientEmail,
            doctor,
            items = [],
            taxRate = 18,
            discountPercent = 0,
            notes,
            dueDate,
            appointmentId,
            appointmentDate,
            appointmentTime
        } = req.body;

        // Validation
        if (!patientName || !patientName.trim()) {
            return fail(res, "Patient name is required", null, 400);
        }
        if (!doctor || !doctor.name) {
            return fail(res, "Doctor selection is required", null, 400);
        }

        const doctorFee = getDoctorFee(doctor.name);
        const doctorTier = getDoctorTier(doctor.name);

        // Process items - validate and calculate totals
        const processedItems = items.map(item => {
            const qty = Math.max(1, parseInt(item.quantity) || 1);
            const price = Math.max(0, parseFloat(item.unitPrice) || 0);
            return {
                name: item.name || "Service",
                description: item.description || "",
                quantity: qty,
                unitPrice: price,
                total: qty * price
            };
        }).filter(item => item.total > 0);

        // Calculate bill totals
        const calculation = calculateBill(
            processedItems,
            doctorFee,
            parseFloat(taxRate),
            parseFloat(discountPercent)
        );

        const invoiceNumber = generateInvoiceNumber();
        const billDate = new Date();
        const finalDueDate = dueDate ? new Date(dueDate) : new Date(billDate.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 days default

        const bill = await Billing.create({
            user: req.user.id,
            invoiceNumber,
            patientName: patientName.trim(),
            patientAge: patientAge ? parseInt(patientAge) : undefined,
            patientGender: patientGender || "",
            patientPhone: patientPhone || "",
            patientEmail: patientEmail || "",
            doctor: {
                name: doctor.name,
                specialization: doctor.specialization || "",
                consultationFee: doctorFee
            },
            items: calculation.items,
            subtotal: calculation.subtotal,
            taxRate: parseFloat(taxRate),
            taxAmount: calculation.taxAmount,
            discountPercent: parseFloat(discountPercent),
            discountAmount: calculation.discountAmount,
            totalAmount: calculation.totalAmount,
            balanceDue: calculation.balanceDue,
            notes: notes || "",
            billDate,
            dueDate: finalDueDate,
            paymentStatus: "pending",
            appointmentId: appointmentId || null,
            appointmentDate: appointmentDate || "",
            appointmentTime: appointmentTime || ""
        });

        // If linked to appointment, update the appointment's billId
        if (appointmentId) {
            const Appointment = require("../models/Appointment");
            await Appointment.findByIdAndUpdate(appointmentId, {
                billId: bill._id,
                consultationFee: doctorFee,
                totalAmount: calculation.totalAmount
            });
        }

        return success(res, "Bill generated successfully", { bill }, 201);
    } catch (err) {
        next(err);
    }
};

exports.getBills = async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const limit = Math.min(req.query.limit || 20, 100);
        const paymentFilter = req.query.paymentStatus;
        const search = req.query.search;

        const filter = { user: req.user.id };
        if (paymentFilter) {
            filter.paymentStatus = paymentFilter;
        }

        // Search by patient name or invoice number
        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), "i");
            filter.$or = [
                { patientName: searchRegex },
                { invoiceNumber: searchRegex },
                { "doctor.name": searchRegex }
            ];
        }

        const skip = (page - 1) * limit;

        const [bills, total] = await Promise.all([
            Billing.find(filter).sort({ billDate: -1 }).skip(skip).limit(limit).lean(),
            Billing.countDocuments(filter)
        ]);

        return success(res, "Bills retrieved", {
            bills,
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

exports.getBillById = async (req, res, next) => {
    try {
        const bill = await Billing.findOne({
            _id: req.params.id,
            user: req.user.id
        }).lean();

        if (!bill) {
            return fail(res, "Bill not found", null, 404);
        }

        return success(res, "Bill retrieved", { bill });
    } catch (err) {
        next(err);
    }
};

exports.recordPayment = async (req, res, next) => {
    try {
        const { amount, paymentMethod } = req.body;
        const bill = await Billing.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!bill) {
            return fail(res, "Bill not found", null, 404);
        }

        if (bill.paymentStatus === "cancelled" || bill.paymentStatus === "refunded") {
            return fail(res, "Cannot process payment for cancelled/refunded bill", null, 400);
        }

        const paymentAmount = Math.max(0, parseFloat(amount) || 0);
        const newAmountPaid = bill.amountPaid + paymentAmount;
        const newBalanceDue = Math.max(0, bill.totalAmount - newAmountPaid);

        // Determine payment status
        let newStatus = bill.paymentStatus;
        if (newBalanceDue <= 0) {
            newStatus = "paid";
        } else if (newAmountPaid > 0) {
            newStatus = "partial";
        }

        bill.amountPaid = newAmountPaid;
        bill.balanceDue = newBalanceDue;
        bill.paymentStatus = newStatus;
        bill.paymentMethod = paymentMethod || bill.paymentMethod;
        if (newStatus === "paid") {
            bill.paidAt = new Date();
        }

        await bill.save();

        // Sync with appointment if linked
        if (bill.appointmentId) {
            const Appointment = require("../models/Appointment");
            const appointment = await Appointment.findById(bill.appointmentId);
            if (appointment) {
                // Update payment history
                appointment.paymentHistory.push({
                    amount: paymentAmount,
                    method: paymentMethod || "online",
                    paidAt: new Date()
                });
                
                appointment.amountPaid = newAmountPaid;
                appointment.paymentStatus = newStatus;
                
                // If fully paid and status was pending_payment, update to booked
                if (newStatus === "paid" && appointment.status === "pending_payment") {
                    appointment.status = "booked";
                    appointment.fullyPaidAt = new Date();
                }
                
                // Track first payment
                if (!appointment.paidAt && paymentAmount > 0) {
                    appointment.paidAt = new Date();
                }
                
                await appointment.save();
            }
        }

        return success(res, `Payment recorded: ₹${paymentAmount} via ${paymentMethod || "unspecified"}`, { bill });
    } catch (err) {
        next(err);
    }
};

exports.cancelBill = async (req, res, next) => {
    try {
        const bill = await Billing.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!bill) {
            return fail(res, "Bill not found", null, 404);
        }

        if (bill.paymentStatus === "paid") {
            return fail(res, "Cannot cancel a paid bill. Process refund instead.", null, 400);
        }

        bill.paymentStatus = "cancelled";
        await bill.save();

        return success(res, "Bill cancelled successfully", { bill });
    } catch (err) {
        next(err);
    }
};

// Get available procedures and their rates
exports.getProcedureRates = async (req, res, next) => {
    try {
        return success(res, "Procedure rates retrieved", { rates: procedureRates });
    } catch (err) {
        next(err);
    }
};

exports.downloadReceipt = async (req, res, next) => {
    try {
        const bill = await Billing.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!bill) {
            return fail(res, "Bill not found", null, 404);
        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="invoice-${bill.invoiceNumber}.pdf"`
        );

        const doc = new PDFDocument({ margin: 50, size: "A4" });
        doc.pipe(res);

        const primaryColor = "#0d9488";
        const darkColor = "#0f172a";
        const mutedColor = "#64748b";

        // Header with hospital branding
        doc.fontSize(24).fillColor(primaryColor).text("HealthCare+", { align: "center" });
        doc.fontSize(12).fillColor(mutedColor).text("Hospital & Medical Center", { align: "center" });
        doc.moveDown(0.5);
        doc.fontSize(10).fillColor(mutedColor).text("123 Medical Lane, Health City, India - 560001", { align: "center" });
        doc.text("Phone: +91 80 1234 5678 | Email: billing@healthcareplus.com", { align: "center" });
        doc.moveDown(1);

        // Separator line
        doc.strokeColor(primaryColor).lineWidth(2).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(1);

        // Invoice title and details
        doc.fontSize(18).fillColor(darkColor).text("TAX INVOICE", { align: "left" });
        doc.fontSize(10).fillColor(mutedColor);
        doc.text(`Invoice Number: ${bill.invoiceNumber}`);
        doc.text(`Bill Date: ${bill.billDate.toLocaleDateString("en-IN")}`);
        doc.text(`Due Date: ${bill.dueDate ? bill.dueDate.toLocaleDateString("en-IN") : "Immediate"}`);
        
        // Status badge
        const statusColors = {
            paid: "#15803d",
            pending: "#d97706",
            partial: "#0369a1",
            cancelled: "#dc2626",
            draft: "#6b7280"
        };
        const statusColor = statusColors[bill.paymentStatus] || mutedColor;
        doc.fillColor(statusColor).text(`Status: ${bill.paymentStatus.toUpperCase()}`, { underline: true });
        doc.moveDown(1);

        // Patient Details Section
        doc.fontSize(12).fillColor(darkColor).text("PATIENT DETAILS");
        doc.moveDown(0.3);
        doc.fontSize(10).fillColor(darkColor);
        doc.text(`Name: ${bill.patientName}`);
        if (bill.patientAge) doc.text(`Age: ${bill.patientAge} years`);
        if (bill.patientGender) doc.text(`Gender: ${bill.patientGender.charAt(0).toUpperCase() + bill.patientGender.slice(1)}`);
        if (bill.patientPhone) doc.text(`Phone: ${bill.patientPhone}`);
        if (bill.patientEmail) doc.text(`Email: ${bill.patientEmail}`);
        doc.moveDown(0.5);

        // Doctor Details
        doc.text(`Consulting Doctor: ${bill.doctor.name}`);
        if (bill.doctor.specialization) doc.text(`Specialization: ${bill.doctor.specialization}`);
        doc.moveDown(1);

        // Separator
        doc.strokeColor("#e2e8f0").lineWidth(0.5).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(0.5);

        // Items Table Header
        const tableTop = doc.y;
        const colWidths = [200, 60, 80, 80, 75];
        const colX = [50, 250, 310, 390, 470];

        doc.fillColor("#f1f5f9").rect(50, tableTop, 495, 25).fill();
        doc.fontSize(10).fillColor(darkColor);
        doc.text("Item / Service", colX[0] + 5, tableTop + 7);
        doc.text("Qty", colX[1] + 5, tableTop + 7, { align: "center", width: colWidths[1] - 10 });
        doc.text("Rate (₹)", colX[2] + 5, tableTop + 7, { align: "right", width: colWidths[2] - 10 });
        doc.text("Amount (₹)", colX[3] + 5, tableTop + 7, { align: "right", width: colWidths[3] - 10 });

        // Items
        let rowY = tableTop + 30;
        doc.fontSize(9).fillColor(darkColor);
        
        bill.items.forEach((item, index) => {
            if (index % 2 === 0) {
                doc.fillColor("#f8fafc").rect(50, rowY - 3, 495, 20).fill();
            }
            doc.fillColor(darkColor);
            doc.text(item.name, colX[0] + 5, rowY);
            if (item.description) {
                doc.fontSize(8).fillColor(mutedColor);
                doc.text(item.description, colX[0] + 5, rowY + 12, { width: colWidths[0] - 10 });
                doc.fontSize(9).fillColor(darkColor);
            }
            doc.text(item.quantity.toString(), colX[1] + 5, rowY, { align: "center", width: colWidths[1] - 10 });
            doc.text(item.unitPrice.toFixed(2), colX[2] + 5, rowY, { align: "right", width: colWidths[2] - 10 });
            doc.text(item.total.toFixed(2), colX[3] + 5, rowY, { align: "right", width: colWidths[3] - 10 });
            rowY += item.description ? 30 : 20;
        });

        doc.moveTo(50, rowY + 5).lineTo(545, rowY + 5).stroke();
        doc.moveDown(1);

        // Summary section
        const summaryX = 350;
        const summaryStart = doc.y;
        
        doc.fontSize(10).fillColor(mutedColor);
        doc.text("Subtotal:", summaryX, summaryStart, { align: "left" });
        doc.text(`₹${bill.subtotal.toFixed(2)}`, summaryX + 100, summaryStart, { align: "right", width: 95 });
        
        if (bill.taxAmount > 0) {
            doc.moveDown(0.3);
            doc.text(`GST (${bill.taxRate}%):`, summaryX, doc.y);
            doc.text(`₹${bill.taxAmount.toFixed(2)}`, summaryX + 100, doc.y - 12, { align: "right", width: 95 });
        }
        
        if (bill.discountAmount > 0) {
            doc.moveDown(0.3);
            doc.fillColor("#16a34a").text(`Discount (${bill.discountPercent}%):`, summaryX, doc.y);
            doc.text(`-₹${bill.discountAmount.toFixed(2)}`, summaryX + 100, doc.y - 12, { align: "right", width: 95 });
        }
        
        doc.moveDown(0.5);
        doc.strokeColor(primaryColor).lineWidth(1).moveTo(summaryX, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(0.3);
        
        doc.fontSize(12).fillColor(darkColor).text("Total Amount:", summaryX, doc.y);
        doc.fontSize(14).fillColor(primaryColor).text(`₹${bill.totalAmount.toFixed(2)}`, summaryX + 100, doc.y - 2, { align: "right", width: 95 });
        
        if (bill.amountPaid > 0) {
            doc.moveDown(0.5);
            doc.fontSize(10).fillColor(mutedColor);
            doc.text(`Amount Paid (${bill.paymentMethod || "N/A"}):`, summaryX, doc.y);
            doc.text(`₹${bill.amountPaid.toFixed(2)}`, summaryX + 100, doc.y - 12, { align: "right", width: 95 });
            
            doc.moveDown(0.3);
            doc.fillColor("#dc2626").text("Balance Due:", summaryX, doc.y);
            doc.text(`₹${bill.balanceDue.toFixed(2)}`, summaryX + 100, doc.y - 12, { align: "right", width: 95 });
        }

        doc.moveDown(2);

        // Notes
        if (bill.notes) {
            doc.fontSize(10).fillColor(darkColor).text("Notes:");
            doc.fillColor(mutedColor).text(bill.notes, { width: 495 });
            doc.moveDown(1);
        }

        // Footer
        doc.moveDown(2);
        doc.strokeColor("#e2e8f0").lineWidth(0.5).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(0.5);
        doc.fontSize(9).fillColor(mutedColor);
        doc.text("Thank you for choosing HealthCare+ Hospital. Wishing you a speedy recovery!", { align: "center" });
        doc.moveDown(0.3);
        doc.text("This is a computer-generated invoice and does not require a signature.", { align: "center" });
        doc.moveDown(0.3);
        doc.fillColor("#94a3b8").text("Educational/demo system - Not for official use", { align: "center", size: 8 });

        doc.end();
    } catch (err) {
        next(err);
    }
};
