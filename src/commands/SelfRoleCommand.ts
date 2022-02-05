import { CommandContext, CommandOptionType, MessageOptions, SlashCreator } from 'slash-create'
import { client } from '..'
import { logError, styledEmbed } from '../utils/functions'
import WynntilsBaseCommand from '../classes/WynntilsCommand'

export class SelfRoleCommand extends WynntilsBaseCommand {
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
                            name: 'Development Updates',
                            value: 'Development Updates'
                        },
                    ]
                }
            ]
        })

        this.filePath = __filename
    }

    async run(ctx: CommandContext): Promise<MessageOptions> {
        const embed = styledEmbed()

        const guild = await client.guilds.fetch(ctx.guildID!)
        const member = await guild.members.fetch(ctx.user.id)

        const role = guild.roles.cache.find(r => r.name === ctx.options.role.toString())
        if (!role) {
            embed.setColor(0xff5349)
                .setTitle(':x: Oops! Error D;')
                .setDescription(`Role \`${ctx.options.role}\` not found in server.`)

            return { embeds: [embed.toJSON()], ephemeral: true }
        }

        if (!member.roles.cache.has(role.id)) {
            try {
                await member.roles.add(role)

                embed.setColor(0x72ed9e)
                    .setTitle('Success!')
                    .setDescription('Succesfully given you the role.')
            } catch (err) {
                logError(err)
                embed.setColor(0xff5349)
                    .setTitle(':x: Oops! Error D;')
                    .setDescription('Ran into an error while applying the role to you.')

                return { embeds: [embed.toJSON()], ephemeral: true }
            }

        } else {
            try {
                await member.roles.remove(role)

                embed.setColor(0x72ed9e)
                    .setTitle('Success!')
                    .setDescription('Succesfully removed the role from you.')
            } catch (err) {
                logError(err)
                embed.setColor(0xff5349)
                    .setTitle(':x: Oops! Error D;')
                    .setDescription('Ran into an error while removing the role from you.')
            }
        }

        return { embeds: [embed.toJSON()], ephemeral: true }
    }
}
