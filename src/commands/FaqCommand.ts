import { CommandContext, SlashCommand, SlashCreator } from "slash-create";

export class FaqCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'faq',
            description: 'Provides information on frequently asked question'
        })
        this.filePath = __filename;
    }

    async run(ctx: CommandContext) {

    }
}
