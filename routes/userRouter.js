const express = require ('express')
const router = express.Router();
const {getHomePage, getbookdetails} = require('../controllers/bookController')
const Book = require('../models/Book');
//homepage
router.get('/',getHomePage)

// bookdetails router page
router.get('/bookdetails/:id',getbookdetails);

module.exports = router;