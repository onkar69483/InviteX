const express = require("express");
const { handleEmployeeData } = require("../controllers/adminController");
const adminAuth = require("../middlewares/adminAuth");

const router = express.Router();

// Route for receiving and logging employee data (admin-protected)
router.post("/employee-data", adminAuth, handleEmployeeData);

module.exports = router;
