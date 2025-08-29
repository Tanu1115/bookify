
const User = require('../models/user');
const Order = require('../models/Order');         
const Wishlist = require('../models/Cart');   
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


// Google OAuth Setup with Passport

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {
          user = new User({
            name: profile.displayName,
            email: email,
            password: 'google-auth' // dummy
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Session setup
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});


// Authentication Controllers


const getLogin = (req, res) => {
  res.render('auth/login');
};

const postLogin = async (req, res) => {
  const email = req.body.email?.trim();
  const password = req.body.password?.trim();

  try {
    const user = await User.findOne({ email });
    if (!user) return res.send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send('Incorrect password');

    //  Passport session setup
    req.login(user, (err) => {
      if (err) {
        console.error("Passport login error:", err);
        return res.send("Login session failed.");
      }

      //  Optional: Also setting JWT if needed
      const token = jwt.sign(
        { userId: user._id.toString() },
        String(process.env.JWT_SECRET),
        { expiresIn: '12h' }
      );

      res.cookie('token', token, { httpOnly: true });
      res.redirect('/');
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.send("Login Error: " + err.message);
  }
};

const getSignup = (req, res) => {
  res.render('auth/signup');
};

const postSignup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = new User({ name, email, password });
    await user.save();

    //  Passport login after signup
    req.login(user, (err) => {
      if (err) {
        console.error("Signup Session Error:", err);
        return res.send("Signup session error.");
      }

      const token = jwt.sign(
        { userId: user._id.toString() },
        String(process.env.JWT_SECRET),
        { expiresIn: '12h' }
      );

      res.cookie('token', token, { httpOnly: true });
      res.redirect('/');
    });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.send("Signup Error: " + err.message);
  }
};

const logout = async (req, res) => {
  req.logout((err) => {
    if (err) console.error("Logout error:", err);
    res.clearCookie('token', { path: '/' });
    res.redirect('/');
  });
};


// Forgot Password Flow


const getForgotPassword = (req, res) => {
  res.render('auth/forgot');
};

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

const getResetPassword = (req, res) => {
  const token = req.params.token;
  res.render("auth/reset", { token });
};

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


// Google Login Trigger


const googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email']
});


//  profile
const getProfile = async (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }

  try {
    const userId = req.user._id;

    //  Fetch total orders
    const ordersCount = await Order.countDocuments({ userId });

    //  Count of total items user added (sum of quantity)
    const orderCarts = await Order.aggregate([
      { $match: { userId } },
      { $unwind: '$items' },
      {
        $group: {
          _id: null,
          totalItems: { $sum: '$items.quantity' }
        }
      }
    ]);

    const totalItems = orderCarts[0]?.totalItems || 0;

    // User credit/wallet
    const credit = req.user.wallet || 0;

    // Fetch user details
    const userDetails = await User.findById(userId);

    //  Render the profile
    res.render('auth/profile', {
      user: userDetails,
      ordersCount,
      orderCarts: totalItems,
      credit
    });
  } catch (err) {
    console.error('Error loading profile:', err.message);
    res.status(500).send('Something went wrong while loading your profile.');
  }
};

 
module.exports = {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  logout,
  getForgotPassword,
  postForgotPassword,
  getResetPassword,
  postResetPassword,
  googleLogin,
  getProfile
};
