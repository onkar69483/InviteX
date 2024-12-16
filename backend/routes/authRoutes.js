const express = require("express");
const { registerAdmin, loginAdmin } = require("../controllers/authController");

const router = express.Router();

// Admin Registration
router.post("/register", registerAdmin);

// Admin Login
router.post("/login", loginAdmin);

module.exports = router;
