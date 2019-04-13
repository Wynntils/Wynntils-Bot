module.exports = {
    info: {
        name: 'Test Command',
        desc: 'Test new stuff here!',
        help: 'test',
        category: "Hidden",
        uses: [
            'test'
        ]
    },
    execute: (bot, r, msg, args) => {
        var e = msg.channel.createEmbed()
            .title('Test')
            .field('Test', 'Test');
        e.field('Name', '2', true);
        e.send().then(m => {
            msg.channel.createMessage('Message Sent!');
        });
    }
};