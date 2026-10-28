// backend/middleware/adminMiddleware.js

function adminMiddleware(req, res, next) {
  // User login ane token verification thayelu hovu joie
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Please login first."
    });
  }

  // Fakt admin role ne permission
// console.log("Admin check:", req.user);

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only."
    });
  }

  next();
}


module.exports = adminMiddleware;