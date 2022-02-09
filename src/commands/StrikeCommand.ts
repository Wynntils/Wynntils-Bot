import { CommandContext, CommandOptionType, SlashCreator, MessageOptions } from "slash-create";
import WynntilsBaseCommand from "../classes/WynntilsCommand";
import { Staff } from "../constants/Role";

export class StrikeCommand extends WynntilsBaseCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'strike',
            description: 'Give a punishment to the user within the server.',
            roles: Staff,
            options: [
                {
                    name: 'give',
                    description: 'Punish a given user within the server.',
                    type: CommandOptionType.SUB_COMMAND,
                    required: false,
                    options: [
                        {
                            name: 'user',
                            description: 'The user you want to punish?',
                            type: CommandOptionType.MENTIONABLE,
                            required: true
                        },
                        {
                            name: 'reason',
                            description: 'The reason for the punishment',
                            type: CommandOptionType.STRING
                        }
                    ]
                },
                {
                    name: 'remove',
                    description: 'Remove the given punishment.',
                    type: CommandOptionType.SUB_COMMAND,
                    options: [
                        {
                            name: 'punishment_id',
                            description: 'The punishment id',
                            type: CommandOptionType.STRING
                        }
                    ]
                }
            ]
        })
    }
    async run(ctx: CommandContext): Promise<MessageOptions> {
        return {
            content: "Hello world", 
            ephemeral: true
        }
    }
}