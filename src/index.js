const fs = require('fs');
const { Client, Collection, Intents, GatewayIntentBits, InteractionType, Partials, ActivityType } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require('./config.json');
let _config = config.isDev ? config.dev : config.production;
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds],
    presence: { activities: [{ name: 'Handles 📘', type: ActivityType.Watching }]}
});
const hnLogger = require('./libs/hnLogger');

client.commands = new Collection();

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const contextFiles = fs.readdirSync('./contexts').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

for (const file of contextFiles) {
	const context = require(`./contexts/${file}`);
	client.commands.set(context.data.name, context);
}

process.on("unhandledRejection", error => hnLogger.JustConsole(`> unhandledRejection: ${error}`, "error"));

client.on('interactionCreate', async interaction => {
	if (interaction.type === InteractionType.ApplicationCommand){
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            hnLogger.JustConsole(`> Error in interactionCreate[Command]: ${error}`, "error");
            return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
    else if (interaction.type === InteractionType.MessageComponent){
        const context = client.commands.get(interaction.commandName);
        if (!context) return;
        try {
            await context.execute(interaction);
        }
        catch (error) {
            hnLogger.JustConsole(`> Error in interactionCreate[Context]: ${error}`, "error");
            return interaction.reply({ content: 'There was an error while executing this Context Menu!', ephemeral: true });
        }
    }
});



for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

hnLogger.JustConsole(`> Connecting to Discord...`, "info");
client.login(_config.token);