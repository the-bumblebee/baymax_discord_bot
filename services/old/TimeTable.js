const mongoose = require("mongoose");

function isConnected(connection) {
    if (connection.readyState !== 1) return false;
    else return true;
}

function parse(argString) {
    let regExpr = /add "([^"]+)" at ([A-H])/g;
    let parsed = regExpr.exec(argString);

    if (!parsed) {
        return { err: "Incorrect format" };
    }

    return { course: parsed[1], slot: parsed[2] };
}

// courseObject = {course: ,slot: }
function addCourse(connection, courseObject, errorHandler) {
    if (!isConnected(connection)) {
        errorHandler("Database ain't connected.");
        return;
    }

    connection.db.collection("Courses", (err, collection) => {
        collection.updateOne(
            { slot: courseObject.slot },
            { $push: { courses: courseObject.course } }
        );
    });
}

function findCourses(connection, slot, callback) {
    console.log(slot);
    connection.db.collection("Courses", (err, collection) => {
        collection.findOne({ slot: slot }, (err, courseDoc) => {
            console.log(courseDoc);
            if (!courseDoc) {
                callback("Error");
                return;
            }
            callback(err, courseDoc.courses);
        });
    });
}

function getTimeTable(connection) {
    let slotTimings = {
        slot_1: "8 - 9",
        slot_2: "9 - 10",
        slot_3: "10.15 - 11.15",
        slot_4: "11.15 - 12.15",
        slot_5: "1 - 2",
        slot_6: "2 - 3",
        slot_9: "5 - 6",
    };
    let slots = Object.keys(slotTimings);
    connection.db.collection("TimeTable", (err, collection) => {
        collection.findOne({ day: "Monday" }, (err, doc) => {
            let descp = "";
            slots.forEach((slot) => {
                if (doc[slot]) {
                    findCourses(connection, doc[slot], (err, courseArray) => {
                        if (err || !courseArray) {
                            console.log(err);
                            return;
                        }
                        descp += `${slot}: `;
                        courseArray.forEach((course) => {
                            descp += `${course}, `;
                        });
                        descp += "\n";
                    });
                }
            });
            console.log(descp);
        });
    });
}

module.exports = { parse, addCourse, getTimeTable };
