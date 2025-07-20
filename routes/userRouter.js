
const express = require('express');
const router = express.Router();

const { getHomePage, getbookdetails } = require('../controllers/bookController');
const { addToCart, getCartPage, getCheckoutPage, placeOrder, getOrderSuccessPage } = require('../controllers/CartController');

// Home Page
router.get('/', getHomePage);

// Book Details
router.get('/bookdetails/:id', getbookdetails);

// Add to Cart
router.post('/add-to-cart/:id', addToCart);

// Cart Page
router.get('/cart', getCartPage);

// Checkout Page
router.get('/checkout', getCheckoutPage);
router.post('/checkout', placeOrder);

// ✅ Order Success Page (Fixed)
router.get('/order/success', getOrderSuccessPage);



module.exports = router;
