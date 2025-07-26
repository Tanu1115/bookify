const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Render Login Page
const getLogin = (req, res) => {
  res.render('auth/login');
};

// Handle Login POST
const postLogin = async (req, res) => {
  const email = req.body.email?.trim();
  const password = req.body.password?.trim();

  try {
    const user = await User.findOne({ email });

    if (!user) return res.send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send('Incorrect password');

    const token = jwt.sign(
      { userId: user._id.toString() },
      String(process.env.JWT_SECRET),
      { expiresIn: '12h' }
    );

    res.cookie('token', token, { httpOnly: true });
    res.redirect('/');
  } catch (err) {
    console.error("Login Error:", err.message);
    res.send("Login Error: " + err.message);
  }
};

// Render Signup Page
const getSignup = (req, res) => {
  res.render('auth/signup');
};

// Handle Signup POST
const postSignup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = new User({ name, email, password }); // password will be hashed in model (if setup)
    await user.save();

    const token = jwt.sign(
      { userId: user._id.toString() },
      String(process.env.JWT_SECRET),
      { expiresIn: '12h' }
    );

    res.cookie('token', token, { httpOnly: true });
    res.redirect('/');
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.send("Signup Error: " + err.message);
  }
};

// Logout
const logout = async (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.redirect('/');
};



// =====================
// Forgot Password Flow
// =====================

// 1. GET: Show forgot form
const getForgotPassword = (req, res) => {
  res.render('auth/forgot');
};

// 2. POST: Handle email and send reset link
const postForgotPassword = async (req, res) => {
  const email = req.body.email?.trim();
  try {
    const user = await User.findOne({ email });
    if (!user) return res.send("User not found");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `http://localhost:3000/auth/reset/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_ID,
      to: email,
      subject: "Password Reset Link",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 15 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.send("Password reset link sent to your email.");
  } catch (err) {
    console.error("Forgot Password Error:", err.message);
    res.send("Something went wrong: " + err.message);
  }
};

// 3. GET: Show reset password form
const getResetPassword = (req, res) => {
  const token = req.params.token;
  res.render("auth/reset", { token });
};

// 4. POST: Handle new password submission
const postResetPassword = async (req, res) => {
  const { password } = req.body;
  const token = req.params.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.send("User not found");

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.send("Password reset successful. You can now login.");
  } catch (err) {
    console.error("Reset Password Error:", err.message);
    res.send("Invalid or expired token.");
  }
};



// Export all functions


module.exports = {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  logout,
  getForgotPassword,
  postForgotPassword,
  getResetPassword,
  postResetPassword
};
