/* TO-DO: 
    - add list of supported languages to help page for translator
*/

const fs = require('fs');
const Discord = require('discord.js');

require('dotenv').config();

const client = new Discord.Client();
const prefix = '~';

const mongo = require('./mongo.js');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setActivity("~help");
    await mongo().then(mongoose => {
        try {
            console.log('Connected to mongo');
        } finally {
            mongoose.connection.close();
        }
    });
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command_name = args.shift().toLowerCase();
    const command = client.commands.get(command_name);

    if (!command) return;

    if (command.args && args.length == 0) {
        return message.reply(`The ${commandName} command requires arguments`);
    }
    try {
        command.execute(message, args);
    } catch (err) {
        console.error(err);
        message.reply('Error occurred while executing command');
    }
});

client.login(process.env.DISCORD_TOKEN);