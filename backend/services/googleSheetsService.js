const { google } = require("googleapis");
const getGoogleSheetsAuth = require("../config/googleSheets");

const fetchGoogleSheetData = async () => {
  const auth = getGoogleSheetsAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const spreadsheetId = process.env.SPREADSHEET_ID;
  
  const range = "Sheet1!A2:M";

  const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  
  const rows = response.data.values;

  if (!rows || rows.length === 0) {
    console.log("No data found.");
    return [];
  }

  // Process the rows to extract employee data and family members
  const employees = rows.map((row) => {
    const [
      timestamp,
      email,
      employeeName,
      employeeNumber,
      phoneNumber,
      member1Name,
      member1Relation,
      member2Name,
      member2Relation,
      member3Name,
      member3Relation,
      member4Name,
      member4Relation,
    ] = row;

    // Create an array of family members
    const familyMembers = [];
    if (member1Name && member1Relation) familyMembers.push({ name: member1Name, relation: member1Relation, status: "Pending" });
    if (member2Name && member2Relation) familyMembers.push({ name: member2Name, relation: member2Relation, status: "Pending" });
    if (member3Name && member3Relation) familyMembers.push({ name: member3Name, relation: member3Relation, status: "Pending" });
    if (member4Name && member4Relation) familyMembers.push({ name: member4Name, relation: member4Relation, status: "Pending" });

    // Create employee object
    return {
      employeeId: employeeNumber,  // Using employeeNumber as the unique employeeId
      email: email,
      name: employeeName,
      phoneNumber: phoneNumber,
      familyMembers,
      eventAttended: false,  // Default value
    };
  });

  return employees;
};

module.exports = { fetchGoogleSheetData };