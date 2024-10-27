// routes/auth.js
const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

// Signup Route
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(400).send("Error registering user");
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send("Invalid credentials");
    }

    // Generate a token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    req.session.token = token; // Save token in session
    res.send("Login successful");
  } catch (error) {
    res.status(400).send("Error logging in");
  }
});

// Signup Route
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  console.log("Received data:", { username, password }); // Log received data
  try {
    const user = new User({ username, password });
    await user.save();
    console.log("User registered:", user); // Log registered user
    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error("Error registering user:", error); // Log any errors
    res.status(400).send("Error registering user");
  }
});

// Middleware to check authentication
router.use(authMiddleware);

module.exports = router;
