const Discord = require('discord.js');
const { runInteractionFeature, ephemeralOption } = require('../../utils/aiFeatureRunner');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("rewrite")
        .setDescription("Rewrite text in a different tone.")
        .setDMPermission(true)
        .addStringOption(option => option
            .setName("text")
            .setDescription("Paste the text you want rewritten.")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("tone")
            .setDescription("Choose the rewrite style. (Default: Friendly)")
            .addChoices(
                {
                    name: 'Friendly',
                    value: 'friendly'
                },
                {
                    name: 'Professional',
                    value: 'professional'
                },
                {
                    name: 'Confident',
                    value: 'confident'
                },
                {
                    name: 'Funny',
                    value: 'funny'
                },
                {
                    name: 'Simple',
                    value: 'simple'
                }
            )
            .setRequired(false)
        )
        .addStringOption(ephemeralOption),

    async execute(client, interaction) {
        const text = interaction.options.getString("text");
        const tone = interaction.options.getString("tone") || 'friendly';

        await runInteractionFeature({
            interaction,
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