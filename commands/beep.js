module.exports = {
    name: 'beep',
    description: 'Beep!',
    args: false,
    displayHelp: false,
    execute(message, args) {
        message.channel.send('Boop!');
    },
};