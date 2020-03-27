const { roles, donatorRoles } = require('../enums/roles');

module.exports = (bot, r) => {
    bot.on('guildMemberUpdate', async (oldMember, newMember) => {
        if (oldMember.roles.length != newMember.roles.length) return; // Roles didn't change
        if (!donatorRoles.some(r => newMember.includes(r))) return; // Didn't become donator
        if (donatorRoles.some(r => oldMember.includes(r))) return; // Was already donator
        
        let m = '';
        if (!newMember.roles.includes(roles.Accepted)) {
            m = `Hey ${newMember.user.username}, it seems like you haven't accepted our rules in #welcome. Please accept them so that you can see all channels and chat in them. Once you do that, please also provide us your in-game username, and someone will apply your donor tag in-game within 12 hours.`
        } else {
            m = `Hey ${newMember.user.username}, thanks for supporting the project! Please provide us your in-game username, and someone will apply your donor tag in-game within 12 hours.`
        }

        newMember.user.getDMChannel().then((channel) => {
            channel.createMessage(m);
        });
    })
};
