const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    if (!user) return res.send(' User not found');

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.send(' Incorrect password');

    const token = jwt.sign(
      { userId: user._id.toString() },
      String(process.env.JWT_SECRET),
      { expiresIn: '1h' }
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

// Handle Signup POST ( No Hashing Here)
const postSignup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Send raw password; model will hash it
    const user = new User({ name, email, password });
    await user.save(); // password will be hashed in model

    const token = jwt.sign(
      { userId: user._id.toString() },
      String(process.env.JWT_SECRET),
      { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true });
    res.redirect('/');
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.send("Signup Error: " + err.message);
  }
}
 const logout = async (req, res) => {
  res.clearCookie('token', { path: '/' });
    res.redirect('/');
  };


module.exports = {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  logout
};
