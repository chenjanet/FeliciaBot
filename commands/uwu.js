module.exports = {
    name: 'uwu',
    description: 'responds with \'owo\' whenever `~uwu` is typed',
    args: false,
    execute(message, args) {
        message.channel.send('owo');
    },
};