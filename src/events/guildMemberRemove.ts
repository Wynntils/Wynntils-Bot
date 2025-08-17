import { GuildMember, TextChannel } from 'discord.js'
import { logError, styledEmbed } from '../utils/functions'
import { Colors } from '../constants/Colors'

export const action = async (member: GuildMember): Promise<void> => {

    const serverLogChannel = member.guild.channels.cache.find(c => c.name === 'server-logs') as TextChannel
    try {
        const embed = styledEmbed()
            .setColor(Colors.BLUE)
            .setTitle('Leave notification')
            .setThumbnail(member.user.avatarURL())
            .setDescription(`<@${member.user.id}> (\`${member.displayName}#${member.user.discriminator}\`) has left the server!`)
            .addFields(
                { name: 'Creation date', value: `${member.user.createdAt}\n<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>` }
            )

        serverLogChannel.send({ embeds: [embed.toJSON()] })
    } catch (err) {
        logError(err)
    }


}

