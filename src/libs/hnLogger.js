var colors = require('colors');
const { MessageEmbed } = require('discord.js');

colors.setTheme({
    info: ['yellow'],
    warn: ['brightRed', 'underline'],
    error: ['red', 'brightWhite', 'bold', 'underline'],
    success: ['green'],
    gay: ['rainbow'],
});

module.exports = {
    JustConsole: function (text = "No Text Provided", type = "normal") {
        if (type == "normal"){
            console.log(text);
        }
        else if (type == "info"){
            console.log(colors.info(text));
        }
        else if (type == "warn"){
            console.log(colors.warn(text));
        }
        else if (type == "error"){
            console.log(colors.error(text));
        }
        else if (type == "success"){
            console.log(colors.success(text));
        }
        else if (type == "gay"){
            console.log(colors.gay(text));
        }
        else{
            console.log(text);
        }
    }
};