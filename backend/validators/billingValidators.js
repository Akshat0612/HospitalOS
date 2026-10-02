const { body, param, query } = require("express-validator");

const SERVICE_SET = ["Consultation", "Surgery", "Medicine"];

function matchesServiceToken(val) {
    const s = String(val).toLowerCase();
    return (
        s.includes("consultation") || s.includes("surgery") || s.includes("medicine")
    );
}

const createRules = [
    // Patient details
    body("patientName")
        .trim()
        .notEmpty()
        .withMessage("Patient name is required")
        .isLength({ max: 100 })
        .withMessage("Patient name must be less than 100 characters"),
    body("patientAge")
        .optional()
        .isInt({ min: 0, max: 150 })
        .withMessage("Age must be between 0 and 150"),
    body("patientGender")
        .optional()
        .isIn(["male", "female", "other", ""])
        .withMessage("Gender must be male, female, or other"),
    body("patientPhone")
        .optional()
        .trim()
        .matches(/^[0-9+\-\s()]{10,15}$/)
        .withMessage("Invalid phone number format"),
    body("patientEmail")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Invalid email format"),

    // Doctor details
    body("doctor")
        .isObject()
        .withMessage("Doctor details are required"),
    body("doctor.name")
        .trim()
        .notEmpty()
        .withMessage("Doctor name is required"),
    body("doctor.specialization")
        .optional()
        .trim(),

    // Items array
    body("items")
        .optional()
        .isArray()
        .withMessage("Items must be an array"),
    body("items.*.name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Item name is required"),
    body("items.*.quantity")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1"),
    body("items.*.unitPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Unit price must be a positive number"),

    // Financial fields
    body("taxRate")
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage("Tax rate must be between 0 and 100"),
    body("discountPercent")
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage("Discount must be between 0 and 100"),
    body("notes")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Notes must be less than 500 characters"),
    body("dueDate")
        .optional()
        .isISO8601()
        .withMessage("Due date must be a valid date")
];

const idParamRules = [param("id").isMongoId().withMessage("Invalid bill id")];

const listRules = [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
    query("paymentStatus")
        .optional()
        .isIn(["draft", "pending", "partial", "paid", "cancelled", "refunded"]),
    query("search")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Search query too long")
];

const paymentRules = [
    body("amount")
        .isFloat({ min: 0.01 })
        .withMessage("Payment amount must be greater than 0"),
    body("paymentMethod")
        .optional()
        .isIn(["cash", "card", "upi", "netbanking", "insurance", "wallet"])
        .withMessage("Invalid payment method")
];

module.exports = { createRules, idParamRules, listRules, paymentRules, SERVICE_SET };
