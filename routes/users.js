const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

//User model
const User = require("../models/User");
const { isLoggedIn } = require("../config/auth");
//Register
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //check required field
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  //passwords match
  if (password !== password2) {
    errors.push({ msg: "Password do not match" });
  }

  //check password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      password,
      password2,
      email,
    });
  } else {
    // Validation pass
    User.findOne({ email: email }).then((user) => {
      //User exist
      errors.push({ msg: "Email is already register" });
      if (user) {
        res.render("register", {
          errors,
          name,
          password,
          password2,
          email,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });
        // Hash password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // set password to hashed
            newUser.password = hash;

            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});
router.get("/login", (req, res) => {
  res.render("login");
});

//login handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
});

router.get('/u', (req,res)=>{
  User.find({}, (err, users)=>{
   
   users.forEach((item)=>{
     console.log(item.email);
    })
    
 res.send(users)


   })

})
module.exports = router;
