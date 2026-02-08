import { ChannelType, GuildBasedChannel, Message, PartialMessage, TextChannel } from 'discord.js'
import { logError, styledEmbed } from '../utils/functions'
import { Colors } from '../constants/Colors'
import { client } from '../index'

const safeCodeBlock = (content: string): string => {
    const escapedFences = content
        .replace(/\r\n/g, '\n')
        .replace(/`{3,}/g, (ticks) => `${ticks.slice(0, ticks.length - 1)}\u200b\``)
    const normalized = escapedFences.trim()
    if (!normalized) return '_No content available (missing Message Content intent or uncached message)._'
    const maxRawLen = 1010
    const truncated = normalized.length > maxRawLen ? `${normalized.slice(0, maxRawLen - 1)}…` : normalized
    return `\`\`\`\n${truncated}\n\`\`\``
}

export const action = async (
    oldMessage: Message | PartialMessage,
    newMessage: Message | PartialMessage
): Promise<void> => {
    try {
        if (oldMessage.partial) await oldMessage.fetch().catch(() => null)
        if (newMessage.partial) await newMessage.fetch().catch(() => null)
        const guild =
            oldMessage.guild ??
            newMessage.guild ??
            (oldMessage.guildId ? client.guilds.cache.get(oldMessage.guildId) : null) ??
            (newMessage.guildId ? client.guilds.cache.get(newMessage.guildId) : null)
        if (!guild) return
        const author = oldMessage.author ?? newMessage.author
        if (author?.id === client.user?.id) return
        if (oldMessage.hasThread || newMessage.hasThread) return

        const oldCleanContent = oldMessage.cleanContent || oldMessage.content || ''
        const newCleanContent = newMessage.cleanContent || newMessage.content || ''
        const contentChanged = oldCleanContent !== newCleanContent
        const attachmentsChanged = oldMessage.attachments.size !== newMessage.attachments.size
        if (!contentChanged && !attachmentsChanged) return

        const serverLogChannel = guild.channels.cache.find(
            (c: GuildBasedChannel): c is TextChannel =>
                c.type === ChannelType.GuildText && c.name === 'server-logs'
        )
        if (!serverLogChannel) return

        const authorName = author
            ? `${author.username} (${author.id})`
            : 'Unknown author'
        const authorIcon = author?.displayAvatarURL() ?? undefined
        const channelId = oldMessage.channelId || newMessage.channelId
        const embed = styledEmbed()
            .setColor(Colors.YELLOW)
            .setAuthor({
                name: authorName,
                iconURL: authorIcon
            })
            .setDescription(`Message ${oldMessage.id} edited in <#${channelId}>`)
            .addFields([
                {
                    name: 'Before',
                    value: safeCodeBlock(oldCleanContent)
                },
                {
                    name: 'After',
                    value: safeCodeBlock(newCleanContent)
                },
                {
                    name: 'Attachments',
                    value: `${oldMessage.attachments.size} -> ${newMessage.attachments.size}`
                }
            ])
            .setTimestamp()

        await serverLogChannel.send({ embeds: [embed] })

    } catch (err) {
        logError(err)
    }

}
