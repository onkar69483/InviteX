const { google } = require("googleapis");

const getGoogleSheetsAuth = () => {
  const credentials = JSON.parse(process.env.GOOGLE_SHEET_CREDENTIALS);

  return new google.auth.GoogleAuth({
    credentials,  
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
};

module.exports = getGoogleSheetsAuth;
