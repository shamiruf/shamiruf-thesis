const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

// Creating routes
// @route  POST api/users
// @desc   Register new user
// @access Public
// "/" represents api/users endpoint
router.post("/", (req, res) => {
  // User.find().then((users) => res.json(users));
  try {
    const { name, email, password } = req.body;
    // validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter full required fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        errorMessage: "Please enter a password of at least 6 characters. ",
      });
    }

    User.findOne({ email }).then((user) => {
      if (user) {
        return res.status(400).json({
          errorMessage: "User already exists. ",
        });
      }
      const newUser = new User({ name, email, password });

      // Create salt & hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save().then((user) => {
            // log in the user
            jwt.sign(
              {
                user: user.id,
              },
              process.env.JWT_SECRET,
              (err, token) => {
                if (err) throw err;
                res.json({
                  token,
                  user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                  },
                });
              }
            );
          });
        });
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

module.exports = router;
