const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const messageCreateHandler = require("./events/messageCreate");
require("dotenv").config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ],
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setActivity({
        name: "Noob HQ",
        type: ActivityType.Watching,
    });
});

client.on("messageCreate", (message) => messageCreateHandler(client, message));

const interactionCreate = require("./events/interactionCreate");
interactionCreate(client);

client.login(process.env.TOKEN);
