const Admin = require("../models/Admin");
const { generateToken } = require("../services/jwtUtils");

// Admin Registration
const registerAdmin = async (req, res) => {
  const { username, password, registrationKey } = req.body;

  // Validate input
  if (!username || !password || !registrationKey) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Validate registration key
  if (registrationKey !== process.env.ADMIN_REGISTRATION_SECRET) {
    return res.status(403).json({ message: "Invalid registration key." });
  }

  try {
    // Check if the admin username already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin username already exists." });
    }

    // Create new admin
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    return res.status(201).json({ message: "Admin registered successfully." });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error." });
  }
};

// Admin Login
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Match password
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Generate token
    const token = generateToken({ id: admin._id, username: admin.username });
    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { registerAdmin, loginAdmin };
