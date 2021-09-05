//jshint esversion:6

// LEVEL 2.5: using dotenv for environment variables, and adding .env to gitignore
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption"); <---- Added for Level 2, Encryption; Removing to use LEVEL 3: Hash Functions
// const md5 = require("md5");                     <---- Removing to use bcrypt for LEVEL 4: bcrypt and salting
// const bcrypt = require("bcrypt");               <---- Removing to use passport, passport-local, passport-local-mongoose, express-session for LEVEL 5
// const saltRounds = 10;
const session = require("express-session"); 
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy; // Adding for Level 6 - Google OAuth
const findOrCreate = require('mongoose-findorcreate') // To implement an actual .findOrCreate function

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

// Adding for LEVEL 5: Passport
// Tells app to use session
app.use(session({
    secret: "meeloisthecutestbaby",
    resave: false,
    saveUninitialized: false
}));

// Tells app to use passport and initialize it
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});
// Added for LEVEL 5 to remove a console deprecation warning
mongoose.set("useCreateIndex", true);

// LEVEL 1: username and password schema
const userSchema = new mongoose.Schema({
    email: String,
    password:  String,
    googleId: String, // <--- Adding for Google Auth
    secret: String
});

// LEVEL 2: For mongoose encryption
// const secret = "Thisisourlittlesecret";  <----- Commented for LEVEL 2.5 to put in .env instead
//                                                 Also, removed secret: secret below
// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']}); <---- Removing to use LEVEL 3: Hash Functions with md5

// Adding for LEVEL 5, allows use of passport-local-mongoose
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

// Copied from npm documentation on passport-local-mongoose
passport.use(User.createStrategy());
// For cookies and sessions
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser()); <----- Changing this is LEVEL 6 so it's not ONLY local authentication
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// Copied for LEVEL 6 from passport google auth documentation
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/auth/google", 
    passport.authenticate("google", {scope: ["profile"]})
);

app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  }
);

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

// Adding a GET for /secrets now that we've added authentication with passport
app.get("/secrets", (req, res) => {
    // Check if the user is authenticated. That's the only way they can directly access this
    // if (req.isAuthenticated()) { <--- Taking out in LEVEL 6 since we already authenticated or something?
    //     res.render("secrets");
    // }
    // else {
    //     res.redirect("/login");
    // }
    User.find({"secret": {$ne:null}}, (err, found) => {
        if (err) {
            console.log(err);
        }
        else {
            if (found) {
                res.render("secrets", {usersWithSecrets: found})
            }
        }
    });
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

app.get("/submit", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("submit");
    }
    else {
        res.redirect("/login");
    }
})

app.post("/submit", (req, res) => {
    const newSecret = req.body.secret;

    User.findById(req.user.id, (err, found) => {
        if (err) {
            console.log(err);
        }
        else {
            if (found) {
                found.secret = newSecret;
                found.save(() => {
                    res.redirect("/secrets");
                })
            }
        }
    });
});

app.post("/register", (req, res) => {
    
    User.register({username: req.body.username}, req.body.password, (err, result) => {
        if (err) {
            console.log(err);
            res.redirect("/register");
        }
        else {
            passport.authenticate("local")(req, res, () => { // Basically this'll save a cookie that makes it so the user doesn't have to login again, thanks to session package. Expires when browsing session ends
                res.redirect("/secrets");
            });
        }
    });

    // ======================= Commenting ALL of this out for LEVEL 5: Passport =========================
    // // LEVEL 4: Using bcrypt and salting. Put all old code into this new function
    // bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

    //     const newUser = new User({
    //         email: req.body.username,
    //         // password: req.body.password <---- Removing to use LEVEL 3: Hash Functions
    //         // password: md5(req.body.password) <---- Removing to use LEVEL 4: bcrypt and salting
    //         password: hash
    //     });

    //     newUser.save((err) => {
    //         if (err) {
    //             console.log(err);
    //         }
    //         else {
    //             res.render("secrets");
    //         }
    //     });        
    // });
});

app.post("/login", (req, res) => {

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    // Use passport to login and authenticate user
    req.login(user, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            passport.authenticate("local")(req, res, () => { // Sends cookie
                res.redirect("/secrets");
            });
        }
    })
    // ======================= Commenting ALL of this out for LEVEL 5: Passport =========================
    // const username = req.body.username;
    // // const password = md5(req.body.password); //Added md5 during LEVEL 3, removing for LEVEL 4
    // const password = req.body.password;

    // User.findOne({email: username}, (err, result) => {
    //     if (err) {
    //         console.log(err);
    //     }
    //     else {
    //         if (result) {
    //             // LEVEL 1: Find docuement and compare for authentication
    //             // if (result.password === password) { 
    //             //     res.render("secrets");
    //             // }
    //             bcrypt.compare(password, result.password, function(err, bcryptResult) {
    //                 if (bcryptResult === true){
    //                     res.render("secrets");
    //                 }
    //             });
    //         }
    //     }
    // });
});

app.listen(3000);