module.exports = {
    info: {
        name: 'Usercount',
        desc: 'Gives the number of users registered to wynntils',
        help: 'usercount',
        uses: [
            'usercount',
            'uc'
        ]
    },
    execute: (bot, r, msg, args) => {
        r.table('users').run((err, callback) => {
            if (err) bot.error(err);
            // console.log(JSON.stringify(result, null, 2));
            var len = ObjectLength(callback);
            msg.channel.createMessage("Wynntils has " + len + " users!");
        });
    }
};

function ObjectLength(object) {
    var length = 0;
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            ++length;
        }
    }
    return length;
};