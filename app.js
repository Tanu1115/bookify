require ("dotenv").config();
const express  = require('express');
const path = require('path');
const connectDB = require("./config/db");
const cookiesParser = require('cookie-parser');
const setUser = require('./middleware/setUser');

const app = express();

// Connect to DB
connectDB();

// Middleware (in correct order)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookiesParser());         // ✅ Cookie parser comes first
app.use(setUser);                 // ✅ Then setUser middleware

// Set static folder and views
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const userRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter');
const adminRouter = require('./routes/adminRouter');

app.use('/', userRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
