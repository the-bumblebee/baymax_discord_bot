module.exports = {
    name: "unmute",
    execute(message, args) {
        if (message.member.voice.channel) {
            let channel = message.member.voice.channel;
            for (const [memberID, member] of channel.members) {
                member.voice.setMute(false);
            }
            message.channel.send(
                `All the users in \`${channel.name}\` are unmuted.`
            );
        } else {
            message.reply("You need to join a voice channel, first.");
        }
    },
};
