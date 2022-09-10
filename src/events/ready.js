const { ClientUser, Client, ActivityType } = require("discord.js");
const axios = require('axios').default;

const APIs = {
	handleNumeric2D: 'https://server.jpgstoreapis.com/search/tokens?policyIds=["f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a"]&saleType=default&sortBy=price-low-to-high&traits={"type":["numeric"],"length":["two"]}&nameQuery=&verified=default&pagination={}&size=1',
	handleNumeric3D: 'https://server.jpgstoreapis.com/search/tokens?policyIds=["f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a"]&saleType=default&sortBy=price-low-to-high&traits={"type":["numeric"],"length":["three"]}&nameQuery=&verified=default&pagination={}&size=1',
	handleNumeric4D: 'https://server.jpgstoreapis.com/search/tokens?policyIds=["f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a"]&saleType=default&sortBy=price-low-to-high&traits={"type":["numeric"],"length":["four"]}&nameQuery=&verified=default&pagination={}&size=1'
};

async function changePresence(client){
	let numeric2D = await axios.get(APIs.handleNumeric2D);
	let numeric3D = await axios.get(APIs.handleNumeric3D);
	let numeric4D = await axios.get(APIs.handleNumeric4D);
	if(numeric2D.status !== 200 || numeric3D.status !== 200 || numeric4D.status !== 200){
		if(client.presence.activities[0].name !== `📕 Ada Handles`)
			client.user.setPresence({activities: [{name: `📕 Ada Handles`, type: ActivityType.Listening}]});
	}
	else{
		let status = `🧹 4D: ${Number(numeric4D.data.tokens[0].listing_lovelace) / 1000000} | `;
		status += `3D: ${Number(numeric3D.data.tokens[0].listing_lovelace) / 1000000} | `;
		status += `2D: ${(Number(numeric2D.data.tokens[0].listing_lovelace) / 1000000).toLocaleString()}`;
		if(client.presence.activities[0].name !== status)
			client.user.setPresence({activities: [{name: status, type: ActivityType.Watching}]});
	}
	setTimeout(() => changePresence(client), 30 * 1000);
}

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		changePresence(client);
	},
};