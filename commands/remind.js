const Discord = require("discord.js");
const Reminder = require("../services/Reminder");
const schedule = require("node-schedule");

module.exports = {
    name: "remind",
    async execute(message, args) {
        try {
            const argString = args.join(" ");
            const reminderObj = await Reminder.addReminder(message, argString);
            const reminderDate = new Date(reminderObj.date);
            let infoMessage = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle("Reminder Added!")
                .addFields(
                    { name: "Message", value: `"${reminderObj.message}"` },
                    {
                        name: "Time",
                        value: `${reminderDate.toLocaleTimeString("en-US", {
                            timeStyle: "short",
                        })}`,
                    },
                    {
                        name: "Date",
                        value: `${reminderDate.toLocaleDateString("en-US", {
                            dateStyle: "medium",
                        })}`,
                    },
                    { name: "Channel", value: `<#${reminderObj.channel}>` }
                );
            message.channel.send(infoMessage);
        } catch (error) {
            console.log(error);
            message.reply("Couldn't add reminder!");
        }
    },
};
