const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { success, fail } = require("../utils/apiResponse");

function signToken(user) {
    return jwt.sign(
        { id: user._id.toString(), role: user.role || "patient" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
}

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, staffCode } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return fail(res, "User already exists", null, 409);
        }

        const hashed = await bcrypt.hash(password, 10);

        let role = "patient";
        const onboard = process.env.STAFF_ONBOARD_CODE;
        if (onboard && staffCode && staffCode === onboard) {
            role = "staff";
        }

        const user = await User.create({
            name,
            email,
            password: hashed,
            role
        });

        return success(
            res,
            "Registered successfully",
            { userId: user._id, role: user.role },
            201
        );
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return fail(res, "Invalid credentials", null, 401);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return fail(res, "Invalid credentials", null, 401);
        }

        const token = signToken(user);

        return success(res, "Login successful", {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
};