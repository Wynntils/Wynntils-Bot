module.exports = {
    info: {
        name: 'FAQ',
        desc: 'Responds with information regarding a question.\nAvailable tags are:\n\`waypoint\`, \`wp\`, \`install\`, \`capes\`, \`cape\`, \`support\`, \`crash\`, \`bug\`, \`highlights\`, \`highlight\` & \`ban\`',
        help: 'faq <list|[user> <tag>]',
        category: "General",
        uses: [
            'faq'
        ]
    },
    execute: (bot, r, msg, args) => {
        if (args.length === 2) {
            var e = {
                embed: {
                    title: 'Wynntils FAQ',
                    color: 7531934,
                    author: {
                        name: "Wynntils",
                        icon_url: bot.user.avatarURL
                    },
                    fields: [],
                    footer: {
                        icon_url: msg.author.staticAvatarURL,
                        text: msg.author.username
                    }
                }
            };
            var user = msg.channel.guild.members.find(member => member.username.toLowerCase().startsWith(args[0].toLowerCase())); //By name
            if (user == undefined) {
                user = msg.channel.guild.members.find(member => member.id === args[0]); //By id
                if (user == undefined && msg.mentions.length >= 1) {
                    user = msg.mentions[0]; //By mention
                }
            }
            if (user !== undefined) {
                switch (args[1].toLowerCase()) {
                    case "wp":
                    case "waypoint":
                        e.embed.fields.push({
                            name: "Waypoints",
                            value: `<@${user.id}> - Waypoint are currently in development, and, therefore cannot be created in-game as of yet.`
                        });
                        break;
                    case "install":
                        e.embed.fields.push({
                            name: "Installing Wynntils",
                            value: `<@${user.id}> - Here are some guides to help you get started [Wynncraft Forum](https://forums.wynncraft.com/threads/197716/) or [Wynntils' Install Page](https://wynntils.com/install/). Make sure you're installing the recommended version of forge 1.12.2 while setting up Wynntils.`
                        });
                        break;
                    case "capes":
                    case "cape":
                        e.embed.fields.push({
                            name: "Wynntils Capes",
                            value: `<@${user.id}> - In order to upload a cape you'll need to setup a Wynntils account first. You can do so by going in-game (with Wynntils installed) and using the command \`/token\` this will give you a clickable token. Now think of a password to use for your Wynntils account. You can now log-in at [Wynntils Accounts](https://account.wynntils.com/login.php) with your Minecraft username as username.\n*Note, capes and such have to be upload as a 64x128 image.`
                        });
                        break;
                    case "highlight":
                    case "highlights":
                        e.embed.fields.push({
                            name: "Item/Player HighLights",
                            value: `<@${user.id}> - Item and player highlights will not be implemented by Wynntils as Wynncraft does not allow for such functionality. If you're using any other mod that provides this feature do so at your own risk - It's a bannable offense.`
                        });
                        break;
                    case "ban":
                        e.embed.fields.push({
                            name: "Is Wynntils Bannable?",
                            value: `<@${user.id}> - You won't we banned for Wynntils. Though, if you get somehow banned for using Wynntils your appeal will be accepted. You can appeal on [Wynncraft's Forum](https://forums.wynncraft.com/) or send a message to JPresent (if it's regarding Wynntils).`
                        });
                        break;
                    case "support":
                    case "crash":
                    case "bug":
                        e.embed.fields.push({
                            name: "Crash, Bug or Support",
                            value: `<@${user.id}> - Go into #bot-commands and use \`-new [Optional message]\` this will create a channel where the Support Team will assist you with your troubles.`
                        });
                        break;
                }

                if (e.embed.fields.length >= 1) {
                    e.createMessage(e);
                }
            }
        } else if (args.length == 1 && msg.channel.id === "425293785338085387") {
            if (args[0].toLowerCase() === "list" || args[0].toLowerCase() === "l") {
                var e = {
                    embed: {
                        title: 'Wynntils FAQ',
                        color: 7531934,
                        fields: [],
                        footer: {
                            icon_url: bot.user.avatarURL,
                            text: "Wynntils"
                        }
                    }
                };
                e.embed.fields.push({
                    name: "Tag List",
                    value: "\`waypoint\`, \`wp\`, \`install\`, \`capes\`, \`cape\`, \`support\`, \`crash\`, \`bug\`, \`highlights\`, \`highlight\` & \`ban\`"
                });
                e.createMessage(e);
            }
        }
    }
};