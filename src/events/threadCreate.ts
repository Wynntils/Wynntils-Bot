import { TextChannel, ThreadChannel } from 'discord.js'
import { logError, styledEmbed } from '../utils/functions'

export const action = async (thread: ThreadChannel): Promise<void> => {
    try {
        const logChannel = thread.guild.channels.cache.find(
            c => c.name === 'server-logs'
        ) as TextChannel
        const embed = styledEmbed()
            .setColor(0x72ed9e)
            .setTitle('Thread Notification')
            .setDescription('A thread has been created.')
            .addFields([
                {
                    name: 'Name',
                    value: thread.name,
                    inline: false
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
        if (logChannel) logChannel.send({ embeds: [embed.toJSON()] })
    } catch (err) {
        logError(err)
    }
}
