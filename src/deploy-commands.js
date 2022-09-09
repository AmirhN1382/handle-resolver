const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const config = require('./config.json');
let _config = config.isDev ? config.dev : config.production;

const commands = [];
const globalCommands = [];
const commandsPath = path.join(__dirname, 'commands');
const contextPath = path.join(__dirname, 'contexts');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const contextFiles = fs.readdirSync(contextPath).filter(file => file.endsWith('.js'));

const guildOnlyCommands = [
	//'panel.js'
]

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if(guildOnlyCommands.includes(file)){
		console.log(`${file} is guild only`);
		commands.push(command.data.toJSON());
	}else{
		console.log(`${file} is global`);
		globalCommands.push(command.data.toJSON());
		//commands.push(command.data.toJSON());
	}
}

for (const file of contextFiles) {
	const filePath = path.join(contextPath, file);
	const command = require(filePath);
	if(guildOnlyCommands.includes(file)){
		console.log(`${file} is guild only`);
		commands.push(command.data.toJSON());
	}else{
		console.log(`${file} is global`);
		globalCommands.push(command.data.toJSON());
		//commands.push(command.data.toJSON());
	}
}

const rest = new REST({ version: '10' }).setToken(_config.token);
if(guildOnlyCommands.length > 0)
	rest.put(Routes.applicationGuildCommands(_config.clientId, _config.guildId), { body: commands })
		.then(() => console.log('[GUILD] Successfully registered application commands.'))
		.catch(console.error);

rest.put(
	Routes.applicationCommands(_config.clientId), { body: globalCommands },)
	.then(() => console.log('[GLOBAL] Successfully registered application commands.')
)
