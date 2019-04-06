module.exports = {
    info: {
        name: 'Help',
        desc: 'Help command',
        help: 'help',
        uses: [
            'help',
            'commands'
        ]
    },
    execute: (bot, r, msg, args) => {
        var e = {
            embed: {
                title: 'Wynntils Help',
                color: 7531934,
                fields: [],
                footer: {
                    icon_url: bot.user.avatarURL,
                    text: "Wynntils"
                }
            }
        };

        bot.commands.map(cmd => {
            e.embed.fields.push({
                name: bot.config.prefix + cmd.info.help.toLowerCase(),
                value: cmd.info.desc
            });
        });

        msg.channel.createMessage(e);
    }
};