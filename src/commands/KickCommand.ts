import { CommandContext, CommandOptionType, MessageOptions, SlashCreator } from 'slash-create'
import { client } from '..'
import WynntilsBaseCommand from '../classes/WynntilsCommand'
import { Colors } from '../constants/Colors'
import { Staff } from '../constants/Role'
import { Punishment } from '../models/Punishment'
import { dmUser, logPunishment, styledEmbed } from '../utils/functions'

export class KickCommand extends WynntilsBaseCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'kick',
            description: 'Kick a user from within the server',
            roles: Staff,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to kick',
                    type: CommandOptionType.USER,
                    required: true
                },
                {
                    name: 'reason',
                    description: 'The reason why you want to kick this user',
                    type: CommandOptionType.STRING
                }
            ]
        })
    }

    // Runs the command
    async default(ctx: CommandContext): Promise<MessageOptions> {

        const user = await this.channel?.guild.members.fetch(this.opts.user)

        if (Staff.some(sr => user?.roles.cache.some(r => r.name === sr)))
            return { content: 'You cannot kick a staff member.', ephemeral: true }

        if (this.opts.user === ctx.member?.id)
            return { content: 'You cannot kick yourself.', ephemeral: true }

        if (this.opts.user === client.user?.id)
            return { content: 'Hey! Trying to kick me is not nice :(', ephemeral: true }

        if (!user)
            return { content: 'User does not exist', ephemeral: true }

        const reason = this.opts.reason ? this.opts.reason : 'No reason given'
        const punishment = new Punishment()

        punishment.type = 'Kick'
        punishment.user = this.opts.user
        punishment.moderator = ctx.member?.id
        punishment.reason = reason
        punishment.timestamp = Date.now()

        await punishment.save()

        const userPunishmentEmbed = styledEmbed()
            .setTitle('Wynntils Moderation')
            .setColor(Colors.BLUE)
            .setDescription('You have been kicked from Wynntils')
            .addFields([
                {
                    name: 'Action',
                    value: 'Kick',
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
                }
            ])

        const logPunishmentEmbed = styledEmbed()
            .setTitle('Wynntils Log')
            .setColor(Colors.RED)
            .setDescription(`**${user.displayName} has been kicked from the server**`)
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
                }
            ])
            .setFooter({ text: `ID: ${punishment.id}` })

        logPunishment(logPunishmentEmbed)

        await dmUser({ userId: this.opts.user, embed: userPunishmentEmbed })

        await user.kick(reason)

        return { content: 'Succesfully kicked' }
    }

}
