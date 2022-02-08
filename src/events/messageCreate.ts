import { Message } from 'discord.js'
import { Channel } from '../constants/Channel'
import { Emoji } from '../constants/Emoji'
import { stopIllegalModRepostsService } from '../services/StopIllegalModRepostsService'
import { logError, styledEmbed } from '../utils/functions'

export const action = async (message: Message): Promise<void> => {
    if (message.partial)
        return

    // Check for illegal mod sites
    stopIllegalModRepostsService.hasIllegalModRepostSite(message.content).then((site) => {
        if (site) {
            message.delete().catch(logError)
            const embed = styledEmbed()
                .setTitle(':warning: Illegal Mod Website Detected :warning:')
                .setColor(7531934)
                .setDescription(`A message by ${message.author.username} has been deleted as it has been found to link a malicious Minecraft mod repost site.`)
                .addField('Categorized Offense Severities', `**Advertising**: ${site.advertising}\n**Redistribution**: ${site.redistribution}\n**Miscellaneous**: ${site.miscellaneous}` + (site.notes ? `\n**Notes**: ${site.notes}` : ''))
                .setFooter({ text: 'Find out more at https://stopmodreposts.org' })
            message.channel.send({ embeds: [embed] })
        }
    })

    // Add arrows to suggestions
    if (message.channel.id === Channel.Suggestions)
        message.react(Emoji.ARROW_UP).then(() => message.react(Emoji.ARROW_DOWN).catch(logError)).catch(logError)

}
