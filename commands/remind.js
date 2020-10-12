const Discord = require("discord.js");
const Reminder = require("../sevices/Reminder");

module.exports = {
    name: "remind",
    execute(message, args) {
        if (
            // !message.member.roles.cache.has(
            //     message.guild.roles.cache.get("739449134456766464").id
            // )
            !message.member.roles.cache.some((role) => role.name === "Admin")
        ) {
            message.reply(
                "No can do bro. You ain't got them roles for this command."
            );
            return;
        }

        Reminder.validate(args, (data, err) => {
            if (err) {
                embedMessage = new Discord.MessageEmbed()
                    .setTitle("Incorrect format!")
                    .setDescription(
                        "Use `;remind at <HH:MM> <AM/PM> on <#channel> <reminder message>`"
                    );
                message.reply(embedMessage);
                return;
            }
            Reminder.set(client, data);
        });
    },
};
