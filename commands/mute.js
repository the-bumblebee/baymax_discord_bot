module.exports = {
    name: "mute",
    execute(message, args) {
        if (message.member.voice.channel) {
            let channel = message.member.voice.channel;
            for (const [memberID, member] of channel.members) {
                member.voice.setMute(true);
            }
            // console.log(channel.members.length);
            message.channel.send(
                `All the users in \`${channel.name}\` are muted. Use\`;unmute\` to unmute.`
            );

            // let member = message.guild.members.cache.get("753555668157595698");
            // member.voice
            //     .setChannel(
            //         message.guild.channels.cache.get("739743435228971138")
            //     )
            //     .catch((err) => console.log(err));

            // let channels = message.guild.channels.cache.filter((channel) => {
            //     return channel.type === "voice";
            // });
            // console.log(channels);

            // let channel = message.member.voice.channel;
            // if (channel.id === "762890123188240395") console.log("Yaaaaay");
            // else console.log("OOOOOASDA");
        } else {
            message.reply("You need to join a voice channel, first.");
        }
    },
};
