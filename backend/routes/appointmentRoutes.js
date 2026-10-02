const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
    createRules,
    updateStatusRules,
    listRules
} = require("../validators/appointmentValidators");
const {
    createAppointment,
    getAppointments,
    updateStatus,
    cancelAppointment,
    linkBillToAppointment,
    updatePaymentStatus
} = require("../controllers/appointmentController");

router.get("/", auth, listRules, validateRequest, getAppointments);
router.post("/", auth, createRules, validateRequest, createAppointment);
router.put("/:id/status", auth, updateStatusRules, validateRequest, updateStatus);
router.post("/:id/cancel", auth, cancelAppointment);
router.post("/link-bill", auth, linkBillToAppointment);
router.post("/update-payment", auth, updatePaymentStatus);

module.exports = router;
