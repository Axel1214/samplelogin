// server.js
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const connectDB = require("./db"); // Import connectDB function
const authMiddleware = require("./middlewares/authMiddleware"); // Import authMiddleware
const path = require("path"); // Import path module
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 2000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "anotherSecretKey456!",
    resave: false,
    saveUninitialized: true,
  })
);

// MongoDB connection
connectDB(); // Calls the function to connect to MongoDB

// Serve static files
app.use(express.static("public"));

// Set the views directory
app.set("views", path.join(__dirname, "views")); // Use path.join for cross-platform compatibility
app.set("view engine", "html"); // Set HTML as the view engine

// Public homepage route
app.get("/", (req, res) => {
  res.send("Welcome! Please log in or sign up.");
});

// Route to display the login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html")); // Correctly reference the login.html file
});

// Route to display the signup page
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "signup.html")); // Correctly reference the signup.html file
});

// Protected route middleware
app.use("/protected", authMiddleware);

// Routes
app.use("/", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
