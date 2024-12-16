const express = require("express");
const { permitEmployee } = require("../controllers/adminController");
const adminAuth = require("../middlewares/adminAuth");

const router = express.Router();

// Route for receiving and logging employee data (admin-protected)
router.post("/permit-employee", adminAuth, permitEmployee);

module.exports = router;
