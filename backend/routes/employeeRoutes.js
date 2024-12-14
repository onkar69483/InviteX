const express = require("express");
const { saveEmployeesToDatabase } = require("../controllers/employeeController");

const router = express.Router();

router.get("/fetch-employees", async (req, res) => {
  try {
    await saveEmployeesToDatabase();
    res.status(200).send("Employees data fetched and saved successfully.");
  } catch (error) {
    res.status(500).send("Error fetching and saving empyloyee data.");
  }
});

module.exports = router;
