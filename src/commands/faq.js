module.exports = {
    info: {
        name: 'FAQ',
        desc: 'Responds with information regarding a question.\nAvailable tags are:\n\`waypoint\`, \`wp\`, \`install\`, \`capes\`, \`cape\`, \`support\`, \`crash\`, \`bug\`, \`highlights\`, \`highlight\` & \`ban\`',
        help: 'faq <list|tag>]',
        category: "General",
        uses: [
            'faq'
        ]
    },
    execute: (bot, r, msg, args) => {
        var e;
        if (args.length === 1) {
            if (args[0].toLowerCase() === "list" || args[0].toLowerCase() === "l") {
                e = {
                    embed: {
                        color: 7531934,
                        fields: [],
                        footer: {
                            icon_url: bot.user.avatarURL,
                            text: "Wynntils FAQ"
                        }
                    }
                };
                e.embed.fields.push({
                    name: "Tag List",
                    value: "\`waypoint\`, \`wp\`, \`install\`, \`capes\`, \`cape\`, \`support\`, \`crash\`, \`bug\`, \`highlights\`, \`highlight\` & \`ban\`"
                });
                msg.channel.createMessage(e);
                return;
            }
            e = {
                embed: {
                    color: 7531934,
                    author: {
                        name: "Wynntils FAQ",
                        icon_url: bot.user.avatarURL
                    },
                    fields: [],
                    footer: {
                        text: `By: ${msg.author.username}`
                    }
                }
            };
            var success = false;
            switch (args[1].toLowerCase()) {
                case "wp":
                case "waypoint":
                    e.embed.fields.push({
                        name: "Waypoints",
                        value: `Waypoints are currently in development, and, therefore cannot be created in-game as of yet.`
                    });
                    success = true;
                    break;
                case "install":
                    e.embed.fields.push({
                        name: "Installing Wynntils",
                        value: `Here are some guides to help you get started [Wynncraft Forum](https://forums.wynncraft.com/threads/197716/) or [Wynntils' Install Page](https://wynntils.com/install/). Make sure you're installing the recommended version of forge 1.12.2 while setting up Wynntils.`
                    });
                    success = true;
                    break;
                case "capes":
                case "cape":
                    e.embed.fields.push({
                        name: "Wynntils Capes",
                        value: `In order to upload a cape you'll need to setup a Wynntils account first. You can do so by going in-game (with Wynntils installed) and using the command \`/token\` this will give you a clickable token. Now think of a password to use for your Wynntils account. You can now log-in at [Wynntils Accounts](https://account.wynntils.com/login.php) with your Minecraft username as username.\n*Note, capes and such have to be upload as a 64x128 image.`
                    });
                    success = true;
                    break;
                case "highlight":
                case "highlights":
                    e.embed.fields.push({
                        name: "Item/Player HighLights",
                        value: `Item and player highlights will not be implemented by Wynntils as Wynncraft does not allow for such functionality. If you're using any other mod that provides this feature do so at your own risk - It's a bannable offense.`
                    });
                    success = true;
                    break;
                case "ban":
                    e.embed.fields.push({
                        name: "Is Wynntils Bannable?",
                        value: `You won't be banned for using Wynntils. Though, if you get somehow do get banned for using Wynntils your appeal will be accepted. You can appeal on [Wynncraft's Forum](https://forums.wynncraft.com/) or send a message to JPresent (if it's regarding Wynntils).`
                    });
                    success = true;
                    break;
                case "support":
                case "crash":
                case "bug":
                    e.embed.fields.push({
                        name: "Crash, Bug or Support",
                        value: `Go into <#425293785338085387> and use \`-new [Optional message]\` this will create a channel where the Support Team will assist you with your troubles.`
                    });
                    success = true;
                    break;
            }

            if (success) {
                msg.channel.createMessage(e);
            }
        } else {
            e = {
                embed: {
                    color: 7531934,
                    fields: [],
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "Wynntils FAQ"
                    }
                }
            };
            e.embed.fields.push({
                name: "Missing arguments",
                value: `Please tell me what to do - use \`${bot.config.prefix}help faq\` to learn more.`
            });
            msg.channel.createMessage(e);
        }
    }
};