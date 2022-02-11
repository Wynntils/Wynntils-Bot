import { GuildBasedChannel, MessageEmbed, MessageOptions, MessagePayload, TextChannel } from 'discord.js'
import { client } from '../index'
import consola from 'consola'
import { Colors } from '../constants/Colors'
import { DMOptions } from '../constants/types/DMOptions'

export const styledEmbed: () => MessageEmbed = () => {
    return new MessageEmbed()
        .setFooter({ text: client.user?.username ?? 'Wynntils', iconURL: (client.user?.avatarURL() ?? client.user?.defaultAvatarURL) })
        .setTimestamp(Date.now())
}

export const logError: (error: Error) => void = async (error: Error) => {
    consola.error(error)

    for (const guild of client.guilds.cache) {
        const channel = guild[1].channels.cache.find((c: GuildBasedChannel) => c.name === 'console-log') as TextChannel

        if (!channel)
            continue

        const embed = styledEmbed().setColor(Colors.RED).setTitle('An error occurred with the bot').setDescription(error.message + '```' + error.stack + '```')

        await channel.send({ embeds: [embed] }).catch(consola.error)
    }

}

export const dmUser: ({ userId, content, embed }: DMOptions) => void = async ({ userId, content, embed }:  DMOptions) => {
    const user = await client.users.cache.find(u => u.id === userId)
    if (user) {
        try {
            const dm = await user.createDM()
            const options: string | MessagePayload | MessageOptions = {
                content: content ?? undefined,
                embeds: embed ? [embed.toJSON()] : undefined
            }
            await dm.send(options)
        } catch (e) {
            logError(e)
        }
    }
}


export const logPunishment: (embed: MessageEmbed) => void = async (embed: MessageEmbed) => {
    for (const guild of client.guilds.cache) {
        const channel = guild[1].channels.cache.find((c: GuildBasedChannel) => c.name === 'server-logs') as TextChannel

        if (!channel)
            continue

        await channel.send({ embeds: [embed] }).catch(consola.error)
    }
}
