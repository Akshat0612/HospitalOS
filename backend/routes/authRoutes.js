const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const validateRequest = require("../middleware/validateRequest");
const { registerRules, loginRules } = require("../validators/authValidators");

router.post("/register", registerRules, validateRequest, register);
router.post("/login", loginRules, validateRequest, login);

module.exports = router;
