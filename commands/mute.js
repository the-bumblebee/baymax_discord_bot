module.exports = {
    name: "mute",
    execute(message, args) {
        if (message.member.voice.channel) {
            let channel = message.member.voice.channel;
            for (const [memberID, member] of channel.members) {
                member.voice.setMute(true);
            }
            message.channel.send(
                `All the users in \`${channel.name}\` are muted. Use\`;unmute\` to unmute.`
            );
        } else {
            message.reply("You need to join a voice channel, first.");
        }
    },
};
