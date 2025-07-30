const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const {
  getLogin, postLogin,getSignup, postSignup,logout, getForgotPassword,
   postForgotPassword,getResetPassword, postResetPassword, googleLogin, getProfile, getUserCart} = require('../controllers/authController');  // ⛔ Removed googleCallback

const router = express.Router();

router.get('/login', getLogin);
router.post('/login', postLogin);

router.get('/signup', getSignup);
router.post('/signup', postSignup);

router.get('/logout', logout);

// Forgot / Reset Password
router.get('/forgot', getForgotPassword);
router.post('/forgot', postForgotPassword);
router.get('/reset/:token', getResetPassword);
router.post('/reset/:token', postResetPassword);

// profile 
router.get('/profile',getProfile)
// router.get('/user/carts', getUserCart); // 👈 this should exist


// ✅ Google OAuth Routes
router.get('/google', googleLogin);

// ✅ Google Callback is handled inline here — not in controller
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/login',
    session: true
  }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.cookie('token', token, { httpOnly: true });
    res.redirect('/');
  }
);


module.exports = router;
