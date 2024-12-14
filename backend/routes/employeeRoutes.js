const express = require("express");
const { saveEmployee, saveByFetch } = require("../controllers/employeeController");

const router = express.Router();

// POST /api/employee/save
router.post("/save", saveEmployee);

//GET api to fetch employees from gsheets and save in database
router.get("/fetch-employees", async (req, res) => {
    try {
      await saveByFetch();
      res.status(200).send("Employees data fetched and saved successfully.");
    } catch (error) {
      res.status(500).send("Error fetching and saving empyloyee data.");
    }
  });

module.exports = router;
