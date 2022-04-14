import { DiscordAPIError } from 'discord.js'
import { CommandContext, CommandOptionType, MessageOptions, SlashCreator } from 'slash-create'
import { client } from '..'
import WynntilsBaseCommand from '../classes/WynntilsCommand'
import { Colors } from '../constants/Colors'
import { Staff } from '../constants/Role'
import { Punishment } from '../models/Punishment'
import { logError, logPunishment, styledEmbed } from '../utils/functions'

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
                            type: CommandOptionType.STRING,
                            required: true
                        }
                    ]
                },
                {
                    name: 'info',
                    description: 'Search info about a given punishment.',
                    type: CommandOptionType.SUB_COMMAND,
                    options: [
                        {
                            name: 'punishment_id',
                            description: 'The punishment id',
                            type: CommandOptionType.STRING,
                            required: true
                        }
                    ]
                },
                {
                    name: 'search',
                    description: 'Search a given user\'s punishments',
                    type: CommandOptionType.SUB_COMMAND,
                    options: [
                        {
                            name: 'user',
                            description: 'The user you want to search',
                            type: CommandOptionType.MENTIONABLE,
                            required: true
                        }
                    ]
                }
            ]
        })
    }

    async give(ctx: CommandContext): Promise<MessageOptions> {

        const user = await client.users.fetch(this.opts.user)
        const reason = this.opts.reason ? this.opts.reason : 'No reason given'
        const punishment = new Punishment()

        punishment.type = 'Strike'
        punishment.user = this.opts.user
        punishment.moderator = ctx.member?.id
        punishment.reason = reason
        punishment.timestamp = Date.now()

        await punishment.save()

        const userPunishmentEmbed = styledEmbed()
            .setTitle('Wynntils Moderation')
            .setColor(Colors.BLUE)
            .setDescription('Your punishment has been updated in Wynntils')
            .addFields([
                {
                    name: 'Action',
                    value: 'Strike',
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
            .setColor(Colors.YELLOW)
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
                    value: `${reason}`,
                    inline: true
                }
            ])
            .setFooter({ text: `ID: ${punishment.id}` })

        user.createDM()
            .then(dm => dm.send({ embeds: [userPunishmentEmbed] }))
            .catch((error: DiscordAPIError) => logError(error))

        logPunishment(logPunishmentEmbed)

        return { content: `Given a strike to <@${this.opts.user}> with reason: ${reason}`, ephemeral: true }

    }

    async remove(ctx: CommandContext): Promise<MessageOptions> {

        const punishment = await Punishment.findOne(this.opts.punishment_id)

        if (!punishment)
            return { content: `There was no punishment found with id: ${this.opts.punishment_id}` }

        await punishment.remove()

        return { content: `Deleted the strike ${this.opts.punishment_id}` }
    }

    async info(ctx: CommandContext): Promise<MessageOptions> {

        const punishment = await Punishment.findOne(this.opts.punishment_id)

        if (!punishment)
            return { content: `There was no punishment found with id: ${this.opts.punishment_id}` }

        const punishmentEmbed = styledEmbed()
            .setTitle('Punishment Info')
            .setColor(Colors.BLUE)
            .setDescription(`Showing information for the punishment ${punishment.id}`)
            .addFields([
                {
                    name: 'Type',
                    value: `${punishment.type}`,
                    inline: true
                },
                {
                    name: 'User',
                    value: `<@${punishment.user}>\n(${punishment.user})`,
                    inline: true
                },
                {
                    name: 'Moderator',
                    value: `<@${punishment.moderator}>\n(${punishment.moderator})`,
                    inline: true
                },
                {
                    name: 'Reason',
                    value: `${punishment.reason}`,
                    inline: true
                },
                {
                    name: 'Date',
                    value: `<t:${Math.floor(punishment.timestamp / 1000)}:f>\n<t:${Math.floor(punishment.timestamp / 1000)}:R>`,
                    inline: true
                }
            ])
            .setFooter({ text: `ID: ${punishment.id}` })

        return { embeds: [punishmentEmbed.toJSON()] }
    }

    async search(ctx: CommandContext): Promise<MessageOptions> {

        const punishments = await Punishment.find({
            where: {
                user: this.opts.user
            }
        })

        const user = await client.users.fetch(this.opts.user)
        const userPunishmentEmbed = styledEmbed()
            .setColor(Colors.BLUE)
            .setDescription(`Found ${punishments.length} punishments for <@${this.opts.user}> \`(${user.username}#${user.discriminator})\``)
            
        punishments.forEach(punishment => userPunishmentEmbed.addField(`${punishment.id}`, `**${punishment.type}** • ${punishment.reason}`, false))

        if (!punishments || punishments.length === 0)
            userPunishmentEmbed.setDescription('This user has no punishments')

        return { embeds: [userPunishmentEmbed.toJSON()] }
    }
}
