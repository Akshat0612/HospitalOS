const express = require("express");
const router = express.Router();

const { listDoctors, getSlots } = require("../controllers/doctorController");

router.get("/", listDoctors);
router.get("/slots", getSlots);

module.exports = router;
