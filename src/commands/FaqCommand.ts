import { CommandContext, CommandOptionType, MessageOptions, SlashCommand, SlashCreator } from 'slash-create'
import { client } from '..'
import { faqService } from '../services/FaqService'
import { styledEmbed } from '../utils/functions'

export class FaqCommand extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: 'faq',
            description: 'Provides information on frequently asked question',
            options: [
                {
                    name: 'value',
                    description: 'Name of FAQ entry',
                    type: CommandOptionType.STRING,
                    required: true,
                    choices: Array.from(faqService.cache.keys()).map(k => {
                        return { name: k, value: k }
                    })
                }
            ]
        })

        this.filePath = __filename
    }

    async run(ctx: CommandContext): Promise<MessageOptions> {
        const faq = (await faqService.get()).get(ctx.options.value.toString())

        const embed = styledEmbed()
            .setFooter({ text: `By: ${ctx.user.username}#${ctx.user.discriminator} - Please read #faq` })

        if (faq) {
            embed.setColor(0x72ed9e)
                .setAuthor({ name: 'Wynntils FAQ', iconURL: client.user?.avatarURL() ?? client.user?.defaultAvatarURL })
                .addField(faq.title, faq.value)

            return { embeds: [embed.toJSON()] }
        }

        embed.setColor(0xff5349)
            .setTitle(':x: Invalid Entry')
            .setDescription(`Unable to find entry for ${ctx.options.value.toString()}.`)

        return { embeds: [embed.toJSON()], ephemeral: true }
    }
}
