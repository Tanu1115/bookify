
const Book = require('../models/Book')
//homepage show all book
const getHomePage = async (req,res) =>{
    try{
        const books = await Book.find({});
        console.log(books);
        const user = req.session?.user || null;
         res.render('user/home', {books, user});                                                                   
         }catch (err){
             console.log("DB error:" ,err);
             res.status(500).send("Something went wrong");
         }
};

const getbookdetails = async (req,res) =>{
    try{
        const book = await Book.findById(req.params.id);
        if (!book){
            return res.status(404).send("book not found");
        }
            res.render('user/bookdetails',{
                book,
                user: req.user ||null
            });

        } catch (error){
            console.log(error);
            res.status(500).send("server error");
        }
    }
module.exports = {
    getHomePage,
    getbookdetails
    
};
