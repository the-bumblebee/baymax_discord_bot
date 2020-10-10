const fs = require("fs");

function getTimeTable(callback) {
    let days = ["Monday", "Tuesday", "Wednesday", "Thurday", "Friday"];
    let currentDate = new Date();

    if (currentDate.getDay() === 6 || currentDate.getDay() === 0) dayNum = 0;
    else if (currentDate.getDay() === 5 && currentDate.getHours() > 17)
        dayNum = 0;
    else dayNum = currentDate.getDay() - 1;

    if (dayNum > 4) return;
    s = fs.readFile(
        `./TimeTable/${days[dayNum].substr(0, 3).toLowerCase()}.txt`,
        (err, data) => {
            callback(days[dayNum], data);
        }
    );
}

module.exports = getTimeTable;
