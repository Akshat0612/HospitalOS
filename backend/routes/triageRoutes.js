const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const { triageRules } = require("../validators/triageValidators");
const { runTriage, getHistory } = require("../controllers/triageController");

router.post("/", auth, triageRules, validateRequest, runTriage);
router.get("/history", auth, getHistory);

module.exports = router;
