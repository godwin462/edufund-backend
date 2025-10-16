const { createProduct, getAll, getOne } = require('../controllers/product');
const { authenticate, adminAuth } = require('../middleware/authenticationMiddleware');

const router = require('express').Router();

router.post('/create-product', authenticate, adminAuth, createProduct);

router.get('/products', getAll);

router.get('/products/:id', getOne);

module.exports = router;
