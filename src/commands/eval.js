module.exports = {
    info: {
        name: 'Eval',
        desc: 'Eval JS (Owner Only)',
        help: 'eval',
        category: "Hidden",
        uses: [
            'e'
        ]
    },
    execute: (bot, r, msg, args) => {
        let ownerRole = msg.guild.roles.find(role => role.name === "Owner");
        if (!msg.member.hasRole(ownerRole))
            return msg.channel.createMessage("Sorry, you don't have permissions to use this!");
        try {
            const code = args.join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            msg.channel.createMessage(clean(evaled), { code: "xl" });
        } catch (err) {
            msg.channel.createMessage(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
};

const clean = text => {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}