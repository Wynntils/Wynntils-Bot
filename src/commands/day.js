const { staff } = require('../enums/roles');

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
        if (!staff.some(r => msg.member.roles.includes(r))) {
            return msg.channel.createMessage("Sorry, you don't have permissions to use this!");
        }

        if(typeof args[0] === "undefined") {
            return msg.channel.createMessage("Please use as argument a valid date (mm-dd-yyyy)");
        }

        const day = args[0]

        r.table("analytics_days").filter({"id": day}).run().then(res => {
            const data = res[0]

            var embed = msg.channel.createEmbed()
                .author(`Statistics for ${day}`, bot.user.avatarURL)
                .color(7531934).footer("Wynntils", bot.user.avatarURL);
            
            embed.field("RateLimits", data.daily_ratelimts, true)
            embed.field("Server Requests", data.daily_requests, true)
            embed.field("API Requests", data.api_requests, true)
            embed.field("Unique Users", data.uniqueUsers.length, true)

            var versions = ""
            for(var key in data.mostUsedVersion) {
                var amount = data.mostUsedVersion[key]

                versions = versions + key + " > " + amount + "\n"
            }

            embed.field("Used Versions", "```" + (versions.slice(0, -2)) + "```", false)

            embed.send().catch(e => { bot.error(e) })
        })
    }
}