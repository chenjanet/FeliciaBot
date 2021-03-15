const Discord = require('discord.js');
const apis = require('../helpers/apis.js');
const langs = require('../language-codes.json');

module.exports = {
    name: 'dictionary',
    description: `Returns definition(s) of a given English word, courtesy of Merriam-Webster Dictionary API. Currently-supported languages: ${Object.keys(langs).join(", ")}`,
    args: true,
    usage: '<word>',
    async execute(message, args) {
        let dictionary_embed = new Discord.MessageEmbed().setColor('#0099ff');
        if (args.length != 1) {
            return message.channel.send("Error: command must include a singular word");
        }
        const word = args[0];
        await apis.getRequest(process.env.DICTIONARY_URL + word + "?key=" + process.env.DICTIONARY_APIKEY, "res", function(result) {
            const definitions = result.body;
            if (typeof definitions[0].hwi == "undefined") {
                let suggestions = "";
                dictionary_embed.setTitle(`No definition(s) found for ${word}`);
                for (let defn in definitions) {
                    suggestions = `${suggestions}, ${definitions[defn]}`;
                }
                dictionary_embed.addField(
                    "Try searching again using one of these terms:", suggestions.substring(1, suggestions.length), false
                );
                return message.channel.send(dictionary_embed);
            }
            let counter = 5;
            let embeds = [];
            let current_embed = 0;
            dictionary_embed.setTitle(`Definition(s) found for ${word}`);
            for (let defn in definitions) {
                let curr_defn = "";
                let curr_term = `${definitions[defn].hwi.hw} (${definitions[defn].fl})`;
                for (let i = 0; i < definitions[defn].shortdef.length; i++) {
                    curr_defn = `${curr_defn}   • ${definitions[defn].shortdef[i]}\n`;
                }
                if (curr_defn.length > 0 && curr_term.length > 0) {
                    if (counter === 0) {
                        embeds.push(dictionary_embed);
                        dictionary_embed = new Discord.MessageEmbed().setColor('#0099ff').setTitle(`Definition(s) found for ${word}`);
                        counter = 5;
                    }
                    dictionary_embed.addField(
                        curr_term, curr_defn, false 
                    );
                    counter--;
                }
            }
            embeds.push(dictionary_embed);
            const filter = (reaction, user) => {
                return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
            };

            message.channel.send(embeds[0]).then(msg => {
                if (embeds.length > 1) {
                    msg.react('➡️');
                }
                const collector = msg.createReactionCollector(filter, { time: 300000 });
                collector.on('collect', reaction => {
                    msg.reactions.removeAll().then(async () => {
                        if (reaction.emoji.name === '➡️') {
                            current_embed += 1;
                        } else {
                            current_embed -= 1;
                        }
                        if (current_embed <= 0) {
                            current_embed = 0;
                        } else if (current_embed >= embeds.length) {
                            current_embed -= 1;
                        }

                        msg.edit(embeds[current_embed]);
                       if (current_embed !== 0) {
                            await msg.react('⬅️');
                        }
                        if (current_embed < embeds.length - 1) {
                            await msg.react('➡️');
                        }
                    });
                })
                collector.on('end', () => {
                    msg.reactions.removeAll();
                });
            });
            return;
        });
    }
}