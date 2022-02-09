import { Guild } from 'discord.js'
import { CommandContext, CommandOptionType, MessageOptions, SlashCreator } from 'slash-create'
import { client } from '..'
import WynntilsBaseCommand from '../classes/WynntilsCommand'
import { Staff } from '../constants/Role'
import { Punishment } from '../models/Punishment'
import { logPunishment, styledEmbed } from '../utils/functions'

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

        const user = await client.users.fetch(this.opts.user)
        
        const logPunishmentEmbed = styledEmbed()
            .setTitle('Wynntils Log')
            .setDescription(`**${user.username} has been striken**`)
            .addFields([
                {
                    name: 'User',
                    value: `<@${user.id}>\n(${user.id})`,
                    inline: true
                },
                {
                    name: 'Action by',
                    value: `<@${ctx.member?.id}>\n(${ctx.member?.id})`,
                    inline: true
                },
                {
                    name: 'Reason',
                    value: this.opts.reason,
                    inline: true
                }
            ])
            .setFooter({ text: `ID: ID HERE ${user.id}` })

        logPunishment(logPunishmentEmbed)

        return { content: `Given a strike to <@${this.opts.user}> with reason: ${this.opts.reason}` }

    }
}
