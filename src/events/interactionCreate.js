const copyRole = require("../commands/copyRole");
const copyChannel = require("../commands/copyChannel");

module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) return;

        const { commandName } = interaction;

        if (commandName === "copyrole") {
            await copyRole.execute(interaction);
        } else if (commandName === "copychannel") {
            await copyChannel.execute(interaction);
        }
    });
};
