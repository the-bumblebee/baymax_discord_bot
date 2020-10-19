const Discord = require("discord.js");

module.exports = {
    name: "cal",
    execute(message, args) {
        message.channel.send(
            new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle("Calendar")
                .setDescription(
                    "https://docs.google.com/spreadsheets/d/1eC0piLtXm8iCKsgDKUbaUcggO43g53C4bmK5WB1CH28" +
                        "\n\n 1. [RAT Presentation Schedule - A Batch](https://docs.google.com/spreadsheets/d/1tQbs1x5GlPefQgk7rZ6pGhywWigX9xPUt4UNATMJd30/edit#gid=1588305926)"
                )
        );
    },
};
