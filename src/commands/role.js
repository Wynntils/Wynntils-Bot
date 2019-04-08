module.exports = {
    info: {
        name: 'Roles',
        desc: 'Manage a user\'s roles.\n-`role <give|remove> <user> <role>`\n-`role list',
        help: 'role',
        category: "Moderation",
        uses: [
            'role',
            'r'
        ]
    },
    execute: (bot, r, msg, args) => {
        var e = {
            embed: {
                title: 'Wynntils Roles',
                color: 7531934,
                fields: [],
                footer: {
                    icon_url: bot.user.avatarURL,
                    text: "Wynntils"
                }
            }
        };
        if (msg.member.roles.includes("394189812816412692")) {
            let manageableRoles = ["accepted", "538395171881222159", "muted", "538503043147235348" , "translator", "563486497374863361"];
            if (args.length === 3) {
                if (manageableRoles.includes(args[2].toLowerCase())) {
                    var user = msg.channel.guild.members.find(member => member.username.toLowerCase().startsWith(args[1].toLowerCase())); //By name
                    if (user == undefined) {
                        user = msg.channel.guild.members.find(member => member.id === args[1]); //By id
                        if (user == undefined && msg.mentions.length >= 1) {
                            user = msg.mentions[0]; //By mention
                        }
                    }
                    
                    if (user == undefined) {
                        e.embed.fields.push({
                            name: "Invalid username/id",
                            value: `Was unable to find user by username, ID and mention - ${args[1]}`
                        });
                    } else {
                        var roleId;
                        if (manageableRoles.indexOf(args[2].toLowerCase()) % 2 == 0) {
                            roleId = args[2];
                        } else {
                            roleId = manageableRoles[manageableRoles.indexOf(args[2].toLowerCase()) + 1];
                        }
                        switch (args[0]) {
                            case "give":
                            case "g":
                                if (user.roles.includes(roleId)) {
                                    e.embed.fields.push({
                                        name: "Role not given",
                                        value: `The user is already in possesion of the role - \`${manageableRoles[manageableRoles.indexOf(roleId) - 1]}\``
                                    });
                                } else {
                                    user.addRole(roleId, 10, `Given by ${msg.author.username}#${msg.author.discriminator}`);
                                    e.embed.fields.push({
                                        name: "Role succesfully given",
                                        value: `${manageableRoles.indexOf(roleId)} succesfully given to ${user.user.username}#${user.user.discriminator} by ${msg.author.username}#${msg.author.discriminator}`
                                    });
                                }
                                break;
                            case "remove":
                            case "r":
                                if (!user.roles.includes(roleId)) {
                                    e.embed.fields.push({
                                        name: "Role not removed",
                                        value: `The user does not posses the role - \`${manageableRoles[manageableRoles.indexOf(roleId) - 1]}\``
                                    });
                                } else {
                                    user.removeRole(roleId, `Removed by ${msg.author.username}#${msg.author.discriminator}`);
                                    e.embed.fields.push({
                                        name:  "Role succesfully removed",
                                        value: `${manageableRoles.indexOf(roleId)} succesfully removed from ${user.user.username}#${user.user.discriminator} by ${msg.author.username}#${msg.author.discriminator}` 
                                    });
                                }
                                break;
                            default:
                                e.embed.fields.push({
                                    name: "Invalid arguments",
                                    value: `Could not resolve \`${args.join(" ")}\``
                                });
                                break;
                        }
                    }
                } else {
                    e.embed.fields.push({
                        name: "Invalid Argument",
                        value: `Unable to manage role \`${args[2]}\``
                    });
                }
            } else if (args.length === 1) {
                if (args[0].toLowerCase() === "list" || args[0].toLowerCase() === "l") {
                    e.embed.fields.push({
                        name: "List of manageable roles",
                        value: "`Accepted`,`Translator`,`Muted`"
                    });
                }
            } else {
                e.embed.fields.push({
                    name: "Missing arguments",
                    value: `Please tell me what to do - use \`${bot.config.prefix}help role\` to learn more.`
                });
            }
        } else {
            e.embed.fields.push({
                name: "Insufficient permissions",
                value: "You're not allowed to manage any roles."
            });
        }
        msg.channel.createMessage(e);
    }
};