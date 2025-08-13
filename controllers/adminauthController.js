const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const bcrypt = require('bcrypt');

exports.loginPage = (req, res) => {
  res.render('login', { admin: null });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.send('User not found');

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.send('Invalid credentials');

  const token = jwt.sign(
    { id: admin._id, name: admin.name, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.cookie('token', token, { httpOnly: true });
  res.redirect('/admin/dashboard');
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};
