const Discord = require('discord.js');
const config = require('../../utils/config');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("invite")
        .setDescription("Get a link to add this bot to your account and use it anywhere.")
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

        const clientId = client.application.id;
        const inviteURL = `https://discord.com/oauth2/authorize?client_id=${clientId}&integration_type=1&scope=applications.commands`;

        const embed = new Discord.EmbedBuilder()
            .setColor(config.MainColor)
            .setAuthor({
                name: `Add ${client.user.username} to your account`,
                iconURL: client.user.displayAvatarURL({ size: 1024 })
            })
            .setDescription(`Click the button below to add **${client.user.username}** directly to your Discord account!\n\nOnce added, you can use the bot anywhere — in any server, DMs, or group chats — without needing to add it to a server.`)
            .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
            .setFooter({
                text: `Commanded by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ size: 1024 })
            });

        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel('Add to Account')
                    .setStyle(Discord.ButtonStyle.Link)
                    .setURL(inviteURL)
                    .setEmoji('🤖')
            );

        await interaction.editReply({ embeds: [embed], components: [row] });

    },

};
