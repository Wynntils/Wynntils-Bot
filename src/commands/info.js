global.atob = require("atob");

module.exports = {
    info: {
        name: 'Info',
        desc: 'info <name>\ninfo <name> config\ninfo <name> config <num>',
        help: 'info',
        category: 'Accounts',
        uses: [
            'info',
            'i'
        ]
    },
    execute: (bot, r, msg, args) => {
        global.search = (err, cb) => {
            if (cb.length < 1 || cb == undefined) return msg.channel.createMessage(search + ' not found');
            cb = cb[0];
            var e = {
                embed: {
                    author: {
                        name: cb.name,
                        icon_url: 'https://minotar.net/helm/' + cb.id + '/100.png'
                    },
                    color: 7531934,
                    fields: [],
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "Wynntils"
                    }
                }
            };
            if (args[1] === 'config') {
                if (!msg.member.roles.includes("394189673678766091") && !msg.member.roles.includes("439546118964117534") && !msg.member.roles.includes("394189812816412692"))
                    return msg.channel.createMessage("Sorry, you don't have permissions to use this!");
                if (typeof args[2] === "undefined") {
                    var i = 0;
                    var map = '';
                    Object.keys(cb.configFiles).forEach((x) => {
                        map += i + ': ' + x + '\n';
                        i++;
                    });
                    e.embed.description = map;
                } else {
                    if (isNaN(args[2])) {
                        e.embed.description = '```json\n' + atob(cb.configFiles[args[2]]) + ' ```';
                        e.embed.footer.text = 'Wynntils | ' + args[2];
                    } else {
                        var key = Object.keys(cb.configFiles)[args[2]], value = cb.configFiles[key];
                        e.embed.description = '```json\n' + atob(value) + ' ```';
                        e.embed.footer.text = 'Wynntils | ' + key;
                    }
                }
            } else {
                e.embed.fields.push({
                    name: 'Account Type',
                    value: cb.accountType,
                    inline: true
                });

                e.embed.fields.push({
                    name: 'Latest Version',
                    value: cb.latestVersion,
                    inline: true
                });

                e.embed.fields.push({
                    name: 'Last Online',
                    value: new Date(cb.lastActivity).toDateString(),
                    inline: true
                });

                e.embed.fields.push({
                    name: 'Cape',
                    value: cb.activeModels.capeActive,
                    inline: true
                });
                e.embed.fields.push({
                    name: 'Ears',
                    value: cb.activeModels.earsActive,
                    inline: true
                });
                e.embed.fields.push({
                    name: 'Elytra',
                    value: cb.activeModels.elytraActive,
                    inline: true
                });
            }
            console.log(e);
            msg.channel.createMessage(e).catch(e => { bot.error(e);});
        };

        if (typeof args[0] === "undefined") {
            r.table('users').filter({ discordInfo: { id: msg.author.id } }).run((err, cb) => {
                if (cb.length < 1 || cb == undefined) return msg.channel.createMessage('Missing arguments!');
                cb = cb[0];
                var s = cb.name;
                r.table('users').getAll(s, { index: 'name' }).run((err, cb) => { search(err, cb); });
            });
        } else {
            if (!msg.member.roles.includes("394189673678766091") && !msg.member.roles.includes("439546118964117534") && !msg.member.roles.includes("394189812816412692"))
                return msg.channel.createMessage("Sorry, you don't have permissions to use this!");
            var s = args[0];
            r.table('users').getAll(s, { index: 'name' }).run((err, cb) => { search(err, cb); });
        }
    }
};