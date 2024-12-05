const express = require("express");
const { google } = require("googleapis");
let router = express.Router();
require("dotenv").config();

router.post("/schedule", async (req, res) => {
  try {
    const { pickup_location, destination_location, trip_date, trip_type } = req.body;

    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();
    const spreadsheetId = "1I7wjdAfmqP2YJO76tjxOa32NsVKnRx79oFB8UGzw4SE";
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
        values: [[pickup_location, destination_location, trip_date, trip_type]],
      },
    });

    return res.status(200).json({
      successMessage: "Booking request was sent successfully..",
    });

  } catch (error) {
    console.log(error, 'error here');
    return res.json({
      errorMessage: "Something went wrong.",
    });
  }
});

module.exports = router;
