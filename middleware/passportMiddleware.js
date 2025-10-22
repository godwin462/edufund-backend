const passport = require("passport");
const userModel = require("../models/userModel");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
/* {
  id: "102865399472616253769",
  displayName: "Chukwubuikem Anadu",
  name: { familyName: "Anadu", givenName: "Chukwubuikem" },
  emails: [{ value: "anadulimited@gmail.com", verified: true }],
  photos: [
    {
      value:
        "https://lh3.googleusercontent.com/a/ACg8ocISv0HH-e_RSLhPkmVk3KaMLvKqL_Znc6HcsTsKaUeLHhulfA=s96-c",
    },
  ],
  provider: "google",
  _raw:
    "{\n" +
    '  "sub": "102865399472616253769",\n' +
    '  "name": "Chukwubuikem Anadu",\n' +
    '  "given_name": "Chukwubuikem",\n' +
    '  "family_name": "Anadu",\n' +
    '  "picture": "https://lh3.googleusercontent.com/a/ACg8ocISv0HH-e_RSLhPkmVk3KaMLvKqL_Znc6HcsTsKaUeLHhulfA\\u003ds96-c",\n' +
    '  "email": "anadulimited@gmail.com",\n' +
    '  "email_verified": true\n' +
    "}",
  _json: {
    sub: "102865399472616253769",
    name: "Chukwubuikem Anadu",
    given_name: "Chukwubuikem",
    family_name: "Anadu",
    picture:
      "https://lh3.googleusercontent.com/a/ACg8ocISv0HH-e_RSLhPkmVk3KaMLvKqL_Znc6HcsTsKaUeLHhulfA=s96-c",
    email: "anadulimited@gmail.com",
    email_verified: true,
  },
}; */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:1234/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        console.log(profile);
        const user = await userModel.find({ email: profile._json.email });
        // console.log(user);
        if (user) return cb(null, user);

        const newUser = await userModel.create({
          fullName: profile._json.name,
          email: profile._json.email,
          isVerified: profile._json.email_verified,
          profilePic: profile._json.picture,
        });
        // console.log(user);
        return cb(null, newUser);
      } catch (error) {
        console.log(`Google AuthStrategy Error`, error);
        cb(error);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  console.log(user);
  cb(null, user._id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await userModel.findById(id);
    console.log(user);
    cb(null, user);
  } catch (error) {
    cb(error);
  }
});
module.exports = passport;
// const profile = passport.authenticate("google", {
//   scope: ["profile", "email"],
// });

// module.exports = profile;
