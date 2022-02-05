import fetch from 'node-fetch'
import { CommandContext, CommandOptionType, MessageOptions, SlashCommand, SlashCreator } from 'slash-create'
import { Staff } from '../constants/Role'
import { UserInfo } from '../interfaces/api/athena/UserInfo'
import { logError, styledEmbed } from '../utils/functions'

export class InfoCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'info',
            description: 'Returns user info',
            options: [
                {
                    name: 'user',
                    description: 'MC username or UUID',
                    type: CommandOptionType.STRING,
                    required: true
                }
            ]
        })

        this.filePath = __filename
    }

    hasPermission(ctx: CommandContext): boolean | string {
        const { member } = ctx
        if (!member)
            return 'This command doesn\'t work in DMs'

        return Staff.some(r => member.roles.includes(r))
    }

    async run(ctx: CommandContext): Promise<MessageOptions> {
        const embed = styledEmbed()

        let data
        let response

        try {
            response = await fetch('https://athena.wynntils.com/api/getUser/' + process.env.ATHENA_API_KEY, {
                method: 'POST',
                body: JSON.stringify({ user: ctx.options.user.toString() })
            })
            data = await response.json()
        } catch (err) {
            logError(err)
            embed.setColor(0xff5349)
                .setTitle(':x: Oops! Error D;')
                .setDescription('Something went wrong when fetching the user info.')

            return { embeds: [embed.toJSON()], ephemeral: true }
        }

        if (response.ok) {
            const userInfo = data.result as UserInfo

            embed.setAuthor(userInfo.username, `https://minotar.net/helm/${userInfo.uuid}/100.png`)
            embed.setColor(0x72ed9e)
            embed.addFields(
                {
                    name: 'UUID',
                    value: userInfo.uuid,
                    inline: true
                },
                {
                    name: 'Account Type',
                    value: userInfo.accountType,
                    inline: true
                },
                {
                    name: 'Latest Version',
                    value: userInfo.versions.latest,
                    inline: true
                },
                {
                    name: 'Last Online',
                    value: (new Date(Math.max(...Object.keys(userInfo.versions.used).map(k => userInfo.versions.used[k])))).toDateString(),
                    inline: true
                },
                {
                    name: 'Cape',
                    value: !userInfo.cosmetics.isElytra ? 'true' : 'false',
                    inline: true
                },
                {
                    name: 'Ears',
                    value: userInfo.cosmetics.parts.ears ? 'true' : 'false',
                    inline: true
                },
                {
                    name: 'Elytra',
                    value: userInfo.cosmetics.isElytra ? 'true' : 'false',
                    inline: true
                }
            )

            return { embeds: [embed.toJSON()] }
        }

        embed.setColor(0xff5349)
            .setTitle(':x: Oops! Error D;')
            .setDescription(data.message)

        return { embeds: [embed.toJSON()], ephemeral: true }
    }
}
