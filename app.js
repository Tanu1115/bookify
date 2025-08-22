require("dotenv").config();
const express = require('express');
const path = require('path');
const connectDB = require("./config/db");
const cookiesParser = require('cookie-parser');
const session = require('express-session'); //  Add this
const passport = require("passport"); //  Add passport

const setUser = require('./middleware/setUser');

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookiesParser());

// Session Middleware (required for passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourSecretKey", // 
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 1000 * 60 * 24 * 30, // 1 day
    },
  })
);

//  Initialize passport
app.use(passport.initialize());
app.use(passport.session());

//  Make user available in all views (very important for EJS)
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});




// Set static and views
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const userRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter');
const adminRouter = require('./routes/adminRouter');
const paymentRouter = require('./routes/paymentRouter');  // Fixes the error



app.use('/', userRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/', paymentRouter);


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
