import { MessageOptions, SlashCreator } from 'slash-create'
import WynntilsBaseCommand from '../classes/WynntilsCommand'

export class PingCommand extends WynntilsBaseCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'ping',
            description: 'Command to check whether the bot is still operational'
        })

        this.filePath = __filename
    }

    async run(): Promise<MessageOptions> {
        return { content: 'Pong! :ping_pong:', ephemeral: true }
    }
}
