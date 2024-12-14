const Employee = require("../models/Employee");
const { fetchGoogleSheetData } = require("../services/googleSheetsService");


//save employee on submission of gform
const saveEmployee = async (req, res) => {
  try {
    const {
      email,
      name,
      employeeNumber,
      phoneNumber,
      familyMembers = [],
    } = req.body;

    // Validate required fields
    if (!email || !name || !employeeNumber || !phoneNumber) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Check if the employee already exists
    const existingEmployee = await Employee.findOne({ employeeId: employeeNumber });
    if (existingEmployee) {
      return res
        .status(400)
        .json({ message: "Employee with this ID already exists" });
    }

    // Format family members (if provided)
    const formattedFamilyMembers = familyMembers.map((member) => ({
      name: member.name,
      relation: member.relation,
    }));

    // Create and save the new employee
    const newEmployee = new Employee({
      employeeId: employeeNumber,
      email,
      name,
      phoneNumber,
      familyMembers: formattedFamilyMembers,
      eventAttended: false,
    });

    await newEmployee.save();
    res.status(201).json({ message: "Employee data saved successfully" });
  } catch (error) {
    console.error("Error saving employee:", error);
    res.status(500).json({ message: "An error occurred while saving the employee data" });
  }
};


// save employee by fetching form data
const saveByFetch = async () => {
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

module.exports = { saveEmployee, saveByFetch };
