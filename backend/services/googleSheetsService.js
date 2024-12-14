const { google } = require("googleapis");
const QRCode = require("qrcode");
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

  const employees = await Promise.all(
    rows.map(async (row) => {
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
      if (member1Name && member1Relation)
        familyMembers.push({ name: member1Name, relation: member1Relation, status: "Pending" });
      if (member2Name && member2Relation)
        familyMembers.push({ name: member2Name, relation: member2Relation, status: "Pending" });
      if (member3Name && member3Relation)
        familyMembers.push({ name: member3Name, relation: member3Relation, status: "Pending" });
      if (member4Name && member4Relation)
        familyMembers.push({ name: member4Name, relation: member4Relation, status: "Pending" });

      const qrCodeData = {
        employeeId: employeeNumber,
        name: employeeName,
        phoneNumber,
        uniqueKey: `${employeeNumber}-${Date.now()}` // Ensure uniqueness with timestamp
      };
      const qrCode = await QRCode.toDataURL(JSON.stringify(qrCodeData));

      // Create employee object
      return {
        employeeId: employeeNumber,
        name: employeeName,
        phoneNumber: phoneNumber,
        familyMembers,
        eventAttended: false, 
        qrCode,
      };
    })
  );

  return employees;
};

module.exports = { fetchGoogleSheetData };
