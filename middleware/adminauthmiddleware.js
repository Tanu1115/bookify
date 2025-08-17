const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.locals.admin = null;   // navbar ke liye
    return res.redirect('/login');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      res.locals.admin = null; // agar token invalid/expire hai
      return res.redirect('/login');
    }
    req.user = user;
    res.locals.admin = user;   // ✅ EJS ke liye available
    next();
  });
};

