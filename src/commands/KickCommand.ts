import { CommandOptionType, SlashCreator, MessageOptions, CommandContext } from 'slash-create'
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
                    type: CommandOptionType.MENTIONABLE,
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

        const user = await this.client.guilds.cache.get(ctx.guildID)?.members.fetch(this.opts.user)
        if (!user)
            return { content: 'User does not exist' }
        
        const reason = this.opts.reason ? this.opts.reason : 'No reason given'
        const punishment = new Punishment()

        punishment.type = 'Kick'
        punishment.user = this.opts.user
        punishment.moderator = ctx.member?.id
        punishment.reason = reason
        punishment.timestamp = Date.now()

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
            .setColor(Colors.GREEN)
            .setDescription(`**${user.displayName} has been kicked**`)
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

        dmUser({ userId: this.opts.user, embed: userPunishmentEmbed })

        user.kick(reason)


        return { content: 'Succesfully kicked' }
    }

}
