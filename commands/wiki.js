const Discord = require('discord.js');
const request = require('request');
const apis = require('../helpers/apis.js');

module.exports = {
    name: 'wiki',
    description: 'Returns an excerpt of a wikipedia page if available, based on keyword search',
    args: true,
    usage: '<phrase to search>',
    async execute(message, args) {
        const wiki_embed = new Discord.MessageEmbed().setColor('#0099ff');
        if (args.length === 0) {
            return message.channel.send("Error: search query must be non-empty");
        }
        const phrase = encodeURIComponent(args.join(" "));
        await apis.getRequest(process.env.WIKI_SEARCH_URL + "&search=" + phrase, "body", async function(result) {
            wiki_embed.setTitle(`Wikipedia search results for ${phrase}`);
            if (result[1]?.length == 0) {
                return message.channel.send(`No Wikipedia results found for ${phrase}`);
            }
            const page_title = result[1];
            const url = result[3];
            await apis.getRequest(process.env.WIKI_GET_URL + "&titles=" + page_title, "body", function(result) {
                const results = result.query.pages;
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
        request.get(process.env.WIKI_SEARCH_URL + "&search=" + phrase, { json: true }, (err, res, body) => {
            
        });
    }
}