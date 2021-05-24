import { SlashCommand, SlashCreator } from 'slash-create';
import { MessageOptions } from 'slash-create/lib/context';

export class PingCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'ping',
            description: 'Command to check whether the bot is still operational'
        });

        this.filePath = __filename;
    }

    async run(): Promise<MessageOptions> {   
        return { content: 'Pong! :ping_pong:', ephemeral: true };
    }
}
