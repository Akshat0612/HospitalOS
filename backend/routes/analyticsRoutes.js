const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const staffOnly = require("../middleware/staffOnly");
const { summary } = require("../controllers/analyticsController");

router.get("/summary", auth, staffOnly, summary);

module.exports = router;
