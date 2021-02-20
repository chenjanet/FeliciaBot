const Discord = require('discord.js');
const request = require('request');

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
        const phrase = encodeURIComponent(args.join(" "));
        request.get(process.env.WIKI_SEARCH_URL + "&search=" + phrase, { json: true }, (err, res, body) => {
            if (err) {
                return console.log(err);
            }
            wiki_embed.setTitle(`Wikipedia search results for ${phrase}`);
            if (body[1]?.length == 0) {
                return message.channel.send(`No Wikipedia results found for ${phrase}`);
            }
            const result = body[1];
            const url = body[3];
            request.get(process.env.WIKI_GET_URL + "&titles=" + result, { json: true }, (err, res, body) => {
                if (err) {
                    return console.log(err);
                }
                const results = body.query.pages;
                if (Object.keys(results).length == 0) {
                    return message.channel.send(`No Wikipedia results found for ${phrase}`);
                }
                for (let key in results) {
                    if (results[key].extract.length > 0) {
                        wiki_embed.addField(
                            results[key].title, results[key].extract, false
                        );
                    }
                }
                wiki_embed.setFooter(`Learn more at ${url}`);
                return message.channel.send(wiki_embed);
            });
        });
    }
}