module.exports = {
    info: {
        name: 'Eval',
        desc: 'Eval JS (Owner Only)',
        help: 'eval',
        uses: [
            'e'
        ]
    },
    execute: (bot, r, msg, args) => {
        if (!msg.member.roles.includes("394189673678766091"))
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