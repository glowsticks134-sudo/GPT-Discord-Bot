const Discord = require('discord.js');
const { runInteractionFeature, ephemeralOption } = require('../../utils/aiFeatureRunner');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("explain")
        .setDescription("Explain something in a clear way.")
        .setDMPermission(true)
        .addStringOption(option => option
            .setName("text")
            .setDescription("What should I explain?")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("level")
            .setDescription("How simple should the explanation be? (Default: Beginner)")
            .addChoices(
                {
                    name: 'Like I am 5',
                    value: 'like the reader is 5 years old'
                },
                {
                    name: 'Beginner',
                    value: 'for a beginner'
                },
                {
                    name: 'Detailed',
                    value: 'in detail'
                },
                {
                    name: 'Step by step',
                    value: 'step by step'
                }
            )
            .setRequired(false)
        )
        .addStringOption(ephemeralOption),

    async execute(client, interaction) {
        const text = interaction.options.getString("text");
        const level = interaction.options.getString("level") || 'for a beginner';

        await runInteractionFeature({
            interaction,
            client,
            title: `Explain: ${text}`,
            systemPrompt: `Explain the user's topic ${level}. Use clear language, examples, and avoid unnecessary jargon. If the topic has risks or limitations, mention them briefly.`,
            userPrompt: text,
            temperature: 0.5,
            attachmentName: 'explanation.txt',
            copyable: false
        });
    },
};