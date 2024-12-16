const { verifyToken } = require("../utils/jwtUtils");
const Admin = require("../models/Admin");

const adminAuth = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Authorization token is missing." });
  }

  try {
    const decoded = verifyToken(token);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = adminAuth;
