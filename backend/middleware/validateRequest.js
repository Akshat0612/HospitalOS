const { validationResult } = require("express-validator");
const { fail } = require("../utils/apiResponse");

module.exports = function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const mapped = errors.array().map((e) => ({
            field: e.path,
            msg: e.msg
        }));
        return fail(res, "Invalid input", mapped, 422);
    }
    next();
};
