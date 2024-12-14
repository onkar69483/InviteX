const express = require("express");
const { saveEmployee } = require("../controllers/employeeController");

const router = express.Router();

// POST /api/employee/save
router.post("/save", saveEmployee);

module.exports = router;
