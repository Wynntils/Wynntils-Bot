import fetch from 'node-fetch'
import { CommandContext, CommandOptionType, MessageOptions, SlashCreator } from 'slash-create'
import { Staff } from '../constants/Role'
import { configService } from '../services/ConfigService'
import { logError, styledEmbed } from '../utils/functions'
import WynntilsBaseCommand from '../classes/WynntilsCommand'
import { Colors } from '../constants/Colors'

export class ConfigCommand extends WynntilsBaseCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'config',
            description: 'Retrieves configs for a given user',
            roles: Staff,
            options: [
                {
                    name: 'user',
                    description: 'MC username or UUID',
                    type: CommandOptionType.STRING,
                    required: true
                },
                {
                    name: 'filename',
                    description: 'Config filename',
                    type: CommandOptionType.STRING,
                    required: false,
                },
                {
                    name: 'part',
                    description: 'Part of config per 1800 characters',
                    type: CommandOptionType.INTEGER,
                    required: false
                }
            ]
        })

        this.filePath = __filename
    }

    async run(ctx: CommandContext): Promise<MessageOptions> {
        const embed = styledEmbed()

        if (ctx.options.filename) {
            const configFiles = await configService.get()
            if (!configFiles.includes(ctx.options.filename.toString())) {
                embed.setColor(Colors.RED)
                    .setTitle(':x: Invalid Config Name - Available Configs')
                    .setDescription(`\`${configFiles.join('`\n`')}\``)
                return { embeds: [embed.toJSON()] }
            }

            let response
            let data

            try {
                response = await fetch('https://athena.wynntils.com/api/getUserConfig/' + process.env.ATHENA_API_KEY, {
                    method: 'POST',
                    body: JSON.stringify({
                        user: ctx.options.user,
                        configName: ctx.options.filename
                    })
                })
                data = await response.json()
            } catch (err) {
                logError(err)
                embed.setColor(Colors.RED)
                    .setTitle(':x: Oops! Error D;')
                    .setDescription('Something went wrong when fetching the user\'s config.')

                return { embeds: [embed.toJSON()], ephemeral: true }
            }

            if (response.ok) {
                const configString = JSON.stringify(data.result, null, 2)
                const part = ctx.options.part ? Number.parseInt(ctx.options.part.toString()) : 1
                const totalParts = Math.ceil(configString.length / 1800)

                if (part > totalParts) {
                    embed.setColor(Colors.RED)
                        .setTitle(':octagonal_sign: End of Config')
                        .setDescription(`This config file does not have more than ${totalParts} parts.`)

                    return { embeds: [embed.toJSON()], ephemeral: true }
                }

                embed.setColor(Colors.GREEN)
                    .setTitle(`${ctx.options.user.toString()} - ${ctx.options.filename} - (${part}/${totalParts})`)
                    .setDescription(`\`\`\`json\n${configString.substr((part - 1) * 1800, 1800)}\n\`\`\``)

                return { embeds: [embed.toJSON()] }
            }

            embed.setColor(Colors.RED)
                .setTitle(':x: Oops! Error D;')
                .setDescription( data.message)

            return { embeds: [embed.toJSON()], ephemeral: true }
        }

        const configFiles = await configService.get()
        embed.setColor(Colors.GREEN)
            .setTitle('Available Configs')
            .setDescription(`\`${configFiles.join('`\n`')}\``)

        return { embeds: [embed.toJSON()] }
    }
}
