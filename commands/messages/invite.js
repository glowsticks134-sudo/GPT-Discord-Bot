const Discord = require('discord.js');
const config = require('../../utils/config');

module.exports = {
    name: "Invite",
    aliases: ["Inv"],
    description: "Get a link to add this bot to your account and use it anywhere.",

    async execute(client, message, args, cmd) {

        await message.channel.sendTyping();

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
                text: `Commanded by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ size: 1024 })
            });

        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel('Add to Account')
                    .setStyle(Discord.ButtonStyle.Link)
                    .setURL(inviteURL)
                    .setEmoji('🤖')
            );

        await message.reply({ embeds: [embed], components: [row] });

    },

};
