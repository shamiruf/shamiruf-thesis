const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

const User = require("../../models/user");

// Creating routes
// @route  POST api/auth
// @desc   Auth user
// @access Public
router.post("/", (req, res) => {
  // User.find().then((users) => res.json(users));
  try {
    const { email, password } = req.body;
    // validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter full required fields" });
    }

    User.findOne({ email }).then((user) => {
      if (!user) {
        return res.status(401).json({
          errorMessage: "Wrong email or password. ",
        });
      }

      // Validate password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          return res.status(400).json({
            errorMessage: "Invalid credentials. ",
          });
        }
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
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

// @route  GET api/auth/user
// @desc   Get user data
// @access Private
router.get("/user", auth, (req, res) => {
  User.findById(req.user.user)
    .select("-password")
    .then((user) => res.json(user));
});

module.exports = router;
