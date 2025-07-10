const express = require ('express');
const router = express.Router();
const Middleware = require('../middleware/authmiddleware')
const {getLogin, postLogin, getSignup, postSignup, logout} = require('../controllers/authController')
// For login
router.get("/login", getLogin)
router.post("/login",postLogin)

// singup
router.get("/signup", getSignup)
router.post("/signup", postSignup)

router.get('/logout', logout);

module.exports = router;

