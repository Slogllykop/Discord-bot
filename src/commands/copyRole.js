const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "copyrole",
    description: "Copy permissions from one role to another",
    async execute(interaction) {
        const embed = new EmbedBuilder();

        if (
            !interaction.member.permissions.has(
                PermissionFlagsBits.Administrator
            )
        ) {
            embed
                .setColor("#FF0000")
                .setTitle("Failed to copy permissions")
                .setDescription(
                    "You do NOT have the permission to access this command."
                );
            await interaction.reply({ embeds: [embed], flags: 64 });
            return;
        }

        const sourceRole = interaction.options.getRole("source");
        const targetRole = interaction.options.getRole("target");

        if (!sourceRole || !targetRole) {
            return interaction.reply({
                content: "Please specify valid roles.",
                flags: 64,
            });
        }

        const sourcePermissions = sourceRole.permissions;
        const targetPermissions = targetRole.permissions;

        let changes = [];
        sourcePermissions.toArray().forEach((perm) => {
            if (!targetPermissions.toArray().includes(perm)) {
                changes.push(`+ ${perm}`);
            }
        });

        targetPermissions.toArray().forEach((perm) => {
            if (!sourcePermissions.toArray().includes(perm)) {
                changes.push(`- ${perm}`);
            }
        });

        try {
            if (changes.length > 0) {
                await targetRole.setPermissions(sourcePermissions);
                const changesMessage = `\`\`\`diff\n${changes.join(
                    "\n"
                )}\n\`\`\``;
                embed
                    .setColor("#00FF00")
                    .setTitle("Permissions Copied")
                    .setDescription(
                        `Copied permissions from <@&${sourceRole.id}> to <@&${targetRole.id}>.\n${changesMessage}`
                    );
            } else {
                embed
                    .setColor("#FFFF00")
                    .setTitle("Permissions NOT Copied")
                    .setDescription(
                        "No changes were made because the roles already have the same permissions."
                    );
            }

            await interaction.reply({ embeds: [embed], flags: 64 });
        } catch (error) {
            console.error(error);
            embed
                .setColor("#FF0000")
                .setTitle("Failed to copy permissions")
                .setDescription("An error occurred while copying permissions.");
            await interaction.reply({ embeds: [embed], flags: 64 });
        }
    },
};
