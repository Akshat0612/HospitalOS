const { fail } = require("../utils/apiResponse");

module.exports = function staffOnly(req, res, next) {
    if (req.user && req.user.role === "staff") {
        return next();
    }
    return fail(res, "Staff access required", null, 403);
};
