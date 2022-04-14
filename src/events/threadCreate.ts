import { TextChannel, ThreadChannel } from 'discord.js'
import { Colors } from '../constants/Colors'
import { logError, styledEmbed } from '../utils/functions'

export const action = async (thread: ThreadChannel): Promise<void> => {
    try {
        const serverLogChannel = thread.guild.channels.cache.find(
            c => c.name === 'server-logs'
        ) as TextChannel
        const embed = styledEmbed()
            .setColor(Colors.GREEN)
            .setTitle('Wynntils thread logging')
            .setDescription('A thread has been created.')
            .addFields([
                {
                    name: 'Thread',
                    value: `<#${thread.id}>`,
                    inline: true
                },
                {
                    name: 'Owner',
                    value: `<@${thread.ownerId}>`,
                    inline: true
                },
                {
                    name: 'Creation Date',
                    value: `<t:${Math.floor(
                        thread.createdTimestamp / 1000
                    )}:R>`,
                    inline: true
                }
            ])

        thread.join()
        if (serverLogChannel) serverLogChannel.send({ embeds: [embed.toJSON()] })
    } catch (err) {
        logError(err)
    }
}
