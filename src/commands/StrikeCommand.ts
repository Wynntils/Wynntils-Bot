import { CommandContext, CommandOptionType, MessageOptions, SlashCreator } from 'slash-create'
import WynntilsBaseCommand from '../classes/WynntilsCommand'
import { Staff } from '../constants/Role'
import { styledEmbed } from '../utils/functions'

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

    async give(ctx: CommandContext): Promise<MessageOptions> {
        // const strike = new Strike();

        // strike.user = ctx.options.user
        // strike.moderator = ctx.member?.id
        // strike.reason = ctx.options.reason

        // await strike.save();

        const logEmbed = styledEmbed()
            .setTitle('')

        return { content: `Given a strike to <@${ctx.options.user}> with reason: ${ctx.options.reason}` }

    }
}
