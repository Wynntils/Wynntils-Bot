module.exports = {
    info: {
        name: 'register',
        desc: 'register',
        help: 'register',
        category: 'Accounts',
        uses: [
            'register'
        ]
    },
    execute: (bot, r, msg, args) => {
        r.table('users').filter({discordInfo: {id: msg.author.id}}).run((err, cb) => {
            // https://account.wynntils.com/register.php?token=
            if (cb.length < 1 || cb == undefined) return msg.channel.createMessage('Discord account not linked to any Wynntils account!');
            cb = cb[0];
            var e = msg.channel.createEmbed()
                .author(cb.name, 'https://minotar.net/helm/' + cb.id + '/100.png')
                .color(7531934)
                .footer("Wynntils", bot.user.avatarURL)
                .description('Click [here](https://account.wynntils.com/register.php?token=' + cb.authCode + ') to register an account!');
            msg.member.user.createMessage({ embed: e.sendable }).then(c => {
                msg.channel.createMessage('Please check your PMs <@' + msg.author.id + '>');
            }).catch(err => {
                if (err.code === 50007) {
                    msg.channel.createMessage('Please allow messages from server members so that I can message you, and try again. <@' + msg.author.id + '>')
                } else {
                    msg.channel.createEmbed().title(err.name).description('```xl\n' + err.stack + '```').send();
                }
            });
        });
    }
};