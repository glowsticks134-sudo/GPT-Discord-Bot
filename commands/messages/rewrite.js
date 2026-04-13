const Discord = require('discord.js');
const config = require('../../utils/config');
const { runMessageFeature } = require('../../utils/aiFeatureRunner');

const tones = ['friendly', 'professional', 'confident', 'funny', 'simple'];

module.exports = {
    name: "Rewrite",
    aliases: ['Reword', 'Tone'],
    description: "Rewrites text in a different tone. Example: Rewrite professional your text here",

    async execute(client, message, args, cmd) {
        if (!args[0]) {
            const embed = new Discord.EmbedBuilder()
                .setColor(config.ErrorColor)
                .setTitle('Error')
                .setDescription(`Use it like this:\n\`\`\`\n${config.Prefix}${cmd} professional Please answer me soon\n\`\`\``);

            await message.reply({ embeds: [embed] });
            return;
        }

        let tone = 'friendly';
        if (tones.includes(args[0].toLowerCase())) {
            tone = args.shift().toLowerCase();
        }

        const text = args.join(" ");
        if (!text) {
            await message.reply({ content: `Please include text to rewrite after the tone.` });
            return;
        }

        await runMessageFeature({
            message,
            client,
            title: `Rewrite: ${text}`,
            systemPrompt: `Rewrite the user's text in a ${tone} tone. Preserve the original meaning, names, facts, and intent. Return only the rewritten text.`,
            userPrompt: text,
            temperature: 0.7,
            attachmentName: 'rewrite.txt',
            copyable: true
        });
    },
};