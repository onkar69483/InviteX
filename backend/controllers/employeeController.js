const Employee = require("../models/employee");

exports.saveEmployee = async (req, res) => {
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
    });

    await newEmployee.save();
    res.status(201).json({ message: "Employee data saved successfully" });
  } catch (error) {
    console.error("Error saving employee:", error);
    res.status(500).json({ message: "An error occurred while saving the employee data" });
  }
};
