module.exports = {
    info: {
        name: 'Ping',
        desc: 'Pong!',
        help: 'ping',
        category: "General",
        uses: [
            'ping'
        ]
    },
    execute: (bot, r, msg, args) => {
        msg.channel.createMessage("Ping?").then((m) => {
            console.log(m);
            m.edit(`Pong! Latency is ${m.timestamp - msg.timestamp}ms.`);
        });
    }
};