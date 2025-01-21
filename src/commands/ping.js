const { EmbedBuilder } = require("discord.js");

module.exports = async (client, message) => {
    const embed = new EmbedBuilder();

    embed.setColor("#FFFF00").setTitle("Pinging...");

    const msg = await message.reply({ embeds: [embed] });

    const latency = msg.createdTimestamp - message.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping);

    embed
        .setColor("#00FF00")
        .setTitle("Latency Information")
        .addFields(
            { name: "Latency", value: `${latency}ms`, inline: true },
            { name: "API Latency", value: `${apiLatency}ms`, inline: true }
        );

    await msg.edit({ content: null, embeds: [embed] });
};
