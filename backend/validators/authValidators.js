const { body } = require("express-validator");

const registerRules = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ max: 120 })
        .withMessage("Name is too long"),
    body("email").trim().isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password")
        .isLength({ min: 3, max: 128 })
        .withMessage("Password must be 3–128 characters"),
    body("staffCode")
        .optional()
        .isString()
        .trim()
];

const loginRules = [
    body("email").trim().isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required")
];

module.exports = { registerRules, loginRules };
