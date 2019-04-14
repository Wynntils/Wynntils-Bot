module.exports = {
    info: {
        name: 'Test Command',
        desc: 'Test new stuff here!',
        help: 'test',
        category: "Hidden",
        uses: [
            'test'
        ]
    },
    execute: (bot, r, msg, args) => {
        let ownerRole = msg.guild.roles.find(role => role.name === "Owner");
        if(msg.member.hasRole(ownerRole)) msg.channel.createMessage("You are Owner");
        else msg.channel.createMessage("You are not Owner");
    }
};