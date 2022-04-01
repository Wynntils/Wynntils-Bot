import fetch from 'node-fetch'
import { CommandContext, CommandOptionType, MessageOptions, SlashCreator } from 'slash-create'
import { Staff } from '../constants/Role'
import { UserInfo } from '../interfaces/api/athena/UserInfo'
import { logError, styledEmbed } from '../utils/functions'
import WynntilsBaseCommand from '../classes/WynntilsCommand'
import { Colors } from '../constants/Colors'

export class InfoCommand extends WynntilsBaseCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'info',
            description: 'Returns user info',
            roles: Staff,
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

    async run(ctx: CommandContext): Promise<MessageOptions> {
        const embed = styledEmbed()

        let data
        let response

        try {
            response = await fetch('https://athena.wynntils.com/api/getUser/' + process.env.ATHENA_API_KEY, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: ctx.options.user.toString() })
            })
            data = await response.json()
        } catch (err: any) {
            logError(err)
            embed.setColor(Colors.RED)
                .setTitle(':x: Oops! Error D;')
                .setDescription('Something went wrong when fetching the user info.')

            return { embeds: [embed.toJSON()], ephemeral: true }
        }

        if (!response.ok) {
            embed.setColor(0xff5349)
                .setTitle(':x: Oops! Error D;')
                .setDescription(data.message)
            return { embeds: [embed.toJSON()], ephemeral: true }
        }

        const userInfo = data.result as UserInfo

        const cosmeticInfo = `\`\`\`
Cape:   ${!userInfo.cosmetics.isElytra ? '🟩 Enabled' : '🟥 Disabled'}
Elytra: ${userInfo.cosmetics.isElytra ? '🟩 Enabled' : '🟥 Disabled'}
Ears:   ${userInfo.cosmetics.parts.ears ? '🟩 Enabled' : '🟥 Disabled'}\`\`\`
            `

        const timestamp = Math.max(...Object.keys(userInfo.versions.used).map(k => userInfo.versions.used[k]))
        const lastActive = Math.floor(timestamp / 1000)

        embed.setTitle(`${userInfo.username}'s Info`)
        embed.setColor(Colors.GREEN)
        embed.setThumbnail(`https://minotar.net/helm/${userInfo.uuid}/100.png`)
        embed.setDescription(userInfo.uuid)
        embed.addFields(
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
                value: `<t:${lastActive}:R>`,
                inline: true
            },
            {
                name: 'Discord',
                value: userInfo.discord.id ? `<@${userInfo.discord.id}>` : 'Not linked',
                inline: false
            },
            {
                name: 'Cosmetics',
                value: cosmeticInfo,
                inline: false
            },
        )

            return { embeds: [embed.toJSON()] }
        return { embeds: [embed.toJSON()] }

        embed.setColor(Colors.RED)
            .setTitle(':x: Oops! Error D;')
            .setDescription(data.message)

        return { embeds: [embed.toJSON()], ephemeral: true }
    }
}
