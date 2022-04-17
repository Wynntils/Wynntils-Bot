import { CommandContext, CommandOptionType, SlashCreator, MessageOptions } from 'slash-create'
import { client } from '..'
import WynntilsBaseCommand from '../classes/WynntilsCommand'
import { Colors } from '../constants/Colors'
import { Staff } from '../constants/Role'
import { Punishment } from '../models/Punishment'
import { styledEmbed, logPunishment, dmUser } from '../utils/functions'

export class BanCommand extends WynntilsBaseCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'ban',
            description: 'Ban a user from within the server',
            roles: Staff,
            options: [
                {
                    name: 'user',
                    description: 'The user you want to ban',
                    type: CommandOptionType.MENTIONABLE,
                    required: true
                },
                {
                    name: 'reason',
                    description: 'The reason why you want to ban this user',
                    type: CommandOptionType.STRING
                }
            ]
        })
    }

    async default(ctx: CommandContext): Promise<MessageOptions> {

        /*TODO: Make it so you can choose how long you want the ban to be, 
                this should schedule a cron job to unban them on the specified date.
        */
        const user = await this.channel?.guild.members.fetch(this.opts.user)

        if (Staff.some(sr => user?.roles.cache.some(r => r.name === sr)))
            return { content: 'You cannot ban a staff member.' }

        if (this.opts.user === ctx.member?.id)
            return { content: 'You cannot ban yourself.' }

        if (this.opts.user === client.user?.id)
            return { content: 'Hey! Trying to ban me is not nice :(' }

        if (!user)
            return { content: 'User does not exist' }

        const reason = this.opts.reason ? this.opts.reason : 'No reason given'
        const punishment = new Punishment()

        punishment.type = 'Ban'
        punishment.user = this.opts.user
        punishment.moderator = ctx.member?.id
        punishment.reason = reason
        punishment.timestamp = Date.now()

        await punishment.save()

        const userPunishmentEmbed = styledEmbed()
            .setTitle('Wynntils Moderation')
            .setColor(Colors.BLUE)
            .setDescription('You have been banned from Wynntils')
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
                    value: 'Permanent',
                    inline: true
                }
            ])

        const logPunishmentEmbed = styledEmbed()
            .setTitle('Wynntils Log')
            .setColor(Colors.RED)
            .setDescription(`**${user.displayName} has been banned from the server**`)
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
                    value: 'Permanent',
                    inline: true
                }
            ])
            .setFooter({ text: `ID: ${punishment.id}` })

        logPunishment(logPunishmentEmbed)

        await dmUser({ userId: this.opts.user, embed: userPunishmentEmbed })

        await user.ban({ days: 7, reason })

        return { content: 'Succesfully banned' }
    }
}
