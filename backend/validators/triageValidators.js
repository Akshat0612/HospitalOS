const { body } = require("express-validator");

const triageRules = [
    body("symptoms").isArray({ min: 1 }).withMessage("Select at least one symptom"),
    body("symptoms.*").isString().trim().isLength({ min: 1, max: 80 }),
    body("severity").trim().isIn(["Low", "Medium", "High"]).withMessage("Invalid severity"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description must be less than 500 characters")
];

module.exports = { triageRules };
