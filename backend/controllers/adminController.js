
// Controller for handling employee data
exports.handleEmployeeData = (req, res) => {
    const { email, name, employeeNumber, phoneNumber, familyMembers } = req.body;
  
    // Validate input
    if (!email || !name || !employeeNumber || !phoneNumber || !familyMembers) {
      return res.status(400).json({ message: "All fields are required." });
    }
  
    // Print received data to the console
    console.log("Received Employee Data:");
    console.log("Email:", email);
    console.log("Name:", name);
    console.log("Employee Number:", employeeNumber);
    console.log("Phone Number:", phoneNumber);
    console.log("Family Members Attending:", familyMembers);
  
    // Send success response
    res.status(200).json({
      message: "Employee data received successfully.",
      data: { email, name, employeeNumber, phoneNumber, familyMembers },
    });
  
    // Note: Later, logic to save to Google Sheets or MongoDB will go here.
  };
  