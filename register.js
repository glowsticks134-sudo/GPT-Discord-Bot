const Discord = require('discord.js');
const chalk = require('chalk');
const fs = require('node:fs');
const config = require('./utils/config');
const commands = [];

const commandFiles = fs.readdirSync(`./commands/interactions/`).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/interactions/${file}`);
    commands.push(command.data.toJSON());
}

(async () => {

    try {

        if (!config.Token || !config.ClientID) {
            console.log(chalk.bold.yellowBright('Slash command registration skipped.'));
            console.log('Add DISCORD_BOT_TOKEN and DISCORD_CLIENT_ID before running node register.js.');
            return;
        }

        const rest = new Discord.REST({ version: '10' }).setToken(config.Token);

        console.log(chalk.bold.yellowBright(`Started refreshing ${commands.length} application (/) commands.`));

        const data = await rest.put(
            Discord.Routes.applicationCommands(config.ClientID),
            { body: commands },
        );

        console.log(chalk.bold.greenBright(`Successfully reloaded ${data.length} application (/) commands.`));
        console.log(chalk.bold.redBright(`Note: if you didn't see slash commands in your server maybe your bot don't have "applicatiton.commands" scope try to invite it using this link\nhttps://discord.com/api/oauth2/authorize?client_id=${config.ClientID}&permissions=0&scope=bot%20applications.commands`))

    } catch (error) {
        console.error(chalk.bold.redBright(error));
    }

})();