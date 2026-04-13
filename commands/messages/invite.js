const Discord = require('discord.js');
const config = require('../../utils/config');

module.exports = {
    name: "Invite",
    aliases: ["Inv", "AddBot"],
    description: "Get a link to invite this bot to your server.",

    async execute(client, message, args, cmd) {

        await message.channel.sendTyping();

        const inviteURL = client.generateInvite({
            scopes: [
                Discord.OAuth2Scopes.Bot,
                Discord.OAuth2Scopes.ApplicationsCommands
            ],
            permissions: [
                Discord.PermissionFlagsBits.ViewChannel,
                Discord.PermissionFlagsBits.SendMessages,
                Discord.PermissionFlagsBits.SendMessagesInThreads,
                Discord.PermissionFlagsBits.EmbedLinks,
                Discord.PermissionFlagsBits.ReadMessageHistory,
                Discord.PermissionFlagsBits.ManageMessages,
                Discord.PermissionFlagsBits.KickMembers,
                Discord.PermissionFlagsBits.BanMembers,
                Discord.PermissionFlagsBits.ModerateMembers,
                Discord.PermissionFlagsBits.UseExternalEmojis
            ]
        });

        const embed = new Discord.EmbedBuilder()
            .setColor(config.MainColor)
            .setAuthor({
                name: `Invite ${client.user.username}`,
                iconURL: client.user.displayAvatarURL({ size: 1024 })
            })
            .setDescription(`Click the button below to invite **${client.user.username}** to your server!\n\nThe bot will request the permissions it needs to run all its features including AI chat, image generation, and auto-moderation.`)
            .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
            .setFooter({
                text: `Commanded by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ size: 1024 })
            });

        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel('Invite Bot')
                    .setStyle(Discord.ButtonStyle.Link)
                    .setURL(inviteURL)
                    .setEmoji('🤖')
            );

        await message.reply({ embeds: [embed], components: [row] });

    },

};
