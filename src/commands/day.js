module.exports = {
    info: {
        name: "Day",
        desc: "day <mm-dd-yyyy>",
        help: "day",
        category: "Accounts",
        uses: [
            'day'
        ]
    },
    execute: (bot, r, msg, args) => {
        if (!msg.member.roles.includes("394189673678766091") && !msg.member.roles.includes("439546118964117534") && !msg.member.roles.includes("394189812816412692")) {
            return msg.channel.createMessage("Sorry, you don't have permissions to use this!");
        }

        if(typeof args[0] === "undefined") {
            return msg.channel.createMessage("Please use as argument a valid date (mm-dd-yyyy)");
        }

        const day = args[0]

        r.table("analytics_days").filter({"id": day}).run().then(res => {
            console.log(res)
            var embed = msg.channel.createEmbed()
                .author(`Statistics for ${day}`, bot.user.avatarUrl)
                .color(7531934).footer("Wynntils", bot.user.avatarUrl);
            
            embed.field("RateLimits", res.daily_ratelimts, true)
            embed.field("Server Requests", res.daily_requests, true)
            embed.field("API Requests", res.api_requests, true)
            embed.field("Unique Users", res.uniqueUsers, true)
            embed.field("Used Versions", "```" + res.mostUsedVersion + "```", false)

            embed.send().catch(e => { bot.error(e) })
        })
    }
}