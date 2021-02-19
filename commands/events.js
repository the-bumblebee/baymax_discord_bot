const mongoose = require("mongoose");
const Discord = require("discord.js");
const Events = require("../services/Events");

// module.exports = {
const c = {
    name: "events",
    async execute(message, args) {
        const subcmd = args.shift();
        if (subcmd === "show") {
            await showEvents(message, args);
        } else if (subcmd === "add") {
            await addEvent(message, args);
            // } else if (subcmd === "delete") {
            //     await deleteEvent(message, args);
        } else {
            const errorMessage = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle("Incorrect Usage!")
                .setDescription(
                    "Use `;help events` to see usage of `;events` command."
                );
            message.send(errorMessage);
        }
    },
};

async function showEvents(message, args) {
    try {
        const docs = await Events.getAll(mongoose.connection);
        const infoMessage = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Upcoming Events");
        let descr = "";
        if (!docs || docs.length === 0) descr += "No events to show.";
        for (const doc of docs) {
            const date = new Date(doc.date);
            descr += `\n\n${count}) **${date.getDate()} ${date.toLocaleDateString(
                "default",
                { month: "short" }
            )}**: ${doc.event_name}`;
        }
        infoMessage.setDescription(descr);
        message.channel.send(infoMessage);
    } catch (error) {
        console.log("[ERROR]", error);
        return;
    }
}

async function addEvent(message, args) {
    argString = args.join(" ");
    try {
        const event = await Events.parse(argString);
        await Events.add(event);
        message.reply("Event added successfully.");
    } catch (error) {
        console.log("[ERROR]", error);
        const errorMessage = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Incorrect format!")
            .setDescription(
                "Use `;help events` to see usage of `;events` command."
            );
        message.send(errorMessage);
    }
}

// if (command === "events") {
//     if (args[0] === "show") {
//         let eventString = "";
//         Events.getAll(mongoose.connection, (err, docs) => {
//             if (err) {
//                 message.reply("Error getting events. Please try again.");
//                 console.log("[EVENT_SHOW]\n" + err);
//                 return;
//             }
//             EVENT_ROWS = docs;
//             const embed = new Discord.MessageEmbed()
//                 .setColor("#0099ff")
//                 .setTitle("Upcoming Events");
//             let count = 1;
//             if (docs.length === 0) eventString = "No events to show.";
//             docs.forEach((doc) => {
//                 let d = new Date(doc.date);
//                 eventString += `\n\n${count}) **${d.getDate()} ${d.toLocaleDateString(
//                     "default",
//                     { month: "short" }
//                 )}**: ${doc.event_name}`;
//                 count += 1;
//             });
//             embed.setDescription(eventString);
//             message.channel.send(embed);
//         });
//         return;
//     } else if (args[0] == "dm") {
//     } else if (args[0] == "delete") {
//         if (EVENT_ROWS.length == 0 || args.length != 2) {
//             embedMessage(
//                 message.channel,
//                 "Incorrect Use!",
//                 "Use `;events show` and then run `;events delete <index_from_the_events_list>`."
//             );
//             return;
//         }
//         index = parseInt(args[1]);
//         if (!index) {
//             embedMessage(
//                 message.channel,
//                 "Incorrect Use!",
//                 "Use `;events show` and then run `;events delete <index_from_the_events_list>`."
//             );
//             return;
//         }
//         if (index > EVENT_ROWS.length) {
//             embedMessage(
//                 message.channel,
//                 "Invalid Index!",
//                 "Index should be within the given values."
//             );
//             return;
//         }
//         index -= 1;
//         Events.deleteEntry(mongoose.connection, EVENT_ROWS[index], (err) => {
//             if (err) {
//                 message.reply("Error trying to delete event");
//                 console.log("[EVENT_DEL]\n" + err);
//                 return;
//             }
//         });
//         eventString = `\n\`${EVENT_ROWS[index].event_name} on ${new Date(
//             EVENT_ROWS[index].date
//         ).toLocaleDateString()}\``;
//         message.reply("The following event was deleted." + eventString);
//         EVENT_ROWS = [];
//         return;
//     } else if (args[0] == "add") {
//         argString = args.join(" ");
//         let event = Events.parse(argString);
//         if (event.err) {
//             embedMessage(
//                 message.channel,
//                 "Incorrect format!",
//                 'Use `;events add "event" on DD/MM/YY`.'
//             );
//             return;
//         }

//         Events.add(mongoose.connection, event, (err) => {
//             if (err) {
//                 message.reply(
//                     "```\nError encountered when adding event to database." +
//                         "\n" +
//                         err +
//                         "```"
//                 );
//                 console.log("[EVENT_ADD]\n" + err);
//                 return;
//             }
//             message.reply("Event added successfully.");
//         });
//         return;
//     } else {
//         let helpString =
//             "Use `;help events` to see usage of `;events` command.";
//         embedMessage(message.channel, "Incorrect Usage!", helpString);
//         return;
//     }
// }
