// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.session.token;
  if (!token) {
    return res.redirect("/login.html");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.redirect("/login.html");
  }
};

module.exports = (req, res, next) => {
  const publicRoutes = ["/login", "/signup", "/"]; // Allow access to these routes
  if (req.session.token || publicRoutes.includes(req.path)) {
    return next(); // User is authenticated or accessing a public route
  }
  return res.redirect("/login"); // Redirect to login for protected routes
};

module.exports = authMiddleware;
