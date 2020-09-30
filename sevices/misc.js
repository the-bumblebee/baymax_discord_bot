const Discord = require('discord.js');

function embedMessage (channel, title, text) {
    embedMessage = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(title);

    if (text) embedMessage.setDescription(text);

    channel.send(embedMessage);
}

module.exports = {
    embedMessage
};