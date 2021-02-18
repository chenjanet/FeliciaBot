const Discord = require('discord.js');
const apis = require('../helpers/apis.js');

module.exports = {
    name: 'dictionary',
    description: 'Returns definition(s) of a given English word, courtesy of Merriam-Webster Dictionary API',
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
                let curr_term = `__${definitions[defn].hwi.hw} (${definitions[defn].fl})__`;
                for (let i = 0; i < definitions[defn].shortdef.length; i++) {
                    curr_defn = `${curr_defn}   • ${definitions[defn].shortdef[i]}\n`;
                }
                if (curr_defn.length > 0 && curr_term.length > 0) {
                    dictionary_embed.addField(
                        curr_term, curr_defn, false 
                    );
                }
                
            }
            return message.channel.send(dictionary_embed);
        });
    }
}