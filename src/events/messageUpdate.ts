import { Message, TextChannel } from 'discord.js'
import { logError, styledEmbed } from '../utils/functions'
import { Colors } from '../constants/Colors'

export const action = async (oldMessage: Message, newMessage: Message): Promise<void> => {
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const logChannel = oldMessage.guild.channels.cache.find(
            c => c.name === 'server-logs'
        ) as TextChannel

        const embed = styledEmbed()
            .setColor(Colors.YELLOW)
            .setAuthor({ name: `${oldMessage.author.username}#${oldMessage.author.discriminator} (${oldMessage.author.id})`, iconURL: oldMessage.author.avatarURL() })
            .setDescription(`Message ${oldMessage.id} edited in <#${oldMessage.channel.id}>`)
            .addFields([
                {
                    name: 'Before',
                    value: `\`\`\`${oldMessage.cleanContent}\`\`\``
                },
                {
                    name: 'After',
                    value: `\`\`\`${newMessage.cleanContent}\`\`\``
                }
            ])
            .setTimestamp()

        if (logChannel)
            logChannel.send({ embeds: [embed.toJSON()] })

    } catch (err) {
        logError(err)
    }

}
