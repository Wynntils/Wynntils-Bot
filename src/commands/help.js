module.exports = {
    info: {
        name: 'Help',
        desc: 'Help command',
        help: 'help [command]',
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
        if (args.length === 0) {
            var categories = {};
            bot.commands.map(cmd => {
                if (cmd.info.category !== "Hidden") {
                    categories[`**${cmd.info.category}**`] += ` \`${cmd.info.help.toLowerCase().split()[0]}\` `
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
        } else if (args.length === 1) {
            var found = false;
            bot.commands.map(cmd => {
                if (cmd.info.help === args[0] && !found) {
                    e.embed.fields.push({
                        name: `${bot.config.prefix}${cmd.info.help.toLowerCase()}`,
                        value: cmd.info.desc
                    });
                    found = true;
                }
            });
            if (!found) {
                e.embed.fields.push({
                    name: "Invalid Command",
                    value: `Could not find command - \`${args[0]}\`.`
                })
            }
        } else {
            e.embed.fields.push({
                name: "Invalid Usage",
                value: `Could not parse arguments correctly - \`${args.join(" ")}\`.`
            })
        }

        msg.channel.createMessage(e);
    }
};