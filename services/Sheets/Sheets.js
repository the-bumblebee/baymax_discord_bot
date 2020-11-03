const fs = require("fs");
const readline = require("readline");
const Calendar = require("../Calendar");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "./services/Sheets/token.json";

// Load client secrets from a local file.

function test(scheduleHandler) {
    fs.readFile("./services/Sheets/credentials.json", (err, content) => {
        if (err) return console.log("Error loading client secret file:", err);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), getSchedule, scheduleHandler);
    });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, scheduleHandler) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
    );

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback, scheduleHandler);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client, scheduleHandler);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback, scheduleHandler) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question("Enter the code from that page here: ", (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err)
                return console.error(
                    "Error while trying to retrieve access token",
                    err
                );
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log("Token stored to", TOKEN_PATH);
            });
            callback(oAuth2Client, scheduleHandler);
        });
    });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1eC0piLtXm8iCKsgDKUbaUcggO43g53C4bmK5WB1CH28
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function getSchedule(auth, scheduleHandler) {
    const sheets = google.sheets({ version: "v4", auth });
    let nowDate = new Date();
    let firstDate = new Date(nowDate.getYear(), nowDate.getMonth(), 1);
    const COLUMNS = ["B", "C", "D", "E", "F", "G", "H"];
    row = 3 + 6 * Math.floor((nowDate.getDate() + firstDate.getDay() + 1) / 7);
    column = COLUMNS[nowDate.getDay()];

    sheets.spreadsheets.values.get(
        {
            spreadsheetId: "1eC0piLtXm8iCKsgDKUbaUcggO43g53C4bmK5WB1CH28",
            range: `'November * 2020'!A3:I`,
        },
        (err, res) => {
            if (err) return console.log("The API returned an error: " + err);
            const rows = res.data.values;
            if (rows.length) {
                // Print columns A and E, which correspond to indices 0 and 4.
                // rows.map((row) => {
                //     console.log(`${row[0]}, ${row[4]}`);
                // });
                // let nDays = Calendar.getDaysInMonth(new Date().getMonth());
                // for (let day = 0; day < nDays; day += 1) {
                // }
                const max = rows.reduce((c, e) => {
                    const len = e.length;
                    return c < len ? len : c;
                }, 0);
                const values = rows.map((e) => {
                    const len = e.length;
                    let x = len < max ? e.concat(Array(max - len).fill("")) : e;
                    // tb.addRow(x, { autoEOL: true, stretch: true });
                    return x;
                });
                // console.log(values);
                Calendar.parseRows(values, (events) => {
                    scheduleHandler(events);
                });
            } else {
                console.log("No data found.");
            }
        }
    );
}

module.exports = {
    test,
};
