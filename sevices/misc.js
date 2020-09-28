const fs = require('fs');
const Discord = require('discord.js');

function getTimeTable(callback) {
    let days = ['Monday', 'Tuesday', 'Wednesday', 'Thurday', 'Friday'];
    dayNum = new Date().getDay() - 1;
    if (dayNum > 4) return;
    s = fs.readFile(`./TimeTable/${days[dayNum].substr(0, 3).toLowerCase()}.txt`, (err, data) => {
        callback(days[dayNum], data);
    });
}

function embedMessage (message, title, text) {
    embedMessage = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(title);

    if (text) embedMessage.setDescription(text);

    message.channel.send(embedMessage);
}

module.exports = {
    getTimeTable,
    embedMessage
};