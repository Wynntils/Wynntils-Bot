import { SlashCommand, SlashCreator } from 'slash-create';
import { MessageOptions } from 'slash-create/lib/context';
import { Guild } from '../constants/Guild';

export class PingCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'ping',
            guildID: Guild.Wynntils,
            description: 'Command to check wheter the bot is still operational'
        });
        this.filePath = __filename;
    }

    async run(): Promise<MessageOptions> {   
        return { content: 'Pong! :ping_pong:', ephemeral: true };
    }
}
