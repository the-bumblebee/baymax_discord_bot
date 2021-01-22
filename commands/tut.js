const { embedMessage } = require("../services/misc");
const fs = require("fs");

module.exports = {
    name: "tut",
    execute(message, args) {
        if (!args || args.length === 0) {
            fs.readFile("./static/tut/main.md", (err, data) => {
                embedMessage(message.channel, "Usage!", data);
            });
            return;
        } else if (args[0] === "tt-add") {
            fs.readFile("./static/tut/tt-add.md", (err, data) => {
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
