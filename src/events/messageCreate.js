const { handleReactions } = require("../utils/reactions");
const { executeCommand } = require("../commands");

module.exports = (client, message) => {
    if (message.author.bot) return;

    handleReactions(message);

    const prefix = "+";

    if (message.content.startsWith(prefix)) {
        const command = message.content.slice(prefix.length).toLowerCase();
        executeCommand(command, client, message);
    }
};
