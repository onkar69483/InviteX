const Employee = require("../models/Employee");
const { fetchGoogleSheetData } = require("../services/googleSheetsService");

const saveEmployeesToDatabase = async () => {
  try {
    console.log("Fetching data...");

    const employees = await fetchGoogleSheetData(); 

    if (employees.length === 0) {
      console.log("No employees data to save.");
      return;
    }

    // Save the fetched employees to the database
    for (let employee of employees) {
      try {
        // Check if the employee already exists in the database
        const existingEmployee = await Employee.findOne({ employeeId: employee.employeeId });

        if (!existingEmployee) {
          const newEmployee = new Employee(employee);
          await newEmployee.save();
          console.log(`Employee ${employee.employeeId} saved successfully!`);
        } else {
          console.log(`Employee ${employee.employeeId} already exists in the database.`);
        }
      } catch (error) {
        console.error(`Error saving employee ${employee.employeeId}:`, error.message);
        throw err;
      }
    }

    console.log("Employees saved successfully!");
  } catch (err) {
    console.error("Error saving employees:", err.message);
    throw err;
  }
};

module.exports = { saveEmployeesToDatabase };
