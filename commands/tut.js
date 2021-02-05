const { embedMessage } = require("../services/misc");
const fs = require("fs");

module.exports = {
    name: "tut",
    execute(message, args) {
        const commands = ["tt-add", "tt-delete", "tt-get"];
        if (!args || args.length === 0) {
            fs.readFile("./static/tut/main.md", (err, data) => {
                embedMessage(message.channel, "Usage!", data);
            });
        } else if (commands.includes(args[0])) {
            fs.readFile(`./static/tut/${args[0]}.md`, (err, data) => {
                embedMessage(message.channel, "Usage!", data);
            });
        } else {
            embedMessage(
                message.channel,
                "Incorrect Usage!",
                "Use `;tut` to list the selected commands."
            );
        }
    },
};
