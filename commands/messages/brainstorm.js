const Discord = require('discord.js');
const config = require('../../utils/config');
const { runMessageFeature } = require('../../utils/aiFeatureRunner');

module.exports = {
    name: "Brainstorm",
    aliases: ['Ideas', 'Idea'],
    description: "Generates creative AI ideas for a topic.",

    async execute(client, message, args, cmd) {
        if (!args[0]) {
            const embed = new Discord.EmbedBuilder()
                .setColor(config.ErrorColor)
                .setTitle('Error')
                .setDescription(`Use it like this:\n\`\`\`\n${config.Prefix}${cmd} video ideas for a gaming channel\n\`\`\``);

            await message.reply({ embeds: [embed] });
            return;
        }

        const topic = args.join(" ");
        await runMessageFeature({
            message,
            client,
            title: `Brainstorm: ${topic}`,
            systemPrompt: 'You are a creative brainstorming assistant. Generate 10 useful ideas. Make each idea specific, practical, and different from the others. Include a short explanation for each.',
            userPrompt: topic,
            temperature: 0.9,
            attachmentName: 'ideas.txt',
            copyable: false
        });
    },
};