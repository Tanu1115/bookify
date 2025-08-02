const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.get("/payment", paymentController.renderPaymentPage);
router.post("/create-order", paymentController.createOrder);

module.exports = router;
