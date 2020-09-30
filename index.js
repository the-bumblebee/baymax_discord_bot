const Discord = require('discord.js');
const schedule = require('node-schedule');
const { embedMessage } = require('./sevices/misc');
const getTimeTable = require('./sevices/getTimeTable');
const Reminder = require('./sevices/Reminder');
const fs = require('fs');
require('dotenv').config();

const client = new Discord.Client();

const prefix = process.env.PREFIX;

client.once("ready", () => {
    console.log('Ready for some action.');
    console.log('Scheduling to send the time table at 6.30 AM everyday.');
    let job = schedule.scheduleJob('timetable', '30 6 * * 1-5', function() {
      getTimeTable((day, data) => {
        client.channels.cache.get('741443367111753820')
          .send(new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(day)
            .setDescription(data)
        )});
    });
});

client.on("message", async function(message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  if (command == 'tt') {
    getTimeTable((day, data) => {
      embedMessage(message.channel, day, data);
    });
  }

  else if (command == 'remind') {
    Reminder.validate(args, (data, err) => {
      if (err) {
        embedMessage(message.channel, 'Incorrect fromat!', 'Use \`;remind at <HH:MM> <AM/PM> on <#channel> <reminder message>\`');
        return;
      }
      Reminder.set(client, data);
    });
  }

  // else if (command == 'check') {
  //   let d = new Date();
  //   d.setMinutes(25);
  //   let j = schedule.scheduleJob('test', d, (fireDate) => {
  //     embedMessage(message.channel, 'Yo peeps!');
  //     schedule.scheduledJobs.test.cancel();
  //     console.log(schedule.scheduledJobs);
  //   })
  //   // console.log(args[0].substring(2, args[0].length - 1));
  //   // client.channels.cache.get(args[0]).send('check');
  // }

  // else if (command == 'jobs') {
  //   console.log(schedule.scheduledJobs['test']);
  // }

  // else{
  //   d = new Date();
  //   console.log(d.toTimeString());
  //   embedMessage(message.channel, command);
  // }
});

client.login(process.env.BOT_TOKEN);