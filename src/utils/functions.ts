import { GuildBasedChannel, MessageEmbed, TextChannel } from 'discord.js'
import { client } from '../index'
import consola from 'consola'

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

        const embed = styledEmbed().setColor('RED').setTitle('An error occurred with the bot').setDescription(error.message + '```' + error.stack + '```')

        await channel.send({ embeds: [embed] }).catch(consola.error)
    }

}
