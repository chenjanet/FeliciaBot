const Discord = require('discord.js');
const apis = require('./apis.js');

module.exports = {
    name: 'dictionary',
    description: 'Translates a phrase from one language to another',
    args: true,
    displayHelp: true,
    usage: '<word>',
    async execute(message, args) {
        const dictionary_embed = new Discord.MessageEmbed().setColor('#0099ff');
        if (args.length != 1) {
            return message.channel.send("Error: command must include a singular word");
        }
        const word = args[0];
        const definition = await apis.getRequest(process.env.DICTIONARY_URL + word + "?key=" + process.env.DICTIONARY_APIKEY, function(result) {
            return result;
        });

        console.log("DEFINITION IS:", definition);
    }
}