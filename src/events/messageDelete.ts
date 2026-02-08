import { ChannelType, GuildBasedChannel, Message, PartialMessage, TextChannel } from 'discord.js'
import { logError, styledEmbed } from '../utils/functions'
import { Colors } from '../constants/Colors'
import { client } from '../index'

const safeCodeBlock = (content: string): string => {
    const escapedFences = content
        .replace(/\r\n/g, '\n')
        .replace(/`{3,}/g, (ticks) => `${ticks.slice(0, ticks.length - 1)}\u200b\``)
    const normalized = escapedFences.trim()
    if (!normalized) return '_No content_'
    const maxRawLen = 1010
    const truncated = normalized.length > maxRawLen ? `${normalized.slice(0, maxRawLen - 1)}…` : normalized
    return `\`\`\`\n${truncated}\n\`\`\``
}

export const action = async (message: Message | PartialMessage): Promise<void> => {
    try {
        if (message.partial) await message.fetch().catch(() => null)
        const guild = message.guild ?? (message.guildId ? client.guilds.cache.get(message.guildId) : null)
        if (!guild) return

        const serverLogChannel = guild.channels.cache.find(
            (c: GuildBasedChannel): c is TextChannel =>
                c.type === ChannelType.GuildText && c.name === 'server-logs'
        )
        if (!serverLogChannel) return

        const authorName = message.author
            ? `${message.author.username} (${message.author.id})`
            : 'Unknown author'
        const authorIcon = message.author?.displayAvatarURL() ?? undefined
        const content = safeCodeBlock(message.cleanContent || message.content || '')
        const embed = styledEmbed()
            .setColor(Colors.RED)
            .setAuthor({
                name: authorName,
                iconURL: authorIcon
            })
            .setDescription(`Message ${message.id} deleted from <#${message.channelId}>`)
            .addFields(
                { name: 'Content', value: content }
            )
            .setTimestamp()

        await serverLogChannel.send({ embeds: [embed] })

    } catch (err) {
        logError(err)
    }

}
