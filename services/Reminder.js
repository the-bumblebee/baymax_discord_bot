const timeParser = require("./timeParser");
const mongoose = require("mongoose");
const Discord = require("discord.js");
const schedule = require("node-schedule");
const ReminderModel = require("../models/Reminder");

function isConnected(connection) {
    if (connection.readyState !== 1) return false;
    else return true;
}

async function dropTable() {
    if (!isConnected(mongoose.connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }
    await mongoose.connection.db.dropCollection("Reminders");
}

async function addEntry(reminderObj) {
    if (!isConnected(mongoose.connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }

    const reminder = new ReminderModel(reminderObj);
    await reminder.save();
}

async function deleteEntry(reminderObj) {
    if (!isConnected(mongoose.connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }

    await ReminderModel.deleteMany(reminderObj).exec();
}

async function parse(argString) {
    let reminder = {};

    const msgExpr = /"([^"]+)"/g;
    const timeExpr = /at ([01]?[0-9]|2[0-3]).([0-5][0-9])/g;
    const dayExpr = /on ([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})/g;
    const channelExpr = /in <#([^ \n]+)>/g;

    const msgMatch = msgExpr.exec(argString);
    const timeMatch = timeExpr.exec(argString);
    const dayMatch = dayExpr.exec(argString);
    const channelMatch = channelExpr.exec(argString);

    if (msgMatch && msgMatch.length !== 0) {
        reminder.message = msgMatch[1];
    }

    if (timeMatch && timeMatch.length !== 0) {
        reminder.time = {
            hr: parseInt(timeMatch[1]),
            min: parseInt(timeMatch[2]),
        };
    }

    if (dayMatch && dayMatch.length !== 0) {
        reminder.date = {
            day: parseInt(dayMatch[1]),
            month: parseInt(dayMatch[2]),
            year: parseInt(dayMatch[3]),
        };
    }

    if (channelMatch && channelMatch.length !== 0) {
        reminder.channel = channelMatch[1];
    }

    return reminder;
}

async function addReminder(message, argString) {
    const reminder = await parse(argString);
    if (!reminder.time || !reminder.message) {
        throw new Error("[ERROR] Incorrect format for adding event");
    }
    let date = null;
    if (!reminder.date) {
        date = new Date();
        date.setHours(reminder.time.hr);
        date.setMinutes(reminder.time.min);
        date.setSeconds(0);
    } else {
        date = new Date(
            reminder.date.year,
            reminder.date.month - 1,
            reminder.date.day,
            reminder.time.hr,
            reminder.time.min
        );
    }
    if (date <= new Date()) {
        throw new Error("[ERROR] The time mentioned isn't in the future.");
    }
    const guild = message.guild.id;
    let channel = message.channel;
    if (reminder.channel) {
        channel = message.guild.channels.cache.get(reminder.channel);
        if (!channel) {
            throw new Error("[ERROR] No channel found.");
        }
    }
    const jobID = "rem" + Date.now().toString();

    const reminderObj = {
        jobID: jobID,
        message: reminder.message,
        date: date.getTime(),
        channel: channel.id,
        guild: guild,
    };
    await addEntry(reminderObj);

    schedule.scheduleJob(jobID, date, async function () {
        const remindMessage = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Reminder")
            .setDescription(reminder.message);
        channel.send(remindMessage);
        await deleteEntry(reminderObj);
    });

    return reminderObj;
}

async function getAll() {
    if (!isConnected(mongoose.connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }
    return await ReminderModel.find({
        date: { $gte: new Date().getTime() },
    }).exec();
}

module.exports = { parse, addReminder, dropTable, getAll };
