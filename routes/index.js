const express = require("express");
const { isLoggedIn } = require("../config/auth");
const router = express.Router();

router.get("/", (req, res) => {
  res.render('welcome')
});

router.get("/dashboard", isLoggedIn, (req, res) => {
  res.render('dashboard', {
    name: req.user.name
  })
});


module.exports = router;
