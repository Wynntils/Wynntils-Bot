module.exports = {
    info: {
        name: 'Suggest',
        desc: 'Add a suggestion to #suggestion-vote',
        help: 'suggest',
        category: "Moderation",
        uses: [
            'suggest',
            's'
        ]
    },
    execute: (bot, r, msg, args) => {
        console.log(msg.member.roles.map((e, x) => msg.member.roles[x]));
        if (!staff.some(r => msg.member.roles.includes(r)))
            return msg.channel.createMessage("Sorry, you don't have permissions to use this!");

        const channel = msg.channel.guild.channels.find(ch => ch.name === 'suggestion-vote');
        var suggestion = args.join(" ");
        channel.createMessage(suggestion).then(function (message) {
            message.addReaction('👍')
                .then(() => message.addReaction('👎'))
                .catch(() => console.error('One of the emojis failed to react.'));
        }).catch(function () {
            //Something
        });
    }
};