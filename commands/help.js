const { embedMessage } = require("../sevices/misc");

module.exports = {
    name: "help",
    execute(message, args) {
        if (!args || args.length === 0) {
            embedMessage(
                message.channel,
                "Usage!",
                require("../sevices/help").helpString
            );
            return;
        } else if (args[0] === "events") {
            embedMessage(
                message.channel,
                "`;events` Usage!",
                require("../sevices/help").helpEvents
            );
            return;
        } else {
            embedMessage(
                message.channel,
                "Incorrect Usage!",
                "Use `;help` to list all the available commands and documentation."
            );
            return;
        }
    },
};
