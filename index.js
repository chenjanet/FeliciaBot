/* TO-DO: 
    - some parts of code are repetitive - can be modularized (?)
    - arrow reacts don't work in DMs - don't react there?
    - persist mongo connection instead of opening/reopening
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
    client.user.setActivity("~help");
    await mongo().then(mongoose => {
        try {
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