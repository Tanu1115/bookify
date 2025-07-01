require ("dotenv").config();
const express  = require('express');
const path = require('path')
const connectDB = require("./config/db")
const app = express();

// routes
const userRouter = require ('./routes/userRouter');
const authRouter = require('./routes/authRouter')
const adminRouter = require('./routes/adminRouter')
const Book = require("./models/Book");

//connected to db
connectDB();

//Middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json())
//Public css folder
app.use(express.static("public"));

//html and ejs folder path 
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.use('/',userRouter);
app.use('/auth',authRouter);
app.use('/admin',adminRouter);

const PORT = process.env.PORT || 3000;
    app.listen(3000,()=>{
        console.log(`server running on this addres http://localhost:${PORT}`);
    });