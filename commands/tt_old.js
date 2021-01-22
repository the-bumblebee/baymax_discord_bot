const Discord = require("discord.js");
const TimeTable = require("../services/TimeTable");
const mongoose = require("mongoose");
// const getTimeTable = require("../services/getTimeTable");

// module.exports = {
//     name: "tt",
//     execute(message, args) {
//         getTimeTable((day, data) => {
//             embedMessage = new Discord.MessageEmbed()
//                 .setColor("#0099ff")
//                 .setTitle(day)
//                 .setDescription(data);
//             message.channel.send(embedMessage);
//         });
//     },
// };

module.exports = {
    name: "tt_old",
    execute(message, args) {
        if (args[0] == "add") {
            argString = args.join(" ");
            courseObject = TimeTable.parse(argString);
            TimeTable.addCourse(mongoose.connection, courseObject, (err) => {
                console.log(err);
            });
            return;
        }
    },
};
