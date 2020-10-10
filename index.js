const Discord = require("discord.js");
const { embedMessage, initSchedule } = require("./sevices/misc");
const getTimeTable = require("./sevices/getTimeTable");
const Reminder = require("./sevices/Reminder");
const Events = require("./sevices/Eventsmongo");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(
    process.env.DB_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    },
    (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("[INFO] Connected to DB");
    }
);

const client = new Discord.Client();

const PREFIX = process.env.PREFIX;
let EVENT_ROWS = [];
const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

client.once("ready", initSchedule);

mongoose.connection.on("error", function () {
    client.channels.cache
        .get("739440153243942933")
        .send("<@490390568623669251>, Can't connect to MongoDB.");
});

client.on("message", async function (message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const commandBody = message.content.slice(PREFIX.length);
    const args = commandBody.split(" ");
    const command = args.shift().toLowerCase();

    if (command == "tt") {
        getTimeTable((day, data) => {
            embedMessage(message.channel, day, data);
        });
    } else if (command == "remind") {
        if (
            !message.member.roles.cache.has(
                message.guild.roles.cache.get("739449134456766464").id
            )
        ) {
            message.reply(
                "No can do bro. You ain't got them roles for this command."
            );
            return;
        }
        Reminder.validate(args, (data, err) => {
            if (err) {
                embedMessage(
                    message.channel,
                    "Incorrect format!",
                    "Use `;remind at <HH:MM> <AM/PM> on <#channel> <reminder message>`"
                );
                return;
            }
            Reminder.set(client, data);
        });
    } else if (command === "ping") {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.channel.send(`Pong. Latency: ${timeTaken}ms`);
    } else if (command === "sanin") {
        message.channel.send("<@707528865240711188>, Oo**kko");
    } else if (command === "events") {
        if (args[0] === "show") {
            let eventString = "";
            Events.getAll(mongoose.connection, (err, docs) => {
                if (err) {
                    message.reply("Error getting events.");
                    console.log("[EVENT_SHOW]\n" + err);
                    return;
                }
                EVENT_ROWS = docs;
                const embed = new Discord.MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("Upcoming Events");
                let count = 1;
                if (docs.length === 0) eventString = "No events to show.";
                docs.forEach((doc) => {
                    let d = new Date(doc.date);
                    eventString += `\n\n${count}) **${d.getDate()} ${
                        MONTHS[d.getMonth()]
                    }**: ${doc.event_name}`;
                    count += 1;
                });
                embed.setDescription(eventString);
                message.channel.send(embed);
            });
            return;
        } else if (args[0] == "dm") {
        } else if (args[0] == "delete") {
            if (EVENT_ROWS.length == 0 || args.length != 2) {
                embedMessage(
                    message.channel,
                    "Incorrect Use!",
                    "Use `;events show` and then run `;events delete <index_from_the_events_list>`."
                );
                return;
            }
            index = parseInt(args[1]);
            if (!index) {
                embedMessage(
                    message.channel,
                    "Incorrect Use!",
                    "Use `;events show` and then run `;events delete <index_from_the_events_list>`."
                );
                return;
            }
            if (index > EVENT_ROWS.length) {
                embedMessage(
                    message.channel,
                    "Invalid Index!",
                    "Index should be within the given values."
                );
                return;
            }
            index -= 1;
            Events.deleteEntry(
                mongoose.connection,
                EVENT_ROWS[index],
                (err) => {
                    if (err) {
                        message.reply("Error trying to delete event");
                        console.log("[EVENT_DEL]\n" + err);
                        return;
                    }
                }
            );
            eventString = `\n\`${EVENT_ROWS[index].event_name} on ${new Date(
                EVENT_ROWS[index].date
            ).toLocaleDateString()}\``;
            message.reply("The following event was deleted." + eventString);
            EVENT_ROWS = [];
            return;
        } else if (args[0] == "add") {
            argString = args.join(" ");
            let event = Events.parse(argString);
            if (event.err) {
                embedMessage(
                    message.channel,
                    "Incorrect format!",
                    'Use `;events add "event" on DD/MM/YY`.'
                );
                return;
            }

            Events.add(mongoose.connection, event, (err) => {
                if (err) {
                    message.reply(
                        "```\nError encountered when adding event to database." +
                            "\n" +
                            err +
                            "```"
                    );
                    console.log("[EVENT_ADD]\n" + err);
                    return;
                }
                message.reply("Event added successfully.");
            });
            return;
        } else {
            let helpString =
                "Use `;help events` to see usage of `;events` command.";
            embedMessage(message.channel, "Incorrect Usage!", helpString);
            return;
        }
    } else if (command == "help") {
        if (args.length === 0) {
            embedMessage(
                message.channel,
                "Usage!",
                require("./sevices/help").helpString
            );
            return;
        } else if (args[0] === "events") {
            embedMessage(
                message.channel,
                "`;events` Usage!",
                require("./sevices/help").helpEvents
            );
        } else {
            embedMessage(
                message.channel,
                "Incorrect Usage!",
                "Use `;help` to list all the available commands and documentation."
            );
            return;
        }
    } else {
        embedMessage(
            message.channel,
            "Incorrect Command!",
            "Use `;help` to see all the available commands."
        );
        return;
    }
});

client.login(process.env.BOT_TOKEN);

// TODO:

// 1. Regex for string parsing(reminder)
//         time parsing 12 hr and 24 hr
//         [at <time>/in <time> [on <channel] <reminder>]
// 2. SQLite3 db for persistence.
//         Associated startup method to schedule jobs.
// 3. Refactor code a bit.
// 4. Get reminders in a server.
// 5. Independent data handling between servers.
// 6. Easy adding links for courses. One time and every time. Command only for admin and moderator.
// 7. Generate time table from db. Also send associated links if available in db.
