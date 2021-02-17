const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Lists all commands, or information about a specific command',
    args: false,
    displayHelp: true,
    usage: '<command name>',
    execute(message, args) {
        console.log(args);
        const { commands } = message.client;
        if (!args[0]?.length) {
            const command_list = commands.filter(command => command.displayHelp).map(command => `\`${command.name}\``).join(", ");
            const help_embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Bot Help')
                .addFields(
                    { name: 'Command List', value: command_list },
                    { name: 'Specific Command Information', value: `To get info on a specific command, use \`~help <command>\`\n` }
                )
            //console.log(help_embed.fields);
            return message.channel.send(help_embed);
        }
        const command_name = args[0].split(/\s/)[0].toLowerCase();
        const command = commands.get(command_name);
        if (!command) {
            return message.channel.send(`Error: no command with the name '${command_name}' was found.`);
        }

        const command_embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Command: \`~${command_name}\``)
            .addFields(
                { name: 'Description', value: command.description },
                { name: 'Usage', value: `\`~${command.name}${command.usage ? ` ${command.usage}` : ''}\``}
            )
        return message.channel.send(command_embed);
    },
};