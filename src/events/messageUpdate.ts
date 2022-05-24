import { Message, TextChannel } from 'discord.js'
import { logError, styledEmbed } from '../utils/functions'
import { Colors } from '../constants/Colors'
import { client } from '../index'

export const action = async (oldMessage: Message, newMessage: Message): Promise<void> => {

    if (oldMessage.author.id === client.user.id)
        return

    if (oldMessage.hasThread || newMessage.hasThread)
        return

    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const serverLogChannel = oldMessage.guild.channels.cache.find(
            c => c.name === 'server-logs'
        ) as TextChannel

        const embed = styledEmbed()
            .setColor(Colors.YELLOW)
            .setAuthor({
                name: `${oldMessage.author.username}#${oldMessage.author.discriminator} (${oldMessage.author.id})`,
                iconURL: oldMessage.author.avatarURL()
            })
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

        if (serverLogChannel)
            serverLogChannel.send({ embeds: [embed.toJSON()] })

    } catch (err) {
        logError(err)
    }

}
