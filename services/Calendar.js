function getDaysInMonth(month) {
    return new Date(2020, month + 1, 0).getDate();
}

function parseRows(rows, callback) {
    let nowDate = new Date();
    let endDay = 14 - nowDate.getDay();
    let events = {};
    for (let day = 0; day < endDay; day += 1) {
        column = 1 + ((nowDate.getDay() + day) % 7);
        row = Math.floor((nowDate.getDay() + day) / 7);
        if (row > 1) break;
        row = row * 6;
        for (let rowi = 1; rowi <= 5; rowi += 1) {
            if (!rows[row + rowi]) break;
            if (!rows[row + rowi][column]) continue;
            if (!events[nowDate.getDate() + day])
                events[nowDate.getDate() + day] = `${
                    rows[row + rowi][column]
                }\n`;
            else
                events[nowDate.getDate() + day] += `${
                    rows[row + rowi][column]
                }\n`;
            // console.log(
            //     `${rows[row + rowi][column]}   ${nowDate.getDate() + day}`
            // );
        }
    }
    // console.log(events);
    callback(events);
}

module.exports = {
    getDaysInMonth,
    parseRows,
};
