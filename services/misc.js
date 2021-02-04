const Discord = require("discord.js");
const schedule = require("node-schedule");
const TimeTable = require("../services/TimeTable");

function embedMessage(channel, title, text) {
    embedMessage = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(title);

    if (text) embedMessage.setDescription(text);

    channel.send(embedMessage);
}

async function initSchedule(client) {
    console.log("[INFO] Scheduling to send time table at 6.30 mon - fri.");
    schedule.scheduleJob("timetable", "30 6 * * 1-5", async function () {
        const days = ["mon", "tue", "wed", "thu", "fri"];
        const today = new Date();
        let dayNumber = today.getDay() - 1;
        let day = today.toLocaleString("default", { weekday: "long" });
        if (dayNumber > 4 || dayNumber < 0) {
            dayNumber = 0;
            day = "Monday";
        }
        const timings = await TimeTable.get(days[dayNumber]);
        let descr = await TimeTable.dailyHrsToMessage(timings);
        descr +=
            "\n**Note:** To add or delete courses and for other commands type `;help tt`.";
        let infoMessage = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle(`Timetable - ${day}`)
            .setDescription(descr);
        client.channels.cache.get("767969004241027072").send(infoMessage);

        // Reminding
        dayNumber = today.getDay() - 1;
        if (dayNumber > 4 || dayNumber < 0) {
            dayNumber = 0;
        }
        const lectureTimings = await TimeTable.get(days[dayNumber]);
        const timeExpr = /([01]?[0-9]|2[0-3])[.]([0-5][0-9])/g;
        for (const timeStr of Object.keys(lectureTimings)) {
            const timeMatch = timeExpr.exec(timeStr);
            const time = {
                hr: parseInt(timeMatch[1]),
                min: parseInt(timeMatch[2]),
            };
            schedule.scheduleJob(
                timeStr,
                `${time.min} ${time.hr} * * ${dayNumber + 1}`,
                async function () {
                    let infoMessage = "Class now, ";
                    const guild = await client.guilds.cache.get(
                        "698456806787383327"
                    );
                    for (const course of lectureTimings[timeStr]) {
                        const role = await guild.roles.cache.find(
                            (role) => role.name === course
                        );
                        if (!course) {
                            infoMessage += `${course}, `;
                        } else {
                            infoMessage += `<@&${role.id}>, `;
                        }
                    }
                    guild.channels.cache
                        .get("767969004241027072")
                        .send(infoMessage);
                    schedule.scheduledJobs[timeStr].cancel();
                }
            );
        }
    });
}

// function initSchedule(client) {
//     console.log("[INFO] Scheduling event clean up at 6.30 everyday.");
//     schedule.scheduleJob("event_cleanup", "15 9 * * *", function () {
//         Events.cleanUp(mongoose.connection, (err) => {
//             console.log("[EVENT_CLEANUP]\n" + err);
//         });
//     });

//     console.log("[INFO] Scheduling to send time table at 6.30 mon - fri.");
//     schedule.scheduleJob("timetable", "30 6 * * 1-5", function () {
//         getTimeTable((day, data) => {
//             client.channels.cache
//                 .get("767969004241027072")
//                 .send(
//                     new Discord.MessageEmbed()
//                         .setColor("#0099ff")
//                         .setTitle(day)
//                         .setDescription(data)
//                 );
//         });
//     });

//     console.log("[INFO] Scheduling to send time table at 21.30 sun - thu.");
//     schedule.scheduleJob("next-tt", "30 21 * * 0-4", () => {
//         getTimeTable((day, data) => {
//             client.channels.cache
//                 .get("767969004241027072")
//                 .send(
//                     new Discord.MessageEmbed()
//                         .setColor("#0099ff")
//                         .setTitle(day)
//                         .setDescription(data)
//                 );
//         });
//     });
// }

module.exports = {
    embedMessage,
    initSchedule,
};
