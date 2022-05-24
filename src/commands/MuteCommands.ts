import { CommandContext, CommandOptionType, MessageOptions, SlashCreator } from 'slash-create'
import { client } from '..'
import WynntilsBaseCommand from '../classes/WynntilsCommand'
import { Colors } from '../constants/Colors'
import { Staff } from '../constants/Role'
import { Punishment } from '../models/Punishment'
import { dmUser, logPunishment, styledEmbed } from '../utils/functions'

export class MuteCommand extends WynntilsBaseCommand {

    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'mute',
            description: 'Mute a user from within the server',
            roles: Staff,
            options: [
                {
                    name: 'give',
                    description: 'Mute an user',
                    type: CommandOptionType.SUB_COMMAND,
                    options: [
                        {
                            name: 'user',
                            description: 'The user you want to mute',
                            type: CommandOptionType.MENTIONABLE,
                            required: true
                        },
                        {
                            name: 'duration',
                            description: 'The duration of the mute (in hours)',
                            type: CommandOptionType.NUMBER
                        },
                        {
                            name: 'reason',
                            description: 'The reason why you want to mute this user',
                            type: CommandOptionType.STRING
                        }
                    ]
                },
                {
                    name: 'remove',
                    description: 'Remove a mute from an user',
                    type: CommandOptionType.SUB_COMMAND,
                    options: [
                        {
                            name: 'user',
                            description: 'The user you want to unmute',
                            type: CommandOptionType.MENTIONABLE,
                            required: true
                        }
                    ]
                }
            ]
        })
    }

    async give(ctx: CommandContext): Promise<MessageOptions> {

        const user = await this.channel?.guild.members.fetch(this.opts.user)
        const duration = this.opts.duration * 60 * 60 * 1000

        if (Staff.some(sr => user?.roles.cache.some(r => r.name === sr)))
            return { content: 'You cannot mute a staff member.', ephemeral: true }

        if (this.opts.user === ctx.member?.id)
            return { content: 'You cannot mute yourself.', ephemeral: true }

        if (this.opts.user === client.user?.id)
            return { content: 'Hey! You cannot put me in a timeout! :(', ephemeral: true }

        if (!user)
            return { content: 'User does not exist.', ephemeral: true }

        const reason = this.opts.reason ? this.opts.reason : 'No reason given'
        const punishment = new Punishment()

        punishment.type = 'Mute'
        punishment.user = this.opts.user
        punishment.moderator = ctx.member?.id
        punishment.reason = reason
        punishment.timestamp = Date.now()

        await punishment.save()

        const userPunishmentEmbed = styledEmbed()
            .setTitle('Wynntils Moderation')
            .setColor(Colors.BLUE)
            .setDescription('You have been muted in Wynntils')
            .addFields([
                {
                    name: 'Action',
                    value: 'Ban',
                    inline: true
                },
                {
                    name: 'Punishment ID',
                    value: `${punishment.id}`,
                    inline: true
                },
                {
                    name: 'Reason',
                    value: `${reason}`,
                    inline: true
                },
                {
                    name: 'Duration',
                    value: `${this.opts.duration} hours`,
                    inline: true
                }
            ])

        const logPunishmentEmbed = styledEmbed()
            .setTitle('Wynntils Log')
            .setColor(Colors.RED)
            .setDescription(`**${user.displayName} has been muted**`)
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
                    value: `${reason}`,
                    inline: true
                },
                {
                    name: 'Duration',
                    value: `${this.opts.duration} hours`,
                    inline: true
                }
            ])
            .setFooter({ text: `ID: ${punishment.id}` })

        logPunishment(logPunishmentEmbed)

        await dmUser({ userId: this.opts.user, embed: userPunishmentEmbed })

        await user?.timeout(duration, reason)

        return { content: 'Succesfully muted the user' }
    }

    async remove(ctx: CommandContext): Promise<MessageOptions> {

        const user = await this.channel?.guild.members.fetch(this.opts.user)

        const logPunishmentEmbed = styledEmbed()
            .setTitle('Wynntils Log')
            .setColor(Colors.GREEN)
            .setDescription(`**${user?.displayName} has been umuted**`)
            .addFields([
                {
                    name: 'User',
                    value: `<@${user?.id}>\n(${user?.id})`,
                    inline: true
                },
                {
                    name: 'Action by',
                    value: `<@${ctx.member?.id}>\n(${ctx.member?.id})`,
                    inline: true
                },
            ])

        const userPunishmentEmbed = styledEmbed()
            .setTitle('Wynntils Moderation')
            .setColor(Colors.BLUE)
            .setDescription('You have been unmuted in Wynntils')

        logPunishment(logPunishmentEmbed)

        await dmUser({ userId: this.opts.user, embed: userPunishmentEmbed })

        await user?.timeout(null, this.opts.reason)

        return { content: 'Succesfully unmuted the user' }
    }

}
