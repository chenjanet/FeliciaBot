module.exports = {
    name: 'ping',
    description: 'responds with \'Pong!\' whenever `~ping` is typed',
    args: false,
    displayHelp: false,
    execute(message, args) {
        message.channel.send('Pong!');
    },
};