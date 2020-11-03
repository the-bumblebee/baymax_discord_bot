const { embedMessage } = require("../services/misc");
const fs = require("fs");

module.exports = {
    name: "help",
    execute(message, args) {
        if (!args || args.length === 0) {
            fs.readFile("./static/help.md", (err, data) => {
                embedMessage(message.channel, "Usage!", data);
            });
            return;
        } else if (args[0] === "events") {
            fs.readFile("./static/helpEvents.md", (err, data) => {
                embedMessage(message.channel, "Usage!", data);
            });
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
