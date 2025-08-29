
const express = require("express");
const router = express.Router();

const {
  getHomePage,
  getbookdetails,
  getContactPage,
  postContactPage,
  getAboutPage,
  getthankyou,
} = require("../controllers/bookController");

const {
  addToCart,
  getCartPage,
  getCheckoutPage,
  placeOrder,
  removeFromCart,
  getOrderSuccessPage,
  createRazorpayOrder,
  verifyPayment,
} = require("../controllers/CartController");

router.get("/", getHomePage);
router.get("/bookdetails/:id", getbookdetails);
router.post("/add-to-cart/:id", addToCart);
router.get("/cart", getCartPage);
router.get("/checkout", getCheckoutPage);
router.post("/checkout", placeOrder);
router.get("/cart/remove/:id", removeFromCart);

// router.get("/order/success", getOrderSuccessPage);


// Contact Page
router.get("/contact", getContactPage);
router.post("/contact", postContactPage);
router.get("/thankyou", getthankyou);
router.get("/about", getAboutPage);

module.exports = router;
