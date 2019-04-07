module.exports = {
    info: {
        name: 'Help',
        desc: 'Help command',
        help: 'help',
        category: "General",
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
        var categories = {};
        bot.commands.map(cmd => {
            if (cmd.info.category !== "Hidden") {
                categories[`**${cmd.info.category}**`] += ` \`${cmd.info.help.toLowerCase()}\` `
            }
        });

        var helpMessage = "";
        for ((k, v) in categories) {
            helpMessage += `${k}${v}\n`;
        }
        helpMessage.replace("  ", ", ");

        e.embed.fields.push({
            name: "Categories",
            value: helpMessage
        });

        msg.channel.createMessage(e);
    }
};