const Discord = require('discord.js');
const openAI = require('openai');
const chalk = require('chalk');
const func = require('./functions');
const config = require('./config');

function cleanForCodeBlock(text) {
    return text.replaceAll('```', '`​``');
}

function safeTitle(text) {
    return text.length > 256 ? text.substring(0, 253) + "..." : text;
}

function makeAttachment(content, name) {
    return new Discord.AttachmentBuilder(
        Buffer.from(content, 'utf-8'),
        { name }
    );
}

async function createCompletion({ systemPrompt, userPrompt, temperature = 0.7 }) {
    if (!config.OpenAIapiKey) {
        throw new Error('OPENAI_API_KEY is not configured. Add it as a Replit secret to use AI commands.');
    }

    const openai = new openAI.OpenAI({ apiKey: config.OpenAIapiKey });
    const messages = [
        {
            role: 'system',
            content: systemPrompt
        },
        {
            role: 'user',
            content: userPrompt
        }
    ];

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: Math.max(256, func.tokenizer('gpt-3.5', messages).maxTokens),
        temperature
    });

    return {
        answer: response.choices[0].message.content,
        tokens: response.usage?.total_tokens || 0
    };
}

async function sendResult({ target, client, user, title, answer, tokens, attachmentName = 'ai-response.txt', copyable = false }) {
    const files = [];
    let description = answer;

    if (copyable) {
        const copyableAnswer = cleanForCodeBlock(answer);
        description = copyableAnswer.length <= 3900
            ? `Copyable output:\n\`\`\`\n${copyableAnswer}\n\`\`\``
            : answer;
        files.push(makeAttachment(answer, attachmentName));
    }

    if (description.length <= 4096) {
        const embed = new Discord.EmbedBuilder()
            .setColor(config.MainColor)
            .setAuthor({
                name: safeTitle(title),
                iconURL: user.displayAvatarURL()
            })
            .setDescription(description)
            .setFooter({
                text: tokens ? `Costs ${func.pricing('gpt-3.5', tokens)}` : 'AI response',
                iconURL: client.user.displayAvatarURL()
            });

        await target({ embeds: [embed], files });
    } else {
        await target({ files: [makeAttachment(answer, attachmentName)] });
    }
}

async function sendError({ target, user, title, error }) {
    console.error(chalk.bold.redBright(error));
    const message = error.response?.error?.message || error.message || 'Something went wrong while generating the AI response.';
    const embed = new Discord.EmbedBuilder()
        .setColor(config.ErrorColor)
        .setAuthor({
            name: safeTitle(title),
            iconURL: user.displayAvatarURL()
        })
        .setDescription(message.length > 4096 ? message.substring(0, 4093) + "..." : message);

    await target({ embeds: [embed] }).catch(() => null);
}

async function runInteractionFeature({ interaction, client, title, systemPrompt, userPrompt, temperature, attachmentName, copyable }) {
    const ephemeralChoice = interaction.options.getString('ephemeral');
    const ephemeral = ephemeralChoice === 'Disable' ? false : true;
    await interaction.deferReply({ ephemeral });

    try {
        const result = await createCompletion({ systemPrompt, userPrompt, temperature });
        await sendResult({
            target: (payload) => interaction.editReply(payload),
            client,
            user: interaction.user,
            title,
            answer: result.answer,
            tokens: result.tokens,
            attachmentName,
            copyable
        });
    } catch (error) {
        await sendError({
            target: (payload) => interaction.editReply(payload),
            user: interaction.user,
            title,
            error
        });
    }
}

async function runMessageFeature({ message, client, title, systemPrompt, userPrompt, temperature, attachmentName, copyable }) {
    await message.channel.sendTyping();

    try {
        const result = await createCompletion({ systemPrompt, userPrompt, temperature });
        await sendResult({
            target: (payload) => message.reply(payload),
            client,
            user: message.author,
            title,
            answer: result.answer,
            tokens: result.tokens,
            attachmentName,
            copyable
        });
    } catch (error) {
        await sendError({
            target: (payload) => message.reply(payload),
            user: message.author,
            title,
            error
        });
    }
}

function ephemeralOption(option) {
    return option
        .setName('ephemeral')
        .setDescription('Hides the bot\'s reply from others. (Default: Enable)')
        .addChoices(
            {
                name: 'Enable',
                value: 'Enable'
            },
            {
                name: 'Disable',
                value: 'Disable'
            }
        )
        .setRequired(false);
}

module.exports = {
    runInteractionFeature,
    runMessageFeature,
    ephemeralOption
};