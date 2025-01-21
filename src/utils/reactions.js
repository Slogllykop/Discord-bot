const reactTo = [
    { word: "hello", emoji: "👋" },
    { word: "hi", emoji: "👋" },
    { word: "venky", emoji: "🔥" },
    { word: "slog", emoji: "🤖" },
    { word: "death", emoji: "💀" },
];

module.exports.handleReactions = async (message) => {
    const words = new Set(message.content.toLowerCase().split(/\s+/));

    const reactionPromises = reactTo
        .filter(({ word }) => words.has(word))
        .map(({ emoji }) => message.react(emoji));

    await Promise.all(reactionPromises).catch(console.error);
};
