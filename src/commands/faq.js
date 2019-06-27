module.exports = {
    info: {
        name: 'FAQ',
        desc: 'Responds with information regarding a question.\nAvailable tags are:\n\`stream\`, \`ce\`, \`stable\`, \`waypoint\`, \`wp\`, \`install\`, \`capes\`, \`cape\`, \`support\`, \`crash\`, \`bug\`, \`download\`, \`highlights\`, \`highlight\` & \`ban\`',
        help: 'faq <list|tag>',
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
                    value: "\`stream\`, \`ce\`, \`stable\`, \`waypoint\`, \`wp\`, \`install\`, \`capes\`, \`cape\`, \`support\`, \`crash\`, \`bug\`, \`download\`, \`highlights\`, \`highlight\` & \`ban\`"
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
                        text: `By: ${msg.author.username} - Please read #faq`
                    }
                }
            };
            var success = false;
            switch (args[0].toLowerCase()) {
                case "wp":
                case "waypoint":
                    e.embed.fields.push({
                        name: "Waypoints",
                        value: `**Waypoints are currently in development!**\n\nYou can create waypoints by going to the world map and pressing the big green plus button in the top-left corner of the screen. Viewing and editing your waypoints can be done by clicking on the \`Waypoints\` button on the world map.`
                    });
                    success = true;
                    break;
                case "install":
                    e.embed.fields.push({
                        name: "Installing Wynntils",
                        value: `Here are some guides to help you get started with using the mod.\n\n[Wynncraft Forums](https://forums.wynncraft.com/threads/197716/) or [Wynntils' Install Page](https://wynntils.com/install/).\n\nPlease make sure you're installing the recommended build of Forge 1.12.2 while setting up Wynntils.`
                    });
                    success = true;
                    break;
                case "capes":
                case "cape":
                    e.embed.fields.push({
                        name: "Wynntils Capes",
                        value: `In order to upload a cape you'll need to setup a Wynntils account first. You can do so by either going in-game (with Wynntils installed) and using the command \`/token\`. This will give you a clickable token that will allow you to create your account. You can also use \`>register\` in <#425293785338085387>. You can now log in at [Wynntils Accounts](https://account.wynntils.com/login.php) with your Minecraft username as the  username.\n\n*Please note that capes and elytraas have to be uploaded as a 128x64 image.*`
                    });
                    success = true;
                    break;
                case "highlight":
                case "highlights":
                    e.embed.fields.push({
                        name: "Item & Player Highlighting",
                        value: `Dropped item and player highlighting will never be implemented in Wynntils as Wynncraft does not allow for such functionality. If you're using any other mod that provides this feature, you do so at the risk of being banned from the server.`
                    });
                    success = true;
                    break;
                case "ban":
                    e.embed.fields.push({
                        name: "Is Wynntils Allowed on Wynncraft?",
                        value: `You won't be banned for using Wynntils. Though, if you get somehow do get banned for using Wynntils, please create an appeal on the [Wynncraft Forums](https://forums.wynncraft.com/) and your appeal will be accepted.`
                    });
                    success = true;
                    break;
                case "support":
                case "crash":
                case "bug":
                    e.embed.fields.push({
                        name: "Crash, Bug, and Support",
                        value: `To request for support, please ask the community if it is something that can be easily answered by our users, otherwise, please go to <#425293785338085387> and type \`-new Support Request\`. Upon doing so, a channel will be created for you to submit your inquiry.\n\nTo report a bug or a crash, please go to <#425293785338085387> and type \`-new Bug Report\` or \`-new Crash Report\`. Upon doing so, a channel will be created for you to report your bug or crash.`
                    });
                    success = true;
                    break;
                case "download":
                    e.embed.fields.push({
                        name: "Downloads",
                        value: `You can download Wynntils at these following locations:\n**CurseForge** - [Download](https://minecraft.curseforge.com/projects/wynntils)\n**Wynntils (Stable)** - [Download](http://ci.wynntils.com/job/Wynntils/lastSuccessfulBuild/)\n**Wynntils (Cutting Edge)** - [Download](http://ci.wynntils.com/job/Wynntils-DEV/lastSuccessfulBuild/)`
                    });
                    success = true;
                    break;
                case "stream":
                case "ce":
                case "stable":
                    e.embed.fields.push({
                        name: "Release Streams",
                        value: `Wynntils has two different release streams:\n\n**Stable**: The mod will only update when a new version is released. Stable versions are generally more stable than Cutting Edge builds.\n\n**Cutting Edge (CE)**: The mod will update whenever a new build is released. Cutting Edge builds will include features that are not yet in Stable versions and are currently in development but may also be less stable than Stable versions.\n\nYou can change your release stream by going into the mod settings (default key: \`P\`) and look in the Core category.`
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
                value: `Please provide valid arguments to use this command. You can see the valid arguments by using \`${bot.config.prefix}help faq\`.`
            });
            msg.channel.createMessage(e);
        }
    }
};
