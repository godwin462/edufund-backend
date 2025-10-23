const {initializePayment, verifyPayment} = require("../controllers/paymentController");
const {isAuthenticated} = require("../middleware/authenticationMiddleware");

const router = require("express").Router();

router.post("/make-payment/:id", isAuthenticated, initializePayment);

router.get("/verify-payment", verifyPayment);

module.exports = router;
