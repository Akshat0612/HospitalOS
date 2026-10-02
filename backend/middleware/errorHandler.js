const mongoose = require("mongoose");
const { fail } = require("../utils/apiResponse");

function errorHandler(err, req, res, next) {
    console.error(err);

    if (err instanceof mongoose.Error.CastError) {
        return fail(res, "Invalid identifier", null, 400);
    }

    if (err instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(err.errors).map((e) => ({
            field: e.path,
            msg: e.message
        }));
        return fail(res, "Validation failed", errors, 400);
    }

    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        return fail(res, "Invalid or expired token", null, 401);
    }

    const status = err.status || 500;
    const message =
        status === 500 ? "Internal server error" : err.message || "Request failed";

    return fail(res, message, err.errors || null, status);
}

module.exports = errorHandler;
