const Discord = require('discord.js');
const config = require('../../utils/config');
const { runMessageFeature } = require('../../utils/aiFeatureRunner');

module.exports = {
    name: "Summarize",
    aliases: ['Sum', 'TLDR', 'Summary'],
    description: "Summarizes long text into copy-friendly bullet points.",

    async execute(client, message, args, cmd) {
        if (!args[0]) {
            const embed = new Discord.EmbedBuilder()
                .setColor(config.ErrorColor)
                .setTitle('Error')
                .setDescription(`Use it like this:\n\`\`\`\n${config.Prefix}${cmd} Paste a long message here\n\`\`\``);

            await message.reply({ embeds: [embed] });
            return;
        }

        const text = args.join(" ");
        await runMessageFeature({
            message,
            client,
            title: `Summarize: ${text}`,
            systemPrompt: 'Summarize the user text into clear bullet points. Keep only the important facts, decisions, names, dates, and action items. Do not invent information.',
            userPrompt: text,
            temperature: 0.3,
            attachmentName: 'summary.txt',
            copyable: true
        });
    },
};