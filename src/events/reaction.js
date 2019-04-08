module.exports = (bot, r) => {
    bot.on('raw', async event => {
        if (!{MESSAGE_REACTION_ADD: 'messageReactionAdd', MESSAGE_REACTION_REMOVE: 'messageReactionRemove'}.hasOwnProperty(event.t)) {
            return;
        }
        
        const { d: data} = event;
        const wynntilsDiscord = bot.guilds.find(guild => guild.id === "394189072635133952");
        const member = wynntilsDiscord.members.find(user => user.id === data.user_id);

        if (data.message_id === "534510390705520650") { //In Welcome - can give: Accepted
            if (event.t === "MESSAGE_REACTION_ADD") {
                member.addRole("538395171881222159", "Has accepted the rules.");
            } else {
                member.removeRole("538395171881222159", "Has accepted the rules.");
            }
        } else if (data.message_id === "538392565670477825") { //In Self-Roles - can give: Mod Updates and Anime
            if (event.t === "MESSAGE_REACTION_ADD") {
                if (data.emoji.id) { //Since anime has an id and the other one doesn't
                    member.addRole("458924325207015434", "Has reacted in self-roles.");
                } else {
                    member.addRole("424996873091284992", "Has reacted in self-roles.");
                }
            } else {
                if (data.emoji.id) {
                    member.removeRole("458924325207015434", "Has reacted in self-roles.");
                } else {
                    member.removeRole("424996873091284992", "Has reacted in self-roles.");
                }
            }
        }
    });
};