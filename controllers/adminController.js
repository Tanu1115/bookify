
const Book = require('../models/Book')
// Handle form submission
const addBook= async (req, res) => {
    try { 
        const { title, author, price, description, language, pages, genre} =req.body;
        const imageUrl = req.file?.path;
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
        res.redirect("/"); 
    } catch (error) {
        res.status(500).send("Error saving book: " + error.message);
    }
};
module.exports = {
    addBook
};