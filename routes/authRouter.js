const express = require('express');
const router = express.Router();
const Middleware = require('../middleware/authmiddleware');
const {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  logout,
  getForgotPassword,
  postForgotPassword,
  getResetPassword,
  postResetPassword
} = require('../controllers/authController');

// Login
router.get("/login", getLogin);
router.post("/login", postLogin);

// Signup
router.get("/signup", getSignup);
router.post("/signup", postSignup);

// Logout
router.get("/logout", logout);

// Forgot Password
router.get("/forgot", getForgotPassword);       // show email form
router.post("/forgot", postForgotPassword);     // send reset link

// Reset Password
router.get("/reset/:token", getResetPassword);  // show new password form
router.post("/reset/:token", postResetPassword); // handle password update

module.exports = router;


