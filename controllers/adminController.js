const Book = require('../models/Book');

// 🏠 Admin Home (Dashboard)
const adminHome = (req, res) => {
  res.render('admin/adminhome', { 
    title: 'Admin Dashboard', 
    admin: req.user 
  });
};

// ➕ Add New Book
const addBook = async (req, res) => {
  try {
    const { title, author, price, description, language, pages, genre } = req.body;
    const imageUrl = req.file?.path; // multer file path (Cloudinary or local)

    await Book.create({
      title,
      author,
      price,
      description,
      language,
      pages,
      genre,
      coverImage: imageUrl
    });

    res.redirect('/admin/books');
  } catch (error) {
    res.status(500).send('Error saving book: ' + error.message);
  }
};

//  Get All Books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.render('admin/bookList', { books, admin: req.user });
  } catch (err) {
    res.status(500).send('Error loading books');
  }
};

// 🗑 Delete Book
const deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/admin/books');
  } catch (err) {
    res.status(500).send('Error deleting book');
  }
};

//  Get Edit Book Page
const getEditBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).send('Book not found');
    }
    res.render('admin/editBook', { book, admin: req.user });
  } catch (err) {
    res.status(500).send('Error loading edit form');
  }
};

// Update Book (Edit)
const postEditBook = async (req, res) => {
  try {
    const { title, author, price, description, language, pages, genre } = req.body;
    const updatedData = {
      title,
      author,
      price,
      description,
      language,
      pages,
      genre,
    };

    // Update cover image if a new file was uploaded
    if (req.file?.path) {
      updatedData.coverImage = req.file.path;
    }

    await Book.findByIdAndUpdate(req.params.id, updatedData);
    res.redirect('/admin/books');
  } catch (err) {
    res.status(500).send('Error updating book');
  }
};
module.exports = {
  adminHome,
  addBook,
  getAllBooks,
  deleteBook,
  getEditBook,
  postEditBook
};
