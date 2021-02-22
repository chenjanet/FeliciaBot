const Discord = require('discord.js');
const apis = require('../helpers/apis.js');

module.exports = {
    name: 'thesaurus',
    description: 'Returns synonym(s) and antonym(s) of a given English word, courtesy of Merriam-Webster Thesaurus API',
    args: true,
    displayHelp: true,
    usage: '<word>',
    async execute(message, args) {
        let thesaurus_embed = new Discord.MessageEmbed().setColor('#0099ff');
        if (args.length != 1) {
            return message.channel.send("Error: command must include a singular word");
        }
        const word = args[0];
        await apis.getRequest(process.env.THESAURUS_URL + word + "?key=" + process.env.THESAURUS_APIKEY, function(result) {
            const synonyms = result.body;
            thesaurus_embed.setTitle(`Synonym(s) found for ${word}`);
            let counter = 5;
            let embeds = [];
            let current_embed = 0;
            for (let result in synonyms) {
                let curr_term = `${synonyms[result].hwi.hw} (${synonyms[result].fl})`;
                let curr_synonyms = [];
                let curr_antonyms = [];
                let curr_result;
                for (let i = 0; i < synonyms[result].meta.syns.length; i++) {
                    curr_synonyms.push(synonyms[result].meta.syns[i].join(", "));
                }
                for (let j = 0; j < synonyms[result].meta.ants.length; j++) {
                    curr_antonyms.push(synonyms[result].meta.ants[j].join(", "));
                }
                curr_result = `**Synonyms:**\n${curr_synonyms.join("; ")}\n**Antonyms:**\n${curr_antonyms.join(", ")}`;
                if (counter === 0) {
                    embeds.push(thesaurus_embed);
                    thesaurus_embed = new Discord.MessageEmbed().setColor('#0099ff').setTitle(`Definition(s) found for ${word}`);
                    counter = 5;
                }
                thesaurus_embed.addField(
                    `__${curr_term}__`, curr_result, false 
                );
                counter--;
            }
            embeds.push(thesaurus_embed);
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