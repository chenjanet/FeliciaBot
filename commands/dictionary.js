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
        await apis.getRequest(process.env.DICTIONARY_URL + word + "?key=" + process.env.DICTIONARY_APIKEY, function(result) {
            const definitions = result.body;
            dictionary_embed.setTitle(`Definition(s) found for ${word}`)
            for (let defn in definitions) {
                let curr_defn = "";
                let curr_term = `${definitions[defn].hwi.hw} (${definitions[defn].fl})`;
                for (let i = 0; i < definitions[defn].shortdef.length; i++) {
                    curr_defn = `${curr_defn}- ${definitions[defn].shortdef[i]}\n`;
                }
                // note to self: find way to add a pagination feature for things with many different definitions
                // like those arrow reactions
                dictionary_embed.addField(
                    curr_term, curr_defn, false 
                );
            }
            return message.channel.send(dictionary_embed);
        });
    }
}