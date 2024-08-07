import { Message, TextChannel } from 'discord.js'
import { logError, styledEmbed } from '../utils/functions'
import { Colors } from '../constants/Colors'

export const action = async (message: Message): Promise<void> => {
    try {
        const serverLogChannel = message.guild.channels.cache.find(
            c => c.name === 'server-logs'
        ) as TextChannel


        //TODO: Find reason why author is sometimes null
        const embed = styledEmbed()
            .setColor(Colors.RED)
            .setAuthor({
                name: `${message.author.username}#${message.author.discriminator} (${message.author.id})`,
                iconURL: message.author.avatarURL()
            })
            .setDescription(`Message ${message.id} deleted from <#${message.channel.id}>`)
            .addField('Content', `\`\`\`${message.cleanContent}\`\`\``)
            .setTimestamp()

        if (serverLogChannel) serverLogChannel.send({ embeds: [embed.toJSON()] })

    } catch (err) {
        logError(err)
    }

}
