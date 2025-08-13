const express = require('express');
const router = express.Router();

const {
  adminHome,
  addBook,
  getAllBooks,
  deleteBook,
  getEditBook,
  postEditBook
} = require('../controllers/adminController');

const { authenticateToken } = require('../middleware/adminauthmiddleware');
const { storage } = require('../utils/cloudinary');
const multer = require('multer');
const uploads = multer({ storage });

// 👀 Admin Home Page (Dashboard) — NO authentication now
router.get('/', adminHome);

// ➕ Add New Book Form — authentication required
router.get('/books/new', authenticateToken, (req, res) => {
  res.render('admin/addBook', { title: 'Add Book', admin: req.user });
});

// 📥 Create New Book — authentication required
router.post('/newBook', authenticateToken, uploads.single('coverImage'), addBook);

// 📚 List All Books — authentication required
router.get('/books', authenticateToken, getAllBooks);

// 🗑 Delete Book — authentication required
router.post('/books/:id/delete', authenticateToken, deleteBook);

// ✏ Edit Book Form — authentication required
router.get('/books/:id/edit', authenticateToken, getEditBook);

// 💾 Update Book — authentication required
router.post('/books/:id/edit', authenticateToken, uploads.single('coverImage'), postEditBook);

module.exports = router;
