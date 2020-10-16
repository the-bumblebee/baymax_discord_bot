const Discord = require("discord.js");

module.exports = {
    name: "cal",
    execute(message, args) {
        message.channel.send(
            new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle("Calendar")
                .setDescription(
                    "https://docs.google.com/spreadsheets/d/1eC0piLtXm8iCKsgDKUbaUcggO43g53C4bmK5WB1CH28"
                )
        );
    },
};
