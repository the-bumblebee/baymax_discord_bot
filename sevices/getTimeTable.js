const fs = require('fs');

function getTimeTable(nextDay, callback) {
    let days = ['Monday', 'Tuesday', 'Wednesday', 'Thurday', 'Friday'];
    dayNum = (new Date().getDay() - 1 + nextDay) % 7;
    if (dayNum > 4) return;
    s = fs.readFile(`./TimeTable/${days[dayNum].substr(0, 3).toLowerCase()}.txt`, (err, data) => {
        callback(days[dayNum], data);
    });
}

module.exports = getTimeTable;