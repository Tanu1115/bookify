const express = require ('express');
const router = express.Router();

const {getLogin, postLogin, getSignup, postSignup} = require('../controllers/authController')
// For login
router.get("/login", getLogin)
router.post("/login",postLogin)

// singup
router.get("/signup", getSignup)
router.post("/signup", postSignup)

module.exports = router;

