const Lecture = require("../models/Lecture");
const mongoose = require("mongoose");

function isConnected(connection) {
    if (connection.readyState !== 1) return false;
    else return true;
}

async function dropTable() {
    if (!isConnected(mongoose.connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }
    await mongoose.connection.db.dropCollection("TimeTable");
}

async function parseTimings(argString) {
    const slotExpr = /(^|,[ ]?)([A-H][@+]?)/g;
    const dayExpr = /(mon|tue|wed|thu|fri)({([ ,]?[ ,]*([01]?[0-9]|2[0-3]).([0-5][0-9]))+})/g;
    const timeExpr = /([01]?[0-9]|2[0-3])[.]([0-5][0-9])/g;

    let timings = {};

    // Slot
    const slotTimings = {
        A: {
            mon: { hr: 8, min: 0 },
            wed: { hr: 9, min: 0 },
            fri: { hr: 10, min: 15 },
        },
        B: {
            mon: { hr: 11, min: 15 },
            tue: { hr: 8, min: 0 },
            thu: { hr: 9, min: 0 },
        },
        C: {
            tue: { hr: 11, min: 15 },
            wed: { hr: 8, min: 0 },
            fri: { hr: 9, min: 0 },
        },
        D: {
            mon: { hr: 10, min: 15 },
            wed: { hr: 11, min: 15 },
            thu: { hr: 8, min: 0 },
        },
        E: {
            tue: { hr: 10, min: 15 },
            thu: { hr: 11, min: 15 },
            fri: { hr: 8, min: 0 },
        },
        F: {
            mon: { hr: 9, min: 0 },
            wed: { hr: 10, min: 15 },
            fri: { hr: 11, min: 15 },
        },
        G: {
            mon: { hr: 13, min: 0 },
            tue: { hr: 9, min: 0 },
            thu: { hr: 10, min: 15 },
        },
        H: {
            mon: { hr: 17, min: 0 },
            tue: { hr: 17, min: 0 },
            wed: { hr: 13, min: 0 },
        },
        "A+": { tue: { hr: 13, min: 0 } },
        "B+": { fri: { hr: 14, min: 0 } },
        "C+": { thu: { hr: 14, min: 0 } },
        "D+": { fri: { hr: 17, min: 0 } },
        "E+": { mon: { hr: 14, min: 0 } },
        "F+": { tue: { hr: 14, min: 0 } },
        "G+": { wed: { hr: 14, min: 0 } },
        "H+": { fri: { hr: 13, min: 0 } },
        "E@": { wed: { hr: 17, min: 0 } },
        "G@": { thu: { hr: 17, min: 0 } },
    };

    const slotMatch = argString.matchAll(slotExpr);
    for (const match of slotMatch) {
        const slot = match[2];
        for (const day of Object.keys(slotTimings[slot])) {
            (timings[day] = timings[day] || []).push(slotTimings[slot][day]);
        }
    }

    // Custom
    const dayMatch = argString.matchAll(dayExpr);
    for (const match of dayMatch) {
        let day = match[1];
        let timeMatch = match[0].matchAll(timeExpr);
        for (const time of timeMatch) {
            lectureTime = { hr: parseInt(time[1]), min: parseInt(time[2]) };
            (timings[day] = timings[day] || []).push(lectureTime);
        }
    }
    return timings;
}

async function timingsToMessage(timings) {
    let descr = "";
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    for (const day of days) {
        const key = day.toLowerCase();
        if (!timings[key]) {
            continue;
        }
        descr += `**${day}:** `;
        for (const time of timings[key]) {
            const min = time.min.toLocaleString("en-us", {
                minimumIntegerDigits: 2,
                useGrouping: false,
            });
            descr += `${time.hr}.${min}, `;
        }
        descr += "\n\n";
    }
    return descr;
}

async function saveCourseTimings(courseName, timings) {
    if (!isConnected(mongoose.connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }
    for (const day of Object.keys(timings)) {
        for (lectureTime of timings[day]) {
            const lecture = {
                day: day,
                course_name: courseName,
                time: lectureTime,
            };
            const lectureDoc = new Lecture(lecture);
            await lectureDoc.save();
        }
    }
}

async function get(day) {
    if (!isConnected(mongoose.connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }

    // If multple docs with same course and same time
    const docs = await Lecture.aggregate([
        {
            $match: {
                day: day,
            },
        },
        {
            $group: {
                _id: {
                    course_name: "$course_name",
                    time: "$time",
                },
                course_name: { $first: "$course_name" },
            },
        },
        {
            $project: {
                _id: 0,
                course_name: "$_id.course_name",
                time: "$_id.time",
            },
        },
        { $sort: { "time.hr": 1, "time.min": 1 } },
    ]);

    // Grouping docs based on time
    return await docs.reduce((final, current) => {
        let min = current.time.min.toLocaleString("en-us", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        });
        (final[`${current.time.hr}.${min}`] =
            final[`${current.time.hr}.${min}`] || []).push(current.course_name);
        return final;
    }, {});
}

async function dailyHrsToMessage(schedule) {
    // {'8.00': ['sub1', 'sub2'], '12.00': ['sub2']}
    let descr = "";
    for (const time of Object.keys(schedule)) {
        descr += `**${time}:** `;
        for (const lecture of schedule[time]) {
            descr += `${lecture}, `;
        }
        descr += "\n\n";
    }
    return descr;
}

// Remove lecture timings
async function removeCourseTimings(courseName) {
    if (!isConnected(mongoose.connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }
    await Lecture.deleteMany({ course_name: courseName }).exec();
}

// Get all hours of a course
async function getCourseTimings(courseName) {
    if (!isConnected(mongoose.connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }
    // return await Lecture.find({ course_name: courseName }).exec();
    const docs = await Lecture.aggregate([
        {
            $match: {
                course_name: courseName,
            },
        },
        {
            $group: {
                _id: {
                    day: "$day",
                    time: "$time",
                },
            },
        },
        {
            $project: {
                _id: 0,
                day: "$_id.day",
                time: "$_id.time",
            },
        },
    ]);

    let timings = {};
    for (const doc of docs) {
        (timings[doc.day] = timings[doc.day] || []).push(doc.time);
    }

    return timings;
}

module.exports = {
    parseTimings,
    get,
    saveCourseTimings,
    removeCourseTimings,
    getCourseTimings,
    dropTable,
    timingsToMessage,
    dailyHrsToMessage,
};
