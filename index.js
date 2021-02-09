#!/app/bin/node

const Discord = require("discord.js");
const fs = require("fs");
const { embedMessage, initSchedule } = require("./services/misc");
const mongoose = require("mongoose");
const Courses = require("./services/Courses");
const TimeTable = require("./services/TimeTable");
const schedule = require("node-schedule");
require("dotenv").config();

const PREFIX = process.env.PREFIX;

const client = new Discord.Client();
client.commands = new Discord.Collection();

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
        initSchedule(client);
    }
);

const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// client.once("ready", () => {
//     initSchedule(client);
// });

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

    if (client.commands.has(command)) {
        await client.commands.get(command).execute(message, args);
    } else if (command == "react") {
        try {
            let courses = await Courses.getAll(mongoose.connection);
            console.log(courses);
        } catch (error) {
            console.log(error);
        }
    } else if (command == "r") {
        let filter = (m) => m.author.id == message.author.id;
        message.channel.send("Yes or No?").then(() => {
            message.channel
                .awaitMessages(filter, {
                    max: 1,
                    time: 3000,
                    errors: ["time"],
                })
                .then((message) => {
                    message = message.first();
                    message.channel.send(message.content);
                })
                .catch((collected) => {
                    message.channel.send("Timeout");
                });
        });
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

// https://stackoverflow.com/questions/58052042/how-can-i-create-a-dynamic-chat-in-a-discord-js-bot
// MessageCollectorOptions
// CollectorFilter
