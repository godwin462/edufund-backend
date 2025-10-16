const { initializePayment, verifyPayment } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/authenticationMiddleware');

const router = require('express').Router();

router.post('/make-payment/:id', authenticate, initializePayment);

router.get('/verify-payment', verifyPayment);

module.exports = router;
