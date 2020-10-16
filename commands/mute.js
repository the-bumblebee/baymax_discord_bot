module.exports = {
    name: "mute",
    execute(message, args) {
        if (message.member.voice.channel) {
            // let channel = message.member.voice.channel;
            // for (const [memberID, member] of channel.members) {
            //     member.voice.setMute(true);
            // }
            // message.channel.send(
            //     `All the users in \`${channel.name}\` are muted. Use\`;unmute\` to unmute.`
            // );

            // let member = message.guild.members.cache.get("753555668157595698");
            // member.voice
            //     .setChannel(
            //         message.guild.channels.cache.get("739743435228971138")
            //     )
            //     .catch((err) => console.log(err));

            let channels = message.guild.channels.cache.find((channel) => {
                return channel.type === "voice";
            });
            console.log(channels.length);
        } else {
            message.reply("You need to join a voice channel, first.");
        }
    },
};
