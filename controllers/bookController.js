const Book = require('../models/Book');

// 🏠 GET: Home Page - Show All Books
const getHomePage = async (req, res) => {
  try {
    const books = await Book.find({});
    res.render('user/home', {
      books,
      user: res.locals.user  // ✅ Pass user for navbar
    });
  } catch (err) {
    console.log("DB error:", err);
    res.status(500).send("Something went wrong");
  }
};

// 📖 GET: Book Details Page
const getbookdetails = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).send("Book not found");
    }

    res.render('user/bookdetails', {
      book,
      user: res.locals.user  // ✅ Again pass user for navbar
    });

  } catch (error) {
    console.log("Book Details Error:", error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  getHomePage,
  getbookdetails
};
