/**
 * Standard API envelope for predictable clients and documentation.
 */
function success(res, message, data = {}, status = 200) {
    return res.status(status).json({
        success: true,
        message,
        data
    });
}

function fail(res, message, errors = null, status = 400) {
    const body = { success: false, message };
    if (errors && errors.length) {
        body.errors = errors;
    }
    return res.status(status).json(body);
}

module.exports = { success, fail };
