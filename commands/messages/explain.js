const Discord = require('discord.js');
const config = require('../../utils/config');
const { runMessageFeature } = require('../../utils/aiFeatureRunner');

module.exports = {
    name: "Explain",
    aliases: ['ELI5', 'ExplainLikeIm5'],
    description: "Explains a topic clearly and simply.",

    async execute(client, message, args, cmd) {
        if (!args[0]) {
            const embed = new Discord.EmbedBuilder()
                .setColor(config.ErrorColor)
                .setTitle('Error')
                .setDescription(`Use it like this:\n\`\`\`\n${config.Prefix}${cmd} how black holes work\n\`\`\``);

            await message.reply({ embeds: [embed] });
            return;
        }

        const text = args.join(" ");
        await runMessageFeature({
            message,
            client,
            title: `Explain: ${text}`,
            systemPrompt: 'Explain the user topic for a beginner. Use clear language, examples, and avoid unnecessary jargon. If the topic has risks or limitations, mention them briefly.',
            userPrompt: text,
            temperature: 0.5,
            attachmentName: 'explanation.txt',
            copyable: false
        });
    },
};