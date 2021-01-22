const Course = require("../models/Course");

function isConnected(connection) {
    if (connection.readyState !== 1) return false;
    else return true;
}

async function dropTable(connection) {
    if (!isConnected(connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }
    await connection.db.dropCollection("Courses");
    // connection.db.dropCollection("Courses", (err) => {
    //     if (err) {
    //         throw new Error(err);
    //     }
    // });
}

async function addCourse(connection, courseName) {
    if (!isConnected(connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }
    const course = new Course({ course_name: courseName });
    await course.save();
    // try {
    //     await course.save();
    // } catch (error) {
    //     throw error;
    // }
}

async function dropCourse(connection, courseName) {
    if (!isConnected(connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }
    await Course.deleteMany({ course_name: courseName }).exec();
}

async function getAll(connection) {
    if (!isConnected(connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }
    return await Course.find({}).exec();
    // Course.find({})
    //     .then((docs) => {
    //         return docs;
    //     })
    //     .catch((err) => {
    //         throw err;
    //     });
}

module.exports = { addCourse, dropTable, dropCourse, getAll };
