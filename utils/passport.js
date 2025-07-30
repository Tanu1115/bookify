const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user'); // adjust path accordingly

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) return done(null, existingUser);

        const newUser = await User.create({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
        });

        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// ✅ Required for session support
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
