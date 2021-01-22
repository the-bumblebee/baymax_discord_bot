const Course = require("../models/Course");
const mongoose = require("mongoose");

function isConnected(connection) {
    if (connection.readyState !== 1) return false;
    else return true;
}

async function dropTable() {
    if (!isConnected(mongoose.connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }
    await mongoose.connection.db.dropCollection("Courses");
}

async function addCourse(courseName) {
    if (!isConnected(mongoose.connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }
    const course = new Course({ course_name: courseName });
    await course.save();
}

async function removeRole(message, roleName) {
    if (!isConnected(mongoose.connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }
    const role = await message.guild.roles.cache.find(
        (role) => role.name === roleName
    );
    if (role) {
        role.delete();
    }
}

async function removeCourse(courseName) {
    if (!isConnected(mongoose.connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }
    await Course.deleteMany({ course_name: courseName }).exec();
}

async function addRole(message, roleName) {
    if (!isConnected(mongoose.connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }
    await message.guild.roles.create({
        data: {
            name: roleName,
            color: "BLUE",
        },
    });
}

async function removeAllRoles(message) {
    if (!isConnected(mongoose.connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }
    let docs = await Course.find({}).exec();
    for (const doc of docs) {
        const role = await message.guild.roles.cache.find(
            (role) => role.name === doc.course_name
        );
        if (role) {
            role.delete();
        }
    }
}

async function getAll() {
    if (!isConnected(mongoose.connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }
    return await Course.find({}).exec();
}

async function coursesToMessage(courses) {
    let iter = 1;
    let descr = "";
    for (const course of courses) {
        descr += `**${iter}. ${course.course_name}**\n\n`;
        iter += 1;
    }
    return descr;
}

module.exports = {
    addCourse,
    dropTable,
    removeCourse,
    getAll,
    addRole,
    removeRole,
    removeAllRoles,
    coursesToMessage,
};
