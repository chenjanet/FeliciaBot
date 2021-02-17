module.exports = {
    name: 'ping',
    description: 'Ping!',
    args: false,
    displayHelp: false,
    execute(message, args) {
        message.channel.send('Pong!');
    },
};