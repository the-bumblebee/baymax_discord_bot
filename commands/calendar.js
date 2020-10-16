const Discord = require("discord.js");

module.exports = {
    name: "calendar",
    execute(message, args) {
        message.channel.send(
            new Discord.MessageEmbed()
                .setTitle("Calendar")
                .setURL(
                    "https://docs.google.com/spreadsheets/d/1eC0piLtXm8iCKsgDKUbaUcggO43g53C4bmK5WB1CH28"
                )
                .setDescription(
                    "Click on 'Calendar' to redirect to the google sheet."
                )
        );
    },
};
