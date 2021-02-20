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
        console.log(phrase);
        request.get(process.env.WIKI_URL + "&titles=" + phrase, { json: true }, (err, res, body) => {
            if (err) {
                return console.log(err);
            }
            wiki_embed.setTitle(`Wikipedia search results for ${phrase}`);
            console.log(res.statusCode);
            const results = body.query.pages;
            console.log(results);
            for (let key in results) {
                wiki_embed.addField(
                    results[key].title, results[key].extract, false
                );
            }
            return message.channel.send(wiki_embed);
        });
    }
}