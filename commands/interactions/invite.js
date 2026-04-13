const Discord = require('discord.js');
const config = require('../../utils/config');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("invite")
        .setDescription("Get a link to invite this bot to your server.")
        .setDMPermission(true)
        .addStringOption(option => option
            .setName('ephemeral')
            .setDescription('Hides the bot\'s reply from others. (Default: Enable)')
            .addChoices(
                { name: 'Enable', value: 'Enable' },
                { name: 'Disable', value: 'Disable' }
            )
        ),

    async execute(client, interaction) {

        const ephemeralChoice = interaction.options.getString('ephemeral');
        const ephemeral = ephemeralChoice === 'Disable' ? false : true;
        await interaction.deferReply({ ephemeral: ephemeral });

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
                text: `Commanded by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ size: 1024 })
            });

        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel('Invite Bot')
                    .setStyle(Discord.ButtonStyle.Link)
                    .setURL(inviteURL)
                    .setEmoji('🤖')
            );

        await interaction.editReply({ embeds: [embed], components: [row] });

    },

};
