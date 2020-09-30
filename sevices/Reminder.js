const timeParser = require('./timeParser');
const Discord = require('discord.js');
const schedule = require('node-schedule');

function validate(args, callback) {
    if (args.length < 6 || args[0] !== 'at' || args[3] !== 'on') {
        callback(null, 'Incorrect format');
        return;
    }

    let time = args[1].split(':').map(x => parseInt(x));
    if (time.length !==2) {
        callback(null, 'Incorrect format');
        return;
    }

    let {hr, min, error} = timeParser(time[0], time[1], args[2]);
    if (error) callback(null, error);

    let data = {
        atHour: hr,
        atMin: min,
        on: args[4].substring(2, args[4].length - 1),
        remindMessage: args.slice(5, args.length).join(' ')
    }

    callback(data, null);
}

function set(client, data) {
    let date = new Date();
    date.setHours(data.atHour, data.atMin, 0);
    let jobID = Date.now().toString();
    let reminder = schedule.scheduleJob(jobID, date, () => {
        embedMessage = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Reminder')
            .setDescription(data.remindMessage);
        client.channels.cache.get(data.on).send(embedMessage);
        schedule.scheduledJobs[jobID].cancel();
    });
}

module.exports = { validate, set };