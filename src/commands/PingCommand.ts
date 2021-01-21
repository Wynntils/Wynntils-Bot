import { CommandContext, SlashCommand, SlashCreator } from 'slash-create';
import { MessageOptions } from 'slash-create/lib/context';

export class PingCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'ping',
            guildID: '394189072635133952',
            description: 'Provides the delay between issuance and execution of a command'
        });
        this.filePath = __filename;
    }

    async run(ctx: CommandContext): Promise<MessageOptions> {   
        return { content: `Ping, ${Date.now() - ctx.invokedAt}ms!`, ephemeral: true };
    }
}
