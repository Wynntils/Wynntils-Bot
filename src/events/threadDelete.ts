import { TextChannel, ThreadChannel } from 'discord.js'
import { Colors } from '../constants/Colors'
import { logError, styledEmbed } from '../utils/functions'

export const action = async (thread: ThreadChannel) => {
    try {
        const serverLogChannel = thread.guild.channels.cache.find(
            c => c.name === 'server-logs'
        ) as TextChannel
        const embed = styledEmbed()
            .setTitle('Wynntils thread logging')
            .setColor(Colors.RED)
            .setDescription('A thread has been closed')
            .addFields([
                {
                    name: 'Thread',
                    value: thread.name,
                    inline: true
                },
                {
                    name: 'Owner',
                    value: `<@${thread.ownerId}>`,
                    inline: true
                },
                {
                    name: 'Closed at',
                    value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
                    inline: true
                }
            ])

        if (serverLogChannel) serverLogChannel.send({ embeds: [embed.toJSON()] })
    } catch (err) {
        logError(err)
    }
}
