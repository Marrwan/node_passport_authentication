const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const app = express();
const passport = require("passport");
const path = require("path");

require('dotenv').config()
//Database
const db = process.env.mongoURI;
// passport config
require("./config/passport")(passport);

// connect to mongo

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
// flash
app.use(flash());
//BodyParser
app.use(express.urlencoded({ extended: false }));
//public
app.use(express.static(path.join(__dirname, "public")));
// Express session

app.use(
  session({
    secret: "Abdulbasit",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport MiddleWare
app.use(passport.initialize());
app.use(passport.session());
//global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");

  next();
});

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening at http://localhost:${port}`));
