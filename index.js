const Discord = require('discord.js');
const schedule = require('node-schedule');
const { getTimeTable, embedMessage } = require('./sevices/misc');
const fs = require('fs');
require('dotenv').config();

const client = new Discord.Client();

const prefix = process.env.PREFIX;

function reminder (title, text, message) {
  message.channel.send(new Discord.MessageEmbed()
  .setColor('#0099ff')
  .setTitle(title)
  .setDescription(text));
}

client.once("ready", () => {
    console.log('Ready for some action.');
});

client.on("message", async function(message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  if (command == 'tt') {
    getTimeTable((day, data) => {
      embedMessage(message, day, data);
    });
  }

  else if (command == 'test') {
    // let j = schedule.scheduleJob('* * * * * *', function(){
    //   reminder('The world is going to end today.', null, message);
    // });
    console.log('Time Table set.');
    let job = schedule.scheduleJob('40 11 * * 1-5', function(){
      getTimeTable((day, data) => {
        client.channels.cache.get('741443367111753820')
          .send(new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(day)
            .setDescription(data)
        )});
    });
  }

  else{
    d = new Date();
    console.log(d.toTimeString());
    embedMessage(message, command);
  }
});

client.login(process.env.BOT_TOKEN);