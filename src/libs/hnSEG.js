const { EmbedBuilder } = require('discord.js');
function capitalizeFirstLetter(string) 
{
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
module.exports = {
    JustDescp: function (msg = "no message provided?.", color = "White", image) {
        color = capitalizeFirstLetter(color);
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTimestamp()
            .setFooter({text: 'Handle Resolver 📘'})
            .setDescription(msg);
        if(image) embed.setImage(image);
        //console.log(embed.toJSON());
        return embed;
    }
};