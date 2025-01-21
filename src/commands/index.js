const help = require("./help");
const ping = require("./ping");
const twitch = require("./twitch");

module.exports.executeCommand = (command, client, message) => {
    switch (command) {
        case "help":
            help(message);
            break;
        case "twitch":
            twitch(message);
            break;
        case "ping":
            ping(client, message);
            break;
        default:
            break;
    }
};
