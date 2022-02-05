import { CommandContext, CommandOptionType, MessageOptions, SlashCommand, SlashCreator } from 'slash-create'
import { client } from '..'
import { Guild } from '../constants/Guild'
import { Role } from '../constants/Role'
import { logError, styledEmbed } from '../utils/functions'

export class SelfRoleCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'selfrole',
            description: 'Either adds or removes a given role',
            options: [
                {
                    name: 'role',
                    description: 'Role to be toggled',
                    type: CommandOptionType.STRING,
                    required: true,
                    choices: [
                        {
                            name: 'Mod Updated',
                            value: Role.ModUpdates
                        },
                    ]
                }
            ]
        })

        this.filePath = __filename
    }

    async run(ctx: CommandContext): Promise<MessageOptions> {
        const embed = styledEmbed()

        const guild = await client.guilds.fetch(Guild.Wynntils)
        if (guild === undefined) {
            logError(Error('Unable to access the Wynntils Discord server.'))

            embed.setColor(0xff5349)
                .setTitle('Oops! Error D;')
                .setDescription(':x: Unable to access the Wynntils Discord server.')

            return { embeds: [embed.toJSON()], ephemeral: true }
        }

        const member = await guild.members.fetch(ctx.user.id)
        if (member === undefined) {
            embed.setColor(0xff5349)
                .setTitle(':x: Oops! Error D;')
                .setDescription('You are not a member of the Wynntils Discord server. Here is an invite: https://discord.gg/SZuNem8.')

            return { embeds: [embed.toJSON()], ephemeral: true }
        }

        const role = ctx.options.role.toString()
        if (!member.roles.cache.has(role)) {
            try {
                await member.roles.add(role)
            } catch (err) {
                logError(err)
                embed.setColor(0xff5349)
                    .setTitle(':x: Oops! Error D;')
                    .setDescription('Ran into an error while applying the role to you.')

                return { embeds: [embed.toJSON()], ephemeral: true }
            }
            embed.setColor(0x72ed9e)
                .setTitle('Success!')
                .setDescription('Succesfully given you the role.')

            return { embeds: [embed.toJSON()], ephemeral: true }
        }

        try {
            await member.roles.remove(role)
        } catch (err) {
            logError(err)
            embed.setColor(0xff5349)
                .setTitle(':x: Oops! Error D;')
                .setDescription('Ran into an error while removing the role from you.')

            return { embeds: [embed.toJSON()], ephemeral: true }
        }
        embed.setColor(0x72ed9e)
            .setTitle('Success!')
            .setDescription('Succesfully removed the role from you.')

        return { embeds: [embed.toJSON()], ephemeral: true }
    }
}
