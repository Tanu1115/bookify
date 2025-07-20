
const express = require('express');
const router = express.Router();
const {
  addBook,
  getAllBooks,
  deleteBook,
  getEditBook,
  postEditBook
} = require('../controllers/adminController');

// Cloudinary setup
const { storage } = require('../utils/cloudinary');
const multer = require('multer');
const uploads = multer({ storage });

// Add new book form
router.get("/books/new", (req, res) => {
  res.render('admin/addBook', { title: 'Add Book' });
});

// Create new book
router.post('/newBook', uploads.single('coverImage'), addBook);

// List all books
router.get('/books', getAllBooks);

// Delete a book
router.post('/books/:id/delete', deleteBook);

// Edit book form
router.get('/books/:id/edit', getEditBook);

// Update book (with optional new image)
router.post('/books/:id/edit', uploads.single('coverImage'), postEditBook);

module.exports = router;
