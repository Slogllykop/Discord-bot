const {
    EmbedBuilder,
    PermissionFlagsBits,
    PermissionsBitField,
} = require("discord.js");

module.exports = {
    name: "copychannel",
    description: "Copy permissions from one channel to another",
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

        const sourceChannel = interaction.options.getChannel("source");
        const targetChannel = interaction.options.getChannel("target");

        if (
            !sourceChannel ||
            !targetChannel ||
            sourceChannel.type !== targetChannel.type
        ) {
            embed
                .setColor("#FF0000")
                .setTitle("Failed to copy permissions")
                .setDescription(
                    "Please specify valid channels of the same type."
                );
            await interaction.reply({ embeds: [embed], flags: 64 });
            return;
        }

        const sourcePermissions = sourceChannel.permissionOverwrites;
        const targetPermissions = targetChannel.permissionOverwrites;

        let changes = [];

        if (sourcePermissions.cache.size === 0) {
            await Promise.all(
                targetPermissions.cache.map(async (targetPerm) => {
                    let name = "";

                    if (targetPerm.type === 0) {
                        const role = interaction.guild.roles.cache.get(
                            targetPerm.id
                        );
                        name = role ? role.name : "Unknown Role";
                        permName = `Role: ${name}`;
                    } else if (targetPerm.type === 1) {
                        const user = await interaction.guild.members.fetch(
                            targetPerm.id
                        );
                        name = user ? user.user.username : "Unknown User";
                        permName = `User: ${name}`;
                    }

                    let userPerms = `${permName}\n`;

                    const targetAllow = new PermissionsBitField(
                        targetPerm.allow.bitfield
                    ).toArray();
                    const targetDeny = new PermissionsBitField(
                        targetPerm.deny.bitfield
                    ).toArray();

                    targetAllow.forEach((perm) => {
                        userPerms += `- ${perm}\n`;
                    });
                    targetDeny.forEach((perm) => {
                        userPerms += `- ${perm}\n`;
                    });

                    if (userPerms.trim() !== `${permName}`) {
                        changes.push(userPerms.trim() + "\n");
                    }
                })
            );
        } else {
            for (const sourcePerm of sourcePermissions.cache.values()) {
                const targetPerm = targetPermissions.cache.get(sourcePerm.id);

                let permName = "";
                let name = "";

                if (sourcePerm.type === 0) {
                    const role = interaction.guild.roles.cache.get(
                        sourcePerm.id
                    );
                    name = role ? role.name : "Unknown Role";
                    permName = `Role: ${name}`;
                } else if (sourcePerm.type === 1) {
                    const user = await interaction.guild.members.fetch(
                        sourcePerm.id
                    );
                    name = user ? user.user.username : "Unknown User";
                    permName = `User: ${name}`;
                }

                let userPerms = `${permName}\n`;

                const sourceAllow = new PermissionsBitField(
                    sourcePerm.allow.bitfield
                ).toArray();
                const sourceDeny = new PermissionsBitField(
                    sourcePerm.deny.bitfield
                ).toArray();

                const targetAllow = targetPerm
                    ? new PermissionsBitField(
                          targetPerm.allow.bitfield
                      ).toArray()
                    : [];
                const targetDeny = targetPerm
                    ? new PermissionsBitField(
                          targetPerm.deny.bitfield
                      ).toArray()
                    : [];

                sourceAllow.forEach((perm) => {
                    if (!targetAllow.includes(perm)) {
                        userPerms += `+ ${perm}\n`;
                    }
                });

                sourceDeny.forEach((perm) => {
                    if (!targetDeny.includes(perm)) {
                        userPerms += `- ${perm}\n`;
                    }
                });

                targetAllow.forEach((perm) => {
                    if (!sourceAllow.includes(perm)) {
                        userPerms += `- ${perm}\n`;
                    }
                });

                targetDeny.forEach((perm) => {
                    if (!sourceDeny.includes(perm)) {
                        userPerms += `+ ${perm}\n`;
                    }
                });

                if (userPerms.trim() !== `${permName}`) {
                    changes.push(userPerms.trim() + "\n");
                }
            }

            for (const targetPerm of targetPermissions.cache.values()) {
                const sourcePerm = sourcePermissions.cache.get(targetPerm.id);

                let name = "";
                let permName = "";

                if (targetPerm.type === 0) {
                    const role = interaction.guild.roles.cache.get(
                        targetPerm.id
                    );
                    name = role ? role.name : "Unknown Role";
                    permName = `Role: ${name}`;
                } else if (targetPerm.type === 1) {
                    const user = await interaction.guild.members.fetch(
                        targetPerm.id
                    );
                    name = user ? user.user.username : "Unknown User";
                    permName = `User: ${name}`;
                }

                if (!sourcePerm) {
                    const targetAllow = new PermissionsBitField(
                        targetPerm.allow.bitfield
                    ).toArray();
                    const targetDeny = new PermissionsBitField(
                        targetPerm.deny.bitfield
                    ).toArray();

                    let additionalPerms = `${permName}\n`;

                    targetAllow.forEach((perm) => {
                        additionalPerms += `- ${perm}\n`;
                    });

                    targetDeny.forEach((perm) => {
                        additionalPerms += `- ${perm}\n`;
                    });

                    changes.push(additionalPerms.trim() + "\n");
                }
            }
        }

        try {
            if (changes.length > 0) {
                await targetChannel.permissionOverwrites.set(
                    sourcePermissions.cache.map((overwrite) => ({
                        id: overwrite.id,
                        allow: overwrite.allow.bitfield,
                        deny: overwrite.deny.bitfield,
                        type: overwrite.type,
                    }))
                );
                const changesMessage = `\`\`\`diff\n${changes.join(
                    "\n"
                )}\n\`\`\``;
                embed
                    .setColor("#00FF00")
                    .setTitle("Permissions Copied")
                    .setDescription(
                        `Copied permissions from <#${sourceChannel.id}> to <#${targetChannel.id}>.\n\n(**NOTE:** Any permission that is set to default, whether it was originally marked as [-] or [+], is considered as negative overall.)\n${changesMessage}`
                    );
            } else {
                embed
                    .setColor("#FFFF00")
                    .setTitle("Permissions NOT Copied")
                    .setDescription(
                        `No changes were made because the channels already have the same permissions.`
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
