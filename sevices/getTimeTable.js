const fs = require('fs');

function getTimeTable(callback) {
    let days = ['Monday', 'Tuesday', 'Wednesday', 'Thurday', 'Friday'];
    dayNum = new Date().getDay() - 1;
    if (dayNum > 4) return;
    s = fs.readFile(`./TimeTable/${days[dayNum].substr(0, 3).toLowerCase()}.txt`, (err, data) => {
        callback(days[dayNum], data);
    });
}

module.exports = getTimeTable;