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
            e.embed.description = 'Click [here](https://account.wynntils.com/register.php?token=' + cb.authCode + ') to register an account!';
            msg.author.getDMChannel().then(channel => {
                channel.createMessage(e);
                msg.channel.createMessage('Please check your PMs <@' + msg.author.id + '>')
            }).catch(err => {
                msg.channel.createMessage(err);
            });
        });
    }
};