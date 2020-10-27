#!/app/bin/node

const Discord = require("discord.js");
const fs = require("fs");
const { embedMessage, initSchedule } = require("./sevices/misc");
const Events = require("./sevices/Events");
const mongoose = require("mongoose");
require("dotenv").config();

let EVENT_ROWS = [];

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

const PREFIX = process.env.PREFIX;

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.once("ready", () => {
    initSchedule(client);
});

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

    if (command === "events") {
        let descrip =
            "The command `;events` is deprecated as maintaining the event list is no simple task";
        descrip +=
            " and the event list is not reliable as there are constant changes in the calendar. ";
        descrip +=
            "This means one needs to constantly update the list and sometimes delete and add multiple events ";
        descrip +=
            "which is really a nuisance. Till some alternative is figured out, use the google doc link below.";
        descrip +=
            "\n\n 1. [B17 Calendar](https://docs.google.com/spreadsheets/d/1eC0piLtXm8iCKsgDKUbaUcggO43g53C4bmK5WB1CH28)";
        descrip +=
            "\n\n 2. [RAT Presentation Schedule - A Batch](https://docs.google.com/spreadsheets/d/1tQbs1x5GlPefQgk7rZ6pGhywWigX9xPUt4UNATMJd30/edit#gid=1588305926)";
        const embed = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Command Deprecated")
            .setDescription(descrip);
        message.channel.send(embed);
        // if (args[0] === "show") {
        //     let eventString = "";
        //     Events.getAll(mongoose.connection, (err, docs) => {
        //         if (err) {
        //             message.reply("Error getting events. Please try again.");
        //             console.log("[EVENT_SHOW]\n" + err);
        //             return;
        //         }
        //         EVENT_ROWS = docs;
        //         const embed = new Discord.MessageEmbed()
        //             .setColor("#0099ff")
        //             .setTitle("Upcoming Events");
        //         let count = 1;
        //         if (docs.length === 0) eventString = "No events to show.";
        //         docs.forEach((doc) => {
        //             let d = new Date(doc.date);
        //             eventString += `\n\n${count}) **${d.getDate()} ${d.toLocaleDateString(
        //                 "default",
        //                 { month: "short" }
        //             )}**: ${doc.event_name}`;
        //             count += 1;
        //         });
        //         embed.setDescription(eventString);
        //         message.channel.send(embed);
        //     });
        //     return;
        // } else if (args[0] == "dm") {
        // } else if (args[0] == "delete") {
        //     if (EVENT_ROWS.length == 0 || args.length != 2) {
        //         embedMessage(
        //             message.channel,
        //             "Incorrect Use!",
        //             "Use `;events show` and then run `;events delete <index_from_the_events_list>`."
        //         );
        //         return;
        //     }
        //     index = parseInt(args[1]);
        //     if (!index) {
        //         embedMessage(
        //             message.channel,
        //             "Incorrect Use!",
        //             "Use `;events show` and then run `;events delete <index_from_the_events_list>`."
        //         );
        //         return;
        //     }
        //     if (index > EVENT_ROWS.length) {
        //         embedMessage(
        //             message.channel,
        //             "Invalid Index!",
        //             "Index should be within the given values."
        //         );
        //         return;
        //     }
        //     index -= 1;
        //     Events.deleteEntry(
        //         mongoose.connection,
        //         EVENT_ROWS[index],
        //         (err) => {
        //             if (err) {
        //                 message.reply("Error trying to delete event");
        //                 console.log("[EVENT_DEL]\n" + err);
        //                 return;
        //             }
        //         }
        //     );
        //     eventString = `\n\`${EVENT_ROWS[index].event_name} on ${new Date(
        //         EVENT_ROWS[index].date
        //     ).toLocaleDateString()}\``;
        //     message.reply("The following event was deleted." + eventString);
        //     EVENT_ROWS = [];
        //     return;
        // } else if (args[0] == "add") {
        //     argString = args.join(" ");
        //     let event = Events.parse(argString);
        //     if (event.err) {
        //         embedMessage(
        //             message.channel,
        //             "Incorrect format!",
        //             'Use `;events add "event" on DD/MM/YY`.'
        //         );
        //         return;
        //     }

        //     Events.add(mongoose.connection, event, (err) => {
        //         if (err) {
        //             message.reply(
        //                 "```\nError encountered when adding event to database." +
        //                     "\n" +
        //                     err +
        //                     "```"
        //             );
        //             console.log("[EVENT_ADD]\n" + err);
        //             return;
        //         }
        //         message.reply("Event added successfully.");
        //     });
        //     return;
        // } else {
        //     let helpString =
        //         "Use `;help events` to see usage of `;events` command.";
        //     embedMessage(message.channel, "Incorrect Usage!", helpString);
        //     return;
        // }
    } else if (client.commands.has(command)) {
        client.commands.get(command).execute(message, args);
    } else if (command === "shaji") {
        message.channel.send("<@460805947221213195>, Oom*ikko");
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
