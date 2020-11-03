const Discord = require("discord.js");
const getTimeTable = require("../services/getTimeTable");

module.exports = {
    name: "tt",
    execute(message, args) {
        getTimeTable((day, data) => {
            embedMessage = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle(day)
                .setDescription(data);
            message.channel.send(embedMessage);
        });
    },
};
