const Discord = require('discord.js');

module.exports = {
    name: 'wiki',
    description: 'Returns an excerpt of a wikipedia page if available, based on keyword search',
    args: true,
    displayHelp: true,
    usage: '<phrase to search>',
    async execute(message, args) {
        const wiki_embed = new Discord.MessageEmbed().setColor('#0099ff');
        if (args.length == 0) {
            return message.channel.send("Error: search query must be non-empty");
        }
        
    }
}