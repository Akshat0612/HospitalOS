const { body, param, query } = require("express-validator");

const STATUSES = ["requested", "confirmed", "completed", "cancelled"];

const createRules = [
    body("doctor").trim().notEmpty().withMessage("Doctor is required").isLength({ max: 200 }),
    body("date").trim().notEmpty().withMessage("Date is required"),
    body("time").trim().notEmpty().withMessage("Time is required")
];

const updateStatusRules = [
    param("id").isMongoId().withMessage("Invalid appointment id"),
    body("status")
        .trim()
        .notEmpty()
        .withMessage("Status is required")
        .isIn(STATUSES)
        .withMessage("Invalid status value")
];

const listRules = [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
    query("status").optional().isIn(STATUSES),
    query("view").optional().isIn(["all", "mine"])
];

module.exports = { createRules, updateStatusRules, listRules, STATUSES };
