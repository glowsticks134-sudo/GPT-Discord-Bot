const Discord = require('discord.js');
const { runInteractionFeature, ephemeralOption } = require('../../utils/aiFeatureRunner');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("summarize")
        .setDescription("Summarize long text into the most important points.")
        .setDMPermission(true)
        .addStringOption(option => option
            .setName("text")
            .setDescription("Paste the text you want summarized.")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("style")
            .setDescription("How should the summary look? (Default: Bullet points)")
            .addChoices(
                {
                    name: 'Bullet points',
                    value: 'bullet points'
                },
                {
                    name: 'Short paragraph',
                    value: 'short paragraph'
                },
                {
                    name: 'Detailed notes',
                    value: 'detailed notes'
                }
            )
            .setRequired(false)
        )
        .addStringOption(ephemeralOption),

    async execute(client, interaction) {
        const text = interaction.options.getString("text");
        const style = interaction.options.getString("style") || 'bullet points';

        await runInteractionFeature({
            interaction,
            client,
            title: `Summarize: ${text}`,
            systemPrompt: `You summarize text into clear ${style}. Keep only the important facts, decisions, names, dates, and action items. Do not invent information.`,
            userPrompt: text,
            temperature: 0.3,
            attachmentName: 'summary.txt',
            copyable: true
        });
    },
};