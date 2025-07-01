
const express = require ('express')
const router = express.Router();
const {addBook} = require('../controllers/adminController')
//require cloudinary
const {storage} = require('../utils/cloudinary')
const multer = require('multer');
const uploads = multer({storage})

router.get("/books/new", (req, res) => {
    res.render("admin/addBook");
});
router.post('/newBook',uploads.single('coverImage'),addBook); 

module.exports = router;