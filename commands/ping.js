module.exports = {
    name: "ping",
    execute(message, args) {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.channel.send(`Pong. Latency: ${timeTaken}ms`);
    },
};
