module.exports = {
    name: 'beep',
    description: 'responds with \'Boop!\' whenever `~beep` is typed',
    args: false,
    execute(message, args) {
        message.channel.send('Boop!');
    },
};