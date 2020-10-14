const Discord = require("discord.js");
const schedule = require("node-schedule");
const Events = require("./Events");
const mongoose = require("mongoose");
const getTimeTable = require("./getTimeTable");

function embedMessage(channel, title, text) {
    embedMessage = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(title);

    if (text) embedMessage.setDescription(text);

    channel.send(embedMessage);
}

function initSchedule(client) {
    console.log("[INFO] Scheduling event clean up at 6.30 everyday.");
    schedule.scheduleJob("event_cleanup", "15 9 * * *", function () {
        Events.cleanUp(mongoose.connection, (err) => {
            console.log("[EVENT_CLEANUP]\n" + err);
        });
    });

    console.log("[INFO] Scheduling to send time table at 6.30 mon - fri.");
    schedule.scheduleJob("timetable", "30 6 * * 1-5", function () {
        getTimeTable((day, data) => {
            client.channels.cache
                .get("741443367111753820")
                .send(
                    new Discord.MessageEmbed()
                        .setColor("#0099ff")
                        .setTitle(day)
                        .setDescription(data)
                );
        });
    });

    console.log("[INFO] Scheduling to send time table at 21.30 sun - thu.");
    schedule.scheduleJob("next-tt", "30 21 * * 0-4", () => {
        getTimeTable((day, data) => {
            client.channels.cache
                .get("741443367111753820")
                .send(
                    new Discord.MessageEmbed()
                        .setColor("#0099ff")
                        .setTitle(day)
                        .setDescription(data)
                );
        });
    });
}

module.exports = {
    embedMessage,
    initSchedule,
};
