const Discord = require('discord.js');
const { runInteractionFeature, ephemeralOption } = require('../../utils/aiFeatureRunner');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("brainstorm")
        .setDescription("Generate creative ideas for a topic.")
        .setDMPermission(true)
        .addStringOption(option => option
            .setName("topic")
            .setDescription("What do you need ideas for?")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("type")
            .setDescription("What kind of ideas? (Default: General)")
            .addChoices(
                {
                    name: 'General',
                    value: 'general'
                },
                {
                    name: 'Content ideas',
                    value: 'content'
                },
                {
                    name: 'Business ideas',
                    value: 'business'
                },
                {
                    name: 'Discord server ideas',
                    value: 'discord server'
                },
                {
                    name: 'Image prompts',
                    value: 'image prompts'
                }
            )
            .setRequired(false)
        )
        .addStringOption(ephemeralOption),

    async execute(client, interaction) {
        const topic = interaction.options.getString("topic");
        const type = interaction.options.getString("type") || 'general';

        await runInteractionFeature({
            interaction,
            client,
            title: `Brainstorm: ${topic}`,
            systemPrompt: `You are a creative brainstorming assistant. Generate 10 useful ${type} ideas. Make each idea specific, practical, and different from the others. Include a short explanation for each.`,
            userPrompt: topic,
            temperature: 0.9,
            attachmentName: 'ideas.txt',
            copyable: false
        });
    },
};