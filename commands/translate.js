const Discord = require('discord.js');
const languageCodes = require('../language-codes.json');
require('dotenv').config();

const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const {IamAuthenticator } = require('ibm-watson/auth');

const languageTranslator = new LanguageTranslatorV3({
    version: '2018-05-01',
    authenticator: new IamAuthenticator({
        apikey: process.env.TRANSLATOR_APIKEY
    }),
    serviceUrl: process.env.TRANSLATOR_URL
});

module.exports = {
    name: 'translate',
    description: 'Translates a phrase from one language to another',
    args: true,
    displayHelp: true,
    usage: '<original language> <target language> <phrase>',
    async execute(message, args) {
        const translation_embed = new Discord.MessageEmbed().setColor('#0099ff');
        if (args.length < 3) {
            return message.channel.send("Error: not enough arguments.");
        }
        const text = args.slice(2, args.length).join(" ");
        const source_lang = languageCodes[args[0].toLowerCase()];
        const target_lang = languageCodes[args[1].toLowerCase()];
        if (typeof source_lang == "undefined" || typeof target_lang == "undefined") {
            return message.channel.send("Error: one or more languages are invalid.");
        }
        const translatorParams = {
            text: text,
            source: source_lang,
            target: target_lang
        };
        const result = await languageTranslator.translate(translatorParams)
            .then(translationResult => {
                return translationResult.result.translations[0].translation;
            })
            .catch(err => {
                console.log('error:', err);
            });
        translation_embed.setTitle("Translation Successful")
            .addField(
                `Translation of ${text} from ${args[0]} to ${args[1]} is:`, `${result}`, false
            );
        return message.channel.send(translation_embed);
    }
}