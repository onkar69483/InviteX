const { appendToNewGoogleSheet } = require("../services/googleSheetsService");
const Employee = require("../models/Employee");

const permitEmployee = async (req, res) => {
  try {
    const { employeeNumber, familyMembers } = req.body;

    // Check if employee exists
    const employee = await Employee.findOne({ employeeId: employeeNumber });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if the employee has already attended the event
    if (employee.eventAttended) {
      return res.status(400).json({ message: "Event already attended" });
    }

    // Update family members' attendance status
    let eventAttended = false;
    familyMembers.forEach((member) => {
      const familyMember = employee.familyMembers.find(
        (fm) => fm.name === member.name && fm.relation === member.relation
      );
      if (familyMember) {
        familyMember.status = "Attended";
        eventAttended = true;
      }
    });

    // Set eventAttended to true if at least one family member attended
    employee.eventAttended = eventAttended;

    // Save the updated employee data
    await employee.save();

    // Prepare rows for Google Sheets
    const rowsToAdd = [];
    familyMembers.forEach((member) => {
      rowsToAdd.push([
        employee.employeeId,
        employee.name,
        employee.email,
        member.name,
        member.relation,
        "Attended",
      ]);
    });

    // Append data to the new Google Sheet
    await appendToNewGoogleSheet(rowsToAdd);

    res.status(200).json({ message: "Employee data updated successfully" });
  } catch (error) {
    console.error("Error in employeeData:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { permitEmployee };
