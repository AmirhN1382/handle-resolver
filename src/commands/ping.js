const { SlashCommandBuilder } = require('@discordjs/builders');
const SEG = require('../libs/hnSEG');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		interaction.reply({embeds: [SEG.JustDescp(`~~Pong 🏓~~ ** YES I AM ALIVE (╯°□°）╯︵ ┻━┻ **`, `Random`)]});
	},
};