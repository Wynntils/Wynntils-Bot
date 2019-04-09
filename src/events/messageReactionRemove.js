module.exports = (bot, r) => {
    bot.on('messageReactionRemove', async (msg, emoji, user) => {
        if (user === bot.user.id || !msg.channel.guild) return;
        const wynntilsDiscord = bot.guilds.find(guild => guild.id === "394189072635133952");
        const member = wynntilsDiscord.members.find(user => user.id === data.user_id);

        if (msg.id === "534510390705520650") { //In Welcome - can give: Accepted
            member.removeRole("538395171881222159", "Has declined the rules.");
        } else if (msg.id === "538392565670477825") { //In Self-Roles - can give: Mod Updates and Anime
            if (emoji.id) { //Since anime has an id and the other one doesn't
                member.removeRole("458924325207015434", "Has reacted in self-roles.");
            } else {
                member.removeRole("424996873091284992", "Has reacted in self-roles.");
            }
        }
    });
};