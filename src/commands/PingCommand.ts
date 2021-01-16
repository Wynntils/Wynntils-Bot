import { CommandContext, SlashCommand, SlashCreator } from "slash-create";
import { BotChannels } from "../constants/Channel";

export class PingCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'ping',
            description: 'Provides the delay between issuance and execution of a command'
        });
        this.filePath = __filename;
    }

    async run(ctx: CommandContext) {
        if (BotChannels.every(c => c !== ctx.channelID)) {
            return;
        }
        
        return `Ping, ${Date.now() - ctx.invokedAt}ms! <@${ctx.member.id}>`;
    }
}