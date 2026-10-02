const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
    createRules,
    idParamRules,
    listRules,
    paymentRules
} = require("../validators/billingValidators");
const {
    createBill,
    getBills,
    getBillById,
    recordPayment,
    cancelBill,
    downloadReceipt,
    getProcedureRates
} = require("../controllers/billingController");

router.get("/", auth, listRules, validateRequest, getBills);
router.get("/procedures", auth, getProcedureRates);
router.post("/", auth, createRules, validateRequest, createBill);
router.get("/:id", auth, idParamRules, validateRequest, getBillById);
router.patch("/:id/pay", auth, idParamRules, paymentRules, validateRequest, recordPayment);
router.patch("/:id/cancel", auth, idParamRules, validateRequest, cancelBill);
router.get("/:id/receipt", auth, idParamRules, validateRequest, downloadReceipt);

module.exports = router;
