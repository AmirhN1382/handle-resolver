const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, PermissionsBitField, ButtonStyle } = require('discord.js');
const { ContextMenuCommandBuilder, ApplicationCommandType, AttachmentBuilder } = require('discord.js');
const SEG = require('../libs/hnSEG');
const config = require('../config.json');
const fetch = require('../libs/handleFetch');
const axios = require('axios').default;

fetchCache = {};

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('resolve-user')
		.setType(ApplicationCommandType.User),
	async execute(interaction) {
		await interaction.deferReply({ephemeral: false});
		if(!interaction.inGuild()) return interaction.editReply({embeds: [SEG.JustDescp(`resolve-user is not available outside of guild.\n`+
		`However, you can use resolve-message in my DMs.`, `Red`)]});
		let handleRegex = new RegExp(config.handle_regex, 'i');
		if(!handleRegex.test(interaction.targetMember.nickname)) return interaction.editReply({embeds: [SEG.JustDescp(`No Handle Found.`, `Red`)]});
		interaction.targetMember.nickname = interaction.targetMember.nickname.toLowerCase();
		let handle = handleRegex.exec(interaction.targetMember.nickname);
		await interaction.editReply({embeds: [SEG.JustDescp(`Handle Found, **${handle}**\nFetching Data...`)]});
		try{
			if(!fetchCache.hasOwnProperty(handle[0])){
				let result = await fetch.fetchOne(handle[0]);
				if(result.data.status !== 200 || result.onChainData.status !== 200) 
					return interaction.editReply({embeds: [SEG.JustDescp(`Something Went Wrong... Status: ${result.data.status}`, `Red`, `https://http.cat/${result.data.status}`)]});
				fetchCache[handle[0]] = {
					address: result.data.data[0].address,
					ipfs: result.onChainData.data.onchain_metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/'),
					time: (new Date().getTime() / 1000).toFixed(0)
				};
				let image = await axios.get(fetchCache[handle[0]].ipfs, {responseType: 'arraybuffer'})
				image = Buffer.from(image.data, 'base64');
				fetchCache[handle[0]].image = image;
			}
			setTimeout(() => delete fetchCache[handle[0]], 5 * 60 * 1000);
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setLabel('Handle.me Link')
						.setURL(`https://handle.me/${handle[0].substring(1)}`)
						.setStyle(ButtonStyle.Link),
				);
			const attachment = new AttachmentBuilder(fetchCache[handle[0]].image, {name: `${handle[0]}.png`});
			let embed = new EmbedBuilder()
					.setFooter({text: `Handle Resolver 📘`})
					.setDescription(`Found Address for ${handle}!`+
					` Last Updated: <t:${fetchCache[handle[0]].time}:R>`+
					`\n\n\`${fetchCache[handle[0]].address}\`\n\n`+
					`|| sending another message for our mobile friends if they want to copy ||`)
					.setColor(`Green`)
					.setImage(`attachment://${attachment.name.substring(1)}`);
			interaction.editReply({embeds: [embed], components:[row], files: [attachment]});
			return interaction.followUp(fetchCache[handle[0]].address);
		}
		catch(e){
			console.log(`Unexpected Error: ${e}`);
			interaction.editReply({embeds: [SEG.JustDescp(`Something Went Wrong... Try Again or contact us.`, `Red`)]});
		}
	},
};